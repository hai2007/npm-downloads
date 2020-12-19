export function rulerValue(cormax, cormin, cornumber) {

    let corstep = (cormax - cormin) / cornumber;  //刻度数之间的间隔
    //求间隔corstep的数量级temp (10,100,1000)
    let temp;
    if (Math.pow(10, Math.trunc(Math.log(corstep) / Math.log(10))) == corstep) {
        temp = Math.pow(10, Math.trunc(Math.log(corstep) / Math.log(10)));
    } else {
        temp = Math.pow(10, (Math.trunc(Math.log(corstep) / Math.log(10)) + 1));
    }
    //将间隔corstep进行归一化，求出tmpstep(tpmstep在0.1 0.2 0.25 0.5 1之间取值)
    let tmpstep;
    tmpstep = corstep / temp;
    if (tmpstep >= 0 && tmpstep <= 0.1) {
        tmpstep = 0.1;
    } else if (tmpstep >= 0.100001 && tmpstep <= 0.2) {
        tmpstep = 0.2;
    } else if (tmpstep >= 0.200001 && tmpstep <= 0.25) {
        tmpstep = 0.25;
    } else if (tmpstep >= 0.250001 && tmpstep <= 0.5) {
        tmpstep = 0.5;
    } else {
        tmpstep = 1;
    }
    //将间隔恢复，求出实际间隔距离
    tmpstep = tmpstep * temp;

    //调整刻度尺的最小刻度
    if ((Math.trunc(cormin / tmpstep)) != (cormin / tmpstep)) {
        if (cormin < 0) {
            cormin = (-1) * Math.ceil(Math.abs(cormin / tmpstep)) * tmpstep;
        } else {
            cormin = (Math.trunc(Math.abs(cormin / tmpstep))) * tmpstep;
        }
    }
    //调整刻度尺的最大刻度
    cormax = Math.trunc(cormax / tmpstep + 1) * tmpstep;

    //求新的cornumber、cormax、cormin
    let tmpnumber = (cormax - cormin) / tmpstep;
    if (tmpnumber < cornumber) {
        let extranumber = cornumber - tmpnumber;
        tmpnumber = cornumber;
        if (extranumber % 2 == 0) {
            cormax = cormax + tmpstep * Math.trunc(extranumber / 2);
        } else {
            cormax = cormax + tmpstep * Math.trunc(extranumber / 2 + 1);
        }
        cormin = cormin - tmpstep * Math.trunc(extranumber / 2);
    }
    cornumber = tmpnumber;

    let resultData = {
        min: cormin,
        max: cormax,
        deep: tmpstep,
        num: cornumber,
        ruler: []
    };

    // 得出最终的刻度数组
    for (let i = 0; i <= cornumber; i++) {
        resultData.ruler.push(cormin + tmpstep * i);
    }

    return resultData;
};
