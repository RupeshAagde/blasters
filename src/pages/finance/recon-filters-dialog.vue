<template>
  <nitrozen-dialog
    class="filter-dialog"
    ref="reconFiltersDialog"
    :title="title"
  >
    <template slot="body">
      <div
        class="recon-filter"
      >
        <nitrozen-dropdown
          id="status"
          label="Select Status"
          :searchable="true"
          :items="financeStatusItems"
          v-model="selectedStatus"
          :multiple="true"
          @change="filterDropdown(selectedStatus, financeStatusItems)"
          :placeholder="`${selectedStatus ? selectedDropDownValue(selectedStatus, financeStatusItems) : 'Finance Status'}`"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
            id="report-type"
            label="Seller Names"
            :searchable="true"
            :items="sellerNames"
            v-model="selectedSeller"
            :multiple="true"
            @change="filterSellerNames()"
            :placeholder="`${selectedSeller ? selectedSellerName() : 'Seller Names'}`"
            :required="true"
        ></nitrozen-dropdown>
        <nitrozen-dropdown
          id="data-type"
          label="Finance Date"
          :searchable="true"
          :items="reconDateItems"
          v-model="selectedReconDate"
          @searchInputChange="selectedDate()"
          placeholder="Finance Date"
        ></nitrozen-dropdown>
        <date-picker
          label="Recon Date"
          class="date-picker filter-input-sm"
          picker_type="date"
          date_format="MMM Do, YY"
          v-model="reconDate"
          :clearable="true"
          :range="true"
          :not_before="notBefore"
          :shortcuts="dateRangeShortcuts"
          :not_after="new Date().toISOString()"
          :useNitrozenTheme="true"
          @input="dateRangeChange"
        />
      </div>
    </template>
    <template slot="footer">
      <nitrozen-button
        @click="close()"
        v-stroke-btn
        :theme="'secondary'"
      >
        Cancel
      </nitrozen-button>
      <nitrozen-button
        theme="secondary"
        v-flat-btn
        @click="generateRecon"
      >
      <!-- @click="generateReport" -->
        Apply
      </nitrozen-button>
    </template>
  </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenDropdown,
    NitrozenInput,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import DatePicker from '@/components/common/date-picker.vue';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import FinanceService from '@/services/finance.service.js';
import CompanyService from '@/services/company-admin.service';
import moment from 'moment';
import find from 'lodash/find';

