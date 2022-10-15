const state = { count: 0 }

const view = ({ count }) =>
    <main><button $onclick="./todo.js?fn=AddCount" class="a">{count}</button></main>
export { view, state }