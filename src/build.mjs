import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { compile } from '../compiler/gen-sdom.mjs'
import { compile as generateVdom } from '../compiler/gen-vdom.mjs'
import ScriptParser from '../compiler/acorn-parser.mjs'

const dirname = new URL('.', import.meta.url).pathname

let actionMap = {}


function astaPlugin(type) {
    return {
        name: 'plugin',
        setup: (build) => {
            build.onLoad(
                { filter: /.*/, }, async (args) => {
                    const content = await fs.readFile(args.path)
                    const code = content.toString()

                    if (type === 'server') {
                        var a = compile(code)
                        console.log(a)

                        const { actions } = ScriptParser.parse(a);

                        actionMap = actions
                    } else {
                        var a = generateVdom(code)
                    }

                    return {
                        contents: a,
                        loader: 'js',
                    };
                }
            );
        },
    };
}

export function pathPlugin(type) {
    return {
        name: 'path-plugin',
        setup(build) {
            build.onResolve({ filter: /^~action/ }, async (args) => ({
                path: args.path,
                namespace: 'asta-path',
            }))

            build.onLoad({ filter: /.*/, namespace: 'asta-path' }, async (args) => {
                let code = ''

                if (type === 'server') {
                    const map = actionMap[args.path]
                    code += `export const ${map.name} = '${map.value}';`
                } else {
                    const p = args.path.replace(/~action/g, './action')
                    const file = await fs.readFile(path.join(dirname, '../demo', p))

                    code = file.toString()
                    console.log(code)
                }

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
            pathPlugin('server'),
            astaPlugin('server'),
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
        jsxFactory: 'h',
        plugins: [
            pathPlugin('client'),
            astaPlugin('client')
        ],
        watch: process.env.WATCH === 'true',
    })

    const buf = res.outputFiles[0].contents
    const buf2 = res2.outputFiles[0].contents
    const str = String.fromCharCode.apply(null, new Uint8Array(buf))
    const str2 = String.fromCharCode.apply(null, new Uint8Array(buf2))

    await fs.writeFile(path.join(dirname, './app.mjs'), `import {s} from './s.mjs';\n` + str)

    await fs.writeFile(path.join(dirname, './app.js'), `import {h} from './h.mjs';\n` + str2)

    await fs.mkdir('./src/action', { recursive: true })
    await fs.mkdir('./src/public', { recursive: true })

    await fs.copyFile(path.join(dirname, "../demo/action/count.js"), path.join(dirname, "./action/count.js"))
    await fs.copyFile(path.join(dirname, "../demo/public/style.css"), path.join(dirname, "./public/style.css"))
}

main()