import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'node:path'
import url from 'node:url'
import { compile } from '../compiler/generate.mjs'
import ScriptParser from '../compiler/acorn-parser.mjs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let actionMap = {}


function astaPlugin(type) {
    return {
        name: 'plugin',
        setup: (build) => {
            build.onLoad(
                { filter: /.*/, }, async (args) => {
                    const content = await fs.readFile(args.path)
                    const code = content.toString()
                    let res = ''

                    if (type === 'server') {
                        res += compile(code)
                        const { actions } = ScriptParser.parse(res);
                        actionMap = actions

                    } else {
                        res += code
                    }

                    if (/\.(?:j|t)sx\b/.test(args.path)) {
                        if (type === 'server') {
                            res = `import {s} from '../src/s.mjs';` + res
                        } else {
                            res = `import {h} from '../src/h.mjs';` + res
                        }
                    }

                    return {
                        contents: res,
                        loader: 'jsx',
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
                    const file = await fs.readFile(path.join(__dirname, '../demo', p))
                    code = file.toString()
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
        entryPoints: [path.join(__dirname, '../demo/app.jsx')],
        bundle: true,
        platform: 'node',
        format: 'esm',
        treeShaking: false,
        outfile: 'src/app.mjs',
        plugins: [
            pathPlugin('server'),
            astaPlugin('server'),
        ],
        watch: process.env.WATCH === 'true',
    })

    const res2 = await esbuild.build({
        entryPoints: [path.join(__dirname, '../demo/app.jsx')],
        bundle: true,
        platform: 'browser',
        format: 'esm',
        treeShaking: false,
        outfile: 'src/app.js',
        jsxFactory: 'h',
        plugins: [
            pathPlugin('client'),
            astaPlugin('client')
        ],
        watch: process.env.WATCH === 'true',
    })

    await fs.mkdir('./src/action', { recursive: true })
    await fs.mkdir('./src/public', { recursive: true })

    await fs.copyFile(path.join(__dirname, "../demo/action/count.js"), path.join(__dirname, "./action/count.js"))
    await fs.copyFile(path.join(__dirname, "../demo/public/style.css"), path.join(__dirname, "./public/style.css"))
}

main()