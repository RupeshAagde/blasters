<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Settings</div>
        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :showSuffix="true"
                    :suffix="'₹'"
                    :label="'Amount *'"
                    v-model="formData.amount"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['amount'] }">{{
                    errors['amount'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.is_trial_plan"
                    >Trial Plan
                </nitrozen-checkbox>
                <nitrozen-error v-if="!formData.is_trial_plan"
                    >-</nitrozen-error
                >
            </div>
        </div>

        <div v-if="formData.is_trial_plan" class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Trial Days *'"
                    v-model="formData.trial_period"
                ></nitrozen-input>
                <nitrozen-error
                    v-bind:class="{ visible: errors['trial_period'] }"
                    >{{ errors['trial_period'] || '-' }}</nitrozen-error
                >
            </div>
        </div>

        <div class="form-row form-compact-items">
            <div class="form-item">
                <nitrozen-input
                    :type="'number'"
                    :allowNegative="false"
                    :label="'Recurring Time*'"
                    v-model="formData.recurring.interval_count"
                    :showSuffix="true"
                    :custom="true"
                >
                    <nitrozen-dropdown
                        class="filter-dropdown"
                        :items="durationUnits"
                        v-model="formData.recurring.interval"
                    ></nitrozen-dropdown>
                </nitrozen-input>
                <nitrozen-error
                    v-bind:class="{ visible: errors['trial_period'] }"
                    >{{ errors['trial_period'] || '-' }}</nitrozen-error
                >
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-checkbox v-model="formData.is_visible"
                    >Visible
                </nitrozen-checkbox>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>

        <div class="cl-Mako bold-md top-headers">Plan Components</div>
        <div class="form-row">
            <div class="form-item">
                <plan-component
                    class="plan-component"
                    v-for="component in allComponents"
                    :key="component._id"
                    :component="component"
                    :plan_component="planComponentMap[component._id]"
                >
                </plan-component>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.filter-dropdown {
    min-width: 100px;
}
.plan-component {
    + .plan-component {
        margin-top: 12px;
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
        }
    },
    data() {
        return {
            planComponents: [],
            allComponents: [],
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
        let pArr = [];
        pArr.push(BillingService.getComponentWithPrices({ limit: 100 }));

        if (this.formData._id) {
            pArr.push(BillingService.getPlanComponents({ limit: 100 }));
        }

        Promise.all(pArr)
            .then((resArr) => {
                this.allComponents = [...resArr[0].data];
                if (resArr.length > 2) {
                    this.planComponents = [...resArr[2].data.docs];
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },
    computed: {
        planComponentMap() {
            return this.planComponents.reduce((map, item) => {
                map[item.component_id] = item;
                return map;
            }, {});
        }
    },
    methods: {}
};
</script>
