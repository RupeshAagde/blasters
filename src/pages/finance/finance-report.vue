<template>
    <div class="panel">
        <div class="page-container">
            <div class="reports-container">
                <div class="reports-heading">
                    Generate Report
                </div>
                <div class="reports-filter">
                    <nitrozen-dropdown
                        id="report-type"
                        label="Report Type"
                        :items="reportType"
                        v-model="selectedReportType"
                        @searchInputChange="clearDD('report-type')"
                        @change="getReportDesc(selectedReportType)"
                        placeholder="Report Type"
                        :required="true"
                    ></nitrozen-dropdown>
                    <nitrozen-dropdown
                        id="seller-name"
                        :label="'Seller Name'"
                        :items="sellerNames"
                        v-model="selectedSeller"
                        :searchable="true"
                        :multiple="true"
                        @searchInputChange="searchCompany"
                        @change="setCompanyList"
                    ></nitrozen-dropdown>
                    <!-- @searchInputChange="searchCompany($event.text)" -->
                    <nitrozen-dropdown
                        id="fullfilment-type"
                        label="Fulfillment Model"
                        :items="fulfillmentModel"
                        v-model="selectedModel"
                        :disabled="locationDisable"
                        :searchable="true"
                        :multiple="true"
                        @change="runLocation()"
                        :placeholder="`${selectedModel ? selectedFMT() : 'Fulfillment Model'}`"
                    ></nitrozen-dropdown>
                    <nitrozen-dropdown
                        id="location-id"
                        :items="locationID"
                        v-model="selectedID"
                        :multiple="true"
                        :searchable="true"
                        :disabled="haveFM"
                        :label="'Location ID'"
                        :placeholder="`${ selectedID ? selectedIDT() : 'Location ID'}`"
                    >
                    </nitrozen-dropdown>
                    <!-- @searchInputChange="clearDD('location-id')" -->
                </div>
                <div 
                    v-if="selectedReportType"
                    class="report-description"
                >
                    <span>
                        Report Description : {{ reportDescription }}
                    </span>
                </div>
                <div class="reports-action">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        :disabled="!selectedReportType"
                        @click="openReportGenerationDialog"
                        >Generate</nitrozen-button
                    >
                </div>
                <nitrozen-chips
                    v-for="(item, index) in companyChips"
                    :key="'company' + index"
                    class="mb-12"
                >
                    {{ item.text }}
                    <nitrozen-inline
                        :icon="'cross'"
                        class="nitrozen-icon"
                        v-on:click="removeFromChips(index, item)"
                    ></nitrozen-inline>
                </nitrozen-chips>
            </div>
        </div>
        <div class="page-container">
            <div class="reports-container">
                <div class="tab-row">
                    <nitrozen-tab
                        ref="tabs"
                        class="tabs"
                        @tab-change="tabChange"
                        :tabItem="reportTab.map((s) => s.text)"
                        :active-index="selectedReportTabIndex"
                        :key="selectedReportTabIndex"
                    ></nitrozen-tab>
                </div>
                <mirage-alert
                    :dismissible="true"
                    ref="intro"
                    class="plain"
                    type="plain"
                    v-show="true"
                >
                    <div class="alert-content">
                        <span>
                            Below list only shows reports generated in last 24 hours.
                        </span>
                    </div>
                </mirage-alert>
                <div class="tab-contents">
                    <div v-if="inProgress">
                       <fy-loader class="item-loading"></fy-loader>
                    </div>
                    <div v-else>
                        <mirage-alert
                            :dismissible="true"
                            class="error"
                            type="error"
                            v-if="isEmptyReport"
                        >
                            <div class="alert-content">
                                <span>
                                    The Report you tried to generate from date: {{ newReport.start_date }} - {{ newReport.end_date }}, seems empty. Please try again with different date range
                                </span>
                            </div>
                        </mirage-alert>
                        <table
                            class="mirage-table"
                            v-if="tableData.items && tableData.items.length"
                        >
                            <tr>
                                <td
                                    v-for="(col, index) in tableColumns"
                                    :key="'col-' + index"
                                >
                                    {{ col.toUpperCase() }}
                                </td>
                            </tr>
                            <template>
                                <tr
                                    v-for="(tab, index) in tableData.items"
                                    :key="'tab-' + index"
                                >
                                    <template 
                                        v-if="tab &&
                                        !tab.isErrorShown"
                                    > <!-- v-if="['pending','completed','in-progress','failed'].includes(tab.status.toLowerCase())" in case we need some checks based on status -->
                                        <td>{{ tab.display_name }}</td>
                                        <td>
                                            <span
                                                :title="tab.meta.seller_name"
                                                v-if="
                                                    tab.meta &&
                                                    tab.meta.seller_name
                                                "
                                            >
                                                <span class="report-channels"> {{ formatStrings(tab.meta.seller_name) }} </span>
                                                <span class="high-light" v-if="dataLength(tab.meta.seller_name) > 0"> +{{ dataLength(tab.meta.seller_name) }} more</span>
                                            </span>
                                            <span 
                                                :title="tab.meta.company"
                                                v-else-if="
                                                    tab.meta &&
                                                    tab.meta.company
                                                "
                                            >
                                                <span class="report-channels"> {{ formatStrings(tab.meta.company) }} </span>
                                                <span class="high-light" v-if="dataLength(tab.meta.company) > 0"> +{{ dataLength(tab.meta.company) }} more</span>
                                            </span>
                                            <span v-else>
                                                All
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :title="tab.meta.fulfilment_type || tab.meta.program_type"
                                                v-if="
                                                    tab.meta &&
                                                    (tab.meta.fulfilment_type || tab.meta.program_type)
                                                "
                                            >
                                                <span class="report-channels"> {{ formatStrings(tab.meta.fulfilment_type || tab.meta.program_type) }} </span>
                                                <span class="high-light" v-if="dataLength(tab.meta.fulfilment_type || tab.meta.program_type) > 0"> +{{ dataLength(tab.meta.fulfilment_type || tab.meta.program_type) }} more</span>
                                            </span>
                                            <span v-else>
                                                All
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                :title="tab.meta.fulfilment_type_id || tab.meta.program_type_id"
                                                v-if="
                                                    tab.meta &&
                                                    (tab.meta.fulfilment_type_id || tab.meta.program_type_id)
                                                "
                                            >
                                               <span class="report-channels"> {{ formatStrings(tab.meta.fulfilment_type_id || tab.meta.program_type_id) }} </span>
                                                <span class="high-light" v-if="dataLength(tab.meta.fulfilment_type_id || tab.meta.program_type_id) > 0"> +{{ dataLength(tab.meta.fulfilment_type_id || tab.meta.program_type_id) }} more</span>
                                            </span>
                                            <span v-else>
                                                All
                                            </span>
                                        </td>
                                        <td 
                                            v-if="tab.created_at"
                                            class="create-time"
                                        >
                                            {{ dateFormat(tab.created_at) }}
                                        </td>
                                        <td v-if="tab.requested_by">
                                            {{ tab.full_name }}
                                        </td>
                                        <td>
                                            <span
                                                class="report-download"
                                                v-if="tab.download_link"
                                                @click="openLink(tab.download_link)"
                                                title="Download Report"
                                            >
                                                <ukt-inline-svg src="report-download"></ukt-inline-svg>
                                            </span>
                                            <span
                                                v-else-if="inPending(tab)"
                                            >
                                                {{ tab.status }}
                                            </span>
                                            <span
                                                v-else
                                                
                                                title="No Download Link"
                                            >
                                                <span
                                                    id="hide-error"
                                                    class="report-issue"
                                                    @click="hideAlert(tab, index)"
                                                    v-if="errorAlert && errorIndex == index"
                                                >
                                                    <ukt-inline-svg src="cross-black"></ukt-inline-svg>
                                                </span>
                                                <span
                                                    id="report-error-btn"
                                                    class="report-issue"
                                                    @click="showError(tab, index)"
                                                    v-else
                                                >
                                                    <ukt-inline-svg src="report-error"></ukt-inline-svg>
                                                </span>
                                            </span>
                                        </td>
                                    </template>
                                    <template 
                                        v-if="tab &&
                                        tab.isErrorShown"
                                    >
                                        <td colspan="8">
                                            <mirage-alert
                                                ref="intro"
                                                type="error"
                                                @close="hideAlert"
                                            >
                                                <div class="alert-content">
                                                    <span v-if="noData">
                                                        The Report you tried generating is empty, please generate a new Report with different filters
                                                    </span>
                                                    <span v-else>
                                                        The Report you tried to generate failed due to some technical issue
                                                    </span>
                                                    <nitrozen-button
                                                        v-if="!noData"
                                                        :theme="'secondary'"
                                                        class="retry-button"
                                                        v-flatBtn
                                                        @click="generateReport"
                                                    >Try again</nitrozen-button
                                                    >
                                                </div>
                                            </mirage-alert>
                                        </td>
                                    </template>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <div class="pagination-div">
                        <nitrozen-pagination
                            class="pagination-main"
                            name="Orders"
                            v-model="pageObject"
                            @change="handlePageChanges"
                            :pageSizeOptions="[10, 20, 50, 100]"
                        >
                        </nitrozen-pagination>
                    </div>
                </div>
            </div>
        </div>
        <report-generation-dialog
            ref="reportGenerationDialog"
            title="Select Start Date and End Date"
            @close="$dialogClosed"
        >
        </report-generation-dialog>
    </div>
