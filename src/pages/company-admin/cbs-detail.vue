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
            :tabItem="tabs"
            @tab-change="onTabChange"
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
                    <!-- <div class="page-container common-container">
                        <div class="left-container">
                            <adm-application-list></adm-application-list>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div v-show="activeTabIndex === 1">
            <div class="full-width">
                <div  >
                    <!-- this is application-list -->
                   <adm-application-list ></adm-application-list>
                </div>
            </div>
                                        

        </div>
        <div v-show="activeTabIndex === 2">
            <mkp-channels
                class="page-container common-container"
            ></mkp-channels>
        </div>
        <div
            v-show="activeTabIndex === 3"
            class="main-container profile-container"
        >
            <div class="full-width">
                <div class="applications" style="width: 98%">
                    <!-- this is subscription -->
                    <adm-company-subscription
                        :companyProfile="profileDetails"
                    ></adm-company-subscription>
                </div>
            </div>
        </div>
        <div
            v-if="activeTabIndex === 4"
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
        <div v-show="activeTabIndex === 5">
            <list-deployment :company_name="profileDetails.name" />
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
import invoiceListing from './invoice-listing.vue';
import admcompanysubscription from './subscription.vue';
import deploymentList from './deployment-listing.vue';
import root from 'window-or-global';
import invert from 'lodash/invert';

const env = root.env || {};
const TAB_NAMES = [
    'Details',
    'Sales Channels',
    'Marketplace Channels',
    'Subscription',
    'Invoices',
    'Infra',
];
export default {
    name: 'adm-company-profile',
    components: {
        'adm-brands': admbrands,
        'adm-application-list': admapplication,
        'adm-stores': admstores,
        'adm-company-details': admcompanydetails,
        'list-dri': listdri,
        'adm-company-subscription': admcompanysubscription,
        Shimmer,
        PageHeader,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-tab': NitrozenTab,
        'mkp-channels': marketplaceChannels,
        'ukt-inline-svg': uktInlineSVG,
        'adm-inline-svg': admInlineSVG,
        'invoice-listing': invoiceListing,
        'list-deployment': deploymentList,
    },
    computed: {},
    data() {
        return {
            activeTabIndex: 0,
            companyId: this.$route.params.companyId,
            profileDetails: {},
            tabs: TAB_NAMES,
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
        this.$refs.nit_tab.activeTab = 0;
        if (this.$route.query.tab) {
            let tab = this.$route.query.tab;
            let tabs = invert(TAB_NAMES);
            let obj = {
                index: Number(tabs[tab]),
                item: tab,
            };
            this.$refs.nit_tab.activeTab = obj.index;
            this.onTabChange(obj);
        }

        this.getProfileDetails();
        this.fetchMetricsApi();
    },
    computed: {
        fyndPlatformDomain(type) {
            return env.MIRAGE_MAIN_DOMAIN;
        },
    },
    methods: {
        onTabChange(obj) {
            if (this.$route.query.tab != obj.item) {
                this.$router
                    .replace({
                        name: this.$route.name,
                        query: {
                            tab: obj.item,
                        },
                    })
                    .catch(() => {});
                this.activeTabIndex = obj.index;
            } else {
                this.$router
                    .replace({
                        name: this.$route.name,
                        query: {
                            ...this.$route.query,
                            tab: obj.item,
                        },
                    })
                    .catch(() => {});
                this.activeTabIndex = obj.index;
            }
        },
        goToBillingPage(id) {
            this.$router.push({
                path: `/administrator/company-details/${this.companyId}/billing-details/${id}`,
            });
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
                `${this.fyndPlatformDomain}/company/${this.companyId}/profile/`
            );
        },
    },
};
</script>
