const { parse } = require('./parse')
const { generate } = require('./gen-h')
const fs = require('fs/promises')
const path = require('path')

const str = `const view = ({ count }) =>
<main><button>{count}</button></main>`

function compile(input) {
    const parseOutput = parse(input);

    if (process.env.MOON_ENV === "development" && parseOutput.constructor.name === "ParseError") {
        error(`Invalid input to parser.
Attempted to parse input.
Expected ${parseOutput.expected}.
Received:
${format(input, parseOutput.index)}`);
    }
    return generate(parseOutput[0][0]);
}

async function main(){
    const input = await fs.readFile(path.join(__dirname, '../dist/app.jsx'))
    const output = compile(input.toString())
    await fs.writeFile(path.join(__dirname, '../dist/app.mjs'), `import {h} from './h.mjs';\n`+output)

}

main()