<template>
    <div class="price-form">
        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :label="'Component Display Name *'"
                    v-model="formData.display_text"
                >
                </nitrozen-input>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>

        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-dropdown
                    style="width:150px;"
                    :label="'Price currency'"
                    :items="currentCurrency"
                    v-model="formData.currency"
                    :searchable="true"
                    @searchInputChange="
                        (e) => (this.searchCurrency = e && e.text ? e.text : '')
                    "
                ></nitrozen-dropdown>
            </div>
        </div>

        <div class="cl-Mako bold-xs top-headers">Billing Scheme</div>

        <div class="form-row form-compact-items">
            <div class="form-item price-type-dropdown">
                <nitrozen-dropdown
                    :label="options.billing_scheme.text"
                    :items="options.billing_scheme.enum"
                    v-model="formData.billing_scheme"
                >
                </nitrozen-dropdown>
            </div>

            <div
                v-if="formData.billing_scheme === 'per_unit'"
                class="form-item price-type-dropdown"
            >
                <nitrozen-dropdown
                    :label="`${options.price_type.text} *`"
                    :items="options.price_type.enum"
                    v-model="formData.price_type"
                >
                </nitrozen-dropdown>
            </div>
        </div>

        <div v-if="isOneTimeBill" class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :suffix="'₹'"
                    :label="'Flat Price *'"
                    v-model="formData.unit_amount"
                >
                </nitrozen-input>
            </div>
        </div>

        <div v-if="isTiered" class="form-row form-compact-items">
            <div class="form-item price-type-dropdown">
                <nitrozen-dropdown
                    :label="options.tiers_mode.text"
                    :items="options.tiers_mode.enum"
                    v-model="formData.tiers_mode"
                >
                </nitrozen-dropdown>
            </div>
        </div>

        <div v-if="isTiered" class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Tier Usage Upto*'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :suffix="'₹'"
                    :label="'Tier Changes*'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :suffix="'₹'"
                    :label="'Flat Fees*'"
                >
                </nitrozen-input>
            </div>
        </div>

        <div v-if="isTiered" class="form-row">
            <div class="form-item right-align">
                <div class="text-btn cl-RoyalBlue bold-xs">
                    Add Tier
                </div>
            </div>
        </div>

        <div class="cl-Mako bold-xs top-headers">Bill Cycle</div>

        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-dropdown
                    :items="options.bill_type.enum"
                    v-model="formData.bill_type"
                >
                </nitrozen-dropdown>
            </div>
        </div>

        <div v-if="isRecurring" class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
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
                    >
                    </nitrozen-dropdown>
                </nitrozen-input>
            </div>
        </div>

        <div v-if="isRecurring" class="form-row form-compact-items">
            <div class="form-item price-type-dropdown">
                <nitrozen-dropdown
                    :label="options.usage_type.text"
                    :items="options.usage_type.enum"
                    v-model="formData.recurring.usage_type"
                >
                </nitrozen-dropdown>
            </div>
            <div style="width:200px;" class="form-item">
                <nitrozen-dropdown
                    :label="options.aggregate_usage.text"
                    :items="options.aggregate_usage.enum"
                    v-model="formData.recurring.aggregate_usage"
                >
                </nitrozen-dropdown>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Divide Usage'"
                    v-model="formData.transform_quantity.divide_by"
                >
                </nitrozen-input>
            </div>

            <div class="form-item">
                <nitrozen-dropdown
                    :label="'Round Units'"
                    :items="[
                        { text: 'Up', value: 'up' },
                        { text: 'Down', value: 'down' }
                    ]"
                    v-model="formData.transform_quantity.round"
                >
                </nitrozen-dropdown>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-input :label="'Comment'" v-model="formData.comment">
                </nitrozen-input>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <tags-input v-model="formData.tags"> </tags-input>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
::v-deep .price-form {
    box-sizing: border-box;
    flex-direction: column;

    .right-align {
        display: flex;
        justify-content: flex-end;
    }

    .text-btn {
        cursor: pointer;
    }
    .top-headers {
        line-height: 27px;
        margin-bottom: 12px;
    }

    .custom-label {
        flex: 0;
    }
    .form-row {
        width: 100%;
        display: flex;
        padding: 8px 0;
        margin: 0;
        label > span {
            margin-bottom: 2px;
        }
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
    NitrozenError
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import { PLAN_ENUMS } from '../../helper/plan-creator-helper';
import { CURRENCIES } from '../../helper/currency.util';
import { TagsInput } from '../../components/common/';

export default {
    name: 'component-price-form',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError,
        'tags-input': TagsInput
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
        },
        isClone: {
            type: Boolean
        }
    },
    data() {
        return {
            searchCurrency: '',
            formData: this.getDefaultData(),
            options: PLAN_ENUMS
        };
    },
    mounted() {
        if (this.priceModel) {
            _.merge(this.formData, this.priceModel);
        }
    },
    computed: {
        isOneTimeBill() {
            return (
                this.formData.bill_type === 'one_time' &&
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
        }
    },
    methods: {
        getDefaultData() {
            return {
                recurring: {
                    aggregate_usage: 'sum',
                    usage_type: 'licensed',
                    interval: 'month',
                    interval_count: 1
                },
                transform_quantity: {
                    divide_by: 1,
                    round: 'up'
                },
                display_text: this.baseComponent.name || '',
                is_default: true,
                is_active: true,
                unit_amount: 0,
                price_type: 'static',
                bill_type: 'one_time',
                billing_scheme: 'per_unit',
                tags: [],
                currency: 'INR',
                component_id: this.baseComponent._id || '',
                tiers: [],
                tiers_mode: 'volume'
            };
        }
    }
};
</script>
