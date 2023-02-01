<template>
    <div class="details-shipment-header">
        <div class="title-container">
            <a class="back-btn" @click="navigateToDetails($event)">
                <inline-svg :src="'arrow-nitrozen'" class="details-header-back-arrow"></inline-svg>
            </a>
            <div class="cl-Mako left-align">
                <span class="details-id">{{ order_id }} </span>
                <span class="details-other">
                    ({{ orderShipmentCount }} {{ orderShipmentCount === 1 ? 'shipment' : 'shipments' }}) | {{ orderDate }}
                </span>
            </div>
        </div>

        <div class="action-container">
            <div
                ref="refresh-button" 
                class="refresh-icon-container"
                @click="loadData"
                title="Refresh Shipment Details">
                <inline-svg src="refresh-icon"></inline-svg>
            </div>

            <!-- @NOTE: DO NOT DELETE THIS CODE. It has been commented because it is work in progress. -->
            <!-- <div class="navigation-container">
                <div 
                    class="prev-btn navigation-btn" 
                    @click="getShipment('previous')"
                    :class="{'disabled-navigation-btn': prevDisabled}">
                    <inline-svg :src="'oms-arrow-solid'" />
                    <span class="navigation-text">Previous</span>
                </div>
                <div 
                    class="next-btn navigation-btn" 
                    @click="getShipment('next')"
                    :class="{'disabled-navigation-btn': nextDisabled}">
                    <span class="navigation-text">Next</span> 
                    <inline-svg :src="'oms-arrow-solid'" />
                </div>
            </div> -->

        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';

/* Service imports */
import { LocalStorageService } from '@/services/localstorage.service';


