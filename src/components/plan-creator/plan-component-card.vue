<template>
    <div :class="{ 'component-container': !daytrader }">
        <div class="comp-details">
            <div
                v-if="!daytrader"
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
            </div>
            <div class="prices-box">
                <price-model-page
                    :ref="'price-model'"
                    v-if="currentPriceModel"
                    :baseComponent="component"
                    :priceModel="currentPriceModel"
                    :disabled="disabled"
                >
                </price-model-page>
                <div v-else-if="daytrader">
                    <div
                        v-for="(rule, index) in price_component.shallow_rules"
                        :key="index"
                        class="component-container daytrader-rule"
                    >
                        <div class="rule-name bold-xs cl-Mako">
                            {{ rule.data.name || 'Default Rule' }}
                        </div>
                        <div class="rule-actions">
                            <div
                                class="clickable-label pad-right"
                                @click="
                                    () => {
                                        edit_rule_idx = index;
                                        editDayTraderRule();
                                    }
                                "
                            >
                                <inline-svg :src="'edit'"></inline-svg>
                            </div>
                            <div
                                class="clickable-label"
                                @click="
                                    () => {
                                        edit_rule_idx = index;
                                        editDayTraderRule(true);
                                    }
                                "
                            >
                                <inline-svg :src="'copy'"></inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            v-if="component && daytrader"
            ref="daytrader_rule_edit"
            :title="
                `${edit_rule_idx > -1 ? 'Edit' : 'Create'} ${
                    component.name
                } Rule`
            "
            @close="
                $refs['daytrader'].resetData(component.data);
                edit_rule_idx = -1;
            "
        >
            <template slot="body">
                <daytrader-component
                    v-if="dtOptions"
                    :disabled="disabled"
                    :options="dtOptions"
                    :ref="'daytrader'"
                    class="plan-component"
                    :config="price_component.shallow_rules[0].data"
                    :cbs_opts="cbs_opts"
                    :component_id="price_component.component_id"
                >
                </daytrader-component>
            </template>
            <template slot="footer">
                <nitrozen-button
                    class="pad-right"
                    v-flatBtn
                    :theme="'secondary'"
                    @click="updateDaytraderData"
                    >{{
                        edit_rule_idx > -1 ? 'Update' : 'Add'
                    }}</nitrozen-button
                >
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
.daytrader-rule {
    display: flex;
    align-items: center;
    + .daytrader-rule {
        margin-top: 12px;
    }
    .rule-name {
        flex: 1;
    }
    .rule-actions {
        display: flex;
    }
}
.component-container {
    padding: 12px;
    box-sizing: border-box;
    border-radius: @BorderRadius;
    width: 100%;
    border: 1px solid @Iron;

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
import { InlineSvg } from '../common/';

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
        'daytrader-component': daytraderComponent,
        'inline-svg': InlineSvg
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
        },
        dtOptions: {
            type: Object
        },
        cbs_opts: {
            type: Object
        },
        disabled: {
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
            options: PLAN_ENUMS,
            edit_rule_idx: -1
        };
    },
    computed: {
        currentPriceModel() {
            return this.price_component
                ? this.price_component.component_price
                : null;
        },
        dtRules() {
            return this.price_component.shallow_rules
                ? this.price_component.shallow_rules
                : [];
        }
    },
    methods: {
        enableForPlan() {
            this.$emit('enable', this.enabled);
        },
        updateFeature(value) {
            if (
                this.currentPriceModel.processing_type === 'feature_config' &&
                this.currentPriceModel.feature_config.hasOwnProperty('enabled')
            ) {
                this.currentPriceModel.feature_config.enabled = value;
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
        editDayTraderRule(clone) {
            this.$refs['daytrader_rule_edit'].open({
                width: '850px',
                height: 'calc(100% - 100px)',
                dismissible: true,
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false
            });
            if (this.edit_rule_idx > -1 && this.dtRules[this.edit_rule_idx]) {
                _.merge(
                    this.$refs['daytrader'].formData,
                    this.dtRules[this.edit_rule_idx].data
                );
            } else {
                _.merge(this.$refs['daytrader'].formData, this.component.data);
            }
            if (clone) {
                this.edit_rule_idx = -1;
            }
        },
        updateDaytraderData() {
            if (!this.$refs['daytrader'].validateData()) {
                this.$snackbar.global.showError(
                    'Invalid data entered. Please enter valid data.'
                );
                return;
            }
            if (this.edit_rule_idx > -1 && this.dtRules[this.edit_rule_idx]) {
                _.merge(
                    this.dtRules[this.edit_rule_idx].data,
                    this.$refs['daytrader'].formData
                );
                this.dtRules[this.edit_rule_idx].rule_type = 'plan_rule';
                this.dtRules[this.edit_rule_idx].data.slug_fields.push(
                    'company'
                );
                this.dtRules[this.edit_rule_idx].data.slug_values[
                    'company'
                ] = this.cbs_opts['companies'];
            } else {
                let newIdx = this.dtRules.length;
                this.dtRules.push(
                    _.cloneDeep(
                        _.pick(this.dtRules[0], [
                            'data',
                            'auto_verify',
                            'plan_id',
                            'is_active',
                            'component_id'
                        ])
                    )
                );
                _.merge(
                    this.dtRules[newIdx].data,
                    this.$refs['daytrader'].formData
                );
                this.dtRules[newIdx].rule_type = 'plan_rule';
                this.dtRules[newIdx].data.slug_fields.push('company');
                this.dtRules[newIdx].data.slug_values[
                    'company'
                ] = this.cbs_opts['companies'];
            }
            this.$refs['daytrader_rule_edit'].close();
        },
        validateData() {
            if (this.$refs['price-model']) {
                return this.$refs['price-model'].validateData();
            }
            return true;
        }
    }
};
</script>
