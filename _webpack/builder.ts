import { ChildProcess } from 'child_process';
import path from 'path';

import betterSpawn from 'better-spawn';
import chalk from 'chalk';
import { run, TypeConfig } from 'dk-webpack-parallel-simple';
import { compareEnvFiles } from 'dk-compare-env';
import { generateFiles } from 'dk-file-generator';

import { env } from '../env';
import { paths } from '../paths';

import { generatorConfigs } from './generator.config';

process.title = 'node: Webpack builder';

/**
 * @docs: https://github.com/paulpflug/better-spawn
 * @docs: https://github.com/fgnass/node-dev
 *
 */

let childProcesses: Array<ChildProcess> = [];
let sgProcess: ReturnType<typeof betterSpawn>;
let serverProcess: ReturnType<typeof betterSpawn>;
let reloadServerProcess: ReturnType<typeof betterSpawn>;

function afterFirstBuild() {
  if (!env.START_SERVER_AFTER_BUILD && !env.HOT_RELOAD) {
    process.exit(0);

    return;
  }

  /**
   * Start server & proxy it's stdout/stderr to current console
   *
   */

  if (!env.START_SERVER_AFTER_BUILD) return;

  const SERVER_LOG_PREFIX = chalk.green('[server]');

  serverProcess = betterSpawn(
    'node-dev --no-warnings --notify=false -r dotenv/config ./build/server.js',
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );

  serverProcess.stdout?.on('data', (msg: Buffer) => {
    // eslint-disable-next-line no-console
    console.log(SERVER_LOG_PREFIX, msg.toString().trim());
  });
  serverProcess.stderr?.on('data', (msg: Buffer) =>
    console.error(SERVER_LOG_PREFIX, msg.toString().trim())
  );

  /**
   * Start watch server & proxy it's stdout/stderr to current console
   * Also start files regeneration on change
   *
   */

  if (!env.HOT_RELOAD) return;

  reloadServerProcess = betterSpawn(
    'node -r @swc-node/register -r dotenv/config ./src/watchServer.ts --color',
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );

  reloadServerProcess.stdout?.on('data', (msg: Buffer) =>
    // eslint-disable-next-line no-console
    console.log(msg.toString().trim())
  );
  reloadServerProcess.stderr?.on('data', (msg: Buffer) => console.error(msg.toString().trim()));
}

const parallelConfig: TypeConfig = {
  onInit(processes) {
    childProcesses = processes;
  },
  bailOnError: !env.HOT_RELOAD,
  configPaths: [
    path.resolve(__dirname, './client.config'),
    path.resolve(__dirname, './server.config'),
  ],
  afterFirstBuild,
};

Promise.resolve()
  .then(() =>
    compareEnvFiles({
      paths: [
        path.resolve(paths.root, '.env'),
        path.resolve(paths.root, 'example.dev.env'),
        path.resolve(paths.root, 'example.prod.env'),
      ],
      parsedEnvKeys: Object.keys(env),
    })
  )
  .then(() =>
    generateFiles({
      configs: generatorConfigs,
      timeLogs: env.LOGS_GENERATION_DETAILS,
      timeLogsOverall: true,
      fileModificationLogs: true,
      watch:
        env.START_SERVER_AFTER_BUILD && env.HOT_RELOAD
          ? {
              paths: [paths.source],
              changedFilesLogs: true,
              aggregationTimeout: env.GENERATOR_AGGREGATION_TIMEOUT,
              onFinish: () => {
                setTimeout(() => {
                  childProcesses.forEach((p) => p.send('GENERATION_FINISHED'));
                  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                }, 50);
              },
            }
          : undefined,
    })
  )
  .then(() => run(parallelConfig))
  .catch(console.error);

if (env.START_SERVER_AFTER_BUILD) {
  process.on('exit', () => {
    if (sgProcess) sgProcess.close();
    if (serverProcess) serverProcess.close();
    if (reloadServerProcess) reloadServerProcess.close();

    childProcesses.forEach((child) => {
      process.kill(child.pid!, 'SIGTERM');
    });
  });

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}
