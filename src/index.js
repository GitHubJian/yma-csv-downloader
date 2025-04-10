const csv = require('./csv');

const BOM = '\ufeff';

const timestramp = function (now) {
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    month = Number(month) < 10 ? '0' + month : month;
    let day = now.getDate();
    day = Number(day) < 10 ? '0' + day : day;
    let hour = now.getHours();
    hour = Number(hour) < 10 ? '0' + hour : hour;
    let minute = now.getMinutes();
    minute = Number(minute) < 10 ? '0' + minute : minute;
    let second = now.getSeconds();
    second = Number(second) < 10 ? '0' + second : second;

    return [year, month, day, hour, minute, second].join('');
};

const downloader = function ({filename, blob}, callback) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (callback) {
        callback && callback();
    } else {
        return Promise.resolve();
    }
};

function download(options, callback) {
    const {name, bom, meta, separator} = options;

    csv(options).then(
        reasult => {
            const bomCode = bom !== false ? BOM : '';
            const metaContent = meta ? `sep=${separator}\r\n` : '';

            const filename = name + '-' + timestramp(new Date()) + '.csv';

            const blob = new Blob([bomCode + metaContent + reasult], {
                type: 'text/csv;charset=utf-8',
            });

            downloader(
                {
                    filename,
                    blob,
                },
                function () {
                    callback && callback(null);
                },
            );
        },
        reason => {
            callback && callback(reason);
        },
    );
}

module.exports = download;
