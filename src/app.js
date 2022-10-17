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
  const comments = [
    {
      name: "\u963F\u5446",
      avatar: "https://img3.tapimg.com/default_avatars/755e9ca449be08245191a743a128a8df.jpg?imageMogr2/auto-orient/strip/thumbnail/!300x300r/gravity/Center/crop/300x300/format/jpg/interlace/1/quality/80",
      content: "bdbnxjcjcjj"
    },
    {
      name: "\u8FEA\u5362\u514B",
      avatar: "https://img3.tapimg.com/default_avatars/7d713c00e515de52a63c0f51c8697c84.jpg?imageMogr2/auto-orient/strip/thumbnail/!300x300r/gravity/Center/crop/300x300/format/jpg/interlace/1/quality/80",
      content: "Vbjjnnn\u{1F602}"
    }
  ];
  const imgs = [
    "https://img.tapimg.com/market/images/de62537f7b8aad4f6b8b53cb968901f0.png?imageView2/2/h/560/w/9999/q/80/format/jpg/interlace/1/ignore-error/1",
    "https://img.tapimg.com/market/images/123ec01bb9b5c42de4fa214303cf1383.png?imageView2/2/h/560/w/9999/q/80/format/jpg/interlace/1/ignore-error/1",
    "https://img.tapimg.com/market/images/286c9889acad05a6e3ae2f07b5035760.png?imageView2/2/h/560/w/9999/q/80/format/jpg/interlace/1/ignore-error/1",
    "https://img.tapimg.com/market/images/ea16c10e162a5b9b2e2fe6746a1de6f3.png?imageView2/2/h/560/w/9999/q/80/format/jpg/interlace/1/ignore-error/1"
  ];
  return {
    rate: "8.4",
    count,
    comments,
    imgs
  };
};
var app_default = ({ count, comments, rate, imgs }) => {
  return h("div", { children: [
    h("header", { children: [
      h("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "" }),
      h("h1", { children: ["Can You Escape VintageBungalow \u5C01\u6D4B\u56FD\u9645\u670D"] }),
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
      h("p", { children: ["\n					Can You Escape VintageBungalow is new android escape game developed by KnfGame.In this game your locked inside a Vintage Bungalow\n					House, the only way to escape from bungalow is to find the hidden key. For that you have click on the useful objects around the\n					house and solve some interesting puzzles to find the hidden key. Good Luck and have fun playing Knf escape games and free online\n					point and click escape games.\n				"] })
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
