<template>
    <div class="list-packaging-container">
        <div class="list-packaging-container-header">
            Packaging Item List
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
        <search-container
            :placeholder="'Search by Package name'"
            :id="'packaging-search'"
            :handleChange="handleChange"
        />
        <div class="list-container">
            <!-- Check if products array have items if so then map -->
            <div class="list-container-products" v-if="products.length">
                <div
                    class="list-container-products-row"
                    v-for="(item, index) of products"
                    :key="'product-row-' + index"
                >
                    <packaging-card :item="item" />
                </div>
            </div>
            <!-- else show no content component -->
            <no-content
                v-else
                :helperText="'No packaging list have been created yet.'"
                :btnText="'Add Packaging'"
                @tryAgain="handleAddPackaging"
            />
        </div>
    </div>
</template>

<script>
import NoContent from '../../components/common/adm-no-content.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import { FETCH_PACKAGING_PRODUCTS } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_PACKAGING_PRODUCTS } from '../../store/getters.type';
import PackagingCard from './common/packaging-card.vue';
import SearchContainer from './common/search-container.vue';
import { debounce } from '@/helper/utils';
export default {
    name: 'list-packaging',
    components: {
        NoContent,
        NitrozenButton,
        PackagingCard,
        SearchContainer
    },
    computed: {
        ...mapGetters({
            products: GET_PACKAGING_PRODUCTS
        })
    },
    async mounted() {
        // get products by calling the action
        await this.fetchProducts();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Handles the input change using debounce
         * waits for 1 second before calling the function
         */
        handleChange: debounce(async function(e) {
            // TODO call api here again and paginate the logic
            console.log(e);
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
                .dispatch(FETCH_PACKAGING_PRODUCTS, {})
                .then((res) => {
                    console.log('Do something here');
                });
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>
