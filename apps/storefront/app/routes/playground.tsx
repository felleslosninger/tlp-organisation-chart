import type { MetaFunction } from '@remix-run/node';

import { Chart } from '../components/Chart/Chart.client';
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

export default function Playground() {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Heading
        level={2}
        size='large'
        spacing
      >
        Playground
      </Heading>

      <Chart />
    </div>
  );
}
