<template>
    <div class="main-container">
        <div class="jumbo-wrapper">
            <jumbotron
                :title="'Category'"
                :desc="'Manage or create categories'"
                btnLabel="Create"
                @btnClick="createDepartment"
            >
                <div class="bulk-action-dropdown">
                    <nitrozen-dropdown
                        label=" "
                        :placeholder="'Bulk Action'"
                        :items="bulkAction"
                        v-model="selectedAction"
                        @change="navigateToBulkAction"
                    ></nitrozen-dropdown>
                </div>
            </jumbotron>
        </div>
        <div
            class="search-filter"
            v-if="!isLoading || categoryList.length > 0 || !pageError"
        >
            <nitrozen-input
                :showSearchIcon="true"
                class="search"
                type="search"
                placeholder="Search by name..."
                v-model="searchText"
                @input="searchCategory"
            ></nitrozen-input>
            <div class="filter">
                <div class="filter-item">
                    <label class="label">Level</label>
                    <nitrozen-dropdown
                        class="filter-dropdown"
                        :items="levelFilter"
                        v-model="selectedFilter.level"
                        @change="getCategory(true)"
                    ></nitrozen-dropdown>
                </div>
                <div class="filter-item">
                    <label class="label">Status</label>
                    <nitrozen-dropdown
                        class="filter-dropdown"
                        :items="filter"
                        v-model="selectedFilter.status"
                        @change="getCategory(true)"
                    ></nitrozen-dropdown>
                </div>
            </div>
        </div>
        <div>
            <shimmer v-if="isLoading && !pageError" :count="4"></shimmer>
            <page-error
                v-else-if="pageError && !isLoading"
                @tryAgain="getCategory"
            ></page-error>
            <div v-else-if="categoryList && categoryList.length">
                <div
                    v-for="(item, index) in categoryList"
                    :key="index"
                    class="container"
                    @click="editCategory(item)"
                >
                    <div class="card-avatar">
                        <img
                            :src="getCategoryImage(item)"
                            @error="getErrorImage(item)"
                            alt="Logo"
                        />
                    </div>
                    <div class="card-content-section">
                        <div class="card-content-line-1 full-name">
                            {{ item.name }}
                        </div>
                        <div
                            class="card-content-line-2"
                            v-if="item.created_by && item.created_on"
                        >
                            <span>Created On : &nbsp;</span>
                            <!-- <span class="left-space-co">
                                <user-info-tooltip
                                    :userId="userObj[item.created_by.user_id]"
                                ></user-info-tooltip>
                            </span>
                            <span v-if="item.created_on" class="meta-space"
                                >On</span
                            > -->
                            <span v-if="item.created_on">{{
                                new Date(item.created_on).toLocaleString()
                            }}</span>
                        </div>
                        <div
                            class="card-content-line-2"
                            v-if="item.modified_by && item.modified_on"
                        >
                            <span>Modified On : &nbsp;</span>
                            <!-- <span class="left-space-mo">
                                <user-info-tooltip
                                    :userId="userObj[item.modified_by.user_id]"
                                ></user-info-tooltip>
                            </span>
                            <span class="meta-space" v-if="item.modified_on"
                                >On</span
                            > -->
                            <span v-if="item.modified_on">
                                {{
                                    new Date(item.modified_on).toLocaleString()
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="cust-button">
                        <nitrozen-badge v-if="item.level" state="info">{{
                            'Level ' + item.level
                        }}</nitrozen-badge>
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
            <page-empty v-else :text="'No category found'"></page-empty>
            <div
                class="pagination"
                v-if="categoryList && categoryList.length > 0"
            >
                <nitrozen-pagination
                    name="Category"
                    v-model="pagination"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.meta-space {
    margin: 0 6px;
}
.left-space-co {
    margin-left: 16px;
    color: #2e31be;
}
.left-space-mo {
    margin-left: 14px;
    color: #2e31be;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
}
.jumbo-wrapper {
    /deep/.jumbotron-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .txt-box + div {
            width: 36%;
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-start;
            button {
                margin-left: 10px;
                // width: 100%;
            }
        }
    }
}
.main-container {
    margin: 24px;
    padding: 24px;
    background-color: #fff;

    .bulk-action-dropdown {
        width: 130px;
        margin-left: 10px;
        ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger span {
            font-weight: 700;
            font-size: 14px;
            line-height: 140%;
            color: #2e31be;
        }

        ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger {
            border: 1px solid #2e31be;
        }
    }

    .custom-header {
        ::v-deep .n-flat-button-secondary {
            margin-top: 110px !important;
        }
    }
    .search-filter {
        margin: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .search {
            width: 400px;
        }

        .filter {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .filter-item {
                display: flex;
                align-items: center;
                margin-left: 15px;
            }

            .filter-dropdown {
                margin-left: 24px;
                width: 200px;
            }
        }
    }
}
.cust-button {
    display: flex;
    justify-content: flex-end;
    margin-left: 8px;
}
.container {
    border: 1px solid #e4e5e6;
    display: flex;
    overflow: visible;
    padding: 24px;
    border-radius: 3px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: box-shadow 0.3s;
    &:hover {
        box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
    }

    .card-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24px;
        width: 90px;
        height: 90px;
        align-self: center;
        background-color: #f8f8f8;
        border-radius: 50%;
        border: 1px solid #e4e5e6;
        img {
            align-items: center;
            min-height: 86px;
            max-height: 86px;
            min-width: 86px;
            max-width: 86px;
            border-radius: 50%;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        .full-name {
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 24px;
            color: #2e31be;
        }

        .card-content-line-2 {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }

        .verified-icon {
            display: inline;
            ::v-deep svg {
                cursor: pointer;
                width: 6px;
                height: 6px;
            }
        }
        .left-space-s {
            margin-left: 4px;
        }
        .left-space-md {
            margin-left: 12px;
        }
        .separator {
            width: 12px;
            text-align: center;
        }
    }
}
</style>
<script>
import CompanyService from '@/services/company-admin.service';

import Jumbotron from '@/components/common/jumbotron';
import {
    debounce,
    generateArrItem,
    filterDuplicateObject,
    fetchUserMetaObjects
} from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import userInfoTooltip from '@/components/common/feedback/userInfo-tooltip.vue';
import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';

const FILTER = [
    { value: 'all', text: 'All' },
    { value: 'true', text: 'Active' },
    { value: 'false', text: 'Disabled' }
];

const LEVELS = [
    { value: 'all', text: 'All' },
    { value: '1', text: 'Level 1' },
    { value: '2', text: 'Level 2' },
    { value: '3', text: 'Level 3' }
];

const BULK_ACTION = [
    { value: 'import', text: 'Import' },
    { value: 'export', text: 'Export' }
];

export default {
    name: 'list-deparment',
    components: {
        Jumbotron,
        NitrozenInput,
        NitrozenDropdown,
        NitrozenPagination,
        NitrozenBadge,
        userInfoTooltip,
        Shimmer,
        PageEmpty,
        PageError
    },
    data() {
        return {
            searchText: '',
            isLoading: false,
            pageError: false,
            categoryList: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 10
            },
            filter: FILTER,
            levelFilter: LEVELS,
            selectedFilter: {
                status: 'all',
                level: 'all'
            },
            tempList: [],
            userObj: {},
            bulkAction: BULK_ACTION,
            selectedAction: ''
        };
    },
    mounted() {
        this.getCategory();
    },
    methods: {
        getQueryParam() {
            const params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.searchText) params.q = this.searchText;
            if (this.selectedFilter.status != 'all')
                params.is_active = this.selectedFilter.status;
            if (this.selectedFilter.level != 'all')
                params.level = this.selectedFilter.level;

            return params;
        },
        getCategory(resetPage = false) {
            this.isLoading = true;
            this.pageError = false;
            if (resetPage) {
                this.pagination.current = 1;
            }
            CompanyService.fetchCategory_v2(this.getQueryParam())
                .then((res) => {
                    this.tempList = generateArrItem(res.data.items);
                    this.tempList = filterDuplicateObject(this.tempList);
                    fetchUserMetaObjects(this.tempList)
                        .then((response) => {
                            response.map((element) => {
                                if (!this.userObj[element.uid]) {
                                    this.userObj[element.uid] = element;
                                }
                            });
                            this.pagination.total = res.data.page.item_total;
                            this.categoryList = res.data.items;
                            this.isLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.pageError = true;
                });
        },
        searchCategory: debounce(function() {
            this.getCategory(true);
        }, 1000),
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);

            // let pageQuery = { pageId: current, limit };
            // this.setRouteQuery(pageQuery);

            this.getCategory();
        },
        getCategoryImage(item) {
            const { media } = item;
            let defaultPic =
                '/public/assets/pngs/product_image_placeholder.png';
            return media.logo || defaultPic;
        },
        getErrorImage(item) {
            let image = '/public/assets/pngs/product_image_placeholder.png';
            this.$set(item, 'logo', image);
        },
        createDepartment() {
            this.$router.push({
                path: '/administrator/product/category/create'
            });
        },
        editCategory(item) {
            if (item && item.uid) {
                this.$router.push({
                    path: `/administrator/product/category/edit/${item.uid}`
                });
            }
        },
        navigateToBulkAction() {
            this.$router.push({
                path: `/administrator/product/category/${this.selectedAction}`
            });
        }
    }
};
</script>
