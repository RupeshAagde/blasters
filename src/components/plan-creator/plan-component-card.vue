<template>
    <div class="component-container">
        <div class="comp-details">
            <div
                style="display: flex; width:100%;line-height: 21px; align-items: center;"
            >
                <div class="cl-Mako bold-xs">{{ component.name }}</div>
                <toggle-switch
                    v-if="
                        currentPriceModel &&
                            currentPriceModel.processing_type !== 'display'
                    "
                    v-model="currentPriceModel.is_active"
                    @input="updateFeature"
                ></toggle-switch>
                <div class="align-right" v-else-if="daytrader">
                    <span
                        class="bold-xs clickable-label cl-RoyalBlue"
                        @click="editDayTraderRule"
                    >
                        Edit Rule
                    </span>
                </div>
            </div>
            <div class="prices-box">
                <price-model-page
                    v-if="currentPriceModel"
                    :baseComponent="component"
                    :priceModel="currentPriceModel"
                >
                </price-model-page>
                <div v-else-if="daytrader" class="form-row"></div>
            </div>
        </div>
        <nitrozen-dialog
            v-if="component && daytrader"
            ref="daytrader_rule_edit"
            :title="`Edit ${component.name} Rule`"
        >
            <template slot="body">
                <daytrader-component class="plan-component" :config="component">
                </daytrader-component>
            </template>
            <template slot="footer">
                <nitrozen-button
                    class="pad-right"
                    v-flatBtn
                    :theme="'secondary'"
                    >Update</nitrozen-button
                >
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
.component-container {
    padding: 12px;
    box-sizing: border-box;
    border-radius: @BorderRadius;
    width: 100%;
    border: 1px solid @Iron;

    .align-right {
        justify-content: flex-end;
        flex: 1;
        display: flex;
    }

    .prices-box {
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
    NitrozenToggleBtn,
    NitrozenDialog,
    NitrozenButton,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import { PLAN_ENUMS, getProp } from '../../helper/plan-creator-helper';
import PriceModelPage from '../../pages/plan-creator/component-price.vue';
import toggleSwitch from '../../components/plan-creator/toggle-switch.vue';
import daytraderComponent from '../../components/plan-creator/daytrader-component.vue';

export default {
    name: 'plan-component-card',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-button': NitrozenButton,
        'price-model-page': PriceModelPage,
        'nitrozen-dialog': NitrozenDialog,
        'toggle-switch': toggleSwitch,
        'daytrader-component': daytraderComponent
    },
    props: {
        component: {
            type: Object
        },
        price_component: {
            type: Object
        },
        daytrader: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        flatBtn,
        strokeBtn
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
            return this.price_component
                ? this.price_component.component_price
                : null;
        }
    },
    methods: {
        enableForPlan() {
            this.$emit('enable', this.enabled);
        },
        updateFeature(value) {
            if (
                currentPriceModel.processing_type === 'feature_config' &&
                currentPriceModel.feature_config.hasOwnProperty('enabled')
            ) {
                currentPriceModel.feature_config.enabled = value;
            }
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
        },
        editDayTraderRule() {
            this.$refs['daytrader_rule_edit'].open({
                width: '850px',
                height: 'calc(100% - 100px)',
                dismissible: true,
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false
            });
        }
    }
};
</script>
