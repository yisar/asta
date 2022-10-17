import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

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
  return s.openTag("main", { "data-id": 4 }) + s.openTag("div", { "data-id": 2 }) + s.expression(list.map((item) => s.openTag("li", { "data-id": 1 }) + s.expression(item) + s.closeTag("li"))) + s.closeTag("div") + s.openTag("button", { "$onclick": { addCount }, "data-id": 3 }) + s.expression(count) + s.closeTag("button") + s.closeTag("main");
};
export {
  app_default as default,
  loader
};
