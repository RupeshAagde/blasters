<template>
  <div class="main-container">
    <div class="jumbotron-container">
        <jumbotron
            :title="'Invoices'"
            :desc="'Invoices'"
        ></jumbotron>
    </div>
    <div class="filter-container">
      <div class="filter-wrap">
        <div class="search-filter filter-item">
          <nitrozen-input
              :showSearchIcon="true"
              class="search"
              type="search"
              placeholder="Search here"
              @keyup.enter="onSearch"
              v-model="searchText"
          ></nitrozen-input>
        </div>
        <div class="invoice-type-filter filter-item">
          <nitrozen-dropdown
              id="invoice-type"
              :items="invoiceType"
              v-model="selectedInvoiceType"
              placeholder="Invoice Type"
              :searchable="true"
              :multiple="true"
          ></nitrozen-dropdown>
        </div>
        <div class="payment-status-filter filter-item">
          <nitrozen-dropdown
              id="payment-status"
              :items="paymentStatusList"
              v-model="selectedPaymentStatus"
              placeholder="Payment Status"
              :searchable="true"
              :multiple="true"
          ></nitrozen-dropdown>
        </div>
        <div class="date-filter filter-item">
          <date-picker
              style="width:20%"
              @change="onDateChange"
              class="date-picker filter-input-md"
              picker_type="date"
              date_format="MMM Do, YY"
              v-model="InvoiceDateRange"
              :clearable="true"
              :range="true"
              :not_before="new Date(0).toISOString()"
              :placeholder="'Sort by'"
              :useNitrozenTheme="true"
          ></date-picker>
        </div>
      </div>
    </div>
    <transition name="slide">  
      <div class="invoice-drawer-container" v-if="isDrawerOpen">
          <invoice-drawer @closeDrawer="handleCloseDrawer"></invoice-drawer>
      </div>
    </transition>
    <div class="table-container">
      <table class="invoices-table">
        <thead>
            <tr>
                <th> 
                    <nitrozen-checkbox
                    class="table-checkout"
                    :value="selectedInvoices.length ? true : false"
                    @change="toggleAllInvoices"
                    >
                    </nitrozen-checkbox>
                </th>
                <th>Company Id</th>
                <th>Company Name</th>
                <th>Invoice Number</th>
                <th>Invoice Type</th>
                <th>Invoice Date</th>
                <th >Period
                    <img @click="toggleSort()" src="/public/admin/assets/svgs/hamburger-fin.svg" />
                </th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <template
                v-if="
                    billingInvoices.items &&
                        billingInvoices.items.length > 0
                ">
                <tr
                    v-for="(invoice,
                    i) in billingInvoices.items"
                    :key="i">
                    <td>   
                        <nitrozen-checkbox
                        class="table-checkout"
                        @change="toggleInvoice(invoice.id)"
                        :value="selectedInvoices.includes(invoice.id)? true : false"
                        >
                        </nitrozen-checkbox>
                    </td>
                    <td>{{ invoice.seller_id }}</td>
                    <td>{{ invoice.seller_name }}</td>
                    <td>{{ invoice.invoice_number }}</td>
                    <td>{{ invoice.invoice_type }}</td>
                    <td>{{ invoice.invoice_date }}</td>
                    <td>{{ invoice.start_date - invoice.end_date }}</td>
                    <td>{{ invoice.total_amount }}</td>
                    <td>
                        <div
                            class="pay-status status-process"
                            v-if="invoice.status === 'processing'"
                        >
                            In Process
                        </div>
                        <div
                            class="pay-status status-paid"
                            v-else-if="invoice.status === 'paid'"
                        >
                            Paid
                        </div>
                        <div
                            class="pay-status status-void"
                            v-else-if="invoice.status === 'void'"
                        >
                            Void
                        </div>
                        <div
                            class="pay-status status-unpaid"
                            v-else>
                            Unpaid
                        </div>
                    </td>
                    <td>
                      <div class="actions-wrap">
                        <!-- <div class="action-btn"><inline-svg :src="'hamburger-fin'"></inline-svg></div> -->
                        <div :class="[`action-${invoice.status}`]">
                            <nitrozen-menu class="actions-menu" mode="vertical">
                                <nitrozen-menu-item class="act-offline" @click="handleOpenDrawer()">
                                  Offline Payment
                                </nitrozen-menu-item>
                                <nitrozen-menu-item class="act-debt" @click="handleAutoDebt(invoice.invoice_number)">Retry Auto-debt</nitrozen-menu-item>
                                <nitrozen-menu-item class="act-void" @click="handleVoid(invoice.invoice_number)">Void</nitrozen-menu-item>
                                <nitrozen-menu-item class="act-download">Download</nitrozen-menu-item>
                            </nitrozen-menu>
                        </div>
                      </div>
                    </td>
                </tr>
            </template>
        </tbody>
      </table>
      <div class="pagination-container">
          <nitrozen-pagination
              class="pagination-main"
              name="Invoices"
              v-model="pageObject"
              @change="handlePageChanges"
              :pageSizeOptions="[10, 20, 50, 100]"
          >
          </nitrozen-pagination>
      </div>
      <pop-up
            v-if="showPopup"
            :infoText="popupVals.desc"
            :textHeading="popupVals.heading"
            :cancel="popupVals.cancel"
            :confirm="popupVals.confirm"
            @cancel="cancelPopup"
            @confirm="handlePopupp"
        />
      <template
        v-if="
            billingInvoices &&
                billingInvoices.items &&
                billingInvoices.items.length == 0
        "
      >
        <div class="text-center">
            No invoices available
        </div>
      </template>
    </div>

  </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import DatePicker from "@/components/common/date-picker.vue";
