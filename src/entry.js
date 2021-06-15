
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

// 悬浮组件
import uiHover from './components/ui-hover';
Clunch.series('ui-hover', uiHover);

// 启动绘图
window.clunch = new Clunch({
    el: document.getElementById('root'),
    render: npmDownloads,
    data() {
        return {
            loadSize: 60,
            pkgs: [],
            yRuler: [],
            xDist: 0,
            flag: false,
            hover: {}
        };
    },
    mounted: ['$getLoopColors', '$ruler', function ($getLoopColors, $ruler) {

        return function () {

            window.getLoopColors = $getLoopColors;

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
            }, 500);

            // 等所有的包都请求完毕以后
            Promise.all(promiseArray).then((values) => {

                let pkgs = [];
                let colors = $getLoopColors(values.length);
                for (let i = 0; i < values.length; i++) {
                    pkgs.push(values[i]);

                    let resultData = toValue(pkgs[pkgs.length - 1].downloads, paramJSON.interval);

                    // 实际显示用值
                    pkgs[pkgs.length - 1].value = resultData.value;

                    pkgs[pkgs.length - 1].time = resultData.time;

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

                let yRuler = $ruler(maxValue > 100 ? maxValue : 100, minValue, 10);

                // 不需要保留小数点
                for (let i = 0; i < yRuler.ruler.length; i++) {
                    yRuler.ruler[i] = +((yRuler.ruler[i]).toFixed(0));
                }

                this.yRuler = yRuler;

                this.pkgs = pkgs;
                this.xDist = (this._width - 200) / (this.pkgs[0].value.length - 1);

            }).catch(error => {

                alert(error || "请求发生未知错误");

            }).finally(() => {

                // 完毕以后 ，停止loading提示
                clearInterval(interval);
                this.loadSize = -1;

            });

        };

    }],
    resized() {
        try {
            this.xDist = (this._width - 200) / (this.pkgs[0].value.length - 1);
        } catch (e) { }
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

    let index = Math.round((target.left - 150) / this.xDist);
    if (index < 0 || this.pkgs.length < 1 || index >= this.pkgs[0].value.length) {
        this.flag = false;
    } else {
        this.flag = true;
        this.hover = {
            x: target.left,
            y: target.top,
            index
        };
    }

});
