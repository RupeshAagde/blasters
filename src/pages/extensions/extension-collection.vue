<template>
    <div class="panel extension-collection-list">
        <div class="main-container">
            <div class="page-container-main">
                <jumbotron
                    :title="'Extension Collection'"
                    btnLabel="Create"
                    :desc="'Extension Collection'"
                    @btnClick="createExtensionCollection"
                ></jumbotron>
            </div>
            <div class="page-header-filter">
                <nitrozen-input
                    :showSearchIcon="true"
                    class="search"
                    type="search"
                    placeholder="Search Collection"
                    v-model="searchText"
                    @input="debounceInput"
                ></nitrozen-input>
            </div>
            <page-empty
                :text="
                    searchText
                        ? `No Collection found with name ${searchText}`
                        : 'No Collection Created'
                "
                v-if="!extension_collections.length && !inProgressSearch"
            >
            </page-empty>
            <list-shimmer
                v-if="inProgressSearch"
                :count="5"
                class="extension-collection-cards"
                :paginationShimmer="false"
            ></list-shimmer>
            <div
                v-if="extension_collections.length > 0"
                class="extension-collection-cards"
            >
                <div
                    class="mirage-list-card-container"
                    v-for="(extension, index) in extension_collections"
                    :key="index"
                    :ref="'extension-' + index"
                    @click="redirectTo(extension._id)"
                >
                    <div class="card-avatar">
                        <img
                            :src="
                                extension.banner.logo ||
                                    'https://res.cloudinary.com/dwzm9bysq/image/upload/v1588857854/production/applications/app_000000000000000000000001/media/collection/logo/w9ns7nfgv7fk45xqrpoh.png'
                            "
                            alt="collection logo"
                        />
                    </div>
                    <div class="card-content-section">
                        <div class="card-content-line-1">
                            {{ extension.name }}
                        </div>
                        <div class="card-content-line-2">
                            {{ extension.desc }}
                        </div>
                        <div class="card-content-line-3">
                            Type:
                            {{ capitalizeStr(extension.collection_type) }}
                        </div>
                    </div>
                </div>
                <loader v-if="pageLoading && !pageError"></loader>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="fetchExtension"
                ></page-error>
            </div>
            <div class="pagination-div">
                <nitrozen-pagination
                    name="Extensions"
                    v-model="paginationConfig"
                    ref="extension-pagination"
                    class="extension-list-pagination"
                    @change="paginationChange"
                    :pageSizeOptions="[20, 50, 100, 200]"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';
.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container-main {
    margin: 0;
    flex-direction: column;
    display: block;
    flex-wrap: wrap;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 4px;
    .jumbotron-container {
        // width: 100%;
    }
}
.pagination-div {
    padding: 0px 24px;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenPagination
} from '@gofynd/nitrozen-vue';
import jumbotronVue from '@/components/common/jumbotron.vue';
import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import root from 'window-or-global';
import listShimmer from './list-shimmer.vue';
import dummy from './dummy_ext_collection.json';
import { debounce } from '@/helper/utils';
import { capitalize } from 'lodash';
import ExtensionService from '@/services/extension.service';

const env = root.env || {};

const PAGINATION = {
    limit: 20,
    current: 1,
    total: 0
};

export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        'list-shimmer': listShimmer,
        jumbotron: jumbotronVue,
        loader: loader,
        NitrozenPagination
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            searchText: '',
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            review_data: {
                review_comments: '',
                current_status: ''
            },
            error_comments: '',
            fynd_platform_domain: 'fynd.com',
            extension_collections: [],
            inProgressSearch: false,
            paginationConfig: { ...PAGINATION }
        };
    },
    computed: {},
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        if (this.$route.query.name) {
            this.searchText = this.$route.query.name;
        }
        this.fetchExtension();
    },
    methods: {
        paginationChange(config) {
            this.paginationConfig = config
            this.fetchExtension()
        },

        debounceInput: debounce(function(e) {
            this.paginationConfig = { ...PAGINATION };
            this.fetchExtension(e);
        }, 500),
        capitalizeStr(str) {
            return capitalize(str);
        },
        fetchExtension(name = this.$route.query.name) {
            this.inProgressSearch = true;
            let params = {
                page_size: this.paginationConfig.limit,
                page_no: this.paginationConfig.current,
                name
            };
            this.$router
                .push({
                    query: { name }
                })
                .catch((err) => {});
            ExtensionService.getExtensionCollections(params).then((res) => {
                this.extension_collections = res.data.items;
                this.paginationConfig = res.data.page;
                this.paginationConfig.total = res.data.page.item_total;
                this.paginationConfig.limit = res.data.page.size;
                this.inProgressSearch = false;
            });
        },
        createExtensionCollection() {
            this.$router
                .push(`/administrator/extensions/collection/create`)
                .catch(() => {});
            //TODO: Add form dirty
        },
        redirectTo(id) {
            this.$router.push({
                path: '/administrator/extensions/collection/edit',
                query: {
                    id
                }
            });
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        }
    }
};
</script>
<style lang="less" scoped>
.extension-collection-list {
    .main-container {
        background-color: #ffffff;
        flex-direction: column;
    }
    .page-header-filter {
        padding: 0px 24px;
        margin-bottom: -10px;
        max-width: 30%;
    }
    .extension-collection-cards {
        padding: 24px;
    }
    .mirage-list-card-container {
        background: #ffffff;
        margin: 16px 0px;
        border: 1px solid #e4e5e6;
        padding: 24px;
        border-radius: 3px;
        display: flex;
        height: 70px;
        overflow: auto;
        max-height: 70px;
        cursor: pointer;
        transition: box-shadow 0.3s;
        .card-avatar {
            margin-right: 24px;
            width: 60px;
            height: 60px;
            align-self: center;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .card-content-section {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            .card-content-line-1 {
                color: #41434c;
                font-weight: 600;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                line-height: 22px;
            }
            .card-content-line-2 {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .card-content-line-3 {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
        }
    }
}
</style>
