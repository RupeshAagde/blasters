<template>
    <div style="width:100%;">
        <div class="page-container common-container">
            <div class="header">
                <div class="title cl-Mako bold-md">Current Subscription</div>
                <nitrozen-button
                    v-if="active_plan.is_enabled"
                    theme="secondary"
                    @click="openPlanDetailsModal"
                    >View details</nitrozen-button
                >
            </div>
            <div v-if="!active_plan.is_enabled">Company under trial plan</div>
            <div
                v-if="active_plan.is_enabled"
                class="current-active-plan regular-xsp"
            >
                <div style="color: black;" class="darker-xsp">
                    Current active plan:
                    <span
                        class="cl-RoyalBlue clickable-label"
                        @click="
                            $router.push({
                                path: `/administrator/subscription-plans/edit/${active_plan.subscription.plan_data._id}`
                            })
                        "
                        >{{ active_plan.subscription.plan_data.name }}</span
                    >
                </div>
                <div>
                    Pricing:
                    {{ amountFormat(active_plan.subscription.plan_data) }}
                    /
                    {{
                        recurringText(
                            active_plan.subscription.plan_data.recurring
                                .interval_count,
                            active_plan.subscription.plan_data.recurring
                                .interval
                        )
                    }}
                </div>
                <div>
                    Next billing date:
                    {{
                        getDateString(
                            active_plan.subscription.current_period.end
                        )
                    }}
                </div>
            </div>
        </div>
        <div
            v-for="component in subscription_id ? dtComponents : []"
            :key="component._id"
            class="component-container page-container common-container"
        >
            <daytrader-component
                :subscriptionId="subscription_id"
                :component="component"
                :dtOptions="
                    dtConfigMap[component.data.slug_values.channel[0].id]
                "
                :cbs_opts="cbs_opts"
            >
            </daytrader-component>
        </div>
        <nitrozen-dialog
            id="view-plan-details"
            ref="view_plan_details"
            title="Plan details"
        >
            <template slot="body" name="body">
                <div class="plan-info" v-if="plan_details">
                    <div class="plan-bolder">
                        Plan name: {{ plan_details.name }}
                    </div>
                    <div class="plan-thin">
                        Pricing:
                        {{ amountFormat(plan_details) }}
                        /
                        {{
                            recurringText(
                                plan_details.recurring.interval_count,
                                plan_details.recurring.interval
                            )
                        }}
                    </div>
                </div>
                <plan-rows :plan="plan_details"></plan-rows>
            </template>
            <template slot="footer" name="footer"
                ><div></div
            ></template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
.page-container {
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
}
.common-container {
    margin: 0;
    + .common-container {
        margin-top: 24px;
    }
}
::v-deep .top-headers {
    line-height: 27px;
    margin-top: 12px;
    &:first-child {
        margin-top: 0;
    }
}

.plan-info {
    padding: 14px;
    border-radius: 5px;
    border: 1px solid lightgray;
    line-height: 24px;
}

