import { Link } from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

import GithubLogo from '../../GithubLogo';

import cl from 'clsx';

import classes from './Header.module.css';
import { useState } from 'react';

import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div>
          <Link asChild>
            <RemixLink to='/'>
              <img
                src='logo_dark.svg'
                alt='Organisation Chart'
              />
            </RemixLink>
          </Link>
        </div>

        <nav className={classes.right}>
          <button
            aria-expanded={open}
            aria-label='Meny'
            className={classes.toggle}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open && <Cross1Icon />}
            {!open && <HamburgerMenuIcon />}
          </button>

          <ul className={cl(classes.menu, { [classes.active]: open })}>
            <li className={classes.item}>
              <RemixLink
                className={cl(classes.link)}
                to='/dokumentasjon'
              >
                Dokumentasjon
              </RemixLink>
            </li>
            <li className={classes.item}>
              <RemixLink
                className={cl(classes.link)}
                to='/endringslogg'
              >
                Endringslogg
              </RemixLink>
            </li>

            <li className={classes.item}>
              <RemixLink
                className={cl(classes.link)}
                to='/playground'
              >
                Lekeplass
              </RemixLink>
            </li>

            <li
              className={cl(classes.item, classes.itemIcon, classes.firstIcon)}
            >
              <Link
                href='https://github.com/felleslosninger/tlp-organisation-chart'
                target='_blank'
                title='Github repository'
                className={cl(classes.linkIcon, classes.github)}
              >
                <GithubLogo />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
