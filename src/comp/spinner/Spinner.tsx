import cn from 'classnames';

import { ConnectedComponent } from 'compSystem/ConnectedComponent';

import styles from './Spinner.scss';

type PropsSpinner = {
  size: number;
  className?: string;
};

export class Spinner extends ConnectedComponent<PropsSpinner> {
  render() {
    const { className, size } = this.props;

    const style = {
      width: `${size}px`,
      height: `${size}px`,
    };

    return <div style={style} className={cn(styles.spinner, className)} />;
  }
}
