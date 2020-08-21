<template>
    <div class="main-container">
        <div>
            <jumbotron
                :title="'Variants'"
                :desc="
                    'Manage or create new variants for products that have more than one option, such as image, size or color.'
                "
                btnLabel="Create Variant"
                @btnClick="createVariant"
            ></jumbotron>
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
                @input="searchVariant"
            ></nitrozen-input>
            <div class="filter">
                <label class="label">Status</label>
                <nitrozen-dropdown
                    class="filter-dropdown"
                    :items="filter"
                    v-model="selectedFilter"
                    @change="searchVariant"
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
                        <div
                            class="card-content-line-2"
                            v-if="item.created_by && item.created_by.username"
                        >
                            <span>Created By :</span>
                            <span class="left-space-co">{{
                                item.created_by.username
                            }}</span>
                        </div>
                        <div
                            class="card-content-line-2"
                            v-if="item.modified_by && item.modified_by.username"
                        >
                            <span>Modified By :</span>
                            <span class="left-space-mo">{{
                                item.modified_by.username
                            }}</span>
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
<style lang="less" scoped>
.meta-space {
    margin: 0 6px;
}
.left-space-co {
    margin-left: 16px;
    color: #9b9b9b;
}
.left-space-mo {
    margin-left: 14px;
    color: #9b9b9b;
}
.label {
    color: #9b9b9b;
    font-size: 14px;
}
.main-container {
    margin: 24px;
    padding: 24px;
    background-color: #fff;
    font-family: Poppins;

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
    border-radius: 4px;
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
            color: #5c6bdd;
        }

        .card-content-line-2 {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }
        .left-space-s {
            margin-left: 4px;
        }
        .left-space-md {
            margin-left: 12px;
        }
    }
}
</style>
<script>
import CatalogService from '@/services/catalog.service';
import Jumbotron from '@/components/common/jumbotron';
import { debounce } from '@/helper/utils';
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

export default {
    name: 'list-variants',
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
            selectedFilter: 'all',
            filter: [...FILTER],
            isLoading: false,
            pageError: false,
            variantList: [],
            mainList: [],
            pagination: {
                total: 0,
                current: 1,
                limit: 50
            }
        };
    },
    mounted() {
        this.getVariants();
    },
    methods: {
        getQueryParams() {
            const params = {
                page: this.pagination.current,
                page_size: this.pagination.limit
            };
            return params;
        },
        getVariants() {
            this.isLoading = true;
            CatalogService.fetchVariants(this.getQueryParams())
                .then((res) => {
                    this.pagination.total = res.data.page.total_item_count;
                    this.mainList = res.data.data;
                    this.variantList = res.data.data;
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.error(error);
                    this.isLoading = false;
                    this.pageError = true;
                });
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);

            this.getVariants();
        },
        searchVariant() {
            if (this.mainList && this.mainList.length > 0) {
                if (this.searchText != '' && this.selectedFilter !== 'all') {
                    let temp = true;
                    if (this.selectedFilter == 'true') temp = true;
                    if (this.selectedFilter == 'false') temp = false;
                    this.variantList = this.mainList.filter((element) => {
                        return (
                            element.display
                                .toLowerCase()
                                .includes(this.searchText.toLowerCase()) &&
                            element.is_active == temp
                        );
                    });
                } else if (this.selectedFilter != 'all') {
                    let temp = true;
                    if (this.selectedFilter == 'true') temp = true;
                    if (this.selectedFilter == 'false') temp = false;
                    this.variantList = this.mainList.filter((element) => {
                        return element.is_active == temp;
                    });
                } else if (this.searchText != '') {
                    this.variantList = this.mainList.filter((element) => {
                        return element.display
                            .toLowerCase()
                            .includes(this.searchText.toLowerCase());
                    });
                } else {
                    this.variantList = this.mainList;
                }
            }
        },
        createVariant() {
            this.$router.push({
                path: '/administrator/product/variants/create'
            });
        },
        editVariant(item) {
            if (item) {
                this.$router.push({
                    path: `/administrator/product/variants/edit/${item.uid}`
                });
            }
        }
    }
};
</script>
