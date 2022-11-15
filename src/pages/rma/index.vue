<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="this.$route.name !== 'rma-rules'"
            @backClick="goBack"
            :title="'Return Merchandise Authorisation'"
            :noContextMenu="true"
        >
            <nitrozen-button
                v-if="
                    this.$route.name === 'rma-setup' ||
                        this.$route.name === 'rma-edit'
                "
                v-flat-btn
                :rounded="false"
                :theme="'secondary'"
                @click="save()"
            >
                Save
            </nitrozen-button>
        </adm-page-header>
        <router-view name="rma-view" />
    </div>
</template>

<script>
import AdmPageHeader from '@/components/common/layout/page-header.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

export default {
    name: 'rma-page',
    components: {
        AdmPageHeader,
        NitrozenButton
    },
    methods: {
        goBack() {
            const currentRoute = this.$route.name;
            switch (currentRoute) {
                case 'rma-global-rules':
                case 'rma-custom-rules':
                    this.$router.push({
                        path: '/administrator/settings/platform/rma/rules'
                    });
                    break;
                case 'rma-global-rule-setup':
                case 'rma-global-rule-edit':
                    this.$router.push({
                        path: `/administrator/settings/platform/rma/rules/global`
                    });
                    break;
                case 'rma-custom-rule-setup':
                case 'rma-custom-rule-edit':
                    this.$router.push({
                        path: `/administrator/settings/platform/rma/rules/custom/${this.$route.params.sales_channel}`
                    });
                    break;
                default:
                    this.$router.back();
                    break;
            }
        },
        save() {
            this.$router.push({
                path: `/administrator/settings/platform/rma/rules/global`
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

::v-deep .titlize {
    text-transform: capitalize;
    position: initial;
    width: auto;
    z-index: 6;
}
</style>
