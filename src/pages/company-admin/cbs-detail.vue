<template>
    <div class="panel">
        <div v-if="inProgress" class="shimmer"></div>
        <div v-if="!inProgress" class="cust-panel">
            <div class="top-container" v-if="profileDetails">
                <page-header
                    ref="page-header-ref"
                    :title="profileDetails.name"
                    @backClick="redirectToListing"
                    :contextMenuItems="contextMenuItems"
                    @edit="openPlatform"
                >
                    <div class="top-badge">
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'verified'"
                            state="success"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'complete'"
                            state="warn"
                            >Verification Pending</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'rejected'"
                            state="error"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'incomplete'"
                            state="error"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                    </div>
                </page-header>
            </div>
        </div>
        <nitrozen-tab
            ref="nit_tab"
            :activeIndex="activeTabIndex"
            class="custom-tab"
            :tabItem="['Details', 'Marketplace Channels', 'Invoices']"
            @tab-change="(obj) => (activeTabIndex = obj.index)"
        ></nitrozen-tab>
        <div
            v-show="activeTabIndex === 0"
            class="main-container profile-container"
        >
            <div class="full-width">
                <div class="feature-container">
                    <!-- Brands Section -->
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-brands></adm-brands>
                        </div>
                    </div>
                    <!-- Stores Section -->
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-stores></adm-stores>
                        </div>
                    </div>
                    <div class="page-container common-container">
                        <div class="left-container">
                            <list-dri></list-dri>
                        </div>
                    </div>
                </div>

                <!-- Profile Section -->
                <div class="profile-container">
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-company-details></adm-company-details>
                        </div>
                    </div>
                    <!-- Application List Section -->
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-application-list></adm-application-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="activeTabIndex === 1">
            <mkp-channels
                class="page-container common-container"
            ></mkp-channels>
        </div>
        <div
            v-show="activeTabIndex === 2"
            class="main-container profile-container"
        >
            <!-- <div class="full-width">
                <div class="applications" style="width: 98%">
                    <div v-if="inProgress" class="shimmer"></div>
                    <div
                        v-if="
                            !inProgress &&
                            applicationList &&
                            applicationList.length > 0
                        "
                    >
                        <div
                            class="container"
                            v-for="(item, index) in applicationList"
                            :key="index"
                            :title="item.name"
                            @click="goToBillingPage(item.id)"
                        >
                            <div class="line-1">
                                <div class="cust-head">
                                    <a>Payment Status</a>
                                </div>
                                <div class="cust-badge">
                                    <a
                                        :href="`https://${item.domain.name}`"
                                        target="_blank"
                                    >
                                        <adm-inline-svg
                                            class="cust-space"
                                            :src="'eye-open'"
                                            title="View"
                                        ></adm-inline-svg>
                                    </a>
                                    <nitrozen-badge
                                        :state="
                                            item.payment_status === 'Paid'
                                                ? 'success'
                                                : 'warn'
                                        "
                                        >{{
                                            item.payment_status
                                        }}</nitrozen-badge
                                    >
                                </div>
                            </div>
                            <div class="line-2" v-if="item.number">
                                <div class="cust-head">Number</div>
                                <div
                                    class="cust-pointer"
                                    :title="`${item.number} (Click to copy)`"
                                    @click="copy(item.number)"
                                >
                                    {{ item.number }}
                                </div>
                            </div>
                            <div class="line-2" v-if="item.receipt_no">
                                <div class="cust-head">Receipt No</div>
                                <div
                                    class="cust-app cust-pointer"
                                    :title="`${item.receipt_no} (Click to copy)`"
                                    @click="copy(item.receipt_no)"
                                >
                                    {{ item.receipt_no }}
                                </div>
                            </div>
                            <div class="line-2" v-if="item.amount">
                                <div class="cust-head" v-if="item.amount">
                                    Amount
                                </div>
                                <div
                                    v-if="item.amount"
                                    class="cust-domain"
                                    :title="item.amount"
                                >
                                    {{ item.amount }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
            <invoice-listing></invoice-listing>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.top-badge {
    display: flex;
    justify-content: flex-start;
    margin-left: 24px;
}

::v-deep .page-slot {
    display: flex;
    flex: 1;
    justify-content: flex-start !important;
}
.top-container {
    width: 100%;
    margin: 0 0 0 0;
    position: relative;
}
.cust-panel {
    margin-bottom: 60px;
}
.profile-container {
    margin-right: 0;
}
.custom-tab {
    ::v-deep .nitrozen-tab-item {
        padding-top: 15px;
        &:first-child {
            margin-left: 10px;
        }
    }
}
.main-container {
    // margin-right: 0;
    .full-width {
        width: 100%;
        display: flex;
        .feature-container {
            width: 60%;
        }
        .profile-container {
            width: 40%;
        }
        .common-container {
            width: auto;
            margin: 0 24px 24px 0;
            padding: 12px 24px 0 24px;
        }
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 48px;
    margin-bottom: 24px;
}

.cust-pointer {
    cursor: pointer;
}
::v-deep .nitrozen-pagination {
    font-size: 11px !important;
}
::v-deep .nitrozen-pagination__select {
    margin-right: -24px !important;
}
::v-deep .page-error {
    img {
        width: 200px !important;
        height: 150px !important;
    }
}
.cust-space {
    margin-right: 12px;
    ::v-deep svg {
        width: 20px !important;
        height: 12px !important;
    }
    cursor: pointer;
}
.text-margin {
    margin: 12px 0 24px 0;
}
.cust-head {
    font-size: 14px;
    color: #9b9b9b;
    font-weight: 100;
}
.applications {
    .text-heading {
        font-size: 18px;
        color: #41434c;
        font-weight: bold;
        // margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
    }
    .search-div {
        width: 100%;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .label {
            color: #9b9b9b;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .box-search {
            width: 65%;
        }

        .box-drop {
            width: 33%;
        }
    }
    .container {
        box-sizing: border-box;
        border: 1px solid @Iron;
        border-radius: 4px;
        background-color: @White;
        // padding: 24px 12px 24px 12px;
        padding: 12px;
        margin-bottom: 24px;

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .line-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // padding-bottom: 12px;

            .cust-head {
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 160px;
                overflow: hidden;
                line-height: 20px;
                font-size: 14px;
                color: #2e31be;
                font-weight: bold;
                cursor: pointer;
            }

            .cust-badge {
                margin-left: 6px;
                display: flex;
                align-items: center;
            }
        }
        .line-2 {
            margin: 12px 0;
            display: flex;
            font-size: 14px;
            line-height: 20px;
            color: #41434c;
            font-weight: 200;
            justify-content: space-between;

            .cust-app {
                text-overflow: ellipsis;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
            }

            .cust-domain {
                text-overflow: ellipsis;
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
                color: #2e31be;
                font-weight: bold;
                cursor: pointer;
            }
        }
        .line-4 {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>

<script>
import admbrands from './brands.vue';
import admstores from './stores.vue';
import admInlineSVG from '@/components/common/adm-inline-svg';
import uktInlineSVG from '@/components/common/ukt-inline-svg';
import admapplication from './application-list.vue';
import listdri from './list-dri.vue';
import PageHeader from '@/components/common/layout/page-header';
import admcompanydetails from './profile-details.vue';
import CompanyService from '@/services/company-admin.service';
import Shimmer from '@/components/common/shimmer';
import {
    NitrozenBadge,
    NitrozenTab,
    NitrozenButton,
} from '@gofynd/nitrozen-vue';
import { FETCH_METRICS } from '@/store/action.type';
import marketplaceChannels from './mkp-channels.vue';
import invoiceListing from './invoice-listing.vue'

import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'adm-company-profile',
    components: {
        'adm-brands': admbrands,
        'adm-application-list': admapplication,
        'adm-stores': admstores,
        'adm-company-details': admcompanydetails,
        'list-dri': listdri,
        Shimmer,
        PageHeader,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-tab': NitrozenTab,
        'mkp-channels': marketplaceChannels,
        'ukt-inline-svg': uktInlineSVG,
        'adm-inline-svg': admInlineSVG,
        'invoice-listing':invoiceListing,
    },
    computed: {},
    data() {
        return {
            activeTabIndex: 0,
            companyId: this.$route.params.companyId,
            profileDetails: {},
            inProgress: false,
            applicationList: [],
            contextMenuItems: [
                {
                    text: 'View Company',
                    action: 'edit',
                },
            ],
        };
    },
    mounted() {
        this.activeTabIndex = this.$refs.nit_tab.activeTab =
            +this.$route.query.tab || 0;
        this.tempSetup();
        this.getProfileDetails();
        this.fetchMetricsApi();
    },
    computed: {
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        },
    },
    methods: {
        goToBillingPage(id) {
            this.$router.push({ path: `/administrator/billing-details/${id}` });
        },
        tempSetup: function () {
            this.applicationList = [
                {
                    website: {
                        enabled: true,
                        basepath: '/',
                    },
                    cors: {
                        domains: [],
                    },
                    auth: {
                        enabled: false,
                    },
                    description: 'Fresh Fashion. Straight from brand stores.',
                    channel_type: 'fynd',
                    cache_ttl: -1,
                    internal: false,
                    is_active: true,
                    _id: '000000000000000000000001',
                    name: 'Fynd',
                    meta: [
                        {
                            name: 'fynd',
                            value: 'true',
                        },
                    ],
                    owner: '5e04a5e6220bc17bc8ad9bc2',
                    company_id: 1,
                    token: 'BSBXcYPP',
                    number: 'FP-1-72020-736',
                    receipt_no: '5fd9b08464dc6ac048a08988',
                    amount: '₹15,720.08',
                    payment_status: 'Paid',
                    redirections: [],
                    __v: 36,
                    logo: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/164/applications/5efc9913f474c329718e3690/application/pictures/free-logo/original/olqHM8LNr-JioMart-Groceries.png',
                    },
                    banner: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/1/applications/000000000000000000000001/application/pictures/landscape-banner/original/l3ARxtc4_-Fynd.png',
                    },
                    favicon: {
                        secure_url:
                            'https://res.cloudinary.com/dwzm9bysq/image/upload/v1566539375/production/media/store/logo/jwosxsgh9ufoucdxpm10.png',
                    },
                    domains: [
                        {
                            verified: true,
                            is_primary: false,
                            is_default: true,
                            is_shortlink: true,
                            _id: '5eb1177748312a08965d0f1c',
                            name: 'fynd.hostx0.de',
                        },
                        {
                            verified: true,
                            is_primary: false,
                            is_default: false,
                            is_shortlink: false,
                            _id: '5ecfa38f8c703aae7cf1a8eb',
                            name: 'test-appgadget.hostx0.de',
                        },
                        {
                            verified: true,
                            is_primary: true,
                            is_default: false,
                            is_shortlink: false,
                            _id: '5f8029170b0c8d4bf3b2765e',
                            name: 'myfynd.hostx0.de',
                        },
                    ],
                    app_type: 'live',
                    tokens: [
                        {
                            created_by: {},
                            token: 'ET0dnHpZI',
                            created_at: '2021-02-22T04:15:13.171Z',
                        },
                        {
                            created_by: {},
                            token: 'wP-b76FkI',
                            created_at: '2021-02-22T15:49:16.111Z',
                        },
                    ],
                    created_at: '2019-12-26T13:22:22.962Z',
                    modified_at: '2021-04-02T18:16:38.296Z',
                    mobile_logo: {
                        secure_url:
                            'https://hdn-1.fynd.com/brands/pictures/square-logo/resize-w:200,/zjt4-wU8Lk-VQYu0pcokb-r6yteuannoorjkq9f4tk.jpg',
                    },
                    domain: {
                        verified: true,
                        is_primary: true,
                        is_default: false,
                        is_shortlink: false,
                        _id: '5f8029170b0c8d4bf3b2765e',
                        name: 'myfynd.hostx0.de',
                    },
                    id: '000000000000000000000001',
                },
                {
                    website: {
                        enabled: true,
                        basepath: '/',
                    },
                    cors: {
                        domains: [],
                    },
                    auth: {
                        enabled: false,
                    },
                    description: 'Artisan Theme Base Application',
                    channel_type: 'store',
                    cache_ttl: -1,
                    internal: false,
                    is_active: true,
                    _id: '000000000000000000000002',
                    name: 'Artisan Theme',
                    owner: '5e04a5e6220bc17bc8ad9bc2',
                    company_id: 1,
                    token: 'AKlVXheU',
                    number: 'FP-1-72020-736',
                    receipt_no: '5fd9b08464dc6ac048a08988',
                    amount: '₹15,720.08',
                    payment_status: 'Unpaid',
                    redirections: [],
                    meta: [],
                    __v: 7,
                    logo: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/1/applications/000000000000000000000002/application/pictures/free-logo/original/oPxbosuP5-jwosxsgh9ufoucdxpm10.png',
                    },
                    favicon: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/1/applications/000000000000000000000002/application/pictures/favicon/original/4mBa2BFNtv-jwosxsgh9ufoucdxpm10.png',
                    },
                    domains: [
                        {
                            verified: true,
                            is_primary: true,
                            is_default: true,
                            is_shortlink: true,
                            _id: '5eb1177748312a72b05d0f1d',
                            name: 'fyndstore.hostx0.de',
                        },
                    ],
                    app_type: 'live',
                    banner: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/164/applications/5efc9913f474c329718e3690/application/pictures/landscape-banner/original/D2fr98CUH-JioMart-Groceries.png',
                    },
                    tokens: [
                        {
                            token: 'AKlVXheU',
                            created_at: '2019-12-26T13:22:23.174Z',
                        },
                    ],
                    created_at: '2019-12-26T13:22:23.174Z',
                    modified_at: '2021-04-02T18:16:38.783Z',
                    mobile_logo: {
                        secure_url:
                            'https://hdn-1.addsale.com/x0/company/1/applications/000000000000000000000002/application/pictures/free-logo/original/byEDGQNJC-jwosxsgh9ufoucdxpm10.png',
                    },
                    domain: {
                        verified: true,
                        is_primary: true,
                        is_default: true,
                        is_shortlink: true,
                        _id: '5eb1177748312a72b05d0f1d',
                        name: 'fyndstore.hostx0.de',
                    },
                    id: '000000000000000000000002',
                },
                {
                    website: {
                        enabled: true,
                        basepath: '/',
                    },
                    cors: {
                        domains: [],
                    },
                    auth: {
                        enabled: false,
                    },
                    description: '000000000000000000000003 App',
                    channel_type: 'store',
                    cache_ttl: -1,
                    internal: false,
                    is_active: true,
                    _id: '000000000000000000000003',
                    name: '000000000000000000000003 App',
                    meta: [],
                    owner: '5df20abc369fd0781ea1c377',
                    company_id: 1,
                    token: 'vlFyBeQ-',
                    number: 'FP-1-72020-736',
                    receipt_no: '5fd9b08464dc6ac048a08988',
                    amount: '₹15,720.08',
                    payment_status: 'Paid',
                    redirections: [],
                    __v: 4,
                    domains: [
                        {
                            verified: true,
                            is_primary: true,
                            is_default: true,
                            is_shortlink: true,
                            _id: '5eb1177748312a6bdd5d0f2e',
                            name: '3t5jfk.hostx0.de',
                        },
                    ],
                    tokens: [
                        {
                            token: 'vlFyBeQ-',
                            created_at: '2020-03-02T06:44:39.564Z',
                        },
                    ],
                    created_at: '2020-03-02T06:44:39.564Z',
                    modified_at: '2021-04-01T09:13:29.309Z',
                    domain: {
                        verified: true,
                        is_primary: true,
                        is_default: true,
                        is_shortlink: true,
                        _id: '5eb1177748312a6bdd5d0f2e',
                        name: '3t5jfk.hostx0.de',
                    },
                    id: '000000000000000000000003',
                },
            ];
        },
        fetchMetricsApi: function () {
            let params = {
                company: this.companyId,
            };
            this.$store.dispatch(FETCH_METRICS, params);
        },
        getProfileDetails: function () {
            let params = {
                uid: this.companyId,
                // phase: 'company_detail'
            };
            this.inProgress = true;
            CompanyService.fetchCompanyProfile(params)
                .then((res) => {
                    this.inProgress = false;
                    this.profileDetails = res.data;
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.error(err);
                });
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/company-list' });
        },
        openPlatform() {
            event.stopPropagation();
            window.open(
                `https://platform.${this.fyndPlatformDomain}/company/${this.companyId}/profile/`
            );
        },
    },
};
</script>
