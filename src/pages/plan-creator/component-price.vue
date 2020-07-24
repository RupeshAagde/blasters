<template>
    <div class="price-form">
        <div v-if="formData.processing_type === 'display'">
            <div class="form-row form-compact-items">
                <div class="form-item">
                    <nitrozen-input
                        :label="'Feature Text *'"
                        v-model="formData.display_text"
                    ></nitrozen-input>
                </div>
            </div>
        </div>
        <div v-else-if="formData.processing_type === 'feature_config'">
            <component
                :is="baseComponent.slug"
                :formData="formData"
                :config="baseComponent.component_price_config.feature_config"
            ></component>
        </div>
        <div v-else>
            <div class="form-row form-compact-items">
                <div class="form-item">
                    <nitrozen-dropdown
                        :tooltip="pricing_map[formData.price_ui_type].tooltip"
                        :label="'Pricing Model *'"
                        :items="pricing_values"
                        v-model="formData.price_ui_type"
                        @input="changeType"
                    ></nitrozen-dropdown>
                </div>
            </div>
            <!-- <div class="form-row">
                <div class="form-item">
                    <nitrozen-checkbox v-model="formData.is_active">Enabled</nitrozen-checkbox>
                </div>
            </div> -->
            <div class="form-row form-compact-items">
                <div
                    v-if="
                        formData.billing_scheme === 'per_unit' &&
                            formData.price_type !== 'dynamic'
                    "
                    class="form-item price-type-dropdown"
                >
                    <nitrozen-dropdown
                        style="width: 170px;"
                        :label="`${options.price_type.text} *`"
                        :items="options.price_type.enum"
                        v-model="formData.price_type"
                    ></nitrozen-dropdown>
                </div>
            </div>

            <div v-if="isOneTimeBill" class="form-row form-compact-items">
                <div class="form-item">
                    <nitrozen-input
                        style="width: 300px;"
                        :type="'number'"
                        :allowNegative="false"
                        :showSuffix="true"
                        :custom="true"
                        :label="'Price Amount*'"
                        v-model="formData.unit_amount"
                    >
                        <nitrozen-dropdown
                            style="width:140px;"
                            :items="currentCurrency"
                            v-model="formData.currency"
                            :searchable="true"
                            @searchInputChange="
                                (e) =>
                                    (this.searchCurrency =
                                        e && e.text ? e.text : '')
                            "
                        ></nitrozen-dropdown>
                    </nitrozen-input>
                </div>
            </div>

            <div v-if="isTiered" class="form-row">
                <div class="form-item">
                    <nitrozen-input
                        :type="'number'"
                        :allowNegative="false"
                        :label="'Tier Usage Upto*'"
                    ></nitrozen-input>
                </div>
                <div class="form-item">
                    <nitrozen-input
                        :type="'number'"
                        :allowNegative="false"
                        :showSuffix="true"
                        :suffix="'₹'"
                        :label="'Tier Charges*'"
                    ></nitrozen-input>
                </div>
                <div class="form-item">
                    <nitrozen-input
                        :type="'number'"
                        :allowNegative="false"
                        :showSuffix="true"
                        :suffix="'₹'"
                        :label="'Flat Fees*'"
                    ></nitrozen-input>
                </div>
            </div>

            <div v-if="isTiered" class="form-row">
                <div class="form-item right-align">
                    <div class="text-btn cl-RoyalBlue bold-xs">Add Tier</div>
                </div>
            </div>

            <div
                style="align-items: flex-end;"
                class="form-row form-compact-items"
            >
                <div class="form-item">
                    <nitrozen-dropdown
                        :label="'Bill Period'"
                        :items="options.bill_type.enum"
                        v-model="formData.bill_type"
                    ></nitrozen-dropdown>
                </div>
                <div v-if="isRecurring" class="form-item">
                    <nitrozen-input
                        style="width: 200px;"
                        :type="'number'"
                        :allowNegative="false"
                        :showSuffix="true"
                        :custom="true"
                        :label="'Recurring Time *'"
                        v-model="formData.recurring.interval_count"
                    >
                        <nitrozen-dropdown
                            :label="options.interval.text"
                            :items="options.interval.enum"
                            v-model="formData.recurring.interval"
                        ></nitrozen-dropdown>
                    </nitrozen-input>
                </div>
            </div>

            <div
                v-if="isRecurring && formData.price_type !== 'dynamic'"
                class="form-row form-compact-items"
            >
                <div class="form-item price-type-dropdown">
                    <nitrozen-checkbox
                        :value="formData.recurring.usage_type === 'metered'"
                        @input="
                            (value) => {
                                formData.recurring.usage_type = value
                                    ? 'metered'
                                    : 'licensed';
                            }
                        "
                        >{{ 'Usage is metered' }}</nitrozen-checkbox
                    >
                </div>
            </div>
            <div
                v-if="formData.recurring.usage_type !== 'licensed'"
                class="form-row"
            >
                <div style="width:200px;" class="form-item">
                    <nitrozen-dropdown
                        :label="options.aggregate_usage.text"
                        :items="options.aggregate_usage.enum"
                        v-model="formData.recurring.aggregate_usage"
                    ></nitrozen-dropdown>
                </div>
            </div>

            <div class="form-row">
                <div class="form-item">
                    <nitrozen-checkbox v-model="show_advanced"
                        >Advance Settings</nitrozen-checkbox
                    >
                </div>
            </div>

            <div
                class="form-row"
                v-if="formData.price_type !== 'dynamic' && show_advanced"
            >
                <div class="form-item">
                    <nitrozen-input
                        :type="'number'"
                        :allowNegative="false"
                        :label="'Divide Usage'"
                        v-model="formData.transform_quantity.divide_by"
                    ></nitrozen-input>
                </div>

                <div class="form-item">
                    <nitrozen-dropdown
                        :label="'Round Units'"
                        :items="[
                            { text: 'Up', value: 'up' },
                            { text: 'Down', value: 'down' }
                        ]"
                        v-model="formData.transform_quantity.round"
                    ></nitrozen-dropdown>
                </div>
            </div>

            <div class="form-row form-compact-items">
                <div class="form-item">
                    <nitrozen-input
                        :label="'Feature Text *'"
                        v-model="formData.display_text"
                    ></nitrozen-input>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
