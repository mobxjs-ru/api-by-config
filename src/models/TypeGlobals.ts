// eslint-disable-next-line import/no-restricted-paths
import * as api from 'api';

export type TypeApiError<TApiName extends keyof typeof api> = (typeof api)[TApiName]['error'];
export type TypeApiRequest<TApiName extends keyof typeof api> = (typeof api)[TApiName]['request'];
export type TypeApiResponse<TApiName extends keyof typeof api> = (typeof api)[TApiName]['response'];

type TypeActionData = {
  state: {
    mock?: any;
    error?: string;
    timeStart: number;
    isExecuting: boolean;
    executionTime: number;
  };
};

type TypeActionGenerator<
  TResponseParams extends any,
  TRequestParams = undefined
> = TRequestParams extends undefined
  ? () => Promise<TResponseParams>
  : (params: TRequestParams) => Promise<TResponseParams>;

export type TypeGlobals = {
  api: {
    [Key in keyof typeof api]: TypeActionGenerator<TypeApiResponse<Key>, TypeApiRequest<Key>> &
      TypeActionData;
  };
};
