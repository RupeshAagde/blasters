<template>
    <div class="category-create-container">
        <div class="category-create-container-header">Add New Category</div>
        <div class="category-create-input-container">
            <nitrozen-input
                class="input w-l"
                :label="groupName.label"
                :required="true"
                :placeholder="groupName.placeHolder"
                v-model="groupName.value"
                type="text"
                @blur="handleBlur"
                @input="handleChange"
            />
            <nitrozen-error v-if="groupName.error">
                {{ groupName.error }}
            </nitrozen-error>
        </div>
        <!-- Call to reusable component to select multiple categories -->
        <category-multi-select
            :handleCategoryChange="handleCategoryChange"
            :handleCategoryRemove="handleCategoryRemove"
            :searchableCategoryList="searchableCategoryList"
            :selectedCategories="selectedCategories"
            :setCategoryList="setCategoryList"
        />
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import CategoryMultiSelect from './common/category-multi-select.vue';
export default {
    name: 'create-category',
    components: {
        NitrozenError,
        NitrozenInput,
        NitrozenDropdown,
        CategoryMultiSelect
    }, 
    methods: {
        handleSave() {
            // return request object from here
        },
        handleBlur(){
             if (!this.groupName.value)
                this.groupName.error = `${this.groupName.label} is a mandatory field`;
        },
        handleChange(val){
            this.groupName.value = val
            this.groupName.error = ''
        }
    },
    data() {
        return {
            groupName: {
                value: '',
                error: '',
                label: 'Group Name',
                placeHolder: 'Name of the group'
            },
            categoryList: [],
            searchableCategoryList: [],
            selectedCategories: []
        };
    }
};
</script>

<style lang="less">
@import '../../less/packaging/create-category.less';
</style>
