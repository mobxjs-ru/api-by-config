import { TypeApiRoute } from '../models/TypeApiRoute';

type TypeRequest = undefined;

type TypeResponse = {
  data: string;
};

type TypeError = {};

export const getDataError: TypeApiRoute & {
  error: TypeError;
  request: TypeRequest;
  response: TypeResponse;
} = {
  url: `https://mocki.io/v1/1`,
  method: 'GET',
  error: {} as TypeError,
  request: undefined as TypeRequest,
  response: {} as TypeResponse,
};