export default {
    name: 'details-header',
    components: {
        UktInlineSvg,
        InlineSvg,
        NitrozenButton
    },

    props: [
        'order_id',
        'orderData',
        'readOnlyMode'
    ],

    data() {
        return {
            activeShipmentIndex: 0,
            nextDisabled: false,
            orderIndex: 0,
            prevDisabled: false,
            showPrevNext: false,
            totalShipments: 0
        }
    },

     mounted() {
        if(this.$route.query.has_previous !== undefined && this.$route.query.has_next !== undefined) {
            this.showPrevNext = true;
            this.prevDisabled = this.$route.query.has_previous.toString() == 'false';
            this.nextDisabled = this.$route.query.has_next.toString() == 'false';
        }

        if(this.$route.query.index) this.orderIndex = this.$route.query.index;

        if(!isEmpty(this.orderData) && this.orderData.shipments) {
            this.totalShipments = this.orderData.shipments.length;
            this.activeShipmentIndex = this.orderData.shipments
            .findIndex(item => item.shipment_id === this.$route.query.shipmentId);

            /** The following code is used for handling the delay in updating routes. */
            if(this.activeShipmentIndex === -1) {
                setTimeout(() => {
                    this.activeShipmentIndex = this.orderData.shipments
                    .findIndex(item => item.shipment_id === this.$route.query.shipmentId);
                }, 1000);
            }
        }
    },

    computed: {
        orderShipmentCount() {
            if(this.orderData) {
                /* @REF: The below code is prone to change - @Rushabh Mulraj Shah */
                // return this.orderData.order.shipment_count;
                return this.orderData.shipments.length;
            }
        },
        orderDate() {
            if(this.orderData) {
                return convertToOMSDate(this.orderData.order.order_date);
            }
        }
    },

    methods: {
        getShipment(direction) {
            let orders = LocalStorageService.getItem('oms-orders');
            let selectedView = this.$route.query.selected_view;

            if(orders && !isEmpty(orders) && selectedView === 'shipment') {
                if(this.activeShipmentIndex < this.totalShipments - 1 && direction === 'next') {
                    /**
                     * If the active shipment index is less than the total,
                     * then we simply need to move to the next shipment ID
                     * */    
                    let nextShipment = this.orderData.shipments[+this.activeShipmentIndex+1];
                    if(nextShipment) {
                        let nextShipmentId = nextShipment.shipment_id;
                        alert(nextShipmentId);
                        this.$emit(
                            'getShipment', 
                            true, 
                            nextShipmentId,
                            orders[this.orderIndex],
                            this.orderIndex
                        );
                    }
                } else if(this.activeShipmentIndex === this.totalShipments - 1 && direction === 'next') {
                    /**
                     * If the active shipment index is equal to the total,
                     * it means this is the last shipment and we need to move to
                     * the next order.
                     */
                    // let upcomingOrderIndex = direction === 'next' ? +this.orderIndex + 1 : +this.orderIndex - 1;
                    if(+this.orderIndex !== orders.length - 1) {
                        let upcomingOrderIndex = +this.orderIndex + 1;
                        let upcomingOrder = orders[upcomingOrderIndex];
                        let message = `You were viewing the last shipment of this order ${orders[this.orderIndex]}. `+ 
                        `Clicking on OK will navigate you to the next order ${upcomingOrder}.`; 
                        if(confirm(message) === true) {
                            this.$emit('getShipment', false, null, upcomingOrder, upcomingOrderIndex);
                        } else return;
                    } else {
                        this.$emit(
                            'getShipment',
                            true,
                            null,
                            null,
                            null
                        );
                    }
                }
            }

            if(selectedView === 'orders' && orders && !isEmpty(orders)) {
                /**
                 * If the direction is next, then we increment the orderIndex or else we decrement it.
                 * This new index is useful to get the next order ID from the data stored in localStorage.
                 * The variable upcomingOrders stores the orderId from the list of orders.
                 */
                let upcomingOrderIndex = direction === 'next' ? +this.orderIndex + 1 : +this.orderIndex - 1;
                let upcomingOrder = orders[upcomingOrderIndex];
                this.$emit('getShipment', false, null, upcomingOrder, upcomingOrderIndex);
            }
        },


        loadData() {
            this.$emit('load');
        },

        navigateToDetails() {
            let updatedQuery = cloneDeep(this.$route.query);
            delete updatedQuery.shipmentId;
            delete updatedQuery.has_previous;
            delete updatedQuery.has_next;

            this.$router.push({
                name: this.readOnlyMode ? 'application-orders-v2': 'company-orders-v2',
                query: {
                    ...updatedQuery
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.details-shipment-header {
    display: flex;
    color: @Iron;
    font-size: 24px;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid @Iron;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    background-color: @White;
    position: fixed;
    width: calc(100% - 250px);
    box-sizing: border-box;
    z-index: 3;

    .title-container,
    .action-container {
        display: flex;
        align-items: center;
    }

    .title-container {
        .back-btn {
            cursor: pointer;

            ::v-deep svg {
                transform: rotate(90deg);
                height: 30px;
                width: 30px;
            }
        }

        .details-id {
            color: #2E31BE;
            font-weight: 500;
            margin-right: 4px;
        }
    }

    .refresh-icon-container {
        cursor: pointer;
    }

    .refresh-icon {
        cursor: pointer;
        margin: 0px 12px;
        ::v-deep svg {
            fill: @RoyalBlue;
            transition: all 0.6s ease;
        }

        &:hover {
            ::v-deep svg {
                transform: rotate(120deg);
            }
        }
    }

    .left-align {
        margin-right: auto;
        margin-bottom: 0px;
        font-size: 1rem;
    }

    .divider{
        font-weight: 100;
    }   
    
    .arrow-button {
        ::v-deep .n-button{
            font-weight: 500;
            font-size: 15px;
        }
        .order-arrow {
            background: white;
            ::v-deep svg {
                width: 18px;
                height: 18px;
                #prefix__Shape {
                    fill: @RoyalBlue;
                }
            }
        }
        &.previous {
            ::v-deep svg {
                transform: rotate(180deg);
                position: relative;
                margin-right: 5px;
            }
        }
        &.next {
            ::v-deep svg {
                position: relative;
                top: -1px;
                margin-left: 5px;
            }
        }
    }
}

.details-header-back-arrow {
    transform: rotate(-90deg);
    height: 20px;
    width: 20px;
    margin-right: 1rem;
}

.navigation-container {
    display: flex;
    align-items: center;
    margin-left: 30px;

    .navigation-btn {
        display: flex;
        align-items: center;
        column-gap: 10px;
        cursor: pointer;

        .navigation-text {
            font-size: 18px;
            line-height: 140%;
            font-weight: 500;
            color: #2E31BE;
        }
    }

    .prev-btn {
        padding-right: 1rem;
        border-right: 1px solid #E5E5E5;
    }

    .next-btn {
        padding-left: 1rem;

        ::v-deep svg {
            transform: rotate(180deg);
        }
    }
}

.disabled-navigation-btn {
    pointer-events: none;
    cursor: not-allowed;

    ::v-deep svg path {
        fill: #9B9B9B;
    }

    .navigation-text {
        color: #9B9B9B !important;
    }
}
</style>
