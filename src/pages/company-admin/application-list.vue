<template>
    <div class="applications">
        <div class="text-heading">
            <label>Sales Channels ({{ totalApp }})</label>
        </div>
        <div class="search-div">
            <div class="box-search">
                <nitrozen-input
                    placeholder="Search by name or domain . . ."
                    @input="fetchApplication"
                    v-model="searchText"
                    :showSearchIcon="true"
                    type="search"
                ></nitrozen-input>
            </div>
            <div class="box-drop">
                <label class="label">Filter</label>
                <nitrozen-dropdown
                    class="filter-dropdown"
                    :items="filters"
                    v-model="selectedFilter"
                    @change="fetchApplication"
                ></nitrozen-dropdown>
            </div>
        </div>
        <div v-if="inProgress" class="shimmer"></div>
        <div
            v-if="!inProgress && applicationList && applicationList.length > 0"
        >
            <div
                class="container"
                v-for="(item, index) in applicationList"
                :key="index"
                :title="item.name"
            >
            <div @click="redirectToDetails(item)">
                        <div class="line-1">
                            <div class="cust-head">
                                <a
                                    :href="`https://platform.${fyndPlatformDomain}/company/${companyId}/application/${item.id}`"
                                    target="_blank"
                                    >{{ item.name }}</a
                                >
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
                                    :state="item.is_active ? 'success' : 'warn'"
                                    >{{
                                        item.is_active
                                            ? 'Unarchived'
                                            : 'Archived'
                                    }}</nitrozen-badge
                                >
                            </div>
                        </div>
                        <div class="line-2" v-if="item.token">
                            <div class="cust-head">Token</div>
                            <div
                                class="cust-pointer"
                                :title="`${item.token} (Click to copy)`"
                                @click="copy(item.token)"
                            >
                                {{ item.token }}
                            </div>
                        </div>
                        <div class="line-2" v-if="item.id">
                            <div class="cust-head">Application ID</div>
                            <div
                                class="cust-app cust-pointer"
                                :title="`${item.id} (Click to copy)`"
                                @click="copy(item.id)"
                            >
                                {{ item.id }}
                            </div>
                        </div>
                        <div class="line-2" v-if="item.domain">
                            <div class="cust-head" v-if="item.domain.name">
                                Domain
                            </div>
                            <div
                                v-if="item.domain.name"
                                class="cust-domain"
                                :title="item.domain.name"
                            >
                                <a
                                    :href="`https://${item.domain.name}`"
                                    target="_blank"
                                    >{{ item.domain.name }}</a
                                >
                            </div>
                        </div>
                        <div
                            class="line-4"
                            v-if="!item.internal || item.is_internal"
                        >
                            <nitrozen-button
                                :theme="'secondary'"
                                v-if="item.is_active"
                                v-strokeBtn
                                @click="openAdminDialog(item,$event)"
                                >Archive</nitrozen-button
                            >
                            <nitrozen-button
                                :theme="'secondary'"
                                v-if="!item.is_active"
                                v-strokeBtn
                                @click="openAdminDialog(item,$event)"
                                >Unarchive</nitrozen-button
                            >
                        </div>
                </div>
            </div>
        </div>
        <adm-no-content
            v-if="!inProgress && !applicationList.length"
            :text="'No channel found'"
        ></adm-no-content>
        <div class="pagination" v-if="applicationList.length > 0">
            <nitrozen-pagination
                name="Sales Channel"
                v-model="pagination"
                @change="paginationChange"
                :pageSizeOptions="[5, 10, 20, 50]"
            ></nitrozen-pagination>
        </div>
        <nitrozen-dialog
            ref="channel_dialog"
            :title="activeChannel ? activeChannel.name : 'Sales Channel'"
        >
            <template slot="body" class="desc-dialog">
                <div class="text-margin">
                    Are you sure you want to {{ archiveText }} this sale
                    channel?
                </div>
            </template>
            <template slot="footer">
                <div v-if="activeChannel">
                    <nitrozen-button
                        v-if="activeChannel.is_active"
                        class="mr24"
                        v-flatBtn
                        :theme="'secondary'"
                        @click="archiveChannel"
                        >Archive</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="!activeChannel.is_active"
                        class="mr24"
                        v-flatBtn
                        :theme="'secondary'"
                        @click="unarchiveChannel"
                        >Unarchive</nitrozen-button
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
.shimmer {
    display: block;
    width: 100%;
    height: 120px;
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
    margin: 24px;
    background-color: white;
    padding: 24px;
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
import CompanyService from '@/services/company-admin.service';
import admInlineSVG from '@/components/common/adm-inline-svg';
import uktInlineSVG from '@/components/common/ukt-inline-svg';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
import { copyToClipboard } from '@/helper/utils.js';
import pageerror from '@/components/common/page-error';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenBadge,
    NitrozenPagination,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1,
};

