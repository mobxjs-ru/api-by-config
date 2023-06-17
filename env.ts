import _pick from 'lodash/pick';

// Webpack does not provide types for this, says just 'string'
type TypeDevtool =
  | 'eval'
  | 'eval-cheap-source-map'
  | 'eval-cheap-module-source-map'
  | 'eval-source-map'
  | 'eval-nosources-source-map'
  | 'eval-nosources-cheap-source-map'
  | 'eval-nosources-cheap-module-source-map'
  | 'cheap-source-map'
  | 'cheap-module-source-map'
  | 'inline-cheap-source-map'
  | 'inline-cheap-module-source-map'
  | 'inline-source-map'
  | 'inline-nosources-source-map'
  | 'inline-nosources-cheap-source-map'
  | 'inline-nosources-cheap-module-source-map'
  | 'source-map'
  | 'hidden-source-map'
  | 'hidden-nosources-source-map'
  | 'hidden-nosources-cheap-source-map'
  | 'hidden-nosources-cheap-module-source-map'
  | 'hidden-cheap-source-map'
  | 'hidden-cheap-module-source-map'
  | 'nosources-source-map'
  | 'nosources-cheap-source-map'
  | 'nosources-cheap-module-source-map';

class Env {
  constructor(params: Record<keyof Env, unknown>) {
    Object.entries(params).forEach(([envKey, envValue]) => {
      // @ts-ignore
      const paramType = typeof this[envKey];

      if (paramType === 'boolean') {
        // @ts-ignore
        this[envKey] = envValue === true || envValue === 'true';
      } else if (paramType === 'string') {
        // @ts-ignore
        this[envKey] = (envValue || '').replace(/"/g, '').trim();
      } else if (paramType === 'number') {
        // @ts-ignore
        this[envKey] = Number(envValue || 0);
      }
    });
  }

  GIT_COMMIT = '';
  HOT_RELOAD = false;
  HOT_RELOAD_PORT = 0;
  POLYFILLING = false;
  FILENAME_HASH = false;
  CIRCULAR_CHECK = false;
  BUNDLE_ANALYZER = false;
  MINIMIZE_CLIENT = false;
  MINIMIZE_SERVER = false;
  BUILD_MEASURE = false;
  BUILD_MEASURE_SERVER = false;
  IMAGE_COMPRESSION = 0;
  GENERATE_COMPRESSED = false;
  BUNDLE_ANALYZER_PORT = 0;
  START_SERVER_AFTER_BUILD = false;
  DEV_TOOL: TypeDevtool = 'eval-cheap-module-source-map';
  DEV_TOOL_SERVER: TypeDevtool = 'eval-cheap-module-source-map';
  GENERATOR_AGGREGATION_TIMEOUT = 0;
  RELOAD_BROWSER_AGGREGATION_TIMEOUT = 0;

  SSR_ENABLED = false;
  NODE_ENV: 'development' | 'production' = 'development';
  NODE_PATH = '';
  NODE_OPTIONS = '';
  EXPRESS_PORT = 0;
  HTTPS_BY_NODE = false;

  LOGS_WATCHED_FILES = false;
  LOGS_RELOAD_BROWSER = false;
  LOGS_GENERATION_DETAILS = false;
}

/**
 * Global environment params take precedence over .env file
 * for passing vars in Docker image or running in CI
 *
 */

export const allowedClientKeys: Array<keyof Env> = ['NODE_ENV', 'GIT_COMMIT'];

// eslint-disable-next-line no-process-env
const envInstance = new Env(process.env as unknown as Env);

export const env =
  typeof IS_CLIENT !== 'undefined' && IS_CLIENT
    ? // eslint-disable-next-line no-process-env
      _pick(envInstance, allowedClientKeys)
    : envInstance;
