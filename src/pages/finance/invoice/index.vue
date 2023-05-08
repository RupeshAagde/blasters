<template>
    <div class="main-container">
        <div class="jumbotron-container">
            <jumbotron :title="'Invoices'" :desc="'Invoices'"></jumbotron>
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
                        @change="filterByCompany"
                        @searchInputChange="searchCompany"
                    ></nitrozen-dropdown>
                </div>
                <div class="date-filter filter-item">
                    <date-picker
                        @input="onDateChange"
                        class="date-picker filter-input-sm"
                        picker_type="date"
                        date_format="MMM Do, YY"
                        v-model="InvoiceDateRange"
                        :clearable="true"
                        :range="true"
                        :not_before="new Date(0).toISOString()"
                        :shortcuts="dateRangeShortcuts"
                        :useNitrozenTheme="true"
                    />
                </div>
                <div
                    class="advanced-filter filter-item"
                    @click="openFilterDrawer()"
                >
                    <div class="advanced-filter-btn">More Filters</div>
                </div>
            </div>
        </div>
        <transition name="slide">
            <div class="invoice-drawer-container" v-if="isFilterDrawerOpen">
                <filter-drawer
                    @closeFilterDrawer="closeFilterDrawer"
                ></filter-drawer>
            </div>
        </transition>
        <transition name="slide">
            <div class="invoice-drawer-container" v-if="isDrawerOpen">
                <invoice-drawer
                    :invoice="invoice"
                    @closeDrawer="handleCloseDrawer"
                ></invoice-drawer>
            </div>
        </transition>
        <div
            class="table-container"
            v-if="
                invoiceDetails &&
                invoiceDetails.items &&
                invoiceDetails.items.length > 0
            "
        >
            <div v-if="bulkDownloadList.length" class="bulk-download-container">
                {{ bulkDownloadList.length }} Selected
                <nitrozen-button
                    @click="downloadInvoice(bulkDownloadList)"
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
                        <th v-for="(header,index) in invoiceDetails.headers" :key="index">
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template
                        v-if="
                            invoiceDetails.items &&
                                invoiceDetails.items.length > 0
                        "
                    >
                        <tr
                            v-for="(invoice, i) in invoiceDetails.items"
                            :key="i"
                        >
                            <td>
                                <nitrozen-checkbox
                                    class="table-checkout"
                                    @change="
                                        toggleInvoice(invoice.invoice_number)
                                    "
                                    :value="
                                        selectedInvoices.includes(invoice.invoice_number)
                                            ? true
                                            : false
                                    "
                                    :disabled="!invoice.is_downloadable"
                                >
                                <!-- :disabled="invoice.status != 'paid'" THE CONDITION MIGHT CHANGE -->
                                </nitrozen-checkbox>
                            </td>
                            <!-- <td v-for="(item, index) in Object.values(invoice).slice(0, invoiceDetails.headers.length - 1)" :key="index">
                                <span v-if="item && item.length > 0">{{ item }}</span>
                                <span v-else> - </span>
                            </td> -->
                            <td :title="invoice.company" class="company">{{ invoice.company }}</td>
                            <td>{{ invoice.invoice_number }}</td>
                            <td>{{ invoice.invoice_type }}</td>
                            <td>{{ invoice.invoice_date }}</td>
                            <td>{{ invoice.period }}</td>
                            <td>{{ invoice.amount }}</td>
                            <td>{{ invoice.due_date }}</td>
                            <td class="status">
                                <!-- <div class="status-type">
                                    <div
                                        class="pay-status status-process"
                                        v-if="invoice.status.toLowerCase() === 'processing'"
                                    >
                                        In Process
                                    </div>
                                    <div
                                        class="pay-status status-paid"
                                        v-else-if="invoice.status.toLowerCase() === 'paid'"
                                    >
                                        Paid
                                    </div>
                                    <div
                                        class="pay-status status-void"
                                        v-else-if="invoice.status.toLowerCase() === 'void'"
                                    >
                                        Void
                                    </div>
                                    <div 
                                        class="pay-status status-unpaid"
                                        v-else-if="invoice.status.toLowerCase() === 'unpaid'"
                                    >
                                        Unpaid
                                    </div>
                                </div> -->
                                <nitrozen-badge
                                    state="info"
                                    v-if="invoice.status.toLowerCase() === 'processing'"
                                >{{ invoice.status }}</nitrozen-badge>
                                <nitrozen-badge
                                    state="warn"
                                    v-else-if="invoice.status.toLowerCase() === 'unpaid'"
                                >{{ invoice.status }}</nitrozen-badge>
                                <nitrozen-badge
                                    state="success"
                                    v-else-if="invoice.status.toLowerCase() === 'paid'"
                                >{{ invoice.status }}</nitrozen-badge>
                                <nitrozen-badge
                                    state="default"
                                    v-else-if="invoice.status.toLowerCase() === 'void'"
                                >{{ invoice.status }}</nitrozen-badge>

                                <div class="actions-wrap">
                                    <div
                                        :class="[
                                            `action-${invoice.status}`,
                                            'action-item'
                                        ]"
                                    >
                                        <nitrozen-menu
                                            class="actions-menu"
                                            mode="vertical"
                                        >
                                            <nitrozen-menu-item
                                                class="act-offline"
                                                v-if="invoice.status.toLowerCase() === 'unpaid'"
                                                @click="handleOpenDrawer(invoice)"
                                            >
                                                Offline Payment
                                            </nitrozen-menu-item>
                                            <!-- To be used in future enhancement
                                            <nitrozen-menu-item
                                                class="act-debt"
                                                v-if="invoice.status === 'unpaid'"
                                                @click="
                                                    handleAutoDebt(
                                                        invoice.invoice_number
                                                    )
                                                "
                                                >Retry
                                                Auto-debt</nitrozen-menu-item
                                            > -->
                                            <nitrozen-menu-item
                                                class="act-void"
                                                v-if="!(invoice.status.toLowerCase() === 'void') || invoice.status.toLowerCase() === 'paid'"
                                                @click="
                                                    handleVoid(
                                                        invoice.invoice_number
                                                    )
                                                "
                                                >Void</nitrozen-menu-item
                                            >
                                            <nitrozen-menu-item
                                                class="act-download"
                                                v-if="invoice.status.toLowerCase() === 'unpaid' || invoice.status.toLowerCase() === 'paid'"
                                                @click="
                                                    downloadInvoice([
                                                        invoice.invoice_number
                                                    ])
                                                "
                                                >Download</nitrozen-menu-item
                                            >
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
                :invoiceNumber="popupData.invoiceNumber"
                :infoText="popupData.desc"
                :textHeading="popupData.heading"
                :cancel="popupData.cancel"
                :confirm="popupData.confirm"
                @cancel="cancelPopup"
                @confirm="handlePopup"
                :type="popupData.type"
            />
        </div>
        <template
            v-if="noContent"
        >
            <adm-no-content
                :text="'No Invoice found'"
            ></adm-no-content>
        </template>
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import DatePicker from '@/components/common/date-picker.vue';
import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import invoiceDrawer from './invoice-drawer.vue';
import invoiceFilterDrawer from './invoice-filters.vue';
import invoicePopup from './invoice-popup.vue';
import { debounce } from '@/helper/utils';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import PageEmpty from '@/components/common/page-empty.vue';
import moment from 'moment';
import {
    NitrozenCheckBox,
    NitrozenInput,
    NitrozenPagination,
    NitrozenMenu,
    NitrozenBadge,
    NitrozenMenuItem,
    NitrozenDropdown,
    NitrozenButton,
    strokeBtn
} from '@gofynd/nitrozen-vue';

