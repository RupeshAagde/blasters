<template>
    <div class="brands">
        <div class="brands-header">
            <label class="bold-xs cl-Mako"
                >Brands ({{ paginationConfig.total }})</label
            >
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
                <div class="brand-img-div" @click="openAdminDialog(item)">
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
                @click="
                    loadMoreBrands(true);
                    showLess = true;
                "
                :theme="'secondary'"
                >View More</nitrozen-button
            >
            <nitrozen-button
                v-if="showLess"
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
            :title="
                activeBrand && activeBrand.brand
                    ? activeBrand.brand.name
                    : 'Company Details'
            "
        >
            <!-- <template slot="header" v-if="activeBrand">{{ activeBrand.brand.name }}</template> -->
            <template slot="body" class="desc-dialog" v-if="activeBrand">
                <div v-if="activeBrand.brand.description">
                    <label class="n-input-label">Description</label>
                    <div class="cust-inp">
                        {{ activeBrand.brand.description }}
                    </div>
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
                <div class="text-margin">
                    Are you sure you want to {{ admin_action_text }} this brand?
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

::v-deep .nitrozen-dialog-body {
    margin-bottom: 24px;
}
.cust-margin {
    margin-bottom: 6px;
}
.text-margin {
    margin-top: 18px;
    margin-bottom: 24px;
}
.cust-inp {
    margin-bottom: 24px;
}
.brand-images {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
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
            // margin-left: 50px;
            width: 100%;
            height: 250px;
        }
    }
    .brand-banner-2 {
        img {
            // margin-left: 50px;
            width: 100%;
            height: 400px;
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
            font-family: Poppins;
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
    .brands-body {
        // display: flex;
        // flex-wrap: wrap;
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-row-gap: 24px;
        margin-bottom: 12px;
        // overflow-y: scroll;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            display: none;
        }
        .disable-brand {
            opacity: 0.5;
        }
        .brands-div {
            // margin-right: 24px;
            margin: auto;
            // margin-top: 12px;
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
import { getRoute } from '@/helper/get-route';

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
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        }
    },
    mounted() {
        this.getBrands();
        this.getChoiceType();
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
            if (this.$route.query.stage) {
                this.selectedChoice = this.$route.query.stage;
                params.stage = this.selectedChoice;
            }

            if (this.$route.query.search) {
                this.$route.query.search = this.searchText;
                params.brand = this.searchText;
            }
            return params;
        },
        getBrands() {
            this.inProgress = true;
            this.pageError = false;
            let params = this.getParams();
            params.company = this.companyId;
            CompanyService.fetchBrands(params)
                .then((res) => {
                    this.inProgress = false;
                    this.pageError = false;
                    this.brandsData = res.data.data;
                    this.brandsDataToShow = this.brandsData.slice(
                        0,
                        this.showCount
                    );
                    if (this.brandsDataToShow.length < this.brandsData.length) {
                        this.viewMore = true;
                    }
                    this.paginationConfig.total = res.data.total_count;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    this.inProgress = false;
                    console.log(err, 'error');
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
        getChoiceType(params = {}) {
            params.choice_type = 'stage';
            CompanyService.fetchChoiceType(params)
                .then((res) => {
                    this.choiceType = res.data.data;
                    this.choiceType.map((ele) => {
                        ele.text = ele.value;
                        ele.value = ele.key;
                    });
                })
                .catch((err) => {
                    console.log(err, 'error');
                });
        },
        searchBrands: function() {
            let vm = this;
            _.debounce(function() {
                vm.getBrands(params);
            }, 1000)();
        },
        changeStage: function() {
            let params = {
                page_no: 1,
                page_size: this.paginationConfig.limit,
                brand: this.searchText,
                stage: this.selectedChoice
            };
            this.getBrands(params);
        },
        paginationChange(e) {
            this.paginationConfig = e;
            this.setPage(this.paginationConfig);
        },
        setPage(filter) {
            const { current, limit } = filter;
            this.paginationConfig = {
                ...this.paginationConfig,
                current,
                limit
            };
            this.setRouteQuery({ current, limit });
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
                    setTimeout(() => {
                        this.onCancel();
                    }, 2000);
                })
                .catch((error) => {
                    console.error(error);
                    this.$snackbar.global.showError(
                        `${
                            error.response.data
                                ? error.response.data.errors.error
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
                        this.closeRejectDialog();
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
                        setTimeout(() => {
                            this.onCancel();
                        }, 2000);
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
        // getImage(src, str){
        //   let temp = '/' + str + '/';
        //   console.log(src, 'src', str ,'str', temp, 'temp');
        //   return src.replace('/original/', temp);
        // },
        setRouteQuery(query) {
            if (query.search || query.stage) {
                // clear pagination if search or filter applied
                this.paginationConfig.current = 1;
                this.paginationConfig.limit = 100;
                query.current = 1;
                query.limit = 100;
            }
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
            this.getBrands();
        }
    }
};
</script>
