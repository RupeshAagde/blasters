<template>
<div class="container">
    <div class="inProgress" v-if="updateInProgress">
        <loader></loader>
    </div>
    <div class="shipment-table-container">
        <shipment-table
            v-if="refinedData.length"
            class="container-shipment-table"
            :activeId="activeShipmentId"
            :columns="tableColumns"
            :items="refinedData"
            :readOnlyMode="readOnlyMode"
            :shipmentProcessing="shipmentProcessing"
            @changeShipment="changeActiveShipment"
            @displayConfirmScreen="displayConfirmScreen"
            @updateStatus="updateStatus"
            @updateOrderDetails="() => $emit('updateOrderDetails')"
            @statusUpdated="$emit('statusUpdated', activeShipment)"
        ></shipment-table>

        <transition name="slide">
            <template v-if="showConfirmScreen">
                <div class="slide-fade" ref="slide-fade" >
                    <div class="container">
                        <confirm-cancel-drawer
                            class="container-in"
                            :cancel="orderCancellation"
                            @close="close($event)"
                            :shipmentId="activeShipmentId"
                            :bags="activeShipmentBags"
                            @updateStatus="updateStatus"
                        ></confirm-cancel-drawer>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import {
   NitrozenInput,
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn 
} from '@gofynd/nitrozen-vue';

/* Component imports */
import ShipmentTable from './table.vue'; /** Yet */
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import ConfirmCancelDrawer from '@/pages/oms/confirm-cancel-drawer/index.vue';
import Loader from '@/components/common/loader.vue';

/* Service imports */
import OrderService from '@/services/orders.service.js';

const SHIPMENT_TABLE_COLUMNS = [
    {
        value: 'shipment_id',
        text: 'Shipment ID',
    },
    {
        value: 'shipment_price',
        text: 'Price',
    },
    {
        value: 'no_of_items',
        text: 'Items',
    },
    {
        value: 'shipment_status',
        text: 'Status',
    },
    {
        value: 'actions',
        text: 'Actions',
    },
    {
        value: '',
        text: ''
    }
];



export default {
    name: 'shipment-items',
    components: {
        'confirm-cancel-drawer': ConfirmCancelDrawer,
        'loader': Loader,
        NitrozenInput,
        NitrozenButton,
        NitrozenDialog,
        ShipmentTable,
        UktInlineSvg
    },
    props: {
        data: Array,
        activeId: String,
        readOnlyMode: {
            type: Boolean,
            default: false
        },
        shipmentProcessing:{
            type: Boolean,
            default: false
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        if(this.data && this.data.length > 0) {
            this.refineData(this.data);
        }
        
        if(!this.activeId && this.data) {
            this.activeShipmentId = this.data[0].shipment_id;
            this.$router.replace({
                query: {
                    shipmentId: this.data[0].shipment_id
                }
            })
        } else {
            this.activeShipmentId = this.activeId;
        }
    },
    data() {
        return {
            tableColumns: cloneDeep(SHIPMENT_TABLE_COLUMNS),
            refinedData: [],
            activeShipmentId: null,
            showConfirmScreen: false,
            orderCancellation: false,
            updateInProgress: false
        }
    },
    computed: {
        activeShipment() {
            let _activeShipment = this.refinedData.find(shipment => {
                return shipment.shipment_id === this.activeShipmentId;
            });
            return _activeShipment;
        },
        activeShipmentBags() {
            return this.activeShipment.bags;
        }
    },
    methods: {
        refineData(data) {
            let _data = cloneDeep(data);

            // Handles Pulling up selected shipment if come from Listing page
            if(this.$route.query.shipmentPriority){
                
                if(_data && _data.length>1){
                    // Find Index of shipment to be pulled up
                    let active_index = _data.findIndex(s=>s.shipment_id===this.$route.query.shipmentPriority);
                    
                    // If Index found then rearrange the data-set
                    if(active_index!=-1){
                        active_index = _data.splice(active_index,1);
                        _data = [...active_index,..._data]
                    }
                }

                // Remove Route Shipment PullUp helper quer param
                let _query = {...this.$route.query};
                delete _query.shipmentPriority;
                this.$router.replace({query: _query}).catch(() => {});

            }
            this.refinedData = _data;
        },

        changeActiveShipment(id) {
            this.activeShipmentId = id;

            this.$router.replace({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    shipmentId: id
                }
            }).catch(() => {})
        },
        displayConfirmScreen(event) {
            this.showConfirmScreen = true;
            if(event.cancel) this.orderCancellation = true;
            else this.orderCancellation = false;
        },
        close(e) {
            this.activeShipmentBags.forEach(bag => bag.reasons = []);
            this.showConfirmScreen = false;
        },
        updateStatus(payload) {
            this.updateInProgress = true;
            OrderService.updateShipmentStatus(payload)
            .then(response => {
                if(response.data && response.data.statuses && response.data.statuses.length) {
                    let statusResponse = response.data.statuses[0].shipments[0];
                    if(statusResponse.status === 200) {
                        this.$emit('statusUpdated', this.activeShipment);
                        if(this.showConfirmScreen) {
                            this.showConfirmScreen = false;
                        }
                        this.updateInProgress = false;
                        this.$snackbar.global.showSuccess(
                            `Shipment ID: ${this.activeShipmentId} has been successfully updated.`,
                            {
                                duration: 3000
                            }
                        );
                    } else {
                        this.updateInProgress = false;
                        if(statusResponse.message){
                            this.$snackbar.global.showError(statusResponse.message);
                        } else {
                            this.$snackbar.global.showError('Failed to update the shipment status');
                        }
                        console.error("Failed to update the shipment status:   ", response.data.statuses[0].shipments[0])
                    }
                }

                /**
                 * 26/11/2022 16:14
                 * The following code is the actual method of handling data responses.
                 * Due to backend changes, this method has been commented out in favor
                 * of the new response structure.
                 * 
                 * Based on the future decisions, the following code will be uncommented
                 * or deleted.
                 * - Rushabh Mulraj Shah
                 */
                // if(response.data.status === true) {
                //     this.$emit('statusUpdated',this.activeShipment);
                //     if(this.showConfirmScreen) {
                //         this.showConfirmScreen = false;
                //     }
                //     this.updateInProgress = false;
                //     this.$snackbar.global.showSuccess(
                //         `Shipment ID: ${this.activeShipmentId} has been successfully updated.`,
                //         {
                //             duration: 3000
                //         }
                //     );
                // } else {
                //     this.updateInProgress = false;
                //     this.$snackbar.global.showError('Unable to update the shipment status');
                // }
            })
            .catch(error => {
                console.error("Error in updating the status:   ", error);
                this.$snackbar.global.showError(
                    `Unable to update the status of the shipment with the ID: ${this.activeShipmentId}.`, 
                    {
                        duration: 2000
                    }
                );
            })
        }
    }
}
</script>

<style lang="less" scoped>
.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .container {
        position: absolute;
        right: 0px;
        width: 60%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        overflow-x: hidden;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        
        &::-webkit-scrollbar {
            display: none;
        }

        @media @mobile {
            position: fixed;
            width: 100%;
        }

        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            margin: 13px 10px 0px 0px;
            cursor: pointer;
        }
    }
}

.inProgress {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
</style>
