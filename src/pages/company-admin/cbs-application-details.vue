<template>
    <div class="panel">
        <div class="top-container">
            <page-header
                ref="page-header-ref"
                :title="title"
                @backClick="redirectToListing"
            >
            </page-header>
        </div>
        <nitrozen-tab
            ref="nit_tab"
            :activeIndex="activeTabIndex"
            class="custom-tab"
            :tabItem="tabs"
            @tab-change="onTabChange"
        ></nitrozen-tab>
        <!-- <nitrozen-badge>profileDetails.stage</nitrozen-badge>
                       {{activeTabIndex}}  -->
         <div
            v-show="activeTabIndex === 0"
            class="main-container profile-container"
        >
            <div class="full-width">
                <div class="applications" style="width: 98%">
                    <!-- this is Application info -->
                    <application-info></application-info>
                </div>
            </div>
        </div>               
        <div
            v-show="activeTabIndex === 1"
            class="main-container profile-container"
        >
            <div class="full-width">
                <div class="applications" style="width: 98%">
                    <!-- this is PG configuration -->
                    <adm-pg-configuration></adm-pg-configuration>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.top-container {
    width: 100%;
    margin-bottom: 60px;
    position: relative;
}
.custom-tab {
    ::v-deep .nitrozen-tab-item {
        padding-top: 15px;
        &:first-child {
            margin-left: 10px;
        }
    }
}
.profile-container {
    margin-right: 0;
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
const TAB_NAMES = ['Application Info','PG Cred Review'];
import invert from 'lodash/invert';
import {
    NitrozenBadge,
    NitrozenTab,
    NitrozenButton,
} from '@gofynd/nitrozen-vue';
import PageHeader from '@/components/common/layout/page-header';
import admpgconfiguration from './pgconfig.vue'
import applicationinfo from './application-info.vue'

export default {
    name: 'application-deatails',
    components: {
        PageHeader,
        'nitrozen-tab': NitrozenTab,
        'nitrozen-badge': NitrozenBadge,
        'adm-pg-configuration' : admpgconfiguration,
        'application-info' : applicationinfo
    },
    data() {
        return {
            activeTabIndex: 0,
            tabs: TAB_NAMES,
            title: 'Application',
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
    },
    methods: {
        redirectToListing() {
            this.$router.go(-1);
        },
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
    },
};
</script>