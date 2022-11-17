<template>
    <div :class="`margin ${textClass}`">
        <div :class="`text inline apart ${textClass}`">
            <div class="inline v-center">
                <template
                    v-if="
                        lineItem.additionalParams &&
                        lineItem.additionalParams.logo
                    "
                >
                    <img
                        :src="lineItem.additionalParams.logo"
                        class="card-avatar"
                    />
                </template>
                <div>
                    {{ lineItem.text }}
                </div>
            </div>
            <nitrozen-checkbox
                :checkboxValue="lineItem.data.isSelected"
                v-model="lineItem.data.currentValue"
                :id="lineItem.id"
                :disabled="
                    !parentState ||
                    (lineItem.additionalParams
                        ? lineItem.additionalParams.disabled
                        : false)
                "
            >
            </nitrozen-checkbox>
        </div>
        <div
            v-if="lineItem.data.lineItems && lineItem.data.lineItems.length"
            class="nested-class"
        >
            <div
                v-for="item in lineItem.data.lineItems"
                :key="item.id"
                class="nested-item"
            >
                <component-factory
                    :lineItem="item"
                    :parentState="lineItem.data.currentValue"
                    ref="getData"
                ></component-factory>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';

.margin {
    margin: 24px 0px;
}

.text {
    font-weight: 400;
    font-size: 14px;
    margin: 0px 24px;
    &.group-header {
        margin: 16px 0px;
        font-weight: 600;
        font-size: 14px;
    }
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

.card-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    width: 24px;
    height: 24px;
    align-self: center;
    img {
        align-items: center;
        min-height: 24px;
        max-height: 24px;
        min-width: 24px;
        max-width: 24px;
    }
}

.border {
    .nested-class {
        margin-top: 10px;
        border-top: 1px solid @Iron;
        .nested-class {
            border: 1px solid @Iron;
            border-radius: 8px;
            .margin {
                margin: 16px 24px;
            }

            .nested-item {
                border-top: 1px solid #e0e0e0;
                .margin {
                    margin: 16px 0px;
                }
            }
            .nested-item:first-child {
                border-top: none;
            }
        }
    }
}
</style>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';

export default {
    name: 'checkbox-component',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        ComponentFactory: () => import('./component-factory.vue'),
    },
    props: ['lineItem', 'parentState', 'textClass'],
    watch: {
        parentState: function (newVal, oldVal) {
            if (!newVal) {
                this.lineItem.data.currentValue = newVal;
            } else {
                this.lineItem.data.currentValue = this.lineItem.data.isSelected;
            }
        },
    },
    methods: {
        saveForm() {
            let data = {
                enabled: this.lineItem.data.currentValue,
            };
            if (
                this.lineItem.data.currentValue &&
                this.lineItem.data.lineItems
            ) {
                this.lineItem.data.lineItems.map((item, index) => {
                    data[item.id] = this.$refs.getData[index].saveForm();
                });
            }
            if (!this.lineItem.data.lineItems) {
                return this.lineItem.data.currentValue;
            } else {
                return data;
            }
        },
    },
};
</script>

