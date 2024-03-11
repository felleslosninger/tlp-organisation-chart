import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Organisation Chart - Documentation' },
    {
      name: 'description',
      content: 'Documentation for the Organisation Chart',
    },
  ];
};

export default function Index() {
  return <div>Documentation</div>;
}
