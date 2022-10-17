import {addCount} from '~action/count.js'

export const loader = async (req) => {
	const count = req.query.count || 0
	const list = [1, 2, 3]
	return {
		count,
		list
	}
}

export default ({ count, list }) => {
	return (
		<main>
			<div>{list.map(item=><li>{item}</li>)}</div>
			<button $onclick={addCount}>{count}</button>
		</main>
	)
}
