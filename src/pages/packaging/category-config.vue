<template>
    <div>
        <page-header :title="'Packaging'" @backClick="goBack" />
        <div class="packaging-home-container">
            <div class="packaging-home-list">
                <list-categories />
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from '../../components/common/layout/page-header.vue';
import ListCategories from '../../components/packaging/list-categories.vue';
export default {
    name: 'category-config',
    components: {
        PageHeader,
        ListCategories
    },
    methods: {
        /**
         * @description Go back to previous route
         */
        goBack() {
            this.$router.back();
        }
    }
};
</script>
<style lang="less">
@import '../../less/packaging/packaging-home.less';
</style>
