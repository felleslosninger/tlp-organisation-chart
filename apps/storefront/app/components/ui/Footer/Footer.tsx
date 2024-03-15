import { Container } from '../Container/Container';

import classes from './Footer.module.css';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.top}>
        <Container className={classes.container}>
          <div className={classes.logos}>
            <Link asChild>
              <RemixLink to='/'>
                <img
                  src='logo_white.svg'
                  alt='Organisation Chart'
                />
              </RemixLink>
            </Link>
            <Paragraph
              size='small'
              className={classes.text}
            >
              Et lett og tilgjengelig JavaScript bibliotek for å vise
              organisasjonskart på nettsider.
            </Paragraph>
          </div>
          <div>
            <Heading
              level={2}
              size='xsmall'
              className={classes.heading}
              spacing
            >
              Om nettstedet
            </Heading>
            <ul className={classes.links}>
              <li>
                <Link
                  asChild
                  inverted
                >
                  <RemixLink to='/dokumentasjon'>Dokumentasjon</RemixLink>
                </Link>
              </li>
              <li>
                <Link
                  asChild
                  inverted
                >
                  <RemixLink to='/endringslogg'>Endringslogg</RemixLink>
                </Link>
              </li>
              <li>
                <Link
                  asChild
                  inverted
                >
                  <RemixLink to='/personvernerklæring'>
                    Personvernerklæring
                  </RemixLink>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Heading
              level={2}
              size='xsmall'
              className={classes.heading}
              spacing
            >
              Kom i kontakt med oss
            </Heading>
            <ul className={classes.links}>
              <li>
                <Link
                  href='https://github.com/felleslosninger/tlp-organization-chart/issues/new'
                  target='_blank'
                  inverted
                >
                  Github issues
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export { Footer };
