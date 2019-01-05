import typescript from 'rollup-plugin-typescript'

export default {
  input: './packages/index.ts',
  output: {
    file: './dist/smox.js',
    format: 'umd',
    name: 'smox'
  },
  plugins: [
    typescript()
  ]
}
