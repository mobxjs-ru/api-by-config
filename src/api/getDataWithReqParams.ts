import { TypeApiRoute } from '../models/TypeApiRoute';

type TypeRequest = {
  email: string;
};

type TypeResponse = {
  data2: string;
};

type TypeError = {};

export const getDataWithReqParams: TypeApiRoute & {
  error: TypeError;
  request: TypeRequest;
  response: TypeResponse;
} = {
  url: `https://mocki.io/v1/fb5caba1-8090-4c8b-9c79-b71f139b9821`,
  method: 'GET',
  error: {} as TypeError,
  request: {} as TypeRequest,
  response: {} as TypeResponse,
};
