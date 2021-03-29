# Snel

Next generation front end framework

### Use

With SFC:

```html
<div @click={add} style={position: 'fixed'}>{count}</div>

<script>
    let count = 0
    let add = () => count++
</script>
```

With runtime:

```js
Snel({
  count: 0,
  add: () => {
    this.count++
  },
  node: '#app',
  view: `<div @click={add} style={position: 'fixed'}>{count}</div>`
})
```

### License

MIT ©yisar
