import { Container } from '../Container/Container';

import { Link } from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

import classes from './Header.module.css';

export const Header = () => {
  return (
    <header className={classes.header}>
      <Container style={{ width: '100%' }}>
        <div className={classes.left}>
          <Link asChild>
            <RemixLink to='/'>
              <img
                src='logo_dark.svg'
                alt='Organisation Chart'
              />
            </RemixLink>
          </Link>
        </div>

        <div className={classes.right}>
          <Link asChild>
            <RemixLink to='/documentation'>Documentation</RemixLink>
          </Link>
          <Link asChild>
            <RemixLink to='/changelog'>Changelog</RemixLink>
          </Link>
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
