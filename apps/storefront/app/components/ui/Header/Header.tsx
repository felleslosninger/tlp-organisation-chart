import { Container } from '../Container/Container';

import { Link } from '@digdir/designsystemet-react';

import classes from './Header.module.css';

export const Header = () => {
  return (
    <header className={classes.header}>
      <Container>
        <div className={classes.left}>
          <Link href='/'>
            <img
              src='logo_dark.svg'
              alt='Organisation Chart'
            />
          </Link>
        </div>

        <div className={classes.right}>
          <Link href='/documentation'>Documentation</Link>
        </div>
      </Container>
    </header>
  );
};
