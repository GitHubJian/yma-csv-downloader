<template>
    <div>
        <h1>Hello, YMA</h1>
        <p>一款集成打包构建工具</p>
    </div>
</template>

<script>
import csv from "../../../../src/index";

export default {
    data() {
        return {};
    },
    mounted() {
        csv({
            name: "imcsv",
            bom: true,
            title: "我是导出次",
            columns: [
                {
                    id: "errorWord",
                    displayName: "错词",
                },
                {
                    id: "suggestWord",
                    displayName: "建议词",
                },
            ],
            datas: [
                {
                    errorWord: "白发仓仓",
                    suggestWord: "白发苍苍",
                },
                {
                    errorWord: "白发仓仓1",
                    suggestWord: "白发苍苍1",
                },
            ],
        });
    },
};
</script>

<style lang="scss">
</style>
