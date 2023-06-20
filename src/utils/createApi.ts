import _mapValues from 'lodash/mapValues';

import * as api from 'api';

import { addState } from './addState';
import { promiseDelay } from './promiseDelay';

export function createApi() {
  /**
   * Create an object from api configs
   *
   */

  return _mapValues(api, (apiConfig, apiName) => {
    /**
     * Call function, here we can call fetch / Axios,
     * handle errors,
     * add interceptors,
     * extend headers with authorization or other global headers,
     * add prefix to url (ex. domain that is configured in .env),
     * handle retries on errors,
     * apply caching strategy,
     * configure protocols and content-type
     * validate request and response
     *
     */

    const apiCallFn = (
      requestParams: (typeof apiConfig)['request']
    ): Promise<(typeof apiConfig)['response']> => {
      const SYNTHETIC_DELAY = 300;

      if (apiCallStateful.state.mock) return Promise.resolve(apiCallStateful.state.mock);

      return promiseDelay(SYNTHETIC_DELAY)
        .then(() =>
          fetch(apiConfig.url, {
            method: apiConfig.method,
            headers: apiConfig.headers,
            body: apiConfig.method === 'GET' ? undefined : JSON.stringify(requestParams || {}),
          })
        )
        .then((response) => response.json())
        .catch((error: Error) => {
          throw error;
        });
    };

    /**
     * Add state, so every function will have an observable state with necessary params
     * like isExecuting, executionTime, error, mock etc.
     *
     */

    const apiCallStateful = addState(apiCallFn, apiName);

    return apiCallStateful;
  });
}
