import {h} from './h.mjs';
const state = { count: 0 }

const view = ({ count }) => {
	return h('main',{children:[
		h('button', {"$onclick":"./todo.js?fn=AddCount",children:[
			count
		]})
	]})
}
export { view, state }
