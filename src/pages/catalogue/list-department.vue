<template>
    <div class="main-container">
        <div class="jumbo-wrapper">
            <jumbotron
                :title="'Departments'"
                :desc="
                    'Manage or create departments to categorize products according to their type'
                "
                btnLabel="Create"
                @btnClick="createDepartment"
            >
                <div class="bulk-action-dropdown">
                    <nitrozen-dropdown
                        label="Bulk Action"
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
            v-if="!isLoading || departmentList.length > 0 || !pageError"
        >
            <nitrozen-input
                :showSearchIcon="true"
                class="search"
                type="search"
                placeholder="Search by name..."
                v-model="searchText"
                @input="searchDepartment"
            ></nitrozen-input>
            <div class="filter">
                <label class="label">Status</label>
                <nitrozen-dropdown
                    class="filter-dropdown"
                    :items="filter"
                    v-model="selectedFilter"
                    @change="getDepartment"
                ></nitrozen-dropdown>
            </div>
        </div>
        <div>
            <shimmer v-if="isLoading && !pageError" :count="4"></shimmer>
            <page-error
                v-else-if="pageError && !isLoading"
                @tryAgain="getDepartment"
            ></page-error>
            <div v-else-if="departmentList && departmentList.length">
                <div
                    v-for="(item, index) in departmentList"
                    :key="index"
                    class="container"
                    @click="editDepartment(item)"
                >
                    <div class="card-avatar">
                        <img
                            :src="getDepartmentImage(item)"
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
                v-if="departmentList && departmentList.length > 0"
            >
                <nitrozen-pagination
                    name="Department"
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
.main-container {
    margin: 24px;
    padding: 24px;
    background-color: #fff;

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

        ::v-deep .nitrozen-dropdown-label {
            display: none;
        }

        ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger span {
            font-weight: 700;
            font-size: 14px;
            line-height: 140%;
            color: #2e31be;
        }
    }

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
import CatalogService from '@/services/catalog.service';
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
            departmentList: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 10
            },
            filter: FILTER,
            selectedFilter: 'all',
            tempList: [],
            userObj: {},
            bulkAction: BULK_ACTION,
            selectedAction: ''
        };
    },
    mounted() {
        this.getDepartment();
    },
    methods: {
        getQueryParam() {
            const params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.searchText) params.search = this.searchText;
            if (this.selectedFilter != 'all')
                params.is_active = this.selectedFilter;

            return params;
        },
        getDepartment() {
            this.isLoading = true;
            this.pageError = false;
            CatalogService.fetchDepartment(this.getQueryParam())
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
                            this.departmentList = res.data.items;
                            this.pagination.total = res.data.page.item_total;
                            this.isLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.pageError = true;
                    console.error(error);
                });
        },
        searchDepartment: debounce(function() {
            this.getDepartment();
        }, 1000),
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);

            // let pageQuery = { pageId: current, limit };
            // this.setRouteQuery(pageQuery);

            this.getDepartment();
        },
        getDepartmentImage(item) {
            let defaultPic =
                '/public/assets/pngs/product_image_placeholder.png';
            return item.logo || defaultPic;
        },
        getErrorImage(item) {
            let image = '/public/assets/pngs/product_image_placeholder.png';
            this.$set(item, 'logo', image);
        },
        createDepartment() {
            this.$router.push({
                path: '/administrator/product/department/create'
            });
        },
        editDepartment(item) {
            if (item && item.uid) {
                this.$router.push({
                    path: `/administrator/product/department/edit/${item.uid}`
                });
            }
        },
        navigateToBulkAction() {
            this.$router.push({
                path: `/administrator/product/department/${this.selectedAction}`
            });
        }
    }
};
</script>
