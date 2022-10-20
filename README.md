<p align="center"><img width="582" alt="image" src="https://user-images.githubusercontent.com/12951461/196841103-6f109262-27a5-4f78-8795-1d59b91e8f88.png"></p>

# Asta [![NPM version](https://img.shields.io/npm/v/asta.svg)](https://npmjs.com/package/asta) [![NPM downloads](https://img.shields.io/npm/dt/eplayer.svg)](https://npmjs.com/package/asta)

:dart: SSR resumable framework.


### Run demo

```shell
yarn build
yarn start
```

### Use

input:

```jsx
// esbuild loader return path in server
import { addCount } from '~action/count.js' 

// state: will run in server and inject to client
export const loader = async (req) => {
	return {
		count: req.query.count,
	}
}

// view: will run in both client and server, but s() in server h() in client
export default ({ count }) => {
	return (
		<main>
			<button $onclick={addCount}>{count}</button>
		</main>
	)
}
```

output:

```html
<main><button $onclick="./action/count.js?mod=addCount" data-id="1">0</button></main>
```

### Compiler

Sdom in server, Vdom in client

```js
// jsx input
const view = ({list}) => <div>{list.map(i=><i>{i}</i>)}</div>
// server output
const view = ({list}) => s.openTag('div')+s.expression(list.map(i=>s.openTag('i')+s.text(i)+s.closeTag('i')))+s.closeTag('div')
// client output
const view = ({list}) => h('div',{children:[list.map(i=>h('i',{children:[i]}))]})
```

### 核心优化

asta 是一个 ssr 特化的框架，它核心的两个优化

1. client 端 0 js

asta 第一个优化，首屏幕 html 是有事件的，js 根据交互懒加载，这种概念也被称之为 `Resumable`，不需要 `hydrate`， inspird by qwik.js

优化成果是不管业务多么复杂，都可以谷歌评分 100 分

2. server 端只有 html

asta 第二个优化，就是在 server 端只拼接 html，没有 vdom 的遍历，后续直接将 html 当作结构来使用，inspired by marko.js

两个优化，分别解决了 ssr 世界里的两个瓶颈

asta 是无敌的，毫不夸张
