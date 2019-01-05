import typescript from 'rollup-plugin-typescript'

export default {
  input: './packages/smox/index.ts',
  output: {
    file: './dist/smox.js',
    format: 'umd',
    name: 'smox'
  },
  plugins: [
    typescript()
  ]
}
