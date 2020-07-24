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

        <div class="cl-Mako bold-md top-headers">Plan Components</div>
        <div class="form-row" v-if="this.formData.components.length">
            <div class="form-item">
                <plan-component
                    class="plan-component"
                    v-show="planComponentMap[component._id]"
                    v-for="component in allComponents"
                    :key="component._id"
                    :component="component"
                    :price_component="planComponentMap[component._id]"
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
    methods: {}
};
</script>
