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
    mounted(){
        this.setCategoryList()
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
        },
        /**
         *
         * @author Rohan Shah
         * @description loops through the selected array of categories from the dropdown
         * and updates a new list only for display purpose and request body purpose
         */
        handleCategoryChange(categoryArr) {
            let tempCategoryArry = [];
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                tempCategoryArry.push(categoryObj);
            });
            this.selectedCategories = tempCategoryArry;
        },
        /**
         *
         * @author Rohan Shah
         * @description Handles selected category removal and change the selected
         * state in the drop down as well
         */
        handleCategoryRemove(category, index) {
            // remove the element from selected array
            this.selectedCategories.splice(index, 1);
            // TODO figure out how to remove selected state after this
        },
        /**
         *
         * @author Rohan Shah
         * @description Generate category list based on user input
         * Designed to return all when called first time or without any input
         */
        setCategoryList(e = {}) {
            this.searchableCategoryList = [];
            // TODO loop through state list
            this.categoryList.forEach((a) => {
                if (
                    !e.text ||
                    a.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.searchableCategoryList.push({
                        text: a.name,
                        value: a.uid
                    });
                }
            });
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
            // TODO remove mock categories after API integration
            categoryList: [
                {
                    name: 'Fashion Sense',
                    uid: 1
                },
                {
                    name: 'Fashion ',
                    uid: 2
                },
                {
                    name: 'Garments',
                    uid: 3
                },
                {
                    name: 'Fashion dated',
                    uid: 4
                },
                {
                    name: 'Fashion dated',
                    uid: 5
                },
                {
                    name: 'Fashion dated',
                    uid: 6
                },
                {
                    name: 'Fashion dated',
                    uid: 7
                },
                {
                    name: 'Fashion dated',
                    uid: 8
                },
                {
                    name: 'Fashion dated',
                    uid: 9
                },
            ],
            searchableCategoryList: [],
            selectedCategories: []
        };
    }
};
</script>

<style lang="less">
@import '../../less/packaging/create-category.less';
</style>
