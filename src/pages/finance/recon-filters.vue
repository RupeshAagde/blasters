<template>
   <div class="filters-section" @click="stopClick($event)">
        <div class="header-box">
                <div class="filters-title">
                    <span>Apply Filters</span>
                </div>
        </div>
        <div class="filters">
            <accordion
                class="accordion-container"
                :title="'Sellers'"
                :initialState="true"
            >
                <nitrozen-dropdown
                    id="report-type"
                    ref="report-type"
                    label="Seller Name"
                    :items="sellerNames"
                    v-model="selectedSeller"
                    :multiple="true"
                    :searchable="true"
                    @searchInputChange="searchCompany"
                    @change="setCompanyList"
                ></nitrozen-dropdown>
                <nitrozen-chips
                    v-for="(item, index) in companyChips"
                    :key="'company' + index"
                    class="mb-12"
                >
                    {{ item.text }}
                    <nitrozen-inline
                        :icon="'cross'"
                        ref="remove-chips"
                        class="nitrozen-icon"
                        v-on:click="removeFromChips(index, item)"
                    ></nitrozen-inline>
                </nitrozen-chips>
                <!-- :placeholder="`${selectedSeller ? selectedSellerName() : 'Seller ID'}`" -->
            </accordion>
            <accordion
                class="accordion-container checkboxes"
                :title="'Status'"
                :initialState="true"
            >
                <nitrozen-checkbox
                    v-for="(item, index) in financeStatusItems"
                    :key="index"
                    @change="filterDropdown(selectedStatus, financeStatusItems)"
                    :checkboxValue="item.value"
                    v-model="selectedStatus"
                >
                    <div class="access">
                        <span class="title">
                            {{ item.text }}
                        </span>
                    </div>
                </nitrozen-checkbox>
            </accordion>
            <accordion
                class="accordion-container"
                :title="'Finance Date'"
                :initialState="true"
            >
                <nitrozen-radio
                    name="Finance Date"
                    v-model="selectedReconDate"
                    :radioValue="item.value"
                    :title="item.text"
                    v-for="(item, index) in reconDateItems"
                    @change="storeIndex(index)"
                    :key="index"
                >
                    <span class="radio-text">{{ item.text }}</span>
                    <date-picker
                        v-if="storedIndex == index"
                        class="date-picker filter-input-sm"
                        picker_type="date"
                        date_format="MMM Do, YY"
                        v-model="reconDate"
                        :clearable="true"
                        :range="true"
                        :not_before="notBefore"
                        :shortcuts="dateRangeShortcuts"
                        :useNitrozenTheme="true"
                        @input="dateRangeChange"
                    />
                    <!-- :not_after="new Date().toISOString()" -->
                </nitrozen-radio>
            </accordion>

        </div>
        <div class="footer-box">
            
            <nitrozen-button 
                class="clear-button" 
                v-strokeBtn 
                :theme="'secondary'"
                @click="close()"
            >
                Cancel
            </nitrozen-button>
        
            <nitrozen-button 
                class="apply-filter-button" 
                v-flatBtn 
                :theme="'secondary'"
                @click="generateRecon()"
            >Apply</nitrozen-button>
            
       </div>
   </div>
</template>
<style lang="less" scoped>
.filters-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header-box{
        box-sizing: border-box;
        height: 55px;
        border-bottom: 1px solid #E0E0E0;
        .filters-title {
            margin: 12px 0 12px 24px;
            /* margin-top: 12px;
            margin-left: 24px; */
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 20px;
            line-height: 31px;
            color: #41434C;
        }
    }

    .filters{
        width: -webkit-fill-available;
        margin: auto;
        margin-top: 0;
        //border-bottom: 1px solid #E0E0E0;
        //border-radius: 5px;
        padding: 16px;
        padding-top: 0;
    }
    .footer-box {
        padding: 10px 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 24px;
        //margin-top: 72px;
        box-sizing: border-box;
        border-top: 1px solid #E0E0E0;
        //height: 72px;
        background: #FFFFFF;
        box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
        .apply-filter-button{
            margin-right: 16px;
        }
    }
    .accordion-container {
        padding: 10px;
        padding-top: 16px;
        border-bottom: 1px solid #E0E0E0;

        /deep/.outer-container{
            padding-bottom: 15px;
        }
        /deep/.title {
            font-size: 18px;

        }

        .access {
            color: @Mako;
            font-size: 16px;
            line-height: 25px;
            display: flex;
            flex-direction: column;
            padding: 5px;
        }

        ::v-deep.nitrozen-radio-group{
            height: unset;
            padding: 7px 0;
            label {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;

                .date-picker{
                    width: 100%;
                    padding-left: 10px;
                }
            }
        }
    }
    .checkboxes{
        ::v-deep.nitrozen-checkbox-container{
            .nitrozen-checkbox{
                top: 8px
            }
        }
    }
    .mb-12{
        margin-top: 10px
    }
}
</style>
<script>
import { 
    NitrozenButton,
    NitrozenInput,
    flatBtn,
    strokeBtn,
    NitrozenChips,
    NitrozenInline,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenRadio,
} from '@gofynd/nitrozen-vue';
import accordion from '@/components/common/accordion.vue';
import DatePicker from '@/components/common/date-picker.vue';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import FinanceService from '@/services/finance.service.js';
import CompanyService from '@/services/company-admin.service';
import find from 'lodash/find';
import { debounce } from '@/helper/utils';
import moment from 'moment';

