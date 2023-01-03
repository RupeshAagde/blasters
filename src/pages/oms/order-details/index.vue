<template>
    <div class="details-container">
        <loader v-if="pageLoading" class="shipment-loading"></loader>        
        <template v-if="!pageLoading && !noData">
            <div class="item-navigation">
                <details-header
                    class="navigation-item"
                    v-if="orderData.order"
                    :order_id="orderId"
                    :orderData="orderData"
                    @load="loadData"
                    :readOnlyMode="!!isApplicationLevel"
                    @getShipment="getShipment"
                ></details-header>
            </div>
            <div :class="isCollapseView ? 'collapsed': 'view-content'">
                <div class="main-section">
                    <shipments-list
                        :data="orderData"
                        :shipmentId="activeShipmentId"
                        :readOnlyMode="!!isApplicationLevel"
                        :shipmentProcessing="shipmentProcessing"
                        @statusUpdated="statusUpdateloadData($event)"
                        @updateOrderDetails="updateOrderDetails"
                    ></shipments-list>
                </div>
                <div class="info-section">
                    <info-section
                        :orderData="orderData"
                        @collapseView="collapseView"
                    ></info-section>
                </div>
            </div>
        </template>
        <adm-page-error 
            v-else-if="!pageLoading && noData" 
            :errorText="`We are unable to fetch data for the order with the ID: ${orderId}`"
            @tryAgain="loadData">
        </adm-page-error>
    </div>
</template>

<script>
/* Pacakge imports */
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import AdmPageError from "@/components/common/page-error";
import DetailsInfoSection from '@/pages/oms/order-details/info-section.vue';
import Loader from '@/components/common/loader';
import DetailsHeader from './header.vue';
import UktInlineSvg from '@/components/common/inline-svg.vue';
import ShipmentsList from '@/pages/oms/shipments-list/index.vue'; /** Yet */

/* Service imports */
import OrderService from '@/services/orders.service.js';

/* Service imports */
import { LocalStorageService } from '@/services/localstorage.service';


// Add shipment states to be hopped here
const HOPPED_SHIPMENT_STATES = [
    // "bag_confirmed",
    // "bag_invoiced"
]


