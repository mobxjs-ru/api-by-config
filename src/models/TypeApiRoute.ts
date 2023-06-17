export type TypeApiRoute = {
  url: string;
  mock?: any;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: any;
};
