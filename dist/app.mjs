import { h } from "./h.mjs";


const state = { count: 0 }

const view = ({ count }) =>
    h("main", {}, [
        h("button", { 'on:click': './todo.js?fn=AddCount', class: 'a' }, [count]),
    ])

export { view, state }