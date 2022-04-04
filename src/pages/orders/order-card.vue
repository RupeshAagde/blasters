<template>
    <div class="order-detail" :class="{'surround-padding': !isDrawerView}">
        <div class="row">
            <div>
                <div class="bold-sm order-id order-id-row">
                    <span>{{fyndOrderId !== externalOrderId ? `Fynd `:``}}Order ID: </span>
                    <div
                        class="title cl-RoyalBlue"
                        @click="copyURLToClipboard(fyndOrderId)"
                        title="Click to copy"
                        @mouseover="copyId = fyndOrderId"
                        @mouseout="copyId = null"
                    >
                        {{ fyndOrderId }}
                        <adm-inline-svg
                            class="copy-icon"
                            :src="'copy'"
                            title="Click to copy"
                            @click.stop.native="copyURLToClipboard(fyndOrderId)"
                        ></adm-inline-svg>
                    </div>
                    <slot name="action-button" v-if="isDrawerView"></slot>
                </div>
                <div class="bold-sm order-id order-id-row" v-if="fyndOrderId !== externalOrderId">
                    <span>External Order ID: </span>
                    <div
                        class="title cl-RoyalBlue"
                        @click="copyURLToClipboard(externalOrderId)"
                        title="Click to copy"
                        @mouseover="copyId = externalOrderId"
                        @mouseout="copyId = null"
                    >
                        {{ externalOrderId }}
                        <adm-inline-svg
                            class="copy-icon"
                            :src="'copy'"
                            title="Click to copy"
                            @click.stop.native="copyURLToClipboard(externalOrderId)"
                        ></adm-inline-svg>
                    </div>
                    <slot name="action-button" v-if="isDrawerView"></slot>
                </div>

                <div class="sub-title light-xxxs">
                    Placed on {{ created_at }}
                    <div class="order-domain" v-if="orderDomain">
                        via
                        <a
                            title="Open in new tab"
                            :href="`${orderDomain}`"
                            target="_blank"
                            >{{ orderDomain }}</a
                        >
                    </div>
                </div>
                <div
                    class="row"
                    :class="{ 'status-stats': statusGroup.length }"
                >
                    <nitrozen-badge
                        v-for="(status, i) in statusGroup"
                        :key="i"
                        :style="{
                            color: status.color || 'green',
                            'border-color': status.color || 'green'
                        }"
                    >
                        {{ status.name }} : {{ status.count }}
                    </nitrozen-badge>
                </div>
            </div>

            <div class="platform-logo" v-if="application">
                <div class="application-info">
                    <img
                        :title="application.name"
                        :alt="application.name"
                        :src="application.logo"
                    />
                    <div class="application-name">{{ application.name }}</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="sub-card" v-if="order.delivery_address">
                <delievery-address
                    :address="order.delivery_address"
                    @call="makeACall($event)"
                ></delievery-address>
            </div>
            <div class="sub-card" v-if="order.user && order.user.uid">
                <user-info
                    :user="order.user"
                    @call="makeACall($event)"
                ></user-info>
            </div>
            <div class="sub-card" v-if="order.user_agent">
                 <user-device-info
                    :user_agent="order.user_agent"
                ></user-device-info>
            </div>
            <div class="sub-card" v-if="order.fyndstore_emp && Object.keys(order.fyndstore_emp).length">
                <employee-info
                    :employee="order.fyndstore_emp"
                ></employee-info>
            </div>
            <div class="sub-card" v-if="order.ordering_store && Object.keys(order.ordering_store).length">
                 <ordering-store
                    :address="order.ordering_store"
                    @call="makeACall($event)"
                ></ordering-store>
            </div>
        </div>
        
        <slot></slot>
    </div>
</template>

<style lang="less" scoped>
.order-detail {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    background-color: @White;
    border-radius: 4px;
    .order-id-row{
        align-items: center;
        margin-bottom: 10px;
    }
    .row {
        display: flex;
        @media @mobile{
            display: block;
        }
        .order-id {
            display: flex;
            & > span {
                padding-right: 10px;
            }
        }
        .sub-card {
            padding: 24px 12px 0 0px;
            flex: 0.5;
        }
        .title {
            cursor: pointer;
        }
        .sub-title {
            display: flex;
            margin-top: 12px;
            color: #9b9b9b;
            .order-domain {
                margin-left: 6px;
                a:hover {
                    color: @RoyalBlue;
                    text-decoration: underline;
                }
            }
        }
        .platform-logo {
            display: flex;
            justify-content: flex-end;
            flex: 1;
            .application-info {
                text-align: center;
                img {
                    height: 30px;
                }
                .application-name {
                    font-size: 14px;
                    color: @DustyGray2;
                }
            }
        }
    }
}
.surround-padding{
    padding: 24px;
}
.status-stats {
    margin-top: 16px;
    .nitrozen-badge {
        margin-right: 12px;
    }
}
.copy-icon {
    display: inline !important;
    ::v-deep svg {
        cursor: pointer;
        width: 12px;
        height: 12px;
        margin-left: 12px;
    }
}
</style>

<script>
import AdmInlineSvg from '@/components/common/adm-inline-svg';
import loader from '@/components/common/loader';
import DelieveryAddress from './delivery-address.vue';
import UserInfo from './user-info.vue';
import UserDeviceInfo from './user-device-info.vue';
import EmployeeInfo from './employee-info.vue';
import OrderingStore from './ordering-store.vue';
import { copyToClipboard } from '@/helper/utils.js';
import moment from 'moment';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import mapValues from 'lodash/mapValues';
import groupBy from 'lodash/groupBy';
import keys from 'lodash/keys';
import find from 'lodash/find';
import { mapGetters } from 'vuex';
// import { GET_COMPANY_APPLICATIONS } from '@/store/getters.type';

export default {
    name: 'order-card',
    components: {
        AdmInlineSvg,
        loader,
        DelieveryAddress,
        UserInfo,
        UserDeviceInfo,
        EmployeeInfo,
        NitrozenBadge,
        OrderingStore
    },
    props: {
        order: {},
        orderDomain: {
            type: String
        },
        isDrawerView: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        statusGroup() {
            if (this.order) {
                const groupObj = mapValues(
                    groupBy(this.order.shipments.map(s => s.status), 'status'),
                    group => {
                        const firstItem = group[0];
                        return {
                            name: firstItem.name,
                            count: group.length,
                            color: firstItem.color_code
                        };
                    }
                );
                return keys(groupObj).map(text => {
                    return groupObj[text];
                });
            } else {
                return [];
            }
        },
        ...mapGetters({
            companyApplications: []//GET_COMPANY_APPLICATIONS
        }),
        created_at() {
             // @NOTE: Converting GMT to Current Timezone Date value
            return moment(this.order.created_at).add(new Date().getTimezoneOffset(), 'minutes').format('LT, MMM Do, YY');
        },
        application() {
            let result = {}
            result = find(this.companyApplications, {
                id: this.order.application.id,
            });
            if(!result){
                result = this.order.application;
                result.logo = this.order.channel && this.order.channel.logo;
            }
            return result;
        },
         fyndOrderId(){
            return this.order && this.order.id?this.order.id:null
        },
        externalOrderId(){
            return this.order && this.order.shipments && this.order.shipments.length && this.order.shipments[0].affiliate_details && this.order.shipments[0].affiliate_details.affiliate_order_id ? this.order.shipments[0].affiliate_details.affiliate_order_id : null;
        }
    },
    data() {
        return {
            copyId: null
        };
    },
    methods: {
        copyURLToClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },
        makeACall(event) {
            this.$emit('call', event);
        }
    }
};
</script>
