import fs from 'fs';
import path from 'path';

import { TypeGenerateFilesParams } from 'dk-file-generator';

import { paths } from '../paths';

const { compilerOptions } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../tsconfig.json'), 'utf-8')
);

const headerTemplate = `/* eslint-disable */\n// This file is auto-generated\n\n`;
const reexportIncludeChildrenMask = /^((?!messages\.ts|\.scss).)*$/;

export const generatorConfigs: TypeGenerateFilesParams['configs'] = [
  {
    plugin: 'validators',
    config: [
      {
        folder: path.resolve(paths.source, 'api'),
        targetFolder: path.resolve(paths.validators, 'api'),
        triggerFolder: path.resolve(paths.source, 'models'),
        includeChildrenMask: /^((?!_).)*$/,
        headerTemplate,
        compilerOptions,
      },
    ],
  },
  {
    plugin: 'theme',
    config: [
      {
        file: paths.themes,
        targetFile: path.resolve(paths.source, 'themes.tsx'),
        exportTemplate: ({ targetFileNameNoExt, themes }) =>
          `${headerTemplate}export const ${targetFileNameNoExt} = ${JSON.stringify(
            themes,
            null,
            2
          )}`,
      },
    ],
  },
  {
    plugin: 'reexport',
    config: [
      {
        folder: path.resolve(paths.source, 'models'),
        importTemplate: ({ fileNameNoExt }) => `export * from './${fileNameNoExt}';\n`,
        fileNameTemplate: ({ folderName }) => `_${folderName}.ts`,
        includeChildrenMask: reexportIncludeChildrenMask,
        headerTemplate,
      },
      {
        folder: path.resolve(paths.source, 'utils'),
        importTemplate: ({ fileNameNoExt }) => `export * from './${fileNameNoExt}';\n`,
        fileNameTemplate: ({ folderName }) => `_${folderName}.ts`,
        includeChildrenMask: reexportIncludeChildrenMask,
        headerTemplate,
      },
      {
        folder: path.resolve(paths.source, 'api'),
        importTemplate: ({ fileNameNoExt }) => `export * from './${fileNameNoExt}';\n`,
        fileNameTemplate: ({ folderName }) => `_${folderName}.ts`,
        includeChildrenMask: reexportIncludeChildrenMask,
        headerTemplate,
      },
      {
        folder: path.resolve(paths.validators, 'api'),
        importTemplate: ({ fileNameNoExt }) =>
          `export { default as ${fileNameNoExt} } from './${fileNameNoExt}';\n`,
        fileNameTemplate: ({ folderName }) => `_${folderName}.ts`,
        includeChildrenMask: reexportIncludeChildrenMask,
        headerTemplate,
      },
    ],
  },
];
