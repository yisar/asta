import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

// demo/app.jsx
var loader = async (req) => {
  const data = await fetch("http://localhost:1234/data").then((res) => res.json()).then((data2) => data2);
  return data;
};
var app_default = ({ title, comments, rate, imgs, info }) => {
  return s.openTag("div", { "data-id": 23 }) + s.openTag("header", { "data-id": 4 }) + s.openTag("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "", "data-id": 1 }) + s.closeTag("img") + s.openTag("h1", { "data-id": 2 }) + s.expression(title) + s.closeTag("h1") + s.openTag("div", { "class": "rate", "data-id": 3 }) + s.expression(rate) + s.closeTag("div") + s.closeTag("header") + s.openTag("main", { "data-id": 6 }) + s.openTag("button", { "$onclick": { addCount }, "data-id": 5 }) + "\u4E0B\u8F7DTapTap\u5BA2\u6237\u7AEF" + s.closeTag("button") + s.closeTag("main") + s.openTag("div", { "class": "screenshot", "data-id": 11 }) + s.openTag("h3", { "data-id": 7 }) + "\u622A\u56FE" + s.closeTag("h3") + s.openTag("ul", { "data-id": 10 }) + s.expression(imgs.map((i) => {
    return s.openTag("li", { "data-id": 9 }) + s.openTag("img", { "src": { i }, "data-id": 8 }) + s.closeTag("img") + s.closeTag("li");
  })) + s.closeTag("ul") + s.closeTag("div") + s.openTag("div", { "class": "screenshot", "data-id": 14 }) + s.openTag("h3", { "data-id": 12 }) + "\u7B80\u4ECB" + s.closeTag("h3") + s.openTag("p", { "data-id": 13 }) + s.expression(info) + s.closeTag("p") + s.closeTag("div") + s.openTag("div", { "class": "comments", "data-id": 22 }) + s.openTag("h3", { "data-id": 15 }) + "\u8BC4\u4EF7" + s.closeTag("h3") + s.openTag("ul", { "data-id": 21 }) + s.expression(comments.map(({ avatar, name, content }) => {
    return s.openTag("li", { "data-id": 20 }) + s.openTag("div", { "class": "bio", "data-id": 18 }) + s.openTag("img", { "class": "avatar", "src": { avatar }, "data-id": 16 }) + s.closeTag("img") + s.openTag("b", { "class": "name", "data-id": 17 }) + s.expression(name) + s.closeTag("b") + s.closeTag("div") + s.openTag("p", { "data-id": 19 }) + s.expression(content) + s.closeTag("p") + s.closeTag("li");
  })) + s.closeTag("ul") + s.closeTag("div") + s.closeTag("div");
};
export {
  app_default as default,
  loader
};
