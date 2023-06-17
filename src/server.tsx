import path from 'path';

import { runServer } from 'dk-bff-server';

import { env } from '../env';
import { paths } from '../paths';

import { isomorphPolyfills } from './utils/isomorphPolyfills';

process.title = 'node: bff-server';

isomorphPolyfills();

const self = `'self'`;
const unsafeEval = `'unsafe-eval'`;
const unsafeInline = `'unsafe-inline'`;

void runServer({
  port: env.EXPRESS_PORT,
  https: env.HTTPS_BY_NODE,
  templatePath: path.resolve(paths.build, 'template.html'),
  staticFilesPath: paths.build,
  versionIdentifier: env.GIT_COMMIT,
  compressedFilesGenerated: env.GENERATE_COMPRESSED,
  templateModifier: ({ template, req }) => {
    const hotReloadUrl = `${env.HTTPS_BY_NODE ? 'https' : 'http'}://${req.headers.host}:${
      env.HOT_RELOAD_PORT
    }`;

    return Promise.resolve(
      template.replace(
        '<!-- HOT_RELOAD -->',
        env.HOT_RELOAD ? `<script src="${hotReloadUrl}"></script>` : ''
      )
    );
  },

  /**
   * @docs: https://github.com/helmetjs/helmet
   * @docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   */

  helmetOptions: {
    crossOriginOpenerPolicy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [self],
        childSrc: [self],
        styleSrc: [self, unsafeInline],
        scriptSrc: [
          self,
          unsafeEval,
          unsafeInline,
          env.HOT_RELOAD ? `localhost:${env.HOT_RELOAD_PORT}` : '',
        ],
        fontSrc: [self],
        connectSrc: [self, 'ws:', 'wss:', 'https://mocki.io'],
        imgSrc: [self, `data:`, `blob:`],
        frameSrc: [self],
        mediaSrc: [self],
        workerSrc: [self, 'blob:'],
        formAction: [],
      },
      reportOnly: false,
    },
  },
});
