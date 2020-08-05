<template>
    <div class="comp-container">
        <div class="form-row">
            <div class="bold-sm top-headers">
                Change Settlement Status
            </div>
        </div>
        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'High Street'"
                    v-model="formData.data.settle_cycle_period.high_street"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :label="'Mall'"
                    v-model="formData.data.settle_cycle_period.mall"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :label="'Warehouse'"
                    v-model="formData.data.settle_cycle_period.warehouse"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
        </div>

        <div class="form-row">
            <div class="bold-sm top-headers">
                Select a Formula/Condition
            </div>
        </div>
        <div
            v-for="comp_key in Object.keys(options)"
            :key="comp_key"
            class="form-row rule-row-cont"
        >
            <div class="form-item">
                <div class="form-row">
                    <nitrozen-checkbox
                        :value="tran_comp[comp_key] !== undefined"
                        @input="
                            (value) => {
                                updateComponent(
                                    value ? options[comp_key][0].id : null,
                                    comp_key,
                                    'transaction'
                                );
                            }
                        "
                    >
                        <span class="bold-xs">{{
                            getCamelCase(comp_key)
                        }}</span>
                    </nitrozen-checkbox>
                </div>
                <div
                    class="form-row full-row"
                    v-show="tran_comp[comp_key] !== undefined"
                    v-for="opt_obj in options[comp_key]"
                    :key="opt_obj.id"
                >
                    <nitrozen-radio
                        :name="`${comp_key}_main_${config._id}`"
                        :radioValue="opt_obj.id"
                        v-model="tran_comp[comp_key]"
                    >
                        <span class="regular-xs">{{
                            opt_obj.description
                        }}</span>
                        <span
                            ><nitrozen-tooltip
                                :tooltipText="opt_obj.formula"
                            ></nitrozen-tooltip
                        ></span>
                    </nitrozen-radio>
                </div>
                <div
                    v-if="
                        tran_comp[comp_key] &&
                            options[comp_key].find(
                                (opt) => opt.id === tran_comp[comp_key]
                            ).user_input_fields.length
                    "
                >
                    <div
                        class="form-row"
                        v-for="user_input in options[comp_key].find(
                            (opt) => opt.id === tran_comp[comp_key]
                        ).user_input_fields"
                        :key="user_input.id"
                    >
                        <div class="form-item">
                            <div class="form-row">
                                <span class="bold-xs">{{
                                    getCamelCase(user_input)
                                }}</span>
                            </div>
                            <div class="form-row">
                                <div class="form-item">
                                    <nitrozen-dropdown
                                        :label="'   '"
                                        :items="input_types"
                                        :value="
                                            cond_data[user_input]
                                                ? 'conditional'
                                                : 'fixed'
                                        "
                                        @input="
                                            (value) => {
                                                updateComponent(
                                                    value === 'fixed'
                                                        ? 0
                                                        : null,
                                                    user_input,
                                                    'default'
                                                );
                                                updateComponent(
                                                    value === 'conditional'
                                                        ? {
                                                              on:
                                                                  conditional_types[0]
                                                                      .value,
                                                              condition: '0'
                                                          }
                                                        : null,
                                                    user_input,
                                                    'conditional'
                                                );
                                            }
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="form-item">
                                    <nitrozen-dropdown
                                        class="no-label"
                                        :label="'Condition Applicable On'"
                                        v-if="cond_data[user_input]"
                                        :items="conditional_types"
                                        :value="cond_data[user_input]['on']"
                                        @input="
                                            (value) =>
                                                updateComponent(
                                                    value,
                                                    user_input,
                                                    'conditional_value'
                                                )
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                            </div>
                            <div class="form-row form-compact-items">
                                <div class="form-item">
                                    <nitrozen-input
                                        v-if="
                                            default_data[user_input] !==
                                                undefined
                                        "
                                        :label="'Value'"
                                        :type="'number'"
                                        v-model="default_data[user_input]"
                                    ></nitrozen-input>
                                    <nitrozen-input
                                        v-else-if="cond_data[user_input]"
                                        :label="'Value'"
                                        v-model="
                                            cond_data[user_input]['condition']
                                        "
                                        :placeholder="
                                            '10 if shipment_value > 500 else 50'
                                        "
                                    ></nitrozen-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
::v-deep .no-label {
    .nitrozen-dropdown-label {
        display: none;
    }
}

.nitrozen-dialog {
    ::v-deep .nitrozen-dialog-body {
        box-sizing: border-box;
    }
    .comp-container {
        &.plan-component {
            .form-row.rule-row-cont {
                border: 1px solid @DustyGray2;
                border-radius: @BorderRadius;
                padding: 8px 12px;
                box-sizing: border-box;
                + .rule-row-cont {
                    margin: 12px 0;
                }
            }
        }
    }
}
</style>

<script>
import {
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';

import _ from 'lodash';

export default {
    name: 'daytrader-component',
    props: {
        config: {
            type: Object
        },
        options: {
            type: Object
        }
    },
    components: {
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-tooltip': NitrozenTooltip
    },
    created() {
        _.merge(this.formData, { data: this.config.data.rule });
    },
    data() {
        return {
            input_types: [
                {
                    text: 'Fixed',
                    value: 'fixed'
                },
                {
                    text: 'Conditional',
                    value: 'conditional'
                }
            ],
            conditional_types: [
                {
                    text: 'Bag',
                    value: 'Bag'
                },
                {
                    text: 'Shipment',
                    value: 'Shipment'
                },
                {
                    text: 'Order',
                    value: 'Order'
                }
            ],
            formData: {
                data: {
                    slug_fields: ['channel'],
                    slug_values: {
                        channel: {}
                    },
                    rule_start_date: null,
                    rule_end_date: null,
                    settle_cycle_period: {
                        mall: 0,
                        warehouse: 0,
                        high_street: 0
                    },
                    settlement_type: '',
                    transactional_components: {
                        is_tp: false,
                        defaults: {},
                        conditional: {},
                        transaction_component: {}
                    }
                }
            }
        };
    },
    computed: {
        main_config() {
            return this.formData.data.transactional_components;
        },
        tran_comp() {
            return this.main_config.transaction_component;
        },
        cond_data() {
            return this.main_config.conditional;
        },
        default_data() {
            return this.main_config.defaults;
        }
    },
    methods: {
        getCamelCase(str) {
            return str
                .split('_')
                .map((txt) => txt.replace(txt[0], txt[0].toUpperCase()))
                .join(' ');
        },
        resetData(data) {
            _.merge(this.formData, data);
        },
        updateComponent(value, key, type) {
            let obj = null;
            if (type === 'transaction') {
                obj = this.tran_comp;
                if (value) {
                    this.$set(this.default_data, key, 0);
                } else {
                    this.$delete(this.default_data, key);
                    this.$delete(this.cond_data, key);
                }
            } else if (type === 'conditional') {
                obj = this.cond_data;
            } else if (type === 'conditional_value') {
                obj = this.cond_data[key];
                key = 'on';
            } else {
                obj = this.default_data;
            }
            if (value !== null) {
                this.$set(obj, key, value);
            } else {
                this.$delete(obj, key);
            }
        }
    }
};
</script>
