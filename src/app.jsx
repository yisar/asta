export const loader = async (req) => {
	const count = req.query.count || 0
	return {
		count,
	}
}

export default ({ count }) => {
	return (
		<main>
			<button $onclick="./todo.js?fn=AddCount">{count}</button>
		</main>
	)
}
