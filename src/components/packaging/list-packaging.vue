<template>
    <div class="list-packaging-container">
        <div class="list-packaging-container-header">
            <div>
                <p class="packaging-title">List of Packaging Items</p>
                <span class="packaging-subtitle"
                    >Shows all the packaging materials whose dimensions and
                    capacity have been configured</span
                >
            </div>
            <div class="add-packaging-btn-container">
                <nitrozen-button
                    class="add-packaging-btn"
                    :rounded="true"
                    theme="secondary"
                    title="Add Packaging"
                    @click="handleAddPackaging"
                    >Add Packaging</nitrozen-button
                >
            </div>
        </div>
        <!-- TODO remove disabled props once BE supports search functionality -->
        <search-container
            :placeholder="'Search by Package name'"
            :id="'packaging-search'"
            :handleChange="handleChange"
            :value="packagingSearchValue"
            :disabled="true"
        />
        <div
            v-if="showLoader"
            class="loader-parent"
        >
            <loader-vue />
        </div>
        <div class="list-container" v-else>
            <!-- Check if products array have items if so then map -->
            <div class="list-container-products" v-if="products.length">
                <div
                    class="list-container-products-row"
                    v-for="(item, index) of products"
                    :key="'product-row-' + index"
                >
                    <packaging-card
                        :item="item"
                        :groupCategories="groupCategories"
                    />
                </div>
            </div>
            <!-- else show no content component -->
            <no-content
                v-else
                :helperText="
                    `List is empty. No packaging ${
                        packagingSearchValue
                            ? 'found with selected filter'
                            : 'created yet'
                    }`
                "
                :icon="'/public/assets/pngs/packaging_empty.png'"
            />
            <div class="list-container-pagination">
                <nitrozen-pagination
                    v-if="products.length"
                    :name="'Products'"
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
    CLEAR_PRODUCT,
    FETCH_GROUP_CATEGORIES,
    FETCH_PACKAGING_PRODUCTS
} from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_PACKAGING_PRODUCTS } from '../../store/getters.type';
import PackagingCard from './common/packaging-card.vue';
import SearchContainer from './common/search-container.vue';
import { debounce } from '@/helper/utils';
import LoaderVue from '../common/loader.vue';
export default {
    name: 'list-packaging',
    components: {
        NoContent,
        NitrozenButton,
        PackagingCard,
        SearchContainer,
        NitrozenPagination,
        LoaderVue
    },
    data() {
        return {
            pagination: {
                limit: 10,
                total: 0,
                next_page: true,
                current: 1
            },
            perPageValues: [5, 10, 20, 50],
            packagingSearchValue: '',
            showLoader: true,
            groupCategories: []
        };
    },
    computed: {
        ...mapGetters({
            products: GET_PACKAGING_PRODUCTS
        })
    },
    async mounted() {
        // get products by calling the action
        await this.fetchProducts();
        this.$store.dispatch(CLEAR_PRODUCT);
        this.fetchGroupCategories();
    },
    methods: {
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
            if (this.packagingSearchValue.length) {
                param.q = this.packagingSearchValue;
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
            this.packagingSearchValue = inputValue;
            this.fetchProducts();
        }, 1000),
        /**
         * @author Rohan Shah
         * @description On click for add packaging button click
         */
        handleAddPackaging() {
            this.$router.push('/administrator/packaging/create');
        },
        async fetchProducts() {
            await this.$store
                .dispatch(FETCH_PACKAGING_PRODUCTS, this.requestParams())
                .then((res) => {
                    if (res.error) {
                        // call snackbar and return
                        return this.$snackbar.global.showError(
                            'Could not fetch packaging products'
                        );
                    }
                    const { page } = res;
                    // change the pagination config based on API resp
                    this.pagination.total = page.total_item_count;
                    this.pagination.current = page.current;
                    this.pagination.next_page = page.has_next;
                });
        },
        /**
         * @author Rohan Shah
         * @description Fetch all group categories
         */
        fetchGroupCategories() {
            this.showLoader = true;
            this.$store
                .dispatch(FETCH_GROUP_CATEGORIES, { page_size: 9999 })
                .then((res) => {
                    if (res.error) {
                        this.$snackbar.global.showInfo(
                            'Could not fetch group categories'
                        );
                    }
                    const { items } = res;
                    this.groupCategories = items;
                     this.showLoader = false;
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
            this.fetchProducts();
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>
