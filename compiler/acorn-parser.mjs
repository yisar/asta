import { parse } from 'acorn'

const ScriptParser = {
    parse(source) {
        const ast = parse(source, { sourceType: 'module' })

        return this.walk(ast)
    },

    walk(ast) {
        const actions = {}
        const rest = []

        ast.body.forEach(declaration => {
            if (declaration.type === 'ImportDeclaration') {
                this.addExport(actions, declaration.specifiers, declaration.source)
            } else {
                rest.push(declaration)
            }
        })

        return { actions, rest }
    },

    addExport(actions, specifiers, source) {
        const path = source.value
        specifiers.forEach(decl => {
            actions[source.value] = { name: decl.imported.name, value: path.replace('~', './') + `?mod=${decl.imported.name}` }
        })
    }
}

export default ScriptParser