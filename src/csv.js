const NewlineChar = '\r\n';
const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : setTimeout;

const makeWrapper = function (char) {
    return function (str) {
        return `${char}${str}${char}`;
    };
};

const makeResolver = function (resolve, newline) {
    return function (content) {
        if (newline) {
            content.push('');
        }

        resolve(content.join(NewlineChar));
    };
};

const identity = function (arr, initMap) {
    return arr.reduce(function (acc, k) {
        if (!acc.map[k]) {
            acc.map[k] = k;
            acc.order.push(k);
        }

        return acc;
    }, initMap);
};

const extractHeaderFromDatas = function (datas) {
    return datas.reduce(
        function (acc, v) {
            if (Array.isArray(v)) {
                return acc;
            }
            return identity(Object.keys(v), acc);
        },
        {
            order: [],
            map: {},
        },
    );
};

const extractHeaderFromColumns = function (columns) {
    return columns.reduce(
        function (acc, v) {
            let id;
            let value;
            if (typeof v === 'string') {
                id = v;
                value = v;
            } else {
                id = v.id;
                value = v.displayName ?? v.id;
            }

            acc.map[id] = value;
            acc.order.push(id);

            return acc;
        },
        {
            order: [],
            map: {},
        },
    );
};

function toChunks(arr, chunkSize) {
    return [...Array(Math.ceil(arr.length / chunkSize))].reduce((acc, _, i) => {
        const begin = i * chunkSize;
        return acc.concat([arr.slice(begin, begin + chunkSize)]);
    }, []);
}

function coalesce(lRef, rRef) {
    function isNil(v) {
        return v === null || v === undefined;
    }

    return !isNil(lRef) ? lRef : rRef;
}

const createChunkProcessor = (resolver, wrapper, content, datas, columnOrder, separator, chunkSize) => {
    const chunks = toChunks(datas, chunkSize);

    let i = 0;
    return function processChunk() {
        if (i >= chunks.length) {
            resolver(content);
            return;
        }

        const chunk = chunks[i];
        const asArray = Array.isArray(chunk[0]) && !columnOrder.some(k => typeof chunk[0][k] !== 'undefined');

        i += 1;

        chunk
            .map(v => (asArray ? v : columnOrder.map(k => coalesce(v[k], ''))))
            .forEach(v => {
                content.push(v.map(wrapper).join(separator));
            });

        raf(processChunk);
    };
};

module.exports = function csv({
    columns,
    datas,
    separator = ',',
    noHeader = false,
    wrapColumnChar = '',
    newLineAtEnd = false,
    chunkSize = 1000,
    title = '',
}) {
    return new Promise(function (resolve, reject) {
        let parser;
        if (typeof datas === 'function') {
            parser = datas;
        } else {
            parser = function () {
                return Promise.resolve(datas);
            };
        }

        parser().then(d => {
            if (!Array.isArray(d)) {
                return resolve();
            }
            const resolver = makeResolver(resolve, newLineAtEnd);
            const wrapper = makeWrapper(wrapColumnChar);

            const {map, order} = columns ? extractHeaderFromColumns(columns) : extractHeaderFromDatas(datas);
            const content = [];
            if (!noHeader) {
                const headerNames = order.map(id => map[id]);
                if (headerNames.length > 0) {
                    if (title !== '') {
                        content.push(title);
                    }

                    content.push(headerNames.map(wrapper).join(separator));
                }
            }

            const processChunk = createChunkProcessor(resolver, wrapper, content, datas, order, separator, chunkSize);

            raf(processChunk);
        });
    });
};
