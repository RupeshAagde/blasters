<template>
   <div class="filters-section" @click="stopClick($event); checkOutsideClick($event)">
       <div class="header-box">
            <div class="filters-title">Filters</div>
       </div>
       <div class="primary-filters" v-if="filteredOptions.length">
            <div class="primary-filter-title">
                <ukt-inline-svg src="primary-filters-dot" /> 
                Primary Filters
            </div>
            <!-- @TODO Please handle multiple types of filter based on their `type` key -->
            <div
                v-for="(f, i) in advancedFilterOptions"
                :key="'advanced-filter-'+i"
            >
                <nitrozen-dropdown
                    :class="`advanced-filter-dropdown dropdown-number-${i+1}`"
                    :label="f.text"
                    :key="'advanced-filter-dropdown-'+i"
                    :placeholder="`Select ${f.text}`"
                    :items="filteredOptions[i].options"
                    v-model="selectedFiltersOptions[f.value]"
                    :multiple="f.type === 'multi_select'"
                    :searchable="f.type"
                    @searchInputChange="searchFilterOptions($event,i)"
                    @change="onMultiSelectChange($event, f.value)"
                    :ref="`dropdown-number-${i+1}`"
                ></nitrozen-dropdown>
                <div class="main-wrapper" v-if="selectedFiltersOptions[f.value] && (selectedFiltersOptions[f.value].length || typeof selectedFiltersOptions[f.value] == 'number')">
                    <div class="chip-wrapper" v-if="f.type === 'multi_select'" ref="chipwrapper">
                        <div v-for="(tag, index) in selectedFiltersOptions[f.value]" :key="'chips-'+index">
                            <nitrozen-chips class="chip">
                                {{ getSelectedFilterText(tag, i) }}  
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="removeChip(f.value,index)"
                                ></nitrozen-inline>  
                            </nitrozen-chips>
                        </div>
                    </div>
                    <div class="chip-wrapper" v-if="f.type === 'single_select'" ref="chipwrapper">
                        <div>
                            <nitrozen-chips class="chip">
                                {{ getSelectedFilterText(selectedFiltersOptions[f.value], i) }}  
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="removeChip(f.value)"
                                ></nitrozen-inline>  
                            </nitrozen-chips>
                        </div>
                    </div>
                    <!-- <nitrozen-chips class="extra-chip-count">
                        {{numb}}
                    </nitrozen-chips> -->
                    <nitrozen-button @click="removeChip(f.value)" class="chip-button"  :theme="'secondary'">Clear</nitrozen-button>
                </div>
            </div>
        </div>
     
        <div class="footer-box">
                <nitrozen-button class="clear-button"  :theme="'secondary'"  @click="resetFilters($event)">Clear all</nitrozen-button>
                <nitrozen-button class="apply-filter-button" v-flatBtn :theme="'secondary'" @click.stop="applyFilters()">Apply filter</nitrozen-button>
       </div>
   </div>
</template>

<style lang="less" scoped>
.filters-section {
    height: calc(100% - 72px);
    .header-box{
        box-sizing: border-box;
        border-bottom: 1px solid #E0E0E0;
        .filters-title {
            margin: 24px 0px 24px 24px;
            width: 60px;
            // height: 31px;
            left: 24px;
            top: 24px;
            font-weight: 600;
            font-size: 20px;
            line-height: 31px;
            color: @Mako;
        }
    }
}
.primary-filters {
    padding-bottom: 5rem;
    .primary-filter-title {
        display: flex;
        gap: 8px;
        margin: 24px 0px 0px 24px;
        font-weight: 700;
        font-size: 16px;
        line-height: 32px;
        color: @Mako;
        ::v-deep .inline-svg {
            display: block;
        }
    }
    .advanced-filter-dropdown {
        margin: 24px 0px 0px 24px;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        width: 60%;

        ::v-deep .n-input,
        ::v-deep .nitrozen-select__trigger {
            border-radius: 4px;
        }
    }
    
}
.footer-box {
    position: fixed;
    bottom: 0;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;
    margin-top: 72px;
    box-sizing: border-box;
    border-top: 1px solid #E0E0E0;
    padding: 16px 0px 16px 0px;
    background: @White;
    box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
    .apply-filter-button{
        margin-right: 16px;
    }
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
    width: 60%;
    overflow-y: hidden;
    overflow-x: scroll;
    display: flex;
    margin: 12px 0px 0px 24px;
    background-image: linear-gradient(to right, rgba(255,0,0,0), rgb(255, 255, 255));
    ::v-deep .nitrozen-chip{
        border-radius: 4px;
    }
}
.chip-button {
    margin-right: 24px;
}

