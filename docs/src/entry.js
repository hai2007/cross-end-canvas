import QuickPaper from 'quick-paper';

// 兼容文件
import '@hai2007/polyfill/Promise.js';

// 引入样式
import "@hai2007/style/normalize.css";
import './style/style.css';
import "./style/doc.css";
import "./style/menu.css";

import App from './App.paper';

// 创建对象
window.quickPaper = new QuickPaper({

    // 挂载点
    el: document.getElementById('root'),

    // 启动组件
    render: createElement => createElement(App)

});
