import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from 'rollup-plugin-copy'

export default {
  input: "./tsc-build/src/index.js",
  output: {
    file: "dist/index.js",
    format: "es",
  },
  plugins: [
    postcss({
      extract: "dist/style.css",
      minimize: true,
      inject: false,
      path: "./src/style.css",
    }),
    copy({
      targets: [
        { src: 'src/style.css', dest: 'dist' }
      ]
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
  ],
};
