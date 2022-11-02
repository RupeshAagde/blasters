<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <sales-channel/>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import SalesChannel from './sales-channel';

export default {
    name: 'rma-sales-page',
    components: {
        'nitrozen-button': NitrozenButton,
        'sales-channel': SalesChannel
    },
    directives: {
        flatBtn,
    },
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
    margin: 0;
    flex-direction: column;

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
</style>
