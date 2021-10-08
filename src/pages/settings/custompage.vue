<template>
    <div>
        <div>
            <div class="main-container">
                <jumbotron
                    :title="'Custom Pages'"
                    :desc="'Use this section to develop and manage custom webpages'"
                >
                    <div>
                        <nitrozen-button
                            v-flatBtn
                            theme="secondary"
                            @click="openCreateModal"
                        >
                            Create
                        </nitrozen-button>
                    </div>
                </jumbotron>
                <div
                    class="search-box"
                    v-if="
                        inProgress ||
                        searchText !== '' ||
                        selectedOpt.key !== 'all' ||
                        (pagesList && pagesList.length > 0)
                    "
                >
                    <!-- <div v-if="isInitialLoad" class="input-shimmer shimmer"></div> -->

                    <template>
                        <nitrozen-input
                            class="search"
                            :showSearchIcon="true"
                            type="search"
                            placeholder="Search by page title"
                            v-model="searchText"
                            @keyup.enter="setRouteQuery({ search: searchText })"
                            @input="debounceInput"
                        ></nitrozen-input>

                        <div class="filter">
                            <label class="label">Status</label>
                            <nitrozen-dropdown
                                class="filter-dropdown"
                                :items="statusList"
                                v-model="selectedOpt"
                                @change="
                                    setRouteQuery({
                                        statusFilter: selectedOpt,
                                    })
                                "
                            ></nitrozen-dropdown>
                        </div>
                    </template>
                </div>
                <div v-if="pagesList.length>0" class="pagecount">{{pagesList.length}} Pages in total</div>

                <div
                    v-if="pagesList && pagesList.length > 0 && !inProgress"
                    class="page"
                >
                    <div v-for="item in pagesList" :key="`index+${item.slug}`">
                        <div @click="updatePage(item)">
                            <page-item
                                :pageDetail="item"
                                :pageUrl="getPageUrl(item)"
                                itemType="page"
                            ></page-item>
                        </div>
                    </div>
                    <nitrozen-pagination
                        name="Pages"
                        id="pagination"
                        v-model="pagination"
                        @change="setPagination"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
                <shimmer
                    v-if="inProgress"
                    class="page-shimmer"
                    :count="3"
                ></shimmer>
                <no-content
                    v-if="noResults"
                    helperText="No Pages Found"
                ></no-content>
                <!-- <adm-page-error
                v-else-if="pageError && !inProgress"
                @tryAgain="getPages"
            ></adm-page-error> -->
            </div>
        </div>
        <nitrozen-dialog
            class="custom_pages_dialog"
            ref="custom_pages_dialog"
            title="Create Page"
        >
            <template slot="header">
                <div class="cross">Create Page</div>
            </template>
            <template slot="header">
                <div class="cross" @click="closeModal">
                    <inline-svg :src="'cross-black'"></inline-svg>
                </div>
            </template>

            <template slot="body">
                <div class="wizard-body-wrapper">
                    <div class="modal-details-body">
                        <div class="modal-body-description">
                            <component
                                :is="{
                                    template: `<p>Create your own custom template</p>`,
                                }"
                            ></component>
                        </div>
                    </div>
                    <div>
                        <div class="page-type-radio-group">
                            <nitrozen-radio
                                name="pageType"
                                v-model="pageTypeSelection"
                                radioValue="grapeJS"
                                title="HTML Editor - GrapesJS"
                            >
                                HTML Editor - GrapesJS
                            </nitrozen-radio>
                            <nitrozen-radio
                                name="pageType"
                                v-model="pageTypeSelection"
                                radioValue="markdown"
                                title="Markdown Editor"
                            >
                                Markdown Editor
                            </nitrozen-radio>
                            <nitrozen-radio
                                name="pageType"
                                v-model="pageTypeSelection"
                                radioValue="rawhtml"
                                title="Raw HTML"
                            >
                                Raw HTML
                            </nitrozen-radio>
                        </div>
                        <div class="page-type-details">
                            <div>
                                <img
                                    class="preview"
                                    :src="
                                        PAGE_TYPE_DETAILS[pageTypeSelection]
                                            .image
                                    "
                                />
                            </div>
                            <div class="modal-details-body">
                                <div class="modal-body-title">
                                    {{
                                        PAGE_TYPE_DETAILS[pageTypeSelection]
                                            .name
                                    }}
                                </div>
                                <div class="modal-body-description">
                                    <component
                                        :is="
                                            PAGE_TYPE_DETAILS[pageTypeSelection]
                                                .description
                                        "
                                    ></component>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <br />
            <template slot="footer">
                <div>
                    <nitrozen-button
                        v-flatBtn
                        id="approve"
                        :theme="'secondary'"
                        @click="modalSelectandProceed"
                        :disabled="pageTypeSelection == 'grapeJS'"
                        >{{
                            pageTypeSelection == 'grapeJS'
                                ? 'Coming Soon'
                                : 'Select and Proceed'
                        }}</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>
