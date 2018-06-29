export interface Fnc {
    [k: string]: Function
}

export function resolveSource(source: Fnc, type: Function | string) {
    if (typeof type === 'function') {
        return type
    }
    return Array.isArray(type) ? source[type[0]][type[1]] : source[type]
}

export function bindCreators(creators: Fnc, operate: Function,name:string) {
    return Object.keys(creators).reduce((ret, item) => {
        ret[item] = (...args) => operate(creators[item], name, ...args);
        return ret
    }, {})
}

export function normalizeMap(map: string[]) {
    return Array.isArray(map)
        ? map.map(k => ({ k, v: k }))
        : Object.keys(map).map(k => ({ k, v: map[k] }))
}

export function mapMethods(method, type) {
    var name = Object.keys(method)[0]
    let content = splitContent(type)
    let res = {};
    for (let { k, v } of normalizeMap(content)) {
        typeof v === 'function' ? res[k] = v
            : res[k] = method[name][v];
    }
    return {
        res,
        name
    }
}

function splitContent(type) {
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
export function combineModels(models) {
    let state = {},
        mutations = {},
        actions = {}
    Object.keys(models).forEach(i => {
        if (models[i].state) {
            state[i] = models[i].state
        }
        if (models[i].mutations) {
            mutations[i] = models[i].mutations
        }
        if (models[i].actions) {
            actions[i] = models[i].actions
        }
    })
    return {
        state,
        mutations,
        actions
    }
}