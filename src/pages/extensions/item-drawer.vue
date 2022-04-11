<template>
    <div class="item-drawer">
        <item-dialog
            class="drawer-modal"
            :isOpen="isOpen"
            :isCancelable="true"
            :title="title"
            @closeModal="closeModalDialog"
            @onSubmit="onSelectExtensions"
            :footerTitle="
                `Add ${extensions_selected.length} ${
                    extensions_selected.length > 1 ? 'Extensions' : 'Extension'
                }`
            "
            @modalRef="saveModalRef"
        >
            <div class="main-body">
                <div class="filter-list left">
                    <div
                        class="filter-section filter-head"
                        v-for="(filterData, mainIndex) in categoryFilters"
                        :key="mainIndex"
                        :ref="'extension-' + mainIndex"
                    >
                        <div class="filter-item">
                            {{ filterData.key.display }}
                        </div>
                        <div
                            class="filter-section-item"
                            v-for="(filterValue, index) in filterData.values"
                            :key="index"
                            :ref="'extension-' + index"
                        >
                            <div>
                                <nitrozen-checkbox
                                    v-if="filterData.key.display === 'Price'"
                                    @input="
                                        checkPriceFilter($event, filterValue)
                                    "
                                    :name="filterValue.slug"
                                    v-model="filterValue.is_selected"
                                >
                                    {{ filterValue.display }}
                                    <span class="extension-count">
                                        ({{ filterValue.count || '0' }})
                                    </span>
                                </nitrozen-checkbox>
                                <nitrozen-radio
                                    v-if="filterData.key.display !== 'Price'"
                                    @change="
                                        onChangeFilter($event, filterValue)
                                    "
                                    :value="whichOpen"
                                    :radioValue="filterValue.slug"
                                    :name="filterValue.type"
                                >
                                    {{ filterValue.display }}
                                    <span class="extension-count">
                                        ({{ filterValue.count || '0' }})
                                    </span>
                                </nitrozen-radio>
                                <div
                                    v-if="
                                        !['all', 'free', 'paid'].includes(
                                            filterValue.slug
                                        )
                                    "
                                    @click="toggleArrow(filterValue, true)"
                                    :ref="filterValue.slug + 'arrow'"
                                    class="arrow"
                                ></div>
                                <div
                                    class="filter-child"
                                    :id="'category-' + filterValue.slug"
                                    :ref="'category-' + filterValue.slug"
                                >
                                    <div
                                        class="filter-section"
                                        v-for="(childValue,
                                        index) in filterValue.childs"
                                        :key="index"
                                    >
                                        <nitrozen-radio
                                            @change="
                                                onChangeFilter(
                                                    $event,
                                                    childValue
                                                )
                                            "
                                            class="l2-radio"
                                            :value="whichOpen"
                                            :radioValue="childValue.slug"
                                            :name="filterValue.type"
                                        >
                                            {{ childValue.display }}
                                            <span class="extension-count">
                                                ({{ childValue.count || '0' }})
                                            </span>
                                        </nitrozen-radio>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="search-input-container">
                        <div class="extension-list-search-input">
                            <nitrozen-input
                                v-model="searchText"
                                :showSearchIcon="true"
                                placeholder="Search for Extensions"
                                @input="debounceInput"
                                ref="searchInput"
                            ></nitrozen-input>
                        </div>
                    </div>
                    <div class="modal-overflow-y">
                        <div class="top-chips">
                            <div class="result-count">
                                {{ getCounts() }}
                            </div>
                            <nitrozen-chips
                                v-for="(item, index) in getChipsData()"
                                :key="'synonymText_' + index"
                            >
                                {{ item.display }}
                                <nitrozen-inline
                                    :icon="'cross'"
                                    class="nitrozen-icon"
                                    @click="removeFilter(item)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                            <div
                                class="clear-filter"
                                v-show="getChipsData().length > 0"
                                @click="clearFilter"
                            >
                                Clear Filter
                            </div>
                        </div>
                        <div
                            v-if="!inProgress"
                            class="extension-list-container"
                        >
                            <div
                                v-for="(extension, index) in extension_data"
                                :key="index"
                                :ref="'extension-' + index"
                            >
                                <div class="extension-card">
                                    <div
                                        class="extension-overlay"
                                        v-on:click="
                                            selectExtension(
                                                !extension.is_selected,
                                                extension,
                                                $event
                                            )
                                        "
                                    ></div>
                                    <div>
                                        <div class="extension-checkbox">
                                            <nitrozen-checkbox
                                                v-on:input="
                                                    selectExtension(
                                                        $event,
                                                        extension,
                                                        $event
                                                    )
                                                "
                                                :name="extension.slug"
                                                v-model="extension.is_selected"
                                            >
                                            </nitrozen-checkbox>
                                        </div>
                                    </div>
                                    <div
                                        class="extension-inner"
                                        v-on:click="
                                            selectExtension(
                                                !extension.is_selected,
                                                extension,
                                                $event
                                            )
                                        "
                                    >
                                        <div class="base-card-left">
                                            <img
                                                class="ext-icon"
                                                :src="
                                                    extension.listing_info.icon
                                                "
                                            />
                                        </div>
                                        <div class="base-card-right">
                                            <div class="extension-name">
                                                {{
                                                    extension.listing_info.name
                                                }}
                                            </div>
                                            <div class="extension-creator">
                                                by
                                                {{
                                                    extension.organization.name
                                                }}
                                            </div>
                                            <!-- <div class="extension-tag-line">
                                    {{ extension.listing_info.tagline }}
                                </div> -->
                                            <div class="extension-price">
                                                <span
                                                    v-if="
                                                        extension.plans &&
                                                            extension.plans
                                                                .length &&
                                                            extension.plans[0]
                                                                .price.amount
                                                    "
                                                    >{{
                                                        extension.plans[0].price
                                                            .amount
                                                            | currencyformat
                                                    }}
                                                </span>
                                                <span v-else>Free</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pagination">
                            <nitrozen-pagination
                                name="Extensions"
                                class="item-pagination"
                                v-model="paginationInfo"
                                @change="paginationChange"
                                :pageSizeOptions="[5, 10, 20, 50]"
                                v-if="!inProgress && extension_data.length"
                            ></nitrozen-pagination>
                        </div>
                    </div>
                    <list-shimmer
                        v-if="inProgress || isPageChange || !extension_data"
                        :count="20"
                        class="extension-list-container"
                        :pagination="false"
                    ></list-shimmer>
                    <page-empty
                        class="page-empty-drawer"
                        :text="'No Extension found with ' + searchText"
                        v-if="!inProgress && !extension_data.length"
                    >
                    </page-empty>
                </div>
            </div>
        </item-dialog>
    </div>