::v-deep .custom-label {
    flex: 0;
}
::v-deep .clickable-label {
    cursor: pointer;
}
::v-deep .form-row {
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
::v-deep .nitrozen-error-visible {
    visibility: hidden;
}
::v-deep .nitrozen-error-visible.visible {
    visibility: visible;
}

.header {
    display: flex;
    margin-bottom: 18px;
    align-items: center;
    .title {
        line-height: 27px;
        flex: 1;
    }
}
.current-active-plan {
    line-height: 24px;
    padding: 14px;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    color: #696969;
    max-width: 600px;
    min-width: 300px;
}

::v-deep .component-container {
    .comp-header {
        display: flex;
        width: 100%;
        line-height: 21px;
        align-items: center;
    }
    .align-right {
        justify-content: flex-end;
        flex: 1;
        display: flex;
    }
}

::v-deep .disabled-ctrl {
    opacity: 0.5;
}
</style>

<script>
import BillingService from '../../services/billing.service';
import CompanyService from '../../services/company-admin.service';
import moment from 'moment';
import { NitrozenButton, NitrozenDialog, flatBtn } from '@gofynd/nitrozen-vue';
import daytraderComponent from './daytrader-rule-component.vue';
import planRows from '../../components/plan-creator/plan-rows.vue';

const channels = ['uniket', 'fynd', 'ecomm', 'marketplace', 'fynd_store'];

export default {
    name: 'plan-details',
    props: {
        company_id: {
            type: Number
        }
    },
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'daytrader-component': daytraderComponent,
        'plan-rows': planRows
    },
    data() {
        return {
            active_plan: {},
            plan_editor: null,
            dtConfigMap: {},
            dtComponents: [],
            edit_base_component: {},
            edit_component: {
                shallow_rules: [{}]
            },
            edit_rule_idx: -1,
            locations: [],
            brands: [],
            plan_details: null
        };
    },
    props: {
        company_data: {
            type: Object
        },
        company_id: {
            type: String
        }
    },
    computed: {
        plan_data() {
            return (
                this.active_plan.subscription &&
                this.active_plan.subscription.plan_data
            );
        },
        subscription_id() {
            return this.active_plan.subscription
                ? this.active_plan.subscription._id
                : '';
        },
        edit_channel() {
            return this.edit_base_component.data
                ? this.edit_base_component.data.slug_values.channel[0].id
                : '';
        },
        edit_rule() {
            if (this.edit_rule_idx < 0) {
                return null;
            }
            return this.edit_component.shallow_rules[this.edit_rule_idx].data;
        },
        cbs_opts() {
            let opts = {
                brands: this.brands,
                locations: this.locations
            };
            if (this.company_data) {
                opts['companies'] = [
                    {
                        value: this.company_data.uid,
                        text: this.company_data.name
                    }
                ];
            }
            return opts;
        }
    },
    directives: {
        flatBtn
    },
    created() {
        const params = {
            unique_id: this.company_id,
            product_suite: 'fynd-platform',
            type: 'company'
        };
        BillingService.getCurrentPlanDetails(params)
            .then(({ data }) => {
                this.active_plan = data;
                if (this.plan_data && this.plan_data._id) {
                    BillingService.getPlanDetail(this.plan_data._id)
                        .then(({ data }) => {
                            this.plan_details = data;
                        })
                        .catch((err) => {
                            this.$snackbar.global.showError(
                                'Failed to load plan details'
                            );
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                this.$snackbar.global.showError(
                    'Failed to load current subscription details'
                );
                console.log(err);
            });

        let pArr = [];

        channels.forEach((channel) => {
            let payload = {
                data: { table_name: 'settlement_rule', channels: [channel] }
            };
            pArr.push(BillingService.getDaytraderConfig(payload));
        });

        Promise.all(pArr)
            .then((resArr) => {
                resArr.forEach(({ data }, index) => {
                    this.$set(this.dtConfigMap, channels[index], data.data);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        BillingService.getDaytraderComponents()
            .then(({ data }) => {
                this.dtComponents = data.docs;
            })
            .catch((err) => {
                console.log(err);
            });

        this.fetchBrands();
        this.getDaytraderFilters();
    },
    methods: {
        openPlanDetailsModal() {
            this.$refs['view_plan_details'].open({
                width: '750px',
                height: '675px',
                showCloseButton: true,
                dismissible: true
            });
        },
        getDateString: function(value) {
            return moment(value).format('MMMM Do YYYY');
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: plan.currency
            }).format(plan.amount);
        },
        recurringText(interval_count, interval) {
            if (interval_count == 1) {
                return `per ${interval}`;
            }
            return `per ${interval_count} ${interval}`;
        },
        fetchBrands() {
            return CompanyService.fetchBrands({
                page_size: 1000,
                page_no: 1,
                company: this.company_data.uid,
                stage: 'verified'
            })
                .then(({ data }) => {
                    this.brands = data.data.map((item) => {
                        return {
                            text: item.brand.name,
                            value: item.brand.uid
                        };
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getDaytraderFilters() {
            BillingService.getDaytraderFilters({
                data: {
                    table_name: 'config_fields_values',
                    filters: {
                        config_field: 'location_type'
                    }
                }
            })
                .then(({ data }) => {
                    this.locations = data.data.map((item) => {
                        return {
                            value: item.name,
                            text: item.display_name
                        };
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>