::v-deep.price-form {
    box-sizing: border-box;
    flex-direction: column;

    .right-align {
        display: flex;
        justify-content: flex-end;
    }

    .text-btn {
        cursor: pointer;
    }

    .custom-label {
        flex: 0;
    }
    .form-row {
        width: 100%;
        display: flex;
        padding: 8px 0;
        margin: 0;
        .form-item {
            width: 100%;
            .custom-checkbox {
                .nitrozen-container {
                    margin-bottom: 0;
                }
            }
        }
        .form-item + .form-item {
            margin-left: 20px;
        }

        &.form-compact-items {
            flex-wrap: wrap;
            .form-item {
                width: auto;
            }
            .price-type-dropdown {
                width: 150px;
            }
        }
    }
    .nitrozen-error-visible {
        visibility: hidden;
        margin-bottom: 7px;
    }
    .nitrozen-error-visible.visible {
        visibility: visible;
    }
}
</style>

<script>
import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenError,
    NitrozenToolTip
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import { PLAN_ENUMS } from '../../helper/plan-creator-helper';
import { CURRENCIES } from '../../helper/currency.util';
import { TagsInput } from '../../components/common/';
import {
    TeamManagement,
    Products,
    Customers,
    MarketplaceIntegration,
    Support,
    AnalyticsRawEventQuery,
    AnalyticsRawEventExport,
    MobileApp,
    Sla,
    AnalyticsCampaignSource,
    SellingLocations,
    SaleWebsites,
    CustomPaymentGatwaySetup,
    PosInventoryIntegration,
    CatalogueExportMarketplace
} from '../../components/plan-creator/feature-components';

import toggleSwitch from '../../components/plan-creator/toggle-switch.vue';

