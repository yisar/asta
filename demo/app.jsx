import {addCount} from '~action/count.js'

export const loader = async (req) => {
	const count = req.query.count || 0
	const list = [1, 2, 3]
	return {
		rate: '8.4',
		count,
		list
	}
}

export default ({ count, list, rate }) => {
	return (
		<main>
			<header>
				<img src="https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip" alt=""></img>
				<h1>Can You Escape VintageBungalow</h1>
				<div class="rate">{rate}</div>
			</header>
			<button $onclick={addCount}>{count}</button>
		</main>
	)
}