</style>

<script>
import loader from '@/components/common/loader.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import AdmPageError from "@/components/common/page-error.vue";
import OrderListItem from './order-list-item.vue';
import { NitrozenButton, flatBtn, NitrozenInput, NitrozenRadio, 
NitrozenDropdown, NitrozenChips, NitrozenInline } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

export default {
    name: 'advanced-filter-drawer',
    components: {
        loader,
        // shipment,
        AdmPageError,
        InlineSvg,
        UktInlineSvg,
        // "order-card": ordercard,
        NitrozenButton,
        'nitrozen-button': NitrozenButton,
        OrderListItem,
        NitrozenInput,
        flatBtn,
        NitrozenRadio,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
    },
    directives: {
        // strokeBtn
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
    beforeMount(){
        // Clear Filters already set if any
        this.initFilters();
    },
    mounted(){
        // this.matchHeight();
        this.filteredOptions = this.advancedFilters && this.advancedFilters.length ? cloneDeep(this.advancedFilters) : []
        // Load preseted Filters
        this.loadFilters();
    },
    data() {
        return {
            advancedFilterQuery: {},
            selectedFilters:{},
            numb: "+1",
            filteredOptions: []
        };
    },
    computed: {
        advancedFilterOptions(){
            return this.advancedFilters && this.advancedFilters.length ? cloneDeep(this.advancedFilters) : []
        },
        selectedFiltersOptions(){
            return this.selectedFilters || {};
        }
    },
    methods: {
        // matchHeight () {
        //     let height = this.$el.chipwrapper;
        // },
        stopClick(event){
            event.stopPropagation();
        },
        getSelectedFilterText(tag, i){
            // Used for Text Normalization and Display 
            return this.advancedFilterOptions[i].options.find(ele => ele.value == tag)?.text || ''
        },
        resetFilters(e) {
            e.stopPropagation()
            // Clears All Filters
            this.initFilters();

            // @NOTE: Added to clear and apply 
            this.$emit("applyFilters", {closeDrawer:false,data:this.selectedFilters});
        },
        removeChip(filter_value,remove_index=-1) {
            if(remove_index!=-1){
                // Remove ONE Chip of given Filter
                this.selectedFilters[filter_value].splice(remove_index,1);
            }else{
                // Remove ALL Chips of given Filter 
                this.$set(this.selectedFilters,filter_value,[]);
            }
        },
        initFilters(){
            // Initialize or Clear the filters
            this.advancedFilterOptions.forEach(filter => {
                filter.options.forEach(o=>o.selected=false)
                this.$set(this.selectedFilters,filter.value, [])
            });
        },
        loadFilters(){
            // Load Filters initially
            this.selectedFilters = this.advancedSelectedFilters;
        },
        onMultiSelectChange(selection, val) {
            if(typeof(selection) == 'number') {
                let convertArray = [];
                convertArray.push(selection);
                this.selectedFilters[val]=convertArray;
            }
            else {
                // Changes in 'multi_select' type of filter
                this.selectedFilters[val]=selection;
            }
        },
        applyFilters(closeDrawer=true){
             // Apply Filter and Process to get a list according to filter
            this.$emit("applyFilters", {closeDrawer,data:this.selectedFilters});
        },
        // isAnyFilterSelected(){
        //     // Used to show the indicator for advanced applied filters
        //     if(this.selectedFiltersOptions && Object.values(this.selectedFiltersOptions).length){
        //         return Object.values(this.selectedFiltersOptions).find(asf=>asf&&asf.length)?true:false;
        //     }else{
        //         return false;
        //     }
        // },
        searchFilterOptions(e,index){
            if (e && e.text) {
                const filteredData = this.advancedFilterOptions[index].options.filter(
                    a => a.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
                );
                this.$set(this.filteredOptions[index], 'options', filteredData)
            } else {
                this.$set(this.filteredOptions[index], 'options', this.advancedFilterOptions[index].options)
            }
        },
        checkOutsideClick(event) {
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
    },
};
</script>
