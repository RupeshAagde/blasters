<template>
    <div class="brands">
        <div class="brands-header">
            <label class="bold-xs cl-Mako"
                >Brands ({{ paginationConfig.total }})</label
            >
        </div>
        <div
            class="unverified-brand"
            v-if="metricsData && metricsData.brand.pending"
        >
            {{ metricsData.brand.pending }} brand{{
                metricsData.brand.pending > 1 ? 's are' : ' is'
            }}
            unverified.
        </div>
        <div v-if="inProgress" class="shimmer"></div>
        <div
            class="brands-body"
            v-if="!inProgress && brandsData && brandsData.length"
        >
            <div
                class="brands-div"
                :class="{ 'disable-brand': item.stage != 'verified' }"
                v-for="(item, index) in brandsDataToShow"
                :key="index"
                :title="item.brand.name"
            >
                <div class="brand-img-div" ref="adminDialog" @click="openAdminDialog(item)">
                    <img
                        v-if="item.brand.logo"
                        :src="item.brand.logo | imagetransform({ width: 130 })"
                        class="brand-img"
                    />
                </div>
                <div class="brand-name">{{ item.brand.name }}</div>
                <div class="brand-edt">
                    <a
                        :href="
                            `https://platform.${fyndPlatformDomain}/company/${companyId}/profile/edit-brand/${item.brand.uid}`
                        "
                        target="_blank"
                        class="menu"
                        >Edit</a
                    >
                </div>
                <div class="brand-stage">
                    <nitrozen-badge
                        :state="item.stage == 'verified' ? 'success' : 'warn'"
                    >
                        {{
                            item.stage == 'verified' ? 'verified' : 'unverified'
                        }}
                    </nitrozen-badge>
                </div>
            </div>
        </div>
        <div class="view-more" v-if="viewMore">
            <nitrozen-button
                v-if="!showLess"
                class="view-more-btn"
                @click="
                    loadMoreBrands(true);
                    showLess = true;
                "
                :theme="'secondary'"
                >View More</nitrozen-button
            >
            <nitrozen-button
                v-if="showLess"
                class="view-less-btn"
                @click="
                    loadMoreBrands(false);
                    showLess = false;
                "
                :theme="'secondary'"
                >View Less</nitrozen-button
            >
        </div>
        <page-error v-if="pageError" @tryAgain="getBrands"></page-error>
        <page-empty
            v-if="!pageError && !inProgress && !brandsData.length"
            :helperText="'No Brands Found'"
        ></page-empty>
        <nitrozen-dialog
            class="remove_staff_dialog"
            ref="brand_admin_dialog"
            title="success"
            @close="closeAdminDialog"
        >
            <template slot="header" v-if="activeBrand" class="cust-header">
                <div>
                    <span>
                        {{
                            activeBrand.brand
                                ? activeBrand.brand.name
                                : 'Company Brand'
                        }}
                    </span>
                    <span class="brand-stage left-space">
                        <nitrozen-badge
                            :state="
                                activeBrand.stage == 'verified'
                                    ? 'success'
                                    : 'warn'
                            "
                        >
                            {{
                                activeBrand.stage == 'verified'
                                    ? 'verified'
                                    : 'unverified'
                            }}
                        </nitrozen-badge>
                    </span>
                </div>
                <div @click="closeAdminDialog" class="cust-pointer">
                    <adm-inline-svg
                        :src="'cross-black'"
                        title="Close"
                    ></adm-inline-svg>
                </div>
            </template>
            <template slot="body" class="desc-dialog" v-if="activeBrand">
                <div v-if="activeBrand.brand.description">
                    <label class="n-input-label">Description</label>
                    <div class="cust-inp">
                        {{ activeBrand.brand.description }}
                    </div>
                </div>
                <div class="text-margin">
                    Are you sure you want to {{ admin_action_text }} this brand?
                </div>
                <div>
                    <nitrozen-input
                        class="cust-margin"
                        v-if="show_verify_button"
                        type="textarea"
                        label="Reason*"
                        placeholder="Explain reason properly..."
                        v-model="rejection_info.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="cust-margin"
                        v-if="rejection_info.showError"
                        >{{ rejection_info.errortext }}</nitrozen-error
                    >
                </div>
                <div class="brand-images">
                    <div class="brand-logo">
                        <label class="n-input-label">Logo</label>
                        <img
                            :src="
                                activeBrand.brand.logo
                                    | imagetransform({ width: 130 })
                            "
                        />
                    </div>
                    <div class="brand-banner-1">
                        <label class="n-input-label">Landscape</label>
                        <img
                            :src="
                                activeBrand.brand.banner.landscape
                                    | imagetransform({ width: 270 })
                            "
                        />
                    </div>
                    <div class="brand-banner-2">
                        <label class="n-input-label">Portrait</label>
                        <img
                            :src="
                                activeBrand.brand.banner.portrait
                                    | imagetransform({ width: 360 })
                            "
                        />
                    </div>
                </div>
            </template>
            <template slot="footer">
                <div>
                    <nitrozen-button
                        class="mr24"
                        v-if="!show_verify_button"
                        @click="verifyBrand"
                        v-flatBtn
                        :theme="'secondary'"
                        >Verify</nitrozen-button
                    >
                    <nitrozen-button
                        class="mr24"
                        v-if="show_verify_button"
                        @click="unverifyBrand"
                        v-flatBtn
                        :theme="'secondary'"
                        >Disable</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeAdminDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.cust-pointer {
    cursor: pointer;
}
.left-space {
    margin-left: 12px;
}
.cust-header {
    display: flex;
    justify-content: space-between;
}
::v-deep .nitrozen-dialog-body {
    margin-bottom: 24px;
}
.cust-margin {
    margin-bottom: 6px;
}
.text-margin {
    margin-bottom: 24px;
}
.cust-inp {
    margin-bottom: 24px;
}
.brand-images {
    margin-bottom: 24px;
    .brand-logo {
        img {
            width: 100px;
            height: 100px;
        }
    }
    .brand-banner-1 {
        margin: 0 auto;
        img {
            width: 100%;
            max-height: 250px;
        }
    }
    .brand-banner-2 {
        img {
            width: 100%;
            max-height: 400px;
        }
    }
}

