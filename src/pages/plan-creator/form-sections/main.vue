<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Details</div>
        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
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
                    :disabled="disabled"
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
        <div class="form-row form-compact-items no-pad">
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    style="width:300px;"
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :custom="true"
                    :label="'Amount *'"
                    v-model="formData.plan.amount"
                >
                    <nitrozen-dropdown
                        :disabled="disabled"
                        :placeholder="'Search Currency'"
                        style="width:140px;"
                        :items="currentCurrency"
                        v-model="formData.plan.currency"
                        :searchable="true"
                        @searchInputChange="
                            (e) => (this.searchCurrency = e.text)
                        "
                    ></nitrozen-dropdown>
                </nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['amount'] }">{{
                    errors['amount'] || '-'
                }}</nitrozen-error>
            </div>

            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    style="width:300px;"
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Recurring Time*'"
                    v-model="formData.plan.recurring.interval_count"
                    :showSuffix="true"
                    :custom="true"
                >
                    <nitrozen-dropdown
                        :disabled="disabled"
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

        <div class="regular-xxs form-row no-pad">
            <div class="form-item">
                <div>
                    <span class="cl-DustyGray2">Preview :</span>&nbsp;&nbsp;
                    {{
                        `${currencyAmount} every ${
                            recurring_time > 1 ? recurring_time : ''
                        } ${recurring_type}`
                    }}
                </div>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>

        <div
            style="align-items: center;"
            class="form-row form-compact-items no-pad"
        >
            <div class="form-item">
                <nitrozen-checkbox
                    :disabled="disabled"
                    :class="{ 'disabled-ctrl': disabled }"
                    v-model="formData.plan.is_trial_plan"
                    >Trial Plan
                </nitrozen-checkbox>
                <nitrozen-error v-if="!formData.plan.is_trial_plan"
                    >-</nitrozen-error
                >
            </div>
            <div v-if="formData.plan.is_trial_plan" class="form-item">
                <nitrozen-input
                    :disabled="disabled"
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
                <nitrozen-checkbox
                    :disabled="disabled"
                    :class="{ 'disabled-ctrl': disabled }"
                    v-model="formData.plan.is_visible"
                >
                    Visible to all
                </nitrozen-checkbox>
            </div>
        </div>
        <div
            v-else-if="formData.plan.type === 'company-specific'"
            class="form-row no-pad"
        >
            <div class="form-item">
                <nitrozen-dropdown
                    :disabled="disabled"
                    :label="'Company*'"
                    :searchable="true"
                    @searchInputChange="companySearch"
                    v-model="formData.plan.company"
                    :items="
                        companies.map((item) => {
                            return {
                                text: `${item.name} (${item.uid})`,
                                value: item.uid
                            };
                        })
                    "
                    @input="fetchBrands()"
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
                    :disabled="formData.hasActiveSubscription"
                >
                </plan-component>
                <div class="cl-Mako bold-md comp-top-headers">
                    Feature Restrictions
                </div>
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    :ref="`comp_${component._id}`"
                    v-for="component in getComponents('feature_config')"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
                    :disabled="disabled"
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
                    :disabled="disabled"
                >
                </plan-component>
                <div v-for="component in dtComponents" :key="component._id">
                    <div
                        class="comp-top-headers"
                        style="display: flex; width:100%;line-height: 21px; align-items: flex-end;"
                    >
                        <div class="cl-Mako bold-md">
                            {{ component.name }} Rules
                        </div>
                        <div class="align-right">
                            <span
                                :class="{ 'disabled-ctrl': disabled }"
                                class="bold-xs clickable-label cl-RoyalBlue"
                                @click="addNewRule(component)"
                            >
                                Add Rule
                            </span>
                        </div>
                    </div>
                    <plan-component
                        :disabled="disabled"
                        class="plan-component"
                        v-show="dTComponentMap[component._id]"
                        :ref="`dt_comp_${component._id}`"
                        :component="component"
                        :dtOptions="
                            dtOptions[component.data.slug_values.channel[0].id]
                        "
                        :price_component="dTComponentMap[component._id]"
                        :cbs_opts="cbs_opts"
                        :daytrader="true"
                    ></plan-component>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.comp-top-headers {
    margin-top: 40px;
    margin-bottom: 9px;
}

::v-deep .align-right {
    justify-content: flex-end;
    flex: 1;
    display: flex;
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
            brands: [],
            locations: [],
            searchCompany: '',
            searchCurrency: '',
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
    // mounted() {
    //     let pArr = [];
    //     pArr.push(BillingService.getComponentWithPrices({ limit: 100 }));

    //     if (this.formData._id) {
    //         pArr.push(BillingService.getPlanComponents({ limit: 100 }));
    //     }

    //     Promise.all(pArr)
    //         .then((resArr) => {
    //             this.allComponents = [...resArr[0].data];
    //             if (resArr.length > 2) {
    //                 this.planComponents = [...resArr[2].data.docs];
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // },
    // computed: {
    //     planComponentMap() {
    //         return this.planComponents.reduce((map, item) => {
    //             map[item.component_id] = item;
    //             return map;
    //         }, {});
    //     }
    // },
    methods: {}
};
</script>
