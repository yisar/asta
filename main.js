import {parse} from './parse.js'
import {generate} from './generate.js'

const ast = parse('<div>hello world</div>')

console.log(ast)

const code = generate(ast)

console.log(code)