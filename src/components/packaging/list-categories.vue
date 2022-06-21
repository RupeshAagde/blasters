<template>
    <div class="list-packaging-container">
        <div class="list-packaging-container-header">
            Category Configuration
            {{ categories.length > 0 ? `(${categories.length})` : '' }}
            <div class="add-packaging-btn-container">
                <nitrozen-button
                    class="add-packaging-btn"
                    :rounded="true"
                    theme="secondary"
                    title="Add Packaging"
                    @click="handleAddCategories"
                    >Add Category</nitrozen-button
                >
            </div>
        </div>
        <search-container
            :placeholder="'Search by Group name'"
            :id="'category-search'"
            :handleChange="handleChange"
            :value="groupCategoryValue"
        />
        <div v-if="showLoader" class="loader-parent">
            <loader-vue />
        </div>
        <div class="list-container" v-else>
            <!-- Check if products array have items if so then map -->
            <div class="list-container-products" v-if="categories.length">
                <div
                    class="list-container-products-row"
                    v-for="(item, index) of categories"
                    :key="'product-row-' + index"
                >
                    <category-card
                        v-if="l3CategoryList.length"
                        :item="item"
                        :handleEditClicked="handleEditClicked"
                        :l3CategoryList="l3CategoryList"
                    />
                </div>
            </div>
            <!-- else show no content component -->
            <no-content
                v-else
                :helperText="'No categories have been added'"
                :btnText="'Add New Category'"
                @tryAgain="handleAddCategories"
            />
            <div class="list-container-pagination">
                <nitrozen-pagination
                    v-if="categories.length"
                    :name="'Categories'"
                    v-model="pagination"
                    :pageSizeOptions="perPageValues"
                    @change="pageOptionChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import NoContent from '../../components/common/adm-no-content.vue';
import { NitrozenButton, NitrozenPagination } from '@gofynd/nitrozen-vue';
import {
    CLEAR_CATEGORY,
    EDIT_CATEGORY,
    FETCH_COMPANY_PRODUCTS,
    FETCH_GROUP_CATEGORIES,
    FETCH_L3_CATEGORIES
} from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_CATEGORIES } from '../../store/getters.type';
import CategoryCard from './common/category-card.vue';
import SearchContainer from './common/search-container.vue';
import { debounce } from '@/helper/utils';
import LoaderVue from '../common/loader.vue';
export default {
    name: 'list-categories',
    components: {
        NoContent,
        NitrozenButton,
        CategoryCard,
        SearchContainer,
        NitrozenPagination,
        LoaderVue
    },
    data() {
        return {
            showLoader: true,
            pagination: {
                limit: 10,
                total: 0,
                next_page: true,
                current: 1
            },
            perPageValues: [5, 10, 20, 50],
            groupCategoryValue: '',
            l3CategoryList: []
        };
    },
    computed: {
        ...mapGetters({
            categories: GET_CATEGORIES
        })
    },
    async mounted() {
        // IMP to call this to prevent wrong edit / create calls
        this.$store.dispatch(CLEAR_CATEGORY);
        // get products by calling the action
        await this.fetchCategories();
        await this.fetchL3Categories();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Calls the API to fetch L3 Categories
         */
        async fetchL3Categories() {
            this.$store
                .dispatch(FETCH_L3_CATEGORIES, { is_active: true })
                .then((res) => {
                    if (!res.error) {
                        this.l3CategoryList = res;
                    }
                });
        },
        /**
         * @author Rohan Shah
         * @param {Object} item | Group category Item
         * @description If the L3 categories exists then creates an object
         * and calls the dispatch to set the store value for edit
         */
        handleEditClicked(item) {
            if (this.l3CategoryList.length) {
                let categoryInfo = {
                    categoryName: item.name,
                    slug: item.slug,
                    categoryValue: [],
                    selectedCategories: []
                };
                item.categories.forEach((categoryId) => {
                    let categoryObj = this.l3CategoryList.find(
                        (a) => a.uid == categoryId
                    );
                    if (categoryObj) {
                        categoryInfo.categoryValue.push(categoryObj.uid);
                        // add value and text for display purposes
                        categoryObj.value = categoryObj.uid;
                        categoryObj.text = categoryObj.name;
                        categoryInfo.selectedCategories.push(categoryObj);
                    }
                });
                // set the store value
                this.$store.dispatch(EDIT_CATEGORY, categoryInfo);
                // redirect the user to create configuration page
                this.$router.push(
                    '/administrator/packaging/category-configuration/create'
                );
            }
        },
        /**
         * @author Rohan Shah
         * @description Creates the request parameters to be passed to the API
         * @returns { {page_no:Number, page_size:Number,name:String} } ParamObject
         */
        requestParams() {
            const param = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };
            // only if there is a user input in search pass name param
            if (this.groupCategoryValue.length) {
                param.q = this.groupCategoryValue;
                delete param.page_no;
                delete param.page_size;
            }
            return param;
        },
        /**
         * @author Rohan Shah
         * @description Handles the input change using debounce
         * waits for 1 second before calling the function
         */
        handleChange: debounce(async function(inputValue) {
            this.groupCategoryValue = inputValue;
            this.fetchCategories();
        }, 1000),
        /**
         * @author Rohan Shah
         * @description On click for add packaging button click
         */
        handleAddCategories() {
            this.$router.push(
                '/administrator/packaging/category-configuration/create'
            );
        },
        async fetchCategories() {
            this.showLoader = true;
            this.$store
                .dispatch(FETCH_GROUP_CATEGORIES, this.requestParams())
                .then((res) => {
                    if (res.error) {
                        // call snackbar and return
                        return this.$snackbar.global.showError(
                            'Could not fetch category configurations'
                        );
                    }
                    this.showLoader = false;
                    const { page } = res;
                    // change the pagination config based on API resp
                    this.pagination.total = page.total_item_count;
                    this.pagination.current = page.current;
                    this.pagination.next_page = page.has_next;
                    // if products array are empty then show info and do nothing
                    if (this.categories.length == 0) {
                        this.$snackbar.global.showInfo(
                            'No Packaging Category Configurations found'
                        );
                    }
                })
                .finally(() => {
                    this.showLoader = false;
                });
        },
        /**
         * @author Rohan Shah
         * @param {Object} pageOption
         * @description Update the pageination values based on current selected page option,
         * then calls the fetch products method
         */
        pageOptionChange(pageOption) {
            // modify the state based on current pageOptions
            this.pagination.current = pageOption.current;
            this.pagination.limit = pageOption.limit;
            // call fetch products function to get new values
            this.fetchCategories();
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>
