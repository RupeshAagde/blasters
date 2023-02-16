<template>
    <div class="margin">
        <div v-if="lineItem.text" class="inline apart radio-padding">
            <div class="inline">
                <div :class="`cl-Mako dark-xs ${textClass}`">
                    {{ lineItem.text }}
                </div>
            </div>
        </div>
        <div class="inline">
            <div
                v-for="(item, index) in lineItem.data.lineItems"
                :key="index"
                :class="item.data.lineItems ? 'full-width' : 'single-line'"
            >
                <nitrozen-radio
                    v-model="lineItem.data.currentValue"
                    :name="lineItem.id"
                    class="radio-spacing"
                    :radioValue="item.id"
                    :disabled="!parentState"
                >
                    <div class="cl-Mako dark-xs">
                        {{ item.text }}
                    </div>
                </nitrozen-radio>

                <div v-if="item.data.lineItems && item.data.lineItems.length">
                    <component-factory
                        ref="getData"
                        :lineItem="nestedItem"
                        :parentState="lineItem.data.currentValue == item.id"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenRadio } from '@gofynd/nitrozen-vue';
import ComponentFactory from './component-factory.vue';

export default {
    name: 'radio-component',
    components: {
        'nitrozen-radio': NitrozenRadio,
        ComponentFactory
    },
    props: ['lineItem', 'parentState', 'textClass'],
    watch: {
        parentState: function(newVal) {
            if (!newVal) {
                this.lineItem.data.currentValue = newVal;
            } else {
                this.lineItem.data.currentValue = this.lineItem.data.isSelected;
            }
        }
    },
    methods: {
        saveForm() {
            let counter = 0;
            let data = {
                [this.lineItem.id]: this.lineItem.data.currentValue
            };
            if (this.lineItem.data.lineItems) {
                this.lineItem.data.lineItems.map((item) => {
                    if (item.data.lineItems) {
                        item.data.lineItems.map((nestedItem) => {
                            data[nestedItem.id] = this.$refs.getData[
                                counter
                            ].saveForm();
                            counter++;
                        });
                    }
                });
            }
            if (counter) {
                return data;
            } else {
                return this.lineItem.data.currentValue;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';

.margin {
    margin: 16px 24px;
    font-weight: 400;
    font-size: 14px;
    &.group-header {
        font-weight: 600;
        font-size: 14px;
        margin: 24px 0px;
    }
}

.radio-padding {
    padding-bottom: 10px;
}

.inline {
    display: flex;
    flex-wrap: wrap;
    &.apart {
        justify-content: space-between;
    }
}

.full-width {
    width: 100%;
    border-top: 0px;
    padding: 12px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.single-line {
    padding-right: 20px;
}
</style>
