import React from 'react';
import cl from 'clsx';

import classes from './Container.module.css';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={cl(classes.container, className)}>{children}</div>;
};
