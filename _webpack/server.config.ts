import path from 'path';
import fs from 'fs';

import { createServerConfig } from 'dk-webpack-config';

import { paths } from '../paths';
import { env } from '../env';

process.title = 'node: Webpack [server] compiler';

let generationFinished = true;

process.on('message', (msg) => {
  if (msg === 'GENERATION_FINISHED') generationFinished = true;
});

// eslint-disable-next-line import/no-default-export,import/no-unused-modules
export default createServerConfig({
  copyFilesConfig: [],
  ssr: env.SSR_ENABLED,
  entry: { server: path.resolve(paths.source, 'server.tsx') },
  alias: { env: paths.env, paths: paths.paths },
  minify: env.MINIMIZE_SERVER,
  devTool: env.DEV_TOOL_SERVER,
  nodeEnv: env.NODE_ENV,
  modules: [paths.nodeModules, paths.source],
  gitCommit: env.GIT_COMMIT,
  hotReload: { enabled: env.HOT_RELOAD, aggregationTimeout: 10 },
  buildFolder: paths.build,
  sassExclude: [paths.themes, path.resolve(paths.styles, 'global.scss')],
  speedMeasure: env.BUILD_MEASURE_SERVER,
  filenameHash: env.FILENAME_HASH,
  browserslist: JSON.parse(fs.readFileSync(paths.package, 'utf-8')).browserslist,
  templatePath: path.resolve(paths.source, 'templates/template.html'),
  circularCheck: env.CIRCULAR_CHECK,
  compressFiles: env.GENERATE_COMPRESSED,
  bundleAnalyzer: { port: env.BUNDLE_ANALYZER_PORT + 1, enabled: env.BUNDLE_ANALYZER },
  webpCompression: env.IMAGE_COMPRESSION,
  sassImportPaths: [paths.styles],
  includePolyfills: false,
  nodeExternalsParams: { allowlist: ['dom7', 'swiper', 'swiper/react', 'ssr-window'] },
  sassIncludeGlobal: [],
  rebuildCondition: () => {
    if (generationFinished) {
      generationFinished = false;

      return true;
    }

    return false;
  },
});