const PAGINATION_OBJECT = {
    limit: 10,
    current: 1,
    total: 0
};

export default {
    name: 'invoices',
    components: {
        jumbotron: Jumbotron,
        'date-picker': DatePicker,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'inline-svg': inlineSvgVue,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenDropdown,
        NitrozenButton,
        NitrozenBadge,
        'filter-drawer': invoiceFilterDrawer,
        'invoice-drawer': invoiceDrawer,
        'pop-up': invoicePopup,
        'adm-no-content': PageEmpty
    },
    directives: {
        strokeBtn
    },
    data() {
        return {
            noContent: false,
            selectedInvoices: [],
            InvoiceDateRange: [
                moment().subtract(1, 'week').toISOString(),
                moment().toISOString()
            ],
            selectedCompany: '',
            companyNames: [],
            dateRangeShortcuts: [...dateRangeShortcuts],
            pageObject: { ...PAGINATION_OBJECT },
            isDrawerOpen: false,
            isFilterDrawerOpen: false,
            showPopup: false,
            searchText: '',
            //downloadUrlList: [],
            //disabled: 'disabled',
            bulkDownloadList: [],
            popupData: {
                invoiceNumber: '',
                heading: '',
                desc: '',
                cancel: 'Cancel',
                confirm: 'Yes, Proceed',
                type: ''
            },
            fromDate: '',
            toDate: '',
            invoiceDetails: {},
            tableDataItems: [],
            invoice: {},
            filters: {}
        };
    },
    mounted() {
        this.onDateChange();
        this.fetchCompany();
    },
    methods: {
        listingPayload(){
            const params = {
                data: {
                    start_date: this.fromDate,
                    end_date: this.toDate,
                    page: this.pageObject.current,
                    page_size: this.pageObject.limit,
                    filters: this.filters,
                    search: this.searchText
                }
            };
            return params;
        },
        toggleAllInvoices() {
            if (this.selectedInvoices.length == 0) {
                this.selectedInvoices = this.invoiceDetails.items.map(
                    (item) => {
                        if (item.status.toLowerCase() === 'paid') {
                            return item.invoice_number;
                        }
                    }
                );
                this.bulkDownloadList = this.invoiceDetails.items
                    .filter((item) => item.status.toLowerCase() === 'paid')
                    .map((item) => item.invoice_number);
                return;
            }
            this.selectedInvoices = [];
            this.bulkDownloadList = [];
        },
        toggleInvoice(invoice_num) {
            const index = this.selectedInvoices.indexOf(invoice_num);
            if (index > -1) {
                this.selectedInvoices.splice(index, 1);
                this.bulkDownloadList.splice(index, 1);
                return;
            }
            this.selectedInvoices.push(invoice_num);
            this.bulkDownloadList.push(invoice_num);
        },
        handlePageChanges(e) {
            this.pageObject = e;
            this.getInvoiceList();
        },
        getInvoiceList() {
            const invoiceList = FinanceService.getInvoiceList(this.listingPayload());
            invoiceList
                .then((res) => {
                    this.invoiceDetails = res.data;
                    this.pageObject.total = res.data.page.item_count;
                    this.pageObject.total == 0 ? this.noContent = true : this.noContent = false;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(`Something Went Wrong`);
                })
                .finally(() => {});
        },
        handleOpenDrawer(invoice) {
            this.invoice = invoice;
            this.isDrawerOpen = true;
        },
        handleCloseDrawer() {
            this.getInvoiceList();
            this.isDrawerOpen = false;
        },
        openFilterDrawer() {
            this.isFilterDrawerOpen = true;
        },
        closeFilterDrawer(filters) {
            this.filters.invoice_type = filters.invoice_type;
            this.filters.payment_status = filters.payment_status;
            this.isFilterDrawerOpen = false;
            this.getInvoiceList();
        },
        cancelPopup() {
            this.showPopup = false;
        },
        handlePopup(status) {
            this.showPopup = false;
        },
        onDateChange() {
            this.fromDate = moment(this.InvoiceDateRange[0]).format('DD-MM-YYYY');
            this.toDate = moment(this.InvoiceDateRange[1]).format('DD-MM-YYYY');
            if(this.InvoiceDateRange.length > 0){
                this.getInvoiceList();
            } else{
                this.$snackbar.global.showError(
                    `Dates are not selected`
                );
            }
        },
        searchByInput: debounce(function(e) {
            this.getInvoiceList();
        }, 1000),
        handleVoid(number) {
            this.popupData.invoiceNumber = number;
            this.popupData.heading = 'Void Invoice ?';
            this.popupData.desc = `Are you sure you want to Void this Invoice (${number}) ?`;
            this.showPopup = true;
            this.popupData.type = 'void';
        },
        /* handleAutoDebt(number) {
            this.popupData.invoiceNumber = number;
            this.popupData.heading = 'Retry Auto debt';
            this.popupData.desc = `Are you sure you want to retry auto dept for this Invoice (${number}) ?`;
            this.showPopup = true;
            this.popupData.type = 'debt';
        }, */
        downloadFile(url, filename) {
            fetch(url).then(function(t) {
                return t.blob().then((b) => {
                    var a = document.createElement('a');
                    a.href = URL.createObjectURL(b);
                    a.setAttribute('download', filename);
                    a.click();
                });
            });
        },
        downloadInvoice(invoiceList) {
            const params = {
                data: {
                    invoice_number: invoiceList
                }
            };
            const caller = FinanceService.getDownloadUrlList(params);
            caller
                .then((res) => {
                    res.data.data.forEach((item) => {
                        const fileName = item
                            .split('/')
                            .pop()
                            .split('?')[0];
                        this.downloadFile(item, fileName);
                    });
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err.message}`
                    );
                })
                .finally(() => {});
        },
        filterByCompany(){
            this.filters.company_id = this.selectedCompany.map(String);
            this.getInvoiceList();
        },
        searchCompany(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 1000)(e.text);
        },
        fetchCompany(query='') {
            let params = {
                data:{
                    search: query
                }
            };
            return FinanceService.getCompanyList(params)
                .then((res) => {
                    this.companyNames = res.data.company_list;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                });
        }
    },
    
};
</script>
<style lang="less" scoped>

.filter-input-sm {
    min-width: 250px;
    ::v-deep.mx-datepicker-popup {
        top: inherit;
    }
    @media @mobile {
        width: 100%;
    }
}
.slide-leave-active,
.slide-enter-active {
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

.main-container {
    background: #fff;
    .filter-container {
        padding: 0 24px 0;
    }
}

.filter-wrap {
    padding: 12px;
    background: #f5f5f5;
    margin: 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    flex-wrap: wrap;
    box-sizing: border-box;
    @media @mobile {
        display: block;
    }

    .vue-date-picker {
        width: 100% !important;
    }

    .search-filter {
        width: 39%;
        max-width: 39%;
        flex: 0 0 39%;
        padding-right: 1%;
    }
    .company-filter,
    .date-filter {
        width: 24%;
        max-width: 24%;
        flex: 0 0 24%;
        padding-right: 1%;
    }
    .advanced-filter {
        width: 10%;
        max-width: 10%;
        flex: 0 0 60%;

        .advanced-filter-btn {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            background: #fff;
            color: #41434c;
            // opacity: 0.8;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
        }
    }
    .search {
        @media @mobile {
            min-width: 100%;
        }
    }

    .filter {
        display: flex;
        @media @mobile {
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
        @media @mobile {
            display: none;
        }
    }
    .filter-dropdown {
        width: 170px;
        margin-left: 12px;
        @media @mobile {
            margin-left: 0;
            width: 100%;
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
            border: 1px solid #e0e0e0;
        }
        thead {
            tr:first-child {
                background: #f8f8f8;
                color: black;
            }
        }
        th,
        td {
            width: fit-content;
            text-align: center;
            padding: 15px;
        }
        th:last-child{
            text-align: left;
        }
        /* th:last-child{
            width: 2em;
        } */
        td:last-child{
            width: unset !important;
        }
        
    }

    .company{
        display: table-cell;
        position: relative;
        max-width: 120px;
        width: 130px;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        word-wrap: break-word;
    }

    .status{
        //gap: 10px;
        //gap: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    /* .status-type{
        gap: 9px;
        align-items: center;
        display: flex;
        flex-direction: column;
        .invoice-type{
            font-size: 10px;
        }
    } */
    /* .pay-status {
        max-width: fit-content;
        border: 1px solid #e3f2e9;
        background: #e3f2e9;
        color: #0a5f23;
        display: inline;
        padding: 3px 20px;
        border-radius: 4px;
    } */
    /* .status-unpaid {
        color: #b54708;
        border: 1px solid #fff5d6;
        background: #fff5d6;
    }
    .status-process {
        color: #3d3d3d;
        border: 1px solid #f5f5f5;
        background: #f5f5f5;
    }
    .status-void {
        color: #cd0909;
        border: 1px solid #fdeded;
        background: #fdeded;
    } */
}

.pagination-container {
    padding-top: 24px;
}
ßß .actions-wrap {
    width: 30px;
    .action-void {
        display: none;
    }

    .action-paid {
        .nitrozen-menu-vertical-dropdown {
            li:nth-child(1),
            li:nth-child(2),
            li:nth-child(3) {
                display: none;
            }
        }
    }
    .action-processing {
        .nitrozen-menu-vertical-dropdown {
            li:nth-child(1),
            li:nth-child(2) {
                display: none;
            }
        }
    }
}

.bulk-download-container {
    background-color: #e7eeff;
    line-height: 38px;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
}

.actions-wrap {
    width: 30px;
}
</style>
