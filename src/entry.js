
// 引入样式
import "@hai2007/style/normalize.css";
import './style.css';

// 引入绘图依赖
import Clunch from 'clunch';

// 引入图片
import npmDownloads from './npm-downloads.clunch';

// 启动绘图
window.clunch = new Clunch({
    el: document.getElementById('root'),
    render: npmDownloads
});
