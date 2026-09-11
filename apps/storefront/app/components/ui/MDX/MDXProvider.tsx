import { MDXProvider } from '@mdx-js/react';

import {
  Divider,
  Heading,
  Link,
  List,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';

import classes from './mdx.module.css';

// MDX passes JSX.IntrinsicElements props, whose `ref` is a LegacyRef (allows
// string refs). Designsystemet only accepts Ref, so drop it.
const dropRef = <P extends object>(props: P): Omit<P, 'ref'> => {
  const rest = { ...props };
  delete (rest as { ref?: unknown }).ref;
  return rest;
};

export const MDX = ({ children }: { children: React.ReactNode }) => {
  return (
    <MDXProvider
      components={{
        h1: (props) => (
          <Heading
            level={1}
            data-size='xl'
            {...dropRef(props)}
          />
        ),
        h2: (props) => (
          <Heading
            level={2}
            data-size='lg'
            {...dropRef(props)}
          />
        ),
        h3: (props) => (
          <Heading
            level={3}
            data-size='md'
            {...dropRef(props)}
          />
        ),
        h4: (props) => (
          <Heading
            level={4}
            data-size='sm'
            {...dropRef(props)}
          />
        ),
        h5: (props) => (
          <Heading
            level={5}
            data-size='xs'
            {...dropRef(props)}
          />
        ),
        h6: (props) => (
          <Heading
            level={6}
            data-size='2xs'
            {...dropRef(props)}
          />
        ),
        a: (props) => {
          const { children: linkChildren, ...rest } = dropRef(props);

          return (
            <Link
              {...rest}
              target={rest.href?.startsWith('http') ? '_blank' : undefined}
            >
              {linkChildren}
            </Link>
          );
        },
        p: (props) => <Paragraph {...dropRef(props)} />,
        ol: (props) => <List.Ordered {...dropRef(props)} />,
        ul: (props) => <List.Unordered {...dropRef(props)} />,
        li: (props) => <List.Item {...dropRef(props)} />,
        hr: (props) => <Divider {...dropRef(props)} />,
        table: (props) => (
          <Table
            {...dropRef(props)}
            zebra
            border
          />
        ),
        thead: (props) => <Table.Head {...dropRef(props)} />,
        tbody: (props) => <Table.Body {...dropRef(props)} />,
        tr: (props) => <Table.Row {...dropRef(props)} />,
        th: (props) => <Table.HeaderCell {...dropRef(props)} />,
        td: (props) => <Table.Cell {...dropRef(props)} />,
      }}
    >
      <div className={classes.content}>{children}</div>
    </MDXProvider>
  );
};
