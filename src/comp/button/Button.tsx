import { MouseEvent, ReactNode, RefObject } from 'react';
import cn from 'classnames';

import { ConnectedComponent } from 'compSystem/ConnectedComponent';
import { Ripple } from 'comp/ripple';

import styles from './Button.scss';

export type PropsButton = {
  type: 'grey' | 'yellow' | 'white' | 'black';
  size?: 'small' | 'medium';
  active?: boolean;
  element?: 'submit' | 'a' | 'label';
  onClick?: (event?: MouseEvent) => undefined | boolean | void;
  children?: ReactNode;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  isLoading?: boolean;
  forwardRef?: RefObject<HTMLDivElement | HTMLAnchorElement>;
  linkRegularSrc?: string;
  htmlFor?: string;
  id?: string;
  hidden?: boolean;
  smallInMobile?: boolean;
};

export class Button extends ConnectedComponent<PropsButton> {
  get wrapperClassName() {
    const { type, size, active, element, disabled, className, isLoading, smallInMobile } =
      this.props;

    return cn({
      [styles.button]: true,
      [styles.small]: size === 'small',
      [styles.medium]: size === 'medium' || !size,
      [styles.smallInMobile]: smallInMobile,
      [styles[type]]: Boolean(styles[type]),
      [styles.disabled]: Boolean(disabled),
      [styles.active]: Boolean(active),
      [styles.isLoading]: Boolean(isLoading),
      [styles.isSubmit]: element === 'submit',
      [className as string]: Boolean(className),
    });
  }

  handleClick = (event: MouseEvent) => {
    const { onClick, disabled, isLoading } = this.props;

    if (disabled || isLoading) return;

    if (onClick && onClick(event) === false) return;
  };

  render() {
    const {
      id,
      hidden,
      htmlFor,
      element,
      children,
      tabIndex,
      disabled,
      isLoading,
      forwardRef,
      linkRegularSrc,
    } = this.props;

    if (element === 'submit' && hidden) {
      return (
        <div onClick={this.handleClick} className={styles.hidden}>
          <input type={'submit'} value={''} tabIndex={tabIndex} disabled={disabled} />
        </div>
      );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    let Element: any = 'div';
    if (element === 'a') Element = 'a';
    if (element === 'label') Element = 'label';

    return (
      <Element
        className={this.wrapperClassName}
        onClick={this.handleClick}
        ref={forwardRef}
        href={linkRegularSrc}
        htmlFor={htmlFor}
        id={id}
      >
        {!isLoading && <span>{children}</span>}

        {element === 'submit' && (
          <input type={'submit'} value={''} tabIndex={tabIndex} disabled={disabled} />
        )}

        {isLoading && <div className={styles.loader} />}

        <Ripple rippleClassName={styles.ripple} />
      </Element>
    );
  }
}
