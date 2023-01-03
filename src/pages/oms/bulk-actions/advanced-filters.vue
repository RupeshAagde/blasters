<template>
    <div class="adv-filters-container" 
        @click="stopClick($event); checkOutsideClick($event)" 
        v-if="!isEmpty(advancedFilterOptions) && !isEmpty(filteredOptions)">
        <div class="space-below">
            <date-picker
                label="Select Date Range"
                class="date-picker filter-input-sm"
                picker_type="date"
                date_format="MMM Do, YY"
                v-model="orderDateRange"
                :clearable="false"
                :range="true"
                :not_before="notBefore"
                :shortcuts="dateRangeShortcuts"
                :not_after="new Date().toISOString()"
                :useNitrozenTheme="true"
                @input="dateRangeChange"
            />
        </div>
        <div v-for="(filter, index) in advancedFilterOptions" :key="'filter'+index" class="filter">
            <div v-if="filter.type === 'datetime'">
                <date-picker
                    label="Select Date Range"
                    class="date-picker filter-input-sm"
                    picker_type="date"
                    date_format="MMM Do, YY"
                    :clearable="true"
                    v-model="selectedFilters[filter.value]"
                    :range="true"
                    :notBefore="notBefore"
                    :not_after="new Date().toISOString()"
                    :useNitrozenTheme="true"
                    @input="dateRangeChange"
                    :shortcuts="dateRangeShortcuts" />
            </div>
            <nitrozen-dropdown 
                v-else-if="filter.type === 'multi_select' || filter.type === 'single_select'"
                :class="`advanced-filter-dropdown dropdown-number-${index+1}`"
                :label="filter.text"
                :key="'advanced-filter-dropdown-'+index"
                :placeholder="`Select ${filter.text}`"
                :items="filteredOptions[index].options"
                v-model="selectedFilters[filter.value]"
                :multiple="filter.type === 'multi_select'"
                :searchable="filter.type === 'multi_select'"
                @searchInputChange="searchFilterOptions($event, index)"
                @change="onSelectChange($event, filter.value)"
                :ref="`dropdown-number-${index+1}`"
            />
            <div class="main-wrapper" v-if="selectedFiltersOptions[filter.value] && ( selectedFiltersOptions[filter.value].length || typeof selectedFiltersOptions[filter.value] == 'number' )">
                <div class="chip-wrapper" v-if="filter.type === 'multi_select'" ref="chipwrapper">
                    <div v-for="(tag, tagIdx) in selectedFiltersOptions[filter.value]" :key="'chips-'+tagIdx">
                            <nitrozen-chips class="chip">
                            {{ getSelectedFilterText(tag, index) }}  
                            <nitrozen-inline
                                icon="cross"
                                class="nitrozen-icon"
                                @click="removeChip(filter.value, tagIdx)"
                            ></nitrozen-inline>  
                        </nitrozen-chips>
                    </div>
                </div>
                <div class="chip-wrapper" v-if="filter.type === 'single_select'" ref="chipwrapper">
                    <div>
                        <nitrozen-chips class="chip">
                            {{ getSelectedFilterText(selectedFiltersOptions[filter.value], index) }}  
                            <nitrozen-inline
                                icon="cross"
                                class="nitrozen-icon"
                                @click="removeChip(filter.value)"
                            ></nitrozen-inline>  
                        </nitrozen-chips>
                    </div>
                </div>
                <nitrozen-button @click="removeChip(filter.value)" class="chip-button"  :theme="'secondary'">Clear</nitrozen-button>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenButton, NitrozenChips, NitrozenDropdown,
    NitrozenInline, flatBtn
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/* Component imports */
import DatePicker from "@/components/common/date-picker.vue";

/* Helper imports */
import { dateRangeShortcuts } from '@/helper/datetime.util';


