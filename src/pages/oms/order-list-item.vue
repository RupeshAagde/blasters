<template>
   <div class="top-box">
       <table class="mirage-table list-table">
           <tr class="table-header-row">
               <th class="channel">Channel</th>
                <th class="order-ids">Order ID</th>
                <th class="price">Price</th>
                <th class="num-ship">Shipments</th>
                <th class="status">Tags</th>
                <th class="items">Items </th>
            </tr>
            <tr class="line-break"
                v-for="(orderData, index) in data"
                :key="'order-'+orderData.order_id"
                @click="navigate(orderData.order_id, index)"
            >
               <td class="application-holder">
                   <div>
                    <div class="application-logo">
                        <span class="image-logo">
                                <img
                                        :title="orderData.channel && orderData.channel.name"
                                        :alt="orderData.channel && orderData.channel.name"
                                        :src="orderData.channel && orderData.channel.logo || ''"
                                    /> 
                            </span> 
                    </div>
                    <span class="application-name common-struct"> {{ orderData.channel.name}} </span> 
                   </div>
                </td>
                <td >
                    <span
                        title="Click to copy"
                        class="order-id common-struct"
                        @click="copyToClipboard($event, orderData.order_id)"
                    >
                        {{ orderData.order_id }}
                        
                    </span>
                    <div class="placed-on common-struct">
                        {{ convertToOMSDate(orderData.order_created_time ) }}
                    </div>
                </td>
                <td>
                    <div class="shipment-stats common-struct">
                        <!-- <span
                            >{{
                                sumOfShipmentsPrice(orderData.shipments) | currencyformat
                            }}
                        </span> -->
                        <span
                            >{{
                                orderData.total_order_value | currencyformat(2)
                            }}
                        </span>
                    </div>
                    <div class="payment-method common-struct">
                        {{ orderData.payment_mode == 'COD' ? 'COD' : 'PREPAID' }}
                    </div>
                </td>
                <td>
                    <div class="number-shipments common-struct" v-if="orderData.shipments && orderData.shipments.length">
                        {{orderData.shipments.length}}
                    </div>
                </td>
                <td>
                    <div v-if="orderData.meta.order_tags" class="tags-container">
                        <div
                            class="shipment-data"
                            v-for="(item, index) in orderData.meta.order_tags"
                            :key="`${item.shipment_id}_${index}`"
                        >
                            <div 
                                class="shipment-info"
                                v-if="index <= 0">

                                <nitrozen-badge
                                    class="right-align"
                                    :style="{
                                        color: '#E9783D',
                                        'border-color': '#E9783D'
                                    }"
                                >
                                    {{ item.display_text }}
                                </nitrozen-badge>
                            </div>
                        </div>
                        <div class="extra-tags-count" v-if="orderData.meta.order_tags.length > 1">
                            <nitrozen-badge
                                :style="{
                                    color: '#E9783D',
                                    'border-color': '#E9783D',
                                    cursor: 'pointer'
                                }"
                                :title="extraTags(orderData.meta.order_tags)"
                            >
                                + {{ orderData.meta.order_tags.slice(1).length }}
                            </nitrozen-badge>
                        </div>
                    </div>
                    <div v-else>
                        <nitrozen-badge
                            class="right-align"
                            :style="{
                                color: '#E9783D',
                                'border-color': '#E9783D'
                            }"
                        >
                            Standard Delivery
                        </nitrozen-badge>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="items common-struct">
                            {{
                                totalItems(orderData.shipments)
                            }}
                        </span>
                    </div>
                </td>
           </tr>
       </table>

   </div>
</template>

<script>
/* Package imports */
import { mapGetters } from 'vuex';
import { NitrozenBadge, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/inline-svg';

/* Helper imports */
import { copyToClipboard, convertToOMSDate } from '@/helper/utils.js';

/* Service imports */
import { LocalStorageService } from '@/services/localstorage.service';

export default {
    name: 'order-item',
    components: {
        NitrozenBadge,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenTooltip,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        readOnlyMode: {
            type: Boolean,
            default: false,
        }
        // shipment: {
        //     type: Object,
        //     required: true,
        // },
    },
    data() {
        return {
            quickShipmentView: false,
            shipmentId: "",
            orderNumId: ""
        }
    },
    methods: {
        convertToOMSDate,

         /**
         * Method to add the current list of orders to localStorage for 2 hours.
         * This method will be useful for navigation inside the details page.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Array} orders The list of order_ids fetched by the API
         */
        addOrdersToLocalStorage(orders) {
            LocalStorageService.addOrUpdateItem('oms-orders', orders, 7200000);
        },


        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000); 
        },

        extraTags(data) {
            return data.slice(1).map(item =>item.text).join(', ');
        },

        navigate(orderId, index) {
            let cleansedQuery = Object.keys(cloneDeep(this.$route.query))
            .filter(key => {
                let item = this.$route.query[key];
                return item !== undefined && item !== null && item.length > 0;
            }).reduce((finalObj, key) => {
                let value = this.$route.query[key];
                finalObj[key] = value;
                return finalObj;
            }, {});

            /* Add the list of orders to the local storage */
            let orders = cloneDeep(this.data).map(item => item.order_id);
            this.addOrdersToLocalStorage(orders);

            let navigationObj = {
                index: index,
                has_next: index !== orders.length - 1,
                has_previous: index !== 0
            };


            this.$router.push({
                name: this.readOnlyMode ? 'application-order-details-v2': 'company-order-details-v2',
                params: {
                    orderId: orderId
                },
                query: {
                    ...cleansedQuery,
                    ...navigationObj
                }
            })
        },

        sumOfShipmentsPrice(shipments) {
            let sum = 0;
            for (let items in shipments) {
                sum += shipments[items].prices.amount_paid; 
            }
            return sum;
        },

        totalItems(shipments) {
            let total = 0;
            for (let items in shipments) {
                total += shipments[items] && 
                            shipments[items].total_items ? 
                                shipments[items].total_items : 0;
            }
            return total;
        }
    },
};
</script>

