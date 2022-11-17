<template>
    <div :class="`margin ${textClass}`">
        <div :class="`text ${textClass}`">
            <div>{{ lineItem.text }}</div>
        </div>
        <div
            v-if="lineItem.data.lineItems && lineItem.data.lineItems.length"
            class="border-top nested-class"
        >
            <div
                v-for="nestedItem in lineItem.data.lineItems"
                :key="nestedItem.id"
                class="nested-item"
            >
                <component-factory
                    :lineItem="nestedItem"
                    :parentState="parentState"
                    ref="getData"
                ></component-factory>
            </div>
        </div>
    </div>
</template>



<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';
.inline {
    display: flex;
}

.border {
    .margin {
        margin: 16px 0px;
    }
    .nested-class {
        border-top: 1px solid @Iron;
        .nested-class {
            margin: 16px 24px;
            border: 1px solid @Iron;
            border-radius: 8px;
            .nested-item{
                border-top: 1px solid #E0E0E0;
            }
            .nested-item:first-child {
                border-top: none;
            }
        }
    }
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


</style>

<script>
export default {
    name: 'group-component',
    components: {
        ComponentFactory: () => import('./component-factory.vue'),
    },
    props: ['lineItem', 'parentState', 'textClass'],
    methods: {
        saveForm() {
            let data = {};
            this.lineItem.data.lineItems.map((item, index) => {
                data[item.id] = this.$refs.getData[index].saveForm();
            });
            return data;
        },
    },
};
</script>

