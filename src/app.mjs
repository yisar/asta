import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

// demo/app.jsx
var loader = async (req) => {
  const data = await fetch("http://localhost:1234/data").then((res) => res.json()).then((data2) => data2);
  return {
    ...data,
    count: 0
  };
};
var Header = ({ cover, title, rate }) => s.openTag("header", {}) + s.openTag("img", { "src": { cover }, "alt": "" }) + s.closeTag("img") + s.openTag("h1", {}) + s.expression(title) + s.closeTag("h1") + s.openTag("div", { "class": "rate" }) + s.expression(rate) + s.closeTag("div") + s.closeTag("header");
var app_default = ({ title, comments, rate, imgs, info, cover, count }) => {
  return s.openTag("div", {}) + s.component(Header, { "cover": { cover }, "title": { title }, "rate": { rate } }) + s.empty(Header) + s.openTag("main", {}) + s.openTag("button", { "$onclick": { addCount } }) + "Count: " + s.expression(count) + s.closeTag("button") + s.closeTag("main") + s.openTag("div", { "class": "screenshot" }) + s.openTag("h3", {}) + "\u622A\u56FE" + s.closeTag("h3") + s.openTag("ul", {}) + s.expression(imgs.map((i) => s.openTag("li", {}) + s.openTag("img", { "src": { i } }) + s.closeTag("img") + s.closeTag("li"))) + s.closeTag("ul") + s.closeTag("div") + s.openTag("div", { "class": "screenshot" }) + s.openTag("h3", {}) + "\u7B80\u4ECB" + s.closeTag("h3") + s.openTag("p", {}) + s.expression(info) + s.closeTag("p") + s.closeTag("div") + s.openTag("div", { "class": "comments" }) + s.openTag("h3", {}) + "\u8BC4\u4EF7" + s.closeTag("h3") + s.openTag("ul", {}) + s.expression(comments.map(({ avatar, name, content }) => s.openTag("li", {}) + s.openTag("div", { "class": "bio" }) + s.openTag("img", { "class": "avatar", "src": { avatar } }) + s.closeTag("img") + s.openTag("b", { "class": "name" }) + s.expression(name) + s.closeTag("b") + s.closeTag("div") + s.openTag("p", {}) + s.expression(content) + s.closeTag("p") + s.closeTag("li"))) + s.closeTag("ul") + s.closeTag("div") + s.closeTag("div");
};
export {
  app_default as default,
  loader
};
