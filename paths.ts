import path from 'path';

const root = __dirname;
const source = path.resolve(root, 'src');

export const paths = {
  root,
  source,
  env: path.resolve(root, 'env.ts'),
  build: path.resolve(root, 'build'),
  utils: path.resolve(source, 'utils'),
  paths: path.resolve(root, 'paths.ts'),
  styles: path.resolve(source, 'styles'),
  models: path.resolve(source, 'models'),
  themes: path.resolve(source, 'styles/themes.scss'),
  global: path.resolve(source, 'styles/global.scss'),
  package: path.resolve(root, 'package.json'),
  favicon: path.resolve(source, 'templates/favicon.png'),
  template: path.resolve(source, 'templates/closed.html'),
  validators: path.resolve(source, 'validators'),
  nodeModules: path.resolve(root, 'node_modules'),
  clientEntry: path.resolve(source, 'client.tsx'),
  serverEntry: path.resolve(root, 'server/server.ts'),
};
