import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';

export default {
  input: './tsc-build/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    plugins: [terser()],
  },
  plugins: [
    copy({
      targets: [
        {
          src: 'src/style.css',
          dest: 'dist',
        },
      ],
    }),
  ],
};
