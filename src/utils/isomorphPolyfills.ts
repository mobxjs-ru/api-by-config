import { configure } from 'mobx';
import { errorActionCanceledName } from 'dk-react-mobx-globals';

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

function replaceOriginalErrorLogger() {
  if (IS_CLIENT) {
    // eslint-disable-next-line consistent-return
    window.addEventListener('unhandledrejection', (e) => {
      if (e.reason?.name === errorActionCanceledName) {
        e.preventDefault();
        return false;
      }
    });
  }

  const originalErrorLogger = console.error;
  console.error = function consoleErrorCustom(...args: Array<any>) {
    const errorName = args[0]?.name;

    if (errorName === errorActionCanceledName) return false;

    return originalErrorLogger(...args);
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
  replaceOriginalErrorLogger();
}
