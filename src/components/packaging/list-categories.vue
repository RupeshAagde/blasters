<template>
    <div class="list-packaging-container">
        <div class="list-packaging-container-header">
            Category Item List
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
        <div class="list-container">
            <!-- Check if products array have items if so then map -->
            <div class="list-container-products" v-if="categories.length">
                <div
                    class="list-container-products-row"
                    v-for="(item, index) of categories"
                    :key="'product-row-' + index"
                >
                    <category-card :item="item" />
                </div>
            </div>
            <!-- else show no content component -->
            <no-content
                v-else
                :helperText="'No Category list have been created yet.'"
                :btnText="'Add New Category'"
                @tryAgain="handleAddCategories"
            />
        </div>
    </div>
</template>

<script>
import NoContent from '../../components/common/adm-no-content.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import { FETCH_CATEGORIES } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_CATEGORIES } from '../../store/getters.type';
import CategoryCard from './common/category-card.vue';
export default {
    name: 'list-categories',
    components: {
        NoContent,
        NitrozenButton,
        CategoryCard
    },
    data() {
        return {
            showLoader: true
        };
    },
    computed: {
        ...mapGetters({
            categories: GET_CATEGORIES
        })
    },
    async mounted() {
        // get products by calling the action
        await this.fetchCategories();
    },
    methods: {
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
            this.$store
                .dispatch(FETCH_CATEGORIES, {})
                .then((res) => {
                    this.showLoader = false;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Could not fetch categories`
                    );
                })
                .finally(() => {
                    this.showLoader = false;
                });
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>
