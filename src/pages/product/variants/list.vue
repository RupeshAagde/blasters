<template>
    <div class="main-page">
        <div>
            <jumbotron
                :title="'Variants'"
                :desc="
                    'Manage or create new variants for products that have more than one option, such as image, size or color.'
                "
            >
                <nitrozen-button
                    theme="secondary"
                    v-flatBtn
                    @click=""
                    class="mr-s"
                >
                    Group & Sequence</nitrozen-button
                >
                <nitrozen-button theme="secondary" v-strokeBtn @click="test()">
                    Create Variant</nitrozen-button
                >
            </jumbotron>
        </div>

        <div
            class="search-filter"
            v-if="!isLoading || variantList.length > 0 || !pageError"
        >
            <nitrozen-input
                :showSearchIcon="true"
                class="search"
                type="search"
                placeholder="Search by name..."
                v-model="searchText"
                @input="debounceInput"
            ></nitrozen-input>
            <div class="filter">
                <nitrozen-dropdown
                    :items="filter"
                    v-model="selectedTemplate"
                    placeholder="template"
                    :searchable="true"
                    @change="() => {}"
                    @searchInputChange="setTemplateList"
                ></nitrozen-dropdown>
            </div>
            <div class="filter">
                <nitrozen-dropdown
                    :items="filter"
                    v-model="selectedFilter"
                    @change="() => {}"
                ></nitrozen-dropdown>
            </div>
        </div>

        <div>
            <shimmer v-if="isLoading && !pageError" :count="4"></shimmer>
            <page-error
                v-else-if="pageError && !isLoading"
                @tryAgain="getVariants"
            ></page-error>
            <div v-else-if="variantList && variantList.length">
                <div
                    v-for="(item, index) in variantList"
                    :key="index"
                    class="container"
                    @click="editVariant(item)"
                >
                    <div class="card-content-section">
                        <div class="card-content-line-1 full-name">
                            {{ item.display }}
                        </div>
                        <!-- <div
                            class="card-content-line-2"
                            v-if="item.created_by && item.created_by.username"
                        >
                            <span>Created By :</span>
                            <span class="left-space-co">
                                <user-info-tooltip
                                    :userId="userObj[item.created_by.user_id]"
                                ></user-info-tooltip>
                            </span>
                            <span v-if="item.created_on" class="meta-space"
                                >On</span
                            >
                            <span v-if="item.created_on">{{
                                new Date(item.created_on).toLocaleString()
                            }}</span>
                        </div>
                        <div
                            class="card-content-line-2"
                            v-if="item.modified_by && item.modified_by.username"
                        >
                            <span>Modified By :</span>
                            <span class="left-space-mo">
                                <user-info-tooltip
                                    :userId="userObj[item.modified_by.user_id]"
                                ></user-info-tooltip>
                            </span>
                            <span class="meta-space" v-if="item.modified_on"
                                >On</span
                            >
                            <span v-if="item.modified_on">
                                {{
                                    new Date(item.modified_on).toLocaleString()
                                }}
                            </span>
                        </div> -->
                    </div>
                    <div class="cust-button">
                        <nitrozen-badge v-if="item.is_active" state="success"
                            >Active</nitrozen-badge
                        >
                        <nitrozen-badge v-if="!item.is_active" state="warn"
                            >Disabled</nitrozen-badge
                        >
                    </div>
                </div>
            </div>
            <page-empty v-else :text="'No department found'"></page-empty>
            <div
                class="pagination"
                v-if="variantList && variantList.length > 0"
            >
                <nitrozen-pagination
                    name="Variants"
                    v-model="pagination"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import './../../../../src/less/products/variants.less';
</style>

<script>
import Jumbotron from '@/components/common/jumbotron';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import { debounce } from '@/helper/utils';
import cloneDeep from 'lodash/cloneDeep';
import { FETCH_VARIANTS } from '@/store/action.type.js';
import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenButton,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
    total: 0,
    current: 1,
    limit: 50
};
const FILTER = [
    { value: 'all', text: 'All Stage' },
    { value: 'true', text: 'Active' },
    { value: 'false', text: 'Disabled' }
];
export default {
    name: 'variants',
    components: {
        Jumbotron,
        NitrozenInput,
        NitrozenDropdown,
        NitrozenPagination,
        NitrozenBadge,
        NitrozenButton,
        Shimmer,
        PageEmpty,
        PageError
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            isLoading: false,
            pageError: false,
            searchText: '',
            selectedFilter: 'all',
            selectedTemplate: '',
            filter: [...FILTER],
            templateList: [],
            filteredTemplates: [],
            pagination: { ...PAGINATION },
            variantList: []
        };
    },
    mounted() {
        this.getVariants();
    },
    methods: {
        getVariants() {
            const params = this.getQueryParams();
            this.$store
                .dispatch(FETCH_VARIANTS, params)
                .then((res) => {
                    this.variantList = res.items
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        test() {
            console.log(this.selectedTemplate);
        },
        getQueryParams() {
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.searchText) params.q = this.searchText;
            else params.q = undefined;

            if (this.selectedFilter != 'all')
                params.stage = this.selectedFilter;
            else params.stage = undefined;

            if (this.selectedTemplate) params.template = this.selectedTemplate;
            else params.template = undefined;
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...params
                }
            });
            return params;
        },
        debounceInput: debounce(function(e) {
            this.searchText = e;
            this.pagination = { ...PAGINATION };
            this.getVariants();
        }, 500),
        setTemplateList(e) {
            if (!e) {
                this.filteredTemplates = cloneDeep(this.templateList);
                return;
            }
            this.templateList.forEach((temp) => {
                if (
                    !e ||
                    !e.text ||
                    temp.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.searchBrandList.push({
                        text: temp.name,
                        value: temp.uid
                    });
                }
            });
        },
        paginationChange(filter) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination.limit = limit;
            this.getVariants();
        }
    }
};
</script>
