<template>
    <div>
        <template>
            <nitrozen-dropdown
                class="combo-select"
                :label="''"
                :searchable="false"
                @searchInputChange="searchData"
                :items="getData"
                v-model="selectedObjValue"
                @change="applyFilter"
            ></nitrozen-dropdown>
        </template>
    </div>
</template>

<style lang="less" scoped>
.combo-select {
    width: 150px;
    margin-right: 12px;
}
</style>

<script>
import uktinlinesvg from './../../../../../components/common/ukt-inline-svg.vue';
import uktSelect from './../../../../../components/common/ukt-select.vue';
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';

export default {
    name: 'graph-filter-combo-box',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'ukt-select': uktSelect,
        'nitrozen-dropdown': NitrozenDropdown
    },
    props: {
        data: {},
        type: {},
        selectedOpt: {}
    },
    computed: {
        getData() {
            if (Array.isArray(this.data)) {
                return this.data.map(it => {
                    it.text = it.display;
                    it.value = it.identifier;
                    return it;
                });
            }
            return [];
        }
    },
    data() {
        const selectedObj = this.getSelectedIdentifier(this.selectedOpt);
        selectedObj.value = selectedObj.identifier;
        return {
            text: selectedObj.display || '',
            selectedObj: selectedObj,
            selectedObjValue: selectedObj.value || '',
            filteredData: []
        };
    },
    methods: {
        filterGraph(item) {
            item.key = this.type;
            this.$emit('filter-graph', item);
        },
        applyFilter(selectedVal) {
            const selectedItem = this.getSelectedIdentifier(selectedVal);
            this.filterGraph(selectedItem);
        },
        getSelectedIdentifier(selectedVal) {
            const arrSelected = this.data.filter(it => {
                return (
                    it.identifier === selectedVal ||
                    it.identifier === Number(selectedVal)
                );
            });
            return arrSelected.length > 0 ? arrSelected[0] : {};
        },
        searchData(e) {
            if (e && e.text) {
                let text = e.text;
                this.filteredData = this.getData.filter(
                    a => a.text.toLowerCase().indexOf(text.toLowerCase()) > -1
                );
            } else {
                this.filteredData = this.getData;
            }
        }
    }
};
</script>
