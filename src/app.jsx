const state = { count: 0 }

const view = ({ count }) => {
	return <main>
		<button $onclick="./todo.js?fn=AddCount">
			{count}
		</button>
	</main>
}
export { view, state }
