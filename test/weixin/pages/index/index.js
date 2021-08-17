// index.js
// 获取应用实例
const app = getApp()

import CrossEndCanvas from 'cross-end-canvas';

Page({
    doit() {
        CrossEndCanvas({
            id: "canvas",
            platform: "weixin",
            target: this
        }).then(function (painter) {
            console.log(painter);
        });
    }
});
