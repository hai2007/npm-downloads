
// 引入样式
import "@hai2007/style/normalize.css";
import './style.css';

// 引入绘图依赖
import Clunch from 'clunch';

// 引入图片
import npmDownloads from './npm-downloads.clunch';

// 引入工具方法
import evalParam from './tools/evalParam';
import getDownloadsData from './tools/getDownloadsData';
import toValue from './tools/toValue';
import { rulerValue } from './tools/ruler';

// 启动绘图
window.clunch = new Clunch({
    el: document.getElementById('root'),
    render: npmDownloads,
    time: 2000,
    data() {
        return {
            loadSize: 12,
            pkgs: [],
            yRuler: [],
            xDist: 0
        };
    },
    mounted: ['$getRandomColors', function ($getRandomColors) {

        return function () {

            // 获取npm包名和时间长度
            let paramJSON = evalParam(window.location.href);

            // 获取需要显示的包数组
            let packages = paramJSON.packages.split(",");

            let promiseArray = [];
            for (let i = 0; i < packages.length; i++) {
                promiseArray.push(getDownloadsData(packages[i]));
            }

            let interval = setInterval(() => {
                if (this.loadSize == 12) this.loadSize = 60;
                else this.loadSize = 12;
            }, 2000);

            // 等所有的包都请求完毕以后
            Promise.all(promiseArray).then((values) => {

                let pkgs = [];
                let colors = $getRandomColors(values.length);
                for (let i = 0; i < values.length; i++) {
                    pkgs.push(JSON.parse(values[i]));

                    // 实际显示用值
                    pkgs[pkgs.length - 1].value = toValue(pkgs[pkgs.length - 1].downloads, paramJSON.interval);

                    // 颜色
                    pkgs[pkgs.length - 1].color = colors[i];
                }

                let minValue = pkgs[0].value[0];
                let maxValue = pkgs[0].value[0];

                // 求最值
                for (let i = 0; i < pkgs.length; i++)
                    for (let j = 0; j < pkgs[i].value.length; j++) {
                        if (pkgs[i].value[j] < minValue) minValue = pkgs[i].value[j];
                        if (pkgs[i].value[j] > maxValue) maxValue = pkgs[i].value[j];
                    }

                this.yRuler = rulerValue(maxValue > 100 ? maxValue : 100, minValue, 10);
                this.pkgs = pkgs;
                this.xDist = (this._width - 100) / (this.pkgs[0].value.length - 1);

                // 完毕以后 ，停止loading提示
                clearInterval(interval);
                this.loadSize = -1;

            });

        };

    }],
    resized() {
        this.xDist = (this._width - 100) / (this.pkgs[0].value.length - 1);
    }
}).$bind('click', function (target) {

    if ("id" in target && /(rect|text)$/.test(target.id)) {

        let oldNpmName = target.id.replace(/(\:.*)$/, '');
        window.location.href = window.location.href.replace(oldNpmName, '').replace('=,', '=').replace(/\,$/, '').replace(',,', ',');

    }

}).$bind('mousemove', function (target) {

    if ("id" in target && /(rect|text)$/.test(target.id)) {
        this.__el.style.cursor = 'pointer';
    } else {
        this.__el.style.cursor = 'default';
    }

});
