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
          <Link
            href='https://github.com/felleslosninger/tlp-organization-chart'
            target='_blank'
            title='Github repository'
          >
            <img
              className={classes.github}
              src='github.svg'
              alt='Github logo'
            />
          </Link>
        </div>
      </Container>
    </header>
  );
};
