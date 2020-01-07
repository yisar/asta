import typescript from 'rollup-plugin-typescript'
import tsx from 'rollup-plugin-tsx'
import babel from 'rollup-plugin-babel'

export default {
  input: './packages/index.ts',
  output: {
    file: './dist/qox.js',
    format: 'umd',
    name: 'qox'
  },
  plugins: [
    typescript(),
    babel({
      babelrc: false,
      presets: [['@babel/preset-react']],
    })
  ]
}
