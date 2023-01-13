<template>
    <div class="panel">
        <div class="page-container">
            <div class="reports-container">
                <div class="reports-heading">
                    Account and Ledger
                </div>
                <div class="filter-row search-div">
                    <nitrozen-dropdown
                        class="filter-type filter-input-sm"
                        @change="changeFilterType"
                        :items="filterTypeList"
                        v-model="filterType"
                    >
                    </nitrozen-dropdown>
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search filter-input-lg"
                        id="search-bar"
                        type="search"
                        :placeholder="`Search by ${searchPlaceholder}`"
                        v-model="search"
                        @keyup.enter="addeChips()" 
                    ></nitrozen-input>
                    <div
                        class="filter"
                        title="Filter"
                        @click="quickFiltersSection"
                    >
                        <ukt-inline-svg src="filter"></ukt-inline-svg>
                    </div>
                    <div 
                        class="download"
                        title="Download"
                        @click="downloadReport()"
                    >
                        <adm-inline-svg
                            src="report-download"
                        ></adm-inline-svg>
                    </div>
                </div>
                <div class="chip-wrapper inline tag-chips">
                    <div v-for="(tag, index) of tags" :key="index">
                        <nitrozen-chips class="chip">
                            {{ tag }}
                            <nitrozen-inline
                                icon="cross"
                                id="remove-chips"
                                class="nitrozen-icon"
                                @click="removeChip(index)"
                            ></nitrozen-inline>
                        </nitrozen-chips>
                    </div>
                </div>
                <div
                    v-if="inProgress"
                >
                    <fy-loader class="item-loading"></fy-loader>
                </div>
                <div v-else>
                    <mirage-alert
                        :dismissible="true"
                        ref="intro"
                        class="plain"
                        type="plain"
                        v-show="true"
                    >
                        <div class="alert-content">
                            <span>
                                Shipping Fee, Reverse Shipping Fee details will be available in Reports Section
                            </span>
                        </div>
                    </mirage-alert>
                    <div class="above-table">
                        <div class="total-count">
                            Total Results - {{ totalCount }}
                        </div>
                    </div>
                    <div v-if="totalCount != 0">
                        <table
                            class="mirage-table recon-table"
                        >
                            <tr>
                                <td
                                    v-for="(col, index) in tableColumns"
                                    :key="'col-' + index"
                                >
                                    {{ col }}
                                </td>
                            </tr>
                            <template>
                                <!-- tableDataItems -->
                                <tr
                                    v-for="(tab, index) in tableDataItems"
                                    :key="'tab-' + index"
                                >
                                    <template
                                        v-if="tab &&
                                        !tab.isErrorShown"
                                    >
                                        <td>
                                            <span
                                                @click="collapse(tab, index)"
                                                v-if="expandedRow && collapsedRowIndex == index"  
                                            >
                                                <ukt-inline-svg src="arrow-dropdown-black"></ukt-inline-svg>
                                            </span>
                                            <span
                                                @click="expandRow(tab, index)"
                                                v-else
                                            >
                                                <ukt-inline-svg src="arrow-right-black"></ukt-inline-svg>
                                            </span>
                                        </td>
                                        <td
                                            v-for="(item, index) in Object.values(tab).slice(0,tableColumns.length - 2)"
                                            :key="'item-' + index"
                                        >
                                            {{ item }}
                                        </td>
                                        <td>
                                            <nitrozen-badge
                                                v-if="tab[tableColumns.length - 2] === 'reconciled' || tab[tableColumns.length - 2] === 'processed' || tab[tableColumns.length - 2] === 'settled'"
                                                state="success"
                                            >{{ tab[tableColumns.length - 2] }}</nitrozen-badge>
                                            <nitrozen-badge
                                                v-else-if="tab[tableColumns.length - 2] === 'reported' || tab[tableColumns.length - 2] === 'pending'"
                                                state="warn"
                                            >{{ tab[tableColumns.length - 2] }}</nitrozen-badge>
                                            <nitrozen-badge
                                                v-else
                                                state="error"
                                            >Rejected</nitrozen-badge>
                                        </td>
                                    </template>
                                    <template
                                        v-if="tab &&
                                        tab.isErrorShown"
                                    >
                                        <td
                                            :colspan="tableColumns.length"
                                        >
                                            <div class="scrollable-table">
                                                <table class="mirage-table additional-table">
                                                    <tr>
                                                        <td
                                                            v-for="(col, index) in additionColumns"
                                                            :key="'col-' + index"
                                                        >
                                                            {{ col }}
                                                            <!-- <nitrozen-tooltip
                                                                v-if="col === 'Amount'"
                                                                :position="'bottom'"
                                                                :tooltipText="tooltipText"
                                                            ></nitrozen-tooltip> -->
                                                        </td>
                                                    </tr>
                                                    <template>
                                                        <tr>
                                                            <td
                                                                v-for="(item, index) in Object.values(tab).slice(tableColumns.length - 1)"
                                                                :key="'item-' + index"
                                                            >
                                                                <span
                                                                    v-if="item !== true"
                                                                >
                                                                    {{ item || '-' }}
                                                                </span>
                                                                
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </table>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <div v-else>
                        <adm-no-content
                            helperText="No data found"
                        ></adm-no-content>
                    </div>
                </div>
                
                
                <div class="pagination-div">
                    <nitrozen-pagination
                        class="pagination-main"
                        name="Recon"
                        v-model="pageObject"
                        @change="handlePageChanges"
                        :pageSizeOptions="[10, 20, 50, 100]"
                    >
                    </nitrozen-pagination>
                </div>
            </div>
        </div>
        <transition name="slide">
            <template v-if="quickFilters">
                <div class="slide-fade" ref="slide-fade" @click="closeFilter($event)">
                    <div class="container">
                        <recon-filters
                            @drawerClose = "filterSearch($event)"
                            :pageSize = pageObject.limit
                            :statusValueProp = statusValue
                            :sellerValueProp = sellerValue
                            :financeDateProp = financeDate
                            :companyChipsProp = companyChipsList
                        ></recon-filters>
                        <a class="cancel-btn" @click="closeFilter($event)">
                            <ukt-inline-svg
                                :src="'cross-black'"
                            ></ukt-inline-svg>
                        </a>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</template>

