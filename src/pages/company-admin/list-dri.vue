<template>
    <div class="stores">
        <div class="stores-header">
            <label class="bold-xs cl-Mako">DRI ({{ pagination.total }})</label>
            <nitrozen-button :theme="'secondary'" @click="openAdd"
                >+ Add new</nitrozen-button
            >
        </div>
        <div class="search-store">
            <nitrozen-input
                :showSearchIcon="true"
                placeholder="Search user"
                class="search"
                @input="searchUsers()"
                v-model="searchText"
                type="search"
            ></nitrozen-input>
        </div>
        <shimmer v-if="inProgress && !pageError" :count="4"></shimmer>
        <div v-else-if="!inProgress && driList && driList.length">
            <div
                class="container"
                v-for="(item, index) in driList"
                :key="index"
                :title="item.firstName"
            >
                <div class="card-avatar">
                    <img
                        :src="'/public/assets/admin/pngs/default-profile.png'"
                        alt="profile"
                    />
                </div>
                <div class="card-content-section">
                    <div class="cust-align">
                        <div class="full-name" v-if="item.contact_details">
                            {{ item.contact_details.firstName }}
                            {{ item.contact_details.lastName }}
                        </div>
                        <div class="cust-button">
                            <span v-if="item.status" class="space-top-enabled">
                                <label>
                                    <span>Enabled</span>
                                    <nitrozen-toggle-btn
                                        v-model="item.status"
                                        @change="togChange(item)"
                                        :title="
                                            item.isActive
                                                ? 'Disable User'
                                                : 'Enable User'
                                        "
                                    ></nitrozen-toggle-btn>
                                </label>
                            </span>
                            <span v-if="!item.status" class="space-top-disable">
                                <label>
                                    <span>Disabled</span>
                                    <nitrozen-toggle-btn
                                        v-model="item.status"
                                        @change="togChange(item)"
                                        :title="
                                            item.isActive
                                                ? 'Disable User'
                                                : 'Enable User'
                                        "
                                    ></nitrozen-toggle-btn>
                                </label>
                            </span>
                            <span
                                @click="openEdit(item.uid)"
                                class="cust-cursor"
                            >
                                <adm-inline-svg
                                    class="left-space-s inline-svg"
                                    :src="'edit'"
                                    title="Edit"
                                ></adm-inline-svg>
                            </span>
                        </div>
                    </div>
                    <div
                        class="card-content-line-2"
                        v-if="item.contact_details"
                    >
                        <span
                            v-if="
                                item.contact_details.phoneNumbers &&
                                    item.contact_details.phoneNumbers.length > 0
                            "
                        >
                            +{{
                                item.contact_details.phoneNumbers[0]
                                    .countryCode
                            }}-{{ item.contact_details.phoneNumbers[0].phone }}
                        </span>
                        <span class="left-space seperator">|</span>
                        <span
                            class="left-space"
                            v-if="
                                item.contact_details.emails &&
                                    item.contact_details.emails.length > 0
                            "
                            >{{ item.contact_details.emails[0].email }}</span
                        >
                    </div>
                    <div
                        v-if="item.responsibilities_display_name"
                        class="card-content-line-3"
                    >
                        <div class="head-badge">Responsibilities</div>
                        <div
                            v-for="(element,
                            i) in item.responsibilities_display_name"
                            :key="i"
                        >
                            <nitrozen-badge
                                class="right-space cust-badge"
                                :state="'success'"
                                >{{ element }}</nitrozen-badge
                            >
                        </div>
                    </div>
                    <div
                        class="card-content-line-4"
                        v-if="item.tags && item.tags.length > 0"
                    >
                        <div class="head-badge">Tags</div>
                        <span
                            v-for="(tag, i) in item.tags"
                            :key="i"
                            class="right-space-md"
                        >
                            <nitrozen-badge
                                class="right-space cust-badge"
                                :state="'info'"
                                >{{ tag }}</nitrozen-badge
                            >
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination-div" v-if="driList.length > 0">
            <nitrozen-pagination
                name="Users"
                v-model="pagination"
                @change="paginationChange"
                :pageSizeOptions="[1, 5, 10, 20, 50]"
            ></nitrozen-pagination>
        </div>
        <page-error v-if="pageError" @tryAgain="fetchDri"></page-error>
        <page-empty
            v-if="!pageError && !inProgress && !driList.length"
            :helperText="'No User Found'"
        ></page-empty>
    </div>
