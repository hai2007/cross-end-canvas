// 线性渐变
export let linearGradient = function (painter, x0, y0, x1, y1) {
    let gradient = painter.createLinearGradient(x0, y0, x1, y1);
    let enhanceGradient = {
        "value": function () {
            return gradient;
        },
        "addColorStop": function (stop, color) {
            gradient.addColorStop(stop, color);
            return enhanceGradient;
        }
    };
    return enhanceGradient;
};

// 环形渐变
export let radialGradient = function (painter, cx, cy, r) {
    let gradient = painter.createRadialGradient(cx, cy, 0, cx, cy, r);
    let enhanceGradient = {
        "value": function () {
            return gradient;
        },
        "addColorStop": function (stop, color) {
            gradient.addColorStop(stop, color);
            return enhanceGradient;
        }
    };
    return enhanceGradient;
};
