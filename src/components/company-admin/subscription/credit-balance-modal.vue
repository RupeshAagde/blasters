<template>
    <nitrozen-dialog class="credit-dialog" ref="credit-balance-dialog" title="Credit adjustment" @close="closeModal">
        <template slot="body">
            <div class="m-b-24 body-container" v-if="creditAdjustment">
                <div class="m-b-12">
                    <nitrozen-dropdown
                        label="Transaction type *"
                        class="input-field"
                        placeholder="Select transaction type"
                        :items="transactionTypes"
                        v-model="creditAdjustment.transactionType"
                        @change="onTransactionTypeSelect"
                    ></nitrozen-dropdown>
                </div>
                <div class="credit-adjust width-100" v-if="creditAdjustment.transactionType">
                    <div class="m-b-12">
                        <nitrozen-input
                            @input="clearError('creditAdjustment.amount')"
                            label="Amount *"
                            type="number"
                            v-model="creditAdjustment.amount.value"
                            @keydown.native="onCreditAdjustAmountChange"
                        ></nitrozen-input>
                        <nitrozen-error v-if="creditAdjustment.amount.error">{{creditAdjustment.amount.error}}</nitrozen-error>
                    </div>
                    <div class="m-b-12">
                        <nitrozen-input
                            @input="clearError('creditAdjustment.description')"
                            label="Description *"
                            type="text"
                            v-model="creditAdjustment.description.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="creditAdjustment.description.error">{{creditAdjustment.description.error}}</nitrozen-error>
                    </div>
                    <div class="m-b-24" v-if="creditAdjustment.transactionType">
                        <nitrozen-input
                            @input="clearError('creditAdjustment.unique_transaction_reference')"
                            label="Unique Transaction Reference(UTR)"
                            type="text"
                            v-model="creditAdjustment.unique_transaction_reference.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="creditAdjustment.unique_transaction_reference.error">{{creditAdjustment.unique_transaction_reference.error}}</nitrozen-error>
                    </div>
                    <div class="m-b-24" v-if="creditAdjustment.transactionType">
                        <date-picker
                            @change="clearError('creditAdjustment.receipt_date')"
                            :label="datePickerLabel"
                            :useNitrozenTheme="true"
                            :date_format="
                                'YYYY-MM-DD'
                            "
                            :picker_type="'date'"
                            v-model="creditAdjustment.receipt_date.value"
                            :not_before="
                                new Date(0).toISOString()
                            "
                            :not_after="
                                new Date().toISOString()
                            "
                            :placeholder="
                                getUTRDatePlaceholder
                            "
                        />
                        <nitrozen-error v-if="creditAdjustment.receipt_date.error">{{creditAdjustment.receipt_date.error}}</nitrozen-error>
                    </div>
                    <div class="flex gap-12 btn-container" v-if="creditAdjustment.transactionType">
                        <nitrozen-button
                            class="flex-1 adjust-credit-btn"
                            :class="{'charge-amount-btn':creditAdjustment.transactionType == 'adjustment'}"
                            :theme="'secondary'"
                            v-strokeBtn
                            @click="makeCreditAdjustment(creditAdjustment.transactionType)"
                        >{{getBtnText}}</nitrozen-button>
                    </div>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import { NitrozenDialog, NitrozenDropdown } from '@gofynd/nitrozen-vue';
