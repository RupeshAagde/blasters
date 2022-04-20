<template>
    <div class="quick-view-section" @click="stopClick($event)">
        <div class="order-item-navigation">
            <div class="cl-Mako rightAlign" v-if="!pageLoading && orderData">{{currentIndex+1}}/{{totalShipmentLength}} Shipment</div>
            <div
                ref="refresh-button"
                class="refresh-icon"
                @click="loadData"
                title="Refresh Order Details"
            >
                <inline-svg src="refresh"></inline-svg>
            </div>
            <span class="arrow-button previous">
                <nitrozen-button
                    ref="prev-button"
                    theme="secondary"
                    title="Previous Order"
                    @click="getShipment('previous')"
                    :disabled="prevDisabled"
                >
                    <inline-svg
                        src="arrow-solid"
                        class="order-arrow"
                    ></inline-svg>
                    Previous
                </nitrozen-button>
            </span>
            |
            <span class="arrow-button next">
                <nitrozen-button  
                    ref="next-button" 
                    theme="secondary"
                    title="Next Order"
                    @click="getShipment('next')"
                    :disabled="nextDisabled"
                >
                    Next
                    <inline-svg
                        src="arrow-solid"
                        class="order-arrow"
                    ></inline-svg>
                </nitrozen-button>
            </span>
        </div>
        <div class="header-section">
            <order-card
                v-if="!pageLoading && orderData"
                :order="orderData"
                :orderDomain="orderDomain"
                @call="clickToCall($event)"
                :isDrawerView='true'
            >
                <template slot="action-button">
                    <div
                        ref="navigation"
                        class="header-icon"
                        title="View Order Details"
                        @click="naivgateToOrder($event, shipment_id)"
                    >
                        <ukt-inline-svg src="open-new-tab"></ukt-inline-svg>
                    </div>
                </template>
            </order-card>
        </div>
        <loader v-if="pageLoading" class="shipment-loading"></loader>

        <shipment
            ref="shipment"
            v-if="!pageLoading && orderData"
            :shipment="activeShipment"
            :orderId="orderData.id"
            :user="orderData.user"
            :deliveryAddress="orderData.delivery_address"
            :applicationId="orderData.application.id"
            :validActions="activeShipment.can_break"
            :currentStateShipmentCount='1'
            :showConfirm="isNew"
            :isDrawerView='true'
            @call="clickToCall($event)"
            @update="updateShipment"
            :readOnlyMode="readOnlyMode"
        >
            <loader v-if="inProgress" class="shipment-loading"></loader>
        </shipment>

        <adm-page-error 
            v-if="!pageLoading && !orderData" 
            :errorText="errorText"
            @tryAgain="loadData">
        </adm-page-error>
<!-- 
        <click-to-call-dialog
            ref="clickToCallDialog"
            @close="$clickToCallDialogClosed"
        >
        </click-to-call-dialog> -->
    </div>
    
</template>

<style lang="less" scoped>
.order-item-navigation {
    display: flex;
    color: @Iron;
    font-size: 24px;
    align-items: center;
    justify-content: flex-end;
    padding-top: 16px;
    padding-bottom: 16px;
    .rightAlign {
        margin-right: auto;
        margin-bottom: 0px;
        font-size: 1rem;
        font-weight: bold;
    }
    .arrow-button {
        .order-arrow {
            background: white;
            ::v-deep svg {
                width: 36px;
                height: 36px;
                #prefix__Shape {
                    fill: @RoyalBlue;
                }
            }
        }
        &.previous {
            ::v-deep svg {
                transform: rotate(180deg);
                position: relative;
                top: 2px;
            }
        }
        &.next {
            ::v-deep svg {
                position: relative;
                top: -1px;
            }
        }
    }
    
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

.quick-view-section {
    margin: 20px 20px;
    .title {
        font-weight: bold;
        font-size: 16px;
    }
    .header-section{
        margin-bottom: 10px;
        @media @mobile {
            padding-left: 6px;
        }
    }
    .order-id-value{
        cursor: pointer;
        padding-left: 4px;
        @media @mobile {
            padding-left: 0px;
        }
    }
    .header-icon{
        cursor: pointer;
        padding-left: 4px;
        @media @mobile {
            padding-left: 0px;
        }
    }
}
</style>

