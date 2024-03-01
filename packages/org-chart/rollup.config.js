import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default {
  input: "./tsc-build/index.js",
  output: {
    file: "dist/index.js",
    format: "es",
  },
  plugins: [peerDepsExternal(), resolve(), commonjs()],
};