export default {
    name: 'bulk-advanced-filters',
    components: {
        DatePicker,
        NitrozenButton,
        NitrozenChips,
        NitrozenDropdown,
        NitrozenInline
    },
    directives: {
        flatBtn 
    },
    props: {
       advancedFilters: {
           type: Array,
           required: true,
       },
        advancedSelectedFilters: {
           type: Object
       },
    },
    beforeMount() {
        this.initFilters();
    },
    mounted() {
        this.filteredOptions = this.advancedFilters && this.advancedFilters.length ? cloneDeep(this.advancedFilters) : [];
        this.loadFilters();
    },
    computed: {
        advancedFilterOptions(){
            return this.advancedFilters && this.advancedFilters.length ? cloneDeep(this.advancedFilters) : []
        },
        selectedFiltersOptions(){
            return this.selectedFilters || {};
        }
    },
    data() {
        return {
            dateRangeShortcuts: cloneDeep(dateRangeShortcuts),
            filteredOptions: [],
            notBefore: moment().subtract(3, 'months').toISOString(),
            selectedFilters: {},
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
        }
    },
    methods: {
        /**
         * A reference method which calls the isEmpty method of lodash 
         */
        isEmpty,

        /**
         * Function to emit applyFilters method when the date range is changed by the user.
         * In the emitted method, we will also send the closeDrawer boolean value, and
         * the data which contains selected filters.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {boolean} closeDrawer A boolean value to close the drawer having default value as true
         */
        dateRangeChange() {
            const to_date = moment(this.orderDateRange[1]).format('DD-MM-YYYY');
            const from_date = moment(this.orderDateRange[0]).format(
                'DD-MM-YYYY'
            );
            this.selectedFilters.to_date = to_date;
            this.selectedFilters.from_date = from_date;
        },

        /**
         * Function to stop event from propagating
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} event An object for event
         */
        stopClick(event) {
            event.stopPropagation();
        },

        /**
         * Function to return the text of the selected option for displaying it in the chip
         * 
         * @author: Rushabh Mulraj Shah
         * @param {string} tag The value of the tag object
         * @param {number} i The index of the tag
         * @return {string} The text of the selected tag if found, or null
         */
        getSelectedFilterText(tag, i){
            /* Used for text normalization and display */
            if(this.advancedFilterOptions[i].options.find(ele => ele.value == tag)) {
                return this.advancedFilterOptions[i].options.find(ele => ele.value == tag).text;
            } return '';
        },

        /**
         * Function to reset filters
         * 
         * @author: Rushabh Mulraj Shah
         * @param {boolean} closeDrawer A boolean object for closing the drawer
         */
        resetFilters(closeDrawer = true) {
            /* Clears all filters */
            this.initFilters();

            // @NOTE: Added to clear and apply 
            this.$emit("applyFilters", {closeDrawer: false, data: this.selectedFilters});
        },

        /**
         * Function to remove chip when user clicks on the 'x' icon of the chip
         * 
         * @author: Rushabh Mulraj Shah
         * @param {string} filter_value The value of filter to select from selectedFilters
         * @param {number} remove_index The index at which the element is to be removed
         */
        removeChip(filter_value, remove_index = -1) {
            if(remove_index!=-1) {
                // Remove ONE Chip of given Filter
                this.selectedFilters[filter_value].splice(remove_index, 1);
            } else {
                // Remove ALL Chips of given Filter 
                this.$set(this.selectedFilters, filter_value, []);
            }
        },

        /**
         * Function to initialise or clear the filters
         * 
         * @author: Rushabh Mulraj Shah
         */
        initFilters() {
            // Initialize or Clear the filters
            this.advancedFilterOptions.forEach(filter => {
                if(filter.options) {
                    filter.options.forEach(o=>o.selected=false);
                }
                this.$set(this.selectedFilters, filter.value, []);
            });
        },

        /**
         * Function to load the filters on initial mounting
         * 
         * @author: Rushabh Mulraj Shah
         */
        loadFilters() {
            // Load Filters initially
            this.selectedFilters = this.advancedSelectedFilters;
        },

        /**
         * Function that will be called on value change of dropdown
         * 
         * @author: Rushabh Mulraj Shah
         * @param {string} selection The value selected by the user
         * @param {string} val The key of the value selected by the user
         */
        onSelectChange(selection, val) {
            // Changes in 'multi_select' type of filter
            this.selectedFilters[val]=selection;
        },

        /**
         * Function that will emit applyFilters for applying filters
         * 
         * @author: Rushabh Mulraj Shah
         * @param {boolean} closeDrawer The boolean value for closing the drawer
         */
        applyFilters(closeDrawer=true){
             // Apply Filter and Process to get a list according to filter
            this.$emit("appliedFilters", { closeDrawer, data: this.selectedFilters});
        },

        /**
         * Function to search options of a particular filter.
         * If there is text in the event object, the data will be filtered,
         * else default options will be set
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} e The event object
         * @param {number} index The index of the selected filter
         */
        searchFilterOptions(e, index){
            if (e && e.text) {
                const filteredData = this.advancedFilterOptions[index].options.filter(
                    a => a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                );
                this.$set(this.filteredOptions[index], 'options', filteredData)
            } else {
                this.$set(this.filteredOptions[index], 'options', this.advancedFilterOptions[index].options)
            }
        },

        /**
         * Function to close one dropdown if the other is clicked open
         * or close one dropdown if the user clicks outside
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} event The event object
         */
        checkOutsideClick(event) {
            /* 
                If the parent element of the selected click is advanced filter dropdown,
                it will check for dropdown number as a class and accordingly close the other dropdown.
            */
            let parentDropdown = event.target.closest('.advanced-filter-dropdown');
            if(parentDropdown) {
                let classList = Array.from(parentDropdown.classList);
                let selectedRef = null;
                for(let className of classList) {
                    if(className.includes('dropdown-number')) {
                        selectedRef = className;
                        break;
                    }
                }

                if(selectedRef) {
                    for(let refId in this.$refs) {
                        if(refId.includes('dropdown-number') && refId !== selectedRef) {
                            if(Array.isArray(this.$refs[refId])) {
                                this.$refs[refId][0].showOptions = false;
                            } else {
                                this.$refs[refId].showOptions = false;
                            }
                        }
                    }
                }
            } else {
                for(let refId in this.$refs) {
                    if(refId.includes('dropdown-number') && !isEmpty(this.$refs[refId])) {
                        if(Array.isArray(this.$refs[refId]) && this.$refs[refId]) {
                            this.$refs[refId][0].showOptions = false;
                        } else if(this.$refs[refId]) {
                            this.$refs[refId].showOptions = false;
                        }
                    }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';

.filter {
    margin-bottom: 24px;
}

.datetime-label {
    color: #9b9b9b;
    font-family: Inter,sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}

::v-deep .mx-datepicker {
    position: unset;
}

::v-deep .mx-datepicker-popup {
    top: initial !important;
    left: -91.5px !important;
}

.main-wrapper {
    display: flex;
    align-items: center;

    .extra-chip-count {
        border-radius: 4px;
        color: #2E31BE;
        background: #FFFFFF;
        border: 1px solid #2E31BE;
    }

}

.chip-wrapper {
    padding-bottom: 12px;
    width: 80%;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    margin-top: 12px;
    // margin: 12px 0px 0px 24px;
    background-image: linear-gradient(to right, rgba(255,0,0,0), rgb(255, 255, 255));

    ::v-deep .nitrozen-chip{
        border-radius: 4px;
    }
}

.chip-button {
    margin-right: 24px;
}

.space-below {
    margin-bottom: 24px;
}
</style>
