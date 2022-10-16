import {s} from './s.mjs';
const state = { count: 0 }

const view = ({ count }) => {
	return s.openTag('main',{"data-id": 2})+
		s.openTag('button' ,{"$onclick":"./todo.js?fn=AddCount","data-id": 1})+
			s.text(count)+
		s.closeTag('button')+
	s.closeTag('main')
}
export { view, state }
