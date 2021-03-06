import resolve from 'rollup-plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import regenerator from 'rollup-plugin-regenerator'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'esm/thunderState.min.mjs',
      format: 'esm',
      compact: true,
      sourcemap: true,
    },
    {
      file: 'umd/thunderState.min.js',
      format: 'umd',
      name: 'ThunderState',
      compact: true,
    },
    {
      file: 'dist/thunderState.min.js',
      format: 'cjs',
      compact: true,
    },
  ],
  plugins: [
    sourcemaps(),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    terser(),
    regenerator(),
  ],
}
