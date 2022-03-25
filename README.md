# Asta

Simple compiler for web component

### Use
asta 函数接收2个参数，生成自定义元素的定义类，并自动define该类！ 最后返回该类！
declare var asta:(coreFn,options)=>CustomComponentClass;

* coreFn:  
	一个功能，无论是大到一个系统，一个页面，  还是小到一个组件，都永远是数据/事件和视图的关系！我现在的项目中，约定数据叫 appState,  数据+事件（或叫动作） 为appCore。 一个appCore是脱离视图而能独立表示一个应用的。
	此处coreFn的参数，表示它必须返回一个对象，对象包含着所有的数据和方法，
	比如示例返回 {count:number, add:()=>void}
* options:
	定义一个组件时的配置声明！
	+ tag: 组件将被定义的标签名
	+ props: 组件响应的属性。 props属性变化时，自动更新视图
	+ emits: 和vue一样， 只是指示性的作用。 表示该组件可能产生的事件。 以后考虑增加配置，约定事件的冒泡及compose属性
	+ view:  相当于vue的template 。 定义组件模板。以后考虑如何缓存它
	        目前绑定属性要写 {core.count} {props.step} @click="core.add" 。以后升级模板写法，尽量去掉core的前缀！
			而且现在访问  {name} {queued} 可能还把内部状态值暴露出来了。 也是不友好的
			是否改名为template?
	+ style: 插入到组件内的样式（默认样式隔离，相当于scoped）. style是否需要动态，像view一样，待讨论！

```js
import { asta } from 'asta'

asta(() => ({
  count: 0,
  add: function () {
    this.core.count += +this.props.step
  },
}),
  {
    tag: 'my-counter',
    props: ['btn-text', 'step'],
    emits:["create","update","destory"],  // 和vue一样， 只是指示性的作用。
    view: `<div>step={props.step},count={ core.count }</div> 
          <button @click="core.add"> { props['btn-text']}</button>`,
	style:`
		div{
			font-size:20px;
		}
	`
  })
```

### 如何使用自定义元素
定义一个tag元素之后， 该tag元素就和内置的div,p,a等标签一样，可以添加class,attrs,监听事件。 
甚至它可以无缝的应用到vue,react等框架中去！
原生API操作自定义元素如下：
```javascript
	let el = document.createElement('my-counter')
	el.setAttribute('btn-text', '增加计数5')
	el.setAttribute('step', 5) 
	document.body.append(el)
    // 原生事件也支持
	el.addEventListener("update",function(ev){
	console.log("组件更新",ev)
	})
```

### 未来计划等
* css的part已经默认支持
* slot已经默认支持。  是否像vue那样为slot传递scope待考虑。 因为这并不是web component标准的一部分