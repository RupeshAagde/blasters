<template>
    <div class="list-card-container" v-if="!isEmpty(invoiceData)" @click.stop="onCardClick">
        <div class="left-section">
            <div class="type-logo-container">
                <adm-inline-svg :src="imgSrc" />
            </div>
            <div class="invoice-info">
                <p class="title">{{ invoiceData.file_name }}</p>
                <p class="file-status-info">
                    {{ +invoiceData.total_count >= 0 ? `Total ${invoiceData.total_count}` : '' }} - 
                    {{ +invoiceData.successful_sh_count >= 0 ? `${invoiceData.successful_sh_count} success` : '' }} 
                    {{ +invoiceData.failed_sh_count >= 0 ? `, ${invoiceData.failed_sh_count} failed` : ''}} 
                    {{ invoiceData.store_name ? `| ${invoiceData.store_name}` : '' }}
                </p>
                <p class="upload-info">
                    Uploaded by: {{ invoiceData.user_name }} • 
                    Uploaded on: {{ convertToOMSDate(invoiceData.uploaded_on) }}
                </p>
                <p class="flex-prop" v-if="isProcessing">
                    <adm-inline-svg :src="'loading-new-circle'" />
                    <span class="css-change">Bulk invoice is being processed</span>
                </p>
                <p class="flex-prop" v-if="isProcessed">
                    <span class="css-change">Bulk invoice generated successfully</span>
                    <span class="css-changes view-report" @click="callViewReportApi"><u> View Report </u></span>
                </p>
            </div>
        </div>
        <div class="right-section">
            <div class="info-icons" v-if="invoiceData && invoiceData.is_invoiceable && 
                (invoiceData.status == 'PARTIALLY COMPLETED' || invoiceData.status == 'COMPLETED')">
                <adm-inline-svg src="tag-icon"></adm-inline-svg>
            </div>
            <div class="badge-status">
                <nitrozen-badge :state="badgeState">
                    {{ invoiceData.status }}
                </nitrozen-badge>
            </div>
            <div tabindex="0" class="menu-item" @blur="handleMenuBlur">
                <nitrozen-menu class="actions-menu" mode="vertical" ref="menu">
                    <nitrozen-menu-item class="navigate-to-export" @click="download()">
                        <adm-inline-svg :src="'oms-download'" class="menu-item-icon" />
                        <span>Download File</span> 
                    </nitrozen-menu-item>
                    <!-- <nitrozen-menu-item v-if="(invoiceData.status == 'PARTIALLY COMPLETED' || invoiceData.status == 'COMPLETED') &&
                                        invoiceData.is_invoiceable"
                                        class="navigate-to-export" 
                                            @click="process($event)">
                        <adm-inline-svg :src="'oms-refresh'" class="menu-item-icon" />
                        <span>Process Bulk Invoice</span> 
                    </nitrozen-menu-item> -->
                </nitrozen-menu>
            </div>
        </div>
        <nitrozen-dialog 
            ref="process-dialog"
            class="process-dialog"
            :title="'Processing Bulk Upload'"
            @close="closeProcessDialog">
            <template slot="header">
                <div class="process-dialog-header">
                    <p>Processing Bulk Upload</p>
                    <span class="close-btn" @click="onCloseClick">x</span>    
                </div> 
            </template>
            <template slot="body">
                <div class="process-dialog-container">
                    <div class="file-name-container">
                        <span class="options-label">File: </span>
                        <span class="file-name">{{ invoiceData.file_name }}</span>
                    </div>

                    <div class="type-container">
                        <span class="options-label">Invoice Type:</span>
                        <div class="options-container">
                            <nitrozen-radio 
                                name="invoiceType"
                                :radioValue="'a4'"
                                v-model="invoiceType">A4</nitrozen-radio>
                            <nitrozen-radio 
                                name="invoiceType"
                                :radioValue="'a6'"
                                v-model="invoiceType">A6</nitrozen-radio>
                            <nitrozen-radio 
                                name="invoiceType"
                                :radioValue="'pos'"
                                v-model="invoiceType">POS</nitrozen-radio>
                        </div>
                    </div>
                </div>
            </template>

            <template slot="footer">
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    @click="onProcessInvoiceClick"
                    :disabled="disableProcessInvoiceBtn"
                >
                    Process Invoice
                </nitrozen-button>
            </template>
        </nitrozen-dialog>

        <transition name="slide">
            <template v-if="displayInvoiceReportDrawer">
                <side-drawer
                    class="side-drawer-style"
                    @close="closeDetails()"
                    :title="`Bulk Invoice Report`"
                >
                    <template #header>
                        <div class="report-header" v-if="invoiceReportData && invoiceReportData.data">
                            <div>
                                <p class="type-head">File</p>
                                <span class="type-value" v-if="invoiceReportData.data.file_name">
                                    {{ invoiceReportData.data.file_name }}
                                </span>
                            </div>
                            <div>
                                <p class="type-head">Uploaded on</p>
                                <span class="type-value" v-if="invoiceReportData.data.uploaded_on">
                                    {{ convertToOMSDate(invoiceReportData.data.uploaded_on) }}
                                </span>
                            </div>
                            <div>
                                <p class="type-head">Uploaded By</p>
                                <span class="type-value" v-if="invoiceReportData.data.uploaded_by">
                                    {{ invoiceReportData.data.uploaded_by }}
                                </span>
                            </div>
                        </div>
                    </template>
                    <view-invoice-report :invoiceReportData="invoiceReportData" />
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenBadge, NitrozenButton, NitrozenDialog, 
    NitrozenMenu, NitrozenMenuItem, NitrozenRadio,
    flatBtn
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';