export default {
    name: 'component-price',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError,
        'nitrozen-tooltip': NitrozenToolTip,
        'tags-input': TagsInput,
        'toggle-switch': toggleSwitch,
        TeamManagement,
        Products,
        Customers,
        MarketplaceIntegration,
        Support,
        'analytics-raw-events-query': AnalyticsRawEventQuery,
        'analytics-raw-events-export': AnalyticsRawEventExport,
        MobileApp,
        Sla,
        AnalyticsCampaignSource,
        SellingLocations,
        SaleWebsites,
        CustomPaymentGatwaySetup,
        PosInventoryIntegration,
        CatalogueExportMarketplace
    },
    props: {
        baseComponent: {
            type: Object
        },
        priceModel: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            searchCurrency: '',
            formData: {},
            options: PLAN_ENUMS,
            show_advanced: false
        };
    },
    created() {
        if (this.priceModel) {
            this.formData = this.priceModel;
            if (this.formData.transform_quantity) {
                this.show_advanced =
                    this.formData.transform_quantity.divide_by > 1;
            }
        }
    },
    computed: {
        isOneTimeBill() {
            return (
                !this.isTiered &&
                this.formData.price_type === 'static' &&
                !this.isTiered
            );
        },
        isRecurring() {
            return this.formData.bill_type === 'recurring';
        },
        isTiered() {
            return this.formData.billing_scheme === 'tiered';
        },
        currentCurrency() {
            if (!this.searchCurrency) {
                return this.currencies;
            }
            const regex = new RegExp(this.searchCurrency, 'gi');
            return this.currencies.filter((it) => regex.test(it.text));
        },
        currencies() {
            return CURRENCIES.map((cur) => {
                return {
                    text: `${cur.code} - ${cur.symbol}`,
                    value: cur.code
                };
            });
        },
        pricing_map() {
            return {
                standard: {
                    display: 'Standard Pricing',
                    tooltip:
                        'Select standard pricing if you charge the same price for each unit.',
                    config: {
                        billing_scheme: 'per_unit',
                        price_type: 'static'
                    }
                },
                external: {
                    display: 'External Pricing',
                    tooltip:
                        'Select external pricing if you charge the same price as per external service.',
                    config: {
                        billing_scheme: 'per_unit',
                        price_type: 'dynamic',
                        bill_type: 'one_time'
                    }
                },
                graduated: {
                    display: 'Graduated Pricing',
                    tooltip:
                        'Select graduated pricing if you use pricing tiers that may result in a different price for some units in an order. For example, you might charge ₹10.00 per unit for the first 100 units and then ₹5.00 per unit for the next 50.',
                    config: {
                        bill_type: 'recurring',
                        billing_scheme: 'tiered',
                        tiers_mode: 'graduated'
                    }
                },
                volume: {
                    display: 'Volume pricing',
                    tooltip:
                        'Select volume pricing if you charge the same price for each unit based on the total number of units sold. For example, you might charge ₹10.00 per unit for 50 units, and ₹7.00 per unit for 100 units.',
                    config: {
                        bill_type: 'recurring',
                        billing_scheme: 'tiered',
                        tiers_mode: 'volume'
                    }
                },
                package: {
                    display: 'Package Pricing',
                    config: {
                        billing_scheme: 'per_unit'
                    }
                }
            };
        },
        pricing_values() {
            return Object.keys(this.pricing_map).map((val) => {
                return {
                    value: val,
                    text: this.pricing_map[val].display
                };
            });
        },
        pricing_type() {
            if (this.formData.billing_scheme === 'tiered') {
                if (this.formData.bill_type === 'recurring') {
                    if (this.formData.tiers_mode === 'volume') {
                        return 'volume';
                    } else {
                        return 'graduated';
                    }
                }
            }
            return 'standard';
        }
    },
    methods: {
        hideAdvance(value) {
            if (value) this.formData.transform_quantity.divide_by = 1;
        },
        changeType(type) {
            _.merge(this.formData, this.pricing_map[type].config);
        }
    }
};
</script>
