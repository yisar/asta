import path from 'path'
import url from 'node:url'
import {build} from './build.mjs'


const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getOptions = (argv) => {
    let out = {
        e: './',
        o: './dist/',
    }
    for (let i = 0; i < argv.length; i++) {
        const name = argv[i]
        const value = argv[i + 1]
        if (name === '-w' || name === '--watch') {
            out['watch'] = true
        }
        if (name[0] !== '-' || !value) {
            continue
        }
        if (name === '-e' || name === '--entry') {
            out['entryDir'] = value
        }
        if (name === '-o' || name === '--output') {
            out['outputDir'] = value
        }
    }
    return out
}

async function run(argv) {
    if (argv[0] === '-v' || argv[0] === '--version') {
        console.log('v0.0.1')
    } else {
        const options = getOptions(argv)
        start(options)
    }
}

async function start(options) {
    const clientOutput = path.join(process.cwd(),options.outputDir, 'app.js')
    const serverOutput = path.join(process.cwd(),options.outputDir, 'app.mjs')

    const serverEntry = path.join(process.cwd(), options.entryDir, 'server.mjs')
    const serverOutputDir = __dirname

    console.log(serverEntry)

    await build(options)

    const mod = await import(`file://${serverEntry}`)
    mod.default({ serverOutput, serverOutputDir })
}

run(process.argv.slice(2))