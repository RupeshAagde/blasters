<template>
    <div>
        <page-header :title="'Packaging'" :showBackButton="false" />
        <div class="packaging-home-container">
            <div class="packaging-home-list">
                <list-packaging />
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from '../../components/common/layout/page-header.vue';
import ListPackaging from '../../components/packaging/list-packaging.vue';
export default {
    name: 'packaging-home',
    components: {
        PageHeader,
        ListPackaging
    }
};
</script>
<style lang="less">
@import '../../less/packaging/packaging-home.less';
</style>