import moment from 'moment';
import BillingSubscriptionService from '../../../services/billing.service';
import datePicker from '../../common/date-picker.vue';
import {
    NitrozenButton,
    NitrozenError,
    NitrozenInput,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import set from 'lodash/set';
export default {
    name: 'credit-balance-modal',
    components:{
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error':NitrozenError,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'date-picker': datePicker,

    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        
    },
    computed:{
        getUTRDatePlaceholder(){
            let map = {
                "top_up":"Enter date of payment received",
                "adjustment":"Enter date of payment refund",
            }
            return map[this.creditAdjustment.transactionType]
        },
        getBtnText(){
            let map = {
                top_up: "Topup Amount",
                adjustment: "Make adjustment",
            }
            return map[this.creditAdjustment.transactionType]
        },
        datePickerLabel(){
            let map = {
                top_up: "Date of payment received*",
                adjustment: "Date of payment refund",
            }
            return map[this.creditAdjustment.transactionType]
        }
    },
    data(){
        return {
            companyId: this.$route.params.companyId,
            transactionTypes:[{
                text: "Topup",
                value: "top_up"
            },{
                text: "Make adjustment",
                value: "adjustment"
            }],
            creditAdjustment: null
        }
    },
    mounted(){
        this.initForm()
    },
    methods:{
        clearError(path){
            set(this,`${path}.error`,"")
        },
        initForm(){
            this.creditAdjustment = {
                transactionType:null,
                amount: {
                    value: 0,
                    error: ""
                },
                currency: "INR",
                unique_transaction_reference: {
                    value: "",
                    error: ""
                },
                receipt_date: {
                    value: "",
                    error: ""
                },
                description: {
                    value: "",
                    error: ""
                },
                receipt_date:{
                    value: "",
                    error: ""
                }
            }
        },
        onTransactionTypeSelect(value){
            this.creditAdjustment.transactionType = value
        },
        open(){
            this.$refs["credit-balance-dialog"].open({
                showCloseButton: true,
                positiveButtonLabel: false,
                negativeButtonLabel: false,
                neutralButtonLabel: false,
                width: '600px'
            });
        },
        closeModal(e){
            this.initForm()
            this.$emit('closeCreditBalanceModal', e);
        },
        validateCreditAdjustment(){
            let isValid = true
            if(this.creditAdjustment.amount.value == 0){
                isValid = false
                this.creditAdjustment.amount.error = "Should be greater than 0"
            }
            else if(!this.creditAdjustment.amount.value){
                isValid = false
                this.creditAdjustment.amount.error = "Required Field"
            }
            else{
                this.creditAdjustment.amount.error = ""
            }
            if(!this.creditAdjustment.description.value){
                isValid = false
                this.creditAdjustment.description.error = "Required Field"
            }
            else{
                this.creditAdjustment.description.error = ""
            }

            if(this.creditAdjustment.transactionType == "top_up" && !this.creditAdjustment.receipt_date.value){
                this.creditAdjustment.receipt_date.error = "Required Field"
            }
            else{
                this.creditAdjustment.receipt_date.error = ""
            }

            return isValid
        },
        makeCreditAdjustment(transaction_type){
            if(this.validateCreditAdjustment()){
                let reqBody = {
                    "amount":this.creditAdjustment.amount.value,
                    "currency":this.creditAdjustment.currency,
                    "description":this.creditAdjustment.description.value,
                    "type":transaction_type,
                    "transaction_type":transaction_type == "top_up" ? "credit" : "debit",
                    "payment":{
                        "receipt_date": this.creditAdjustment.receipt_date.value,
                        "unique_transaction_reference":this.creditAdjustment.unique_transaction_reference.value
                    }
                }
                return BillingSubscriptionService.creditAdjustment({
                        unique_id: this.companyId,
                        product_suite: 'fynd-platform',
                        type: 'company'
                    },reqBody)
                .then(({data})=>{
                    this.creditTransactions = data
                    this.$snackbar.global.showSuccess(`Transaction successful`);
                })
                .then(()=>{
                    this.$refs["credit-balance-dialog"].close({"creditAdjustment":{success:true}})
                })
            }
        },
        onCreditAdjustAmountChange(e){
            if(e.key == "-" || e.key=="+" || e.key=="e" || e.key=="E"){
                e.preventDefault()
                return false
            }
            return true
        },
        amountFormat(currency,amount) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
    }
}
</script>

<style lang="less" scoped>
    .body-container{
        min-height: 160px;        
    }
    .flex{
        display: flex;
        .flex-1{
            flex:1;
        }
    }
    .gap-12{
        gap:12px;
    }
    .m-b-12{
        margin-bottom:12px;
    }
    .m-b-24{
        margin-bottom:24px;
    }
    .credit-adjust{
        .adjust-credit-btn{
            position: relative;
            top: 21px;
            border: 1px solid;
            border-radius: 3px;
        }
        .charge-amount-btn{
            color: #f33;
            border-color: #f33;
            border: 1px solid;
            border-radius: 3px;
        }
    }
    .btn-container{
        margin-bottom: 42px;
    }
    .credit-dialog{
        ::v-deep .nitrozen-dialog-footer{
            display: none;
        }
    }
</style>