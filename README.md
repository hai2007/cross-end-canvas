# cross-end-canvas
提供跨端的canvas画笔，保持一致的绘图方法和效果，包括普通的web端、uniapp框架、微信小程序等小程序等。

<p align="center">
  <a href="https://hai2007.gitee.io/npm-downloads?interval=7&packages=cross-end-canvas"><img src="https://img.shields.io/npm/dm/cross-end-canvas.svg" alt="downloads"></a>
  <a href="https://packagephobia.now.sh/result?p=cross-end-canvas"><img src="https://packagephobia.now.sh/badge?p=cross-end-canvas" alt="install size"></a>
  <a href="https://www.jsdelivr.com/package/npm/cross-end-canvas"><img src="https://data.jsdelivr.com/v1/package/npm/cross-end-canvas/badge" alt="CDN"></a>
  <a href="https://www.npmjs.com/package/cross-end-canvas"><img src="https://img.shields.io/npm/v/cross-end-canvas.svg" alt="Version"></a>
  <a href="https://github.com/hai2007/cross-end-canvas/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/cross-end-canvas.svg" alt="License"></a>
    <a href="https://github.com/hai2007/cross-end-canvas" target='_blank'><img alt="GitHub repo stars" src="https://img.shields.io/github/stars/hai2007/cross-end-canvas?style=social"></a>
</p>

## Issues
使用的时候遇到任何问题或有好的建议，请点击进入[issue](https://github.com/hai2007/cross-end-canvas/issues)！

## How to use?

如果是一个web项目，可以直接使用CDN的方式：

```html
<script src="https://cdn.jsdelivr.net/npm/cross-end-canvas@0"></script>
```

更多的时候，我们推荐使用npm的方式进行管理，安装：

```js
npm install cross-end-canvas
```

然后，就可以直接在需要使用的地方引入：

```js
import CrossEndCanvas from 'cross-end-canvas';
```

使用起来也很简单：

```js
CrossEndCanvas({
    id:string, // canvas的ID
    platform:string, // 平台，可选值： web|weixin|uni-app
    target:this, // weixin和unia-app需要配置，表示canvas所在的对象
}).then(function(painter){

    // 使用painter绘制即可

});
```

开源协议
---------------------------------------
[MIT](https://github.com/hai2007/cross-end-canvas/blob/master/LICENSE)

Copyright (c) 2021 [hai2007](https://hai2007.gitee.io/sweethome/) 走一步，再走一步。
