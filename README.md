<p align="center"><img width="300" alt="image" src="https://user-images.githubusercontent.com/12951461/196841960-7e297a6d-0a83-4343-b4a2-8b4caa0f858b.png"></p>


# Asta [![NPM version](https://img.shields.io/npm/v/asta.svg)](https://npmjs.com/package/asta) [![NPM downloads](https://img.shields.io/npm/dt/eplayer.svg)](https://npmjs.com/package/asta)

:dart: Asta is a highly specialized full stack framework for SSR. It has no vdom on the server side and 0 js on the client side. Finally, it gets best QPS and Google scores.

> Note this is early WIP! It is not recommended to use this for anything serious yet.

- no VDOM on server, 0 javascript on client.
- write JSX and react-like syntax.



### Run demo

```shell
yarn build
yarn start
```


### Syntax

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





