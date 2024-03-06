import copy from 'rollup-plugin-copy';

export default {
  input: './tsc-build/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  plugins: [
    copy({
      targets: [{ src: 'src/style.css', dest: 'dist' }],
    }),
  ],
};
