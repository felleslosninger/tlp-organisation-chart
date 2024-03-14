import type { MetaFunction } from '@remix-run/node';

import { Chart } from '../components/Chart.client';
import HomeHeader from '../components/layouts/HomeHeader';
import { Heading } from '@digdir/designsystemet-react';

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
    <div
      style={{
        width: '100%',
      }}
    >
      <HomeHeader />

      <Heading
        level={2}
        size='medium'
        spacing
      >
        Eksempel på et organisasjonskart
      </Heading>

      <Chart />
    </div>
  );
}
