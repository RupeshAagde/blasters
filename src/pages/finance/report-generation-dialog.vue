<template>
    <nitrozen-dialog
        class="report-dialog"
        ref="reportGenerationDialog"
        :title="title"
    >
        <template slot="body">
            <date-picker
                label="Select Start Date &amp; End Date"
                class="date-picker filter-input-sm"
                picker_type="date"
                date_format="MMM Do, YY"
                v-model="reportGenerationDate"
                :clearable="true"
                :range="true"
                :not_before="notBefore"
                :shortcuts="dateRangeShortcuts"
                :useNitrozenTheme="true"
                @input="dateRangeChange"
            />
            <!-- :not_after="new Date().toISOString()" -->
            <span class="date">{{ displayDate }}</span>
        </template>
        <template slot="footer">
            <nitrozen-button
                id="generate-btn"
                theme="secondary"
                v-flat-btn
                @click="generateReport"
            >
                Generate Report
            </nitrozen-button>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import DatePicker from '@/components/common/date-picker.vue';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import moment from 'moment';
import FinanceService from '@/services/finance.service.js'
export default {
    name: 'report-generation-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        DatePicker
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
    data: function() {
        return {
            reportGenerationDate: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            notBefore: moment().subtract(3, 'months').toISOString(),
            dateRangeShortcuts: [...dateRangeShortcuts],
            reportType: '',
            displayDate: '',
            program_type: [],
            program_type_id: [],
            sellerId: [],
            sellerName: [],
            fromDate: '',
            toDate: '',
            companyId: '',
        };
    },
    mounted() {
        this.getInitialDates();
    },
    methods: {
        getInitialDates(){
            this.fromDate = moment(this.reportGenerationDate[0]).format('DD-MM-YYYY');
            this.toDate = moment(this.reportGenerationDate[1]).format('DD-MM-YYYY');
        },
        open({ reportType, displayDate, program_type, program_type_id, sellerId, sellerName }){
            this.reportType = reportType;
            this.displayDate = displayDate;
            this.program_type = program_type;
            this.program_type_id =program_type_id;
            this.sellerId = sellerId;
            this.sellerName = sellerName;
            this.$refs.reportGenerationDialog.open({
                showCloseButton: true,
                width: '555px'
            })
        },
        close(reason) {
            this.resetDefault();
            this.$refs.reportGenerationDialog.close(reason);
            this.$emit('close', reason);
        },
        resetDefault(){
            this.program_type = [];
            this.program_type_id = [];
            this.sellerId = [];
            this.sellerName = [];
        },
        dateRangeChange() {
            const to_date = moment(this.reportGenerationDate[1]).format('DD-MM-YYYY');
            const from_date = moment(this.reportGenerationDate[0]).format('DD-MM-YYYY');
            this.fromDate = from_date;
            this.toDate = to_date;
        },
        generateReport(){
            const params = {
                data:{
                    report_id: this.reportType,
                    start_date: this.fromDate,
                    end_date: this.toDate,
                    filters:{
                        program_type: this.program_type.length ? this.program_type : [],
                        program_type_id: this.program_type_id.length ? this.program_type_id : [],
                        company:this.sellerId.length ? this.sellerId : [],
                    },
                    meta:{
                        program_type: this.program_type.toString(),
                        program_type_id: this.program_type_id.toString(),
                        company: this.sellerName.toString()
                    }
                }
            };
            if(!params.data.filters.program_type.length){
                delete params.data.filters.program_type;
                delete params.data.filters.program_type_id;
                delete params.data.meta.program_type;
                delete params.data.meta.program_type_id;
            }
            const caller = FinanceService.generateReport(params);
            caller
                .then(( res ) => {
                    this.$snackbar.global.showSuccess(
                        'Generating Reports...'
                    );
                    this.close(res);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed due to ${err}`
                    );
                    this.close(err);
                })
                .finally(() => {
                    // this.inProgress = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.report-dialog {
    ::v-deep .nitrozen-dialog {
        max-height: 90%;
        .nitrozen-dialog-body {
            overflow: unset;

        }
        .nitrozen-dialog-footer {
            padding-top: 12px;
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
}

.date{
    font-size: 12px;
}
</style>