import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import invoiceDrawer from './invoice-drawer.vue';
import invoicePopup from './invoice-popup.vue';
import {
   NitrozenCheckBox,
   NitrozenInput,
   NitrozenPagination,
   NitrozenMenu, 
   NitrozenMenuItem,
   NitrozenDropdown,
   
} from '@gofynd/nitrozen-vue';

const PAGINATION_OBJECT = {
    limit: 10,
    current: 1,
    total: 0,
};

export default {
    name:'invoices',
    components: {
      'jumbotron': Jumbotron,
      'date-picker': DatePicker,
      'nitrozen-checkbox': NitrozenCheckBox,
      'nitrozen-input': NitrozenInput,
      'nitrozen-pagination': NitrozenPagination,
      'inline-svg': inlineSvgVue,
      NitrozenMenu,
      NitrozenMenuItem,
      NitrozenDropdown,
      'invoice-drawer': invoiceDrawer,
      'pop-up':invoicePopup
    },
    data() {
      return {
        selectedInvoices : [],
        InvoiceDateRange: [
                // moment().subtract(3, 'days').toISOString(),
                // moment().toISOString(),
            ],
        invoiceType : [],
        paymentStatusList: [],
        selectedInvoiceType: '',
        selectedPaymentStatus: '',
        pageObject: { ...PAGINATION_OBJECT },
        invoiceList: [],
        isDrawerOpen: false,
        showPopup: false,
        searchText: '',
        paymentSelection:'',
        popupVals:{
          heading:'',
          desc:'',
          cancel:"Cancel",
          confirm:"Yes, Proceed"
        },
        billingInvoices: {
          "items": [
                    {
                      "id":"809677d0-1831-4e1b-9761-ff51641b54io",
                      "invoice_number":"BINV/00021/22-23",
                      "invoice_type":"Seller Invoice Df",
                      "status":"paid",
                      "total_amount":3983.68,
                      "currency":"INR",
                      "invoice_date":"22-07-22",
                      "irn":"",
                      "start_date":"",
                      "end_date":"",
                      "seller_name":"Test",
                      "seller_id": "1"
                    },
                    {
                      "id":"809677d0-1831-4e1b-9761-ff51641b5476",
                      "invoice_number":"BINV/00021/22-23",
                      "invoice_type":"Seller Invoice Df",
                      "status":"unpaid",
                      "total_amount":3983.68,
                      "currency":"INR",
                      "invoice_date":"",
                      "irn":"",
                      "start_date":"",
                      "end_date":"",
                      "seller_name":"Test2",
                      "seller_id": "2"
                    },
                    {
                      "id":"809677d0-1831-4e1b-9761-ff51641b5490",
                      "invoice_number":"BINV/00021/22-89",
                      "invoice_type":"Seller Invoice Di",
                      "status":"processing",
                      "total_amount":3983.68,
                      "currency":"INR",
                      "invoice_date":"",
                      "irn":"",
                      "start_date":"",
                      "end_date":"",
                      "seller_name":"Test3",
                      "seller_id": "3"
                    },
                    {
                      "id":"809677d0-1831-4e1b-9761-ff51641b5487",
                      "invoice_number":"BINV/00021/22-66",
                      "invoice_type":"Seller Invoice",
                      "status":"void",
                      "total_amount":3983,
                      "currency":"INR",
                      "invoice_date":"",
                      "irn":"",
                      "start_date":"",
                      "end_date":"",
                      "seller_name":"Test4",
                      "seller_id": "4"
                    }
              ],
              "item_count": 0,
              "page": {
                  "type": "number",
                  "size": 10,
                  "current": 1,
                  "has_next": true,
                  "item_count": 0
              }
       }
      }
  },
  mounted() {
        this.getInvoiceType();
        this.getPaymentStatusList();
    },
 methods: {
  
  toggleAllInvoices () {
            if(this.selectedInvoices.length == 0) {
                this.selectedInvoices = this.billingInvoices.items.map(x => {
                return x.id
            })
            return

            } 
            this.selectedInvoices = []
        },
  toggleSort(){
      this.sortInvoice = this.sortInvoice == -1 ? 1 : -1
  },
  toggleInvoice (id) {
            const index = this.selectedInvoices.indexOf(id);
            if (index > -1) { 
              this.selectedInvoices.splice(index, 1); 
              return
            }
            this.selectedInvoices.push(id)
           
  },
  handlePageChanges(e) {
            this.pageObject = e;
            this.getInvoiceList();
        },
  getInvoiceList(){
      const params = {
          data:{	
              start_date:"11-04-2021",
              end_date:"11-05-2021",
              page:this.pageObject.current,
              pageSize:this.pageObject.limit,
              filters:{},
              search:""
          }
      }

      const invoiceList = FinanceService.getInvoiceList(params);
      invoiceList
          .then((res) => {
              this.invoiceList = res.data.items;
              this.pageObject.total = res.data.page.item_count;
          })
          .catch((err) => {
              this.$snackbar.global.showError(
                  `Something Went Wrong`
              );
          })
          .finally(()=> {
              // this.inProcess = false
          })
  },
  handleOpenDrawer(){
      this.isDrawerOpen = true;
  },
  handleCloseDrawer(){
      this.isDrawerOpen = false;
  }, 
  cancelPopup(){
      this.showPopup = false;
  },
  handlePopup(){
      console.log("Handled")
  },
  onDateChange(){

  },
  paymentOptnChange(){

  },
  getInvoiceType(){
      const params = {
          data:{
              
          }
      }
      const caller = FinanceService.getInvoiceType(params);
      caller
          .then(( res ) => {
              this.invoiceType = res.data.items.map((item) => {
                  return {
                      text: item.name,
                      value: item.id,
                      description: item.description,
                      date: item.display_date, 
                  };
              });
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
  getPaymentStatusList(){

    const params = {
          data:{
              
          }
      }
      const caller = FinanceService.getPaymentStatus(params);
      caller
          .then(( res ) => {
              this.paymentStatusList = res.data.items.map((item) => {
                  return {
                      text: item.name,
                      value: item.id,
                      description: item.description,
                      date: item.display_date, 
                  };
              });
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
  handleVoid(number){
    this.popupVals.heading = "Void Invoice ?";
    this.popupVals.desc = `Are you sure you want to Void this Invoice (${number}) ?`;
    this.showPopup = true;
  },
  handleAutoDebt(number){
    this.popupVals.heading = "Retry Auto debt";
    this.popupVals.desc = `Are you sure you want to retry auto dept for this Invoice (${number}) ?`;
    this.showPopup = true;
  }
  }

}
</script>
<style lang="less" scoped>

.slide-leave-active,.slide-enter-active {
    transition: 0.1s;
}
.slide-enter {
    right: -100%;
    opacity: 0;
}
.slide-leave-to {
    right: 0;
    opacity: 1;
}
.table-checkout {
   height: 15px;
}

.main-container{
  background: #fff;
  .filter-container{
    padding: 0 24px 0;
  }

}

.filter-wrap {
    padding: 12px;
    background: #F5F5F5;
    margin: 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    flex-wrap: wrap;
    box-sizing: border-box;
    @media @mobile{
        display: block;
    }

    .vue-date-picker{
      width: 100% !important;
    }
    .filter-item {
      width: 25%;
      max-width: 25%;
      flex: 0 0 25%;
    }
    .search {
        @media @mobile{
            min-width: 100%;
        }
    }

    .filter {
        display: flex;
        @media @mobile{
            display: block;
        }
    }
    .label {
        font-family: Inter;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
        margin-top: 30px;
        @media @mobile{
            display: none;
        }
    }
    .filter-dropdown {
        width: 170px;
        margin-left: 12px;
        @media @mobile{
            margin-left: 0;
            width: 100%
        }
    }
}

.table-container {

  padding: 0 24px 24px;
    .invoices-table {
        td {
            vertical-align: middle;
        }
        .nitrozen-checkbox {
            position: absolute;
            top: -14px !important;
            left: 0px;
            height: 16px;
            width: 16px;
            border: 1px solid #41434c;
            border-radius: 3px;
        }
        
        // text-align: center;
        width: 100%;
        font-family: Inter, sans-serif;
        font-size: 14px;
        tr {
            border: 1px solid #E0E0E0;
        }
        thead {
            tr {
                th {
                text-align:left;
                }
            }
            tr:first-child {
                background: #f8f8f8;
                color: black;
                
            }
        }
        th ,
        td {
            padding: 15px;
        }
    }
    .pay-status {
        border: 1px solid #E3F2E9;
        background: #E3F2E9;
        color: #0A5F23;
        display: inline;
        padding: 3px 20px;
        border-radius: 4px
    }
    .status-unpaid {
        color: #B54708;
        border: 1px solid #FFF5D6;
        background: #FFF5D6;
    }
    .status-process {
        color: #3D3D3D;
        border: 1px solid #F5F5F5;
        background: #F5F5F5;
    }
    .status-void {
        color: #CD0909;
        border: 1px solid #FDEDED;
        background: #FDEDED;
    }
}

.pagination-container{
  padding-top: 24px;
}

.actions-wrap{
  .action-void{
    display: none;
  }

  .action-paid{
    .nitrozen-menu-vertical-dropdown{
      li:nth-child(1),li:nth-child(2),li:nth-child(3) {
        display: none;
    }
  }
}
.action-processing{
    .nitrozen-menu-vertical-dropdown{
      li:nth-child(1),li:nth-child(2) {
        display: none;
    }
  }
}

.invoice-drawer-container{
  
}

}

</style>