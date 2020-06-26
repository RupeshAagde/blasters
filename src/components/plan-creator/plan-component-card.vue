<template>
    <div class="component-container">
        <div class="comp-details">
            <div style="display: flex; width:100%;">
                <nitrozen-checkbox v-model="enabled" @change="enableForPlan">
                    <div class="cl-Mako bold-xs">{{ component.name }}</div>
                    <div class="cl-Mako regular-xxs">
                        {{ component.description }}
                    </div>
                </nitrozen-checkbox>
                <div
                    class="cl-RoyalBlue bold-xs"
                    style="cursor: pointer;display: flex;justify-content: flex-end; flex: 1;"
                    @click="$emit('createprice', null)"
                >
                    Create Price
                </div>
            </div>
            <div class="prices-box">
                <div class="form-row">
                    <nitrozen-dropdown
                        :label="'Price Model'"
                        :items="priceOptions"
                        v-model="currentPriceId"
                    >
                    </nitrozen-dropdown>
                </div>
                <div class="form-row">
                    <div class="price-model-table">
                        <div
                            class="price-item"
                            v-for="detailField in Object.keys(options)"
                            :key="detailField"
                        >
                            <div class="cl-DustyGray2 dark-xs">
                                {{ options[detailField].text }}:
                            </div>
                            <div class="cl-Mako dark-xs">
                                {{ getPriceModelValue(detailField) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.component-container {
    padding: 12px;
    box-sizing: border-box;
    border-radius: @BorderRadius;
    width: 100%;
    border: 1px solid @Iron;

    .prices-box {
        padding-left: 30px;

        .price-model-table {
            display: flex;
            overflow: hidden;
            flex-wrap: wrap;
            width: 100%;
            .price-item {
                min-width: 50%;
                display: flex;
                margin-bottom: 20px;
                div:nth-child(2) {
                    padding-left: 10px;
                }
            }
        }
    }
}
</style>

<script>
import { NitrozenCheckBox, NitrozenDropdown } from '@gofynd/nitrozen-vue';
import { PLAN_ENUMS } from '../../helper/plan-creator-helper';

export default {
    name: 'plan-component-card',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown
    },
    props: {
        component: {
            type: Object
        },
        plan_component: {
            type: Object
        }
    },
    data() {
        return {
            enabled: false,
            currentPriceId: this.getDefaultPriceModel()._id,
            options: PLAN_ENUMS
        };
    },
    computed: {
        priceOptions() {
            return this.component.component_prices.map((item) => {
                return {
                    text: item.display_text,
                    value: item._id
                };
            });
        },
        priceModelMap() {
            return this.component.component_prices.reduce((map, priceModel) => {
                map[priceModel._id] = priceModel;
                return map;
            }, {});
        },
        currentPriceModel() {
            return this.priceModelMap[this.currentPriceId];
        }
    },
    methods: {
        enableForPlan() {
            this.$emit('enable', this.enabled);
        },
        getDefaultPriceModel() {
            return this.component.component_prices.find((it) => it.is_default);
        },
        getPriceModelValue(detailField) {
            let val = this.currentPriceModel[detailField];
            if (!val) {
                return '';
            }
            console.log(detailField, val);
            return this.options[detailField].enum.find((it) => it.value === val)
                .text;
        }
    }
};
</script>