</template>

<script>
import MirageAlert from '@/components/orders/alert.vue';
import ReportGenerationDialog from './report-generation-dialog.vue';
import moment from 'moment';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import CompanyService from '@/services/company-admin.service';
import FinanceService from '@/services/finance.service.js';
//import loader from '@/components/admin/common/adm-loader.vue';
import loader from '@/components/common/loader';
import { debounce } from '@/helper/utils';
import find from 'lodash/find';
import {
    NitrozenButton,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn,
    clickOutside,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenPagination,
    NitrozenTab,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenBadge,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

const PAGINATION_OBJECT = {
    limit: 10,
    current: 1,
    total: 0,
};

export default {
    name: 'finance',
    components: {
        //AdmPageHeader,
        NitrozenButton,
        NitrozenToggleBtn,
        flatBtn,
        strokeBtn,
        clickOutside,
        NitrozenDropdown,
        NitrozenInput,
        NitrozenPagination,
        NitrozenTab,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenChips,
        NitrozenInline,
        MirageAlert,
        //CsvView,
        'nitrozen-badge': NitrozenBadge,
        //'adm-inline-svg': adminlinesvg,
        'ukt-inline-svg': UktInlineSvg,
        'fy-loader': loader,
        ReportGenerationDialog,
    },
    computed: {},
    directives: { flatBtn, strokeBtn, clickOutside },
    data() {
        return {
            reportTab: [
                { text: 'Download Reports', value: 'download-report' },
                /* { text: 'View Schedules', value: 'view-schedule' }, */
            ],
            fulfillmentModel: [],
            testList: [],
            selectedTest: '',
            locationID: [],
            sellerNames: [],
            selectedSeller: [],
            selectedSellerList: [],
            companyChips: [],
            selectedModel: [],
            selectedID: [],
            selectedReportTabIndex: 0,
            locationDisable: true,
            haveFM: true,
            reportType: [],
            pageObject: { ...PAGINATION_OBJECT },
            startDate: '',
            endDate: '',
            inProgress: false,
            selectedReportType: '',
            reportDescription: '',
            errorAlert: false,
            itemsLength: 0,
            isEmptyReport: false,
            isPending: false,
            cacheParams: {},
            errorIndex: null,
            companyId: '',
            count: 0,
            noData: false, 
            newReport: {},
            tableData: {},
            tableColumns: [ 'Report Type','Seller Name','Fulfillment Mode','Location ID','Order Date','Generated By','Action'],
        };
    },
    mounted() {
        
        this.getDates();
        this.getFulfilment();
        this.fetchCompany();
        this.getGeneratedReport();
        if(this.selectedModel.length > 0 && this.locationDisable == false && this.selectedModel !== 'DFC'){
            this.haveFM = false;
            this.getLocation();
        }
        this.getReportType();
    },
    methods: {
        getLocation(){
            let sellerID = this.selectedSeller.toString();
            this.locationID = [];
            const caller = FinanceService.getLocationIDAdmin(sellerID);
            caller
                .then((res) => {
                    this.locationID = res.data.items.map((item) => {
                        return {
                            text: item.code,
                            value: item.instance_code ? item.instance_code : '',
                            name: item.name
                        }
                    })
                })
                .catch((err) => {
                    this.$snackbar.global.showError('No Location IDs found'); 
                })
        },
        runLocation(){
            let hasDFC = false;
            if(this.selectedModel.length === 1 && this.selectedModel[0] == 'DFC'){
                hasDFC = true;
            }
            if(this.selectedModel.length && this.locationDisable == false && !hasDFC ){
                this.haveFM = false;
                this.filterFulfillment();
                this.getLocation();
            }else{
                this.haveFM = true;
                this.selectedID = [];
            }
        },
        searchCompany(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 1000)(e.text);
            //this.fetchCompany({q: e.text});
        },
        /* companySearch: debounce(function(e) {
            if (e.length === 0) {
                this.setRouteQuery({ search: undefined });
            }
            if (e && e.text) {
                this.searchText = e.text;
            } else {
                this.searchText = '';
            }
            
            this.getCompanyList();
        }, 500), */
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
                    /* sellers.unshift({
                        text: `All`,
                        value: 'all'
                    }); */
                    this.sellerNames = sellers;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                });
        },
        getDates(){
            this.endDate = new Date().toISOString().slice(0, 10);
            this.startDate = moment(this.endDate).subtract(1, 'months').format('YYYY-MM-DD');
        },
        tabChange(e, query = null) {
            if (this.reportTab[e.index]) {
                this.selectedReportTab = this.reportTab[e.index].value;
                this.selectedReportTabIndex = e.index;
            } else {
                this.selectedReportTab = 'download-report';
                this.selectedReportTabIndex = 0;
            }
        },
        getFulfilment(){
            let params = {
                data:{
                    table_name:"config_fields_values",
                    filters:{
                        "config_field":"program_type"
                    },
                    project:[
                        "id",
                        "name",
                        "display_name"
                    ]
                }
            }

            const caller = FinanceService.getChannel(params);
            caller
                .then((res) => {
                    this.fulfillmentModel = res.data.items.map((item) => {
                        return {
                            text: item.display_name,
                            value: item.name,
                            id: item.id
                        };
                    })
                })
                .catch((err)=> {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    //this.inProgress = false;
                });
        },
        handlePageChanges(e) {
            this.pageObject = e;
            this.getGeneratedReport();
            /* const query = {
                page: this.pageObject.current,
                limit: this.pageObject.limit,
            }; */
            //this.setRouteQuery(query);
        },
        /* setRouteQuery: function (query) {
            if (
                query.activeTab ||
                query.search ||
                query.status ||
                query.page ||
                query.limit ||
                query.from_date ||
                query.to_date
            ) {
                this.$router
                    .push({
                        path: this.$route.path,
                        query: {
                            ...this.$route.query,
                            ...query,
                        },
                    })
                    .catch(() => {});
            }
        }, */
        getReportType() {
            const params = {
                data:{
                    role_name:"[\"finance_admin\"]",
                    listing_enabled:true
                }
            }

            const caller = FinanceService.getReportType(params);
            caller
                .then(( res ) => {
                    this.reportType = res.data.items.map((item) => {
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
        getGeneratedReport(){
            const params = {
                data:{	
                    start_date:this.startDate,
                    end_date:this.endDate,
                    page:this.pageObject.current,
                    pageSize:this.pageObject.limit
                }
            }

            const caller = FinanceService.getReport(params);
            caller
                .then(( res ) => {
                    if(res.data.items.length){
                        this.isEmptyReport = res.data.items[0].status == 'Failed' && res.data.items[0].msg == 'No data available.' ? true : false;
                        this.newReport = res.data.items[0];
                        /* res.data.items = res.data.items.filter((item) => {
                            return item.status !== 'Failed' || item.msg !== 'No data available.';
                        }); */
                        this.tableData = res.data;
                        this.pageObject.total = res.data.item_count;
                        this.isPending = this.tableData.items.some(item => {
                            return ['pending','in process'].includes(item.status.toLowerCase());
                        });
                        if( this.isPending && this.count < 15 ){
                            this.autoRefresh();
                        }
                    } 
                    
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    this.errorAlert = false;
                    this.inProgress = false;
                });
        },
        autoRefresh(){
            setTimeout(() => {
                this.count++;
                this.getGeneratedReport();
                this.inProgress = false;
            }, 10000);
        },
        formatStrings(str){
            let dataArray = str.split(',');
            return dataArray[0];
        },
        dataLength(str){
            let dataArray = str.split(',');
            let arrLength = dataArray.length - 1;
            this.itemsLength = arrLength;
            return arrLength;
        },
        openReportGenerationDialog() {
            let report = find(this.reportType,(item) => {
                return item.value === this.selectedReportType;
            });
            let companyId = this.companyChips.map(item => item.value);
            let companyName = this.companyChips.map(item => item.text);
            this.$refs.reportGenerationDialog.open({
                reportType: this.selectedReportType,
                displayDate: report.date,
                program_type: this.selectedModel,
                program_type_id: this.selectedID,
                sellerId: companyId,
                sellerName: companyName
            });
        },
        $dialogClosed(data) {
            this.inProgress = true;
            this.errorAlert = false;
            this.count = 0;
            setTimeout(() => {
                this.getGeneratedReport();
                this.inProgress = false;
            }, 3000);
        },
        setCompanyList() {
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
        filterFulfillment() {
            let selectedFM = this.selectedModel.map(item => {
                let fulfilmentItem = find(this.fulfillmentModel,(obj) => {
                    return obj.value === item;
                });
                return fulfilmentItem;
            });
            return selectedFM;
        },
        /////can be used in future
        /* selectedSellerName(){
            let sellerName = this.selectedSeller.map(item => {
                let name = find(this.sellerNames,(obj) => {
                    return obj.value === item;
                });
                return name.text;
            });
            return sellerName;
        }, */
        selectedFMT(){
            let fulfilmentName = this.selectedModel.map(item => {
                let name = find(this.fulfillmentModel,(obj) => {
                    return obj.value === item;
                });
                return name.text;
            });
            return fulfilmentName;
        },
        selectedIDT(){
            let rfcID = this.selectedID.map(item => {
                let name = find(this.locationID,(obj) => {
                    return obj.value === item;
                });
                return name.text;
            });
            return rfcID;
        },
        openLink(e){
            this.errorAlert = false;
            window.open(e);
        },
        /* selectedReport(){
            this.selectedReportType = '';
        }, */
        getReportDesc(reportValue){
            const cnReports = new Set([
                'Commercial Credit Note Report',
                'Commercial Debit Note Report',
                'GST Credit Note Report',
                'GST Debit Note Report',
                'Disbursement Compliance Report',
                'Payout Disbursement Report',
                'Invoice Summary',
                'Payment Failure',
                'GSTR1 Registered',
                'GSTR1 Unregistered'
            ]);
            //let cnReports = ['Commercial Credit Note Report','Commercial Debit Note Report','GST Credit Note Report','GST Debit Note Report'];
            let reportSelected = find(this.reportType,(obj) => {
                if(obj.value === reportValue){
                    this.locationDisable = cnReports.has(obj.text);
                    this.haveFM = true;
                    this.selectedModel = [];
                    this.selectedID = [];
                }
                return obj.value === reportValue
            });
            this.reportDescription = reportSelected.description;
        },
        dateFormat(date){
            return moment.unix(date).format('DD-MM-YYYY HH:mm a');
        },
        showError(cache, index){
            if(cache.msg == 'No data available.'){
                this.noData = true;
            }
            this.errorIndex = index;
            this.cacheParams = cache;
            this.errorAlert = true;
            this.tableData.items.splice(index + 1, 0, {...cache, isErrorShown : true });
        },
        hideAlert(cache ,index){
            this.noData = false;
            this.errorAlert = false;
            delete cache.isErrorShown;
            this.tableData.items.splice(index + 1, 1);
        },
        generateReport(){
            const params = {
                data:{
                    report_id: this.cacheParams.report_config_id,
                    start_date: this.cacheParams.start_date,
                    end_date: this.cacheParams.end_date,
                    filters: JSON.parse(JSON.stringify(this.cacheParams.filters)),
                    meta: JSON.parse(JSON.stringify(this.cacheParams.meta))
                }
            };
            this.inProgress = true;
            const caller = FinanceService.generateReport(params);
            caller
                .then(( res ) => {
                    this.$snackbar.global.showSuccess(
                            'Generating Reports...'
                        );
                    this.inProgress = true;
                    this.getGeneratedReport();
                    this.count = 0;
                })
                .catch((err) => {
                    his.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        inPending(tab){
            return ['pending','in process'].includes(tab.status.toLowerCase());
        },
        clearDD(str){
            switch(str){
                case 'report-type':
                    this.selectedReportType = '';
                    this.locationDisable = true;
                    break;
                case 'fulfillment-type':
                    this.selectedModel = '';
                    this.haveFM = true;
                    break;
                case 'location-id':
                    this.selectedID = '';
                    break;
            }
        }
    },
};
</script>

<style lang="less" scoped>
@import '../less/page-ui.less';
@import '../less/page-header.less';
@import '../less/form.less';
/* /deep/.nitrozen-pagination__left {
    visibility: hidden;
} */
.plain {
    margin-top: 24px;
    background-color: #e7eeff;
    color: #666666;
}

.panel{
    background: none;
}
.error {
    margin: 24px 0;
}
.tab-contents {
    margin-top: 24px;
    .item-loading{
        position: relative;
        z-index: 3;
    }
    .mirage-table {
        width: 100%;
        margin-bottom: 24px;
        font-family: Inter, sans-serif;
        font-size: 14px;
        overflow-x: auto;

        tr:first-child {
            border: 1px solid #E0E0E0;
            background: @Alabaster2;
            color: @Black;
        }
        tr:not(:first-child) {
            border-bottom: 1px solid @Iron;
        }
        td {
            text-align: center;
            padding: 16px 6px;
            vertical-align: middle;
            max-width: 120px;
            .report-channels{
                display: table-cell;
                position: relative;
                max-width: 120px;
                white-space: nowrap;
                overflow: hidden !important;
                text-overflow: ellipsis;
            }
            .high-light {
                font-weight: bold;
                color: @RoyalBlue;
            }
            .report-download {
                cursor: pointer;
                display: flex;
                padding: 0 7px;
                justify-content: space-around;
                ::v-deep svg{
                    width: 30px;
                    height: 30px;
                    fill: @RoyalBlue;
                    #prefix__Layer_1 {
                        stroke: @RoyalBlue;
                    }
                }
            }
            .report-issue {
                cursor: pointer;
                display: flex;
                padding: 0 7px;
                justify-content: space-around;
                ::v-deep svg{
                    width: 30px;
                    height: 30px;
                    #prefix__Stroke-1,
                    #prefix__Group-28,
                    #prefix__Group-13 {
                        stroke: red;
                    }
                }
                ::v-deep svg{
                    #prefix__Imported-Layers-Copy-6 {
                        stroke: red;
                    }
                    #prefix__Rectangle {
                        stroke: white;
                    }
                }
                ::v-deep svg{
                    #prefix__Stock_cut {
                        stroke: red;
                    }
                    circle {
                        stroke: red;
                    }
                    path {
                        stroke: red;
                    }
                }
            }
            .create-time {
                word-break:break-all;
            }
        }
    }
    .alert-content {
        width: 100%; //will be removed after removing close icon
        display: flex;
        justify-content: space-between;
        align-items: center;

        .retry-button {
            background-color: red;
            margin-right: 8px;
        }
    }
}
.page-container {
    margin: 0;
    margin-bottom: 24px;
    width: auto;
    border: 1px solid #E0E0E0;
    .reports-container {
        ::v-deep ::placeholder { 
            color:#000;
        }
        width: 100%;
        background-color: @White;
        border-radius: 12px;
        .tab-row {
            border-bottom: 1px solid #dcdcdc;
            .nitrozen-tab-item ::v-deep {
                padding-bottom: 12px;
            }
        }
        .reports-heading {
            font-size: 20px;
            line-height: 24px;
            font-weight: 600;
        }
        .report-description {
            margin-top: 10px;
            font-size: 12px;
            span {
                color: #666666;
            }
        }
    }
}
::v-deep .titlize {
    text-transform: capitalize;
}
.reports-action {
    display: flex;
    margin-top: 24px;
    gap: 12px;
}
.reports-filter {
    display: flex;
    justify-content: flex-start;
    gap: 25px;
    width: 100%;
    align-items: center;
    margin-top: 24px;

    @media @mobile {
        flex-direction: column;
    }
}
.mb-12{
    margin-top: 10px
}
</style>
