import {h} from './h.mjs';
// asta-path:~action/count.js
var addCount = async (state, event) => {
  await new Promise((r) => setTimeout(() => r(), 1e3));
  return {
    ...state,
    count: state.count + 1
  };
};

// demo/app.jsx
var loader = async (req) => {
  const data = await fetch("http://localhost:1234/data").then((res) => res.json()).then((data2) => data2);
  return {
    ...data,
    count: 0
  };
};
var Header = ({ cover, title, rate }) => /* @__PURE__ */ h("header", null, /* @__PURE__ */ h("img", {
  src: cover,
  alt: ""
}), /* @__PURE__ */ h("h1", null, title), /* @__PURE__ */ h("div", {
  class: "rate"
}, rate));
var app_default = ({ title, comments, rate, imgs, info, cover, count }) => {
  return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(Header, {
    cover,
    title,
    rate
  }), /* @__PURE__ */ h("main", null, /* @__PURE__ */ h("button", {
    $onclick: addCount
  }, "Count: ", count)), /* @__PURE__ */ h("div", {
    class: "screenshot"
  }, /* @__PURE__ */ h("h3", null, "\u622A\u56FE"), /* @__PURE__ */ h("ul", null, imgs.map((i) => /* @__PURE__ */ h("li", {
    key: i
  }, /* @__PURE__ */ h("img", {
    src: i
  }))))), /* @__PURE__ */ h("div", {
    class: "screenshot"
  }, /* @__PURE__ */ h("h3", null, "\u7B80\u4ECB"), /* @__PURE__ */ h("p", null, info)), /* @__PURE__ */ h("div", {
    class: "comments"
  }, /* @__PURE__ */ h("h3", null, "\u8BC4\u4EF7"), /* @__PURE__ */ h("ul", null, comments.map(({ avatar, name, content }) => /* @__PURE__ */ h("li", {
    key: name
  }, /* @__PURE__ */ h("div", {
    class: "bio"
  }, /* @__PURE__ */ h("img", {
    class: "avatar",
    src: avatar
  }), /* @__PURE__ */ h("b", {
    class: "name"
  }, name)), /* @__PURE__ */ h("p", null, content))))));
};
export {
  app_default as default,
  loader
};
