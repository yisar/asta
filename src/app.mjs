import {s} from './s.mjs';
// asta-path:asta:path
var addCount = "./action.js?mod=addCount";

// src/app.jsx
var loader = async (req) => {
  const count = req.query.count || 0;
  return {
    count
  };
};
var app_default = ({ count }) => {
  return s.openTag("main", { "data-id": 2 }) + s.openTag("button", { "$onclick": { addCount }, "data-id": 1 }) + s.text(count) + s.closeTag("button") + s.closeTag("main");
};
export {
  app_default as default,
  loader
};
