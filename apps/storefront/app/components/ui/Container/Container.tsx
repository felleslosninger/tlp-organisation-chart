import React from 'react';
import cl from 'clsx';

import classes from './Container.module.css';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div
      className={cl(classes.container, className)}
      {...rest}
    >
      {children}
    </div>
  );
};