<script>
import admInlineSVG from '@/components/common/adm-inline-svg';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import moment from 'moment';
import FinanceService from '@/services/finance.service.js';
import {
    NitrozenButton,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenChips,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';
import ReconFilters from './recon-filters.vue';
import loader from '@/components/common/loader';
import PageEmpty from '@/components/common/page-empty.vue';
import MirageAlert from '@/components/orders/alert.vue';

const PAGINATION_OBJECT = {
    limit: 10,
    current: 0,
    total: 0,
};

export default {
    name: 'reconciliation',
    components: {
        NitrozenDropdown,
        NitrozenInput,
        NitrozenPagination,
        NitrozenBadge,
        NitrozenChips,
        NitrozenInline,
        NitrozenTooltip,
        'adm-inline-svg': admInlineSVG,
        'ukt-inline-svg': UktInlineSvg,
        'fy-loader': loader,
        'adm-no-content': PageEmpty,
        'recon-filters': ReconFilters,
        MirageAlert
    },
    data() {
        return {
            companyId: '',
            filterType: 'bag_id',
            search: '',
            tags:[],
            tableColumns: [''],
            channelValue: [],
            additionColumns: [],
            tableData: {
                type: Object,
                default: () => {},
            },
            tableDataItems: [],
            filterTypeList: [],
            searchPlaceholder: 'Bag ID',
            pageObject: { ...PAGINATION_OBJECT },
            expandedRow: false,
            collapsedRowIndex: 0,
            cacheTabData: [],
            cachedParam: {},
            downloadReportParam: {},
            startDate: '',
            endDate: '',
            inProgress: false,
            isPending: false,
            headers: [],
            primaryHeaders: [],
            count: 0,
            totalCount: 0,
            tableValues: [],
            quickFilters: false,
            statusValue: [],
            sellerValue: [],
            companyChipsList: [],
            financeDate: '',
            tooltipText: 'Net payout = Amount - Shipping fee - Reverse shipping fee'

        };
    },
    computed: {},
    mounted() {
        this.getDates();
        this.changeFilterType();
        this.getSearchByData();
        this.cachedParam = this.initialPayload();
        this.downloadReportParam = this.downloadReportPayload();
        this.generateReport();
    },
    methods: {
        getSearchByData(){
            let params = {
                data:{
                    table_name:"config_fields_values",
                    filters:{
                        "config_field":"search_type_recon"
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
                    this.filterTypeList = res.data.items.map((item) => {
                        return {
                            text: item.display_name,
                            value: item.name,
                            id: item.id
                        };
                    })
                    /* this.fulfillmentModel.unshift({
                        text: `All`,
                        value: 'All',
                        id: 111
                    }); */
                    //console.log(res);
                })
                .catch((err)=> {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                    //console.log(err);
                })
                .finally(() => {
                    //this.inProgress = false;
                });
        },
        initialPayload(){
            let params = {
                data:{
                    report_id:"5781b656-cb52-45fb-bd7a-9e20c4901dd7",
                    start_date:this.startDate,
                    end_date:this.endDate,
                    page:this.pageObject.current,
                    pageSize:this.pageObject.limit,
                    filters:{
                        //company: this.companyId ? [this.companyId] : [],
                    },
                    meta:{
                        //company:this.profileDetails.name,
                    }
                }
            }
             return params;
        },
        downloadReportPayload(){
            //this.companyId = getCompInfo();
            let params = {
                data:{
                    report_id:"0c09c7e7-0839-43c1-a2bf-76e08478fa95",
                    start_date:this.startDate,
                    end_date:this.endDate,
                    page:this.pageObject.current,
                    pageSize:this.pageObject.limit,
                    filters:{
                        //company: this.companyId ? [this.companyId] : [],
                    }
                }
            }
             return params;
        },
        getDates(){
            this.endDate = new Date().toISOString().slice(0, 10);
            this.startDate = moment(this.endDate).subtract(1, 'months').format('DD-MM-YYYY');
            this.endDate = moment(this.endDate).format('DD-MM-YYYY');
        },
        generateReport(){
            this.inProgress = true;
            this.cachedParam.data.report_id = '5781b656-cb52-45fb-bd7a-9e20c4901dd7';
            const caller = FinanceService.generateReport(this.cachedParam);
            caller
                .then(( res ) => {
                    this.inProgress = true;
                    this.tableData = res.data.data;
                    this.totalCount = this.tableData.item_count;
                    this.generateListData(this.tableData);
                    this.pageObject.total = this.tableData.item_count;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    this.expandedRow = false;
                    this.inProgress = false;
                });
        },
        changeFilterType() {
            if (this.filterType === 'bag_id') {
                this.searchPlaceholder =
                    'Bag ID';
            } else {
                const filterData = this.filterTypeList.filter((ele) => {
                    return ele.value === this.filterType;
                })[0];
                this.searchPlaceholder = filterData.text;
            }
        },
        handlePageChanges(e) {
            this.pageObject = e;
            this.cachedParam.data.page = this.pageObject.current;
            this.cachedParam.data.pageSize = this.pageObject.limit;
            this.generateReport();
        },
        expandRow(tab, expandedIndex) {
            if(tab.isErrorShown){
                this.collapse(tab,expandedIndex);
            }
            else{
                this.tableDataItems.map((item, index) => {
                    if( item.isErrorShown){
                        this.collapse(item, index-1);
                    }
                })
                this.collapsedRowIndex = expandedIndex;
                this.cacheTabData = tab;
                this.expandedRow = true;
                this.tableDataItems.splice(expandedIndex + 1, 0, {...tab, isErrorShown : true });
            }
        },
        collapse(tab, index){
            this.expandedRow = false;
            delete tab.isErrorShown;
            this.tableDataItems.splice(index + 1, 1);
        },
        filterSearch(e){
            if(e){
                this.companyChipsList = e.companyList;
                this.quickFilters = false;
                this.expandedRow  = false;
                this.statusValue = [];
                this.sellerValue =[];
                this.financeDate = '';
                if(e.params.data){
                    if(e.params.data.filters.finance_status.length){
                        this.statusValue = e.params.data.filters.finance_status;
                    }
                    if(e.params.data.filters.company.length){
                        this.sellerValue = e.params.data.filters.company;
                    }
                    if(e.params.data.finance_date.length){
                        this.financeDate = e.params.data.finance_date;
                    }
                    this.inProgress = true;
                    this.cachedParam = e.params;
                    this.downloadReportParam = e.params;
                    this.generateReport();
                }
            }
            else{
                this.quickFilters = false;
            }
        },
        reset(){
            this.tableDataItems = [];
            this.headers = [];
            this.primaryHeaders = [];
            this.tableColumns = [''];
        },
        generateListData(data) {
            this.reset();
            this.headers = data.headers;
            this.primaryHeaders = data.primary_headers;
            this.tableColumns = [...this.tableColumns, ...this.primaryHeaders];
            let values = data.items;
            this.tableValues = data.items;
            //Ensure primary Headers are part of headers
            /* const valid = this.primaryHeaders.every((val) =>
            this.headers.includes(val)
            ); */
            let excludedPrimaryHeaders = this.headers.filter(val => !this.primaryHeaders.includes(val));
            this.additionColumns = excludedPrimaryHeaders;
            values.forEach((v) => {
            if (v.length === this.headers.length) {
                let m = {};
                for (let i = 0; i < this.headers.length; i++) {
                    m[i] = v[i];
                }
                this.tableDataItems.push(m);
            }
            });
        },
        downloadReport(){
            this.downloadReportParam.data = {...this.downloadReportParam.data, report_id:"0c09c7e7-0839-43c1-a2bf-76e08478fa95"};
            const caller = FinanceService.generateReport(this.downloadReportParam);
            caller
                .then(( res ) => {
                    this.$snackbar.global.showSuccess(
                        res.data.data.message
                    );
                    
                    this.getGeneratedReport();
                    this.count = 0;
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
            const caller = FinanceService.getReport(this.downloadReportParam);
            caller
                .then(( res ) => {
                    if(res.data.items[0].status == 'Failed' && res.data.items[0].msg == 'No data available.'){
                        this.$snackbar.global.showError(
                            `Report Download failed`
                        );
                    }
                    this.isPending = ['pending','in process'].includes(res.data.items[0].status.toLowerCase());
                    if( this.isPending && this.count < 15 ){
                        this.autoRefresh();
                    }

                    if(res.data.items[0].download_link){
                        let url = res.data.items[0].download_link;
                        window.open(url);
                    }
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {
                    if(this.isPending && this.count == 15){
                        this.$snackbar.global.showError(
                            `No Report found to download at this moment`
                        );
                    }
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
        addeChips(){
            if(this.search.length){
                let tempArray = this.search.replace(/ /g, "").split(",");
                this.search = '';
                this.tags = [...this.tags, ...tempArray];
                this.cachedParam.data['search'] = this.tags.toString();
                this.cachedParam.data['search_type'] = this.filterType;
                this.downloadReportParam.data['search'] = this.tags.toString();
                this.downloadReportParam.data['search_type'] = this.filterType;
                this.generateReport();
            }
        },
        removeChip(index) {
            this.tags.splice(index, 1);
            this.cachedParam.data['search'] = this.tags.toString();
            if(this.tags.length){
                this.cachedParam.data['search_type'] = this.filterType;
            } 
            this.generateReport();
        },
        closeFilter: function (e) {
            e.stopPropagation();
            this.quickFilters = false;
        },
        quickFiltersSection: function () {
            this.quickFilters = !this.quickFilters;
        },
    }
}
</script>

<style lang="less" scoped>
@import '../less/page-ui.less';
@import '../less/page-header.less';
@import '../less/form.less';

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
        display: flex;
        flex-direction: column;
        gap: 15px;
        .reports-heading {
            font-size: 20px;
            line-height: 24px;
            font-weight: 600;
        }
        .filter-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            gap:15px;
            max-width: 100%;
            font-size: 14px;
            padding: 10px;
            background: #F8F8F8;
            border-radius: 4px;

            @media @mobile {
                flex-direction: column;
            }

            .filter-input-sm {
                min-width: 100px;
                width: 150px;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-lg {
                min-width: 250px;
                flex-grow: 2;
                @media @mobile {
                    width: 100%;
                }
            }

            .filter{
                cursor: pointer;
                ::v-deep svg {
                    width: 40px;
                    height: 40px;
                    #prefix__Imported-Layers {
                        stroke: @RoyalBlue;
                    }
                }
            }

            .download {
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
        }
        .above-table {
            display: flex;
            margin: 10px 0;
            justify-content: space-between;
            .total-count{
                font-size: 15px;
            }

            .download {
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
        }

        //mirage table
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
            }
        }
        .recon-table {
            overflow-x: auto;

            tr:first-child {
                border: 1px solid #E0E0E0;
                //font-weight: 500;
            }
            td {
                vertical-align: middle;
                max-width: 170px;
            }
            .scrollable-table {
                width: 100%;
                overflow-x: auto;
            }
            .additional-table {
                tr:first-child {
                    border: none;
                }
                tr:not(:first-child) {
                    border-bottom: none;
                }
                td {
                    vertical-align: middle;
                    min-width: 130px;
                    font-weight: 500;
                }
                td:first-child{
                    min-width: 170px;
                }
            }
        }

        .tag-chips {
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            ::v-deep .nitrozen-chip{
                border-radius: 4px;
            }
        }
        .inline {
            display: flex;
        }
    }

    .slide-fade {
        height: 100%;
        position: fixed;
        top: 0px;
        right: 0px;
        width: 100%;
        background-color: rgba(82, 78, 78, 0.52);
        z-index: @shipmentDrawer;
        .container {
            position: absolute;
            right: 0px;
            width: 35%;
            height: 100%;
            background: @White;
            overflow-y: scroll;
            box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
            &::-webkit-scrollbar {
                display: none;
            }
            @media @mobile {
                position: fixed;
                width: 100%;
            }
            .cancel-btn {
                position: absolute;
                top: 15px;
                right: 20px;
                cursor: pointer;
            }
        }
    }
    .plain {
    //margin-top: 24px;
    background-color: #e7eeff;
    color: #666666;
}
}
</style>
