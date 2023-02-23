<template>
    <div class="panel">
        <div class="page-container">
            <jumbotron
                class="extensions-jmbtrn"
                :title="
                    `Extensions ${
                        extensionList && extensionList.length
                            ? '(' + pagination.total + ')'
                            : ''
                    }`
                "
                :desc="'Extensions for review'"
            ></jumbotron>
            <!--Search Baar-->
            <template>
                <div class="search-filter">
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search-box"
                        type="search"
                        placeholder="Search by name"
                        ref="search-box"
                        v-model="searchText"
                        @input="debounceInput"
                    ></nitrozen-input>

                    <div class="filter">
                        <label class="label">Filter</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            :items="filters"
                            v-model="selectedFilter"
                            ref="filter-dropdown"
                            @change="
                                setRouteQuery({
                                    current_status: selectedFilter
                                })
                            "
                        ></nitrozen-dropdown>
                    </div>
                </div>
            </template>

            <!--Staff List-->
            <div class="extension-card-list">
                <list-shimmer
                    v-if="pageLoading && !pageError"
                    :count="4"
                ></list-shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @retry="fetchExtensions()"
                ></page-error>

                <div
                    v-for="(extension, index) in extensionList"
                    :key="extension._id"
                >
                    <list-card
                        :extension="extension"
                        :ref="'extension-' + index"
                        @click="edit(extension)"
                    >
                    </list-card>
                </div>
            </div>
            <page-empty
                v-if="extensionList.length == 0"
                text="No extensions for review"
            ></page-empty>
            <div v-if="extensionList.length" class="pagination">
                <nitrozen-pagination
                    name="Extensions"
                    v-model="pagination"
                    ref="ext-paginagtion"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.main-container {
    height: 100%;
    .page-container {
        width: 100%;
    }
}
.extensions-jmbtrn {
    width: 100%;
}

.extension-card-list {
    width: 100%;
    background-color: @White;

    .extension-card {
        & + .extension-card {
            margin-top: 24px;
        }
    }
}

.extension-filters {
    display: flex;
    .dropdown-filters {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        > div {
            padding-left: 10px;
        }
        .type-filter {
            width: 100px;
        }
        .applicable-on-filter {
            width: 200px;
        }
        .archived-filter {
            width: 100px;
        }
    }
}

.nitrozen-pagination-container,
.extension-card-list {
    margin-top: 20px;
}
.search-filter {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;
    width: 100%;
    .search-box {
        min-width: 400px;
    }
    .filter-dropdown {
        width: 200px;
        margin-left: 12px;
    }
    .label {
        font-family: Inter, sans-serif;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        width: 44px;
        margin: auto 0;
        font-weight: 500;
    }

    .filter {
        display: flex;
        flex-direction: row;
        .filter-text {
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
        }
        select {
            background-color: @White;
            border: 1px solid @Iron;
            border-radius: 3px;
            height: 40px;
            color: @Mako;
            font-size: 14px;
            padding: 5px 10px;
        }
    }
}
.pagination {
    width: 100%;
    float: right;
}
</style>

<script>
import jumbotronVue from '@/components/common/jumbotron.vue';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';

import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import listShimmer from '@/components/common/shimmer.vue';
import listCard from '@/components/extension/extension-card.vue';
import { debounce } from '@/helper/utils';
import ExtensionService from '@/services/extension.service';

const PAGINATION = {
    current: 1,
    limit: 10,
    total: 0
};

const ROLE_FILTER = [
    { value: 'pending', text: 'Pending' },
    { value: 'rejected', text: 'Rejected' },
    { value: 'published', text: 'Published' }
];

export default {
    name: 'extension-review-list',
    components: {
        jumbotron: jumbotronVue,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dropdown': NitrozenDropdown,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'list-shimmer': listShimmer,
        'list-card': listCard
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            searchText: '',
            extensionList: [],
            filters: [...ROLE_FILTER],
            pagination: {
                current: 1,
                limit: 10,
                total: 0
            },
            selectedFilter: 'pending'
        };
    },
    mounted() {
        this.populateFromURL();
        this.fetchExtensions();
    },
    methods: {
        populateFromURL() {
            const { search, page, limit, current_status } = this.$route.query;
            this.searchText = search || this.searchText;
            // this.pagination.page = +page || this.pagination.current;
            // this.pagination.limit = +limit || this.pagination.limit;
            this.selectedFilter = current_status || 'pending';
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.setRouteQuery({ search: undefined });
            }
            this.setRouteQuery({ search: this.searchText });
        }, 500),
        fetchExtensions() {
            let params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                current_status: this.selectedFilter,
                name: this.searchText
            };
            this.pageLoading = true;
            this.pageError = false;
            ExtensionService.getExtensionReviewList(params)
                .then(({ data }) => {
                    this.extensionList = data.items;
                    this.pagination.total = data.page.item_total;
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageError = true;
                    console.log(err);
                });
        },
        edit(review) {
            const { params } = this.$route;
            this.$router.push({
                path: `/administrator/extensions/review/${review._id}`
            });
        },
        paginationChange(e) {
            this.pagination = e;
            this.fetchExtensions();
        },
        setRouteQuery(query) {
            if (query.search) {
                // clear pagination if search or filter applied
                this.pagination = { ...PAGINATION };
                query.page = undefined;
                query.limit = undefined;
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
            if (query.current_status) {
                // clear pagination if search or filter applied
                //this.selectedFilter=query.current_status;
                this.pagination = { ...PAGINATION };
                query.page = undefined;
                query.limit = undefined;
            }

            this.fetchExtensions();
        }
    }
};
</script>
