import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: './tsc-build/index.js',
    output: [
      {
        file: 'dist/es/index.js',
        format: 'es',
        plugins: [terser()],
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        plugins: [terser()],
      },
      {
        file: 'dist/umd/index.js',
        format: 'umd',
        name: 'OrgChart',
        plugins: [terser()],
      },
    ],
    plugins: [
      copy({
        targets: [
          {
            src: 'src/index.css',
            dest: 'dist',
          },
        ],
      }),
    ],
  },
];
