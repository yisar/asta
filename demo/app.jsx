import { addCount } from '~action/count.js'

export const loader = async (req) => {
	const data = await fetch('http://localhost:1234/data')
		.then((res) => res.json())
		.then((data) => data)
	return data
}

export default ({ title, comments, rate, imgs, info }) => {
	return (
		<div>
			<header>
				<img src="https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip" alt=""></img>
				<h1>{title}</h1>
				<div class="rate">{rate}</div>
			</header>
			<main>
				<button $onclick={addCount}>下载TapTap客户端</button>
			</main>
			<div class="screenshot">
				<h3>截图</h3>
				<ul>
					{imgs.map((i) => {
						return (
							<li>
								<img src={i}></img>
							</li>
						)
					})}
				</ul>
			</div>

			<div class="screenshot">
				<h3>简介</h3>
				<p>{info}</p>
			</div>

			<div class="comments">
				<h3>评价</h3>
				<ul>
					{comments.map(({ avatar, name, content }) => {
						return (
							<li>
								<div class="bio">
									<img class="avatar" src={avatar}></img>
									<b class="name">{name}</b>
								</div>
								<p>{content}</p>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
