<template>
    <div class="item-drawer">
        <item-dialog
            class="drawer-modal"
            :isOpen="isOpen"
            :isCancelable="true"
            :title="title"
            @closedialog="closeModal"
            @onSubmit="onSelectExtensions"
            :footerTitle="'Add ' + extensions_selected.length + ' Extensions'"
            @modalRef="saveModalRef"
        >
            <div class="main-body">
                <div class="filter-list left">
                    <div
                        class="filter-section"
                        v-for="(filterData, mainIndex) in categoryFilters"
                        :key="mainIndex"
                        :ref="'extension-' + mainIndex"
                    >
                        <div class="filter-item">
                            {{ filterData.key.display }}
                        </div>
                        <div
                            class="filter-section"
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
                                    <span
                                        v-if="filterValue.count > -1"
                                        class="extension-count"
                                    >
                                        ({{ filterValue.count }})
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
                                    <!-- <span
                                        v-if="filterValue.count"
                                        class="extension-count"
                                    >
                                        ({{ filterValue.count }})
                                    </span> -->
                                </nitrozen-radio>
                                <div
                                    v-if="mainIndex > 0"
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
                                        v-for="(
                                            childValue, index
                                        ) in filterValue.childs"
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
                                            <span
                                                v-if="childValue.count"
                                                class="extension-count"
                                            >
                                                ({{ childValue.count }})
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
                    <div class="top-chips">
                        <div v-show="!inProgress" class="result-count">
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
                    <div v-if="!inProgress" class="extension-list-container">
                        <div
                            class="extension-card"
                            v-for="(extension, index) in extension_data"
                            :key="index"
                            :ref="'extension-' + index"
                        >
                            <div class="extension-checkbox">
                                <nitrozen-checkbox
                                    :name="extension.slug"
                                    v-on:input="
                                        selectExtension($event, extension)
                                    "
                                    v-model="extension.is_selected"
                                >
                                </nitrozen-checkbox>
                            </div>
                            <div class="base-card-left">
                                <img
                                    class="ext-icon"
                                    :src="extension.listing_info.icon"
                                />
                            </div>
                            <div class="base-card-right">
                                <div class="extension-name">
                                    {{ extension.listing_info.name }}
                                </div>
                                <div class="extension-creator">
                                    by {{ extension.organization.name }}
                                </div>
                                <!-- <div class="extension-tag-line">
                                    {{ extension.listing_info.tagline }}
                                </div> -->
                                <div class="extension-price">
                                    <span
                                        v-if="
                                            extension.plans &&
                                            extension.plans.length &&
                                            extension.plans[0].price.amount
                                        "
                                        >{{
                                            extension.plans[0].price.amount
                                                | currencyformat
                                        }}
                                        <span class="capitalize">
                                            ''
                                        </span></span
                                    >
                                    <span v-else>Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pagination">
                        <nitrozen-pagination
                            name="item-pagination"
                            class="item-pagination"
                            v-model="paginationConfig"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 10, 20, 50]"
                            v-if="!inProgress && extension_data.length"
                        ></nitrozen-pagination>
                    </div>
                    <list-shimmer
                        v-if="inProgress || !extension_data"
                        :count="20"
                        class="extension-list-container"
                        :paginationShimmer="false"
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
    NitrozenInline,
} from '@gofynd/nitrozen-vue';
import { isEmpty, uniqBy } from 'lodash';