/* Component imports */
import AdmInlineSVG from '@/components/common/inline-svg.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import ViewInvoiceReport from '@/pages/oms/bulk-actions/list-card/view-invoice-report.vue';

/* Services imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'list-card',
    components: {
        SideDrawer,
        ViewInvoiceReport,
        'adm-inline-svg': AdmInlineSVG,
        NitrozenBadge,
        NitrozenButton,
        NitrozenDialog,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenRadio
    },
    props: {
        data: {
            type: Object,
            default: {}
        },
        isProcessing: {
            type: Boolean,
            default: false
        },
        isProcessed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            invoiceData: {},
            invoiceType: '',
            displayInvoiceReportDrawer: false,
            invoiceReportData: {}
        }
    },
    directives: {
        flatBtn
    },
    mounted() {
        if(!isEmpty(this.data)) this.invoiceData = cloneDeep(this.data);
    },
    computed: {
        badgeState() {
            let invoiceStatus = this.invoiceData.status;
            if(invoiceStatus === 'COMPLETED') return 'success';
            if(invoiceStatus === 'PARTIALLY COMPLETED') return 'warn';
            if(invoiceStatus === 'FAILED') return 'error';
        },
        disableProcessInvoiceBtn() {
            return this.invoiceType.length === 0;
        },
        imgSrc() {
            if(this.invoiceData.file_name.slice(-4) === '.csv') return 'oms-csv';
            if(this.invoiceData.file_name.slice(-4) === 'xlsx') return 'oms-xls';
        }
    },
    methods: {
        convertToOMSDate,
        handleMenuBlur() {
            this.$refs.menu.closeMenu()
        },
        callViewReportApi() {
            let params = {
                // batch_id: "c7cbc6f6-ff96-4df1-bbdd-e37695a27b73"
                batch_id: this.invoiceData.batch_id
            };
            OrderService.getBulkInvoiceReport(params)
                .then(({ data }) => {
                    this.invoiceReportData = data;
                    this.displayInvoiceReportDrawer = true;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Unable to Generate Bulk Invoice Report');
                    console.error(err);
                })
                .finally(() => {
                    
            })
        },
        closeDetails() {
            this.displayInvoiceReportDrawer = false;
        },
        /**
         * Function to close the process dialog
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} event The event object
         */
        closeProcessDialog(event) {
            // this.$refs['process-dialog'].close();
        },

        /**
         * Function for downloading
         * 
         * @author: Rohit Gupta
         * @param {string} type The type of download
         */
        download() {
            /* The download will be called here. */
            const url = this.data.excel_url;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.data.file_name);
            document.body.appendChild(link);
            link.click();
        },

        /**
         * A reference method to call lodash's isEmpty method
         */
        isEmpty,
        
        /**
         * Function to handle card click changes.
         * If the event click is not a menu item or a dialog item, it will then emit 
         * click with the invoice data.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} e The event object
         */
        onCardClick(e) {
            let isMenuItemClicked = e.target.closest('.menu-item');
            let isDialogItemClicked = e.target.closest('.process-dialog');
            let isViewReport = e.target.closest('.view-report')
            if(!isMenuItemClicked && !isDialogItemClicked && !isViewReport) this.$emit('click', this.invoiceData.batch_id);
        },

        /**
         * Function to open the dialog box for process bulk invoice.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} event The event object
         */
        process(event) {
            event.preventDefault();
            event.stopPropagation();
            this.$refs['process-dialog'].open();
        },

        /**
         * Function to change the format of the date to a particular format.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {string} date The date string
         */
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },

        /**
         * Function to close the process dialog
         * 
         * @author: Rushabh Mulraj Shah
         */
        onCloseClick() {
            this.$refs['process-dialog'].close();
        },

        /**
         * Function to close the process dialog
         * 
         * @author: Rushabh Mulraj Shah, Rohit Gupta
         */
        onProcessInvoiceClick() {
            let params = {
                batch_id: this.data.batch_id,
                // batch_id: "93c0a961-ebb5-40d1-8941-365b312d84e5",
                doc_type: this.invoiceType
            }
            OrderService.processBulkActionInvoice(params)
                .then(({ data }) => {
                    if(data.success == true) {
                        this.$refs['process-dialog'].close();
                        this.$emit("refreshBulkListPage", true);
                    }
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Unable to Process Bulk Invoice');
                    console.error(err);
                    this.$refs['process-dialog'].close();
                })
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.list-card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #F3F3F3;
    border-radius: 8px;
    background: @White;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}

