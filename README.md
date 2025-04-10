# YMA CSV Downloader"

在浏览器中将数据以 CSV 格式进行导出下载

## Install

```sh
npm i yma-csv-downloader
```

## Usage

```js
import csv from 'yma-csv-downloader';

csv(options, callback);
```

## options

| name           | type           | default | required | desc                               |
| -------------- | -------------- | ------- | -------- | ---------------------------------- |
| name           | string         | null    | true     | 文件名                             |
| bom            | boolean        | true    | false    | 添加 \ufeff 的前缀                 |
| meta           | boolean        | false   | false    | 如果为 True，则包含 sep 前缀       |
| separator      | string         | ','     | false    | Column 分隔符                      |
| columns        | array          | null    | false    | 列头，若为 null，则从 datas 中获取 |
| datas          | array\|Promise | null    | true     | 下载的数据列表                     |
| title          | string         | ''      | false    | 表头                               |
| noHeader       | boolean        | false   | false    | 是否展示表头与列头                 |
| wrapColumnChar | string         | ''      | false    | 包裹数据的字符                     |
| newLineAtEnd   | boolean        | false   | false    | 是否在文本末追加换行符             |
