<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="false"
            :title="'Return Merchandise Authorisation'"
            :noContextMenu="true"
        ></adm-page-header>
        <div class="main-container">
            <div class="page-container">
                <div class="header-container">
                    <div class="caption-container">
                        <span class="caption-title">RMA Rules History</span>
                        <span class="caption-description"
                            >Small description which is around 1 line</span
                        >
                    </div>
                    <div>
                        <nitrozen-button
                            @click="redirectToNewSetup"
                            :theme="'secondary'"
                            v-flatBtn
                            >Add New</nitrozen-button
                        >
                    </div>
                </div>
                <adm-no-content
                    helperText="No Company or Sales Channel Added. Add Sales Channel"
                ></adm-no-content>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import AdmPageHeader from '@/components/common/layout/page-header.vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';

export default {
    name: 'rma-page',
    components: {
        AdmPageHeader,
        AdmNoContent,
        'nitrozen-button': NitrozenButton,
    },
    directives: {
        flatBtn,
    },
    methods: {
        redirectToNewSetup() {
            this.$router.push({ path: '/administrator/rma/setup/new' });
        },
    },
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
    margin: 0;
    flex-direction: column;
    border-radius: 12px;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }
    .header-container {
        font-family: Inter;
        align-items: center;
        display: flex;
        justify-content: space-between;
        background-color: @White;

        .caption-container {
            display: flex;
            flex-direction: column;

            .caption-title {
                color: @Mako;
                font-weight: bold;
                font-size: 24px;
                line-height: 40px;
                text-align: left;
            }
            .caption-description {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 16px;
            }
        }
    }
}
::v-deep .titlize {
    text-transform: capitalize;
    position: initial;
    width: auto;
    z-index: 6;
}
</style>
