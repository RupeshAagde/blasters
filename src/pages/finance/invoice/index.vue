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
              placeholder="Search by Invoice Number/IRN"
              v-model="searchText"
              @input="searchByInput"
          ></nitrozen-input>
        </div>
        <div class="company-filter filter-item">
          <nitrozen-dropdown
            id="company-name"
            :items="companyNames"
            v-model="selectedCompany"
            placeholder="Company Id/Name"
            :searchable="true"
            :multiple="true"
            @searchInputChange="searchCompany"
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
        <div class="advanced-filter filter-item" @click="openFilterDrawer()">
          <div class="advanced-filter-btn">More Filters</div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div class="invoice-drawer-container" v-if="isFilterDrawerOpen">
          <filter-drawer @closeFilterDrawer="closeFilterDrawer"></filter-drawer>
      </div>
    </transition>
    <transition name="slide">  
      <div class="invoice-drawer-container" v-if="isDrawerOpen">
          <invoice-drawer @closeDrawer="handleCloseDrawer"></invoice-drawer>
      </div>
    </transition>
    <div class="table-container">
      <div v-if="bulkDownloadList.length" class="bulk-download-container" >
        {{bulkDownloadList.length}} Selected
        <nitrozen-button
          @click="downloadFiles"
          theme="secondary"
          class="export-catalog"
          v-strokeBtn                            
          >
            Download
        </nitrozen-button>
      </div>
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
                <th>Period</th>
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
                    <td >   
                        <nitrozen-checkbox
                        class="table-checkout"
                        @change="toggleInvoice(invoice.id,invoice.invoice_number)"
                        :value="selectedInvoices.includes(invoice.id)? true : false"
                        :disabled="invoice.status != 'paid'"
                        >
                        </nitrozen-checkbox>
                    </td>
                    <td>{{ invoice.company_id }}</td>
                    <td>{{ invoice.company_name }}</td>
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
                        <div :class="[`action-${invoice.status}`]">
                            <nitrozen-menu class="actions-menu" mode="vertical">
                                <nitrozen-menu-item class="act-offline" @click="handleOpenDrawer()">
                                  Offline Payment
                                </nitrozen-menu-item>
                                <nitrozen-menu-item class="act-debt" @click="handleAutoDebt(invoice.invoice_number)">Retry Auto-debt</nitrozen-menu-item>
                                <nitrozen-menu-item class="act-void" @click="handleVoid(invoice.invoice_number)">Void</nitrozen-menu-item>
                                <nitrozen-menu-item class="act-download" @click="downloadInvoice([invoice.invoice_number])">Download</nitrozen-menu-item>
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
            :infoText="popupData.desc"
            :textHeading="popupData.heading"
            :cancel="popupData.cancel"
            :confirm="popupData.confirm"
            @cancel="cancelPopup"
            @confirm="handlePopup"
            :type="popupData.type"
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
import invoiceFilterDrawer from './invoice-filters.vue';
import invoicePopup from './invoice-popup.vue';
import CompanyService from '@/services/company-admin.service';
import { debounce } from '@/helper/utils';
import {
   NitrozenCheckBox,
   NitrozenInput,
   NitrozenPagination,
   NitrozenMenu, 
   NitrozenMenuItem,
   NitrozenDropdown,
   NitrozenButton,
   strokeBtn
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
      NitrozenButton,
      'filter-drawer': invoiceFilterDrawer,
      'invoice-drawer': invoiceDrawer,
      'pop-up':invoicePopup
    },
    directives: {
      strokeBtn
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
        selectedCompany:'',
        companyNames:[],
        pageObject: { ...PAGINATION_OBJECT },
        invoiceList: [],
        isDrawerOpen: false,
        isFilterDrawerOpen:false,
        showPopup: false,
        searchText: '',
        paymentSelection:'',
        downloadUrlList: [],
        disabled:'disabled',
        bulkDownloadList: [],
        popupData:{
          heading:'',
          desc:'',
          cancel:"Cancel",
          confirm:"Yes, Proceed",
          type:''
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
                    },
                    {
                      "id":"809677d0-1831-4e1b-9761-ff51641b0000",
                      "invoice_number":"BINV/00021/22-69",
                      "invoice_type":"Seller Invoice2",
                      "status":"paid",
                      "total_amount":398,
                      "currency":"INR",
                      "invoice_date":"",
                      "irn":"",
                      "start_date":"",
                      "end_date":"",
                      "seller_name":"Test5",
                      "seller_id": "5"
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
      this.getInvoiceList();
      // this.fetchCompany();
      this.getInvoiceType();
      this.getPaymentStatusList();
    },
 methods: {
  toggleAllInvoices () {
            if(this.selectedInvoices.length == 0) {
                this.selectedInvoices = this.billingInvoices.items.map(item => {
                  if(item.status === 'paid') {return item.id}
                
            })
            this.bulkDownloadList = this.billingInvoices.items.
                filter(item => item.status === 'paid').
                map(item => item.invoice_number)
            console.log(this.selectedInvoices, this.bulkDownloadList);
            return
            } 
            this.selectedInvoices = [];
            this.bulkDownloadList = [];
            
        },
  toggleInvoice (id, invoice_num) {
            const index = this.selectedInvoices.indexOf(id);
            if (index > -1) { 
              this.selectedInvoices.splice(index, 1); 
              this.bulkDownloadList.splice(index, 1); 
              return
            }
            this.selectedInvoices.push(id)
            this.bulkDownloadList.push(invoice_num);
           
  },
  downloadFiles(){
      this.downloadInvoice(this.bulkDownloadList)
  },
  handlePageChanges(e) {
            this.pageObject = e;
            this.getInvoiceList();
        },
  getInvoiceList(){
      const params = {
          data:{	
              start_date:"04-04-2023",
              end_date:"05-04-2023",
              page:this.pageObject.current,
              page_size:this.pageObject.limit,
              filters:{},
              search:this.searchText,
          }
      }
      const invoiceList = FinanceService.getInvoiceList(params);
      invoiceList
          .then((res) => {
              console.log(res);
              this.billingInvoices.items = res.data.items;
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
  openFilterDrawer(){
    this.isFilterDrawerOpen = true;
  },
  closeFilterDrawer(){
    this.isFilterDrawerOpen = false;
  },
  cancelPopup(){
      this.showPopup = false;
  },
  handlePopup(status){
      this.showPopup = false;
  },
  onDateChange(){

  },
  paymentOptnChange(){

  },
  searchByInput: debounce(function (e) {   
        this.getInvoiceList();
  }, 1000),
  getInvoiceType(){
      const params = {
          data:{
              is_active:true
          }
      }
      const caller = FinanceService.getInvoiceType(params);
      caller
          .then(( res ) => {
              this.invoiceType = res.data.items.map((item) => {
                  return {
                      text: item.display_name,
                      value: item.type,
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
    this.popupData.heading = "Void Invoice ?";
    this.popupData.desc = `Are you sure you want to Void this Invoice (${number}) ?`;
    this.showPopup = true;
    this.popupData.type = "void";
  },
  handleAutoDebt(number){
    this.popupData.heading = "Retry Auto debt";
    this.popupData.desc = `Are you sure you want to retry auto dept for this Invoice (${number}) ?`;
    this.showPopup = true;
    this.popupData.type = "debt";
  },
  downloadInvoice(invoiceList){
      const params = {
        "data":{
          "invoice_number": invoiceList
        }
      }
      const caller = FinanceService.getDownloadUrlList(params);
      caller
          .then(( res ) => {
              res.data.forEach(item => {
                console.log(res);
                const fileName = item.split("/").pop().split("?")[0];
                this.downloadFile(item, fileName)
                
              });
          })
          .catch((err) => {
              this.$snackbar.global.showError(
                  `Failed due to ${err.message}`
              );
          })
          .finally(() => {
      });

  },
  searchCompany(e) {
            debounce((text) => {
                console.log(text);
                this.fetchCompany(text);
            }, 1000)(e.text);
        },
  
  },
  fetchCompany(query) {
      let params = {
          page_no: 0,
          page_size: 10
      };
      if (query) {
          params.q = query;
      }
      return CompanyService.getCompanyList(params)
          .then(({ data }) => {
              let companies = data.items.map((item) => {
                  return {
                      text: `${item.name} (${item.uid})`,
                      value: String(item.uid)
                  };
              });
              this.companyNames = companies;
          })
          .catch((err) => {
              this.$snackbar.global.showError('Failed to load companies');

              });
  },
  downloadFile(url, filename) {
    fetch(url).then(function(t) {
        return t.blob().then((b)=>{
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
        }
        );
    });
  },

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

    .search-filter{
      width: 39%;
      max-width: 39%;
      flex: 0 0 39%;
      padding-right:1%;
    }
    .company-filter, .date-filter{
      width: 24%;
      max-width: 24%;
      flex: 0 0 24%;
      padding-right:1%;
    }
    .advanced-filter{
      width: 10%;
      max-width: 10%;
      flex: 0 0 60%;

      .advanced-filter-btn{
        border: 1px solid #E0E0E0;
        border-radius: 4px;
        background: #fff;
        color: #41434C;
        // opacity: 0.8;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
      }
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
}

.bulk-download-container {
    background-color: #E7EEFF;
    line-height: 38px;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
}

</style>