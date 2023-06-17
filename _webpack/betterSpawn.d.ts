declare module 'better-spawn' {
  const exp: (
    command: string,
    options?: any
  ) => { close: () => void; stdout: any; stderr: any } = () => {
    return void 0;
  };

  // eslint-disable-next-line import/no-default-export,import/no-unused-modules
  export default exp;
}