<script>
import pageItem from '../../../src/components/common/page-item.vue';
import inlinesvg from '../../../src/components/common/inline-svg.vue';
import Jumbotron from '@/components/common/jumbotron';
import InternalSettingsService from '@/services/internal-settings.service';
import { debounce } from '@/helper/utils';
import PageEmpty from '@/components/common/page-empty.vue';
import Shimmer from '@/components/common/shimmer';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

const PAGE_FILTERS = [
    {
        text: 'All',
        value: { key: 'all', value: 'true' },
    },
    {
        text: 'Active',
        value: { key: 'published', value: 'true' },
    },
    {
        text: 'Inactive',
        value: { key: 'published', value: 'false' },
    },
];

const PAGINATION = {
    limit: 0,
    current: 0,
    total: 0,
};
const PAGE_TYPE_DETAILS = {
    grapeJS: {
        name: 'GrapesJS Editor',
        description: {
            template:
                '<div><span>For advanced users</span><li>Use readily available drag-and-drop blocks to build any page with multiple styles (CSS). Easily manage layers and media files (assets).</li><li> Get all the content tools, forms and its components, along with extras like custom code, tooltips and many more.</li></div>',
        },
        image: 'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587047567/production/platform/admin-panel/page-editor/grapesjs-editor.jpg',
    },
    markdown: {
        name: 'Markdown Editor',
        description: {
            template:
                "<p>Create a page rapidly using Markdown, a formatting language that's easy to write and is functionally similar to HTML.</p>",
        },
        image: 'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587050181/production/platform/admin-panel/page-editor/markdown-editor.png',
    },
    rawhtml: {
        name: 'Raw HTML Editor',
        description: {
            template:
                '<p>Create a page using HTML, a conventionally used language that supports all the markup tags within angle brackets.</p>',
        },
        image: 'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587050182/production/platform/admin-panel/page-editor/rawhtml-editor.png',
    },
};

