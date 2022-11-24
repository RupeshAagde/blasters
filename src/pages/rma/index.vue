<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="this.$route.name !== 'rma-rules'"
            @backClick="goBack"
            :title="'Return Merchandise Authorisation'"
            :noContextMenu="true"
            :headerIcon="'review_rating'"
        >
        </adm-page-header>
        <router-view name="rma-view" />
    </div>
</template>

<script>
import AdmPageHeader from '@/components/common/layout/page-header.vue';

export default {
    name: 'rma-page',
    components: {
        AdmPageHeader
    },
    methods: {
        goBack() {
            const currentRoute = this.$route.name;
            switch (currentRoute) {
                case 'rma-global-rules':
                case 'rma-global-channel-rules':
                case 'rma-custom-channel-rules':
                    this.$router.push({
                        path: '/administrator/orders/rma/rules'
                    });
                    break;
                default:
                    this.$router.back();
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

::v-deep .titlize {
    text-transform: capitalize;
    z-index: 6;
}
</style>