<script>
import { mapGetters } from 'vuex';
// import {
//     GET_COMPANY_APPLICATIONS,
//     GET_EMPLOYEE_ACCESS_DETAIL,
// } from '@/store/getters.type';
import { getPrimaryDomain } from '@/helper/domains.util';
import { strokeBtn, NitrozenButton } from '@gofynd/nitrozen-vue';
import OrderService from '@/services/orders.service';
import loader from '@/components/common/loader';
import moment from 'moment';
import keys from 'lodash/keys';
// import find from 'lodash/find';
import shipment from "./shipment.vue";
import ordercard from './order-card.vue';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmPageError from "@/components/common/page-error"
import { copyToClipboard } from '@/helper/utils.js';
// import ClickToCallDialog from '@/components/common/tools/click-to-call-dialog.vue';

export default {
    name: 'shipment-detail-drawer',
    components: {
        loader,
        shipment,
        AdmPageError,
        InlineSvg,
        // ClickToCallDialog,
        UktInlineSvg,
        "order-card": ordercard,
        NitrozenButton,
        'nitrozen-button': NitrozenButton,
    },
    directives: {
        strokeBtn
    },
    props: {
        order_id:{
            type: String,
            default: "",
            required: true
        },
        shipment_id:{
            type: String,
            default: "",
            required: true
        },
        readOnlyMode: {
            type: Boolean,
            default: false,
        }

    },
    mounted(){
        this.loadData();
    },
    created() {
        document.addEventListener('keydown', this.detectKeyboardNavigation);
    },
    beforeDestroy: function () {
        document.removeEventListener('keydown', this.detectKeyboardNavigation);
    },
    data() {
        return {
            errorText: undefined,
            pageLoading: false,
            inProgress: false,
            orderData: null,
            nextDisabled: false,
            prevDisabled: false,
            currentIndex: 0,
            isNew: false,
            totalShipmentLength: 0,
            activeShipment: null,
            status:""
        };
    },
    computed: {
        ...mapGetters({
           // companyApplications: GET_COMPANY_APPLICATIONS,
           // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
        }),
        orderApplication() {
            // if (this.orderData) {
            //     return find(this.companyApplications, {
            //         id: this.orderData.application.id,
            //     });
            // }
            return;
        },
        orderDomain() {
            if (this.orderApplication) {
                return `https://${getPrimaryDomain(
                    this.orderApplication.domains
                )}`;
            }
        },
    },
    methods: {
        loadData() {
            if(this.status === "bag_not_confirmed"){
                this.getOrder("0")
            }else{
                this.getOrder(this.currentIndex);
            } 
        },

        naivgateToOrder(event, shipment_id='') {
            event.preventDefault();
            event.stopPropagation();
            let path = this.getShipmentLink(shipment_id);
            let routeData = this.$router.resolve({ path, query: { ...this.$route.query } });
            window.open(routeData.href, '_blank')
        },
        getShipmentLink(shipment_id = '') {
            let link = `${this.$basePath}/order/${this.order_id}/shipments`;
            if (shipment_id) {
                link = `${link}?shipment_id=${shipment_id}`;
            }
            return link;
        },

        stopClick(event){
            event.stopPropagation()
        },

        copyURLToClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },

        getSingleShipment(index){
            if(this.totalShipmentLength == 1){
                this.nextDisabled = true;
                this.prevDisabled = true;
            }

            if(this.orderData.shipments) {
                this.activeShipment = this.orderData.shipments[index];
            }
            // this.activeShipment = this.orderData?.shipments[index];
            // this.isNew = ["placed","store_reassigned"].includes(this.activeShipment.status.current_shipment_status);
            // if(this.$refs.shipment && this.$refs.shipment.selectedBags){
            //     this.$refs.shipment.selectedBags = new Array(this.activeShipment.bags.length).fill(true)
            // }
        },

        clickToCall({ receiver, title }) {
            this.$refs.clickToCallDialog.open({ receiver, title });
        },

        $clickToCallDialogClosed(reason) {
            if (reason == 'success') {
                console.log(reason);
            }
        },

        getOrder(index) {
            this.pageLoading = true;         
            let params = {
                order_id: this.order_id,
            };
            OrderService.fetchOrderDetails(params)
                .then(({ data }) => {
                    this.pageError = false;
                    this.errorText = undefined;
                    if (data.items && data.items.length) {   
                        this.orderData = data.items[0];
                        this.orderData.shipments = this.orderData.shipments.map(
                            (shipment) => {
                                shipment.orderDomain = this.orderDomain;
                                shipment.order = {
                                    delivery_address: this.orderData
                                        .delivery_address,
                                    channel: this.orderData.channel,
                                    created_time: moment(
                                        this.orderData.created_at
                                    ).format('LT, MMM Do, YY'),
                                    order_id: this.orderData.id,
                                };
                                if (this.orderData.tax_details) {
                                    shipment.order.tax_details = this.orderData.tax_details;
                                }
                                return shipment;
                            }
                        );
                        this.totalShipmentLength = this.orderData.shipments.length;

                        if(index !== undefined) {
                            this.currentIndex = parseInt(index);
                        } else {
                            this.currentIndex = this.orderData.shipments.findIndex((shipment) => shipment.id == this.shipment_id);
                        }

                        if(this.currentIndex === 0){
                            this.prevDisabled = true;
                        }
                        if(this.currentIndex === this.totalShipmentLength-1){
                            this.nextDisabled = true;
                        }
                        this.getSingleShipment(this.currentIndex)
                    } else {
                        throw new Error({response:{data:"order not found"}})
                    }
                })
                .catch((err) => {
                    // if (
                    //     err?.response?.data?.message
                    // ) {
                    //     this.errorText = err.response.data.message;
                    // }
                    this.pageError = true;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },

        getShipment(direction){
            let tempArray = new Array(this.totalShipmentLength).fill("test")
            let tempIndex = this.currentIndex
            if(direction === 'next'){
                this.pageLoading = true
                this.prevDisabled = false;
                if(tempArray[tempIndex+1]){
                    this.currentIndex = this.currentIndex + 1;
                    if(!tempArray[tempIndex+2]){
                        this.nextDisabled = true
                    }
                    setTimeout(() => {
                        this.pageLoading = false
                        this.getSingleShipment(this.currentIndex);
                    },100)
                }  
            }else{ 
                this.nextDisabled = false;
                this.pageLoading = true
                if(tempArray[tempIndex-1]){
                    this.currentIndex = this.currentIndex - 1;
                    if(!tempArray[tempIndex-2]){
                        this.prevDisabled = true
                    }
                    setTimeout(() => {
                        this.pageLoading = false
                        this.getSingleShipment(this.currentIndex);
                    },100)
                    
                }  
            }
        },

        detectKeyboardNavigation(event) {
            if (event.keyCode == 37) {
                //left arrow key
                event.preventDefault();
                event.stopPropagation();
                if(!this.prevDisabled)
                    this.getShipment('previous');
            }
            if (event.keyCode == 39) {
                //right arrow key
                event.preventDefault();
                event.stopPropagation();
                if(!this.nextDisabled)
                    this.getShipment('next');
            }
        },

        updateShipment(shipments, nextStatus) {
            const payload = {
                shipments,
                force_transition: false,
                task: false,
            };

            this.inProgress = true;
            OrderService.updateShipmentStatus(payload)
                .then(({ data }) => {
                    const processShipmentPayload = {
                        shipment_ids: keys(shipments),
                        expected_status: nextStatus,
                    };
                    if (
                        data.error_shipments &&
                        data.error_shipments.length == 0
                    ) {
                        this.inProgress = true;
                        OrderService.processShipments(processShipmentPayload)
                            .then((ps_response) => {
                                // this.inProgress = false;
                                this.$snackbar.global.showSuccess(
                                    `Shipments status updated successfully it might get sometime.`,
                                    {
                                        duration: 2000,
                                    }
                                );
                                setTimeout(() => {
                                    this.inProgress = false;
                                });
                                setTimeout(() => {
                                    this.isStatusChange = true;
                                    if(nextStatus === 'bag_not_confirmed'){
                                        this.getOrder("0");
                                        this.status = "bag_not_confirmed"
                                    }else{
                                        this.getOrder();
                                    }
                                    
                                }, 1000);
                            })
                            .catch((err) => {
                                this.inProgress = false;
                                this.$snackbar.global.showError(
                                    'Unable to update status'
                                );
                                console.error(err);
                            });
                    } else {
                        console.error('error in status update', data);
                        this.inProgress = false;
                        this.$snackbar.global.showError(
                            'ERROR: ' + data.message
                        );
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.inProgress = false;
                    this.$snackbar.global.showError('Unable to update status');
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },

    }
};
</script>
