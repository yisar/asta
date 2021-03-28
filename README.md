# Asta

Next generation front end framework

### Use

With SFC:

```html
<div click={add}>{count}</div>

<script>
    let count = 0
    let add = () => count++
</script>
```

With Browser:

```js
let ctx = {
  count: 0,
  add: () => ctx.count++,
  view: `<div click={add}>{count}</div>`
}
```

Compile to:

```js
let ctx = [0, () => ctx[0]++]
let view = (ctx) => {
  open('div')
    attr('click', ctx[0])
    text(ctx[1])
  close('div')  
}
view(ctx)
```


### License

MIT ©yisar
