import {h} from './h.mjs';
import {addCount} from '~action/count.js'

export const loader = async (req) => {
	const count = req.query.count || 0
	return {
		count,
	}
}

export default ({ count }) => {
	return (
		h('main',{children:[
			h('button', {"$onclick":{addCount},children:[count]})
		]})
	)
}