export default {
    name: 'recon-filters-dialog',
    components: {
      NitrozenDialog,
      NitrozenButton,
      NitrozenDropdown,
      NitrozenInput,
      DatePicker
    },
    data() {
      return {
        companyId: '',
        reconDate: [
          moment().subtract(1, 'weeks').toISOString(),
          moment().toISOString(),
        ],
        notBefore: moment().subtract(3, 'months').toISOString(),
        dateRangeShortcuts: [...dateRangeShortcuts],
        fromDate: '',
        toDate: '',
        pageSize: 10,
        sellerNames: [],
        selectedSeller: [],
        financeStatusItems: [],
        selectedStatus: [],
        reconDateItems: [],
        selectedReconDate: '',
        statusValue: [],
        statusText: [],
        finDateText: [],
        salesTest: [],
      };
    },
    props: {
      title: {
        type: String,
        default: 'Select Start Date and End Date '
      }
    },
    directives: {
      flatBtn,
      strokeBtn
    },
    computed: {},
    mounted() {
      this.getStatus();
      //this.getDisputeReason();
      this.getReconDate();
      this.fetchCompany();
      this.getInitialDates();
    },
    methods: {
      getInitialDates(){
        this.fromDate = moment(this.reconDate[0]).format('DD-MM-YYYY');
        this.toDate = moment(this.reconDate[1]).format('DD-MM-YYYY');
      },
      open({pageSize}){
        this.pageSize = pageSize;
        this.$refs.reconFiltersDialog.open({
          showCloseButton: true,
            width: '555px'
        })
      },
      close(reason) {
        this.resetDefault();
        this.$refs.reconFiltersDialog.close(reason);
        this.$emit('close', reason);
      },
      resetDefault(){
        this.statusValue= [];
        this.statusText= [];
      },
      dateRangeChange() {
        const to_date = moment(this.reconDate[1]).format('DD-MM-YYYY');
        const from_date = moment(this.reconDate[0]).format('DD-MM-YYYY');
        this.fromDate = from_date;
        this.toDate = to_date;
      },
      fetchCompany() {
        const query = {
            page_no: 0,
            page_size: 10
        };

        /* if (searchCompany) {
            query.q = searchCompany;
        } */
        return CompanyService.getCompanyList(query)
            .then(({ data }) => {
                //this.sellerNames = data.items;
                let sellers = data.items.map((item) => {
                    return {
                        text: item.name,
                        value: String(item.uid)
                    };
                });
                sellers.unshift({
                    text: `All`,
                    value: 'all'
                });
                this.sellerNames = sellers;
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load companies');
                console.log(err);
                });
        },
      getStatus() {
        const params = {
          data:{
              table_name:"config_fields_values",
              filters:{
                  config_field:"finance_status"
              },
              project:[
                  "id",
                  "name",
                  "display_name"
              ]
          }
        };
        const caller = FinanceService.getChannel(params);
        caller
          .then(( res ) => {
              this.financeStatusItems = res.data.items.map((item) => {
                  return {
                      text: item.display_name,
                      value: item.name,
                  };
              });
          })
          .catch((err) => {
              this.$snackbar.global.showError(
                  `Failed due to ${err.message}`
              );
              console.log(err);
          })
          .finally(() => {
              this.inProgress = false;
          });
      },
      getReconDate() {
        const params = {
          data:{
            table_name:"config_fields_values",
            filters:{
                config_field:"finance_date"
            },
            project:[
                "id",
                "name",
                "display_name"
            ]
          }
        };
        const caller = FinanceService.getChannel(params);
        caller
          .then(( res ) => {
              this.reconDateItems = res.data.items.map((item) => {
                  return {
                      text: item.display_name,
                      value: item.name,
                  };
              });
          })
          .catch((err) => {
              this.$snackbar.global.showError(
                  `Failed due to ${err.message}`
              );
              console.log(err);
          })
          .finally(() => {
              this.inProgress = false;
          });
      },
      filterDropdown(data, dataList){
        let dropdownData = data.map(item => {
          let d = find(dataList, (obj) => {
            return obj.value === item;
          })
          return d;
        })
        return dropdownData;
      },
      selectedDropDownValue(selectedData, dataList){
        let dataName = selectedData.map(item => {
          let name = find(dataList,(obj) => {
            return obj.value === item;
          });
          return name.text;
        });
        return dataName;
      },
      filterSellerNames() {
          let sellers = this.selectedSeller.map(item => {
              let seller = find(this.sellerNames,(obj) => {
                  return obj.value === item;
              });
              return seller;
          });
          //console.log(sellers);
          return sellers;
      },
      selectedSellerName(){
          let sellerName = this.selectedSeller.map(item => {
              let name = find(this.sellerNames,(obj) => {
                  return obj.value === item;
              });
              return name.text;
          });
          //console.log(fulfilmentName);
          return sellerName;
      },
      generateRecon(){
        //this.companyId = getCompInfo();
        let status = this.filterDropdown(this.selectedStatus, this.financeStatusItems);
        if(status.length){
          status.forEach(item => {
            this.statusText.push(item.text);
            this.statusValue.push(item.value.toString());
          });
        }
        let companyId = this.filterSellerNames().map(item => item.value);
        let companyName = this.filterSellerNames().map(item => item.text);
        console.log(companyId,'-----',companyName);
        const params = {
          data:{
            report_id:"5781b656-cb52-45fb-bd7a-9e20c4901dd7",
            start_date:this.fromDate,
            end_date:this.toDate,
            page: 1,//this.pageObject.current,
            pageSize: this.pageSize,
            filters:{
                seller_id: companyId.length ? companyId : [],
                finance_status:this.statusValue.length ? this.statusValue : []
            },
            finance_date:this.selectedReconDate,
            meta:{
              seller_name: companyName.toString(),
              finance_status:this.statusText.join(','),
            }
          }
        }
        this.close(params);
      },
      selectedDate(){
            this.selectedReconDate = '';
        },
    }
}
</script>

<style lang="less" scoped>
  .filter-dialog {
    ::v-deep .nitrozen-dialog {
      max-height: 90%;
      .nitrozen-dialog-body {
        overflow: unset;
      }
      .nitrozen-dialog-footer {
        display: flex;
        gap: 15px;
      }
    }
    .filter-input-sm {
      min-width: 250px;
      ::v-deep.mx-datepicker-popup {
          top: inherit;
      }
      @media @mobile {
        width: 100%;
      }
    }
    .recon-filter {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 10px;
    }
  }
</style>
