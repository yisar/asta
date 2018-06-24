<p align="center"><img src="http://ww1.sinaimg.cn/large/85564debgy1froiubji5aj207f03nq34.jpg" alt="smox logo"></p>
<p align="center">
<a href="https://npmjs.com/package/smox" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/smox.svg?style=flat" alt="NPM version"></a> &nbsp;
<a href="https://npmjs.com/package/smox" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dm/smox.svg?style=flat" alt="NPM downloads"></a>
</p>

## 介绍
smox （[Github戳我](https://github.com/132yse/smox)）是一个使用 New Content API 的 React 状态管理库，它参考了 vuex 的 API 设计，同时使用 ES6 Proxy ，解决了 Redux 的痛点，使得 React 状态管理有了更优雅的体验。


### 快速上手
为了更直白的感受到 smox 的优雅，我特地写了这个[三分钟快速上手→](/quickstart/)

### 特征（Features）
:pig_nose: 内部使用 New Context API，对外的 API 和 vuex 完全一致，解决 redux 的痛点，吸收 vuex 的优点

:jack_o_lantern: 使用 Proxy 实现的相应机制，从此再也不需要手动优化性能

:ghost: 1KB gzipped ，极小的体积，无第三方依赖

### 名称由来
smox，由 `SM` 、`OX` 两个缩写而成，是我的个人尿性体现，先 `sm` 再 `ox` 是很骚的操作√

### 和同类工具的对比（Why not？）
首先，smox 相比较 redux 是一定进步了的，不作为对比项，以下是和同为`进步品`的比对，我是 smox 的作者，以下可能有王婆卖瓜的成分，仅供参考

#### Rematch / dva
rematch 和 dva都是对 redux 的 api 的封装，使得写起来好看又优雅，但是他们都不能摆脱 redux 的 action type 的局限，也没有数据劫持机制，意味着性能仍然要手动优化，此外，经过两者的包装后的语法糖仍然不如 smox 的好看

#### mobx5
smox 和 mobx5 内部同样用了 Proxy 进行数据劫持，但是 mobx 是通过装饰器包装函数，使其成为观察者和被观察者，而 smox 是只观察 state 的变化，然后每次 dispatch 的时候进行劫持，代码会更好看

#### vuex
smox 是和 vuex 几乎一模一样的，所以 vuex 是我认为最好的 redux ，smox 对比 vuex，只是文件变得更小，`Pxoxy` 比 `Object.defineproperty` 更新而已

### 使用时机（When used？）
react 社区内很普遍的一个误区便是在 redux 中集中大量业务逻辑，这永远不是一个好行为

smox 比较提倡`需要大规模组件共享`、`需要两套状态管理（如ssr）`、的时候才使用 smox，所以大部分场景是不需要的，这里要引用 redux 作者 Dan 的一句话:
> Flux libraries are like glasses: you’ll know when you need them.  —— Dan Abramov
