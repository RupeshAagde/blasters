<template>
    <div class="category-create-container">
        <div class="category-create-container-header">Add New Category</div>
        <div class="category-create-input-container">
            <nitrozen-input
                id="category-input"
                class="input w-l"
                :label="groupName.label"
                :required="true"
                :placeholder="groupName.placeHolder"
                v-model="groupName.value"
                type="text"
                @blur="handleBlur"
                @input="handleChange"
            />
            <!-- If there is a error then show  -->
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
            :categoryValue="categoryValue"
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
    mounted() {
        this.setCategoryList();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Creates request object
         * @return Request object with specified values
         */
        handleSave() {
            // Create request object
            let requestObj = {
                categoryName: this.groupName.value,
                selectedCategories: this.selectedCategories
            };
            return requestObj;
        },
        /**
         * @author Rohan Shah
         * @description Appends error msg if user tries to submit empty input field
         */
        handleBlur() {
            if (!this.groupName.value)
                this.groupName.error = `${this.groupName.label} is a mandatory field`;
        },
        /**
         * @author Rohan Shah
         * @param {String} val | User input
         * @description Saves user input in the input object and empties the error message
         */
        handleChange(val) {
            this.groupName.value = val;
            this.groupName.error = '';
        },
        /**
         *
         * @author Rohan Shah
         * @description loops through the selected array of categories from the dropdown
         * and updates a new list only for display purpose and request body purpose
         */
        handleCategoryChange(categoryArr) {
            let tempCategoryArry = [];
            let tempCategoryArr = [];
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                tempCategoryArry.push(categoryObj);
                // push only the unique value / id in the array to maintain selection list
                tempCategoryArr.push(categoryObj.value);
            });
            // assign the values to state variables
            this.selectedCategories = tempCategoryArry;
            this.categoryValue = tempCategoryArr;
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
            // Find the index by value
            let valIndex = this.categoryValue.findIndex(
                (ele) => ele == category.value
            );
            // remove the index so it is unselected from the drop down as well
            this.categoryValue.splice(valIndex, 1);
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
                }
            ],
            searchableCategoryList: [],
            selectedCategories: [],
            categoryValue: []
        };
    }
};
</script>

<style lang="less">
@import '../../less/packaging/create-category.less';
</style>
