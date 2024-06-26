<template>
    <div>
        <div class="panel">
            <div class="header-position">
                <adm-page-header
                    title="Product Listing"
                    @backClick="redirectToListing"
                >
                </adm-page-header>
            </div>
        </div>
        <div class="main-container">
            <div class="second-container">
                <div
                    class="search-box"
                >
                    <div v-if="isInitialLoad" class="input-shimmer shimmer"></div>
                    <template v-else>
                        <nitrozen-input
                            :showSearchIcon="true"
                            class="search"
                            type="search"
                            placeholder="Search by name..."
                            v-model="searchText"
                            @input="debounceInput({ name: searchText })"
                        ></nitrozen-input>
                        <div class="filter">
                            <label class="label">Filter</label>
                            <nitrozen-dropdown
                                class="filter-dropdown"
                                :items="filters"
                                v-model="stageFilter"
                                @change="
                                    setRouteQuery({ stage: stageFilter })
                                "
                            ></nitrozen-dropdown>
                            <nitrozen-dropdown
                                placeholder="Choose Brand"
                                class="filter-dropdown"
                                :items="brandValuesList"
                                v-model="selectedBrandFilter"
                                @input="
                                    setRouteQuery({
                                        brandFilter: selectedBrandFilter
                                    })
                                "
                                :searchable="true"
                                @searchInputChange="setBrandValuesList"
                            ></nitrozen-dropdown>
                        </div>
                    </template>
                </div>
                <div class="product-list">
                    <shimmer v-if="pageLoading && !pageError" :count="4"></shimmer>
                    <page-error
                        v-else-if="pageError && !pageLoading"
                        @tryAgain="fetchProduct"
                        text="Oops ! Something went wrong."
                    ></page-error>
                    <div v-else-if="productList && productList.length">
                        <!-- new cards -->
                        <div
                            v-for="(product, index) in productList"
                            :key="index"
                            class="container"
                        >
                            <div class="card-top" @click="companyView(product)">
                                <div class="left-container">
                                    <div class="card-avatar">
                                        <img
                                            :src="
                                                productProfileImage(product.product.media)
                                            "
                                            @error="getErrorImage()"
                                        />
                                    </div>
                                    <div class="offer-details">
                                        <div
                                            v-if="product.product.name"
                                            class="card-content-line-1 txt-company-heading"
                                        >
                                            {{ product.product.name }}
                                        </div>

                                        <div class="txt-arrange">
                                            <div
                                                class="txt-description-heading"
                                            ></div>
                                            <div class="txt-country">
                                                {{ product.item_code }}
                                            </div>
                                        </div>
                                        <div
                                            class="txt-arrange"
                                            v-if="
                                                product.modified_by &&
                                                product.modified_on
                                            "
                                        >
                                            <div
                                                class="txt-description-heading"
                                                v-if="
                                                    product.modified_by &&
                                                    product.modified_by.user_id
                                                "
                                            >
                                                Modified By:
                                            </div>
                                            <div class="txt-details-by">
                                                <user-info-tooltip
                                                    :userId="
                                                        userObj[
                                                            product.modified_by
                                                                .user_id
                                                        ]
                                                    "
                                                ></user-info-tooltip>
                                                <span
                                                    class="txt-clm"
                                                    v-if="product.modified_on"
                                                    >On</span
                                                >
                                                <span
                                                    class="txt-clm"
                                                    v-if="product.modified_on"
                                                >
                                                    {{
                                                        new Date( 
                                                            product.modified_on
                                                        ).toLocaleString()
                                                    }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        product &&
                                        product.status
                                    "
                                    class="card-badge-section"
                                >
                                    <nitrozen-badge
                                        v-if="
                                            product.status ===
                                            'verified'
                                        "
                                        state="success"
                                        >Verified</nitrozen-badge
                                    >
                                    <nitrozen-badge
                                        v-else-if="
                                            product.status ===
                                            'rejected'
                                        "
                                        state="error"
                                        >Rejected</nitrozen-badge
                                    >
                                    <nitrozen-badge v-else state="warn"
                                        >Pending</nitrozen-badge
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <page-empty
                        v-else
                        :helperText="'No product found'"
                        text="No Products Available"
                    ></page-empty>
                    <div class="pagination" v-if="productList.length">
                        <nitrozen-pagination
                            name="Products"
                            v-model="pagination"
                            @change="paginationChange"
                            :pageSizeOptions="[5, 10, 20, 50]"
                        ></nitrozen-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.txt-clm {
    margin-left: 6px;
}
.header-position {
    height: 58.5px;
}
.main-container {
    width: auto;
    background-color: white;
    margin: 24px;
    padding: 24px;
    padding-bottom: 0;
}
.second-container {
    margin: 24px 0px;
}

.cust-inp {
    margin-bottom: 24px;
}
.badge-class {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;

    .hlp-badge {
        margin-right: 24px;
    }
}
.search-filter-container {
    margin: 24px 0;
    align-items: center;
    display: flex;
    justify-content: space-between;

    .search-box {
        min-width: 400px;
    }

    .filter-dropdown {
        width: 200px;
    }

    .filter {
        display: flex;
        align-items: center;

        .label {
            margin-right: 24px;
        }
    }
}
.search-box {
    margin: 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .search {
        min-width: 400px;
    }

    .filter {
        display: flex;
        align-items: center;
    }
    .label {
        font-family: Inter, sans-serif;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .filter-dropdown {
        width: 200px;
        margin-left: 12px;
    }
}

.container {
    border: 1px solid #e4e5e6;
    cursor: pointer;
    min-height: 120px;
    padding: 0px 24px;
    border-radius: 3px;
    margin-bottom: 16px;
    transition: box-shadow 0.3s;
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
    .card-top {
        display: flex;
        height: auto;
        margin-top: 24px;
        .left-container {
            display: flex;
            flex: 2;
            position: relative;
            width: calc(100% - 60px);
            align-items: center;

            .offer-details {
                padding: 0px 24px;
                line-height: 24px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: calc(100% - 100px);
            }

            .txt-arrange {
                display: flex;
                justify-content: flex-start;
                text-align: center;
            }

            .txt-company-heading {
                color: #2e31be;
                font-weight: 600;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                line-height: 22px;
                margin-bottom: 6px;
            }
            .txt-description-heading {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .txt-details-by {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
                margin-left: 5px;
                display: flex;
            }
            .txt-country {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .txt-details-on {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
                margin-left: 57px;
            }

            .card-avatar {
                min-height: 60px;
                min-width: 60px;
                max-height: 60px;
                max-width: 60px;
                display: flex;
                align-items: center;
                img {
                    width: 100%;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
        }
        .right-container {
            display: flex;
            flex: 1;
            flex-direction: row;
            position: relative;
            align-items: center;

            ::v-deep .continue-arrow svg {
                width: 40px;
                height: 40px;
            }
            ::v-deep .status-container {
                display: flex;

                padding: 0px 12px;
            }
        }
    }
    .card-bottom {
        line-height: 19px;
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        .size {
            width: auto;
            height: 40px;
            padding: 0 12px;
            margin: 12px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            transition: background-color 0.3s;
            &:hover {
                background-color: @WhiteSmoke;
            }
            .line-1 {
                color: @Mako;
                font-weight: 500;
            }
        }
    }
}
.export-catalog {
    margin-left: 20px;
}
</style>
<script>
import Jumbotron from '@/components/common/jumbotron';
import {
    titleCase,
    debounce,
    generateArrItem,
    filterDuplicateObject,
    fetchUserMetaObjects
} from '@/helper/utils';
import { isEmpty } from 'lodash';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import CompanyService from '@/services/company-admin.service';
import userInfoTooltip from '@/components/common/feedback/userInfo-tooltip.vue';
import CatalogService from '@/services/catalog.service.js';
import admpageheader from '@/components/common/layout/page-header';

import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenPagination,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};

const ROLE_FILTER = [
    { value: 'all', text: 'All' },
    { value: 'verified', text: 'Verified' },
    { value: 'pending', text: 'Pending' },
    { value: 'rejected', text: 'Rejected' }
];

export default {
    name: 'adm-company-list',
    components: {
        Jumbotron,
        PageEmpty,
        Shimmer,
        userInfoTooltip,
        'adm-page-header': admpageheader,
        'page-error': pageerror,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        NitrozenDropdown,
        NitrozenButton
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    computed: {},
    data() {
        return {
            productList: [],
            pageLoading: false,
            isInitialLoad: false,
            templatesLoading: false,
            pageError: false,
            activeCompany: null,
            categories: [],
            categoryValuesList: [],
            filters: [...ROLE_FILTER],
            searchText: '',
            stageFilter: 'pending',
            pagination: { ...PAGINATION },
            pageId: '',
            showSelectModal: false,
            departments: [],
            brands: [],
            brandValuesList:[],
            selectedBrandFilter: 0,
            templates: [],
            selectedDepartment: '',
            tempList: [],
            userObj: {},
            selectedTemplate: {},
            resData: null,
            rejection_info: {
                showError: false,
                errortext: 'Please explain rejection reason properly.',
                value: ''
            },
            
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        titleCase,
        init(){
            const { params: { companyId }} = this.$route;
            this.companyId = companyId;
            this.pageLoading = true;
            this.populateFromURL();
            this.fetchBrands();
        },
        populateFromURL() {
            const { name, pageId } = this.$route.query;
            if (name) this.searchText = name;
            if (pageId) this.pageId = pageId;
        },
        companyView(product) {
            let vproduct = product.product
            const { uid, item_code , template_tag} = vproduct;
            const { id } = product
            const query = {
                    "template": template_tag,
                    id
                };
            if (uid) {
                this.$router.push({
                    path: `/administrator/product/verification/${this.companyId}/products/edit/${uid}`,
                    query,
                });
            }
        },
        requestQuery() {
            const { current, limit } = this.pagination;
            const query = {
                page_no: current,
                page_size: limit,
                companyId: this.companyId,
            };

            if (this.searchText) {
                query.q = this.searchText;
            }
            if (this.selectedBrandFilter) {
                query.brand_ids = [this.selectedBrandFilter];
            }
            if (this.stageFilter !== 'all') {
                query.status = [this.stageFilter];
            }

            return query;
        },
        fetchProduct() {
            this.pageLoading = true;
            return CatalogService.fetchVariantProductListing(this.requestQuery())
                .then(({ data }) => {
                    this.tempList = generateArrItem(data.items);
                    this.tempList = filterDuplicateObject(this.tempList);
                    fetchUserMetaObjects(this.tempList)
                        .then((res) => {
                            res.map((element) => {
                                if (!this.userObj[element._id]) {
                                    this.userObj[element._id] = element;
                                }
                            });
                            this.productList = data.items;
                            this.pagination.total = data.page.item_total;
                            this.pageLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.log(err);
                });
        },
        fetchBrands() {
            const params = {
                page_size: 9999,
                company_id: this.companyId
            };
            return new Promise((resolve, reject) => {
                CompanyService.fetchBrands(params)
                    .then(({ data }) => {
                        this.brands = data.items
                        this.setBrandValuesList();
                        return resolve();
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        setBrandValuesList(e = {}) {
            if (!e.text) {
                this.clearBrandFilter();
                this.fetchProduct();
            }
            this.brandValuesList = [];
            this.brands.forEach(b => {
                if (
                    !e ||
                    !e.text ||
                    b.brand.name.toLowerCase().indexOf(e.text.toLowerCase()) >
                        -1
                ) {
                    this.brandValuesList.push({
                        text: b.brand.name,
                        value: b.brand.uid,
                        logo: b.brand.logo
                    });
                }
            });
        },
        clearBrandFilter() {
            this.selectedBrandFilter = '';
            this.setRouteQuery({ brandFilter: undefined });
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);

            this.fetchProduct();
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ name: this.searchText });
            }
        }, 200),
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ name: undefined });
        },
        productProfileImage(media) {
            const DEFAULT_NO_IMAGE = '/public/assets/pngs/default_icon_listing.png';

            if (isEmpty(media)) {
                return DEFAULT_NO_IMAGE;
                }
                const profileImg = media.find(m => m.type === 'image');
            if (isEmpty(profileImg) || !profileImg.url) {
                return DEFAULT_NO_IMAGE;
            }
                return profileImg.url;
        },
        getErrorImage() {
            return '/public/assets/pngs/default_icon_listing.png';
        },
        setRouteQuery(query) {
            if (query.name || query.stage !== 'all') {
                this.pagination = { ...PAGINATION };
                query.pageId = undefined;
                query.limit = PAGINATION.limit;
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
            this.fetchProduct();
        },
        redirectToListing(){
            this.$router.push({ path: `/administrator/product/verification/`});
        },
    }
};
</script>
