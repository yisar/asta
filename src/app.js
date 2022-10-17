import {h} from './h.mjs';
// asta-path:~action/count.js
var addCount = (state, event) => {
  return {
    ...state,
    count: state.count + 1
  };
};

// demo/app.jsx
var loader = async (req) => {
  const count = req.query.count || 0;
  const list = [1, 2, 3];
  return {
    count,
    list
  };
};
var app_default = ({ count, list }) => {
  return h("main", { children: [
    h("div", { children: [list.map((item) => h("li", { children: [item] }))] }),
    h("button", { "$onclick": { addCount }, children: [count] })
  ] });
};
export {
  app_default as default,
  loader
};
