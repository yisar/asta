import { addCount } from '~action/count.js'

export const loader = async (req) => {
	const comments = [
		{
			name: '阿呆',
			avatar:
				'https://img3.tapimg.com/default_avatars/755e9ca449be08245191a743a128a8df.jpg?imageMogr2/auto-orient/strip/thumbnail/!300x300r/gravity/Center/crop/300x300/format/jpg/interlace/1/quality/80',
			content: 'bdbnxjcjcjj',
		},
		{
			name: '迪卢克',
			avatar:
				'https://img3.tapimg.com/default_avatars/7d713c00e515de52a63c0f51c8697c84.jpg?imageMogr2/auto-orient/strip/thumbnail/!300x300r/gravity/Center/crop/300x300/format/jpg/interlace/1/quality/80',
			content: 'Vbjjnnn😂',
		},
	]
	const data = await fetch('https://www.taptap.com/webapiv2/app/v2/detail-by-id/37782?X-UA=V%3D1%26PN%3DWebApp%26LANG%3Dzh_CN%26VN_CODE%3D92%26VN%3D0.1.0%26LOC%3DCN%26PLT%3DPC%26DS%3DAndroid%26UID%3D9368eaa1-0aaf-4db2-9779-19ca3cbf9125%26DT%3DPC%26OS%3DmacOS%26OSV%3D12.6.0').then(res=>res.json()).then(data=>{
		return data.data
	})

	const imgs = data.screenshots.map(i=>i.url)
	const title = data.title+data.title_labels[0]
	return {
		title,
		rate: '8.4',
		comments,
		imgs,
	}
}

export default ({ title, comments, rate, imgs }) => {
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
				<p>
					Can You Escape VintageBungalow is new android escape game developed by KnfGame.In this game your locked inside a Vintage Bungalow
					House, the only way to escape from bungalow is to find the hidden key. For that you have click on the useful objects around the
					house and solve some interesting puzzles to find the hidden key. Good Luck and have fun playing Knf escape games and free online
					point and click escape games.
				</p>
			</div>

			<div class="comments">
				<h3>评价</h3>
				<ul>
					{comments.map(({avatar, name, content}) => {
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
