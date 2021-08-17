
let CrossEndCanvas = {

};

// 根据运行环境，导出接口
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = CrossEndCanvas;
} else {
    window.CrossEndCanvas = CrossEndCanvas;
}
