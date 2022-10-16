import {h} from './h.mjs';
const state = { count: 0 }

const view = ({list}) => h('div',{children:[list.map(i=>h('i',{children:[i]}))]})
export { view, state }
