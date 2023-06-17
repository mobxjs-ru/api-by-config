import { promiseDelay } from 'utils/promiseDelay';
import { TypeApiRoute } from 'models';

export const request = (params: TypeApiRoute & { requestParams?: any; apiName: string }) => {
  return (
    Promise.resolve()
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .then(() => promiseDelay(300))
      .then(() =>
        fetch(params.url, {
          method: params.method,
          headers: params.headers,
          body: params.method === 'GET' ? undefined : JSON.stringify(params.requestParams || {}),
        })
      )
      .then((response) => response.json())
      .catch((error: Error) => {
        throw error;
      })
  );
};
