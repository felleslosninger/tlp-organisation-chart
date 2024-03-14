import { Container } from '../Container/Container';

import classes from './Footer.module.css';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.top}>
        <Container className={classes.container}>
          <div>
            <Heading
              level={2}
              size='xsmall'
              className={classes.text}
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
                  <RemixLink to='/documentation'>Dokumentasjon</RemixLink>
                </Link>
              </li>
              <li>
                <Link
                  asChild
                  inverted
                >
                  <RemixLink to='/changelog'>Endringslogg</RemixLink>
                </Link>
              </li>
              <li>
                <Link
                  asChild
                  inverted
                >
                  <RemixLink to='/privacy-policy'>
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
              className={classes.text}
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
      <div className={classes.bottom}>
        <Container>
          <Paragraph
            size='small'
            className={classes.text}
          >
            Tjenesten er levert av Digitaliseringsdirektoratet
          </Paragraph>
        </Container>
      </div>
    </footer>
  );
};

export { Footer };