</template>
<script>
import listShimmer from './list-shimmer.vue';
import { debounce } from '@/helper/utils';
import itemDialog from './dialog/item-dialog.vue';
import ExtensionService from '@/services/extension.service';
import pageEmpty from '@/components/common/page-empty.vue';
import {
    NitrozenPagination,
    NitrozenInput,
    NitrozenCheckBox,
    flatBtn,
    NitrozenRadio,
    NitrozenButton,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';
import { isEmpty, uniqBy, cloneDeep } from 'lodash';

const PAGINATION = {
    limit: 20,
    total: 0,
    current: 1
};

const ALL_OPTION = (all_count) => ({
    count: all_count,
    display: 'All',
    display_type: 'radio',
    key: 'all',
    kind: 'single',
    slug: 'all',
    type: 'category_filter_l1',
    value: 'All',
    state: 'all',
    is_selected: true,
    childs: []
});

export default {
    name: 'item-drawer',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'item-dialog': itemDialog,
        'list-shimmer': listShimmer,
        'page-empty': pageEmpty,
        'nitrozen-button': NitrozenButton,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline
    },
    directives: {
        flatBtn
    },

    props: {
        isOpen: { type: Boolean, default: false },
        title: {
            type: String
        },
        selected_extensions: {
            default: []
        }
    },
    data() {
        return {
            paginationInfo: { ...PAGINATION },
            extension_data: [],
            inProgress: true,
            extensions_selected: [],
            extensions_selected_ids: [],
            previous_state: [],
            searchText: '',
            categoryFilters: [],
            whichOpen: 'all',
            slugsL2: [],
            slugsL1: [],
            priceSlug: [],
            query: {},
            isPageChange: false
        };
    },
    mounted() {
        this.fetchExtensions();
        this.previous_state = cloneDeep(this.selected_extensions);
        this.extensions_selected_ids = [];
    },
    computed: {},
    methods: {
        getCounts() {
            if (!this.paginationInfo) {
                return '0 - 0 of 0 Extensions';
            }
            const {
                current,
                item_total: total,
                has_next
            } = this.paginationInfo;
            if (!current || !total) {
                return '';
            }
            return `${
                current > 1 ? (current - 1) * PAGINATION.limit + 1 : current
            } - ${
                has_next ? PAGINATION.limit * current : total
            }  of ${total} Extensions`;
        },
        clearFilter() {
            this.slugsL2 = [];
            this.slugsL1 = [];
            this.priceSlug = [];
            this.query = {};
            this.whichOpen = 'all';
            this.fetchExtensions();
        },

        getChipsData() {
            const arr = [];
            if (!isEmpty(this.slugsL1)) {
                arr.push(this.slugsL1);
            }
            if (!isEmpty(this.slugsL2)) {
                arr.push(this.slugsL2);
            }
            if (!isEmpty(this.priceSlug)) {
                this.priceSlug.map((price_slug) => arr.push(price_slug));
            }
            return uniqBy(arr.filter((x) => x.display !== 'All'), 'slug');
        },
        removeFilter(item) {
            this.paginationInfo = { ...PAGINATION };
            let query = {
                ...this.query
            };
            if (item.type === 'price_filter') {
                this.priceSlug = this.priceSlug.filter(
                    (priece_filter) => priece_filter.slug !== item.slug
                );
                query = {
                    ...this.query,
                    price: this.priceSlug.map((x) => x.slug)
                };
                this.categoryFilters = this.categoryFilters.map((filteObj) => {
                    filteObj.values = filteObj.values.map((category) => {
                        if (category.slug === item.slug) {
                            category.is_selected = false;
                        }
                        return category;
                    });
                    return filteObj;
                });
                this.query = query;
                this.fetchExtensions(1, '', query);
                return;
            }

            if (!item.parent) {
                this.slugsL1 = {};
                this.slugsL2 = {};
                delete query.l1;
                delete query.l2;
                this.fetchExtensions(1, '', query);
            }
            if (item.parent) {
                this.slugsL2 = {};
                delete query.l2;
                this.fetchExtensions(1, '', query);
            }
            this.query = query;
            if (this.query.l2) {
                this.whichOpen = this.query.l2;
            } else if (this.query.l1 && !this.query.l2) {
                this.whichOpen = this.query.l1;
            } else {
                this.whichOpen = 'all';
            }
        },
        checkPriceFilter(event, value) {
            this.categoryFilters = this.categoryFilters.map((filteObj) => {
                filteObj.values = filteObj.values.map((category) => {
                    if (category.slug === value.slug) {
                        category.is_selected = true;
                    }
                    return category;
                });
                return filteObj;
            });
            if (event) {
                this.priceSlug.push(value);
            }
            if (!event) {
                this.priceSlug = this.priceSlug.filter(
                    (price_filter) => price_filter.slug !== value.slug
                );
            }
            this.query = {
                ...this.query,
                price: this.priceSlug.map((x) => x.slug)
            };
            this.fetchExtensions(1, '', this.query);
        },
        onChangeFilter(event, value) {
            this.whichOpen = value.slug;
            let parentData = null;
            this.categoryFilters = this.categoryFilters.map((filteObj) => {
                filteObj.values = filteObj.values.map((category) => {
                    // category.is_selected = false;
                    if (category._id === value._id) {
                        category.is_selected = true;
                    }
                    if (
                        category.type !== 'price_filter' &&
                        value.parent === category._id
                    ) {
                        parentData = category;
                    }
                    return category;
                });
                return filteObj;
            });
            this.query = {
                ...this.query,
                [value.key]: value.slug
            };
            if (value.key === 'l1') {
                this.slugsL1 = value;
                this.slugsL2 = {};
                delete this.query.l2;
            }
            if (value.key === 'l2') {
                if (parentData) {
                    this.slugsL1 = parentData;
                    this.query.l1 = parentData.slug;
                }
                this.slugsL2 = value;
            }
            if (!value.parent && value.type !== 'price_filter') {
                this.toggleArrow(value);
            }
            this.fetchExtensions(1, '', this.query);
        },
        toggleArrow(value, isArrow) {
            const [childRef] = this.$refs['category-' + value.slug];
            if (childRef) {
                childRef.classList.add('filter-child-visible');
                childRef.style.height = `${childRef.scrollHeight - 10}px`;
            }
            const [arrowElement] = this.$refs[value.slug + 'arrow'];
            if (arrowElement) {
                if (
                    ![...arrowElement.classList].includes('down') ||
                    (value.is_selected && !isArrow)
                ) {
                    childRef.style.height = `${childRef.scrollHeight - 10}px`;
                    arrowElement.classList.add('down');
                } else {
                    childRef.style.height = `0px`;
                    arrowElement.classList.remove('down');
                }
            }
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.paginationInfo.page_no = current;
            this.fetchExtensions(current, '', this.query, false);
        },
        fetchExtensions(
            pageNumber = 1,
            searchText = '',
            query = this.query,
            inProgress = true
        ) {
            const params = {
                page_size: 20,
                page_no: pageNumber,
                name: searchText,
                ...query
            };
            this.inProgress = inProgress;
            this.isPageChange = !inProgress;
            const getAllPulblicExtension = ExtensionService.getPublicExtensions(
                '',
                params
            );
            const getExtnesionCategory = ExtensionService.getAllPublicExtensionCategories(
                params
            );
            Promise.all([getAllPulblicExtension, getExtnesionCategory]).then(
                ([data, category]) => {
                    this.extensions_selected = cloneDeep(
                        this.selected_extensions
                    );
                    const all_selected = [
                        ...this.selected_extensions,
                        ...this.extensions_selected
                    ].map((ext_selected) => ext_selected._id);
                    this.extension_data = data.data.items.map((ext) => {
                        if (all_selected.includes(ext._id)) {
                            ext.is_selected = true;
                        }
                        return ext;
                    });
                    this.$emit('getExtensionData', this.extension_data);
                    this.paginationInfo = data.data.page;
                    this.paginationInfo.total = data.data.page.item_total;
                    this.paginationInfo.limit = data.data.page.size;
                    this.inProgress = false;
                    this.isPageChange = false;
                    this.categoryFilters = category.data.filters
                        .map((filter) => {
                            if (filter.key.display === 'Category') {
                                filter.values.push(
                                    ALL_OPTION(filter.all_count)
                                );
                            }
                            filter.values = filter.values.sort(
                                (filter_one, filter_two) => {
                                    return filter_one.slug.localeCompare(
                                        filter_two.slug
                                    );
                                }
                            );
                            filter.values = filter.values.map((category) => {
                                if (category.childs) {
                                    category.childs = category.childs.sort(
                                        (filter_one, filter_two) => {
                                            return filter_one.slug.localeCompare(
                                                filter_two.slug
                                            );
                                        }
                                    );
                                }
                                return category;
                            });
                            return filter;
                        })
                        .reverse();
                }
            );
        },
        selectExtension(state, data, source) {
            if (state) {
                this.extensions_selected.push(data);
                this.extensions_selected_ids.push(data._id);
                this.extension_data = this.extension_data.map((ext) => {
                    if (data._id === ext._id) {
                        ext.is_selected = true;
                    }
                    return ext;
                });
            } else {
                this.extensions_selected_ids.filter((x) => x === data._id);
                this.extensions_selected = this.extensions_selected.filter(
                    (extension) => extension._id !== data._id
                );
                this.extension_data = this.extension_data.map((ext) => {
                    if (data._id === ext._id) {
                        ext.is_selected = false;
                    }
                    return ext;
                });
            }
        },
        debounceInput: debounce(function(e) {
            this.searchText = e;
            this.query = {
                ...this.query,
                name: e
            };
            this.fetchExtensions(1, '', this.query);
        }),
        onSelectExtensions() {
            this.$emit('onAddExtensions', this.extensions_selected);
        },
        closeModalDialog() {
            this.$emit('closeProductModal');
        },
        saveModalRef(modalRef) {
            this.$emit('handleModalRef', modalRef);
        }
    }
};
</script>
<style lang="less" scoped>
.drawer-modal {
    ::v-deep .modal-container {
        min-width: 86%;
        min-height: 80%px;
        .modal-body {
            overflow: hidden;
        }
    }
}
.item-pagination {
    ::v-deep .nitrozen-pagination {
        .nitrozen-pagination__left {
            padding-left: 10px;
        }
        .nitrozen-pagination__right {
            padding-right: 10px;
            .nitrozen-pagination__select {
                display: none;
            }
        }
    }
}

