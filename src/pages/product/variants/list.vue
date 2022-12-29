<template>
    <div class="v-list-page">
        <div>
            <jumbotron
                :title="'Variants'"
                :desc="
                    'Manage or create new variants for products that have more than one option, such as image, size or color.'
                "
            >
                <!-- <nitrozen-button
                    theme="secondary"
                    v-strokeBtn
                    @click=""
                    class="mr-s"
                >
                    Group & Sequence</nitrozen-button
                > -->
                <nitrozen-button
                    id="create-btn"
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
                    class="hide-label"
                    :label="'Template'"
                    :items="filteredTemplates"
                    v-model="selectedTemplate"
                    placeholder="Template"
                    :searchable="true"
                    :multiple="true"
                    :enable_select_all="true"
                    @change="getVariants"
                    @searchInputChange="setTemplateList"
                ></nitrozen-dropdown>
            </div>
            <div class="filter">
                <nitrozen-dropdown
                    :items="filter"
                    v-model="selectedFilter"
                    placeholder="Status"
                    :searchable="true"
                    @change="getVariants"
                    @searchInputChange="resetStatus"
                ></nitrozen-dropdown>
            </div>
        </div>

        <div>
            <shimmer v-if="isLoading && !pageError" :count="4"></shimmer>
            <page-error
                v-else-if="pageError && !isLoading"
                @tryAgain="getVariants"
            ></page-error>
            <div v-else-if="variantList && variantList.length && !isLoading">
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
                            <div class="mr-xl" v-if="item.created_on">
                                <span class="label">Created</span>
                                <div class="label-data">
                                    {{ formatDate(item.created_on) }}
                                </div>
                            </div>

                            <div>
                                <span class="label">Modified By</span>
                                <div
                                    class="label-data"
                                    v-if="item.modified_by && item.modified_on"
                                >
                                    {{
                                        getUserName(
                                            item.modified_by.user_id,
                                            item.modified_by.username
                                        )
                                    }}
                                    on
                                    {{ formatDate(item.modified_on) }}
                                </div>
                            </div>
                        </div>
                        <div class="card-content-line-3" v-if="item.templates">
                            <span class="label">Templates</span>
                            <div class="label-data">
                                <span v-for="(dep, ind) of item.templates">
                                    <span
                                        v-if="ind < 8"
                                        class="chips mr-xs mb-xs"
                                        >{{ dep }}
                                    </span>
                                    <span
                                        class="plusMoreBtn mr-xs mb-xs"
                                        v-else-if="
                                            ind >= 8 &&
                                                ind == item.templates.length - 1
                                        "
                                        >+{{ ind + 1 - 8 }} More</span
                                    >
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

<style lang="less" scoped>
@import './../../../../src/less/products/variants.less';
::v-deep .hide-label {
    .nitrozen-dropdown-label {
        display: none !important;
    }
}
</style>

<script>
import Jumbotron from '@/components/common/jumbotron';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import {
    debounce,
    generateArrItem,
    filterDuplicateObject,
    fetchUserMetaObjects
} from '@/helper/utils';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import dateFormat from 'dateformat';
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
            selectedFilter: '',
            selectedTemplate: [],
            filter: [...FILTER],
            templateList: [],
            filteredTemplates: [],
            pagination: { ...PAGINATION },
            variantList: [],
            userObj: {}
        };
    },
    mounted() {
        this.getTemplates();
        this.getVariants();
    },
    methods: {
        getQueryParams() {
            let params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.searchText) params.q = this.searchText;
            else params.q = undefined;

            if (this.selectedFilter) params.stage = this.selectedFilter;

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
            this.$store.dispatch(FETCH_TEMPLATES, reqBody).then((res) => {
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
            });
        },
        setTemplateList(e) {
            this.filteredTemplates = [];
            if (!e || !e.text) {
                this.filteredTemplates = cloneDeep(this.templateList);
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
                        value: temp.value,
                        id: temp.id
                    });
                }
            });
        },
        resetStatus(e) {
            if (!e || !e.text) {
                this.selectedFilter = '';
                this.getVariants();
                return;
            }
        },
        // paginationChange(filter) {
        //     const { current, limit } = filter;
        //     this.pagination.current = current;
        //     this.pagination.limit = limit;
        //     this.getVariants();
        // },
        getVariants() {
            this.isLoading = true;
            const reqBody = {
                params: this.getQueryParams(),
                uid: null
            };
            this.$store.dispatch(FETCH_VARIANTS, reqBody).then((res) => {
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
                let tempUserList = generateArrItem(this.variantList);
                tempUserList = filterDuplicateObject(tempUserList);

                fetchUserMetaObjects(tempUserList)
                    .then((response) => {
                        response.map((element) => {
                            if (this.userObj && !this.userObj[element._id]) {
                                this.userObj[element._id] = element;
                            }
                            if (this.userObj && !this.userObj[element.uid]) {
                                this.userObj[element.uid] = element;
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
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
        },
        getUserName(user_id, username) {
            let tempObj = this.userObj[user_id];
            if (tempObj && tempObj.hasOwnProperty('first_name')) {
                return (
                    tempObj.first_name +
                    ' ' +
                    (tempObj.last_name ? tempObj.last_name : '')
                );
            } else {
                return username;
            }
        },
        formatDate(d) {
            try {
                return dateFormat(d, 'mmm dd, yyyy HH:MM:ss TT');
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
