
let CrossEndCanvas = config => new Promise((resolve, reject) => {

    if (config.platform == 'web') {

        resolve(document.getElementById(config.id).getContext('2d'));

    } else if (config.platform == 'uni-app') {

        resolve(uni.createCanvasContext(config.id, config.target));

    } else if (config.platform == 'weixin') {

        wx.createSelectorQuery().in(config.target).select('#' + config.id)
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node;
                const painter = canvas.getContext('2d');

                canvas.width = res[0].width * dpr;
                canvas.height = res[0].height * dpr;
                ctx.scale(dpr, dpr);

                resolve(painter);
            });

    } else {
        reject('你必须配置一个合法的平台');
    }

}).then(painter => {

    let enhancePainter = {

    };

    return enhancePainter;
});

// 根据运行环境，导出接口
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = CrossEndCanvas;
} else {
    window.CrossEndCanvas = CrossEndCanvas;
}
