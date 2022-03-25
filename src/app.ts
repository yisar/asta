import { observable } from './observer'
import { isStr } from './util'

let rootBlocks = []

export const createApp = (init?: any) => {
    let ctx = createContext()
    if(init){
        ctx.scope = observable(init)
    }
  return {
    mount(el?: string | Element | null) {
      if (isStr(el)) {
        el = document.querySelector(el)
      }
      el = el || document.documentElement
      let roots:Element[] = []
      roots = [...el.querySelectorAll(`[v-scope]`)]
      rootBlocks = roots.map((el) => new Block(el, ctx, true))
      return this
    },
  }
}
