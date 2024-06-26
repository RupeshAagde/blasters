<template>
    <div class="filters-container">
        <div class="inside-date-picker">
            <div v-if="searchText" @click="clearSearchNCall" class="date-picker-sqaure">.</div>
            <nitrozen-input
                placeholder="Search by title"
                v-model="searchText"
                type="search"
                :showSearchIcon="true"
                @keyup="onFilterChange($event)" 
            />
        </div>
        <date-picker
            class="date-picker filter-input-dr"
            picker_type="date"
            date_format="MMM D, YYYY"
            v-model="orderDateRange"
            :clearable="false"
            :range="true"
            :not_before="notBefore"
            :shortcuts="dateRangeShortcuts"
            :not_after="new Date().toISOString()"
            :useNitrozenTheme="true"
            @input="onFilterChange"
        />
        <nitrozen-dropdown
            class="status-dropdown dropdown"
            :items="statuses"
            :label="'Status'"
            v-model="selectedStatus"
            @change="onFilterChange"
            placeholder="Choose status"
        />
        <div class="action-container">
            <div
                ref="refresh-button" 
                class="refresh-icon-container"
                @click="onFilterChange"
                title="Refresh Shipment Details">
                <inline-svg src="refresh-icon"></inline-svg>
            </div>
        </div>
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
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';

/* Mock imports */
import { statuses } from '@/pages/oms/fixtures/dropdown-items.js';


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
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            notBefore: moment().subtract(3, 'months').toISOString(),
            searchText: '',
            selectedStatus: '',
            statuses
        }
    },
    methods: {
        // loadData() {
        //     this.$emit('load');
        // },
        onFilterChange: debounce(function (e) {
            let filters_obj = {
                to_date: moment(this.orderDateRange[1]).format('DD-MM-YYYY'),
                from_date: moment(this.orderDateRange[0]).format('DD-MM-YYYY')
            };
            if(this.selectedStatus.toLowerCase() === 'all') {
                filters_obj.status = '';
            } else {
                filters_obj.status = this.selectedStatus;
            }
            if(this.searchText) filters_obj.search_key = this.searchText;

            this.$emit('filterChange', filters_obj);
        }, 500),

        clearSearchNCall() {
            this.searchText = '';
            this.onFilterChange(this.searchText);
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.filters-container {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 0.1fr;
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
    .date-picker-sqaure {
        color: black;
        background: black;
        width: 16px;
        position: absolute;
        bottom: 12px;
        z-index: 1;
        right: 22px;
        opacity: 0;
        cursor: pointer;
    }
}
</style>
