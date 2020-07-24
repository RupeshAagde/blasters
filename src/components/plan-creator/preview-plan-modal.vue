<template>
    <basic-modal
        :isOpen="isOpen"
        :title="'Plan Preview'"
        :childHandleFocus="true"
        @closedialog="$emit('closeSubscribePlanModal')"
        class="compare-plans-modal"
    >
        <div class="subscription-container">
            <div class="plans-wrapper">
                <div>
                    <compare-plans
                        :plans="plans"
                        @closeComparePlansModal="() => {}"
                    ></compare-plans>
                </div>
            </div>
        </div>
    </basic-modal>
</template>

<script>
import { BaseModal } from '../../components/common/';
import comparePlans from './compare-plans.vue';
import {
    NitrozenRadio,
    NitrozenButton,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';
export default {
    name: 'subscription-modal',
    components: {
        BaseModal,
        'compare-plans': comparePlans,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-button': NitrozenButton,
        'basic-modal': BaseModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        plans: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    filters: {
        capitalize: function(value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    methods: {
        recurringText(interval_count, interval) {
            if (interval_count == 1) {
                return `per ${interval}`;
            }
            return `per ${interval_count} ${interval}`;
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency
            }).format(plan.amount);
        },
        getBillingText(plan) {
            return `Billed every ${plan.recurring.interval_count} ${plan.recurring.interval}`;
        }
    }
};
</script>

<style scoped lang="less">
.compare-plans-modal.modal {
    ::v-deep .modal-container {
        width: 1200px;
        max-width: 1200px;
        min-height: 500px;
        .modal-body {
            margin: 0px;
        }

        .subscription-container {
            .plans-wrapper {
                width: 1100px;
                margin: 0 auto;
                .trial-expired-text {
                    font-size: 16px;
                    margin-bottom: 24px;
                    width: 100%;
                    text-align: center;
                }
                .plan-bolder {
                    font-weight: 500;
                    font-size: 15px;
                }
                .plan-thin {
                    font-weight: 400;
                    font-size: 15px;
                    -webkit-font-smoothing: antialiased;
                    color: #696969;
                }
                .plan-details-container {
                    border: 1px solid lightgray;
                    border-radius: 5px;
                    padding: 12px;
                }
                .cards-table {
                    width: 100%;
                    margin-bottom: 24px;
                    font-family: Poppins, sans-serif;
                    font-size: 14px;
                    thead {
                        tr {
                            background: #f8f8f8;
                            color: black;
                        }
                    }
                    tbody {
                        tr {
                            border-bottom: 1px solid lightgray;
                        }
                    }
                    td {
                        text-align: center;
                        padding: 14px 5px;
                    }
                }
            }
        }
    }
}
</style>
