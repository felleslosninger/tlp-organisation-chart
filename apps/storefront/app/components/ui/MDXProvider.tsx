import { MDXProvider } from '@mdx-js/react';

import { Heading, Link, List, Paragraph } from '@digdir/designsystemet-react';

export const MDX = ({ children }: { children: React.ReactNode }) => {
  return (
    <MDXProvider
      components={{
        h1: (props) => (
          <Heading
            level={1}
            spacing
            {...props}
          />
        ),
        h2: (props) => (
          <Heading
            level={2}
            spacing
            {...props}
          />
        ),
        h3: (props) => (
          <Heading
            level={3}
            spacing
            {...props}
          />
        ),
        h4: (props) => (
          <Heading
            level={4}
            spacing
            {...props}
          />
        ),
        h5: (props) => (
          <Heading
            level={5}
            spacing
            {...props}
          />
        ),
        h6: (props) => (
          <Heading
            level={6}
            spacing
            {...props}
          />
        ),
        a: (props) => (
          <Link
            {...props}
            target='_blank'
          />
        ),
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
      }}
    >
      {children}
    </MDXProvider>
  );
};
