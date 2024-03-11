import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Organisation Chart - Changelog' },
    {
      name: 'description',
      content: 'Changelog for the Organisation Chart',
    },
  ];
};

export default function Index() {
  return <div>Chagelog</div>;
}