export default {
    name: 'recon-filters',
    components: {
      //'nitrozen-tab': NitrozenTab,
      NitrozenButton,
      NitrozenInput,
      NitrozenError,
      NitrozenDropdown,
      NitrozenChips,
      NitrozenInline,
      'nitrozen-checkbox': NitrozenCheckBox,
      'nitrozen-radio': NitrozenRadio,
      accordion,
      DatePicker
    },
    directives: {
      flatBtn,
      strokeBtn
    },
    props: {
        pageSize: {
            type: Number,
        },
        statusValueProp: {
            type: Array
        },
        sellerValueProp: {
            type: Array,
        },
        financeDateProp: {
            type:  String,
        },
        companyChipsProp: {
            type: Array,
        },
    },
    computed: {},
    data(){
        return{
            //companyId: '',
            reconDate: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            notBefore: moment().subtract(3, 'months').toISOString(),
            dateRangeShortcuts: [...dateRangeShortcuts],
            fromDate: '',
            toDate: '',
            isValid: false,
            companyChips: this.companyChipsProp.length ? this.companyChipsProp : [],
            //pageSize: this.pageSize,
            sellerNames: [],
            selectedSeller: this.sellerValueProp.length ? this.sellerValueProp : [],
            financeStatusItems: [],
            selectedStatus: this.statusValueProp.length ? this.statusValueProp : [],
            reconDateItems: [],
            selectedReconDate: this.financeDateProp.length ? this.financeDateProp : '',
            storedIndex: null,
            statusValue: [],
            statusText: [],
        };
    },
    mounted(){
        this.getStatus();
        this.getReconDate();
        this.getInitialDates();
        this.fetchCompany();
    },
    methods: {
        searchCompany(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 1000)(e.text);
        },
        storeIndex(index){
            this.storedIndex = index;
        },
        getInitialDates(){
            this.fromDate = moment(this.reconDate[0]).format('DD-MM-YYYY');
            this.toDate = moment(this.reconDate[1]).format('DD-MM-YYYY');
        },
        dateRangeChange() {
            const to_date = moment(this.reconDate[1]).format('DD-MM-YYYY');
            const from_date = moment(this.reconDate[0]).format('DD-MM-YYYY');
            this.fromDate = from_date;
            this.toDate = to_date;
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
                    //this.sellerNames = data.items;
                    let sellers = data.items.map((item) => {
                        return {
                            text: `${item.name} (${item.uid})`,
                            value: String(item.uid)
                        };
                    });
                    this.sellerNames = sellers;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');

                    });
        },
        setCompanyList() {

            console.log(this.selectedSeller);

            let chipsCompanies = this.companyChips.map((it) => it.value);
            let newCompanies = this.selectedSeller.filter(
                (val) => !chipsCompanies.includes(val)
            );
            let removedCompanies = chipsCompanies.filter(
                (val) => !this.selectedSeller.includes(val)
            );

            this.companyChips.push(
                ...this.sellerNames.filter((ele) =>
                    newCompanies.includes(ele.value)
                )
            );

            for (let companyId of removedCompanies) {
                let rmIndex = this.companyChips.findIndex(
                    (item) => item.value === companyId
                );
                this.companyChips.splice(rmIndex, 1);
            }
        },
        removeFromChips(index, item) {
            const comIndex = this.selectedSeller.findIndex((ele) => {
                return ele == item.value;
            });
            this.selectedSeller.splice(comIndex, 1);
            this.companyChips.splice(index, 1);
        },
        getStatus() {
            const params = {
            data:{
                table_name:"config_fields_values",
                filters:{
                    config_field:"ledger_finance_status"
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
            })
            .finally(() => {
                //this.inProgress = false;
            });
        },
        resetDefault(){
            this.statusValue= [];
            this.statusText= [];
        },
        getReconDate() {
            const params = {
            data:{
                table_name:"config_fields_values",
                filters:{
                    config_field:"account_ledger_date"
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
            })
            .finally(() => {
                //this.inProgress = false;
            });
        },
        stopClick(event){
            event.stopPropagation();
        },
        close: function (e) {
            console.log(e);
            this.$emit('drawerClose', e)
        },
        filterDropdown(data, dataList){
            let dropdownData = data.map(item => {
            let d = find(dataList, (obj) => {
                return obj.value === item;
            })
            return d;
            })
            //console.log(dropdownData);
            return dropdownData;
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
            let companyId = this.companyChips.map(item => item.value);
            let companyName = this.companyChips.map(item => item.text);
            const params = {
                data:{
                    report_id:"5781b656-cb52-45fb-bd7a-9e20c4901dd7",
                    start_date:this.fromDate,
                    end_date:this.toDate,
                    page: 1,//this.pageObject.current,
                    pageSize: this.pageSize,
                    filters:{
                        company: companyId.length ? companyId : [],
                        finance_status:this.statusValue.length ? this.statusValue : []
                    },
                    finance_date:this.selectedReconDate,
                    meta:{
                        company: companyName.toString(),
                        finance_status:this.statusText.join(','),
                    }
                }
            }
            this.close({params: params, companyList: this.companyChips});
        },
    }
}
</script>
