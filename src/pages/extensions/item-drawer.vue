<template>
    <div class="item-drawer">
        <base-modal
            class="drawer-modal"
            :isOpen="isOpen"
            :isCancelable="true"
            :title="title"
            @closedialog="closeModal"
        >
            <div class="extension-list-search-input">
                <nitrozen-input
                    v-model="searchText"
                    :showSearchIcon="true"
                    placeholder="Search for Extensions"
                    @input="debounceInput"
                    ref="searchInput"
                ></nitrozen-input>
            </div>
            <list-shimmer
                v-if="inProgress || !extension_data"
                :count="20"
                class="extension-list-container"
                :paginationShimmer="false"
            ></list-shimmer>

            <page-empty
                :text="'No Extension found with ' + searchText"
                v-if="!inProgress && !extension_data.length"
            >
            </page-empty>

            <div v-if="!inProgress" class="extension-list-container">
                <div
                    class="extension-card"
                    v-for="(extension, index) in extension_data"
                    :key="index"
                    :ref="'extension-' + index"
                >
                    <nitrozen-checkbox
                        v-on:input="selectExtension($event, extension)"
                        v-model="extension.is_selected"
                    >
                    </nitrozen-checkbox>
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
                        <div class="extension-tag-line">
                            {{ extension.listing_info.tagline }}
                        </div>
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
                                    /
                                    {{
                                        extension.plans[0].recurring.type
                                    }}</span
                                ></span
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
                    v-if="extension_data.length"
                ></nitrozen-pagination>
            </div>
            <div class="footer">
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    type="button"
                    @click="onSelectExtensions"
                >
                    Add {{ extensions_selected.length }} Extensions
                </nitrozen-button>
            </div>
        </base-modal>
    </div>
</template>
<script>
import listShimmer from './list-shimmer.vue';
import { debounce } from '@/helper/utils';
import { BaseModal } from '../../components/common/';
import ExtensionService from '@/services/extension.service';
import pageEmpty from '@/components/common/page-empty.vue';
import {
    NitrozenPagination,
    NitrozenInput,
    NitrozenCheckBox,
    flatBtn,
    NitrozenButton,
} from '@gofynd/nitrozen-vue';

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
        'base-modal': BaseModal,
        'list-shimmer': listShimmer,
        'page-empty': pageEmpty,
        'nitrozen-button': NitrozenButton,
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
        };
    },
    mounted() {
        this.fetchExtensions();
    },
    computed: {},
    methods: {
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.paginationInfo.page_no = current;
            this.fetchExtensions(current);
        },
        fetchExtensions(pageNumber = 1, searchText = '') {
            const params = {
                page_size: 20,
                page_no: pageNumber,
                name: searchText,
            };
            this.inProgress = true;
            ExtensionService.getPublicExtensions('', params).then((data) => {
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
            });
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
            this.fetchExtensions('', e);
        }),
        onSelectExtensions() {
            this.$emit('onAddExtensions', this.extensions_selected);
        },
        closeModal() {
            this.$emit('closeModal');
        },
    },
};
</script>
<style lang="less" scoped>
.item-drawer {
}
.drawer-modal {
    ::v-deep .modal-container {
        min-width: 722px;
        min-height: 722px;
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
.extension-list-container {
    display: grid;
    grid-template-columns: 50% 50%;
    .extension-card {
        min-width: 200px;
        display: flex;
        align-items: center;
        margin: 10px;
        padding: 10px;
        border: 1px solid #e0e0e0;
    }
    .base-card-left {
        .ext-icon {
            width: 100px;
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
</style>;
