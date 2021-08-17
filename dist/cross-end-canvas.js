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
 * Date:Tue Aug 17 2021 16:35:26 GMT+0800 (中国标准时间)
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

  var CrossEndCanvas = function CrossEndCanvas(config) {
    return new Promise(function (resolve, reject) {
      if (config.platform == 'web') {
        resolve(document.getElementById(config.id).getContext('2d'));
      } else if (config.platform == 'uni-app') {
        resolve(uni.createCanvasContext(config.id, config.target));
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
          resolve(painter);
        });
      } else {
        reject('你必须配置一个合法的平台');
      }
    }).then(function (painter) {
      var enhancePainter = {
        _painter_: painter
      };
      return enhancePainter;
    });
  }; // 根据运行环境，导出接口


  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = CrossEndCanvas;
  } else {
    window.CrossEndCanvas = CrossEndCanvas;
  }

}());
