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
    rate: "8.4",
    count,
    list
  };
};
var app_default = ({ count, list, rate }) => {
  return h("main", { children: [
    h("header", { children: [
      h("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "" }),
      h("h1", { children: ["Can You Escape VintageBungalow"] }),
      h("div", { "class": "rate", children: [rate] })
    ] }),
    h("button", { "$onclick": { addCount }, children: [count] })
  ] });
};
export {
  app_default as default,
  loader
};
