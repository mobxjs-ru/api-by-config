/**
 * @docs: https://github.com/okonet/lint-staged
 *
 * Runs commands for files added to commit
 * Just simpler than creating own bash script with such recipe
 *
 */

const { lintStagedConfig } = require('dk-eslint-config');

module.exports = lintStagedConfig;
