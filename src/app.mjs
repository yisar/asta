import {s} from './s.mjs';
const state = { count: 0 }

const view = ({list}) => s.openTag('div',{"data-id": 2})+s.text(list.map(i=>s.openTag('i',{"data-id": 1})+s.text(i)+s.closeTag('i')))+s.closeTag('div')
export { view, state }
