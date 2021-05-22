import { asta } from './runtime.js'

/** 
升级功能点
1、将数据和事件从options 移出到core下面，
   防止用户定义的属性和框架使用的冲突
2、支持props传递
3、抽出AstaBase
4、完整的customElements 实现， 标签不再与声明时的instance相引用
   可以在html写标记或 document.createElement('my-counter')
希望下步优化的点：
1、generate函数能自动生成 core前缀，模板编写时就不需要core。 模板支持if,for 虽然我还没有读generate代码 ！
2、自定义事件的支持，比如冒泡和compose等。 比如 this.emit("countChange") 而外部可以用addEventListener来监听到
3、表单类自定义元素支持（这块的标准还没有认真学习过，汗！）
4、css的导入 以及 part选择器。 支持完备的css功能吧！
5、slot相关功能实现
6、类似svelte一样的标记脏位，最小化更新
7、。。。无穷多想加入进来 ，想测试能不能行通！ 
*/
asta(() => ({
  count: 0,
  add: function () {
    this.core.count += +this.props.step
  },
}),
  {
    tag: 'my-counter',
    props: ['btn-text', 'step'],
    view: `<div>step={props.step},count={ core.count }</div> 
          <button @click="core.add"> { props['btn-text']}</button>`,
    onCreate: console.log,
    onUpdate: console.log,
    onDestory: console.log,
  })
let el = document.createElement('my-counter')
el.setAttribute('btn-text', '增加计数5')
el.setAttribute('step', 5) 
document.body.append(el)

let e2 = document.createElement('my-counter')
 e2.setAttribute('btn-text', '增加计数10') 
 e2.setAttribute('step', 10) 
 document.body.append(e2)