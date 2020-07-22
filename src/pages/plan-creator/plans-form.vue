<template>
    <div class="subscription-plan">
        <div class="page-header-position">
            <page-header
                :title="`${isEditOnly ? 'Edit' : 'Create'} Subscription Plan`"
                :contextMenuItems="isEditOnly ? contextMenu : undefined"
                @backClick="onCancel"
                @delete="onMenuAction('delete')"
                @clone="onMenuAction('clone')"
            >
                <div class="button-box">
                    <span
                        class="bold-xs clickable-label"
                        :class="{
                            'cl-DustyGray2': !formData.plan.is_active,
                            'cl-RoyalBlue': formData.plan.is_active
                        }"
                        @click="
                            () => {
                                formData.plan.is_active = !formData.plan
                                    .is_active;
                                changeActiveState();
                            }
                        "
                        >{{
                            formData.plan.is_active ? 'Active' : 'Inactive'
                        }}</span
                    >
                    <nitrozen-toggle
                        class="pad-right"
                        v-model="formData.plan.is_active"
                        @change="changeActiveState"
                    ></nitrozen-toggle>
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="savePlan"
                        v-flatBtn
                    >
                        {{ `${isEditOnly ? 'Save' : 'Create'}` }}
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="loading"></loader>
        <div v-else class="main-container">
            <div class="subscription-plan-form-container">
                <main-section
                    class="subscription-plan-section main-section"
                    :formData="formData"
                    :errors="errors"
                    :pageOptions="pageOptions"
                />
                <!-- <detail-section
                    class="subscription-plan-section detail-section"
                    :formData="formData"
                    :errors="errors"
                />-->
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// @import '../../less/page-ui.less';
// @import '../../less/page-header.less';
.page-header-position {
    margin-bottom: 60px;
}
.subscription-plan {
    ::v-deep .button-box {
        display: flex;
        align-items: center;
    }
    ::v-deep .pad-right {
        margin-right: 16px;
    }
    .clickable-label {
        cursor: pointer;
    }

    .schedule-btn {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .subscription-plan-form-container {
        display: flex;
        width: 100%;
        ::v-deep .page-container {
            box-sizing: border-box;
            flex-direction: column;
            border: 1px solid @WhiteSmoke;

            .top-headers {
                line-height: 27px;
                margin-top: 12px;
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
        .main-section {
            flex: 1;
        }
        .detail-section {
            width: 368px;
            margin-left: 0px;
        }
    }
}
</style>

<script>
import mainSection from './form-sections/main.vue';
import detailSection from './form-sections/details.vue';
import BillingService from '../../services/billing.service';
import {
    NitrozenButton,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import { Loader, PageHeader } from '../../components/common/';

import _ from 'lodash';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';

export default {
    name: 'subscription-plan-form',
    components: {
        loader: Loader,
        'page-header': PageHeader,
        'main-section': mainSection,
        'detail-section': detailSection,
        'nitrozen-button': NitrozenButton,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'nitrozen-toggle': NitrozenToggleBtn
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    created() {
        let promises = [];
        let planId = this.$route.params.planId;
        if (planId) {
            this.loading = true;
            BillingService.getPlans({}, planId)
                .then((response) => {
                    _.merge(this.formData, response.data);
                    this.originalData = _.cloneDeep(this.formData);
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                    this.$snackbar.global.showError(
                        `Failed to load Subscription Plan${
                            err && err.message ? ' : ' + err.message : ''
                        }`
                    );
                });
        }
    },
    data() {
        return {
            loading: false,
            pageOptions: [],
            saveInProgress: false,
            originalData: {},
            formData: this.getCreateData(),
            contextMenu: [
                {
                    text: 'Clone',
                    action: 'clone'
                },
                {
                    text: 'Delete',
                    action: 'delete'
                }
            ],
            errors: {
                display: '',
                name: ''
            }
        };
    },
    computed: {
        planId() {
            return this.isClone ? '' : this.$route.params.planId;
        },
        editMode() {
            return this.$route.params.planId ? true : false;
        },
        isClone() {
            return (
                this.$route.query.clone &&
                this.$route.query.clone.toString() == 'true'
            );
        },
        isEditOnly() {
            return this.editMode && !this.isClone;
        }
    },
    methods: {
        getCreateData() {
            return {
                plan: {
                    recurring: {
                        interval: 'month',
                        interval_count: 1
                    },
                    is_trial_plan: false,
                    plan_group: 'default',
                    tagLines: [],
                    currency: 'INR',
                    is_active: true,
                    is_visible: true,
                    trial_period: 0,
                    addons: [],
                    tags: ['popular'],
                    type: 'public',
                    country: 'IN',
                    _id: '5f0daf12ca17ac00352ced80',
                    name: 'Premium',
                    description: 'Premium',
                    amount: 2499,
                    product_suite_id: '5f0daf12ca17ac00352ced62',
                    created_at: '2020-07-14T13:11:46.443Z',
                    modified_at: '2020-07-14T13:11:46.443Z'
                },
                components: [
                    {
                        _id: '5f0daf13ca17ac00352cee7b',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced63',
                        component_price_id: '5f0daf12ca17ac00352cedb1',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb1',
                            display_text: '3%',
                            is_default: false,
                            is_active: true,
                            processing_type: 'display',
                            tags: [],
                            component_id: '5f0daf12ca17ac00352ced63',
                            created_at: '2020-07-14T13:11:47.120Z',
                            modified_at: '2020-07-14T13:11:47.120Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee67',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced64',
                        component_price_id: '5f0daf12ca17ac00352cedb3',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb3',
                            display_text: '100',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                limit: 100
                            },
                            component_id: '5f0daf12ca17ac00352ced64',
                            created_at: '2020-07-14T13:11:47.120Z',
                            modified_at: '2020-07-14T13:11:47.120Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee41',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced65',
                        component_price_id: '5f0daf12ca17ac00352cedb2',
                        created_at: '2020-07-14T13:11:47.445Z',
                        modified_at: '2020-07-14T13:11:47.445Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb2',
                            display_text: 'As per rate card',
                            is_default: false,
                            is_active: true,
                            processing_type: 'display',
                            tags: [],
                            component_id: '5f0daf12ca17ac00352ced65',
                            created_at: '2020-07-14T13:11:47.120Z',
                            modified_at: '2020-07-14T13:11:47.120Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee8f',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced66',
                        component_price_id: '5f0daf12ca17ac00352cedb4',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb4',
                            display_text: '200',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                limit: 200
                            },
                            component_id: '5f0daf12ca17ac00352ced66',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee54',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced67',
                        component_price_id: '5f0daf12ca17ac00352cedb5',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb5',
                            display_text: 'Unlimited',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                bulk: true,
                                limit: -1
                            },
                            component_id: '5f0daf12ca17ac00352ced67',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee55',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced68',
                        component_price_id: '5f0daf12ca17ac00352cedb9',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb9',
                            recurring: {
                                aggregate_usage: 'sum',
                                usage_type: 'licensed',
                                interval_count: 1
                            },
                            transform_quantity: {
                                divide_by: 1,
                                round: 'up'
                            },
                            free_tier: {
                                type: 'TIME_BASED',
                                value: 0
                            },
                            unit_amount: 0,
                            price_type: 'static',
                            bill_type: 'one_time',
                            billing_scheme: 'per_unit',
                            display_text: 'free',
                            is_default: false,
                            is_active: true,
                            processing_type: 'revenue',
                            tags: [],
                            currency: 'INR',
                            component_id: '5f0daf12ca17ac00352ced68',
                            tiers: [],
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee42',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced69',
                        component_price_id: '5f0daf12ca17ac00352cedb7',
                        created_at: '2020-07-14T13:11:47.445Z',
                        modified_at: '2020-07-14T13:11:47.445Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb7',
                            display_text: '3',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                hard_limit: 4,
                                soft_limit: 3
                            },
                            component_id: '5f0daf12ca17ac00352ced69',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee68',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6a',
                        component_price_id: '5f0daf12ca17ac00352cedb8',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb8',
                            recurring: {
                                aggregate_usage: 'sum',
                                usage_type: 'licensed',
                                interval_count: 1
                            },
                            transform_quantity: {
                                divide_by: 1,
                                round: 'up'
                            },
                            free_tier: {
                                type: 'TIME_BASED',
                                value: 0
                            },
                            unit_amount: 0,
                            price_type: 'dynamic',
                            bill_type: 'one_time',
                            billing_scheme: 'per_unit',
                            display_text: 'Premium ThemesUse partners theme',
                            is_default: false,
                            is_active: true,
                            processing_type: 'revenue',
                            tags: [],
                            currency: 'INR',
                            component_id: '5f0daf12ca17ac00352ced6a',
                            tiers: [],
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee7c',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6b',
                        component_price_id: '5f0daf12ca17ac00352cedb6',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedb6',
                            display_text: 'Unlimited',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                limit: -1
                            },
                            component_id: '5f0daf12ca17ac00352ced6b',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee69',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6c',
                        component_price_id: '5f0daf12ca17ac00352cedbd',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedbd',
                            recurring: {
                                aggregate_usage: 'sum',
                                usage_type: 'licensed',
                                interval_count: 1
                            },
                            transform_quantity: {
                                divide_by: 1,
                                round: 'up'
                            },
                            free_tier: {
                                type: 'TIME_BASED',
                                value: 0
                            },
                            unit_amount: 0,
                            price_type: 'dynamic',
                            bill_type: 'one_time',
                            billing_scheme: 'per_unit',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'revenue',
                            tags: [],
                            currency: 'INR',
                            component_id: '5f0daf12ca17ac00352ced6c',
                            tiers: [],
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee56',
                        is_active: false,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6d',
                        component_price_id: '5f0daf12ca17ac00352cedbe',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedbe',
                            display_text: 'No',
                            is_default: false,
                            is_active: false,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: false
                            },
                            component_id: '5f0daf12ca17ac00352ced6d',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee6a',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6e',
                        component_price_id: '5f0daf12ca17ac00352cedc2',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc2',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced6e',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee90',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced6f',
                        component_price_id: '5f0daf12ca17ac00352cedba',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedba',
                            recurring: {
                                aggregate_usage: 'sum',
                                usage_type: 'metered',
                                interval_count: 1,
                                interval: 'month'
                            },
                            transform_quantity: {
                                divide_by: 1,
                                round: 'up'
                            },
                            free_tier: {
                                type: 'TIME_BASED',
                                value: 0
                            },
                            unit_amount: 0,
                            price_type: 'fixed',
                            bill_type: 'recurring',
                            billing_scheme: 'per_unit',
                            display_text:
                                'Free 100k email after that 0.25 INR per email',
                            is_default: false,
                            is_active: true,
                            processing_type: 'revenue',
                            tags: [],
                            currency: 'INR',
                            component_id: '5f0daf12ca17ac00352ced6f',
                            tiers: [],
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee7e',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced70',
                        component_price_id: '5f0daf12ca17ac00352cedc0',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc0',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced70',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee7d',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced71',
                        component_price_id: '5f0daf12ca17ac00352cedbb',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedbb',
                            recurring: {
                                aggregate_usage: 'sum',
                                usage_type: 'metered',
                                interval_count: 1,
                                interval: 'month'
                            },
                            transform_quantity: {
                                divide_by: 1,
                                round: 'up'
                            },
                            free_tier: {
                                type: 'TIME_BASED',
                                value: 0
                            },
                            unit_amount: 0,
                            price_type: 'fixed',
                            bill_type: 'recurring',
                            billing_scheme: 'per_unit',
                            display_text:
                                'Free 100k sms after that 0.25 INR per sms',
                            is_default: false,
                            is_active: true,
                            processing_type: 'revenue',
                            tags: [],
                            currency: 'INR',
                            component_id: '5f0daf12ca17ac00352ced71',
                            tiers: [],
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee44',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced72',
                        component_price_id: '5f0daf12ca17ac00352cedc1',
                        created_at: '2020-07-14T13:11:47.445Z',
                        modified_at: '2020-07-14T13:11:47.445Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc1',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'display',
                            tags: [],
                            component_id: '5f0daf12ca17ac00352ced72',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee43',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced73',
                        component_price_id: '5f0daf12ca17ac00352cedbc',
                        created_at: '2020-07-14T13:11:47.445Z',
                        modified_at: '2020-07-14T13:11:47.445Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedbc',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'display',
                            tags: [],
                            component_id: '5f0daf12ca17ac00352ced73',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee91',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced74',
                        component_price_id: '5f0daf12ca17ac00352cedbf',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedbf',
                            display_text: 'No',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced74',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee45',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced75',
                        component_price_id: '5f0daf12ca17ac00352cedc6',
                        created_at: '2020-07-14T13:11:47.445Z',
                        modified_at: '2020-07-14T13:11:47.445Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc6',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced75',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee6b',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced76',
                        component_price_id: '5f0daf12ca17ac00352cedc7',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc7',
                            display_text: 'Email',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                email: true,
                                call: true
                            },
                            component_id: '5f0daf12ca17ac00352ced76',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee7f',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced77',
                        component_price_id: '5f0daf12ca17ac00352cedc5',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc5',
                            display_text: 'Yes',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced77',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee57',
                        is_active: false,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced78',
                        component_price_id: '5f0daf12ca17ac00352cedc3',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc3',
                            display_text: 'No',
                            is_default: false,
                            is_active: false,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: false
                            },
                            component_id: '5f0daf12ca17ac00352ced78',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee58',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced79',
                        component_price_id: '5f0daf12ca17ac00352cedc8',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc8',
                            display_text: '2Hr',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                type: 'level3'
                            },
                            component_id: '5f0daf12ca17ac00352ced79',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    },
                    {
                        _id: '5f0daf13ca17ac00352cee92',
                        is_active: true,
                        display_text: null,
                        plan_id: '5f0daf12ca17ac00352ced80',
                        component_id: '5f0daf12ca17ac00352ced7a',
                        component_price_id: '5f0daf12ca17ac00352cedc4',
                        created_at: '2020-07-14T13:11:47.446Z',
                        modified_at: '2020-07-14T13:11:47.446Z',
                        component_price: {
                            _id: '5f0daf12ca17ac00352cedc4',
                            display_text: 'CSV + Basic Events + Custom Query',
                            is_default: false,
                            is_active: true,
                            processing_type: 'feature_config',
                            tags: [],
                            feature_config: {
                                enabled: true
                            },
                            component_id: '5f0daf12ca17ac00352ced7a',
                            created_at: '2020-07-14T13:11:47.121Z',
                            modified_at: '2020-07-14T13:11:47.121Z',
                            __v: 0
                        }
                    }
                ],
                hasActiveSubscription: false
            };
        },
        isFormDirty() {
            if (this.saveInProgress) {
                return false;
            }
            return (
                JSON.stringify(this.originalData)
                    .split('')
                    .sort()
                    .join('') !==
                JSON.stringify(this.formData)
                    .split('')
                    .sort()
                    .join('')
            );
        },
        savePlan() {
            this.saveInProgress = true;
            if (this.validateData()) {
                if (!this.isEditOnly) {
                    BillingService.createPlan(this.formData)
                        .then(({ data }) => {
                            this.$snackbar.global.showSuccess(data.message);

                            this.$router.push({
                                path: `administrator/subscription-plans/edit/${data.data._id}/`,
                                query: {}
                            });

                            this.originalData = _.cloneDeep(data.data);
                            this.formData = data.data;
                            this.saveInProgress = false;
                        })
                        .catch((err) => {
                            this.saveInProgress = false;
                            this.$snackbar.global.showError(
                                `Failed to create subscription-plan${
                                    err && err.message
                                        ? ' : ' + err.message
                                        : ''
                                }`
                            );
                        });
                } else {
                    BillingService.updatePlan(this.formData, this.planId)
                        .then(({ data }) => {
                            this.$snackbar.global.showSuccess(data.message);
                            this.saveInProgress = false;
                        })
                        .catch((err) => {
                            this.saveInProgress = false;
                            this.$snackbar.global.showError(
                                `Failed to update Subscription Plan${
                                    err && err.message
                                        ? ' : ' + err.message
                                        : ''
                                }`
                            );
                        });
                }
            } else {
                this.$snackbar.global.showError(
                    'Invalid data entered. Please enter valid data.'
                );
            }
        },
        changeActiveState() {
            const publishState = this.formData._schedule.published
                ? 'Active'
                : 'Inactive';
            if (!this.isEditOnly) {
                return;
            }
            BillingService.patchPlan(
                { published: this.formData._schedule.published },
                this.planId
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(data.message);
                    // update original data as changes are saved on server
                    this.originalData._schedule.published = this.formData._schedule.published;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed to ${
                            this.formData._schedule.published
                                ? 'publish'
                                : 'unpublish'
                        } subscription-plan:${
                            err && err.message ? ' : ' + err.message : ''
                        }`
                    );
                });
        },

        validateData() {
            this.clearErrors();
            let isValid = true;
            if (!this.formData.name) {
                this.errors['name'] = 'Required Field';
                isValid = false;
            }
            return isValid;
        },

        clearErrors() {
            this.errors = {};
        },

        onMenuAction(action) {
            if (action == 'clone') {
                this.$router.push({
                    path: `administrator/subscription-plans/edit/${this.planId}`,
                    query: {
                        clone: true
                    }
                });
                let oldFormData = _.cloneDeep(this.formData);
                this.formData = this.getCreateData();
                this.formData.plan = oldFormData.plan;
                this.originalData = {};
                this.$snackbar.global.showSuccess('Subscription Plan cloned');
            } else if (action == 'delete') {
                BillingService.deletePlan(this.planId)
                    .then(({ data }) => {
                        this.$snackbar.global.showSuccess(data.message);
                        this.$router.push({
                            path: `/administrator/subscription-plans`
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$snackbar.global.showError(
                            'Failed to delete Subscription Plan'
                        );
                    });
            }
        },
        onCancel() {
            this.$router.push({
                path: `/administrator/subscription-plans`
            });
        }
    }
};
</script>
