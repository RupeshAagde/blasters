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
                        @searchInputChange="searchCompany"
                    ></nitrozen-dropdown>
                </div>
                <div class="date-filter filter-item">
                    <date-picker
                        label="Select Start Date &amp; End Date"
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
                        <th v-for="(header,index) in invoiceDetails.headers" :key="index">
                            {{ header }}
                        </th>
                        <th>Action</th>
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
                        <!-- @click="downloadInvoice([invoice.invoice_number])" -->
                            <td>
                                <nitrozen-checkbox
                                    class="table-checkout"
                                    @change="
                                        toggleInvoice(
                                            invoice.id,
                                            invoice.invoice_number
                                        )
                                    "
                                    :value="
                                        selectedInvoices.includes(invoice.id)
                                            ? true
                                            : false
                                    "
                                    :disabled="invoice.status != 'paid'"
                                >
                                </nitrozen-checkbox>
                            </td>
                            <td v-for="(item, index) in Object.values(invoice).slice(0, invoiceDetails.headers.length - 1)" :key="index">
                                <span>{{ item }}</span>
                            </td>
                            <!-- Status can be made dynamic with a captialization function -->
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
                                    v-else-if="invoice.status === 'unpaid'"
                                >
                                    Unpaid
                                </div>
                            </td>
                            <td>
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
                                                v-if="invoice.status === 'unpaid'"
                                                @click="handleOpenDrawer(invoice)"
                                            >
                                                Offline Payment
                                            </nitrozen-menu-item>
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
                                            >
                                            <nitrozen-menu-item
                                                class="act-void"
                                                v-if="!(invoice.status === 'void')"
                                                @click="
                                                    handleVoid(
                                                        invoice.invoice_number
                                                    )
                                                "
                                                >Void</nitrozen-menu-item
                                            >
                                            <nitrozen-menu-item
                                                class="act-download"
                                                v-if="invoice.status === 'unpaid' || invoice.status === 'paid'"
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
            v-else
        >
        <adm-no-content
            :helperText="'No Invoices Found'"
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
import CompanyService from '@/services/company-admin.service';
import { debounce } from '@/helper/utils';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import PageEmpty from '@/components/common/page-empty.vue';
import moment from 'moment';
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
            downloadUrlList: [],
            disabled: 'disabled',
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
        //this.getInvoiceList();
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
                        if (item.status === 'paid') {
                            return item.id;
                        }
                    }
                );
                this.bulkDownloadList = this.invoiceDetails.items
                    .filter((item) => item.status === 'paid')
                    .map((item) => item.invoice_number);
                return;
            }
            this.selectedInvoices = [];
            this.bulkDownloadList = [];
        },
        toggleInvoice(id, invoice_num) {
            const index = this.selectedInvoices.indexOf(id);
            if (index > -1) {
                this.selectedInvoices.splice(index, 1);
                this.bulkDownloadList.splice(index, 1);
                return;
            }
            this.selectedInvoices.push(id);
            this.bulkDownloadList.push(invoice_num);
        },
        downloadFiles() {
            this.downloadInvoice(this.bulkDownloadList);
        },
        handlePageChanges(e) {
            this.pageObject = e;
            this.getInvoiceList();
        },
        getInvoiceList() {
            /* const params = {
                data: {
                    start_date: this.fromDate,
                    end_date: this.toDate,
                    page: this.pageObject.current,
                    page_size: this.pageObject.limit,
                    filters: {},
                    search: this.searchText
                }
            }; */
            const invoiceList = FinanceService.getInvoiceList(this.listingPayload());
            invoiceList
                .then((res) => {
                    this.invoiceDetails = res.data;
                    this.pageObject.total = res.data.page.item_count;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(`Something Went Wrong`);
                })
                .finally(() => {
                    // this.inProcess = false
                });
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
            this.filters = filters;
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
        paymentOptnChange() {},
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
        handleAutoDebt(number) {
            this.popupData.invoiceNumber = number;
            this.popupData.heading = 'Retry Auto debt';
            this.popupData.desc = `Are you sure you want to retry auto dept for this Invoice (${number}) ?`;
            this.showPopup = true;
            this.popupData.type = 'debt';
        },
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
        searchCompany(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 1000)(e.text);
        }
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
    }
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
            tr {
                th {
                    text-align: left;
                }
            }
            tr:first-child {
                background: #f8f8f8;
                color: black;
            }
        }
        th,
        td {
            padding: 15px;
        }
    }
    .pay-status {
        border: 1px solid #e3f2e9;
        background: #e3f2e9;
        color: #0a5f23;
        display: inline;
        padding: 3px 20px;
        border-radius: 4px;
    }
    .status-unpaid {
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
    }
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
