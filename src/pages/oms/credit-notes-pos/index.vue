<template>
    <div>
        <div class="loader-container">
            <shimmer v-if="showShimmer" :count="4"></shimmer>
        </div>
        <div v-if="!showShimmer">
            <return-side-panel 
                ref="return-side-panel"
                v-if="showReturnPanel"
                :shipment="shipment" 
                :bagStatus="bagStatus"
                :isUserRegistered="isUserRegistered"
                @closeDrawer="closeReturnPanel" 
                @openRefundModeDrawer="openRefundDrawer"
                @isVerified="isVerified"
                @updateStatusOfFooter="updateStatusOfFooter"
                @isHide="isHide"
                @updateOrder="callOrderDetails">
            </return-side-panel>
        </div>
    </div>
</template>
<script>
/* Package imports */
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';

/* Component imports */
import cloneDeep from 'lodash/cloneDeep';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import OrderService from '@/services/orders.service';
import Shimmer from '@/components/common/shimmer';
import returnSidePanel from '../credit-notes-pos/return-side-panel.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';

export default {
    name: 'return-journey-panel',
    components: {
        NitrozenButton,
        SideDrawer,
        UktInlineSvg,
        Shimmer,
        returnSidePanel,
        NitrozenDialog,
        AdmInlineSvg
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    props: {
        status: {
            type: String
        },
        returnPanel: {
            type: Boolean
        }
    },
    data() {
        return {
            showItemsToReturn:true,
            step:1,
            showConfirmationSummary: false,
            refundModeData: {},
            selectedProducts: [],
            inProgress:true,
            orderData: {},
            isUserRegistered: false,
            shipment:null,
            orderDetails:{},
            bagStatus:this.status,
            showReturnPanel:true,
            showShimmer: true
        };
    },
    mounted(){
        this.getShipmentDetails();
    },
    methods: {
        isHide(e) {
            this.$emit('isHide', e)
        },
        isVerified(e) {
            this.$emit('isVerified', e)
        },
        updateStatusOfFooter(e) {
            this.$emit('updateStatusOfFooter', e)
        },
        ProceedBtn() {
            this.$refs['return-side-panel'].ProceedBtn();
        },
        registerUser() {
            this.$refs['return-side-panel'].registerUser();
        },
        openRefundDrawer(e) {
            this.$emit('openRefundDrawer', e);
        },
        closeReturnPanel() {
            this.$emit('closeReturnPanel', true);
        },
        callOrderDetails() {
            this.$emit('callOrderDetails', false);
        },
        closeDialog() {
            this.$refs["refund-dialog"].close();
        },
        getShipmentDetails() {
            const get_order_details_promise = this.isApplicationLevel ? 
                OrderService.fetchApplicationOrderV2Details(
                    this.$route.params.company_id,
                    this.$route.params.applicationId,
                    {order_id: this.$route.params.orderId}
                ) :
                OrderService.fetchOrderV2Details(
                    this.$route.params.company_id, 
                    null, 
                    {
                        order_id: this.$route.params.orderId
                    }
                );

            return get_order_details_promise
            .then(res => {
                if(res){
                let response = res.data;
                this.orderDetails=cloneDeep(response);
                this.shipment =this.orderDetails.shipments.find(shipment => shipment.shipment_id === this.$route.query.shipmentId);
                if(this.shipment && this.shipment.user){
                        this.isUserRegistered=this.shipment.user.mobile ? true : false;
                    }
                }
                this.showShimmer = false;
            })
            .catch(error => {
                console.error("Error in fetching shipment data:   ", error);
                this.$snackbar.global.showError(`Unable to fetch details for the order ID: ${this.$route.params.orderId}`);
            })
        },
    }

}
</script>

<style scoped lang="less">
.refund-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    margin-bottom: 10px;
    .warn-icon {
        width: 34px;
    }
    .refund-question {
        font-weight: 600;
        font-size: 14px;
        line-height: 130%;
        color: #41434C;
    }
}
.refund-bottom {
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    .refund-first-line {
        font-weight: 600;
        font-size: 12px;
        line-height: 130%;
        color: #5C5C5C;
    }
}
::v-deep .nitrozen-dialog {
    border-radius: 8px;
}
.back-btn {
    cursor: pointer;

    ::v-deep svg {
        transform: rotate(90deg);
        height: 30px;
        width: 30px;
    }
}
.details-header-back-arrow {
    transform: rotate(-90deg);
    height: 20px;
    width: 20px;
    margin-right: 1rem;
}
.refund-mode-selection-drawer {
    ::v-deep .slide-fade {
        .sidedrawer-container {
            .sidedrawer-header{
                display: flex;
                flex-direction: row-reverse;
                justify-content: flex-end;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid #E0E0E0;
                .sidedrawer-header-title {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
            }
        }
    }
}
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .progress{
        font-weight: 700;
        font-size: 14px;
        color: #000000;
    }
}
::v-deep .sidedrawer-content{
    @media @mobile{
        padding-bottom: 24px;
    }
}
.footer-container.confirmation-summary-footer{
        justify-content: end;
    }

</style>