const PAGINATION = {
    limit: 20,
    total: 0,
    current: 1,
};

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
        'nitrozen-inline': NitrozenInline,
    },
    directives: {
        flatBtn,
    },

    props: {
        isOpen: { type: Boolean, default: false },
        title: {
            type: String,
        },
        selected_extensions: {
            default: [],
        },
    },
    data() {
        return {
            paginationConfig: { ...PAGINATION },
            extension_data: [],
            inProgress: true,
            extensions_selected: [],
            searchText: '',
            categoryFilters: [],
            whichOpen: '',
            slugsL2: [],
            slugsL1: [],
            priceSlug: [],
            query: {},
        };
    },
    mounted() {
        this.fetchExtensions();
    },
    computed: {},
    methods: {
        getCounts() {
            if (!this.paginationConfig) {
                return '';
            }
            const { current, total, has_next } = this.paginationConfig;
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
            return uniqBy(
                arr.filter((x) => x.display !== 'All'),
                'slug'
            );
        },
        removeFilter(item) {
            this.paginationConfig = { ...PAGINATION };
            let query = {
                ...this.query,
            };
            if (item.type === 'price_filter') {
                this.priceSlug = this.priceSlug.filter(
                    (priece_filter) => priece_filter.slug !== item.slug
                );
                query = {
                    ...this.query,
                    price: this.priceSlug.map((x) => x.slug),
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
                price: this.priceSlug.map((x) => x.slug),
            };
            this.fetchExtensions(1, '', this.query);
        },
        getRadioValue(filterValue) {
            return filterValue.is_selected ? filterValue.slug : '';
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
                [value.key]: value.slug,
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
                childRef.style.height = `${childRef.scrollHeight}px`;
            }
            const [arrowElement] = this.$refs[value.slug + 'arrow'];
            if (arrowElement) {
                if (
                    ![...arrowElement.classList].includes('down') ||
                    (value.is_selected && !isArrow)
                ) {
                    childRef.style.height = `${childRef.scrollHeight}px`;
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
            this.fetchExtensions(current);
        },
        fetchExtensions(pageNumber = 1, searchText = '', query) {
            const params = {
                page_size: 20,
                page_no: pageNumber,
                name: searchText,
                ...query,
            };
            this.inProgress = true;
            const getAllPulblicExtension = ExtensionService.getPublicExtensions(
                '',
                params
            );
            const getExtnesionCategory =
                ExtensionService.getAllPublicExtensionCategories(params);
            Promise.all([getAllPulblicExtension, getExtnesionCategory]).then(
                ([data, category]) => {
                    this.extensions_selected = this.selected_extensions;
                    const all_selected = [
                        ...this.selected_extensions,
                        ...this.extensions_selected,
                    ].map((ext_selected) => ext_selected._id);
                    this.extension_data = data.data.items.map((ext) => {
                        if (all_selected.includes(ext._id)) {
                            ext.is_selected = true;
                        }
                        return ext;
                    });
                    this.paginationConfig.total = data.data.page.item_total;
                    this.paginationInfo = data.data.page;
                    this.inProgress = false;
                    this.categoryFilters = category.data.filters
                        .map((filter) => {
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
        selectExtension(state, data) {
            if (state) {
                this.extensions_selected.push(data);
            } else {
                this.extensions_selected = this.extensions_selected.filter(
                    (extension) => extension._id !== data._id
                );
            }
        },
        debounceInput: debounce(function (e) {
            this.searchText = e;
            this.query = {
                ...this.query,
                name: e,
            };
            this.fetchExtensions(1, '', this.query);
        }),
        onSelectExtensions() {
            this.$emit('onAddExtensions', this.extensions_selected);
        },
        closeModal() {
            this.$emit('closeModal');
        },
        saveModalRef(modalRef) {
            this.$emit('handleModalRef', modalRef);
        },
    },
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
        .nitrozen-pagination__right {
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
            .filter-item {
                font-size: 16px;
                font-weight: bold;
                padding-bottom: 10px;
                border-bottom: 1px solid;
                margin-bottom: 10px;
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
        overflow-y: scroll;
        min-width: 75%;
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
            top: 59px;
            height: 40px;
            z-index: 1;
            background: white;
            .result-count {
                padding-right: 20px;
            }
            .clear-filter {
                margin-left: 10px;
                font-weight: bold;
                &:hover {
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
            .extension-card {
                min-width: 200px;
                display: flex;
                align-items: center;
                margin: 25px;
                padding: 10px;
                border: 1px solid #e0e0e0;
                max-height: 150px;
                position: relative;
                .extension-checkbox {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                }
            }
            .base-card-left {
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
                    margin-bottom: 6px;
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
}
</style>;
