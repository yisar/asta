export interface Fnc {
    [k: string]: Function
}

export function resolveSource(source: Fnc, type: Function | string) {
    return typeof type === 'function' ? type : source[type]
}

export function bindCreators(creators: Fnc, operate: Function) {
    return Object.keys(creators).reduce((ret, item) => {
        ret[item] = (...args) => operate(creators[item], ...args)
        return ret
    }, {})
}

export function normalizeMap(map: string[]) {
    return Array.isArray(map)
        ? map.map(k => ({ k, v: k }))
        : Object.keys(map).map(k => ({ k, v: map[k] }))
}

export function mapMethods(method, methods:string[]) {
    let res = {}
    for (let { k, v } of normalizeMap(methods)) {
        typeof v === 'function' ? res[k] = v
        : res[k] = method[v]
    }
    return res
  }