export default {
    name: 'order-details',
    components: {
        AdmPageError,
        'info-section': DetailsInfoSection,
        Loader,
        DetailsHeader,
        ShipmentsList,
        UktInlineSvg
    },
    computed: {
        isApplicationLevel() {
            return this.applicationId ? true : false;
        },
        activeShipmentId(){
            // Gets for Active Shipment
            // If Active Shipments has disparity with OrderId data then it loads 1st shipment
            const route_shipment_id = this.$route.query.shipmentId;
            if(this.orderData && this.orderData.shipments && this.orderData.shipments.length && route_shipment_id){
                const found_match = this.orderData.shipments.findIndex(s=>s.shipment_id==route_shipment_id);
                if(found_match!=-1){
                    return route_shipment_id;
                }else{
                    this.updateRouteShipment(this.orderData.shipments[0].shipment_id)
                    return this.orderData.shipments[0].shipment_id;
                }
            }else{
                return route_shipment_id;
            }
        },
        orderDomain() {
            return `https://${getPrimaryDomain(
                this.orderData.domains
            )}`;
        },
    },
    data() {
        return {
            errorText: undefined,
            orderData: {},
            orderId: null,
            pageLoading: false,
            companyId: this.$route.params.company_id,
            applicationId: this.$route.params.applicationId,
            noData: false,
            shipmentProcessing: false,
            isCollapseView: false,
        }
    },

    mounted() {
        this.orderId = this.$route.params.orderId;
        this.loadData();
        this.$root.$on("refreshThePage", (msg) => {
            if(msg == true) {
                this.loadData();
            }
        })
    },

    methods: {
        collapseView() {
            this.isCollapseView = !this.isCollapseView ;
        },

        loadData() {
            this.pageLoading = true;
            const get_order_details_promise = this.isApplicationLevel ? 
                OrderService.fetchApplicationOrderV2Details(
                    this.companyId,
                    this.applicationId,
                    {order_id: this.orderId}
                ) : 
                OrderService.fetchOrderV2Details(
                    this.companyId, 
                    null, 
                    {
                        order_id: this.orderId
                    }
                );


            return get_order_details_promise
            .then(res => {
                let response = res.data;
                // response.shipments[0].can_process = true;  // @todo added this for temporary purpose as this falg is coming false 
                if(response.shipments && response.shipments.length === 0) {
                    this.noData = true;
                } else {
                    this.noData = false;
                    this.orderData = cloneDeep(response);
                }
            })
            .catch(error => {
                this.noData = true;
                console.error("Error in fetching shipment data:   ", error);
                this.$snackbar.global.showError(`Unable to fetch details for the order ID: ${this.orderId}`);
            })
            .finally(() => {
                this.pageLoading = false;
            })
        },
        statusUpdateloadData(old_ship_data=null,count=0){
            // Get counter from top, from update 0 and from recursicve call counter value
            /*
             if counter less than equal to threshold(5)
             Counter ++
             loader true
             GET SHIPMNET DETAILS
             if STAUS IS NOTE PRESETN IN LIST
                    delay of 4 secs
                    REPEAT ABOVE STEP
             else 
                 loader false
                 return 
            */
            let start_status = null;
            if(old_ship_data){
                start_status = old_ship_data.status.status;
            }
            const no_of_retry = 5; // 5cycles
            const delay_in_ms = 4000; // 4sec
            if(count<=no_of_retry){
                this.shipmentProcessing = true;
                count++;
                this.loadData().then(()=>{
                    this.shipmentProcessing = true;
                    // After Getting Shipment
                    const curr_shipment = this.orderData.shipments.find(s=>s.shipment_id==this.activeShipmentId);
                    if(curr_shipment && (HOPPED_SHIPMENT_STATES.includes(curr_shipment.status.status)||curr_shipment.status.status==start_status)){
                        // Falls in Hopped/Auto Processing States
                        setTimeout(()=>this.statusUpdateloadData(null,count),delay_in_ms)
                    }else{
                        this.shipmentProcessing = false;
                    }
                })
            }else{
                // Exceeded Tries
            }
            this.shipmentProcessing = true;
        },
        updateRouteShipment(shipment_id){
            // Updates Shipment Id on Route
            this.$router.replace({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    shipmentId: shipment_id
                }
            }).catch(() => {})
        },

         /**
         * Method to fetch the details of the new data.
         * If the level of change is on the shipment-level, then the new order-data need
         * not be fetched. Otherwise, we need to fetch the data for the new order ID.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Boolean} shipmentLevel A boolean value stating whether the level is shipment-level or order-level
         * @param {String} newShipmentId The new shipment ID for which the data needs to be fetched
         * @param {String} newOrderId The new order ID for which the data needs to be fetched
         * @param {Number} newOrderIndex The index of the current order
         */
        getShipment(shipmentView, newShipmentId, newOrderId, newOrderIndex) {
            let orders = LocalStorageService.getItem('oms-orders');

            if(shipmentView) {
                /* Shipment-level */
                this.updateRouteShipment(newShipmentId);

                /** If it is the last order as per the localStorage */
                if(newOrderIndex === orders.length - 1) {
                    let totalShipments = this.orderData.shipments.length;
                    let activeShipmentIndex = this.orderData.shipments
                    .findIndex(item => item.shipment_id === newShipmentId);
                }
                if(newShipmentId === null && newOrderId === null) {
                    this.$route.query.has_next = false;
                }              
            } else {
                /* Order-level */
                this.orderId = newOrderId;
                this.$route.params.orderId = newOrderId;
                this.$route.query.index = newOrderIndex;
    
                this.$route.query.has_next = newOrderIndex === orders.length - 1 ? false : true;
                this.$route.query.has_previous = newOrderIndex === 0 ? false : true;
            }  

            this.loadData();
        },

        /**
         * Method that is triggered from select-delivery-partner drawer
         * and it should reload/refetch the data.
         * 
         * @author: Rushabh Mulraj Shah
         */
        updateOrderDetails() {
            this.loadData();
        }
    }
}
</script>

<style lang="less" scoped>
.details-container {
    .shipment-loading {
        height: calc(100vh - 128px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .view-content {
        margin-top: 64px;
        height: calc(100vh - 64px - 75px);
        display: grid;
        overflow: hidden;
        grid-template-columns: 70% 30%;
        // transition: all 1s ease-in-out;

        .main-section{
            padding: 24px;
            overflow-y: auto;
        }

        .info-section{
            background: #FFFFFF;
            padding: 24px;
            overflow-y: scroll;
        }
    }


    // transform: rotate(180deg);

    .collapsed{
       grid-template-columns: calc(100% - 70px) 70px;

       ::v-deep .info-section-container{
            display: none;
        }

        ::v-deep .collapsable-arrow{
            transform: rotate(180deg);
        }
        margin-top: 64px;
        height: calc(100vh - 64px - 75px);
        display: grid;
        overflow: hidden;
        // transition: all 1s ease-in-out;

        .main-section{
            padding: 24px;
            overflow-y: auto;
        }

        .info-section{
            background: #FFFFFF;
            padding: 24px;
            overflow-y: scroll;
        }
    }
}
</style>
