import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowIcon } from '../ArrowIcon/ArrowIcon';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'outline' | 'link';
type ButtonTone = 'ink' | 'paper';
type ButtonIcon = 'arrow' | 'down' | 'none';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  readonly children: string;
  readonly variant?: ButtonVariant;
  /** Colour context: `ink` on paper backgrounds, `paper` on dark backgrounds. */
  readonly tone?: ButtonTone;
  readonly icon?: ButtonIcon;
  readonly size?: ButtonSize;
  readonly external?: boolean;
  readonly leading?: ReactNode;
}

/**
 * Shared call-to-action link. Hover swaps the label through a slot, loops the arrow,
 * and wipes the fill; all of it is CSS so reduced-motion collapses it globally.
 */
export function Button({
  children,
  variant = 'primary',
  tone = 'ink',
  icon = 'arrow',
  size = 'md',
  external = false,
  leading,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[`tone-${tone}`],
    size === 'lg' ? styles.lg : size === 'sm' ? styles.sm : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a className={classes} {...externalProps} {...props}>
      {leading ? <span className={styles.leading}>{leading}</span> : null}
      <span className={styles.label} data-text={children}>
        <span>{children}</span>
      </span>
      {icon !== 'none' ? (
        <span className={`${styles.icon} ${icon === 'down' ? styles.iconDown : ''}`} aria-hidden="true">
          <ArrowIcon />
          <ArrowIcon />
        </span>
      ) : null}
    </a>
  );
}
