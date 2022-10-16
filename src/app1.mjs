var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.jsx
var app_exports = {};
__export(app_exports, {
  default: () => app_default,
  loader: () => loader
});
module.exports = __toCommonJS(app_exports);
var loader = async (req) => {
  const count = req.query.count || 0;
  return {
    count
  };
};
var app_default = ({ count }) => {
  return s.openTag("main", { "data-id": 2 }) + s.openTag("button", { "$onclick": { addCount }, "data-id": 1 }) + s.text(count) + s.closeTag("button") + s.closeTag("main");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loader
});
