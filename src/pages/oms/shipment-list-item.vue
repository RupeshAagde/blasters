<template>
   <div class="top-box">
       <table class="mirage-table list-table" v-if="shipmentList && shipmentList.length">
           <tr class="table-header-row">
                <th>Channel</th>
                <th>Shipment ID</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Items</th>
                <th v-if="showPackBy">{{ statusesForConfirmByColumn.includes(shipmentList[0].shipment_status.status) ? "Confirm By" : "Pack By" }}</th>
           </tr>

           <tr class="line-break"
                v-for="(shipData, index) in shipmentList"
                :key="'shipment-'+shipData.shipment_id"
                @click="navigate(shipData.order_id, shipData.shipment_id, index)"
            >
                <td class="application-holder">
                    <div class="application-css">
                        <div class="application-logo">
                            <span class="image-logo" v-if="shipData.channel.logo">
                                    <img
                                        :title="shipData.channel.name"
                                        :alt="shipData.channel.name"
                                        :src="shipData.channel.logo"
                                    />
                                </span>
                        </div>
                        <span class="application-name common-struct"> {{ shipData.channel.name}} </span>
                   </div>
                </td>

                <td>
                    <div class="shipment-id-main">
                        <span
                            class="shipment-id common-struct"
                            title="Click to copy"
                            @click="copyToClipboard($event, shipData.shipment_id )"
                            >
                            {{ shipData.shipment_id }}
                        </span>
                        <div class="placed-on common-struct">
                            {{ convertToOMSDate(shipData.shipment_created_at) }}
                        </div>
                    </div>
                </td>

                <td>
                    <div>
                        <div 
                            class="shipment-stats common-struct" 
                            v-if="shipData.prices && shipData.prices.amount_paid !== undefined">
                            <span>
                                {{
                                    shipData.prices.amount_paid | currencyformat(2)
                                }}
                            </span>
                        </div>
                        <div class="payment-method common-struct">
                            <span>{{ shipData.payment_mode == 'COD' ? 'COD' : 'PREPAID' }}</span>
                        </div>
                    </div>
                </td>

                <td>
                    <div class="css-tags-container">
                        <div v-if="shipData.meta.shipment_tags" class="tags-container">
                            <div
                                class="order-tags"
                                v-for="(item, index) in shipData.meta.shipment_tags"
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
                            <div class="extra-tags-count" v-if="shipData.meta.shipment_tags.length > 1">
                                <nitrozen-badge
                                    :style="{
                                        color: '#E9783D',
                                        'border-color': '#E9783D',
                                        cursor: 'pointer'
                                    }"
                                    :title="extraTags(shipData.meta.shipment_tags)"
                                >
                                    + {{ shipData.meta.shipment_tags.slice(1).length }}
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
                        <div class="lock-icon-container" v-if="shipData.lock_status"  :data-tooltip="shipData.meta && shipData.meta.lock_message ? shipData.meta.lock_message : ''" :class="{'tooltip-top': shipData.meta && shipData.meta.lock_message && shipData.meta.lock_message.length }"> 
                            <ukt-inline-svg 
                            :src="'oms-lock'" 
                            class="lock-icon"  />
                        </div>
                    </div>
                </td>

                <td>
                    <div>
                        <nitrozen-badge
                                class="right-align"
                                :style="{
                                    color: 'green',
                                    'border-color': 'green',
                                }"
                            >
                                {{ convertSnakeCaseToString(shipData.shipment_status.status) }}
                            </nitrozen-badge>
                    </div>
                </td>

                <td>
                    <div class="bags-item-images">
                        <template
                                v-for="(bag, index) in shipData.bags">
                            <div
                                @click.stop="changeDialogView(shipData)"
                                :key="'bag-'+bag.bag_id+'-'+index"
                                v-if="index <= 2"
                                class="item-images">
                                <img
                                    v-if="bag.item.image"
                                    :title="bag.item.name"
                                    :alt="'Product Image'"
                                    :src="bag.item.image.length > 1 ? bag.item.image.slice(0, 1) : bag.item.image"
                                />
                                <img
                                    v-else
                                    :title="bag.item.name"
                                    :src="'https://hdn-1.fynd.com/media/fynd_store_items/l2_category/720x0/2830_c5bb5fc02f414307a828c4c56483c30a.jpg'"
                                />
                                <div class="item-count-overlay" v-if="(shipData.bags.length>3 && index == 2)"  :title="`${bag.item.name} +${shipData.bags.length-3}`">
                                    <span class="count-text">+{{shipData.bags.length-3}}</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </td>

                <td class="sla-block" v-if="showPackBy">
                    <div 
                        class="sla-status" 
                        v-if="
                            shipData.shipment_status && 
                            shipData.shipment_status && 
                            shipData.shipment_status.meta && 
                            shipData.shipment_status.meta.estimated_sla_time
                        " 
                        :title="slaTitle(shipData)">
                        <sla-indicator 
                            :sla_percent="
                                displaySlaPercentage(
                                    shipData.shipment_status.status_created_at, 
                                    shipData.shipment_status.meta.estimated_sla_time)
                                " 
                            />
                        <span class="sla-time">{{displaySlaHoursLeft(shipData.shipment_status.meta.estimated_sla_time)}}</span>
                    </div>
                </td>
           </tr>
       </table>

        <transition name="slide">
            <template v-if="bagDialogView">
                <div class="drawer-view" @click="close($event)">
                    <div class="drawer-container">
                        <bags-dialog
                            :shipData="selectedShipmentData"
                            :shipment_id="shipmentId"
                            :shipment_status="shipmentStatus"
                            @closeDialog="closeDialog($event)"
                        />
                            <a class="cancel-btn" @click="close($event)">
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>
   </div>
