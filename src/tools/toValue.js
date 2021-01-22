export default function (oralValue, interval) {

    let value = [], time = [];

    for (let i = oralValue.length - 1; i >= interval - 1; i -= interval) {

        let temp = 0;
        for (let j = 0; j < interval; j++) {
            temp += oralValue[i - j].downloads;
        }

        // 数据
        value.unshift(temp);

        // 日期
        time.unshift(oralValue[i].day + "至" + oralValue[i - interval + 1].day);

    }

    return {
        value,
        time
    };

};
