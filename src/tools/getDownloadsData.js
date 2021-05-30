import xhr from '@hai2007/xhr';

let get = url => {

    let data = sessionStorage.getItem(url);
    if (data) {
        return new Promise(resolve => {
            resolve(JSON.parse(data));
        });
    }

    return new Promise((resolve, reject) => {

        xhr({

            method: "GET",
            url: url,
            data: {

            },
            header: {

            },
            timeout: 60000,
            xhr: () => {
                return window.XMLHttpRequest ?
                    // IE7+, Firefox, Chrome, Opera, Safari
                    new XMLHttpRequest() :
                    // IE6, IE5
                    new ActiveXObject("Microsoft.XMLHTTP");
            }

        }, function (data) {

            // 成功回调
            sessionStorage.setItem(url, data.data);
            resolve(JSON.parse(data.data));

        }, function (error) {

            // 失败回调
            reject(error.data);

        });

    });

};

export default packageName => {

    let date = new Date();
    let year = date.getFullYear();
    let month_day = "-" + (date.getMonth() - (-1)) + "-" + date.getDate();

    let url = "https://api.npmjs.org/downloads/range/" + (year - 1) + month_day + ":" + year + month_day + "/";
    return get(url + packageName);
};
