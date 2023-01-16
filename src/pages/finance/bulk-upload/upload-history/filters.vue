<template>
    <div class="filters-container">
        <div class="inside-date-picker">
            <nitrozen-input
                id="searchbox"
                placeholder="Search by title"
                v-model="searchText"
                type="search"
                :showSearchIcon="true"
                @input="onFilterChange" 
            />
        </div>
        <nitrozen-dropdown
            class="status-dropdown dropdown"
            :items="csvTypes"
            :label="'Status'"
            v-model="selectedCsvType"
            @change="onFilterChange"
        />
        <date-picker
            class="date-picker filter-input-dr"
            picker_type="date"
            date_format="MMM Do, YY"
            v-model="uploadDateRange"
            :clearable="false"
            :range="true"
            :not_before="notBefore"
            :shortcuts="dateRangeShortcuts"
            :not_after="new Date().toISOString()"
            :useNitrozenTheme="true"
            @input="onDateChange"
        /> 
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenDropdown, NitrozenInput
} from '@gofynd/nitrozen-vue';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

/* Component imports */
import DatePicker from '@/components/common/date-picker.vue';
import InlineSvg from '@/components/common/adm-inline-svg';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';

/* Service Imports */
import FinanceService from '@/services/finance.service.js';

export default {
    name: 'bulk-actions-list-filters',
    components: {
        UktInlineSvg,
        InlineSvg,
        DatePicker,
        NitrozenDropdown,
        NitrozenInput
    },
    data() {
        return {
            dateRangeShortcuts: cloneDeep(dateRangeShortcuts),
            uploadDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            notBefore: moment().subtract(3, 'months').toISOString(),
            searchText: '',
            selectedCsvType: '',
            csvTypes: [
                {
                    text: 'CSV',
                    value: 'csv'
                }
            ]
        }
    },
    mounted() {
       this.$emit("dates",this.uploadDateRange);
    },
    methods: {
        onFilterChange: debounce(async function(input) {
            this.$emit("querychanged", input);
            
        }, 500),
        onDateChange: debounce(function (e) {
            this.$emit("dateschanged", e);
        }, 500),
        // getFileType() {
        // const params = {
        //     "data": {
        //         "table_name": "report_upload_config",
        //         "filters": {
        //         "listing_enabled": true
        //         },
        //         "project": [
        //             "id",
        //             "display_name",
        //             "preprocess",
        //             "is_gzip",
        //             "description"
        //         ]
        //     }
        // }
            
        //     const caller = FinanceService.getFileType(params);
        //     caller
        //         .then(( res ) => {
        //             this.csvTypes = res.data.items.map((item) => {
        //                 return {
        //                     text: item.display_name,
        //                     value: item.id,
        //                 };
        //             });
        //         })
        //         .catch((err) => {
        //             this.$snackbar.global.showError(
        //                 `Failed`
        //             );
        //         })
        //         .finally(() => {
        //          // console.log("in finally") 
        //         });
        // },
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.filters-container {
    width: 100%;
    background-color: #F5F5F5;
    padding: 12px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    column-gap: 12px;
    margin-bottom: 1rem;
    
    ::v-deep .n-input,
    ::v-deep .nitrozen-select__trigger {
        border-radius: 4px;
    }
}

.dropdown {
    ::v-deep .nitrozen-dropdown-label {
       display: none;
    }

}
.action-container {
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
}

.inside-date-picker {
    width: 100%;
    position: relative;
    /* .date-picker-sqaure {
        color: black;
        background: black;
        width: 16px;
        position: absolute;
        bottom: 12px;
        z-index: 1;
        right: 22px;
        opacity: 0;
        cursor: pointer;
    } */
}
</style>
