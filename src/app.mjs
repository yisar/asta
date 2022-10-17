import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

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
  return s.openTag("main", { "data-id": 6 }) + s.openTag("header", { "data-id": 4 }) + s.openTag("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "", "data-id": 1 }) + s.closeTag("img") + s.openTag("h1", { "data-id": 2 }) + "Can You Escape VintageBungalow" + s.closeTag("h1") + s.openTag("div", { "class": "rate", "data-id": 3 }) + s.expression(rate) + s.closeTag("div") + s.closeTag("header") + s.openTag("button", { "$onclick": { addCount }, "data-id": 5 }) + s.expression(count) + s.closeTag("button") + s.closeTag("main");
};
export {
  app_default as default,
  loader
};
