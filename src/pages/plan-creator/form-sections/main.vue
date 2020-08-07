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
                    :custom="true"
                    :label="'Amount *'"
                    v-model="formData.plan.amount"
                >
                    <nitrozen-dropdown
                        style="width:140px;"
                        :items="currentCurrency"
                        v-model="formData.plan.currency"
                        :searchable="true"
                        @searchInputChange="
                            (e) =>
                                (this.searchCurrency =
                                    e && e.text ? e.text : '')
                        "
                    ></nitrozen-dropdown>
                </nitrozen-input>
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
                    v-bind:class="{ visible: errors['recurr_period'] }"
                    >{{ errors['recurr_period'] || '-' }}</nitrozen-error
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

        <div v-if="formData.plan.type === 'public'" class="form-row no-pad">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.plan.is_visible"
                    >Visible to all
                </nitrozen-checkbox>
            </div>
        </div>
        <div
            v-else-if="formData.plan.type === 'company-specific'"
            class="form-row"
        >
            <div class="form-item">
                <nitrozen-dropdown
                    :label="'Company*'"
                    :searchable="true"
                    @searchInputChange="companySearch"
                    v-model="formData.plan.company"
                    :items="
                        companies.map((item) => {
                            return {
                                text: item.name,
                                value: item.uid
                            };
                        })
                    "
                >
                </nitrozen-dropdown>
            </div>
            <div class="form-item"></div>
        </div>

        <div
            class="form-row"
            v-if="
                formData.components.length &&
                    formData.dayTraderComponents &&
                    dtOptions
            "
        >
            <div class="form-item">
                <div class="cl-Mako bold-md comp-top-headers">
                    Display Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    :ref="`comp_${component._id}`"
                    v-for="component in getComponents('display')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md comp-top-headers">
                    Feature Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    :ref="`comp_${component._id}`"
                    v-for="component in getComponents('feature_config')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md comp-top-headers">
                    Revenue Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    :ref="`comp_${component._id}`"
                    v-for="component in getComponents('revenue')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                >
                </plan-component>
                <div class="cl-Mako bold-md comp-top-headers">
                    Daytrader Components
                </div>
                <plan-component
                    class="plan-component"
                    v-show="dTComponentMap[component._id]"
                    v-for="component in dtComponents"
                    :ref="`dt_comp_${component._id}`"
                    :key="component._id"
                    :component="component"
                    :dtOptions="dtOptions[component.data.channels[0]]"
                    :price_component="dTComponentMap[component._id]"
                    :daytrader="true"
                ></plan-component>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.comp-top-headers {
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
import CompanyService from '../../../services/company-admin.service';
import { CURRENCIES } from '../../../helper/currency.util';
import { debounce } from '@/helper/utils';

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
        allComponents: {
            type: Array,
            default: []
        },
        dtComponents: {
            type: Array,
            default: []
        },
        dtOptions: {
            type: Object
        }
    },
    data() {
        return {
            errors: {},
            companies: [],
            searchCompany: '',
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
            ]
        };
    },
    mounted() {
        this.fetchCompany();
    },
    computed: {
        planComponentMap() {
            return this.formData.components.reduce((map, item) => {
                map[item.component_id] = item;
                return map;
            }, {});
        },
        dTComponentMap() {
            return this.formData.dayTraderComponents.reduce((map, item) => {
                map[item.component_id] = item;
                return map;
            }, {});
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
        recurring_type() {
            return this.formData.plan.recurring.interval;
        },
        recurring_time() {
            return this.formData.plan.recurring.interval_count;
        }
    },
    methods: {
        getComponents(type) {
            return this.allComponents.filter((comp) => {
                return comp.component_price_config.type === type;
            });
        },
        validateData() {
            let isValid = true;
            this.clearErrors();
            if (!this.formData.plan.name) {
                this.errors['name'] = 'Required Field';
                isValid = false;
            }
            if (!this.formData.plan.amount.toString().length) {
                this.errors['amount'] = 'Required Field';
                isValid = false;
            } else if (this.formData.plan.amount < 0) {
                this.errors['amount'] = 'Invalid amount';
                isValid = false;
            }
            if (!this.formData.plan.currency.toString().length) {
                this.errors['amount'] = 'Currency is required';
                isValid = false;
            }
            if (this.recurring_time < 1) {
                this.errors['recurr_period'] = 'Cannot be less than 1';
                isValid = false;
            }
            if (
                this.formData.plan.is_trial_plan &&
                this.formData.plan.trial_period < 1
            ) {
                this.errors['trial_period'] = 'Cannot be less than 1';
                isValid = false;
            }
            for (let component_key of Object.keys(this.$refs)) {
                if (this.$refs[component_key][0].validateData) {
                    isValid =
                        this.$refs[component_key][0].validateData() && isValid;
                }
            }
            return isValid;
        },
        clearErrors() {
            this.errors = {};
        },
        companySearch(e) {
            _.debounce((text) => {
                this.fetchCompany(text);
            }, 600)(e.text);
        },
        fetchCompany(searchCompany) {
            const query = {
                page_no: 0,
                page_size: 10
            };

            if (searchCompany) {
                query.name = searchCompany;
            }
            return CompanyService.getCompanyList(query)
                .then(({ data }) => {
                    this.companies = data.data;
                    if (this.formData.plan.company === -1) {
                        this.formData.plan.company = this.companies[0].uid;
                    }
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                    console.log(err);
                });
        }
    }
};
</script>
