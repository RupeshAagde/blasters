<template>
    <div class="details-status-container">
        <div class="header-status">
            <div class="title">Bulk Invoice Status</div>
            <div class="download-files">
                <div class="download-link-container" 
                    v-if="invoiceReportData && 
                    invoiceReportData.data &&
                    invoiceReportData.data.invoice &&
                    invoiceReportData.data.invoice[0] && 
                    invoiceReportData.data.invoice[0].url"
                    @click="getPublicUrl(invoiceReportData.data.invoice[0].url, 'Invoice')">
                    <adm-inline-svg :src="'oms-bulk-download'" />
                    <span class="download-link-text">Download Invoice</span>
                </div>
                <div class="download-link-container" 
                    v-if="invoiceReportData && 
                    invoiceReportData.data &&
                    invoiceReportData.data.label &&
                    invoiceReportData.data.label[0] && 
                    invoiceReportData.data.label[0].url" 
                    @click="getPublicUrl(invoiceReportData.data.label[0].url, 'Label')">
                    <adm-inline-svg :src="'oms-bulk-download'" />
                    <span class="download-link-text">Download Label</span>
                </div>
            </div>
        </div>
        <div class="status-container">
            <div class="status-box">
                <div class="label">Total</div>
                <div class="value">{{ invoiceReportData.data.data.total.count }}</div>
            </div>
            <div class="status-box">
                <div class="label">Success</div>
                <div class="value">{{ invoiceReportData.data.data.success.count }}</div>
            </div>
            <div class="status-box">
                <div class="label">Failed</div>
                <div class="value">{{ invoiceReportData.data.data.failed.count }}</div>
            </div>
        </div>
        <div class="failed-records-container">
            <div class="header-table">
                <div class="title">Failed Records</div>
                <div class="download-link-container" v-if="!isEmpty(records.sh_ids)">
                    <adm-inline-svg :src="'oms-bulk-download'" />
                    <span class="download-link-text">Records</span>
                </div>
            </div>
            <div class="failed-records" v-if="!isEmpty(records.sh_ids)">
                <div class="table-container">
                    <table class="mirage-table list-table">
                        <tr class="table-header-row">
                            <th v-for="column in columns" :key="column.value" class="no-wrap">
                                <div class="row-content">
                                    <span class="table-header">
                                        {{ column.text }}
                                    </span>
                                </div>
                            </th>
                        </tr>
                        <tr v-for="(record, index) in records.sh_ids" :key="index" class="content-row">
                        <td>
                            <div class="cell-data">
                                <span>
                                    <!-- {{ Object.keys(record) }} -->
                                    {{ index }}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="cell-data">
                                <span>
                                    {{ record }}
                                </span>
                            </div>
                        </td>
                    </tr>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="isEmpty(records.sh_ids)">
            <adm-no-content
                helperText="No failed records found"
                class="no-content" />
        </div>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenMenu } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty'

/* Component imports */
import AdmInlineSVG from '@/components/common/inline-svg';
import AdmNoContent from '@/components/common/adm-no-content.vue';

/* Services imports */
import OrderService from '@/services/orders.service';
import GrindorService from '@/services/grindor.service';

const FAILED_RECORDS_COLUMNS = [
    {
        text: 'Shipment ID',
        value: 'shipmentId'
    },
    {
        text: 'Reason',
        value: 'reason'
    }
];

export default {
    name: 'view-invoice-report',
    components: {
        'adm-inline-svg': AdmInlineSVG,
        NitrozenMenu,
        AdmNoContent,
    },
    props: {
        invoiceReportData: Object
    },
    data() {
        return {
            columns: cloneDeep(FAILED_RECORDS_COLUMNS),
            records: {}
        }
    },
    mounted() {
        this.records = this.invoiceReportData.data.data.failed;
    },
    methods: {
        isEmpty,
        getPublicUrl(url, type){
            return GrindorService.getPublicUrl({
                expiry: 300,
                urls: [url]
            })
            .then((res) => {
                if(res && res.status == 200 && res.data && res.data.urls[0] && res.data.urls[0].signed_url) {
                    this.downloadSourceFile(res.data.urls[0].signed_url, type);
                }
            })
            .catch((error) => {
                this.$snackbar.global.showError(`Unable to download ${type.toLowerCase()}`);
                console.error("Error in downloading the file:   ", error);
            })
        },
        downloadSourceFile(signedUrl, type) {
            try {
                this.$snackbar.global.showInfo(`Your download will begin shortly`);
                const url = signedUrl;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('click', '_blank');
                document.body.appendChild(link);
                link.click();

                /**
                 * @todo The message that needs to be sent on successful download needs to be
                 * dynamic and not based on setTimeout. Need to improve this code.
                 * - Rushabh Mulraj Shah
                 */
                setTimeout(() => {
                    this.$snackbar.global.showSuccess(`Your ${type} has been successfully downloaded`, 3000);
                }, 1000);
            }
            catch(error) {
                console.error(`Error in downloading the ${type} file:   `, error);
                this.$snackbar.global.showError(
                    `Unable to download the ${type} file. Please try again after some time.`,
                    3000
                )
            }
        },
        downloadRecords() {
            this.$snackbar.global.showInfo(`Your download will begin shortly`);
            let params = {
                report_type: "invoice_report",
                // batch_id: "c7cbc6f6-ff96-4df1-bbdd-e37695a27b73"
                batch_id: this.invoiceReportData.data.batch_id
            }
            const get_excel = OrderService.fetchBulkActionFailedReport(params)
            return get_excel
            .then(({data}) => {
                const url = data.cdn.url;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', data.file_name);
                document.body.appendChild(link);
                link.click();
                /**
                 * @todo The message that needs to be sent on successful download needs to be
                 * dynamic and not based on setTimeout. Need to improve this code.
                 * - Rushabh Mulraj Shah
                 */
                setTimeout(() => {
                    this.$snackbar.global.showSuccess('Your file has been successfully downloaded', 3000);
                }, 2500);
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to download failed records');
                console.error("Error in downloading the file for failed records:   ", error);
            })
        }
    },
    
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';
@import './../../less/table.less';

.details-status-container {
    margin-bottom: 33px;
}

.header-status {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
}

.title {
    font-weight: 600;
    font-size: 14px;
    color: #4D4D4E;
}

.status-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
}

.status-box {
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    padding: 12px 16px;

    .label {
        color: rgb(65, 67, 76, 0.6) !important;
        font-weight: 400;
        font-size: 12px;
        margin-bottom: 8px;
    }

    .value {
        color: #4D4D4E;
        font-weight: 600;
        font-size: 14px;
    }
}

.download-link-container {
    font-size: 12px;
    color: @RoyalBlue;
    cursor: pointer;
    display: flex;
    align-items: center;
    column-gap: 4px;
}
.header-table {
    margin-top: 24px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
}

.title {
    font-weight: 600;
    font-size: 14px;
    color: #4D4D4E;
}

.download-link-container {
    font-size: 12px;
    color: @RoyalBlue;
    cursor: pointer;
}

.list-table {
    td.cell-data {
        display: flex;
        align-items: center;
    }

    .content-row {
        border-bottom: 1px solid #E5E5E5 !important;

        &:last-child {
            border-bottom: none;
        }
    }
}

.download-files {
    display: flex;
    gap: 32px;
}

.table-container {
    max-height: 40vh !important;
}
</style>