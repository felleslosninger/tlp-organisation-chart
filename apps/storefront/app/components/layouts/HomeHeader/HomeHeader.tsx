import {
  Box,
  Button,
  Heading,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
import { Link as RemixLink } from '@remix-run/react';

import classes from './HomeHeader.module.css';

export default function HomeHeader() {
  return (
    <Box
      borderRadius='xxlarge'
      className={classes.box}
    >
      <Heading
        className={classes.heading}
        size='3xlarge'
      >
        An accessible <span>organisation chart</span> for any website
      </Heading>

      <Paragraph className={classes.subheading}>
        A lighweight, accessible javascript library for displaying an
        organisation chart.
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

      <div className={classes.buttons}>
        <Button asChild>
          <RemixLink to='/documentation'>Documentation</RemixLink>
        </Button>
        <Button
          asChild
          variant='secondary'
          color='inverted'
        >
          <RemixLink to='/changelog'>Changelog</RemixLink>
        </Button>
      </div>
    </Box>
  );
}
