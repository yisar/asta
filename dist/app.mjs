import {h} from './h.mjs';
const state = { count: 0 }

const view = ({ count }) =>
    h('main',{children:[h('button', {"$onclick":"./todo.js?fn=AddCount" ,"class":"a",children:[count]})]})
export { view, state }