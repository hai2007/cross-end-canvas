import painterFactory from './painter/index';

let CrossEndCanvas = config => new Promise((resolve, reject) => {

    if (config.platform == 'web') {

        let canvas = document.getElementById(config.id);
        let width = canvas.clientWidth,//内容+内边距
            height = canvas.clientHeight;

        // 设置显示大小
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        // 设置画布大小（画布大小设置为显示的二倍，使得显示的时候更加清晰）
        canvas.setAttribute('width', width * 2);
        canvas.setAttribute('height', height * 2);

        let painter = canvas.getContext("2d");

        // 通过缩放实现模糊问题
        painter.scale(2, 2);

        resolve([painter, config.platform]);

    } else if (config.platform == 'uni-app') {

        resolve([uni.createCanvasContext(config.id, config.target), config.platform]);

    } else if (config.platform == 'weixin') {

        let dpr = wx.getSystemInfoSync().pixelRatio;
        wx.createSelectorQuery().in(config.target).select('#' + config.id)
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node;
                const painter = canvas.getContext('2d');

                canvas.width = res[0].width * dpr;
                canvas.height = res[0].height * dpr;
                painter.scale(dpr, dpr);

                resolve([painter, config.platform]);
            });

    } else {
        reject('你必须配置一个合法的平台');
    }

}).then((data) => {
    return painterFactory(data[0], data[1]);
});

// 根据运行环境，导出接口
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = CrossEndCanvas;
} else {
    window.CrossEndCanvas = CrossEndCanvas;
}
