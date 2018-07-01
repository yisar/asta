import { normalizeMap, splitContent } from './util'

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

export function mapMethods(method, type) {
    var name = Object.keys(method)[0]
    let content = splitContent(type)
    let res = {}
    for (let { k, v } of normalizeMap(content)) {
        typeof v === 'function' ? res[k] = v
            : res[k] = method[name][v]
    }
    return {
        res,
        name
    }
}