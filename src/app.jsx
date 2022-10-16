const state = async (req) => {
	const count = req.query.count || 0
	return {
		count,
	}
}

const view = ({ count }) => {
	return (
		<main>
			<button $onclick="./todo.js?fn=AddCount">{count}</button>
		</main>
	)
}
export { view, state }
