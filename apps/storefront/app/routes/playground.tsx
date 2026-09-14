import type { MetaFunction } from 'react-router';

import { Heading } from '@digdir/designsystemet-react';
import PlaygroundGUI from '../components/PlaygroundGUI/PlaygroundGUI.client';

export const meta: MetaFunction = () => {
  return [
    { title: 'Lekeplass - Organisation Chart' },
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
        data-size='lg'
      >
        Lekeplass
      </Heading>
      <PlaygroundGUI />
    </div>
  );
}
