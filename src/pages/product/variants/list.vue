<template>
    <div class="v-list-page">
        <div>
            <jumbotron
                :title="'Variants'"
                :desc="
                    'Manage or create new variants for products that have more than one option, such as image, size or color.'
                "
            >
                <nitrozen-button
                    theme="secondary"
                    v-strokeBtn
                    @click=""
                    class="mr-s"
                >
                    Group & Sequence</nitrozen-button
                >
                <nitrozen-button
                    theme="secondary"
                    v-flatBtn
                    @click="editVariant()"
                >
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
                placeholder="Search by name"
                v-model="searchText"
                @input="debounceInput"
            ></nitrozen-input>
            <div class="filter">
                <nitrozen-dropdown
                    :items="filteredTemplates"
                    v-model="selectedTemplate"
                    placeholder="template"
                    :searchable="true"
                    @change="getVariants"
                    @searchInputChange="setTemplateList"
                ></nitrozen-dropdown>
            </div>
            <div class="filter">
                <nitrozen-dropdown
                    :items="filter"
                    v-model="selectedFilter"
                    @change="getVariants"
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
                    class="list-container"
                    @click="editVariant(item.uid)"
                >
                    <div class="card-content-section">
                        <div class="full-name mb-l">
                            {{ item.display }}
                        </div>
                        <div class="card-content-line-2 mb-s">
                            <div class="mr-xxl" v-if="item.created_on">
                                <span class="label">Created</span>
                                <div class="label-data">
                                    {{
                                        new Date(
                                            item.created_on
                                        ).toLocaleString()
                                    }}
                                </div>
                            </div>

                            <div>
                                <span class="label">Modified By</span>
                                <div
                                    class="label-data"
                                    v-if="item.modified_by && item.modified_on"
                                >
                                    {{ item.modified_by.username }} on
                                    {{
                                        new Date(
                                            item.modified_on
                                        ).toLocaleString()
                                    }}
                                </div>
                            </div>
                        </div>
                        <div class="card-content-line-3" v-if="item.templates">
                            <span class="label">Templates</span>
                            <div class="label-data">
                                <span
                                    v-for="(dep, ind) of item.templates"
                                    class="chips mr-s"
                                >
                                    {{ dep }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
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
            <!-- <div
                class="pagination"
                v-if="variantList && variantList.length > 0"
            >
                <nitrozen-pagination
                    name="Variants"
                    v-model="pagination"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div> -->
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
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import { FETCH_VARIANTS, FETCH_TEMPLATES } from '@/store/action.type.js';
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
    limit: 999
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
        this.getTemplates();
        this.getVariants();
    },
    methods: {
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
        getTemplates() {
            const reqBody = {
                page_no: 1,
                page_size: 9999,
                sort: 'created_desc'
            };
            this.$store
                .dispatch(FETCH_TEMPLATES, reqBody)
                .then((res) => {
                    if (res.error) {
                        this.$snackbar.global.showError(
                            get(
                                res,
                                'err.response.data.message',
                                'Unable to fetch templates'
                            )
                        );
                        return;
                    }

                    this.templateList = sortBy(res.temp, [
                        (t) => {
                            return t.text;
                        }
                    ]);
                    this.filteredTemplates = cloneDeep(this.templateList);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        setTemplateList(e) {
            this.filteredTemplates = [];
            if (!e || !e.text) {
                this.filteredTemplates = cloneDeep(this.templateList);
                this.selectedTemplate = '';
                this.getVariants();
                return;
            }
            this.templateList.forEach((temp) => {
                if (
                    !e ||
                    !e.text ||
                    temp.text.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.filteredTemplates.push({
                        text: temp.text,
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
        },
        getVariants() {
            this.isLoading = true;
            const reqBody = {
                params: this.getQueryParams(),
                uid: null
            };
            this.$store
                .dispatch(FETCH_VARIANTS, reqBody)
                .then((res) => {
                    if (res.error) {
                        this.$snackbar.global.showError(
                            get(
                                res,
                                'err.response.data.message',
                                'Something went wrong'
                            )
                        );
                        return;
                    }
                    this.variantList = res.items;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        editVariant(uid = null) {
            if (uid) {
                this.$router.push({
                    path: `/administrator/product/variants/edit/${uid}`
                });
            } else {
                this.$router.push({
                    path: '/administrator/product/variants/create'
                });
            }
        }
    }
};
</script>
