const csv = require('./csv');

const BOM = '\ufeff';

const timestramp = function (now) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

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
                }
            );
        },
        reason => {
            callback && callback(reason);
        }
    );
}

module.exports = download;
