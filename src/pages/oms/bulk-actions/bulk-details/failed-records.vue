<template>
    <div class="failed-records-container" v-if="records.length">
        <div class="header">
            <div class="title">Failed Records</div>
            <div class="download-link-container" @click="downloadRecords">
                <inline-svg :src="'oms-bulk-download'" />
                <span class="download-link-text">Records</span>
            </div>
        </div>
        <div class="failed-records">
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
                    <tr v-for="(record,index) in records" :key="index" class="content-row">
                        <td>
                            <div class="cell-data">
                                <span>
                                    {{ Object.keys(record)[0] }}
                                </span>
                            </div>
                        </td>
                        <td>
                            <div class="cell-data">
                                <span>
                                    {{ Object.values(record)[0] }}
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

/* Services imports */
import OrderService from '@/services/orders.service';

const FAILED_RECORDS_COLUMNS = [
    {
        text: 'Shipment ID',
        value: 'shipmentId'
    },
    {
        text: 'Reason',
        value: 'reason'
    },
];

export default {
    name: 'bulk-details-failed-records',
    props: {
        allData: {
            type: Object
        },
    },
    components: {
        InlineSvg
    },
    data() {
        return {
            columns: cloneDeep(FAILED_RECORDS_COLUMNS),
            records: []
        }
    },
    mounted() {
        this.records = this.allData.failed_records;
    },
    methods: {
        /**
         * Function to sanitise the data and make it into a new format
         * 
         * @author: Rushabh Mulraj Shah 
         * This function should not be deleted
         */
        // sanitiseData() {
        //     let sanitisedData = [];
        //     for(let record of this.records) {
        //         let obj = {};
        //         for(let column of this.columns) {
        //             if(column.value.includes(".")) {
        //                 let keys = column.value.split(".");
        //                 let data = record;
        //                 for(let key of keys) {
        //                     data = data[key];
        //                 }
        //                 obj[column.value] = data;
        //             } else {
        //                 obj[column.value] = record[column.value];
        //             }
        //         }
        //         sanitisedData.push(obj);
        //     }
        //     this.details = cloneDeep(sanitisedData);
        // },

        /**
         * Function to download records by hitting an API
         * 
         * @author: Rushabh Mulraj Shah, Rohit Gupta
         */
        downloadRecords() {
            this.$snackbar.global.showInfo(`Your download has begun`);
            let params = {
                batch_id: this.allData.data[0].batch_id
            }
            const get_excel = OrderService.fetchBulkActionFailedReport(params)
            return get_excel
            .then(({data}) => {
                if(data) {
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
                } else {
                    this.$snackbar.global.showError('Unable to download failed records');
                    console.error("Error in downloading failed records:   ", data);
                }
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to download failed records');
                console.error("Error in downloading failed records:   ", error);
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';
@import './../../less/table.less';

.header {
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
    display: flex;
    column-gap: 4px;
    align-items: center;
}

.list-table {
    td.cell-data {
        display: flex;
        align-items: center;
    }
    td .cell-data {
        max-width: 450px;
    }
    .content-row {
        border-bottom: 1px solid #E5E5E5 !important;

        &:last-child {
            border-bottom: none;
        }
    }
}

.table-container {
    max-height: 40vh;
}
</style>
