import {s} from './s.mjs';
const state = async (req)=>{
	const count = req.query.count || 0
	return {
		count
	}
}

const view = ({ count }) => {
	return s.openTag('main',{"data-id": 2})+
		s.openTag('button' ,{"$onclick":"./todo.js?fn=AddCount","data-id": 1})+
			s.text(count)+
		s.closeTag('button')+
	s.closeTag('main')
}
export { view, state }
