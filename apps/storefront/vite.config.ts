import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [rehypeHighlight, rehypeAutoLinkHeadings],
      providerImportSource: '@mdx-js/react',
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
