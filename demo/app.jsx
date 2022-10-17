import {addCount} from '~action/count.js'

export const loader = async (req) => {
	const count = req.query.count || 0
	return {
		count,
	}
}

export default ({ count }) => {
	return (
		<main>
			<button $onclick={addCount}>{count}</button>
		</main>
	)
}
