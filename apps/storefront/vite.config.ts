import mdx from '@mdx-js/rollup';
import { vitePlugin as remix } from '@remix-run/dev';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({
      ssr: false,
    }),
    tsconfigPaths(),
  ],
});
