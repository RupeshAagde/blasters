<template>
    <div class="category-create-container">
        <div class="category-create-container-header">Create Category</div>
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
import { NitrozenInput, NitrozenError } from '@gofynd/nitrozen-vue';
import CategoryMultiSelect from './common/category-multi-select.vue';
import { generateGroupCategoryRequest } from '../../helper/utils';
import { FETCH_L3_CATEGORIES } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_EDIT_CATEGORY } from '../../store/getters.type';
export default {
    name: 'create-category',
    components: {
        NitrozenError,
        NitrozenInput,
        CategoryMultiSelect
    },
    computed: {
        ...mapGetters({
            selectedCatgegory: GET_EDIT_CATEGORY
        })
    },
    mounted() {
        this.setCategoryList();
        // only if there is data in the store call the edit functionality
        if (Object.keys(this.selectedCatgegory).length) {
            this.handleEditCategoryGroup(this.selectedCatgegory);
        }
    },
    props: {
        toggleBtn: {
            type: Function
        }
    },
    methods: {
        /**
         * @author Rohan Shah
         * @param {Object} categoryInfo
         * @description Sets the necessary data in the state for the edit category feature
         */
        handleEditCategoryGroup(categoryInfo) {
            this.groupName.value = categoryInfo.categoryName;
            this.selectedCategories = categoryInfo.selectedCategories;
            this.categoryValue = categoryInfo.categoryValue;
        },
        /**
         * @author Rohan Shah
         * @description Creates request object
         * @return Request object with specified values
         */
        handleSave() {
            // Create request object
            let createGroupCategory = {
                categoryName: this.groupName.value,
                categories: []
            };
            // pass only the ids
            this.selectedCategories.forEach((category) => {
                createGroupCategory.categories.push(category.value);
            });
            // return the request body for create/update category group object
            return generateGroupCategoryRequest(createGroupCategory);
        },
        /**
         * @author Rohan Shah
         * @description Appends error msg if user tries to submit empty input field
         */
        handleBlur() {
            if (!this.groupName.value)
                this.groupName.error = `${this.groupName.label} is a mandatory field`;
            this.checkForError();
        },
        /**
         * @author Rohan Shah
         * @param {String} val | User input
         * @description Saves user input in the input object and empties the error message
         */
        handleChange(val) {
            this.groupName.value = val;
            this.groupName.error = '';
            this.checkForError();
        },
        /**
         *
         * @author Rohan Shah
         * @description loops through the selected array of categories from the dropdown
         * and updates a new list only for display purpose and request body purpose
         */
        handleCategoryChange(categoryArr) {
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                if (
                    categoryObj &&
                    !this.categoryValue.includes(categoryObj.value)
                ) {
                    this.selectedCategories.push(categoryObj);
                    // push only the unique value / id in the array to maintain selection list
                    this.categoryValue.push(categoryObj.value);
                }
            });
            let valIndex = -1;
            let selectedIndex = -1;
            // Handle the unselect of category
            this.categoryValue.forEach((categoryId, index) => {
                if (!categoryArr.includes(categoryId)) {
                    valIndex = index;
                    selectedIndex = this.selectedCategories.findIndex(
                        (a) => a.value == categoryId
                    );
                }
            });
            // only if the index is not default
            if (valIndex > -1) {
                // remove the selected item
                this.categoryValue.splice(valIndex, 1);
                this.selectedCategories.splice(selectedIndex, 1);
            }
            this.checkForError();
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
            this.checkForError();
        },
        /**
         *
         * @author Rohan Shah
         * @description Generate category list based on user input
         * Designed to return all when called first time or without any input
         */
        setCategoryList(e = {}) {
            this.searchableCategoryList = [];
            let query = {
                is_active: true
            };

            if (e.text && e.text.length) {
                query.q = e.text;
            }
            this.$store.dispatch(FETCH_L3_CATEGORIES, query).then((data) => {
                if (!data.error) {
                    let tempList = [];
                    data.forEach((a) => {
                        tempList.push({
                            text: a.name,
                            value: a.uid
                        });
                    });
                    this.searchableCategoryList = tempList;
                }
            });
        },
        checkForError() {
            if (
                this.groupName.value &&
                !this.groupName.error &&
                this.categoryValue.length > 0
            ) {
                return this.toggleBtn(false);
            }
            this.toggleBtn(true);
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
