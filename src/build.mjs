import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { init, parse } from 'es-module-lexer'
import {compile} from '../compiler/gen-sdom.mjs'

const dirname = new URL('.', import.meta.url).pathname


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
                    const b = code.replace('import', 'export').replace(/\s+as\s+\w+,?/g, ',');

                    const a = compile(b)


                    const [imports, exports] = parse(a);

                    console.log(imports,exports)
                    const path = imports[0].n
                    const method = exports[0].n
                    const c = a.replace(path, `data:text/javascript,console.log(123)`)
                    console.log(c)
                    return {
                        contents: c,
                        loader: 'js',
                    };
                }
            );
        },
    };
}


async function main() {
    await esbuild.build({
        entryPoints: [path.join(dirname, './app.jsx')],
        bundle: true,
        platform: 'node',
        format: 'cjs',
        treeShaking: true,
        outfile: 'src/app1.mjs',
        plugins: [
            astaPlugin(),
        ],
        watch: process.env.WATCH === 'true',
    })
}

main()