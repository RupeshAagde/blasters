<template>
    <loader-vue v-if="l3loader" />
    <div
        v-else
        :class="{
            'hide-container': showLoader,
            'category-create-container': true
        }"
    >
        <div class="category-create-container-header">
            {{ formHeader }}
        </div>
        <div class="category-create-input-container">
            <div class="input-parent">
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
                    :autocomplete="'off'"
                />
                <!-- If there is a error then show  -->
                <nitrozen-error v-if="groupName.error">
                    {{ groupName.error }}
                </nitrozen-error>
            </div>
            <div class="input-parent">
                <nitrozen-input
                    id="slug-input"
                    class="input w-l"
                    :label="slugName.label"
                    :required="true"
                    :placeholder="slugName.placeHolder"
                    v-model="slugName.value"
                    type="text"
                    @blur="handleSlugBlur"
                    @input="handleSlugChange"
                    :autocomplete="'off'"
                    :disabled="
                        Object.keys(selectedCatgegory).length ? true : false
                    "
                />
                <!-- If there is a error then show  -->
                <nitrozen-error v-if="slugName.error">
                    {{ slugName.error }}
                </nitrozen-error>
            </div>
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
import { GET_EDIT_CATEGORY, GET_L3_CATEGORIES } from '../../store/getters.type';
import LoaderVue from '../common/loader.vue';
export default {
    name: 'create-category',
    components: {
        NitrozenError,
        NitrozenInput,
        CategoryMultiSelect,
        LoaderVue
    },
    computed: {
        ...mapGetters({
            selectedCatgegory: GET_EDIT_CATEGORY,
            l3_categories: GET_L3_CATEGORIES
        })
    },
    mounted() {
        this.setCategoryList({}, this.l3_categories);
        // only if there is data in the store call the edit functionality
        if (Object.keys(this.selectedCatgegory).length) {
            this.formHeader = 'Edit Category';
            this.handleEditCategoryGroup(this.selectedCatgegory);
        } else {
            // only if its is not from the create route then redirect
            if (!this.$router.history.current.fullPath.includes('create'))
                this.$router.push(
                    '/administrator/packaging/category-configuration/create'
                );
        }
    },
    props: {
        toggleBtn: {
            type: Function
        },
        showLoader: {
            type: Boolean
        }
    },
    methods: {
        nameToSlug(str) {
            return str
                .toLowerCase()
                .trim()
                .replace(/\s/gi, '-')
                .replace(/[^a-z-0-9]/g, '');
        },
        /**
         * @author Rohan Shah
         * @param {Object} categoryInfo
         * @description Sets the necessary data in the state for the edit category feature
         */
        handleEditCategoryGroup(categoryInfo) {
            this.groupName.value = categoryInfo.categoryName;
            this.selectedCategories = categoryInfo.selectedCategories;
            this.categoryValue = categoryInfo.categoryValue;
            this.slugName.value = categoryInfo.slug;
        },
        /**
         * @author Rohan Shah
         * @description triggers error message on the slug input field
         */
        showError() {
            this.slugName.error = 'Duplicate slug name not allowed';
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
                categories: [],
                slug: this.slugName.value
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
        handleSlugBlur() {
            if (!this.slugName.value)
                this.slugName.error = `${this.slugName.label} is a mandatory field`;
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
            if (!Object.keys(this.selectedCatgegory).length) {
                this.slugName.value = this.nameToSlug(val);
            }
            this.checkForError();
        },
        handleSlugChange(val) {
            this.slugName.value = this.nameToSlug(val);
            this.slugName.error = '';
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
        setCategoryList(e = {}, l3_categories) {
            this.searchableCategoryList = [];
            let query = {
                is_active: true
            };

            if (e.text && e.text.length) {
                query.q = e.text;
            }
            if (l3_categories && l3_categories.length) {
                let tempList = [];
                l3_categories.forEach((a) => {
                    tempList.push({
                        text: a.name,
                        value: a.uid
                    });
                });
                this.searchableCategoryList = tempList;
                this.l3loader = false;
            } else {
                this.$store
                    .dispatch(FETCH_L3_CATEGORIES, query)
                    .then((data) => {
                        if (!data.error) {
                            let tempList = [];
                            data.forEach((a) => {
                                tempList.push({
                                    text: a.name,
                                    value: a.uid
                                });
                            });
                            this.searchableCategoryList = tempList;
                        } else {
                            // call snackbar and return
                            this.$snackbar.global.showError(
                                'Could not fetch l3 categories'
                            );
                        }
                        this.l3loader = false;
                    })
                    .finally(() => {
                        this.l3loader = false;
                    });
            }
        },
        checkForError() {
            if (
                this.groupName.value &&
                !this.groupName.error &&
                this.categoryValue.length > 0 &&
                !this.slugName.error &&
                this.slugName.value
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
            slugName: {
                value: '',
                error: '',
                label: 'Slug name',
                placeHolder: 'Name of the slug'
            },
            searchableCategoryList: [],
            selectedCategories: [],
            categoryValue: [],
            l3loader: true,
            formHeader: 'Create Category'
        };
    }
};
</script>

<style lang="less">
@import '../../less/packaging/create-category.less';
</style>
