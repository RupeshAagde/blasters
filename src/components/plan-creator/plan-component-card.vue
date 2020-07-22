<template>
    <div class="component-container">
        <div class="comp-details">
            <div
                style="display: flex; width:100%;line-height: 21px; align-items: center;"
            >
                <div class="cl-Mako bold-xs">{{ component.name }}</div>
                <div
                    class="cl-RoyalBlue bold-xs"
                    style="display: flex;justify-content: flex-end; flex: 1;"
                >
                    <span
                        class="bold-xs clickable-label"
                        :class="{
                            'cl-DustyGray2': !currentPriceModel.is_active,
                            'cl-RoyalBlue': currentPriceModel.is_active
                        }"
                        @click="
                            currentPriceModel.is_active = !currentPriceModel.is_active
                        "
                        >{{
                            currentPriceModel.is_active ? 'Active' : 'Inactive'
                        }}</span
                    >
                    <nitrozen-toggle
                        class="pad-right"
                        v-model="currentPriceModel.is_active"
                    ></nitrozen-toggle>
                </div>
            </div>
            <div class="prices-box">
                <price-model-page
                    v-if="currentPriceModel"
                    :baseComponent="component"
                    :priceModel="currentPriceModel"
                >
                </price-model-page>
                <div v-else class="form-row">
                    <div class="price-model-table">
                        <div
                            class="price-item"
                            v-for="detailField in Object.keys(options)"
                            :key="detailField"
                            v-show="getPriceModelValue(detailField)"
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
import {
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import { PLAN_ENUMS, getProp } from '../../helper/plan-creator-helper';
import PriceModelPage from '../../pages/plan-creator/component-price.vue';

export default {
    name: 'plan-component-card',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-toggle': NitrozenToggleBtn,
        'price-model-page': PriceModelPage
    },
    props: {
        component: {
            type: Object
        },
        price_component: {
            type: Object
        }
    },
    data() {
        return {
            enabled: false,
            editMode: true,
            options: PLAN_ENUMS
        };
    },
    computed: {
        currentPriceModel() {
            return this.price_component.component_price;
        }
    },
    methods: {
        enableForPlan() {
            this.$emit('enable', this.enabled);
        },
        getPriceModelValue(detailField) {
            if (this.currentPriceModel.processing_type !== 'revenue') {
                return null;
            }
            let fieldPath = this.options[detailField].path || detailField;
            let val = getProp(this.currentPriceModel, fieldPath);
            if (!val) {
                return '';
            }
            let displayVal =
                this.options[detailField].enum.find((it) => it.value === val) ||
                {};
            return displayVal.text || '';
        }
    }
};
</script>