</template>
<style lang="less" scoped>
.space-top-disable {
    display: flex;
    justify-content: flex-start;

    label {
        color: #9b9b9b;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }
}
.space-top-enabled {
    display: flex;
    justify-content: flex-start;

    label {
        color: #5c6bdd;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 600;
    }
}
.cust-sent {
    margin-bottom: 24px;
}
.delete-icon {
    display: inline;
    ::v-deep svg {
        cursor: pointer;
        width: 24px;
        height: 24px;
        filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)
            brightness(104%) contrast(97%);
    }
}
.cust-cursor {
    cursor: pointer;
    margin-top: -6px;
}
.cust-align {
    display: flex;
    justify-content: space-between;
}
.left-space {
    margin-left: 6px;
}
.right-space {
    margin-right: 6px;
}
::v-deep .page-error {
    img {
        width: 300px !important;
        height: 250px !important;
    }
}
.input-shimmer {
    height: 55px;
    width: 400px;
}
.stores {
    .stores-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        .bold-xs {
            font-size: 18px;
        }
    }
    .search-store {
        // width: 400px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        width: 400px;
        .search {
            width: 100%;
            margin-right: 12px;
        }
        .filter-dropdown {
            display: flex;
            .stage-dropdown {
                margin-right: 12px;
            }
        }
    }
    .stores-body {
        .stores-div {
            box-sizing: border-box;
            border: 1px solid @Iron;
            border-radius: 4px;
            background-color: @White;
            padding: 24px;
            margin-bottom: 24px;

            &:hover {
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            .store-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .store-name {
                    color: @Mako;
                    font-size: 14px;
                }
            }
        }
    }
    .pagination-div {
        margin-bottom: 24px;
    }
}
.container {
    border: 1px solid #e4e5e6;
    display: flex;
    overflow: visible;
    padding: 24px;
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

    .card-avatar {
        display: flex;
        align-items: center;
        margin-right: 24px;
        width: 60px;
        height: 60px;
        // align-self: center;
        border-radius: 50%;
        border: 1px solid #e4e5e6;
        img {
            min-height: 60px;
            max-height: 60px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 50%;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        // width: 72%;

        .full-name {
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
            color: #41434c;
        }

        .card-content-line-2 {
            color: #9b9b9b;
            margin: 6px 0;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }
        .card-content-line-3 {
            line-height: 22px;
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 6px;
        }
        .card-content-line-4 {
            font-size: 12px;
            font-weight: 500;
            line-height: 22px;
            display: flex;
            flex-wrap: wrap;
        }
        .head-badge {
            display: flex;
            width: 100%;
            color: #9b9b9b;
            margin-bottom: 3px;
        }
        .cust-badge {
            margin-bottom: 6px;
        }

        .verified-icon {
            display: inline;
            ::v-deep svg {
                cursor: pointer;
                width: 6px;
                height: 6px;
            }
        }
        .right-space-md {
            margin-right: 6px;
        }
        .left-space-s {
            margin-left: 4px;
        }
        .left-space-md {
            margin-left: 12px;
        }
        .separator {
            width: 12px;
            text-align: center;
            color: #9b9b9b;
            line-height: 22px;
        }
    }
    .cust-button {
        display: flex;
        align-items: flex-start;
    }
}
</style>
<script>
import CompanyService from '@/services/company-admin.service';
import loader from '@/components/common/loader';
import dateFormat from 'dateformat';
import Shimmer from '@/components/common/shimmer';
import { debounce } from '@/helper/utils';
import PageEmpty from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import { getRoute } from '@/helper/get-route';
import admInlineSVG from '@/components/common/adm-inline-svg';

import {
    NitrozenButton,
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenBadge,
    NitrozenInput,
    NitrozenError,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'list-dri',
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
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSVG
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            companyId: this.$route.params.companyId,
            inProgress: false,
            pageError: false,
            pageLoading: false,
            isInitialLoad: true,
            activeUser: null,
            isActive: false,
            dataFinal: '',
            statusText: '',
            showText: '',
            searchText: '',
            pagination: {
                limit: 10,
                total: 0,
                current: 1
            },
            driList: [],
            mainList: []
        };
    },
    mounted() {
        this.fetchDri();
    },
    methods: {
        requestQuery() {
            let query = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
                company_id: this.companyId
            };
            return query;
        },
        fetchDri() {
            this.inProgress = true;
            this.pageError = false;
            CompanyService.fetchDri(this.requestQuery())
                .then((res) => {
                    this.inProgress = false;
                    this.pagination.total = res.data.total_count;
                    this.mainList = res.data.data;
                    this.driList = res.data.data;
                })
                .catch((error) => {
                    console.error(error);
                    this.inProgress = false;
                    this.pageError = true;
                });
        },
        searchUsers() {
            if (this.mainList && this.mainList.length > 0) {
                if (this.searchText != '') {
                    this.driList = this.mainList.filter((element) => {
                        return (
                            element.contact_details.firstName
                                .toLowerCase()
                                .includes(this.searchText.toLowerCase()) ||
                            element.contact_details.lastName
                                .toLowerCase()
                                .includes(this.searchText.toLowerCase())
                        );
                    });
                } else {
                    this.driList = this.mainList;
                }
            }
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            this.fetchDri();
        },
        setPage(filter) {
            const { current, limit } = filter;
            this.paginationConfig = {
                ...this.paginationConfig,
                current,
                limit
            };
            this.fetchDri();
        },
        openAdd() {
            this.$router.push({
                path: `/administrator/company-details/${this.companyId}/add-dri`
            });
        },
        openEdit(item) {
            if (item) {
                this.$router.push({
                    path: `/administrator/company-details/${this.companyId}/edit-dri/${item}`
                });
            }
        },
        togChange(item) {
            if (item) {
                if (item.status) {
                    this.showText = 'Activate';
                    this.isActive = true;
                    this.dataFinal = true;
                    this.activeUser = item;
                    this.removeUser();
                }
                if (!item.status) {
                    this.showText = 'Disable';
                    this.isActive = false;
                    this.dataFinal = false;
                    this.activeUser = item;
                    this.removeUser();
                }
            }
        },
        removeUser() {
            if (this.activeUser) {
                const postData = {
                    company_id: this.companyId,
                    contact: this.activeUser.contact
                        ? this.activeUser.contact
                        : '',
                    tags: this.activeUser.tags ? this.activeUser.tags : [],
                    responsibilities: this.activeUser.responsibilities
                        ? this.activeUser.responsibilities
                        : [],
                    uid: this.activeUser.uid ? this.activeUser.uid : ''
                };
                postData.status = this.dataFinal;
                this.inProgress = true;
                CompanyService.createDri(postData)
                    .then((res) => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            this.isActive
                                ? 'DRI activated successfully'
                                : 'DRI disabled successfully',
                            {
                                duration: 2000
                            }
                        );
                        setTimeout(() => {}, 2000);
                        this.fetchDri();
                    })
                    .catch((error) => {
                        this.inProgress = false;
                        console.error(error);
                        this.$snackbar.global.showError(
                            `${error.response.data.message}`
                        );
                        this.fetchDri();
                    });
            }
        }
    }
};
</script>
