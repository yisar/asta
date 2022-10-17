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
  const data = await fetch("https://www.taptap.com/webapiv2/app/v2/detail-by-id/37782?X-UA=V%3D1%26PN%3DWebApp%26LANG%3Dzh_CN%26VN_CODE%3D92%26VN%3D0.1.0%26LOC%3DCN%26PLT%3DPC%26DS%3DAndroid%26UID%3D9368eaa1-0aaf-4db2-9779-19ca3cbf9125%26DT%3DPC%26OS%3DmacOS%26OSV%3D12.6.0").then((res) => res.json()).then((data2) => {
    return data2.data;
  });
  const imgs = data.screenshots.map((i) => i.url);
  const title = data.title + data.title_labels[0];
  return {
    title,
    rate: "8.4",
    comments,
    imgs
  };
};
var app_default = ({ title, comments, rate, imgs }) => {
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
