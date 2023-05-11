<template>
    <div class="invoice-overlay">
        <div class="invoice-drawer-wrap">
            <div class="drawer-inner-wrap">
                <div class="offline-main-container">
                    <div class="header">
                        <div class="header-title"><!-- <span>{{ invoice.invoiceNumber }} - </span> -->{{invoice.invoiceNumber }}  - {{ invoice.type }}</div>
                        <div class="cross-btn" @click="closeDrawer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#8F8F8F"/>
                            </svg></div>
                    </div>
                    <div class="filters-container">
                        <div v-if="invoice.type ==='Void'" class="request-cards">
                            <div class="request-card">
                                <div class="request-details">
                                    <div class="left flex-col">
                                        <span>Seller Name: {{ invoice.sellerName }}</span>
                                        <span>Invoice: {{ invoice.invoiceNumber }}</span>
                                    </div>
                                    <div class="right flex-col">
                                        <span>Amount</span>
                                        <span>{{ invoice.amount }}</span>
                                    </div>
                                </div>
                                <div class="request-comments">
                                    <span>Select Reason *</span>
                                    <nitrozen-dropdown
                                        class="reason-dropdown"
                                        id="reason-list"
                                        :items="invoice.reasonsList"
                                        v-model="selectedReason"
                                        :searchable="true"
                                        placeholder="Reasons"
                                        @change="changeReasons"
                                        @searchInputChange="clearReasons"
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="request-comments remarks">
                                    <span>Remarks</span>
                                    <nitrozen-input
                                        class="comment filter-input-lg"
                                        type="search"
                                        :placeholder="`Write your remarks here...`"
                                        v-model="remarks"
                                    ></nitrozen-input>
                                </div>
                            </div>
                        </div>
                        <div v-if="invoice.type === 'Extend Due Date'" class="due-container">
                            <date-picker
                                class="date-picker filter-input-sm"
                                label="Current Due Date"
                                picker_type="date"
                                :disabled="true"
                                date_format="MMM Do, YY"
                                :placeholder="invoice.dueDate"
                                :useNitrozenTheme="true"
                            />

                            <div class="request-comments">
                                <span>Number of Days to Extend *</span>
                                <nitrozen-input
                                    class="comment filter-input-lg"
                                    type="number"
                                    v-model="dueDate"
                                    @input="dueDateUpdate"
                                ></nitrozen-input>
                            </div>
                            <div class="request-comments">
                                <span>Select Reason *</span>
                                <nitrozen-dropdown
                                    class="reason-dropdown"
                                    id="reason-list"
                                    :items="invoice.reasonsList"
                                    v-model="selectedReason"
                                    :searchable="true"
                                    placeholder="Reasons"
                                    @change="changeReasons"
                                    @searchInputChange="clearReasons"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="request-comments">
                                <span>Remarks</span>
                                <nitrozen-input
                                    class="comment filter-input-lg"
                                    type="search"
                                    :placeholder="`Write your remarks here...`"
                                    v-model="remarks"
                                ></nitrozen-input>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pay-btns">
                    <div class="cancel-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-strokeBtn
                        @click="closeDrawer"
                        >Close</nitrozen-button>
                    </div>
                    <div class="save-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        :disabled="this.isDisabled"
                        @click="saveActions"
                        >Proceed</nitrozen-button>
                    </div>
            </div>
            </div>   
        </div>
    </div>
