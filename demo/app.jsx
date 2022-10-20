import { addCount } from '~action/count.js'

export const loader = async (req) => {
	// await new Promise(r=> setTimeout(()=>r(null), 100))
	const data = await fetch('http://localhost:1234/data')
		.then((res) => res.json())
		.then((data) => data)
	return {
		...data,
		count: 0,
	}
}

export default ({ title, comments, rate, imgs, info, cover, count }) => {
	return (
		<div>
			<header>
				<img src={cover} alt=""></img>
				<h1>{title}</h1>
				<div class="rate">{rate}</div>
			</header>
			<main>
				<button $onclick={addCount}>Count: {count}</button>
			</main>
			<div class="screenshot">
				<h3>截图</h3>
				<ul>
					{imgs.map((i) => (
						<li>
							<img src={i}></img>
						</li>
					))}
				</ul>
			</div>

			<div class="screenshot">
				<h3>简介</h3>
				<p>{info}</p>
			</div>

			<div class="comments">
				<h3>评价</h3>
				<ul>
					{comments.map(({ avatar, name, content }) => (
						<li>
							<div class="bio">
								<img class="avatar" src={avatar}></img>
								<b class="name">{name}</b>
							</div>
							<p>{content}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
