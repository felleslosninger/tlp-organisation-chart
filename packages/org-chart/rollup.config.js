import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import path from "path";

export default {
  input: "./tsc-build/index.js",
  output: {
    file: "dist/index.js",
    format: "es",
  },
  plugins: [
    postcss({
      extract: path.resolve("dist/style.css"),
      minimize: true,
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
  ],
};
