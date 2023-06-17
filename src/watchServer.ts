import { run } from 'dk-reload-server';

import { env } from '../env';
import { paths } from '../paths';

process.title = 'node: reload-server';

run({
  port: env.HOT_RELOAD_PORT,
  https: env.HTTPS_BY_NODE,
  ignored: /server\.js/, // no reload when server build changed
  watchPaths: [paths.build],
  changedFilesLogs: env.LOGS_RELOAD_BROWSER,
  aggregationTimeout: env.RELOAD_BROWSER_AGGREGATION_TIMEOUT,
});
