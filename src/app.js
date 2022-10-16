import {h} from './h.mjs';
const state = async (req)=>{
	const count = req.query.count || 0
	return {
		count
	}
}

const view = ({ count }) => {
	return h('main',{children:[
		h('button', {"$onclick":"./todo.js?fn=AddCount",children:[
			count
		]})
	]})
}
export { view, state }
