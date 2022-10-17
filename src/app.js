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
  const data = await fetch("http://localhost:1234/data").then((res) => res.json()).then((data2) => data2);
  return data;
};
var app_default = ({ title, comments, rate, imgs, info }) => {
  return h("div", { children: [
    h("header", { children: [
      h("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "" }),
      h("h1", { children: [title] }),
      h("div", { "class": "rate", children: [rate] })
    ] }),
    h("main", { children: [
      h("button", { "$onclick": { addCount }, children: ["\u4E0B\u8F7DTapTap\u5BA2\u6237\u7AEF"] })
    ] }),
    h("div", { "class": "screenshot", children: [
      h("h3", { children: ["\u622A\u56FE"] }),
      h("ul", { children: [
        imgs.map((i) => {
          return h("li", { children: [
            h("img", { "src": { i } })
          ] });
        })
      ] })
    ] }),
    h("div", { "class": "screenshot", children: [
      h("h3", { children: ["\u7B80\u4ECB"] }),
      h("p", { children: [info] })
    ] }),
    h("div", { "class": "comments", children: [
      h("h3", { children: ["\u8BC4\u4EF7"] }),
      h("ul", { children: [
        comments.map(({ avatar, name, content }) => {
          return h("li", { children: [
            h("div", { "class": "bio", children: [
              h("img", { "class": "avatar", "src": { avatar } }),
              h("b", { "class": "name", children: [name] })
            ] }),
            h("p", { children: [content] })
          ] });
        })
      ] })
    ] })
  ] });
};
export {
  app_default as default,
  loader
};
