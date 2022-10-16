import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { init, parse } from 'es-module-lexer'
import { compile } from '../compiler/gen-sdom.mjs'
import { compile as generateVdom } from '../compiler/gen-vdom.mjs'

const dirname = new URL('.', import.meta.url).pathname

let map = {}


function astaPlugin() {
    return {
        name: 'plugin',
        setup: (build) => {
            build.onLoad(
                {
                    filter: /.*/,
                }, async (args) => {
                    await init;
                    const content = await fs.readFile(args.path)
                    const code = content.toString()
                    const a = compile(code)
                    const b = a.replace('import', 'export').replace(/\s+as\s+\w+,?/g, ',');
                    const [imports, exports] = parse(b);
                    const path = imports[0].n
                    const method = exports[0].n
                    map[path] = `${path}?mod=${method}`
                    const c = a.replace(path, `asta:path`)
                    return {
                        contents: c,
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
            build.onResolve({ filter: /^asta:path$/ }, async (args) => ({
                path: args.path,
                namespace: 'asta-path',
            }))

            build.onLoad({ filter: /.*/, namespace: 'asta-path' }, async () => {
                return {
                    contents: `
                    const addCount = '${map['./action.js']}'
                    export {
                        addCount
                    }`,
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
    const buf = res.outputFiles[0].contents
    const str = String.fromCharCode.apply(null, new Uint8Array(buf))

    await fs.writeFile(path.join(dirname, './app.mjs'), `import {s} from './s.mjs';\n` + str)

    // build client, todo esbuild

    const input = await fs.readFile(path.join(dirname, '../demo/app.jsx'))
    const clientOutput = generateVdom(input.toString())
    await fs.writeFile(path.join(dirname, './app.js'), `import {h} from './h.mjs';\n` + clientOutput)

    await fs.copyFile(path.join(dirname, "../demo/action.js"), path.join(dirname, "./action.js"))
}

main()