.page-container {
    .search-box {
        margin: 24px 0px 24px;
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        .search {
            min-width: 400px;
        }

        .filter {
            display: flex;
            width: 200px;
        }
        .label {
            font-family: Inter;
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            margin: 12px;
            font-weight: 500;
        }
    }
}
.icon-placeholder {
    height: 60px;
    width: 60px;
    background-color: #d8d8d8;
    border-radius: 50%;
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.card-avatar {
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
::v-deep .nitrozen-dropdown-label {
    display: none;
}
.brands {
    .brands-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        .bold-xs {
            font-size: 18px;
        }
    }
    .unverified-brand {
        background-color: #fffaf0;
        color: #f5a300;
        border: 1px solid #f5a300;
        border-radius: 3px;
        padding: 12px;
        margin-bottom: 12px;
    }
    .brands-body {
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-row-gap: 24px;
        margin-bottom: 12px;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            display: none;
        }
        .disable-brand {
            opacity: 0.5;
        }
        .brands-div {
            margin: auto;
            .brand-img-div {
                background-color: @Alabaster2;
                height: 80px;
                width: 80px;
                cursor: pointer;
                .brand-img {
                    width: 100%;
                    height: 100%;
                }
                &:hover {
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
            }
            .brand-name {
                text-align: center;
                margin: 12px 0;
                line-height: 16px;
                color: @Mako;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 80px;
            }
            .brand-edt {
                text-align: center;
                margin: 12px 0;
                color: #5a6bdd;
                cursor: pointer;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 80px;

                &:hover {
                    font-size: 12px;
                    background-color: white;
                    opacity: none;
                    font-weight: bold;
                    color: #5a6bdd;
                }
            }
            .brand-stage {
                // margin: 12px 0;
                text-align: center;
            }
        }
    }
    .view-more {
        text-align: right;
        margin: 12px 0;

        .view-more-btn{
            display: inherit;
        }
        .view-less-btn{
            display: inherit;
        }
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 120px;
    margin-bottom: 24px;
}
</style>

<script>
import CompanyService from '@/services/company-admin.service';
import loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import dateFormat from 'dateformat';
import admInlineSVG from '@/components/common/adm-inline-svg';
import { GET_METRICS } from '@/store/getters.type';
import { mapGetters } from 'vuex';

import root from 'window-or-global';
const env = root.env || {};

import {
    NitrozenButton,
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenBadge,
    NitrozenInput,
    NitrozenDialog,
    NitrozenError,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-company-brands',
    components: {
        Shimmer,
        PageEmpty,
        'page-error': pageerror,
        'adm-inline-svg': admInlineSVG,
        loader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            isInitialLoad: true,
            paginationConfig: {
                current: 1,
                total: 0,
                limit: 100
            },
            selectedChoice: '',
            searchText: '',
            brandsData: [],
            choiceType: [],
            showCount: 10,
            brandsDataToShow: [],
            viewMore: false,
            showLess: false,
            companyId: this.$route.params.companyId,
            activeBrand: null,
            inBrand: null,
            rejection_info: {
                showError: false,
                errortext: 'Please explain reason properly.',
                value: ''
            },
            admin_action_text: '',
            show_verify_button: null
        };
    },
    filters: {
        dateFormatter: function(value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
        }
    },
    computed: {
        ...mapGetters({
            metricsData: GET_METRICS
        }),
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        }
    },
    mounted() {
        this.getBrands();
    },
    methods: {
        getParams: function() {
            const params = {
                page_size:
                    this.$route.query.limit || this.paginationConfig.limit,
                page_no:
                    this.$route.query.current || this.paginationConfig.current,
                brand: ''
            };
            return params;
        },
        getBrands() {
            this.inProgress = true;
            this.pageError = false;
            let params = this.getParams();
            params.company_id = this.companyId;
            CompanyService.fetchBrands(params)
                .then((res) => {
                    this.inProgress = false;
                    this.pageError = false;
                    this.brandsData = res.data.items;
                    this.brandsDataToShow = this.brandsData.slice(
                        0,
                        this.showCount
                    );
                    if (this.brandsDataToShow.length < this.brandsData.length) {
                        this.viewMore = true;
                    }
                    this.paginationConfig.total = res.data.page.item_total;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    this.inProgress = false;
                });
        },
        loadMoreBrands: function(flag) {
            if (flag) {
                this.brandsDataToShow = this.brandsDataToShow.concat(
                    this.brandsData.slice(this.showCount)
                );
            } else {
                this.brandsDataToShow = this.brandsData.slice(
                    0,
                    this.showCount
                );
            }
        },
        verifyBrand() {
            const obj = {
                brand: this.activeBrand.brand.uid,
                stage: 'verified'
            };
            obj.company = parseInt(this.companyId);
            CompanyService.adminActionBrand(obj)
                .then((res) => {
                    this.closeAdminDialog();
                    this.showLess = false;
                    this.getBrands();
                    this.$snackbar.global.showSuccess(
                        'Brand Verified Successfully',
                        {
                            duration: 2000
                        }
                    );
                    setTimeout(() => {}, 2000);
                })
                .catch((error) => {
                    console.error(error);
                    this.$snackbar.global.showError(
                        `${
                            error.response.data
                                ? error.response.data.message
                                : ''
                        }`,
                        {
                            duration: 2000
                        }
                    );
                    this.closeAdminDialog();
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        unverifyBrand() {
            let temp = this.companyId;
            temp = parseInt(temp);
            if (this.rejection_info.value.length > 0) {
                const obj = {
                    brand: this.activeBrand.brand.uid,
                    reject_reason: this.rejection_info.value,
                    stage: 'rejected',
                    company: temp
                };
                CompanyService.adminActionBrand(obj)
                    .then((res) => {
                        this.closeAdminDialog();
                        this.rejection_info.value = '';
                        this.rejection_info.showError = false;
                        this.showLess = false;
                        this.getBrands();
                        this.$snackbar.global.showSuccess(
                            'Brand Disabled Successfully',
                            {
                                duration: 2000
                            }
                        );
                        setTimeout(() => {}, 2000);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$snackbar.global.showError(
                            `${
                                error.response.data
                                    ? error.response.data.errors
                                    : ''
                            }`,
                            {
                                duration: 2000
                            }
                        );
                        this.closeAdminDialog();
                    })
                    .finally(() => {
                        this.inProgress = false;
                    });
            } else {
                this.rejection_info.showError = true;
            }
        },
        openAdminDialog(item) {
            this.activeBrand = item;
            if (item.stage == 'verified') {
                this.show_verify_button = true;
                this.admin_action_text = 'disable';
            } else {
                this.show_verify_button = false;
                this.admin_action_text = 'verify';
            }

            this.$refs['brand_admin_dialog'].open({
                width: '600px',
                height: '600px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeAdminDialog() {
            this.$refs['brand_admin_dialog'].close();
        },
    }
};
</script>