export default {
    name: 'custompage',
    components: {
        Jumbotron,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-radio': NitrozenRadio,
        'inline-svg': inlinesvg,
        'page-item': pageItem,
        'no-content': PageEmpty,
        Shimmer,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            pagesList: [],
            inProgress: false,
            previewLoading: false,
            pageError: false,
            noResults: false,
            isInitialLoad: true,
            searchText: '',
            selectedOpt: PAGE_FILTERS[0].value,
            statusList: PAGE_FILTERS,
            pagination: { ...PAGINATION },
            ModalOpen: false,
            pageTypeSelection: 'grapeJS',
            PAGE_TYPE_DETAILS,
            pageType: '',
        };
    },
    methods: {
        debounceInput: debounce(function (e) {
             if (e.length === 0) {
                this.setRouteQuery({ search: undefined });
            }
            
            this.setRouteQuery({search: e});
        }, 200),
        getPages(params = { current: 1, limit: 10 }) {
            this.inProgress = true;
            this.noResults = false;
            this.pageError = false;
            return InternalSettingsService.getCustomPages(
                Object.assign({
                    page_no: this.pagination.current,
                    page_size: this.pagination.limit,
                    [this.selectedOpt.key]: this.selectedOpt.value,
                    q: this.searchText,
                })
            )
                .then((res) => {
                    this.pagesList = res.data.items;
                    this.pagination = {
                        limit: res.data.page.size,
                        total: res.data.page.item_total,
                        current: res.data.page.current,
                    };
                    //console.log(this.pagination)
                    if (!res.data.items || res.data.items.length === 0)
                        this.noResults = true;
                })
                .catch((err) => {
                    this.pageError = true;
                    this.$snackbar.global.showError(
                        `Failed to load pages${
                            err && err.message ? ' : ' + err.message : ''
                        }`
                    );
                    console.log(err);
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        modalSelectandProceed() {
            this.closeModal()
            if (this.pageTypeSelection) {
                setTimeout(() => {
                    this.$router.push({
                        path: `/administrator/settings/pages/${this.pageTypeSelection}/create`,
                    });
                });
            }
        },
        openCreateModal() {
            this.$refs['custom_pages_dialog'].open({
                width: '700px',
                height: '550px',
            });
        },
        getPageUrl(item) {
            return `https://platform.${env.FYND_PLATFORM_DOMAIN}/p/${item.slug}`;
        },
        setPagination(filter) {
            const { current, limit } = filter;
            filter = { page: current, limit };
            this.pagination = Object.assign({}, this.pagination, filter);
            this.setRouteQuery(filter);
        },
        updatePage(item) {
            this.$router
                .push({
                    path: `pages/${item.type}/${item.slug}/edit`,
                })
                .catch(() => {});
        },
        populateFromURL() {
            const { search, all, published, page, limit } = this.$route.query;
            this.searchText = search || this.searchText;
            if (published) {
                const opt = PAGE_FILTERS.find((f) => {
                    return (
                        f.value.key == 'published' && f.value.value == published
                    );
                });
                this.selectedOpt = opt.value || this.selectedOpt;
            }
            this.pagination.current = +page || this.pagination.current;
            this.pagination.limit = +limit || this.pagination.limit;
        },
        setRouteQuery(query) {
            if (query.search || query.statusFilter) {
                // clear pagination if search or filter applied
                this.pagination = { ...this.pagination, current: 0 };
                query[this.selectedOpt.key] = this.selectedOpt.value;
                if (this.selectedOpt.key == 'published') {
                    query.all = undefined;
                }
                if (this.selectedOpt.key == 'all') {
                    query.published = undefined;
                }
                query.statusFilter = undefined;
                query.page = undefined;
                query.limit = undefined;
            }
            this.$router
                .push({
                    path: this.$route.path,
                    query: {
                        ...this.$route.query,
                        ...query,
                    },
                })
                .catch(() => {});
            this.getPages();
        },
        closeModal() {
            this.$refs['custom_pages_dialog'].close();
        },
    },
    mounted() {
        this.populateFromURL();
        this.getPages();
    },
};
</script>
<style lang="less" scoped>
// @import '../../../src/pages/less/form.less';
// @import '../../../src/pages/less/page-ui.less';
// @import '../../../src/pages/less/page-header.less';

.info {
    display: flex;
    justify-content: flex-start;
}
.main-container {
    cursor: pointer;
    background-color: white;
    margin: 24px;
    padding: 24px;
    position: relative;
    min-height: 400px;
}
.search-box {
    margin: 24px 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    @media @mobile {
        flex-direction: column;
        margin: 0 0 24px 0;
    }
    .search {
        min-width: 400px;
        @media @mobile {
            min-width: 100%;
        }
    }
    .filter {
        display: flex;
        @media @mobile {
            margin-top: 12px;
        }
    }
    .label {
        font-family: Inter;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        width: 52px;
        margin: auto 0;
        font-weight: 500;
    }
    .filter-dropdown {
        width: 110px;
        @media @mobile {
            width: 100%;
            margin-left: 12px;
        }
    }
}
.page {
    margin: 0;
    width: 100%;
    @media @mobile {
        margin-top: 24px;
    }
}
.wizard-body-wrapper {
    display: flex;
    flex-direction: column;
    height: 340px;
    .modal-details-body {
        .modal-body-title {
            color: #212121;
            font-family: Inter;
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0;
            line-height: 23px;
            margin-bottom: 18px;
        }
        .modal-body-description {
            color: @DustyGray2;
            font-family: Inter;
            font-size: 14px;
            letter-spacing: 0;
            line-height: 20px;
        }
    }
    .preview-body {
        flex: 1;
        margin-top: 24px;
        iframe {
            height: 100%;
            width: 100%;
        }
    }
}
.page-type-radio-group {
    display: flex;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed @DustyGray;
    .nitrozen-radio-group {
        margin: 0 6px;
    }
}
.page-type-details {
    display: flex;
    > div {
        flex: 1;
        padding: 24px;
    }
    img.preview {
        width: 100%;
    }
}
.cross {
    margin: 0px;
}
.pagecount{
    font-family: sans-serif;
    font-size: 14px;
    color: #41434c;
}
</style>