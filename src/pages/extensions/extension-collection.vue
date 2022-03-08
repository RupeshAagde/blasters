<template>
    <div class="panel extension-collection-list">
        <div class="main-container">
            <div class="page-container">
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
                    @input="debounceInput()"
                ></nitrozen-input>
            </div>
            <div class="extension-collection-cards">
                <div
                    class="mirage-list-card-container"
                    v-for="(extension, index) in extension_collections"
                    :key="index"
                    :ref="'extension-' + index"
                    @click="redirectTo(extension._id)"
                >
                    <div class="card-avatar">
                        <img
                            :src="extension.banner.logo"
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
                            Type: {{ capitalizeStr(extension.collection_type) }}
                        </div>
                    </div>
                </div>
                <loader v-if="pageLoading && !pageError"></loader>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="fetchExtension"
                ></page-error>
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
.page-container {
    margin: 0;
    flex-direction: column;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
import jumbotronVue from '@/components/common/jumbotron.vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import root from 'window-or-global';
const env = root.env || {};
import dummy from './dummy_ext_collection.json';
import { capitalize } from 'lodash';
export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        jumbotron: jumbotronVue,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
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
                current_status: '',
            },
            error_comments: '',
            fynd_platform_domain: 'fynd.com',
            extension_collections: dummy,
        };
    },
    computed: {},
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        this.fetchExtension();
    },
    methods: {
        debounceInput() {},
        capitalizeStr(str) {
            return capitalize(str);
        },
        fetchExtension() {},
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
                    id,
                },
            });
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        },
    },
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
