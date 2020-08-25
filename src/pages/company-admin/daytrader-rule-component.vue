<template>
    <div class>
        <div class="comp-details">
            <div class="comp-header">
                <div class="cl-Mako bold-md">{{ component.name }} Rules</div>
                <div class="align-right">
                    <span
                        :class="{ 'disabled-ctrl': disabled }"
                        class="bold-xs clickable-label cl-RoyalBlue"
                        @click="editDayTraderRule"
                        >Add Rule</span
                    >
                </div>
            </div>

            <div class="rules">
                <rule-card
                    class
                    v-for="(subRule, index) in rules"
                    :key="subRule._id"
                    @click="
                        () => {
                            edit_rule_idx = index;
                            editDayTraderRule();
                        }
                    "
                    :sub_rule="subRule"
                ></rule-card>
            </div>
            <div class="pagination" v-if="rules.length > 5">
                <nitrozen-pagination
                    name="rules"
                    v-model="pagination"
                    @change="fetchRules"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div>
        </div>
        <nitrozen-dialog
            ref="daytrader_rule_edit"
            :title="
                `${edit_rule_idx > -1 ? 'Edit' : 'Create'} ${
                    component.name
                } Rule`
            "
            @close="edit_rule_idx = -1"
        >
            <template slot="body">
                <daytrader-component
                    v-if="dtOptions && component && show_rule_editor"
                    :options="dtOptions"
                    :verified="
                        edit_rule_idx > -1
                            ? rules[edit_rule_idx].auto_verify
                            : false
                    "
                    :ref="'daytrader'"
                    class="plan-component"
                    :config="
                        edit_rule_idx > -1
                            ? rules[edit_rule_idx].data
                            : component.data
                    "
                    :cbs_opts="cbs_opts"
                    :component_id="component._id"
                    :plan_type_rule="
                        edit_rule_idx > -1
                            ? rules[edit_rule_idx].rule_type === 'plan_type'
                            : false
                    "
                    :disabled="
                        edit_rule_idx > -1
                            ? rules[edit_rule_idx].auto_verify
                            : false
                    "
                ></daytrader-component>
            </template>
            <template slot="footer">
                <nitrozen-button
                    :disabled="
                        edit_rule_idx > -1
                            ? rules[edit_rule_idx].auto_verify
                            : false
                    "
                    class="pad-right"
                    v-flatBtn
                    :theme="'secondary'"
                    @click="updateDaytraderData"
                    >{{
                        edit_rule_idx > -1 ? 'Update' : 'Add'
                    }}</nitrozen-button
                >
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
import BillingService from '../../services/billing.service';
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenPagination,
    flatBtn
} from '@gofynd/nitrozen-vue';
import daytraderComponent from '../../components/plan-creator/daytrader-component.vue';
import daytraderRuleCard from '../../components/plan-creator/subscription-rule-card.vue';

export default {
    name: 'daytrader-rule',
    props: {
        component: {
            type: Object
        },
        dtOptions: {
            type: Object
        },
        cbs_opts: {
            type: Object
        },
        subscriptionId: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-pagination': NitrozenPagination,
        'daytrader-component': daytraderComponent,
        'rule-card': daytraderRuleCard
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            rules: [],
            pagination: {
                limit: 10,
                total: 0,
                current: 1
            },
            edit_rule_idx: -1,
            show_rule_editor: true,
            clone_rule: false
        };
    },
    created() {
        this.fetchRules();
    },
    methods: {
        fetchRules() {
            const params = {
                query: JSON.stringify({
                    component_id: this.component._id
                }),
                limit: this.pagination.limit,
                page: this.pagination.current - 1
            };
            BillingService.getSubscriptionDaytraderRules(
                params,
                this.subscriptionId
            )
                .then(({ data }) => {
                    this.rules = data.docs;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        editDayTraderRule() {
            this.$refs['daytrader_rule_edit'].open({
                width: '850px',
                height: 'calc(100% - 100px)',
                dismissible: true,
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false
            });
            // if (
            //     this.edit_rule_idx > -1 &&
            //     this.rules[this.edit_rule_idx]
            // ) {
            //     _.merge(
            //         this.$refs['daytrader'].formData,
            //         this.rules[this.edit_rule_idx].data
            //     );
            // } else {
            //     _.merge(
            //         this.$refs['daytrader'].formData,
            //         this.component.data
            //     );
            // }
        },
        updateDaytraderData() {
            if (!this.$refs['daytrader'].validateData()) {
                this.$snackbar.global.showError(
                    'Invalid data entered. Please enter valid data.'
                );
                return;
            }
            let payload = null;
            if (this.clone_rule) {
                payload = this.rules[this.edit_rule_idx];
                payload['subscription_id'] = this.subscriptionId;
                payload['rule_type'] = 'override_rule';
            } else if (
                this.edit_rule_idx > -1 &&
                this.rules[this.edit_rule_idx]
            ) {
                payload = this.rules[this.edit_rule_idx];
            } else {
                payload = _.cloneDeep(
                    _.pick(this.rules[0], [
                        'data',
                        'auto_verify',
                        'plan_id',
                        'is_active',
                        'component_id'
                    ])
                );
                payload['subscription_id'] = this.subscriptionId;
                payload['rule_type'] = 'override_rule';
            }
            payload.data = this.$refs['daytrader'].validData();
            payload.auto_verify = this.$refs['daytrader'].auto_verify;
            this.$refs['daytrader_rule_edit'].close();
            this.edit_rule_idx = -1;
            console.log(payload);
            BillingService.addSubscriptionDaytraderRule(
                this.subscriptionId,
                payload
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(`Rule added succssfully`);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(`Failed to add rule`);
                    console.log(err);
                });
        }
    }
};
</script>

<style></style>
