import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

// demo/app.jsx
var loader = async (req) => {
  const data = await fetch("http://localhost:1234/data").then((res) => res.json()).then((data2) => data2);
  return data;
};
var app_default = ({ title, comments, rate, imgs, info, cover }) => {
  return s.openTag("div", { "data-id": 344 }) + s.openTag("header", { "data-id": 353 }) + s.openTag("img", { "src": { cover }, "alt": "", "data-id": 366 }) + s.closeTag("img") + s.openTag("h1", { "data-id": 401 }) + s.expression(title) + s.closeTag("h1") + s.openTag("div", { "class": "rate", "data-id": 422 }) + s.expression(rate) + s.closeTag("div") + s.closeTag("header") + s.openTag("main", { "data-id": 469 }) + s.openTag("button", { "$onclick": { addCount }, "data-id": 480 }) + "\u4E0B\u8F7DTapTap\u5BA2\u6237\u7AEF" + s.closeTag("button") + s.closeTag("main") + s.openTag("div", { "class": "screenshot", "data-id": 543 }) + s.openTag("h3", { "data-id": 572 }) + "\u622A\u56FE" + s.closeTag("h3") + s.openTag("ul", { "data-id": 588 }) + s.expression(imgs.map((i) => s.openTag("li", { "data-id": 623 }) + s.openTag("img", { "src": { i }, "data-id": 635 }) + s.closeTag("img") + s.closeTag("li"))) + s.closeTag("ul") + s.closeTag("div") + s.openTag("div", { "class": "screenshot", "data-id": 700 }) + s.openTag("h3", { "data-id": 729 }) + "\u7B80\u4ECB" + s.closeTag("h3") + s.openTag("p", { "data-id": 745 }) + s.expression(info) + s.closeTag("p") + s.closeTag("div") + s.openTag("div", { "class": "comments", "data-id": 773 }) + s.openTag("h3", { "data-id": 800 }) + "\u8BC4\u4EF7" + s.closeTag("h3") + s.openTag("ul", { "data-id": 816 }) + s.expression(comments.map(({ avatar, name, content }) => s.openTag("li", { "data-id": 879 }) + s.openTag("div", { "class": "bio", "data-id": 891 }) + s.openTag("img", { "class": "avatar", "src": { avatar }, "data-id": 917 }) + s.closeTag("img") + s.openTag("b", { "class": "name", "data-id": 965 }) + s.expression(name) + s.closeTag("b") + s.closeTag("div") + s.openTag("p", { "data-id": 1013 }) + s.expression(content) + s.closeTag("p") + s.closeTag("li"))) + s.closeTag("ul") + s.closeTag("div") + s.closeTag("div");
};
export {
  app_default as default,
  loader
};
