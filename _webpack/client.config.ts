import path from 'path';
import fs from 'fs';

import _pick from 'lodash/pick';
import chalk from 'chalk';
import { createClientConfig } from 'dk-webpack-config';

import { paths } from '../paths';
import { env, allowedClientKeys } from '../env';

const copyFilesConfig = [
  {
    from: path.resolve(paths.source, 'templates/favicon16.png'),
    to: path.resolve(paths.build, 'favicon16.png'),
  },
];

process.title = 'node: Webpack [client] compiler';

let generationFinished = true;

process.on('message', (msg) => {
  if (msg === 'GENERATION_FINISHED') generationFinished = true;
});

// eslint-disable-next-line import/no-default-export,import/no-unused-modules
export default createClientConfig({
  copyFilesConfig,
  ssr: env.SSR_ENABLED,
  alias: { env: paths.env, paths: paths.paths },
  entry: { client: path.resolve(paths.source, 'client.tsx') },
  minify: env.MINIMIZE_CLIENT,
  devTool: env.DEV_TOOL,
  nodeEnv: env.NODE_ENV,
  modules: [paths.nodeModules, paths.source],
  gitCommit: env.GIT_COMMIT,
  hotReload: { enabled: env.HOT_RELOAD, aggregationTimeout: 10 },
  buildFolder: paths.build,
  sassExclude: [paths.themes, path.resolve(paths.styles, 'global.scss')],
  speedMeasure: env.BUILD_MEASURE,
  templatePath: path.resolve(paths.source, 'templates/template.html'),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  defineParams: { 'process.env': _pick(env, allowedClientKeys) },
  browserslist: JSON.parse(fs.readFileSync(paths.package, 'utf-8')).browserslist,
  filenameHash: env.FILENAME_HASH,
  circularCheck: env.CIRCULAR_CHECK,
  compressFiles: env.GENERATE_COMPRESSED,
  bundleAnalyzer: { port: env.BUNDLE_ANALYZER_PORT, enabled: env.BUNDLE_ANALYZER },
  webpCompression: env.IMAGE_COMPRESSION,
  sassImportPaths: [paths.styles],
  includePolyfills: env.POLYFILLING,
  sassIncludeGlobal: [path.resolve(paths.styles, 'global.scss')],
  rebuildCondition: (changes, removals) => {
    if (generationFinished) {
      generationFinished = false;

      if (env.LOGS_WATCHED_FILES) {
        changes?.forEach((change) => {
          // eslint-disable-next-line no-console
          console.log(`${chalk.green('[CAWP]')} ${chalk.blue('[change]')}:`, change);
        });

        removals?.forEach((removal) => {
          // eslint-disable-next-line no-console
          console.log(`${chalk.green('[CAWP]')} ${chalk.blue('[removal]')}:`, removal);
        });
      }

      return true;
    }

    return false;
  },
});
