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
        }
        // options: {
        //     type: Array
        // }
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
            },
            options: {
                cod_fees_from_brand: [
                    {
                        id: 'b6ea4eb8-f3f5-4c08-b3d9-d69160800b7c',
                        created_at: 1589021794,
                        created_by: 'sohil_parikh',
                        name: 'cod_fees_from_brand',
                        formula_type: 'default',
                        formula:
                            'brand_calculated_amount*(cod_fees_from_brand\/100)',
                        description: 'COD fee taken from brand for cod order',
                        display_name: 'COD fee from Brand',
                        transactional_input_fields: [
                            'brand_calculated_amount',
                            'cod_fees_from_brand'
                        ],
                        user_input_fields: ['cod_fees_from_brand'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1589021794
                    },
                    {
                        id: 'ed134df6-0992-4220-9e1f-38e0c6f0e971',
                        created_at: 1588426736,
                        created_by: 'sohil_parikh',
                        name: 'cod_fees_from_brand',
                        formula_type: 'default',
                        formula: 'cod_charges\/1.18',
                        description: 'COD taken from brand',
                        display_name: 'Cod fee from Brand',
                        transactional_input_fields: ['cod_charges'],
                        user_input_fields: [],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1588426736
                    }
                ],
                commission: [
                    {
                        id: '248f0475-c840-408d-8db4-2ef27ec6635e',
                        created_at: 1581682795,
                        created_by: '1',
                        name: 'commission',
                        formula_type: 'default',
                        formula:
                            'brand_calculated_amount * (commission\/100.0)',
                        description: 'Calculate Commission value',
                        display_name: 'Commission Amount',
                        transactional_input_fields: [
                            'brand_calculated_amount',
                            'commission'
                        ],
                        user_input_fields: ['commission'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1581682795
                    },
                    {
                        id: 'a56cf960-30c2-4c3d-9aba-9dae93e5b2af',
                        created_at: 1584961502,
                        created_by: 'oms_testing',
                        name: 'commission',
                        formula_type: 'default',
                        formula:
                            '(brand_calculated_amount - (transfer_price + gst_fee))\/1.18',
                        description:
                            'Net profit for Transfer Price which will get break into virtual commission and processing_fee',
                        display_name: 'Commission for Transfer Price',
                        transactional_input_fields: [
                            'transfer_price',
                            'brand_calculated_amount',
                            'gst_fee'
                        ],
                        user_input_fields: [],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1584961502
                    },
                    {
                        id: '8f6539d9-b5bf-4fb6-b0f8-133644063b49',
                        created_at: 1583393090,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'commission',
                        formula_type: 'default',
                        formula: 'value_of_good * (commission\/100.0)',
                        description: 'Calculate Commission value on ESP',
                        display_name: 'Commission Charge on ESP',
                        transactional_input_fields: [
                            'value_of_good',
                            'commission'
                        ],
                        user_input_fields: ['commission'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583393090
                    },
                    {
                        id: '2172ba36-46cc-42cc-b91a-034075e4219f',
                        created_at: 1586331147,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'commission',
                        formula_type: 'default',
                        formula:
                            '(((brand_calculated_amount - (transfer_price + gst_fee))\/1.18) - (brand_calculated_amount * (processing_fee\/100.0))) if ((brand_calculated_amount * (processing_fee\/100.0)) < ((brand_calculated_amount - (transfer_price + gst_fee))\/1.18)) else ((brand_calculated_amount - (transfer_price + gst_fee))\/1.18)',
                        description: 'Commission in case of TP',
                        display_name: 'TP Commission',
                        transactional_input_fields: [
                            'transfer_price',
                            'processing_fee',
                            'gst_fee',
                            'brand_calculated_amount'
                        ],
                        user_input_fields: ['processing_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1586331147
                    }
                ],
                commission_return_charges: [
                    {
                        id: '5410fc0f-95a9-4aad-9206-071ff7a49a6c',
                        created_at: 1583394652,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'commission_return_charges',
                        formula_type: 'default',
                        formula:
                            'value_of_good * (commission\/100) * (100 - return_comm_reversal)\/100.0',
                        description:
                            'Commission return reversal charges on ESP',
                        display_name:
                            'Commission return reversal charges on ESP',
                        transactional_input_fields: [
                            'value_of_good',
                            'commission',
                            'return_comm_reversal'
                        ],
                        user_input_fields: [
                            'commission',
                            'return_comm_reversal'
                        ],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583394652
                    },
                    {
                        id: '6a55087f-f153-4731-b2bc-b07ac48d2b0c',
                        created_at: 1581682795,
                        created_by: '1',
                        name: 'commission_return_charges',
                        formula_type: 'default',
                        formula:
                            'brand_calculated_amount * (commission\/100.0)*(100 - return_comm_reversal)\/100.0',
                        description: 'Calculate Processing value',
                        display_name: 'commission_amount_return_charges',
                        transactional_input_fields: [
                            'brand_calculated_amount',
                            'commission',
                            'return_comm_reversal'
                        ],
                        user_input_fields: [
                            'commission',
                            'return_comm_reversal'
                        ],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1581682795
                    }
                ],
                commission_rto_charges: [
                    {
                        id: 'b8c62e9a-33a4-4522-bb46-c0a5f70f7192',
                        created_at: 1581682795,
                        created_by: '1',
                        name: 'commission_rto_charges',
                        formula_type: 'default',
                        formula:
                            'brand_calculated_amount * (commission\/100.0) * (100 - rto_comm_reversal)\/100.0',
                        description: 'Calculate Processing value',
                        display_name: 'commission_amount_rto_charges',
                        transactional_input_fields: [
                            'brand_calculated_amount',
                            'commission',
                            'rto_comm_reversal'
                        ],
                        user_input_fields: ['commission', 'rto_comm_reversal'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1581682795
                    },
                    {
                        id: '6580c2ad-cb89-4baf-8432-6c98748dd1f4',
                        created_at: 1583394670,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'commission_rto_charges',
                        formula_type: 'default',
                        formula:
                            'value_of_good * (commission\/100) * (100 - rto_comm_reversal)\/100.0',
                        description: 'Commission rto reversal charges on ESP',
                        display_name: 'Commission rto reversal charges on ESP',
                        transactional_input_fields: [
                            'value_of_good',
                            'commission',
                            'rto_comm_reversal'
                        ],
                        user_input_fields: ['commission', 'rto_comm_reversal'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583394670
                    }
                ],
                logistics_fee: [
                    {
                        id: '972b1fed-2e06-4ad1-879e-c418416dc195',
                        created_at: 1583395727,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'logistics_fee',
                        formula_type: 'default',
                        formula: 'logistics_fee',
                        description: 'Logistic fee',
                        display_name: 'Logistic fee',
                        transactional_input_fields: ['logistics_fee'],
                        user_input_fields: ['logistics_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583395727
                    }
                ],
                packaging_fee: [
                    {
                        id: 'fee82514-c6c4-45e1-a459-80f049f13835',
                        created_at: 1583393789,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'packaging_fee',
                        formula_type: 'default',
                        formula: 'packaging_fee',
                        description: 'Flat Packaging fee',
                        display_name: 'FLat Packaging fee',
                        transactional_input_fields: ['packaging_fee'],
                        user_input_fields: ['packaging_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583393789
                    }
                ],
                processing_fee: [
                    {
                        id: 'ae867a0b-d667-4910-be01-9ef9f6f4e780',
                        created_at: 1586330506,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'processing_fee',
                        formula_type: 'default',
                        formula:
                            '(brand_calculated_amount * (processing_fee\/100.0)) if ((brand_calculated_amount * (processing_fee\/100.0)) < ((brand_calculated_amount - (transfer_price + gst_fee))\/1.18)) else 0',
                        description: 'Processing fee in case of TP',
                        display_name: 'TP Processing Fee',
                        transactional_input_fields: [
                            'transfer_price',
                            'processing_fee',
                            'gst_fee',
                            'brand_calculated_amount'
                        ],
                        user_input_fields: ['processing_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1586330506
                    },
                    {
                        id: 'cd31dee8-d3d2-4743-ad21-803389e7b554',
                        created_at: 1581682795,
                        created_by: '1',
                        name: 'processing_fee',
                        formula_type: 'default',
                        formula:
                            'brand_calculated_amount * (processing_fee\/100.0)',
                        description: 'Calculate Processing value',
                        display_name: 'Processing Fee',
                        transactional_input_fields: [
                            'processing_fee',
                            'brand_calculated_amount'
                        ],
                        user_input_fields: ['processing_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1581682795
                    },
                    {
                        id: '8cd15419-9bdd-4f0d-afea-75cc9675e9af',
                        created_at: 1583393164,
                        created_by: 'sohilparikh_gofynd_com_59106',
                        name: 'processing_fee',
                        formula_type: 'default',
                        formula: 'value_of_good * (processing_fee\/100.0)',
                        description: 'Calculate Processing fee value on ESP',
                        display_name: 'Processing fee on ESP',
                        transactional_input_fields: [
                            'value_of_good',
                            'processing_fee'
                        ],
                        user_input_fields: ['processing_fee'],
                        status: 'verified',
                        updated_by: null,
                        updated_at: 1583393164
                    }
                ]
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
        updateComponent(value, key, type) {
            let obj = null;
            console.log('abc');
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
