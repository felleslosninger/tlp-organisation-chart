import React from 'react';

import { Container } from '../Container/Container';

import classes from './Footer.module.css';

interface FooterProps {
  children: React.ReactNode;
}

interface FooterColumnProps {
  children: React.ReactNode;
}

interface FooterBottomProps {
  children: React.ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className={classes.footer}>
      <Container className={classes.topContainer}>
        <div className={classes.topContent}>
          {React.Children.map(children, (child) => (
            <>
              {React.isValidElement(child) && child.type === Footer.Column
                ? child
                : ''}
            </>
          ))}
        </div>
      </Container>
      <Container className={classes.bottomContainer}>
        <div className={classes.bottomContent}>
          {React.Children.map(children, (child) => (
            <>
              {React.isValidElement(child) && child.type === Footer.Bottom
                ? child
                : ''}
            </>
          ))}
        </div>
      </Container>
    </footer>
  );
};

const FooterColumn = ({ children }: FooterColumnProps) => {
  return <>{children}</>;
};

const FooterBottom = ({ children }: FooterBottomProps) => {
  return <div className={classes.bottom2}>{children}</div>;
};

FooterColumn.displayName = 'Footer.Column';
Footer.Column = FooterColumn;

FooterBottom.displayName = 'Footer.Bottom';
Footer.Bottom = FooterBottom;

export { Footer };
export type { FooterProps };
