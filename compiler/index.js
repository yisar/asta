// const { compile, generate } = require('./gen-h')
const fs = require('fs/promises')
const path = require('path')
const {compile: generateVdom} = require('./gen-vdom.mjs')
const {compile: generateIdom} = require('./gen-sdom.mjs')
async function main(){
    const input = await fs.readFile(path.join(__dirname, '../src/app.jsx'))
    const clientOutput = generateVdom(input.toString())
    const serverOutput = generateIdom(input.toString(), 's')
    await fs.writeFile(path.join(__dirname, '../src/app.js'), `import {h} from './h.mjs';\n`+clientOutput)
    await fs.writeFile(path.join(__dirname, '../src/app.mjs'), `import {s} from './s.mjs';\n`+serverOutput)

}

main()