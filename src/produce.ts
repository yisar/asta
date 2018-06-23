const PROXY_STATE = 'proxy-state'

class State {
    base:any
    modifed:boolean
    copy:any
    constructor(base) {
        this.base = base
        this.modifed = false
        this.copy = null
    }

    get(key) {
        if (!this.modifed) {
            return this.base[key]
        }
        return this.copy[key]
    }

    set(key, value) {
        if (!this.modifed) {
            this.modifing()
        }
        return this.copy[key] = value
    }

    modifing() {
        if (this.modifed) return
        this.modifed = true
        this.copy = Array.isArray(this.base)
            ? this.base.slice()
            : { ...this.base }
    }
}

const handler = {
    get(target, key) {
        if (key === PROXY_STATE) return target
        return target.get(key)
    },
    set(target, key, value) {
        return target.set(key, value)
    },
}


export function produce(baseState, producer) {
    const state = new State(baseState)
    const proxy = new Proxy(state, handler)

    producer(proxy)

    const newState = proxy[PROXY_STATE]

    if (newState.modifed) {
        return newState.copy
    }
    return newState.base

}