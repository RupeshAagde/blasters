<template>
    <div class="return-side-panel cn-return-drawer">
        <div class="heading-wrapper">
            <div class="item-count" v-if="showItemsToReturn && shipment && shipment.bags && shipment.bags.length">Number of Item: {{ shipment.bags.length }}</div>
            <div class="item-count" v-if="!showItemsToReturn && !shipment.user.mobile && shipment.status.status == 'handed_over_to_customer'">Add customer details</div>
            <div class="item-count contact" v-if="shipment && shipment.user && shipment.user.mobile">Contact number: {{ shipment.user.mobile?shipment.user.mobile:'' }}
                <div class="contact-badge">
                    <div v-if="!shipment.user.mobile && shipment.status.status == 'handed_over_to_customer'" class="badge error-state">
                        Unregistered
                    </div>
                    <div v-if="shipment.user.mobile" class="badge success-state">
                        Registered
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showItemsToReturn">
            <items-to-return :returnItems="shipment.bags" :shipment="shipment" @selectedItems="selectedItems($event)"></items-to-return>
        </div>
        <div v-if="!showItemsToReturn && !shipment.user.mobile && shipment.status.status == 'handed_over_to_customer'">
            <register-user @getCustomerData="getCustomerData($event)"
            @getFirstName="getFirstName($event)"
            @getLastName="getLastName($event)"
            :errorMsg="errorMsg"
            ></register-user>
        </div>
    </div>
</template>
<script>
/* Package imports */
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import itemsToReturn from './items-to-return.vue';
import registerUser from './register-user.vue';
import OrderService from '@/services/orders.service';

export default {
    name: 'return-side-panel',
    components: {
        itemsToReturn,
        NitrozenButton,
        SideDrawer,
        UktInlineSvg,
        registerUser
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    props: {
        shipment: {
            type: Object,
        },
        bagStatus: {
            type: String
        }
    },
    data() {
        return {
            returnTitle:'Select items to return',
            showItemsToReturn:true,
            dataTopass:[],
            verifiedUser:false,
            userData:null,
            firstName:'',
            lastName:'',
            errorMsg:false,
            step:1,
            isUserRegistered: true,
            enableBtn: false,
            hide:true
        };
    },
    mounted(){
        if(this.shipment && this.shipment.user){
            this.isUserRegistered=this.shipment.user.mobile;
        }
    },
    watch:{
        dataTopass(){
            this.disableBtn();
        }
    },
    methods: {
        closeReturnPanel(){
            this.$emit('closeDrawer');
        },
        disableBtn(){
            if(this.dataTopass.length==0){
                this.hide = true;
                this.$emit('isHide', this.hide)
                return this.hide;
            }
            else if(!this.enableBtn){
                this.hide = true;
                this.$emit('isHide', this.hide)
                return this.hide;
            }
            else{
                this.hide = false;
                this.$emit('isHide', this.hide)
                return this.hide;
            }
        },
        getCustomerData(data){
            this.userData=data;
            this.verifiedUser=data.verified;
            this.$emit('isVerified', this.verifiedUser)
        },
        getFirstName(data){
            this.firstName=data;
        },
        getLastName(data){
            this.lastName=data;
        },
        ProceedBtn(){
            this.step=++this.step;
            this.showItemsToReturn=false;
            this.returnTitle='Register Customer';
            this.$emit('updateStatusOfFooter', {step: this.step, showItemsToReturn: this.showItemsToReturn});
            if(!this.showItemsToReturn){
                this.$emit('openRefundModeDrawer', { data: this.dataTopass, status: this.bagStatus });
            }
        },
        registerUser(){
            if(this.firstName==''){
                return this.errorMsg=true;
            }
            if(this.verifiedUser && this.firstName){
                const userData={
                    otp_data:{
                        request_id: this.userData.request_id
                    },
                    user_info:{
                        mobile: this.userData.mobile,
                        first_name: this.firstName,
                        last_name: this.lastName
                    },
                    fynd_order_id: this.$route.params.orderId
                }
                OrderService.createUser(userData)
                .then((data)=>{
                    this.step=++this.step;
                    this.$emit('updateStatusOfFooter', {step: this.step, showItemsToReturn: this.showItemsToReturn})
                    this.$emit('updateOrder', false);
                    this.$emit('openRefundModeDrawer', { data: this.dataTopass, status: this.bagStatus });
                }
                )
                .catch((err) => {
                    console.log(err);
                    this.$snackbar.global.showError('Failed to register user');
                })
            }
        },
        selectedItems(item){
            if(item.length){
                this.dataTopass=item;
                for (let quantity = 0; quantity < this.dataTopass.length; quantity++) {
                    if (this.dataTopass[quantity].quantity == 0) {
                        return this.enableBtn=false;
                    }
                }
            }
            else{
                this.dataTopass=[];
            }
            return this.enableBtn=true;
        },
    }

}
</script>

<style scoped lang="less">
.return-side-panel {
    padding-top: 24px;
}

.heading-wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media @mobile{
        display: block;
    }
}
.item-count{
    font-weight: 600;
    font-size: 16px;
    ::v-deep .sidedrawer-content{
        @media @mobile{
        padding-bottom: 24px;
        }
    }
}
@media @mobile{
    .contact{
        margin-top: 8px;
    }
}
.contact-badge{
    display: inline-block;

    .badge{
        display: inline-block;
        border-radius: 4px;
        padding: 6px 9px;
        font-weight: 600;
        font-size: 14px;
    }
    .error-state{
        background: #FDEDED;
        color: #CD0909;
    }
    .success-state{
        color: #0A5F23;
        background: #E3F2E9;
    }

    .item-detail-wrapper{
        border: 1px solid #E0E0E0;
        border-radius: 12px;
        margin-top: 16px;
        padding: 24px;
    }
}
.footer-container{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .progress{
        font-weight: 700;
        font-size: 14px;
        color: #000;
    }
</style>
