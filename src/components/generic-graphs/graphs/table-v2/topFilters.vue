<template>
    <div class="topFilter">
        <nitrozen-input :showSearchIcon="true" class="search" type="search" placeholder="Search shipment ID"
            v-model="searchText"></nitrozen-input>
        <div v-for="filter in filters" :key="filter.filter_name" class="filter-dropdown">
            <nitrozen-dropdown :items="filter.values" label=" " :placeholder=filter.filter_name
                v-model="selectedStatus[filter.filter_name]" :searchable="true" :enable_select_all="filter.multiple"
                :multiple="filter.multiple" @change="filterChange(filter.filter_name)" ></nitrozen-dropdown>
        </div>
    </div>
</template>

<style scoped>
.topFilter{
    padding: 12px;
    background: #F5F5F5;
    display: flex;
    flex-direction: row;
    gap:1rem;
    border-radius: 4px
}
::v-deep .nitrozen-dropdown-container{
    min-width: 12.687rem;
}
::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger span {
    opacity: 0.8;
    font-size: 12px;
}
::v-deep .nitrozen-dropdown-container .nitrozen-option.selected {
    color: #2e31be;
    background-color: inherit;
    font-weight: 600;
}
.search{
    width: 100%;
    height: 2.5rem;
}
</style>

<script>
    import { NitrozenDropdown, NitrozenInput} from '@gofynd/nitrozen-vue';
    import filters from "./filter.json"
    export default {
        name: "top-filters",
        components: {
            NitrozenDropdown,
            NitrozenInput,
        },
        data() {
            return {
                filters: filters,
                selectedStatus:{},
                searchText:''
            }
        },
        methods:{
            filterChange(event){
                console.log("EVENT",event);
                console.log("Filter Selected",this.selectedStatus)
            }
        }
    }
</script>