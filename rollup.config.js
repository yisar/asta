import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/doux.js',
      format: 'cjs',
      esModule: false,
      name: 'doux',
      sourcemap: true,
    },
    { file: 'dist/doux.esm.js', format: 'esm', esModule: false, sourcemap: true },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true,
    }),
    terser({
      include: ['doux.js'],
    }),
  ],
}
