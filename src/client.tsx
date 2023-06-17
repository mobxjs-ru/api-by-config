import './styles/global.scss';
import { createRoot } from 'react-dom/client';
import _mapValues from 'lodash/mapValues';

import { App } from 'comp/app';
import { StoreContext } from 'compSystem/StoreContext';
import { getTypedEntries, isomorphPolyfills, request } from 'utils';
import * as api from 'api';
import { transformers } from 'compSystem/transformers';

import { themes } from './themes';

isomorphPolyfills();

getTypedEntries(themes.light).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

type TypeActionData = {
  state: {
    mock?: any;
    error?: string;
    timeStart: number;
    isExecuting: boolean;
    executionTime: number;
  };
};

const BIGINT_ROUNDER = 1000000;
const TIMING_PRECISION = 3;

const getCurrentTime = () => {
  return typeof window !== undefined
    ? performance.now()
    : Number((Number(process.hrtime.bigint()) / BIGINT_ROUNDER).toFixed(TIMING_PRECISION));
};

const addState = <TApiFn extends (requestParams?: any) => Promise<any>>(
  fn: TApiFn,
  name: string
) => {
  function afterExecutionError(error: any) {
    transformers.batch(() => {
      wrappedAction.state.isExecuting = false;
      wrappedAction.state.executionTime = Number(
        (getCurrentTime() - wrappedAction.state.timeStart).toFixed(1)
      );
      wrappedAction.state.timeStart = 0;
      wrappedAction.state.error = error.message;
    });

    return Promise.reject(error);
  }

  const wrappedAction = Object.defineProperties(
    function wrappedActionDecorator(requestParams?: any) {
      try {
        transformers.batch(() => {
          wrappedAction.state.executionTime = 0;
          wrappedAction.state.isExecuting = true;
          wrappedAction.state.timeStart = getCurrentTime();
          wrappedAction.state.error = undefined;
        });

        return transformers
          .action(fn)(requestParams)
          .then((response: any) => {
            transformers.batch(() => {
              wrappedAction.state.isExecuting = false;
              wrappedAction.state.executionTime = Number(
                (getCurrentTime() - wrappedAction.state.timeStart).toFixed(1)
              );
              wrappedAction.state.timeStart = 0;
            });

            return response;
          })
          .catch(afterExecutionError);
      } catch (error: any) {
        return afterExecutionError(error);
      }
    } as (() => any) & TypeActionData,
    {
      state: {
        value: transformers.observable({
          timeStart: 0,
          isExecuting: false,
          executionTime: 0,
        }),
        writable: false,
      },
      name: { value: name, writable: false },
    }
  );

  return wrappedAction;
};

function createApi() {
  return _mapValues(api, (apiConfig, apiName) => {
    return addState(
      (requestParams: (typeof apiConfig)['request']) =>
        request({
          apiName,
          url: apiConfig.url,
          method: apiConfig.method,
          headers: apiConfig.headers,
          requestParams,
        }),
      apiName
    );
  });
}

createRoot(document.getElementById('app')!).render(
  <StoreContext.Provider value={{ api: createApi() }}>
    <App />
  </StoreContext.Provider>
);
