import type { MetaFunction } from '@remix-run/node';

import { Chart } from '../components/Chart.client';
import { Heading, Link } from '@digdir/designsystemet-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Organisation Chart' },
    {
      name: 'description',
      content: 'Display an accessible organisational chart on any website',
    },
  ];
};

export default function Index() {
  return (
    <div>
      <Heading
        level={1}
        spacing
      >
        Organisation Chart{' '}
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
      </Heading>
      <Chart />
    </div>
  );
}
