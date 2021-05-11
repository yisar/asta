import {parse} from './parse.js'
import {generate} from './generate.js'

const ast = parse('<div>hello world</div>')

const code = generate(ast)