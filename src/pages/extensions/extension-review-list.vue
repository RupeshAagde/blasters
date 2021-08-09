<template>
    <div class="panel">
        <div class="page-container">
            <jumbotron
                class="extensions-jmbtrn"
                :title="`Extensions ${
                    extensionList && extensionList.length
                        ? '(' + extensionList.length + ')'
                        : ''
                }`"
                :desc="'Extensions for review'"
            ></jumbotron>
            <!--Search Baar-->
            <div class="search-filter">
                <nitrozen-input
                    :showSearchIcon="true"
                    class="search-box"
                    type="search"
                    placeholder="Search by name"
                    v-model="searchText"
                    @input="setRouteQuery({ search: searchText })"
                ></nitrozen-input>
            </div>

            <!--Staff List-->
            <div class="extension-card-list">
                <list-shimmer
                    v-if="pageLoading && !pageError"
                    :count="4"
                ></list-shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @retry="fetchExtensions"
                ></page-error>
                <list-card
                    class="extension-card"
                    v-for="extension in extensionList"
                    :key="extension._id"
                    :extension="extension"
                    @click="edit(extension)"
                ></list-card>
            </div>
            <page-empty
                v-if="extensionList.length == 0"
                text="No extensions for review"
            ></page-empty>
            <div v-if="extensionList.length" class="pagination">
                <nitrozen-pagination
                    name="Extensions"
                    v-model="paginationConfig"
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
        &+.extension-card {
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
    margin-top: 24px;
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
        width: 150px;
    }
    .label {
        font-family: Inter;
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
import jumbotronVue from '@/components/common/jumbotron.vue'
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown,
} from '@gofynd/nitrozen-vue';

import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import listShimmer from '@/components/common/shimmer.vue';
import listCard from '@/components/extension/extension-card.vue';

import ExtensionService from '@/services/extension.service'

const PAGINATION = {
    page: 1,
    limit: 10,
}

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
        flatBtn,
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            searchText: '',
            extensionList: [],
            paginationConfig: {
                limit: 10,
                current: 1,
                total: 10,
            },
            pagination: { ...PAGINATION },
        }
    },
    mounted() {
        this.populateFromURL()
        this.fetchExtensions()
    },
    methods: {
        populateFromURL() {
            const { search, page, limit } = this.$route.query
            this.searchText = search || this.searchText
            this.pagination.page = +page || this.pagination.page
            this.pagination.limit = +limit || this.pagination.limit
        },
        chooseExtensionType() {
            this.$refs['type-modal'].open()
        },
        fetchExtensions() {
            ExtensionService.getExtensionReviewList({})
                .then(({ data }) => {
                    this.extensionList = data.items
                    this.paginationConfig.total = data.item_total
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        edit(review){
            const { params } = this.$route
            this.$router.push({
                path: `/administrator/extensions/review/${review._id}`
            })
        },
        paginationChange(e) {
            this.paginationConfig = e
            this.fetchExtensions()
        },
        setRouteQuery(query) {
            if (query.search) {
                // clear pagination if search or filter applied
                this.pagination = { ...PAGINATION }
                query.page = undefined
                query.limit = undefined
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query,
                },
            })
        },
    },
}
</script>
