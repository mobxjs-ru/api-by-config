import { createContext } from 'react';

import { TypeGlobals } from 'models';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GlobalContext = createContext(undefined as unknown as TypeGlobals);
