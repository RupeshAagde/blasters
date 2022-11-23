<template>
    <div class="combo-dropdown">
        <div v-for="(item, index) in filters" :key="index">
            <template v-if="item.type === 'radio'">
                <!-- <graph-filter-radio :enum="item.enum"></graph-filter-radio> -->
                <graph-filter-combo-box
                    class="form"
                    :data="item.enum"
                    :type="item.key"
                    :selectedOpt="getSelectedOption(item)"
                    @filter-graph="filterGraph($event)"
                ></graph-filter-combo-box>
            </template>
        </div>
    </div>
</template>

<style lang="less" scoped>
.combo-dropdown {
    display: flex;
}
</style>

<script>
import graphFilterRadio from './filters/radio.vue';
import graphFilterComboBox from './filters/combo-box.vue';
import uktinlinesvg from './../../../../components/common/ukt-inline-svg.vue';

export default {
    name: 'graph-filters',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'graph-filter-radio': graphFilterRadio,
        'graph-filter-combo-box': graphFilterComboBox
    },
    props: {
        filters: {},
        componentKey: {}
    },
    data() {
        return {};
    },
    methods: {
        filterGraph(item) {
            this.$emit('filter-graph', item);
        },
        getSelectedOption(item) {
            const strQuery = this.$route.query[this.componentKey];
            const queryObj = strQuery ? JSON.parse(strQuery) : {};

            return queryObj[item.key] || item.enum[0].identifier;
        }
    }
};
</script>
