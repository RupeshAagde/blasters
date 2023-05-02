<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="pageTitle"
                @backClick="$router.push({ name: 'settings' })"
                :noContextMenu="true"
            >
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
                        ref="save-button"
                        @click="addMarketplace"
                        >Create Marketplace</nitrozen-button
                    >
                </div>
            </page-header>
        </div>

        <div class="main-container">
            <div class="search-marketplaces">
                <nitrozen-input
                    v-model="searchText"
                    :showSearchIcon="true"
                    placeholder="Search by application name or slug"
                    class="search"
                    type="search"
                    @input="searchMarketPlaces()"
                />
            </div>
            <div class="marketplace-list-container">
                <page-error v-if="pageError" />
                <adm-shimmer v-else-if="pageLoading && !pageError" :count="4" />
                <div
                    v-else-if="
                        !pageLoading && !pageError && marketplacesList.length
                    "
                    class="marketplace-card-list"
                >
                    <div
                        v-for="marketplace in marketplacesList"
                        :key="marketplace._id"
                        class="container"
                        @click="editmarketplace(marketplace)"
                    >
                        <div class="card-avatar">
                            <img
                                :src="getMarketplaceImage(marketplace)"
                                alt="icon"
                                @error="$set(marketplace, 'icon', default_img)"
                            />
                        </div>
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                <div class="full-name">
                                    {{ marketplace.name }}
                                </div>
                                <div class="info">{{ marketplace.slug }}</div>
                                <div class="info">{{ marketplace.app_id }}</div>
                            </div>
                            <div class="inline">
                                <div class="card-item">
                                    <div class="card-content-line-2">
                                        Brands
                                    </div>
                                    <div class="card-content-line-3">
                                        {{ marketplace.brand }}
                                    </div>
                                </div>
                                <div class="card-item">
                                    <div class="card-content-line-2">
                                        Locations
                                    </div>
                                    <div class="card-content-line-3">
                                        {{ marketplace.location || 'All' }}
                                    </div>
                                </div>
                                <div class="card-item">
                                    <div class="card-content-line-2">
                                        Products
                                    </div>
                                    <div class="card-content-line-3">
                                        {{ marketplace.product || 'All' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-cta">
                            <inline-svg
                                class="arrow-next"
                                :src="'arrow-nitrozen'"
                            />
                        </div>
                    </div>
                </div>
                <div v-else>
                    <adm-no-content :helperText="'No marketplaces found'" />
                </div>
                <nitrozen-pagination
                    v-if="marketplacesList.length"
                    name="marketplaces"
                    v-model="pagination"
                    :pageSizeOptions="[5, 10, 25, 50, 100]"
                    @change="paginationChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/common/layout/page-header';
import Shimmer from '@/components/common/shimmer';
import pageerror from '@/components/common/page-error';
import inlineSVG from '@/components/common/inline-svg';
import InternalMarketplaceAdminService from '@/services/internal-marketplaces.service';
import admNoContent from '@/components/common/page-empty';
const DEFAULT_IMAGE = '/public/assets/admin/pngs/default-profile.png';
import { debounce } from '@/helper/utils';
import safeAccess from 'safe-access';

import {
    NitrozenInput,
    NitrozenPagination,
    strokeBtn,
    flatBtn,
    NitrozenButton
} from '@gofynd/nitrozen-vue';
export default {
    name: 'marketplace-list',
    components: {
        'inline-svg': inlineSVG,
        'page-error': pageerror,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,

        'adm-no-content': admNoContent,
        'adm-shimmer': Shimmer,
        'nitrozen-button': NitrozenButton,
        'page-header': PageHeader
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            pagination: {
                limit: 10,
                total: 0,
                current: 1
            },
            rawMarketplacesList: [],
            searchText: '',
            pageTitle: 'Marketplace'
        };
    },
    computed: {
        default_img() {
            return DEFAULT_IMAGE;
        },
        marketplacesList() {
            return this.rawMarketplacesList.map((rawMarketplace) => {
                return {
                    validation: {
                        location: {
                            documents: [{}, {}, {}],
                            stage: 'verified'
                        },
                        brand: {
                            assets: true,
                            stage: 'verified'
                        }
                    },
                    location: safeAccess(
                        rawMarketplace,
                        'validation.location.stage'
                    ),
                    brand: safeAccess(rawMarketplace, 'validation.brand.stage'),
                    product: safeAccess(
                        rawMarketplace,
                        'validation.product.stage'
                    ),
                    slug: rawMarketplace.slug,
                    _id: rawMarketplace._id,
                    name: rawMarketplace.name,
                    logo: rawMarketplace.logo,
                    app_id: rawMarketplace.app_id
                };
            });
        }
    },
    mounted() {
        this.getmarketplaces(this.getSearchParams());
    },
    methods: {
        getmarketplaces(params) {
            this.pageLoading = true;
            this.pageError = false;
            return InternalMarketplaceAdminService.fetchMarketplaces(params)
                .then(({ data }) => {
                    this.pageLoading = false;
                    this.rawMarketplacesList = data.items || [];
                    this.pagination.total =
                        safeAccess(data, 'page.item_total') || 0;
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        paginationChange(filter) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            this.searchMarketPlaces();
        },
        addMarketplace() {
            this.$router.push({
                path: `/administrator/settings/platform/marketplace/add`
            });
        },
        editmarketplace(marketplace) {
            this.$router.push({
                path: `/administrator/settings/platform/marketplace/edit/${marketplace.app_id}`
            });
        },
        getMarketplaceImage(marketplace) {
            let image = DEFAULT_IMAGE;
            return marketplace.logo || image;
        },
        searchMarketPlaces: debounce(function() {
            this.getmarketplaces(this.getSearchParams());
        }, 100),
        getSearchParams() {
            return {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                q: this.searchText
            };
        }
    }
};
</script>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}
.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;

    .inline {
        display: flex;
    }
    .search-marketplaces {
        // width: 400px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        padding: 12px;
        background-color: @Alabaster2;
        .search {
            width: 100%;
            margin-right: 12px;
        }
    }

    .marketplace-list-container {
        width: 100%;
        word-break: break-all;
        position: relative;
        .marketplace-filters {
            display: flex;
            .search {
                flex: 1;
                max-width: 400px;
                margin-top: 22px;
            }
            .dropdown-filters {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                > div {
                    padding-left: 10px;
                }
            }
        }

        .nitrozen-pagination-container,
        .marketplace-card-list {
            margin-top: 12px;
            .container {
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                height: 70px;
                display: flex;
                overflow: visible;
                max-height: 70px;
                padding: 16px;
                margin-bottom: 16px;
                transition: box-shadow 0.3s;
                cursor: pointer;
                &:hover {
                    box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
                }
                .disabled {
                    background: @WhiteSmoke;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .text-ellipsis {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .card-avatar {
                    display: flex;
                    align-items: center;
                    margin-right: 16px;
                    width: 70px;
                    height: 70px;
                    align-self: center;
                    border-radius: 50%;
                    border: 1px solid #e4e5e6;
                    img {
                        min-height: 70px;
                        max-height: 70px;
                        min-width: 70px;
                        max-width: 70px;
                        border-radius: 50%;
                    }
                }
                .card-content-section {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;

                    .card-item {
                        padding: 5px 24px;
                    }
                    .card-item:nth-child(1) {
                        padding-left: 0;
                    }

                    .card-content-line-1 {
                        display: flex;
                        align-items: baseline;

                        .full-name {
                            font-weight: 600;
                            font-size: 14px;
                            padding-right: 10px;
                        }
                        .info {
                            border-left: 1px solid #e0e0e0;
                            color: #9b9b9b;
                            font-size: 12px;
                            padding: 0px 10px;
                            font-weight: 400;
                        }
                    }
                    .card-content-line-2 {
                        color: #9b9b9b;
                        line-height: 22px;
                        font-size: 12px;
                        display: flex;
                    }
                    .card-content-line-3 {
                        line-height: 22px;
                        font-size: 14px;
                        display: flex;
                        text-transform: capitalize;
                    }
                }
                .card-cta {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .arrow-next {
                        height: 20px;
                        width: 20px;
                        transform: rotate(180deg);
                        border: 1px solid @Alto;
                        border-radius: 4px;
                        padding: 10px;

                        ::v-deep svg {
                            width: 15px;
                        }
                    }
                }
            }
        }
    }
}
</style>