.main-body {
    display: flex;
    max-height: 100%;
    .filter-list {
        border-right: 1px solid #e4e5e6;
        margin-right: 14px;
        background-color: #fff;
        max-width: 20%;
        min-width: 280px;
        max-height: calc(82vh - 100px);
        overflow-y: scroll;
        .filter-section {
            padding: 10px 0px;
            position: relative;
            .filter-section-item {
                position: relative;
                padding: 10px 15px;
            }
            .filter-item {
                font-size: 16px;
                font-weight: 400;
                padding-bottom: 10px;
                border-bottom: 1px solid #dcd7d7;
                margin-bottom: 10px;
                color: #898989;
                padding-left: 15px;
            }
            .extension-count {
                margin-left: 5px;
                color: #535353;
                font-weight: 300;
            }
            .nitrozen-radio-group {
                max-width: 221px;
            }
        }
        .filter-child {
            height: 0px;
            overflow: hidden;
            padding: 0;
            padding-left: 20px;
            transition: height 0.5s ease;
        }
        .filter-child-visible {
            padding-top: 10px;
        }
    }
    .right {
        overflow-y: hidden;
        min-width: 75%;
        .modal-overflow-y {
            overflow: scroll;
            height: calc(100% - 50px);
        }
        .search-input-container {
            height: 40px;
            background: #ececec;
            padding: 10px 0px;
            margin-left: 10px;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .top-chips {
            display: flex;
            align-items: center;
            padding: 10px;
            position: sticky;
            top: 0px;
            height: 40px;
            z-index: 1;
            background: white;
            .result-count {
                padding-right: 20px;
            }
            .clear-filter {
                color: #2e31be;
                margin-left: 10px;
                font-weight: bold;
                &:hover {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
        .extension-list-search-input {
            min-width: 300px;
            max-width: 300px;
            padding-left: 10px;
        }
        .extension-list-container {
            min-width: 80%;
            display: grid;
            // grid-template-columns: 33.33% 33.33% 33.33%;
            // margin-top: 50px;
            padding-right: 15px;
            .extension-card {
                min-width: 200px;
                display: flex;
                margin: 10px;
                padding: 10px;
                border: 1px solid #e0e0e0;
                max-height: 150px;
                position: relative;
                align-items: start;
                .extension-overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                }
                .extension-checkbox {
                    padding-bottom: 30px;
                    padding-top: 5px;
                }
                .extension-inner {
                    min-width: calc(100% - 20px);
                    display: flex;
                }
                &:hover {
                    cursor: pointer;
                }
            }
            .base-card-left {
                display: flex;
                align-items: start;
                padding-top: 5px;
                .ext-icon {
                    width: 48px;
                }
            }
            .base-card-right {
                flex: 1;
                padding-left: 24px;
                word-break: break-all;
                .extension-name {
                    color: @RoyalBlue;
                    font-weight: 500;
                    line-height: 1.5;
                    font-size: 16px;
                    // white-space: nowrap;
                }
                .extension-creator {
                    color: @Mako;
                    margin-bottom: 12px;
                    font-size: 12px;
                    font-weight: 400;
                }
                .extension-tag-line {
                    color: @Mako;
                    margin-bottom: 18px;
                    line-height: 19px;
                    font-size: 14px;
                    font-weight: 300;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
                .extension-price {
                    color: @Mako;
                    font-weight: 300;
                    margin-bottom: 6px;
                }
            }
        }
    }
}
.arrow {
    position: absolute;
    right: 10px;
    top: 15px;
    border: solid #333333;
    opacity: 0.75;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    transition: transform 0.25s;
    &:hover {
        cursor: pointer;
    }
}
.arrow.down {
    transform: rotate(-135deg);
    transition: transform 0.25s;
}</style
>;
