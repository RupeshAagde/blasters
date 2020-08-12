<template>
    <div class="subscription-plan">
        <div class="page-header-position">
            <page-header
                :title="`${isEditOnly ? 'Edit' : 'Create'} Subscription Plan`"
                :contextMenuItems="isEditOnly ? contextMenu : undefined"
                @backClick="onCancel"
                @delete="onMenuAction('delete')"
                @clone="onMenuAction('clone')"
                @subscribe="onMenuAction('subscribe')"
            >
                <div class="button-box">
                    <span
                        class="plan-type-badge bold-xs"
                        :title="`${mapPlanType[formData.plan.type]} plan`"
                        >{{ mapPlanType[formData.plan.type] }}</span
                    >
                    <span
                        class="bold-xs clickable-label"
                        :class="{
                            'cl-DustyGray2': !formData.plan.is_active,
                            'cl-RoyalBlue': formData.plan.is_active
                        }"
                        @click="
                            formData.plan.is_active = !formData.plan.is_active
                        "
                    >
                        {{ formData.plan.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <nitrozen-toggle
                        class="pad-right"
                        v-model="formData.plan.is_active"
                    ></nitrozen-toggle>
                    <nitrozen-button
                        class="pad-right"
                        :theme="'secondary'"
                        @click="previewPlan"
                        v-strokeBtn
                        >Preview</nitrozen-button
                    >
                    <nitrozen-button
                        :disabled="formData.hasActiveSubscription"
                        :title="
                            `${
                                formData.hasActiveSubscription
                                    ? 'Plan has active subscriptions'
                                    : ''
                            }`
                        "
                        :theme="'secondary'"
                        @click="savePlan"
                        v-flatBtn
                        >{{
                            `${isEditOnly ? 'Save' : 'Create'}`
                        }}</nitrozen-button
                    >
                </div>
            </page-header>
        </div>
        <loader v-if="loading"></loader>
        <div v-else class="main-container">
            <div class="subscription-plan-form-container">
                <main-section
                    :ref="'main'"
                    class="subscription-plan-section main-section"
                    :formData="formData"
                    :dtOptions="daytraderConfigMap"
                    :dtComponents="dtComponents"
                    :allComponents="allComponents"
                />
                <!-- <detail-section
                    class="subscription-plan-section detail-section"
                    :formData="formData"
                    :errors="errors"
                />-->
            </div>
        </div>
        <preview-modal
            v-if="showPreview"
            :isOpen="showPreview"
            :plans="[previewData]"
            @closeSubscribePlanModal="showPreview = false"
        ></preview-modal>
        <nitrozen-dialog
            class="subscribe-modal"
            :ref="'subscribe-modal'"
            :title="'Select Company'"
            @close="() => (copyDisplay = 'COPY LINK')"
        >
            <template slot="body">
                <nitrozen-dropdown
                    style="margin-bottom: 24px"
                    :label="'Company*'"
                    :searchable="true"
                    @searchInputChange="companySearch"
                    v-model="selectedCompany"
                    @input="() => (copyDisplay = 'COPY LINK')"
                    :items="
                        companies.map((item) => {
                            return {
                                text: item.name,
                                value: item.uid
                            };
                        })
                    "
                ></nitrozen-dropdown>
            </template>
            <template slot="footer">
                <input
                    class="share-links"
                    ref="share-text"
                    readonly
                    tabindex="-1"
                    :value="customPlanLink"
                    type="text"
                />
                <div class="ukt-links" @click="copyText">{{ copyDisplay }}</div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
// @import '../../less/page-ui.less';
// @import '../../less/page-header.less';
.page-header-position {
    margin-bottom: 60px;
}
.subscribe-modal {
    ::v-deep .nitrozen-dialog-body {
        overflow: inherit;
    }
}
.subscription-plan {
    ::v-deep .button-box {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-end;
        position: relative;

        .plan-type-badge {
            display: flex;
            cursor: default;
            padding: 5px;
            position: absolute;
            left: 10px;
            background-color: @RoyalBlue;
            color: @White;
            border-radius: @BorderRadius;
        }
    }
    ::v-deep .pad-right {
        margin-right: 16px;
    }

    ::v-deep .clickable-label {
        cursor: pointer;
    }

    .share-links {
        flex: 1;
        border: 1px solid #a9a9a9;
        + .ukt-links {
            color: @Mako;
            border: 1px solid #a9a9a9;
            align-items: center;
            border-left: 0;
            display: inline-flex;
            padding: 5px;
        }
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
                &:first-child {
                    margin-top: 0;
                }
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

                &.no-pad {
                    padding-bottom: 0;
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
import CompanyService from '../../services/company-admin.service';
import previewModal from '../../components/plan-creator/preview-plan-modal.vue';
import {
    NitrozenButton,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenToggleBtn,
    NitrozenDialog,
    NitrozenDropdown,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import { Loader, PageHeader } from '../../components/common/';

import _ from 'lodash';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
const channels = ['uniket', 'fynd', 'ecomm', 'marketplace', 'fynd_store'];
import root from 'window-or-global';
const config = root.env || {};

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
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-dropdown': NitrozenDropdown,
        'preview-modal': previewModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    created() {
        let planId = this.$route.params.planId;
        let planPromise = Promise.resolve();
        if (planId) {
            this.loading = true;
            planPromise = BillingService.getPlans({}, planId)
                .then((response) => {
                    _.merge(this.formData, response.data);
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
        let compPromise = BillingService.getComponents({ limit: 100 })
            .then(({ data }) => {
                this.allComponents = data.docs;
                if (!planId) {
                    this.formData.components = data.docs.map((doc) => {
                        return this.getCreateComponentData(doc);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });

        let pArr = [];
        channels.forEach((channel) => {
            let payload = {
                data: { table_name: 'settlement_rule', channels: [channel] }
            };
            pArr.push(BillingService.getDaytraderConfig(payload));
        });
        let dtCompPromise = Promise.all(pArr)
            .then((resArr) => {
                resArr.forEach(({ data }, index) => {
                    this.$set(
                        this.daytraderConfigMap,
                        channels[index],
                        data.data
                    );
                });
            })
            .catch((err) => {
                console.log(err);
            });

        let dtPlanCompPromise = BillingService.getDaytraderComponents()
            .then(({ data }) => {
                this.dtComponents = data.docs;
                if (!planId) {
                    this.formData.dayTraderComponents = data.docs.map((doc) => {
                        return this.getCreateDayTraderCompData(doc);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        this.fetchCompany();

        Promise.all([
            planPromise,
            compPromise,
            dtCompPromise,
            dtPlanCompPromise
        ])
            .then(() => {
                this.originalData = _.cloneDeep(this.formData);
            })
            .catch((err) => console.log(err));
    },
    data() {
        return {
            loading: false,
            pageOptions: [],
            allComponents: [],
            dtComponents: [],
            companies: [],
            selectedCompany: -1,
            daytraderConfigMap: {},
            saveInProgress: false,
            originalData: {},
            formData: this.getCreateData(),
            previewData: null,
            showPreview: false,
            mapPlanType: {
                private: 'Private',
                public: 'Public',
                'company-specific': 'Company Specific'
            },
            copyDisplay: 'COPY LINK',
            contextMenu: [
                {
                    text: 'Clone',
                    action: 'clone'
                },
                {
                    text: 'Subscribe',
                    action: 'subscribe'
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
        planType() {
            return this.$route.query.plan_type;
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
        },
        customPlanLink() {
            return `https://platform.${config.FYND_PLATFORM_DOMAIN}/company/${this.selectedCompany}/billing/custom-plan/${this.planId}`;
        }
    },
    methods: {
        copyText() {
            var copyText = this.$refs['share-text'];
            if (copyText) {
                copyText.select();
                document.execCommand('copy');
                this.copyDisplay = 'LINK COPIED';
            }
        },
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
                    is_visible: this.$route.query.plan_type === 'public',
                    trial_period: 0,
                    addons: [],
                    tags: [],
                    type: this.$route.query.plan_type,
                    company: -1,
                    country: 'IN',
                    name: '',
                    description: '',
                    amount: 0
                },
                product_suite: 'fynd-platform',
                components: [],
                dayTraderComponents: [],
                hasActiveSubscription: false
            };
        },
        getCreateComponentData(baseComponent) {
            if (
                baseComponent.component_price_config.type === 'feature_config'
            ) {
                let feature_config = Object.keys(
                    baseComponent.component_price_config.feature_config
                ).reduce((map, item) => {
                    map[item] =
                        baseComponent.component_price_config.feature_config[
                            item
                        ].default;
                    return map;
                }, {});
                return {
                    is_active: true,
                    display_text: null,
                    component_id: baseComponent._id,
                    component_price: {
                        display_text: '',
                        is_default: false,
                        is_active: true,
                        processing_type: 'feature_config',
                        feature_config: feature_config,
                        component_id: baseComponent._id
                    }
                };
            } else if (
                baseComponent.component_price_config.type === 'revenue'
            ) {
                let compnentData = {
                    is_active: true,
                    display_text:
                        baseComponent.component_price_config.display_text,
                    component_id: baseComponent._id,
                    component_price: {
                        price_ui_type: 'standard',
                        recurring: {
                            aggregate_usage: 'sum',
                            usage_type: 'licensed',
                            interval_count: 1,
                            interval: 'month'
                        },
                        transform_quantity: {
                            divide_by: 1,
                            round: 'up'
                        },
                        free_tier: {
                            type: '',
                            value: 0
                        },
                        unit_amount: 0,
                        price_type: 'static',
                        bill_type: 'one_time',
                        billing_scheme: 'per_unit',
                        display_text: '',
                        is_default: false,
                        is_active: true,
                        processing_type: 'revenue',
                        currency: 'INR',
                        component_id: baseComponent._id,
                        tiers: []
                    }
                };
                _.merge(
                    compnentData,
                    baseComponent.component_price_config.price_meta
                );
                return compnentData;
            } else {
                return {
                    is_active: true,
                    display_text: null,
                    component_id: baseComponent._id,
                    component_price: {
                        display_text: '',
                        is_default: false,
                        is_active: true,
                        processing_type: 'display',
                        component_id: baseComponent._id
                    }
                };
            }
        },
        getCreateDayTraderCompData(dtCompConfig) {
            let dtCompData = {
                component_id: dtCompConfig._id,
                shallow_rules: [
                    {
                        auto_verify: true,
                        is_active: true,
                        component_id: dtCompConfig._id,
                        data: {
                            channels: [],
                            rule: {
                                slug_values: {
                                    channel: {}
                                },
                                rule_end_date: null,
                                rule_start_date: null,
                                transactional_components: {
                                    is_tp: false,
                                    defaults: {
                                        commission: 0,
                                        rto_comm_reversal: 0,
                                        return_comm_reversal: 0
                                    },
                                    source_components: [],
                                    transaction_component: {}
                                },
                                settle_cycle_period: {
                                    mall: 0,
                                    warehouse: 0,
                                    high_street: 0
                                },
                                settlement_type: 'weekly'
                            }
                        }
                    }
                ]
            };
            _.merge(dtCompData.shallow_rules[0].data, dtCompConfig.data);
            return dtCompData;
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
        previewPlan() {
            let compMap = this.formData.components.reduce((map, comp) => {
                map[comp.component_id] = comp.component_price;
                return map;
            }, {});
            this.previewData = _.cloneDeep(this.formData.plan);
            this.previewData.components = this.allComponents.map((comp) => {
                comp.display_text = compMap[comp._id].is_active
                    ? compMap[comp._id].display_text
                    : 'No';
                comp.enabled = compMap[comp._id].is_active;
                return comp;
            });
            this.showPreview = true;
        },
        savePlan() {
            this.saveInProgress = true;
            if (this.validateData()) {
                if (!this.isEditOnly) {
                    this.formData.components.forEach((comp) => {
                        if (
                            comp.component_price.free_tier &&
                            !comp.component_price.free_tier.type
                        ) {
                            delete comp.component_price.free_tier;
                        }
                    });
                    BillingService.createPlan(this.formData)
                        .then(({ data }) => {
                            this.$snackbar.global.showSuccess(
                                'Created successfully'
                            );

                            this.$router.push({
                                path: `administrator/subscription-plans/`,
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
                    BillingService.createPlan(this.formData)
                        .then(({ data }) => {
                            this.$snackbar.global.showSuccess(
                                'Updated successfully'
                            );
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
                this.saveInProgress = false;
            }
        },

        validateData() {
            if (!this.formData.plan.name) {
                this.errors['name'] = 'Required Field';
            }
            return this.$refs['main'].validateData();
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
            } else if (action == 'subscribe') {
                this.$refs['subscribe-modal'].open({
                    width: '550px',
                    dismissible: true,
                    showCloseButton: true,
                    positiveButtonLabel: false,
                    negativeButtonLabel: false,
                    neutralButtonLabel: false
                });
            }
        },
        onCancel() {
            this.$router.push({
                path: `/administrator/subscription-plans`
            });
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
                    if (this.selectedCompany === -1) {
                        this.selectedCompany = this.companies[0].uid;
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
