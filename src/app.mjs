import {s} from './s.mjs';
// asta-path:~action/count.js
var addCount = "./action/count.js?mod=addCount";

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
  return s.openTag("div", { "data-id": 23 }) + s.openTag("header", { "data-id": 4 }) + s.openTag("img", { "src": "https://img.tapimg.com/market/icons/9e99c190fdb4f28136921fcc74a7467f_360.png?imageMogr2/auto-orient/strip", "alt": "", "data-id": 1 }) + s.closeTag("img") + s.openTag("h1", { "data-id": 2 }) + "Can You Escape VintageBungalow \u5C01\u6D4B\u56FD\u9645\u670D" + s.closeTag("h1") + s.openTag("div", { "class": "rate", "data-id": 3 }) + s.expression(rate) + s.closeTag("div") + s.closeTag("header") + s.openTag("main", { "data-id": 6 }) + s.openTag("button", { "$onclick": { addCount }, "data-id": 5 }) + "\u4E0B\u8F7DTapTap\u5BA2\u6237\u7AEF" + s.closeTag("button") + s.closeTag("main") + s.openTag("div", { "class": "screenshot", "data-id": 11 }) + s.openTag("h3", { "data-id": 7 }) + "\u622A\u56FE" + s.closeTag("h3") + s.openTag("ul", { "data-id": 10 }) + s.expression(imgs.map((i) => {
    return s.openTag("li", { "data-id": 9 }) + s.openTag("img", { "src": { i }, "data-id": 8 }) + s.closeTag("img") + s.closeTag("li");
  })) + s.closeTag("ul") + s.closeTag("div") + s.openTag("div", { "class": "screenshot", "data-id": 14 }) + s.openTag("h3", { "data-id": 12 }) + "\u7B80\u4ECB" + s.closeTag("h3") + s.openTag("p", { "data-id": 13 }) + "\n					Can You Escape VintageBungalow is new android escape game developed by KnfGame.In this game your locked inside a Vintage Bungalow\n					House, the only way to escape from bungalow is to find the hidden key. For that you have click on the useful objects around the\n					house and solve some interesting puzzles to find the hidden key. Good Luck and have fun playing Knf escape games and free online\n					point and click escape games.\n				" + s.closeTag("p") + s.closeTag("div") + s.openTag("div", { "class": "comments", "data-id": 22 }) + s.openTag("h3", { "data-id": 15 }) + "\u8BC4\u4EF7" + s.closeTag("h3") + s.openTag("ul", { "data-id": 21 }) + s.expression(comments.map(({ avatar, name, content }) => {
    return s.openTag("li", { "data-id": 20 }) + s.openTag("div", { "class": "bio", "data-id": 18 }) + s.openTag("img", { "class": "avatar", "src": { avatar }, "data-id": 16 }) + s.closeTag("img") + s.openTag("b", { "class": "name", "data-id": 17 }) + s.expression(name) + s.closeTag("b") + s.closeTag("div") + s.openTag("p", { "data-id": 19 }) + s.expression(content) + s.closeTag("p") + s.closeTag("li");
  })) + s.closeTag("ul") + s.closeTag("div") + s.closeTag("div");
};
export {
  app_default as default,
  loader
};
