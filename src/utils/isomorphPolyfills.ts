import { configure } from 'mobx';

import { transformers } from 'compSystem/transformers';

function createConsoleJsLogger() {
  // eslint-disable-next-line no-console
  console.js = function consoleJsCustom(...args: Array<any>) {
    // eslint-disable-next-line no-console
    console.log(...args.map((arg) => transformers.toJS(arg)));
  };

  // eslint-disable-next-line no-console
  console.jsf = function consoleJsCustom(...args: Array<any>) {
    // eslint-disable-next-line no-console
    if (IS_CLIENT) console.log(...args.map((arg) => transformers.toJS(arg)));
  };
}

export function isomorphPolyfills() {
  configure({
    enforceActions: 'always',
    disableErrorBoundaries: false,
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false,
  });
  createConsoleJsLogger();
}
