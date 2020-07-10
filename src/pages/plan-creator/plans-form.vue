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
                            'cl-DustyGray2': !formData.is_active,
                            'cl-RoyalBlue': formData.is_active
                        }"
                        @click="
                            () => {
                                formData.is_active = !formData.is_active;
                                changeActiveState();
                            }
                        "
                        >{{ formData.is_active ? 'Active' : 'Inactive' }}</span
                    >
                    <nitrozen-toggle
                        class="pad-right"
                        v-model="formData.is_active"
                        @change="changeActiveState"
                    ></nitrozen-toggle>
                    <nitrozen-button
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
                    class="subscription-plan-section main-section"
                    :formData="formData"
                    :errors="errors"
                    :pageOptions="pageOptions"
                />
                <detail-section
                    class="subscription-plan-section detail-section"
                    :formData="formData"
                    :errors="errors"
                />
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
                recurring: {
                    interval: 'month',
                    interval_count: 1
                },
                is_trial_plan: false,
                plan_group: 'default',
                tagLines: [],
                currency: 'INR',
                is_active: true,
                is_visible: false,
                trial_period: 7,
                addons: [],
                tags: [],
                name: '',
                description: '',
                amount: 0,
                product_suite_id: '5ef19d324a4a8700353a9e7a',
                plan_components: []
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
