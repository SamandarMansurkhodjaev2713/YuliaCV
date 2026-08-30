import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.css';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  const classes = className ? `${styles.container} ${className}` : styles.container;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
