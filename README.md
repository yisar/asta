# Asta

SSR resumable framework

# Run demo

```shell
yarn compile
yarn start
```

### Use

input:
```jsx
// view
export default ({ count }) =>
    <main><button $onclick={add}>{count}</button></main>
    
// action
export const AddCount = (state, event) => {
    return {
        ...state,
        count: state.count+1,
    }
}

// state
export default {
	count: 0
}
```
output:

```html
<main><button $onclick="./action.js?fn=AddCount" class="uuid">0</button></main>
```

### 核心优化

asta 是一个 ssr 特化的框架，它核心的两个优化

1. client 端 0 js

asta 第一个优化，首屏幕 html 是有事件的，js 根据交互懒加载，这种概念也被称之为 `Resumable`，不需要 `hydrate`， inspird by qwik

优化成果是不管业务多么复杂，都可以谷歌评分 100 分

2. server 端只有 html

asta 第二个优化，就是在 server 端只拼接 html，没有 vdom 的遍历，后续直接将 html 当作结构来使用，inspired by marko

两个优化，分别解决了 ssr 世界里的两个瓶颈

asta 是无敌的，好不夸张
