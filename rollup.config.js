import babel from 'rollup-plugin-babel'

export default {
  input: './index.js',
  output: {
    file: './dist/smox.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' 
    })
  ]
}