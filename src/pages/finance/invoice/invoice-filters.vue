<template>
    <div class="invoice-overlay">
        <div class="invoice-drawer-wrap">
            <div class="drawer-inner-wrap">
                <div class="offline-main-container">
                    <div class="header">
                        <div class="header-title">Filters</div>
                        <div class="cross-btn" @click="closeDrawer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#8F8F8F"/>
                            </svg></div>
                    </div>
                    <div class="filters-container">
                        <div class="payment-status-filter">
                            <accordion
                            class="accordion-container"
                            :title="'Payment Status'"
                            :initialState="true"
                            >
                                <nitrozen-dropdown
                                    class="payment-status"
                                    id="payment-status"
                                    :items="paymentStatusList"
                                    v-model="selectedPaymentStatus"
                                    placeholder="Payment Status"
                                    :searchable="true"
                                    :multiple="true"
                                    @change="addInvoiceChips(paymentStatusList,selectedPaymentStatus,'payment')"
                                ></nitrozen-dropdown>
                                <nitrozen-chips
                                    v-for="(item, index) in paymentChips"
                                    :key="'company' + index"
                                    class="mb-12"
                                    >
                                    {{ item.text }}
                                    <nitrozen-inline
                                    :icon="'cross'"
                                    ref="remove-chips"
                                    class="nitrozen-icon"
                                    v-on:click="removeChips(index, item, selectedPaymentStatus, paymentChips)"
                                ></nitrozen-inline>
                                </nitrozen-chips>
                            </accordion>
                        </div>
                        <div class="invoice-type-filter">
                            <accordion
                            class="accordion-container"
                            :title="'Invoice Type'"
                            :initialState="true"
                            >
                            <nitrozen-dropdown
                                class="invoice-type"
                                id="invoice-type"
                                :items="invoiceType"
                                v-model="selectedInvoiceType"
                                placeholder="Invoice Type"
                                :searchable="true"
                                :multiple="true"
                                @change="addInvoiceChips(invoiceType,selectedInvoiceType,'invoice')"
                            ></nitrozen-dropdown>
                                <nitrozen-chips
                                v-for="(item, index) in invoiceChips"
                                :key="'company' + index"
                                class="mb-12"
                                >
                                {{ item.text }}
                                <nitrozen-inline
                                :icon="'cross'"
                                ref="remove-chips"
                                class="nitrozen-icon"
                                v-on:click="removeChips(index, item, selectedInvoiceType, invoiceChips)"
                                ></nitrozen-inline>
                                </nitrozen-chips>
                            </accordion>
                        </div>
                    </div>
                </div>
                <div class="pay-btns">
                    <div class="cancel-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-strokeBtn
                        @click="resetFilters"
                        >Clear All</nitrozen-button>
                    </div>
                    <div class="save-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        @click="saveOfflineData"
                        >Apply Filter</nitrozen-button>
                    </div>
            </div>
            </div>   
        </div>
    </div>
</template>
<script>
import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import FinanceService from '@/services/finance.service.js';
import accordion from '@/components/common/accordion.vue';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline,
    flatBtn,
    strokeBtn,

} from '@gofynd/nitrozen-vue';
export default {
name: 'invoice-drawer',
components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-radio': NitrozenRadio,
        'inline-svg': inlineSvgVue,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        accordion,
},
directives: {
        flatBtn,
        strokeBtn,
},
data() {
    return {
        invoiceType : [],
        selectedInvoiceType: '',
        paymentStatusList: [],
        selectedPaymentStatus: '',
        companyChips: [],
        paymentChips: [],
        invoiceChips: [],
        filters: {
            invoice_type: [],
            payment_status: []
        }
    }
},
mounted() {
    this.getInvoiceType();
},
methods: {
        closeDrawer(){
            this.$emit('closeFilterDrawer',this.filters);
            this.resetFilters();
        },
        saveOfflineData(){
            this.closeDrawer();

        },
        resetFilters(){
            this.selectedInvoiceType = '',
            this.selectedPaymentStatus = '',
            this.companyChips = [],
            this.paymentChips = [],
            this.invoiceChips = [],
            this.filters = {
                invoice_type: [],
                payment_status: []
            }
        },
        getInvoiceType(){
            const params = {
                data:{
                    is_active:true
                }
            }
            const caller = FinanceService.getInvoiceType(params);
            caller
                .then(( res ) => {
                    this.paymentStatusList = res.data.payment_status_list;
                    this.invoiceType = res.data.invoice_type_list;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    this.inProgress = false;
            });

        },
        addInvoiceChips(dataList,selectedList,type) {
            this.companyChips = [];
            this.companyChips.push(
                ...dataList.filter((ele) =>
                selectedList.includes(ele.value)
                )
            );
            this.setChipsList(type, this.companyChips)
        },
        removeChips(index, item, selectedList, chips) {
            const comIndex = selectedList.findIndex((ele) => {
                return ele == item.value;
            });
            selectedList.splice(comIndex, 1);
            chips.splice(index, 1);
        },
        setChipsList(type,list){
            if(type === 'payment'){
                this.paymentChips = list;
                this.filters.payment_status = [];
                this.paymentChips.forEach(item => {
                    this.filters.payment_status.push(item.value);
                });
            }
            if(type === 'invoice'){
                this.invoiceChips = list;
                this.filters.invoice_type = [];
                this.invoiceChips.forEach(item => {
                    this.filters.invoice_type.push(item.value);
                });
            }
        }
   
        
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
max-width: 384px;
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

    .invoice-type-filter{
        border-bottom: 1px solid #E0E0E0;
        padding: 24px 0;
        .invoice-type{
            padding: 24px 0 12px;
        }
        /deep/.nitrozen-chip{
            border-radius: 4px;
            margin-top: 5px;
        }

    }

    .payment-status-filter{
        border-bottom: 1px solid #E0E0E0;
        padding: 24px 0;
        .payment-status{
            padding: 24px 0 12px;
        }
        /deep/.nitrozen-chip{
            border-radius: 4px;
            margin-top: 5px;
        }


    }
    

}


</style>