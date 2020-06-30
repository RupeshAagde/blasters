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
                @click="editBrand(item)"
                class="brands-div"
                :class="{ 'disable-brand': item.stage != 'verified' }"
                v-for="(item, index) in brandsDataToShow"
                :key="index"
                :title="item.brand.name"
            >
                <div class="brand-img-div">
                    <img
                        v-if="item.brand.logo"
                        :src="item.brand.logo"
                        class="brand-img"
                    />
                </div>
                <div class="brand-name">{{ item.brand.name }}</div>
                <div class="brand-stage">
                    <nitrozen-badge
                        :state="item.stage == 'verified' ? 'success' : 'warn'"
                        >{{
                            item.stage == 'verified' ? 'verified' : 'unverified'
                        }}</nitrozen-badge
                    >
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
        <adm-no-content
            v-if="!pageError && !inProgress && !brandsData.length"
            :helperText="'No Brands Found'"
        ></adm-no-content>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

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
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 24px;
        // overflow-y: scroll;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            display: none;
        }
        .disable-brand {
            opacity: 0.5;
        }
        .brands-div {
            margin-right: 24px;
            cursor: pointer;
            margin-top: 12px;
            // &:hover {
            //     box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
            // }
            .brand-img-div {
                background-color: @Alabaster2;
                height: 80px;
                width: 80px;
                .brand-img {
                    width: 100%;
                    height: 100%;
                }
            }
            .brand-name {
                text-align: center;
                margin: 12px 0;
                color: @Mako;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 80px;
            }
            .brand-stage {
                margin: 12px 0;
                text-align: center;
            }
        }
    }
    .view-more {
        text-align: right;
        margin-bottom: 12px;
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
import loader from '@/components/common/adm-loader';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import dateFormat from 'dateformat';
import { getRoute } from '@/helper/get-route';

import {
    NitrozenButton,
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenBadge,
    NitrozenInput,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-company-brands',
    components: {
        'adm-shimmer': admshimmer,
        'adm-no-content': admnocontent,
        'page-error': pageerror,
        loader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput
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
            companyId: this.$route.params.companyId
        };
    },
    filters: {
        dateFormatter: function(value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
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