</template>
<script>
import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import FinanceService from '@/services/finance.service.js';
import DatePicker from '@/components/common/date-picker.vue';
import { debounce } from '@/helper/utils';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,

} from '@gofynd/nitrozen-vue';
export default {
name: 'invoice-actions',
components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'inline-svg': inlineSvgVue,
        'date-picker': DatePicker,
        NitrozenDropdown
},
directives: {
        flatBtn,
        strokeBtn,
},
props: {
    invoice: {
        type: Object
    }
},
data() {
    return { 
        selectedReason: '',
        isDisabled: true,
        remarks: '',
        dueDate: 0,
    }
},
mounted() {},
methods: {
        closeDrawer(){
            this.$emit('closeDrawer');
            this.resetFilters();
        },
        dueDateUpdate(){
            this.dueDate === 0 ? this.isDisabled = true : this.isDisabled = false;
        },
        saveActions (){
            if(this.invoice.type === 'Void'){
                this.proceedVoid();
            }
            if(this.invoice.type === 'Extend Due Date'){
                this.proceedExtend();
            }
        },
        proceedExtend(){
            let params = {
                data:{
                    invoice_number:this.invoice.invoiceNumber,
                    invoice_id:this.invoice.invoiceId,
                    reason_code:this.selectedReason,
                    days: this.dueDate,
                    remarks: this.remarks
                }
            }
            const invoiceVoid = FinanceService.invoiceExtendDate(params);
            invoiceVoid
                .then((res) => {
                    this.$snackbar.global.showSuccess(res.data.message);
                    this.closeDrawer();
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.response.data.message}`
                    );
                    this.closeDrawer();
                })
                .finally(() => {});
        },
        proceedVoid(){
            let params = {
                data:{
                    invoice_number: this.invoice.invoiceNumber,
                    invoice_id: this.invoice.invoiceId,
                    reason_code: this.selectedReason,
                    remarks: this.remarks
                }
            }
            const invoiceVoid = FinanceService.invoiceVoid(params);
            invoiceVoid
                .then((res) => {
                    this.$snackbar.global.showSuccess(res.data.message);
                    this.closeDrawer();
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.response.data.message}`
                    );
                    this.closeDrawer();
                })
                .finally(() => {}); 
        },
        clearReasons(){
            this.selectedReason = '';
            this.isDisabled = true
        },
        changeReasons(){
            this.selectedReason.length > 0 ? this.isDisabled = false : this.isDisabled = true;
        },
        resetFilters(){
            this.selectedReason = null;
            this.isDisabled = true;
            this.remarks = '';
        },
    },
}

</script>
<style lang="less" scoped>

.invoice-overlay{position: absolute;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    background: rgba(51, 51, 51, 0.7);
    z-index: 100;

    .invoice-drawer-wrap{

        position: absolute;
        height: 100%;
        background:#fff;
        top: 0;
        right: 0;
        max-width: 400px;
        width: 100%;

        .drawer-inner-wrap{ 
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-between;
            box-sizing: border-box;
        }
    }
}

.header{
    padding:24px;
    border-bottom: 1px solid #E0E0E0;
    display: flex; align-items: center;
    justify-content: space-between;

    .header-title{
    color: #41434C;
    font-size: 20px;
    line-height: 25px;
    font-weight: 700; 
}
    .cross-btn{
        cursor: pointer;
    }

}
.pay-btns{
    background: #fff;
    box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.06);
    display: flex;
    padding: 16px 0px;
    width: 100%;
    justify-content: flex-end;

    .cancel-btn{
        margin-right: 16px;
    }
    .cancel-btn{
        margin-right: 16px;
    }
    .save-btn{
        margin-right: 16px;
    }
}

.filters-container{
    padding: 0 24px;
    
    /* .request-cards{
        display: flex;
        overflow-y: auto;
        flex-direction: column;
        padding-bottom: 20px;
        height: inherit; */

        .request-card{
            width: 90%;
            margin: 6% 0%;
            margin-top: 20px;
            border: 1px solid #E0E0E0;
            border-radius: 5px;
            padding: 16px;

            .request-details {
                padding-bottom: 12px;
                display: flex;
                justify-content: space-between;
                .left{
                    width: 65%;
                    span:nth-of-type(1){
                        font-size: 12px;
                    }
                    span:nth-of-type(2){
                        padding-top: 7px;
                        font-size: 14px;
                        font-weight: 600;
                    }
                }
                .right{
                    span{
                        font-size: 12px;
                    }
                    span:nth-of-type(2){
                        text-align: right;
                        font-weight: 600;
                    }
                }
                .flex-col{
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                    span {
                        color:#41434C;
    ;
                    }
                }
            }
        }
        /* .request-comments{
            display: flex;
            flex-direction: column;
            gap: 0px;
            span {
                color: #9B9B9B;
                font-size: 12px;
                margin-bottom: 8px;
                padding-top: 3px;
            }
         }

         .remarks{
            padding-top: 12px;
         } */
    //}
}

.request-comments{
    display: flex;
    flex-direction: column;
    gap: 0px;
    span {
        color: #9B9B9B;
        font-size: 12px;
        margin-bottom: 8px;
        padding-top: 3px;
    }
}

.remarks{
    padding-top: 12px;
}

.due-container{
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.date-picker {
    ::v-deep.date-picker {
        .mx-input-wrapper input::placeholder {
            color: #000000;
        }
    }
}


</style>