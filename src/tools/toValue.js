export default function (oralValue, interval) {

    let resultData = [];

    for (let i = oralValue.length - 1; i >= interval - 1; i -= interval) {

        let temp = 0;
        for (let j = 0; j < interval; j++) {
            temp += oralValue[i - j].downloads;
        }

        resultData.unshift(temp);

    }

    return resultData;

};
