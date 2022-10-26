<p align="center"><img width="300" alt="image" src="https://user-images.githubusercontent.com/12951461/196841960-7e297a6d-0a83-4343-b4a2-8b4caa0f858b.png"></p>


# Asta [![NPM version](https://img.shields.io/npm/v/asta.svg)](https://npmjs.com/package/asta) [![NPM downloads](https://img.shields.io/npm/dt/eplayer.svg)](https://npmjs.com/package/asta)

:dart: Asta is a highly specialized full stack framework for SSR. It has no vdom on the server side and 0 js on the client side. Finally, it gets best QPS and Google scores.

> Note this is early Development! It is not recommended to use this for anything serious yet.

- no VDOM on server, 0 javascript on client.
- write JSX and react-like syntax.



### Run demo

```shell
yarn start
```


### Syntax

input:

```jsx
const addCount = $import('./action.js#addCount')

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
			<button onclick={addCount}>{count}</button>
		</main>
	)
}
```

output:

```html
<main><button $onclick="./action/count.js?mod=addCount">0</button></main>
```

### Compiler

Jointing on server, Resumable on client

```js
// jsx input
const view = ({list}) => <div>{list.map(i=><i>{i}</i>)}</div>
// server output
const view = ({list}) => s.openTag('div')+s.expression(list.map(i=>s.openTag('i')+s.text(i)+s.closeTag('i')))+s.closeTag('div')
// client output
const view = ({list}) => h('div',{children:[list.map(i=>h('i',{children:[i]}))]})
```

# How and why

### How is This Different from Next.js, Remix.js, Fresh.js or Other SSR Solutions?

There are two biggest differences. 

First, the server side. Asta does not run any VDOM-based framework runtime. It generates the `s function` through the compiler, which is only used for string splicing. At this point, it is a little like Marko.js.

Second, on the client side, Asta is 0 javascript, and it does not require any hydration. This is a new concept, called Resumable, a little like qwik.js.

So, `Asta ≈ Marko + Qwik`.

Because there is no Vdom overhead on the server side, Asta can get super high QPS and throughput.

Then because the client side is 0 js, it can continuously get a high Google score, and the score will not decrease with the increase of components.

### How is This Different from Qwik.js or Marko.js?

In principle, asta is the sum of them, Asta is a double optimization, but the implementation details are quite different.

At the same time, Asta attempts to migrate Elm's mental model to SSR. 

There is only a single state tree, and components are pure functions without states or any overhead. 

These helps to completely solve performance problems.

### Why not Fre SSR or and other Vdom-based frameworks?

Although JSX of fre can also be optimized at compile time, and the client side can also be selective hydrated, it is important that Fre or other Vdom-based framework components are not completely cost free.

### 说人话？

Asta 的核心是根治性能问题，已知的 SSR 框架有几个性能瓶颈：

1. server 端的 vdom 开销，组件开销

- server 端生成和遍历 vdom 成本是巨大的，Asta 在 server 端没有 vdom，它通过一个特殊的编译器将 jsx 编译成 s 函数，只用来拼接字符串

- server 端组件的初始化，状态更新，生命周期的开销，也是巨大的，Asta 也有组件，但它的组件是纯函数，也只用来拼接字符串，没有任何私有状态和生命周期，这得益于 Elm 的心智模型，单 state tree，组件是纯函数

2. client 0 js

- 一个新兴的概念，叫做 Resumable，client 不再水合，而是将必要的信息序列化到 html 里，然后直接从 html 进行恢复，所有的 js 都根据交互懒加载，这样就可以做到 0 js，0 水合，而且这是 O(1) 的，不会因为业务增长而性能下降

Asta 双重优化，彻底根除 SSR 的性能瓶颈


