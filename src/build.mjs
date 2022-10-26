import esbuild from 'esbuild'
import fs from 'fs/promises'
import path from 'node:path'
import url from 'node:url'
import { compile } from '../compiler/generate.mjs'
import fse from 'fs-extra'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let actionMap = {}

function astaPlugin(type) {
	return {
		name: 'plugin',
		setup: (build) => {
			build.onLoad({ filter: /.*/ }, async (args) => {
				const content = await fs.readFile(args.path)
				const code = content.toString()
				let res = ''

				if (type === 'server') {
					res += compile(code)
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
				}
			})
		},
	}
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
		},
	}
}

export async function build() {
	await esbuild.build({
		entryPoints: [path.join(__dirname, '../demo/app.jsx')],
		bundle: true,
		platform: 'node',
		format: 'esm',
		treeShaking: false,
		outfile: 'src/app.mjs',
		allowOverwrite: true,
		plugins: [pathPlugin('server'), astaPlugin('server')],
		watch: process.env.WATCH === 'true',
	})

	await esbuild.build({
		entryPoints: [path.join(__dirname, '../demo/app.jsx')],
		bundle: true,
		platform: 'browser',
		format: 'esm',
		treeShaking: false,
		outfile: 'src/app.js',
		jsxFactory: 'h',
		allowOverwrite: true,
		plugins: [pathPlugin('client'), astaPlugin('client')],
		watch: process.env.WATCH === 'true',
	})

	await fse.copy(path.join(process.cwd(), 'demo/public'), path.join(__dirname, 'public'))
	await fse.copy(path.join(process.cwd(), 'demo/action'), path.join(__dirname, 'action'))
}
