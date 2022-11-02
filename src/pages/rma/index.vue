<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="this.route.name !== 'rma-rules'"
            @backClick="goBack"
            :title="'Return Merchandise Authorisation'"
            :noContextMenu="true"
        >
            <nitrozen-button
                v-if="
                    this.route.name === 'rma-setup' ||
                        this.route.name === 'rma-edit'
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
    data() {
        return {
            route: this.$route
        };
    },
    updated() {
        this.route = this.$route;
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        save() {
            console.log('save')
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