const ROLE_FILTER = [
    { value: 'all', text: 'All' },
    { value: 'false', text: 'Archived' },
    { value: 'true', text: 'Unarchived' },
];

export default {
    name: 'application-list',
    components: {
        'ukt-inline-svg': uktInlineSVG,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        'nitrozen-pagination': NitrozenPagination,
        'adm-shimmer': admshimmer,
        'adm-no-content': admnocontent,
        'page-error': pageerror,
    },
    directives: {
        strokeBtn,
        flatBtn,
    },
    computed: {
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        },
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            totalApp: null,
            searchText: '',
            filters: [...ROLE_FILTER],
            selectedFilter: 'all',
            archiveText: '',
            companyId: this.$route.params.companyId,
            mainList: [],
            applicationList: [],
            activeChannel: null,
            pagination: { ...PAGINATION },
            pageId: '',
        };
    },
    mounted() {
        this.fetchApplication();
    },
    methods: {
        copy(text) {
            copyToClipboard(text);
            if (text) {
                this.$snackbar.global.showInfo('Copied to clipboard');
            } else {
                this.$snackbar.global.showError('Failed to Copy');
            }
        },
        requestQuery() {
            const temp = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                is_active: this.selectedFilter,
                q:  this.searchText
            };

            // if (this.searchText) {
            //     query.name = this.searchText;
            // }
            if(this.selectedFilter == 'all'){
              temp.is_active = ''
            }
            return temp;
        },
        fetchApplication() {
            this.inProgress = true;
            CompanyService.fetchApplication(this.companyId, this.requestQuery())
                .then((res) => {
                    this.inProgress = false;
                    this.pageError = false;
                    this.pagination.total = res.data.page.item_total;
                    this.totalApp = res.data.page.item_total;
                    this.mainList = res.data.items;
                    this.applicationList = res.data.items;
                })
                .catch((error) => {
                    this.inProgress = false;
                    console.error(error);
                });
                this.searchChannels();
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            // let pageQuery = { pageId: current, limit };
            // this.setRouteQuery(pageQuery);

            this.fetchApplication();
        },
        searchChannels() {
            if (this.mainList && this.mainList.length > 0) {
                if (this.searchText != '') {
                    this.applicationList = this.mainList.filter((element) => {
                        return (
                            element.name
                                .toLowerCase()
                                .includes(this.searchText.toLowerCase()) ||
                            element.domain.name
                                .toLowerCase()
                                .includes(this.searchText.toLowerCase())
                        );
                    });
                } else {
                    this.applicationList = this.mainList;
                }
            }
        },
        archiveChannel() {
            if (this.activeChannel) {
                let params = {
                    is_active: false,
                };

                this.inProgress = true;
                CompanyService.adminActionApplication(
                    this.companyId,
                    this.activeChannel.id,
                    params
                )
                    .then((res) => {
                        this.inProgress = false;
                        this.closeAdminDialog();
                        this.fetchApplication();
                        this.$snackbar.global.showSuccess(
                            'Application archived successfully',
                            {
                                duration: 2000,
                            }
                        );
                        setTimeout(() => {}, 2000);
                    })
                    .catch((error) => {
                        console.error(error);
                        console.log(error, 'error');
                        this.$snackbar.global.showError(
                            `${error.response.data.message}`,
                            {
                                duration: 2000,
                            }
                        );
                        this.closeAdminDialog();
                        this.fetchApplication();
                    });
            }
        },
        unarchiveChannel() {
            if (this.activeChannel) {
                let params = {
                    is_active: true,
                };

                this.inProgress = true;
                CompanyService.adminActionApplication(
                    this.companyId,
                    this.activeChannel.id,
                    params
                )
                    .then((res) => {
                        this.inProgress = false;
                        this.closeAdminDialog();
                        this.fetchApplication();
                        this.$snackbar.global.showSuccess(
                            'Application unarchived successfully',
                            {
                                duration: 2000,
                            }
                        );
                        setTimeout(() => {}, 2000);
                    })
                    .catch((error) => {
                        console.error(error);
                        // console.log(error, 'error');
                        this.$snackbar.global.showError(
                            `${error.response.data.message}`,
                            {
                                duration: 2000,
                            }
                        );
                        this.closeAdminDialog();
                        this.fetchApplication();
                    });
            }
        },
        openAdminDialog(item,event) {
            event.stopPropagation();
            event.preventDefault();
            this.activeChannel = item;
            if (item && item.is_active) {
                this.archiveText = 'Archive';
            }
            if (item && !item.is_active) {
                this.archiveText = 'Unarchive';
            }

            this.$refs['channel_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
            });
        },
        closeAdminDialog() {
            this.$refs['channel_dialog'].close();
        },
        redirectToDetails(item) {
            let appId = item.id;
            if(appId)
            {
            this.$router.push({ path: `/administrator/company-details/${this.companyId}/application/${appId}` });
            }
        }
    },
};
</script>