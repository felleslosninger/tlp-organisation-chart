import { Button, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

import classes from './HomeHeader.module.css';

export default function HomeHeader() {
  return (
    <div className={classes.box}>
      <div className={classes.betaTag}>Beta</div>
      <Heading
        className={classes.heading}
        data-size='2xl'
      >
        Tilgjengelige <span>organisasjonskart</span> på nett
      </Heading>

      <Paragraph className={classes.subheading}>
        Et lett og tilgjengelig JavaScript bibliotek for å vise
        organisasjonskart på nettsider.
      </Paragraph>

      <Link
        href='https://www.npmjs.com/package/@digdir/organisation-chart'
        target='_blank'
        title='Latest release of npm package'
      >
        <img
          src='https://img.shields.io/npm/v/@digdir/organisation-chart?label=latest%20release&color=0051be'
          alt='Latest release of npm package'
        />
      </Link>

      <div
        className={classes.buttons}
        data-color-scheme='dark'
      >
        <Button
          asChild
          className={classes.whiteButton}
        >
          <RemixLink to='/dokumentasjon'>Dokumentasjon</RemixLink>
        </Button>
        <Button
          asChild
          variant='secondary'
        >
          <RemixLink to='/endringslogg'>Endringslogg</RemixLink>
        </Button>
      </div>
    </div>
  );
}
