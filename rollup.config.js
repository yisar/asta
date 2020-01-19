import typescript from 'rollup-plugin-typescript'
import babel from 'rollup-plugin-babel'

export default {
  input: './index.ts',
  output: {
    file: './dist/qox.js',
    format: 'umd',
    name: 'Qox'
  },
  plugins: [
    typescript(),
    babel({
      babelrc: false,
      presets: [['@babel/preset-react']],
    })
  ]
}
