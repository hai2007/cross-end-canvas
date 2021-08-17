/*!
 * cross-end-canvas - 提供跨端的canvas画笔，保持一致的绘图方法和效果，包括普通的web端、uniapp框架、微信小程序等小程序等。
 *
 * git+https://github.com/hai2007/cross-end-canvas.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 0.1.0-alpha.3
 *
 * Copyright (c) 2021 hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Tue Aug 17 2021 17:12:21 GMT+0800 (中国标准时间)
 */
(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  // 点（x,y）围绕中心（cx,cy）旋转deg度
  var rotate = function rotate(cx, cy, deg, x, y) {
    var cos = Math.cos(deg),
        sin = Math.sin(deg);
    return [+((x - cx) * cos - (y - cy) * sin + cx).toFixed(7), +((x - cx) * sin + (y - cy) * cos + cy).toFixed(7)];
  }; // r1和r2，内半径和外半径
  // beginA起点弧度，rotateA旋转弧度式


  function arc (beginA, rotateA, cx, cy, r1, r2, doback) {
    // 保证逆时针也是可以的
    if (rotateA < 0) {
      beginA += rotateA;
      rotateA *= -1;
    }

    var temp = [],
        p; // 内部

    p = rotate(0, 0, beginA, r1, 0);
    temp[0] = p[0];
    temp[1] = p[1];
    p = rotate(0, 0, rotateA, p[0], p[1]);
    temp[2] = p[0];
    temp[3] = p[1]; // 外部

    p = rotate(0, 0, beginA, r2, 0);
    temp[4] = p[0];
    temp[5] = p[1];
    p = rotate(0, 0, rotateA, p[0], p[1]);
    temp[6] = p[0];
    temp[7] = p[1];
    doback(beginA, beginA + rotateA, temp[0] + cx, temp[1] + cy, temp[4] + cx, temp[5] + cy, temp[2] + cx, temp[3] + cy, temp[6] + cx, temp[7] + cy, (r2 - r1) * 0.5);
  }

  var initPainterConfig = {
    // 填充色或图案
    "fillStyle": 'black',
    // 轮廓色或图案
    "strokeStyle": 'black',
    // 线条宽度(单位px，下同)
    "lineWidth": 1,
    // 文字水平对齐方式（"left"左对齐、"center"居中和"right"右对齐）
    "textAlign": 'left',
    // 文字垂直对齐方式（"middle"垂直居中、"top"上对齐和"bottom"下对齐）
    "textBaseline": 'middle',
    // 文字大小
    "font-size": 16,
    // 字体，默认"sans-serif"
    "font-family": "sans-serif",
    // 圆弧开始端闭合方式（"butt"直线闭合、"round"圆帽闭合）
    "arc-start-cap": 'butt',
    // 圆弧结束端闭合方式，和上一个类似
    "arc-end-cap": 'butt',
    // 设置线条虚线，应该是一个数组[number,...]
    "lineDash": [],
    // 阴影的模糊系数，默认0，也就是无阴影
    "shadowBlur": 0,
    // 阴影的颜色
    "shadowColor": "black"
  }; // 文字统一设置方法

  var initText = function initText(painter, config, x, y, deg, platform) {
    painter.beginPath();
    painter.translate(x, y);
    painter.rotate(deg);

    if (platform != 'default') {
      painter.setFontSize(config['font-size']); // font-family目前无视了
    } else {
      painter.font = config['font-size'] + "px " + config['font-family'];
    }

    return painter;
  }; // 画弧统一设置方法

  var initArc = function initArc(painter, config, cx, cy, r1, r2, beginDeg, deg) {
    if (r1 > r2) {
      var temp = r1;
      r1 = r2;
      r2 = temp;
    }

    beginDeg = beginDeg % (Math.PI * 2); // 当|deg|>=2π的时候都认为是一个圆环
    // 为什么不取2π比较，是怕部分浏览器浮点不精确

    if (deg >= Math.PI * 1.999999 || deg <= -Math.PI * 1.999999) {
      deg = Math.PI * 2;
    } else {
      deg = deg % (Math.PI * 2);
    }

    arc(beginDeg, deg, cx, cy, r1, r2, function (beginA, endA, begInnerX, begInnerY, begOuterX, begOuterY, endInnerX, endInnerY, endOuterX, endOuterY, r) {
      if (r < 0) r = -r;
      painter.beginPath();
      painter.moveTo(begInnerX, begInnerY);
      painter.arc( // (圆心x，圆心y，半径，开始角度，结束角度，true逆时针/false顺时针)
      cx, cy, r1, beginA, endA, false); // 结尾

      if (config["arc-end-cap"] != 'round') painter.lineTo(endOuterX, endOuterY);else painter.arc((endInnerX + endOuterX) * 0.5, (endInnerY + endOuterY) * 0.5, r, endA - Math.PI, endA, true);
      painter.arc(cx, cy, r2, endA, beginA, true); // 开头

      if (config["arc-start-cap"] != 'round') painter.lineTo(begInnerX, begInnerY);else painter.arc((begInnerX + begOuterX) * 0.5, (begInnerY + begOuterY) * 0.5, r, beginA, beginA - Math.PI, true);
    });
    if (config["arc-start-cap"] == 'butt') painter.closePath();
    return painter;
  }; // 画圆统一设置方法

  var initCircle = function initCircle(painter, cx, cy, r) {
    painter.beginPath();
    painter.moveTo(cx + r, cy);
    painter.arc(cx, cy, r, 0, Math.PI * 2);
    return painter;
  }; // 画矩形统一设置方法

  var initRect = function initRect(painter, x, y, width, height) {
    painter.beginPath();
    painter.rect(x, y, width, height);
    return painter;
  };

  // 线性渐变
  var linearGradient = function linearGradient(painter, x0, y0, x1, y1) {
    var gradient = painter.createLinearGradient(x0, y0, x1, y1);
    var enhanceGradient = {
      "value": function value() {
        return gradient;
      },
      "addColorStop": function addColorStop(stop, color) {
        gradient.addColorStop(stop, color);
        return enhanceGradient;
      }
    };
    return enhanceGradient;
  }; // 环形渐变

  var radialGradient = function radialGradient(painter, cx, cy, r) {
    var gradient = painter.createRadialGradient(cx, cy, 0, cx, cy, r);
    var enhanceGradient = {
      "value": function value() {
        return gradient;
      },
      "addColorStop": function addColorStop(stop, color) {
        gradient.addColorStop(stop, color);
        return enhanceGradient;
      }
    };
    return enhanceGradient;
  };

  var unSupportAttr = {};
  function painterFactory (painter, platform) {
    // 用于记录配置
    // 因为部分配置的设置比较特殊，只先记录意图
    var config = {}; // 配置生效方法

    var useConfig = platform == 'uni-app' ? // uni-app
    function (key, value) {
      // 如果已经存在默认配置中，说明只需要缓存起来即可
      if (["font-size", "font-family", "arc-start-cap", "arc-end-cap"].indexOf(key) > -1) {
        config[key] = value;
      } else {
        try {
          painter['set' + key[0].toUpperCase() + key.substr(1)](value);
        } catch (e) {
          if (!unSupportAttr[platform]) {
            unSupportAttr[platform] = {};
          } // 为了友好，我们只对第一次进行提示


          if (!unSupportAttr[platform][key]) {
            // 部分属性可能一些平台设置方法不兼容，这里进行调试提示
            unSupportAttr[platform][key] = true;
            console.warn("内置画笔的" + key + "属性在" + platform + "平台上不支持！");
          }
        }
      }
    } : // 默认环境
    // 微信小程序
    function (key, value) {
      /**
       * -----------------------------
       * 特殊的设置开始
       * -----------------------------
       */
      if (key == 'lineDash') {
        painter.setLineDash(value);
      }
      /**
       * -----------------------------
       * 常规的配置开始
       * -----------------------------
       */
      // 如果已经存在默认配置中，说明只需要缓存起来即可
      else if (["font-size", "font-family", "arc-start-cap", "arc-end-cap"].indexOf(key) > -1) {
        config[key] = value;
      } // 其它情况直接生效即可
      else if (key in initPainterConfig) {
        painter[key] = value;
      } // 如果属性未被定义
      else {
        throw new Error('Illegal configuration item of painter : ' + key + " !");
      }
    }; // 画笔

    var enhancePainter = {
      // 属性设置或获取
      "config": function config() {
        if (arguments.length === 1) {
          if (_typeof(arguments[0]) !== 'object') return painter[arguments[0]];

          for (var key in arguments[0]) {
            useConfig(key, arguments[0][key]);
          }
        } else if (arguments.length === 2) {
          useConfig(arguments[0], arguments[1]);
        }

        return enhancePainter;
      },
      // 文字
      "fillText": function fillText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform).fillText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      "strokeText": function strokeText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform).strokeText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      "fullText": function fullText(text, x, y, deg) {
        painter.save();
        initText(painter, config, x, y, deg || 0, platform);
        painter.fillText(text, 0, 0);
        painter.strokeText(text, 0, 0);
        painter.restore();
        return enhancePainter;
      },
      // 路径
      "beginPath": function beginPath() {
        painter.beginPath();
        return enhancePainter;
      },
      "closePath": function closePath() {
        painter.closePath();
        return enhancePainter;
      },
      "moveTo": function moveTo(x, y) {
        painter.moveTo(x, y);
        return enhancePainter;
      },
      "lineTo": function lineTo(x, y) {
        painter.lineTo(x, y);
        return enhancePainter;
      },
      "arc": function arc(x, y, r, beginDeg, deg) {
        painter.arc(x, y, r, beginDeg, beginDeg + deg, deg < 0);
        return enhancePainter;
      },
      "fill": function fill() {
        painter.fill();
        return enhancePainter;
      },
      "stroke": function stroke() {
        painter.stroke();
        return enhancePainter;
      },
      "full": function full() {
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      "save": function save() {
        painter.save();
        return enhancePainter;
      },
      "restore": function restore() {
        painter.restore();
        return enhancePainter;
      },
      // 路径 - 贝塞尔曲线
      "quadraticCurveTo": function quadraticCurveTo(cpx, cpy, x, y) {
        painter.quadraticCurveTo(cpx, cpy, x, y);
        return enhancePainter;
      },
      "bezierCurveTo": function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        painter.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return enhancePainter;
      },
      // 擦除画面
      "clearRect": function clearRect(x, y, w, h) {
        painter.clearRect(x, y, w, h);
        return enhancePainter;
      },
      // 弧
      "fillArc": function fillArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg).fill();
        return enhancePainter;
      },
      "strokeArc": function strokeArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg).stroke();
        return enhancePainter;
      },
      "fullArc": function fullArc(cx, cy, r1, r2, beginDeg, deg) {
        initArc(painter, config, cx, cy, r1, r2, beginDeg, deg);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      // 圆形
      "fillCircle": function fillCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r).fill();
        return enhancePainter;
      },
      "strokeCircle": function strokeCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r).stroke();
        return enhancePainter;
      },
      "fullCircle": function fullCircle(cx, cy, r) {
        initCircle(painter, cx, cy, r);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },
      // 矩形
      "fillRect": function fillRect(x, y, width, height) {
        initRect(painter, x, y, width, height).fill();
        return enhancePainter;
      },
      "strokeRect": function strokeRect(x, y, width, height) {
        initRect(painter, x, y, width, height).stroke();
        return enhancePainter;
      },
      "fullRect": function fullRect(x, y, width, height) {
        initRect(painter, x, y, width, height);
        painter.fill();
        painter.stroke();
        return enhancePainter;
      },

      /**
      * 渐变
      * -------------
      */
      //  线性渐变
      "createLinearGradient": function createLinearGradient(x0, y0, x1, y1) {
        return linearGradient(painter, x0, y0, x1, y1);
      },
      // 环形渐变
      "createRadialGradient": function createRadialGradient(cx, cy, r) {
        return radialGradient(painter, cx, cy, r);
      }
    };
    return enhancePainter;
  }

  var CrossEndCanvas = function CrossEndCanvas(config) {
    return new Promise(function (resolve, reject) {
      if (config.platform == 'web') {
        var canvas = document.getElementById(config.id);
        var width = canvas.clientWidth,
            //内容+内边距
        height = canvas.clientHeight; // 设置显示大小

        canvas.style.width = width + "px";
        canvas.style.height = height + "px"; // 设置画布大小（画布大小设置为显示的二倍，使得显示的时候更加清晰）

        canvas.setAttribute('width', width * 2);
        canvas.setAttribute('height', height * 2);
        var painter = canvas.getContext("2d"); // 通过缩放实现模糊问题

        painter.scale(2, 2);
        resolve(painter, config.platform);
      } else if (config.platform == 'uni-app') {
        resolve(uni.createCanvasContext(config.id, config.target), config.platform);
      } else if (config.platform == 'weixin') {
        var dpr = wx.getSystemInfoSync().pixelRatio;
        wx.createSelectorQuery()["in"](config.target).select('#' + config.id).fields({
          node: true,
          size: true
        }).exec(function (res) {
          var canvas = res[0].node;
          var painter = canvas.getContext('2d');
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          painter.scale(dpr, dpr);
          resolve(painter, config.platform);
        });
      } else {
        reject('你必须配置一个合法的平台');
      }
    }).then(function (painter, platform, canvas) {
      return painterFactory(painter, platform);
    });
  }; // 根据运行环境，导出接口


  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = CrossEndCanvas;
  } else {
    window.CrossEndCanvas = CrossEndCanvas;
  }

}());
