<template>
    <div class="page">
        <adm-inline-svg :src="'coming-soon'" alt="Error"></adm-inline-svg>
        <div>{{ title }}</div>
    </div>
</template>

<style lang="less" scoped>
.page {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    color: @Mako;
    padding: 8%;
}
</style>

<script>
import adminlinesvg from './../common/adm-inline-svg.vue';

export default {
    name: 'adm-coming-soon',
    components: {
        'adm-inline-svg': adminlinesvg
    },
    props: {
        title: {
            type: String
        }
    }
};
</script>
