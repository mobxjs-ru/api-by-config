import { TypeApiRoute } from '../models/TypeApiRoute';

type TypeRequest = undefined;

type TypeResponse = {
  data: string;
};

type TypeError = {};

export const getData: TypeApiRoute & {
  error: TypeError;
  request: TypeRequest;
  response: TypeResponse;
} = {
  url: `https://mocki.io/v1/fb5caba1-8090-4c8b-9c79-b71f139b9821`,
  method: 'GET',
  error: {} as TypeError,
  request: undefined as TypeRequest,
  response: {} as TypeResponse,
};