</template>

<script>
/* Package imports */
import { mapGetters } from 'vuex';
import { NitrozenBadge, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/inline-svg';
import BagsDialog from '@/pages/oms/bags-dialog/index.vue';
import SlaIndicator from '@/pages/oms/sla/sla-indicator.vue';

/* Helper imports */
import { copyToClipboard, convertSnakeCaseToString, convertToOMSDate } from '@/helper/utils.js';
import { displaySlaPercentage,displaySlaHoursLeft,displaySlaTooltip } from '@/pages/oms/sla/helper.js';

/* Service imports */
import { LocalStorageService } from '@/services/localstorage.service';


export default {
    name: 'shipment-item',
    components: {
        NitrozenBadge,
        UktInlineSvg,
        AdmInlineSvg,
        NitrozenTooltip,
        BagsDialog,
        SlaIndicator
    },
    props: {
        readOnlyMode: {
            type: Boolean,
            default: false,
        },
        shipmentList: {
            type: Array,
            required: true,
        },
        lane: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            bagDialogView: false,
            shipmentId: "",
            orderNumId: "",
            selectedShipmentData: [],
            shipmentStatus: "",
            statusesForConfirmByColumn: ['placed', 'store_reassigned']
        }
    },
    computed: {
        showPackBy(){
            return ['new', 'confirmed', 'to_be_packed'].includes(this.lane)
        }
    },
    methods: {
        convertSnakeCaseToString,
        convertToOMSDate,
        displaySlaPercentage,
        displaySlaHoursLeft,
        displaySlaTooltip,

        /**
         * Method to add the current list of orders to localStorage for 2 hours.
         * This method will be useful for navigation inside the details page.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Array} orders The list of order_ids fetched by the API
         */
        addOrdersToLocalStorage(orders) {
            LocalStorageService.addOrUpdateItem('oms-orders', [...orders], 7200000);
        },

        changeDialogView: function (shipData) {
            this.bagDialogView = !this.badDialogView;
            this.selectedShipmentData = shipData;
        },

        closeDialog: function () {
            this.bagDialogView = false;
        },
        
        close: function (e) {
            e.stopPropagation();
            this.bagDialogView = false;
        },

        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000); 
        },

        extraTags(data) {
            return data.slice(1).map(item =>item.text).join(', ');
        },

        // sumOfBagsPrice(bags) {
        //     let sum = 0;
        //     for (let items in bags) {
        //         sum += (bags[items].prices.price_effective * bags[items].product_quantity);
        //     }
        //     return sum;
        // },

        slaTitle(shipData) {
            if(
                shipData &&
                isEmpty(shipData) && 
                shipData.shipment_status && 
                shipData.shipment_status && 
                shipData.shipment_status.meta &&
                shipData.shipment_status.meta.estimated_sla_time
            ) {
                return shipData.shipment_status.meta.estimated_sla_time;
            } else return '';
        },

        /**
         * Handle navigation to details page
         * 
         * @author: Rushabh Mulraj Shah
         * @param {String} orderId The selected order ID
         * @param {String} shipmentId The selected shipment ID
         * @param {Number} index The index of the selected order
         */

        navigate(orderId, shipmentId, index) {
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
            let orders = cloneDeep(this.shipmentList).map(item => item.order_id);
            /* Removing duplicates */
            orders = new Set(orders);
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
                    shipmentId: shipmentId,
                    shipmentPriority: shipmentId,
                    ...cleansedQuery,
                    ...navigationObj
                }
            })
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
        border-bottom: 1px solid #eeeeee;
        border-radius: 4px;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: @Mako;
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

    .application-css {
        padding-left: 17px;

        .application-logo {
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
}

.common-struct {
    font-weight: 300;
    font-size: 12px;
    line-height: 17px;
}

.shipment-id-main{
    .shipment-id{
        color: @RoyalBlue;
        box-shadow: inset 0 0 0 0 @RoyalBlue;
        margin: 0 -.25rem;
        padding: 0.5px .25rem;
        font-weight: 300;
    }
}

.application-name {
    width: 100%;
}

.order-id {
    width: 149px;
    color: @Mako;
}

.placed-on {
    color: @DustyGray2;
    margin-top: 6px;
}

.payment-method {
    color: @DustyGray2;
    margin-top: 6px;
}

.store-info{
    width: 250px;
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

.drawer-view{
    height: 100%;
    position: fixed;
    top:0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .drawer-container{
        background-color: #FFFFFF;
        position: absolute;
        right: 0px;
        width: calc(100% - 600px);
        height: 100%;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

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
        top: 24px;
        right: 20px;
        cursor: pointer;
    }
}

.bags-item-images {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    margin-right: 30px;

    .item-images {
        position: relative;

        img {
            width: 35px;
            height: 35px;
            border-radius: 4px;
            object-fit: cover;
        }
    }   

    .item-count-overlay{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .count-text{
            font-size: 15px;
            color:#fff;
        }
    }
}

.sla-block{
    min-width:40px;
}

.sla-status{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-right: 20px;

    ::v-deep .indicator-container {
        position: relative;
        width: 25px;
        height: 25px;
        bottom: 4px;
    }

    .sla-time{
        margin-top: 5px;
        font-weight: 400;
        font-size: 12px;
        white-space: nowrap;
        color: #4d4d4e;
    }
}

.tags-container {
    display: flex;
    column-gap: 4px;
    .lock-icon {
        height: 16px;
        width: 16px;
        margin-left: 8px;
    }
}

.css-tags-container {
    display: flex;
    gap: 30px;
}

.tooltip-top{
    display: inline-block;
    position: relative;
    --arrow-size: 6px;
    --arrow-size: 6px;
    &:hover{
        &::after, &::before {
            display: unset;
        }
    }
}

.tooltip-top::before{
    content: attr(data-tooltip);
    position: absolute;
    left: 50%;
    top: -0.35rem;
    transform: translateX(-50%) translateY(calc(-100% - var(--arrow-size)));
    background-color: #333333;
    color: #F9F9F9;
    font-size: 12px;
    z-index: 2;
    padding: 10px;
    border-radius: 0.5rem;
    width: max-content;
    line-height: 15px;
    max-width: 200px;
    display: none;
}
.tooltip-top::after{
    --translate-y: calc(var(--arrow-size) + 2px);
    content: '';
    border: var(--arrow-size) solid transparent;
    position: absolute;
    top: -0.25rem;
    left: 50%;
    transform: translateX(-50%) translateY(calc(-1 * var(--translate-y)));
    border-top-color: #333333;
    display: none;
}

</style>
