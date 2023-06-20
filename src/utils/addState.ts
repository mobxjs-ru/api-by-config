import { transformers } from 'compSystem/transformers';

import { getCurrentTime } from './getCurrentTime';

type TypeActionData = {
  state: {
    mock?: any;
    error?: string;
    timeStart: number;
    isExecuting: boolean;
    executionTime: number;
  };
};

export function addState<TApiFn extends (requestParams?: any) => Promise<any>>(
  fn: TApiFn,
  name: string
) {
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
}
