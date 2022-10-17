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
  return {
    count
  };
};
var app_default = ({ count }) => {
  return h("main", { children: [
    h("button", { "$onclick": { addCount }, children: [count] })
  ] });
};
export {
  app_default as default,
  loader
};
