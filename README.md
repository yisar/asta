# Asta

Next generation front end framework

### Use

With SFC:

```html
<div @click={add} style={position: fixed}>{count}</div>

<script>
    let count = 0
    let add = () => count++
</script>
```

Compile to:

```js
const Counter = () => {
  let count = 0
  let add = () => count++
  
  return () => {
    open('div')
      event('click', add)
      attr('style', 'position: fixed')
      text(count)
    close('div')  
  }
}
```

### License

MIT ©yisar
