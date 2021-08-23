export { createApp } from './app'
export { nextTick } from './scheduler'
export { observable, observable as reactive } from './observer'

import { createApp } from './app'

let s
if ((s = document.currentScript) && s.hasAttribute('init')) {
  createApp().mount()
}