<style lang="less" scoped>
@import '../../less/common.less';

.list-table {
    border-collapse: collapse; 
    width: 100%;
    margin-bottom: 0px;
    font-family: Inter, sans-serif;
    font-size: 14px;
    
    tr:hover {
        cursor: pointer;
        background-color: #F5F8FF;
    }

    .table-header-row {
        position: sticky;
        top: 0;
        z-index: 1;
        box-sizing: border-box;
        width: 1094px;
        height: 47.37px;
        background: #F6F6F6;
        border-bottom: 1px solid #E0E0E0;
        border-radius: 4px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: #41434C;
    }

    tr:not(:first-child) {
        border-bottom: none;
        width: 1092px;
        height: 64px;
    }

    tr:last-child {
        border-bottom: none;
    }

    th:first-child {
        padding-left: 24px;
    }

    th {
        position: sticky;
        top: 0;
        vertical-align: middle;
        text-align: left;
        height: 17px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: #41434C;
    }

    th:not(:first-child) {
        padding-left: 5px;
    }

    td {
        vertical-align: top;
        text-align: left;
        padding: 12px 6px;
    }

    tr.line-break td{
        position: relative;
    }

    tr.line-break td:after {
        content: '';
        position: absolute;
        top: -1px;
        left: 0px;
        height: 1px;
        width: 100%;
        background-color: rgb(235,235,235);
    }

    tr.line-break td:first-child:after,
    tr.line-break td:last-child:after {
        width: calc(100% - 24px);
    }

    tr.line-break td:first-child:after {
        right: 0px;
        left: auto;
    }
}

.application-holder {
    display: flex;
    width: 100%;

    .application-logo {
        padding-left: 16px;
        text-align: left;
    }

    img {
        object-fit: contain;
        height: 20px;
    }

    .image-logo {
        padding-top: 5px;
    }
}

.common-struct {
    font-weight: 300;
    font-size: 12px;
    line-height: 17px;
}

.application-name {
    width: 100%;
    padding: 4px 0px 0px 16px;
}

.order-id {
    color: @RoyalBlue;
}

.placed-on {
    color: @DustyGray2;
    margin-top: 6px;
}

.payment-method {
    color: @DustyGray2;
    margin-top: 6px;
}

.number-shipments {
    width: 40px;
    color: @RoyalBlue;
}

.items {
    width: 40px;
    color: @Mako;
}

.top-box {
    box-sizing: border-box;
    border-bottom: none;
    border-top: none;
    background: @White;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
}

.nitrozen-badge {
    height: 16px;
    padding: 4px 8px;
    display: inline-block;
    cursor: default;
    border-radius: 2px;
    border: 1px solid #9b9b9b;
    color: @White;
    font-size: 12px;
    white-space: nowrap;
    line-height: 18px;
    text-transform: uppercase;
}

.channel {
    width: 166px;
}

.order-ids {
    width: 249px;
}

.price {
    width: 163px;
}

.num-ship {
    width: 186px;
}

.status {
    width: 181px;
}

.items {
    width: 140px;
}

.drawer-view{
    height: 100%;
    position: fixed;
    top: 64px; // To expose header
    right: 0px;
    width: 100%;
    z-index: @shipmentDrawer;

    .drawer-container{
        position: absolute;
        right: 0px;
        width: calc(100% - 250px);
        height: 100%;
        background: #f8f8f8;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none !important;
        }
        
        @media @mobile {
            position: fixed;
            width: 100%;
        }
    }

    .cancel-btn {
        position: absolute;
        top: 15px;
        right: 20px;
        cursor: pointer;
    }
}

.tags-container {
    display: flex;
    column-gap: 4px;
}


</style>
