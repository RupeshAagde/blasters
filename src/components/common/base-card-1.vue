<template>
    <div class="stores-body" v-if="item">
        <div class="stores-div">
            <div class="line-1">
                <div v-if="index" class="cust-head">
                    <a>{{ `Attempt ${index}` }}</a>
                </div>
                <div class="cust-badge">
                    <nitrozen-badge
                        :state="
                            item.status === 'success' ? 'success' : 'warn'
                        "
                        >{{ item.status }}</nitrozen-badge
                    >
                    <span @click="open" class="info-icon">
                        <ukt-inline-svg src="report-issue"></ukt-inline-svg>
                    </span>
                </div>
            </div>
            <div class="store-address-detail">
                <div class="store-city" v-if="item.collection_method">
                    <label class="n-input-label">Collection method</label>
                    <div class="store-address-name">{{ startCase(item.collection_method) }}</div>
                </div>
                <div class="store-city" v-if="item.created_at">
                    <label class="n-input-label">Transaction Date</label>
                    <div class="store-address-name">{{ formatDateTime(item.created_at) }}</div>
                </div>
                <div class="store-city" v-if="item.invoice_id">
                    <label class="n-input-label">Invoice Id</label>
                    <div class="store-address-name">{{ (item.invoice_id) }}</div>
                </div>
                <div class="store-pincode" v-if="item.payment_intent_id">
                    <label class="n-input-label">Payment Intent Id</label>
                    <div class="store-address-name">
                        {{ item.payment_intent_id }}
                    </div>
                </div>
                <div class="store-pincode" v-else-if="item.credit_transaction_id">
                    <label class="n-input-label">Credit Transaction Id</label>
                    <div class="store-address-name">
                        {{ item.credit_transaction_id }}
                    </div>
                </div>
                <div class="store-pincode" v-else>
                    <label class="n-input-label">Payment Intent Id</label>
                    <div class="store-address-name">
                        NA
                    </div>
                </div>
            </div>
            <div class="store-address-detail" v-if="item.offline_payment_comment">
                <div class="store-country">
                    <label class="n-input-label">Offline Payment Comment</label>
                    <div class="store-address-name">
                        {{ item.offline_payment_comment }}
                    </div>
                </div>
            </div>
            <div class="store-address-detail" v-if="item.payment_method_last4 || item.payment_method_last4 || item.payment_method_brand || item.payment_method_funding">
                <div class="store-country">
                    <label class="n-input-label">Card </label>
                    <div class="store-address-name" v-if="item.payment_method_last4">
                        <span  class="number" >
                        {{'**** **** ****'+item.payment_method_last4}}
                        </span>
                        <span>
                            {{ item.payment_method_brand }}
                        </span>
                        <span>
                            {{ item.payment_method_funding }}
                        </span>
                    </div>
                    <div class="store-address-name" v-else>
                        NA
                    </div>
                </div>
            </div>
            <div class="store-address-detail">
                <div class="store-city">
                    <label class="n-input-label">Last Payment Error Message</label>
                    <div class="store-address-name">
                        {{ item.last_payment_error_message || 'NA' }}
                    </div>
                </div>
            </div>
        </div>
        <transition v-if="item" name="modal">
            <nitrozen-dialog ref="dialog" title="JSON" @close="close">
            <template slot="body">
                <div v-if="item" class="meta-container">
                    <no-ssr>
                        <vue-json-pretty
                        :path="'res'"
                        :data="item.debug"
                        >
                        </vue-json-pretty>
                    </no-ssr>
                </div>
            </template>
        </nitrozen-dialog>
        </transition>
    </div>
    <div v-else class="stores-body">No Data</div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenBadge,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import admInlineSVG from '@/components/common/adm-inline-svg';
import moment from 'moment';
import NoSSR from 'vue-no-ssr';
const VueJsonPretty = () => import(/*webpackChunkName:"vue-json-pretty" */ 'vue-json-pretty');
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import startCase from 'lodash/startCase';
export default {
    name: 'base-card',
    components: {
        UktInlineSvg,
        'nitrozen-button': NitrozenButton,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSVG,
        'no-ssr': NoSSR,
        'vue-json-pretty':VueJsonPretty
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
        index:{
            type:Number,
            default:null
        }
    },
    mounted() {
        
    },
    methods: {
        startCase(s){
            return startCase(s)
        },
        amountFormat(plan) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: plan.currency,
            }).format(plan.amount);
        },
        formatDateTime(value){
            if(value){
                return moment(String(value)).format('Do MMMM YYYY, h:mm:ss a');
            }
        },

        open() {
            this.$refs['dialog'].open({
                width: '700px',
                height: '550px',
                showCloseButton: true,
                dismissible: false,
            });
        },
        close(e) {
            this.$emit('close');
        },
    },
};
</script>

<style lang="less" scoped>
@import './../../../node_modules/vue-json-pretty/lib/styles.css';
.line-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-bottom: 12px;

    .cust-head {
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 160px;
        overflow: hidden;
        line-height: 20px;
        font-size: 14px;
        color: #2e31be;
        font-weight: bold;
        cursor: pointer;
    }

    .cust-badge {
        margin-left: 6px;
        display: flex;
        align-items: center;
    }
}
.info-icon {
    margin-left: 5px;
    cursor: pointer;
}
.stores-body {
    .stores-div {
        box-sizing: border-box;
        border: 1px solid @Iron;
        border-radius: 4px;
        background-color: @White;
        padding: 24px;
        margin-bottom: 24px;

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .store-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .store-name {
                color: @Mako;
                font-size: 14px;
            }
        }
        .store-address {
            color: @Mako;
            font-size: 14px;
            margin-top: 12px;
            line-height: 20px;
        }
        .store-address-detail {
            display: flex;
            justify-content: space-between;
            margin-top: 12px;
            .store-address-name {
                color: @Mako;
                font-size: 14px;
                margin-top: 12px;
                line-height: 20px;
            }
        }
    }
}
.bottom-card-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
}
.cust-badge {
    display: flex;
    justify-content: flex-end;

    .img-box {
        margin-left: 12px;
        cursor: pointer;
        ::v-deep svg {
            color: #2e31be;
        }
    }

    .pic-col {
        color: #2e31be;
    }
}
</style>