.left-section,
.right-section {
    display: flex;
    align-items: center;
    column-gap: 8px;
}

.left-section {
    flex-grow: 1;
}

.badge-status {
    ::v-deep .nitrozen-badge {
        padding: 2px 8px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.type-logo-container {
    background: #F5F8FF;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    position: relative;

    .type-logo {
        height: 100%;
    }
}

.invoice-info {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}

.title {
    color: @Black;
    font-weight: 500;
    text-transform: uppercase;
}

.file-status-info {
    font-weight: 500;
    color: #4D4D4E;
}

.upload-info {
    color: #828282;
    font-weight: 400;
}

.navigate-to-export {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: initial;
    }

    .menu-item-icon {
        height: 16px;
        width: 16px;
        margin-right: 8px;
    }
}

::v-deep .nitrozen-menu-vertical-dropdown {
    width: max-content;
    row-gap: 1rem;
}

::v-deep .nitrozen-menu-item {
    padding: 8px;
    margin-bottom: 8px;
}

::v-deep .nitrozen-dialog {
    min-width: 30vw;
    z-index: 100;
}

.process-dialog-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24px;

    .close-btn {
        font-size: 18px;
        color: #8F8F8F;
        cursor: pointer;
        font-weight: 500;
    }
}

.options-container {
    display: flex;
    column-gap: 16px;
}

.type-container {
    display: flex;
}

.file-name {
    font-weight: 500;
    font-size: 15px;
    line-height: 140%;
    color: #000000;
}

.options-label {
    margin-right: 16px;
}

.file-name-container {
    margin-bottom: 1rem;
}
.flex-prop {
    display: flex;
    align-items: center;
    margin-top: 14px;
    ::v-deep .inline-svg {
        display: inline-flex;
        margin-right: 12px;
    }
}
.css-change {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 21px;
    color: #41434C;
    margin-right: 24px;
}
.view-report {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #2E31BE;
    cursor: pointer;
}
.report-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
    row-gap: 1rem;
    margin-top: 24px;
    .type-head {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #41434C;
        opacity: 0.7;
    }
    .type-value {
        font-weight: 600;
        font-size: 12px;
        line-height: 140%;
        color: #4D4D4E;
    }
}
::v-deep .slide-fade {
    .sidedrawer-container {
        width: 42%;
    }
}
.info-icons {
    padding-right: 12px;
    ::v-deep .inline-svg {
        svg {
            path {
                fill: #979797;
            }
        }
    }
}
</style>
