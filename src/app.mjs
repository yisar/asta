import {s} from './s.mjs';
import {addCount} from './action.js'

export const loader = async (req) => {
	const count = req.query.count || 0
	return {
		count,
	}
}

export default ({ count }) => {
	return (
		s.openTag('main',{"data-id": 2})+
			s.openTag('button' ,{"$onclick":{addCount},"data-id": 1})+s.text(count)+s.closeTag('button')+
		s.closeTag('main')
	)
}
