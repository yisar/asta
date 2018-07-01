export function resolveSource(source, type, name) {
    if (typeof type === 'function') {
        return type
    }
    return Array.isArray(type) ? source[type[0]][type[1]] : name ? source[name][type] : source[type]
}
export function bindCreators(creators, operate, name) {
    return Object.keys(creators).reduce((ret, item) => {
        ret[item] = (...args) => operate(creators[item], ...args, name)
        return ret
    }, {})
}
export function normalizeMap(map) {
    return Array.isArray(map)
        ? map.map(k => ({ k, v: k }))
        : Object.keys(map).map(k => ({ k, v: map[k] }))
}

export function splitContent(type) {
    let res = []
    type.map(i => {
        res.push(i.split('/')[1])
    })
    return res
}

export function splitType(type) {
    if (typeof type === 'function') {
        return type
    }
    return type.indexOf('/') != -1 ?
        type.split('/') : type

}