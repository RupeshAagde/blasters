<template>
    <div class="toggle-container-category-body">
        <nitrozen-dropdown
            id="l3-dropdown"
            :label="'Default L3 category'"
            :tooltip="'Some tool tip text'"
            :searchable="true"
            :placeholder="'Search or select a category'"
            :multiple="true"
            :items="searchableCategoryList"
            @change="(val) => handleCategoryChange(val)"
            @searchInputChange="setCategoryList"
            :value="categoryValue"
        />
        <div class="toggle-container-category-list">
            <div
                v-for="(item, index) of selectedCategories"
                :key="'selected-category' + index"
                :id="'selected-category' + index"
                class="toggle-container-category-list-item"
            >
                <span class="category-list-item-ellipsis" :title="item.text">
                    {{ item.text }}
                </span>
                <div @click="handleCategoryRemove(item, index)">
                    <inline-svg-vue :src="'cross-grey'" class="icon-cross" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import inlineSvgVue from '../../common/inline-svg.vue';
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';
export default {
    components: {
        inlineSvgVue,
        NitrozenDropdown
    },
    name: 'category-multi-select',
    props: {
        handleCategoryChange: {
            type: Function
        },
        handleCategoryRemove: {
            type: Function
        },
        searchableCategoryList: {
            type: Array
        },
        selectedCategories: {
            type: Array
        },
        setCategoryList: {
            type: Function
        },
        categoryValue: {
            type: Array
        }
    }
};
</script>

<style lang="less">
@import '../../../less/packaging/category-multi-select.less';
</style>
