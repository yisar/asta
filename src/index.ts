import { createApp } from './app'

let s = document.currentScript
if (s && s.hasAttribute('init')) {
  createApp().mount()
}
