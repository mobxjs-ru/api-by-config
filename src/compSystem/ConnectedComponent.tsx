import { observer } from 'mobx-react';
import { Component } from 'react';

import { TypeGlobals } from 'models';

import { GlobalContext } from './GlobalContext';

export class ConnectedComponent<TProps = any> extends Component<TProps, any> {
  // Describe context, so no boilerplate in components needed
  static observer = observer;
  static context: TypeGlobals;
  static contextType = GlobalContext;
  declare context: TypeGlobals;
}
