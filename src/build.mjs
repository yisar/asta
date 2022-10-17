import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { compile } from '../compiler/gen-sdom.mjs'
import { compile as generateVdom } from '../compiler/gen-vdom.mjs'
import ScriptParser from '../compiler/acorn-parser.mjs'

const dirname = new URL('.', import.meta.url).pathname

let actionMap = {}


function astaPlugin() {
    return {
        name: 'plugin',
        setup: (build) => {
            build.onLoad(
                {
                    filter: /.*/,
                }, async (args) => {
                    const content = await fs.readFile(args.path)
                    const code = content.toString()

                    const a = compile(code)

                    const { actions } = ScriptParser.parse(a);

                    actionMap = actions

                    return {
                        contents: a,
                        loader: 'js',
                    };
                }
            );
        },
    };
}

export function pathPlugin() {
    return {
        name: 'path-plugin',
        setup(build) {
            build.onResolve({ filter: /^~action/ }, async (args) => ({
                path: args.path,
                namespace: 'asta-path',
            }))

            build.onLoad({ filter: /.*/, namespace: 'asta-path' }, async (args) => {
                let code = ''

                const map = actionMap[args.path]
                console.log(map)

                code += `export const ${map.name} = '${map.value}';`

                return {
                    contents: code,
                    loader: 'js',
                }
            })
        }
    }
}


async function main() {
    const res = await esbuild.build({
        entryPoints: [path.join(dirname, '../demo/app.jsx')],
        bundle: true,
        platform: 'node',
        format: 'esm',
        write: false,
        treeShaking: false,
        outfile: 'src/app.mjs',
        plugins: [
            pathPlugin(),
            astaPlugin(),
        ],
        watch: process.env.WATCH === 'true',
    })

    const res2 = await esbuild.build({
        entryPoints: [path.join(dirname, '../demo/app.jsx')],
        bundle: true,
        platform: 'browser',
        format: 'esm',
        write: false,
        treeShaking: false,
        outfile: 'src/app.js',
        plugins: [
            pathPlugin(),
            astaPlugin(),
        ],
        watch: process.env.WATCH === 'true',
    })

    const buf = res.outputFiles[0].contents
    const str = String.fromCharCode.apply(null, new Uint8Array(buf))

    await fs.writeFile(path.join(dirname, './app.mjs'), `import {s} from './s.mjs';\n` + str)

    // build client, todo esbuild

    const input = await fs.readFile(path.join(dirname, '../demo/app.jsx'))
    const clientOutput = generateVdom(input.toString())
    await fs.writeFile(path.join(dirname, './app.js'), `import {h} from './h.mjs';\n` + clientOutput)
    await fs.mkdir('./src/action', { recursive: true })

    await fs.copyFile(path.join(dirname, "../demo/action/count.js"), path.join(dirname, "./action/count.js"))
}

main()