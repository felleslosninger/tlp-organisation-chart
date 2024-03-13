import { MDXProvider } from '@mdx-js/react';

import { Divider, Heading, Link, List, Paragraph, Table } from '@digdir/designsystemet-react';

import classes from './mdx.module.css';

export const MDX = ({ children }: { children: React.ReactNode }) => {
  return (
    <MDXProvider
      components={{
        h1: (props) => (
          <Heading
            level={1}
            spacing
            size="xlarge"
            {...props}
          />
        ),
        h2: (props) => (
          <Heading
            level={2}
            spacing
            size="large"
            {...props}
          />
        ),
        h3: (props) => (
          <Heading
            level={3}
            spacing
            size="medium"
            {...props}
          />
        ),
        h4: (props) => (
          <Heading
            level={4}
            spacing
            size="small"
            {...props}
          />
        ),
        h5: (props) => (
          <Heading
            level={5}
            spacing
            size="xsmall"
            {...props}
          />
        ),
        h6: (props) => (
          <Heading
            level={6}
            spacing
            size="xxsmall"
            {...props}
          />
        ),
        a: (props) => {
          if (props && props.href && props.href.startsWith('http')) {
            return <Link {...props} target='_blank' />
          } 

            return <Link
              {...props}
            />
          },
        p: Paragraph,
        ol: (props) => (
          <List.Root>
            <List.Ordered {...props} />
          </List.Root>
        ),
        ul: (props) => (
          <List.Root>
            <List.Unordered {...props} />
          </List.Root>
        ),
        li: (props) => <List.Item {...props} />,
        hr: (props) => <Divider {...props} color="default" ref={null} />,
        table: (props) => (
          <Table
            {...props}
            zebra
            border
          />
        ),
        thead: (props) => (
          <Table.Head
            {...props}
          />
        ),
        tbody: (props) => (
          <Table.Body
            {...props}
          />
        ),
        tr: (props) => (
          <Table.Row
            {...props}
          />
        ),
        th: (props) => (
          <Table.HeaderCell
            {...props}
          />
        ),
        td: (props) => (
          <Table.Cell
            {...props}
          />
        ),
      }}
    >
      <div className={classes.content}>
        {children}
      </div>
    </MDXProvider>
  );
};
