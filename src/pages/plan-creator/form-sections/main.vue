<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Details</div>
        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'Name *'"
                    v-model="formData.plan.name"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['name'] }">{{
                    errors['name'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    class="desc"
                    :label="'Description'"
                    v-model="formData.plan.description"
                    :type="'textarea'"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['desc'] }">{{
                    errors['desc'] || '-'
                }}</nitrozen-error>
            </div>
        </div>
        <div class="cl-Mako bold-md top-headers">Settings</div>
        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :suffix="'₹'"
                    :label="'Amount *'"
                    v-model="formData.plan.amount"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['amount'] }">{{
                    errors['amount'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Recurring Time*'"
                    v-model="formData.plan.recurring.interval_count"
                    :showSuffix="true"
                    :custom="true"
                >
                    <nitrozen-dropdown
                        class="filter-dropdown"
                        :items="durationUnits"
                        v-model="formData.plan.recurring.interval"
                    ></nitrozen-dropdown>
                </nitrozen-input>
                <nitrozen-error
                    v-bind:class="{ visible: errors['trial_period'] }"
                    >{{ errors['trial_period'] || '-' }}</nitrozen-error
                >
            </div>
        </div>

        <div style="align-items: center;" class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.plan.is_trial_plan"
                    >Trial Plan
                </nitrozen-checkbox>
                <nitrozen-error v-if="!formData.plan.is_trial_plan"
                    >-</nitrozen-error
                >
            </div>
            <div v-if="formData.plan.is_trial_plan" class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Trial Days *'"
                    v-model="formData.plan.trial_period"
                ></nitrozen-input>
                <nitrozen-error
                    v-bind:class="{ visible: errors['trial_period'] }"
                    >{{ errors['trial_period'] || '-' }}</nitrozen-error
                >
            </div>
        </div>

        <div v-if="formData.plan.type === 'public'" class="form-row">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.plan.is_visible"
                    >Visible to all
                </nitrozen-checkbox>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>

        <div class="form-row" v-if="this.formData.components.length">
            <div class="form-item">
                <div class="cl-Mako bold-md top-headers">
                    Display Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    v-for="component in getComponents('display')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md top-headers">
                    Feature Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    v-for="component in getComponents('feature_config')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md top-headers">
                    Revenue Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    v-for="component in getComponents('revenue')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md top-headers">
                    Daytrader Components
                </div>
                <plan-component
                    class="plan-component"
                    v-for="component in formData.dayTraderComponents"
                    :key="component._id"
                    :component="component"
                    :daytrader="true"
                ></plan-component>
                <!-- <daytrader-component
                    class="plan-component"
                    :formData="{}"
                >
                </daytrader-component> -->
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.top-headers {
    margin-top: 48px;
    margin-bottom: 6px;
}
.filter-dropdown {
    min-width: 100px;
}
.plan-component {
    + .plan-component {
        margin-top: 12px;
    }
}
.desc {
    textarea {
        resize: none;
    }
}
</style>
<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import planComponentCard from '../../../components/plan-creator/plan-component-card.vue';
import BillingService from '../../../services/billing.service';

export default {
    name: 'main-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'plan-component': planComponentCard
    },
    props: {
        formData: {
            type: Object
        },
        errors: {
            type: Object
        },
        allComponents: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            durationUnits: [
                {
                    text: 'Days',
                    value: 'day'
                },
                {
                    text: 'Months',
                    value: 'month'
                },
                {
                    text: 'Years',
                    value: 'year'
                }
            ],
            daytrader: [
                {
                    data: {
                        channels: ['fynd_store'],
                        rule: {
                            slug_values: {
                                channel: {
                                    id: 'fynd_store',
                                    name: 'Fynd Store'
                                }
                            },
                            transactional_components: {
                                is_tp: false,
                                defaults: {
                                    commission: 9,
                                    processing_fee: 2,
                                    rto_comm_reversal: 100,
                                    return_comm_reversal: 100
                                },
                                source_components: [
                                    'brand_calculated_amount',
                                    'value_of_good'
                                ],
                                transaction_component: {
                                    commission:
                                        '8f6539d9-b5bf-4fb6-b0f8-133644063b49',
                                    processing_fee:
                                        'cd31dee8-d3d2-4743-ad21-803389e7b554',
                                    commission_rto_charges:
                                        '6580c2ad-cb89-4baf-8432-6c98748dd1f4',
                                    commission_return_charges:
                                        '5410fc0f-95a9-4aad-9206-071ff7a49a6c',
                                    processing_fee_rto_charges:
                                        '28df9904-6226-4c63-a8ed-a6062af6b866',
                                    processing_fee_return_charges:
                                        '50811a1e-85fa-4b19-9330-efe2f8fe4c52'
                                }
                            },
                            settle_cycle_period: {
                                mall: 21,
                                warehouse: 7,
                                high_street: 21
                            },
                            settlement_type: 'weekly'
                        }
                    },
                    is_active: true,
                    _id: '5f1aba7eeb9b030035773e0a',
                    name: 'Fynd Store Settlement',
                    slug: 'fynd-store-settlement',
                    description: 'Fynd Store settlment rules',
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-24T10:39:58.854Z',
                    modified_at: '2020-07-24T10:39:58.854Z'
                },
                {
                    data: {
                        channels: ['ecomm'],
                        rule: {
                            slug_values: {
                                channel: {
                                    id: 'ecomm',
                                    name: 'Ecomm'
                                }
                            },
                            transactional_components: {
                                is_tp: false,
                                defaults: {
                                    commission: 12,
                                    rto_comm_reversal: 100,
                                    return_comm_reversal: 100
                                },
                                source_components: ['brand_calculated_amount'],
                                transaction_component: {
                                    commission:
                                        '248f0475-c840-408d-8db4-2ef27ec6635e',
                                    commission_rto_charges:
                                        'b8c62e9a-33a4-4522-bb46-c0a5f70f7192',
                                    commission_return_charges:
                                        '6a55087f-f153-4731-b2bc-b07ac48d2b0c'
                                }
                            },
                            settle_cycle_period: {
                                mall: 21,
                                warehouse: 7,
                                high_street: 21
                            },
                            settlement_type: 'weekly'
                        }
                    },
                    is_active: true,
                    _id: '5f1aba7eeb9b030035773e09',
                    name: 'Applications Settlement',
                    slug: 'application-settlement',
                    description: 'Application settlment rules',
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-24T10:39:58.854Z',
                    modified_at: '2020-07-24T10:39:58.854Z'
                },
                {
                    data: {
                        channels: ['fynd'],
                        rule: {
                            slug_values: {
                                channel: {
                                    id: 'fynd',
                                    name: 'Fynd'
                                }
                            },
                            transactional_components: {
                                is_tp: false,
                                defaults: {
                                    commission: 9,
                                    processing_fee: 2,
                                    rto_comm_reversal: 100,
                                    return_comm_reversal: 100
                                },
                                source_components: [
                                    'brand_calculated_amount',
                                    'value_of_good'
                                ],
                                transaction_component: {
                                    commission:
                                        '8f6539d9-b5bf-4fb6-b0f8-133644063b49',
                                    processing_fee:
                                        'cd31dee8-d3d2-4743-ad21-803389e7b554',
                                    commission_rto_charges:
                                        '6580c2ad-cb89-4baf-8432-6c98748dd1f4',
                                    commission_return_charges:
                                        '5410fc0f-95a9-4aad-9206-071ff7a49a6c',
                                    processing_fee_rto_charges:
                                        '28df9904-6226-4c63-a8ed-a6062af6b866',
                                    processing_fee_return_charges:
                                        '50811a1e-85fa-4b19-9330-efe2f8fe4c52'
                                }
                            },
                            settle_cycle_period: {
                                mall: 21,
                                warehouse: 7,
                                high_street: 21
                            },
                            settlement_type: 'weekly'
                        }
                    },
                    is_active: true,
                    _id: '5f1aba7eeb9b030035773e08',
                    name: 'Fynd Settlement',
                    slug: 'fynd-settlement',
                    description: 'Fynd settlment rules',
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-24T10:39:58.854Z',
                    modified_at: '2020-07-24T10:39:58.854Z'
                },
                {
                    data: {
                        channels: ['uniket'],
                        rule: {
                            slug_values: {
                                channel: {
                                    id: 'uniket',
                                    name: 'Uniket'
                                }
                            },
                            transactional_components: {
                                is_tp: true,
                                defaults: {
                                    processing_fee: 2
                                },
                                source_components: [
                                    'transfer_price',
                                    'brand_calculated_amount',
                                    'gst_fee'
                                ],
                                transaction_component: {
                                    commission:
                                        '2172ba36-46cc-42cc-b91a-034075e4219f',
                                    processing_fee:
                                        'ae867a0b-d667-4910-be01-9ef9f6f4e780'
                                }
                            },
                            settle_cycle_period: {
                                mall: 21,
                                warehouse: 7,
                                high_street: 21
                            },
                            settlement_type: 'weekly'
                        }
                    },
                    is_active: true,
                    _id: '5f1aba7eeb9b030035773e0b',
                    name: 'Uniket Settlement',
                    slug: 'uniket-settlement',
                    description: 'Uniket settlment rules',
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-24T10:39:58.912Z',
                    modified_at: '2020-07-24T10:39:58.912Z'
                },
                {
                    data: {
                        channels: ['marketplace'],
                        rule: {
                            slug_values: {
                                channel: {
                                    id: 'marketplace',
                                    name: 'Market Place'
                                }
                            },
                            transactional_components: {
                                is_tp: false,
                                defaults: {
                                    commission: 2,
                                    rto_comm_reversal: 100,
                                    return_comm_reversal: 100
                                },
                                source_components: ['brand_calculated_amount'],
                                transaction_component: {
                                    commission:
                                        '248f0475-c840-408d-8db4-2ef27ec6635e'
                                }
                            },
                            settle_cycle_period: {
                                mall: 21,
                                warehouse: 7,
                                high_street: 21
                            },
                            settlement_type: 'weekly'
                        }
                    },
                    is_active: true,
                    _id: '5f1aba7eeb9b030035773e0c',
                    name: 'Marketplace Settlement',
                    slug: 'marketplace-settlement',
                    description: 'Marketplace settlment rules',
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-24T10:39:58.912Z',
                    modified_at: '2020-07-24T10:39:58.912Z'
                }
            ]
        };
    },
    mounted() {},
    computed: {
        planComponentMap() {
            return this.formData.components.reduce((map, item) => {
                map[item.component_id] = item;
                return map;
            }, {});
        }
    },
    methods: {
        getComponents(type) {
            return this.allComponents.filter((comp) => {
                return comp.component_price_config.type === type;
            });
        }
    }
};
</script>
