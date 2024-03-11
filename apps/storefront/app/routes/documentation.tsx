import type { MetaFunction } from '@remix-run/node';

import { Header } from '../components/ui/Header/Header';

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
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <Header />
    </div>
  );
}
