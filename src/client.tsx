import './styles/global.scss';
import { createRoot } from 'react-dom/client';

import { App } from 'comp/app';
import { GlobalContext } from 'compSystem/GlobalContext';
import { createApi, getTypedEntries, isomorphPolyfills } from 'utils';
import { transformers } from 'compSystem/transformers';

import { themes } from './themes';

isomorphPolyfills();

getTypedEntries(themes.light).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

/**
 * 1. Create api from config
 *
 */

const globalContext = { api: createApi() };

/**
 * 2. Maybe track api execution time / errors / print call stack
 *
 */

transformers.autorun(() => {
  getTypedEntries(globalContext.api).forEach(([apiName, fn]) => {
    if (fn.state.executionTime) {
      // eslint-disable-next-line no-console
      console.log(`${apiName} has finished in ${fn.state.executionTime}ms`);
    }
  });
});

/**
 * 3. Pass api to context
 *
 */

createRoot(document.getElementById('app')!).render(
  <GlobalContext.Provider value={globalContext}>
    <App />
  </GlobalContext.Provider>
);
