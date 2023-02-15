<template>
    <div :class="`margin ${textClass}`">
        <div :class="`text inline apart ${textClass}`">
            <div class="inline v-center">
                {{ lineItem.text }}
            </div>
            <nitrogen-button
                :theme="'secondary'"
                class="btn-height"
                @click="onClickBtn()"
            >
                {{ lineItem.additionalParams.btnLabel }}
            </nitrogen-button>
        </div>
        <div class="border-top nested-class">
            <div
                v-for="nestedItem in lineItem.data.lineItems"
                :key="nestedItem.id"
                class="nested-item"
            >
                <component-factory
                    :lineItem="nestedItem"
                    :parentState="lineItem.data.currentValue"
                    ref="getData"
                ></component-factory>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton } from '@gofynd/nitrozen-vue';

export default {
    name: 'button-component',
    components: {
        'nitrogen-button': NitrozenButton,
        ComponentFactory: () => import('./component-factory.vue')
    },
    props: ['lineItem', 'textClass', 'parentState'],
    methods: {
        onClickBtn() {
            this.$emit('btnClicked', this.lineItem.id);
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';
.margin {
    margin: 16px 0px;
}

.btn-height {
    height: 14px;
}

.text {
    font-weight: 400;
    font-size: 14px;
    margin: 0px 24px;
    &.group-header {
        margin: 16px 24px;
        font-weight: 600;
        font-size: 14px;
    }
}

.group-header {
    font-weight: 600;
    font-size: 14px;
}

.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    &.v-center {
        align-items: center;
    }
}
.border-top {
    margin-top: 10px;
    border-top: 1px solid @Iron;
}
</style>
