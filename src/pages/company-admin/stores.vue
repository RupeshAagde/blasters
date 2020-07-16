<template>
    <div class="stores">
        <div class="stores-header">
            <label class="bold-xs cl-Mako"
                >Selling Locations ({{ paginationConfig.total }})</label
            >
        </div>
        <div class="search-store">
            <nitrozen-input
                placeholder="Search Stores"
                @input="searchStores"
                v-model="searchText"
                :showSearchIcon="true"
                type="search"
            ></nitrozen-input>
        </div>
        <div v-if="inProgress" class="shimmer"></div>

        <div
            class="stores-body"
            v-if="!inProgress && storesData && storesData.length"
        >
            <div
                class="stores-div"
                v-for="(item, index) in storesData"
                :key="index"
                :title="item.name"
            >
                <div class="store-header">
                    <div class="store-name">{{ item.name }}</div>
                    <div class="cust-badge">
                        <nitrozen-badge
                            :state="
                                item.stage == 'verified' ? 'success' : 'warn'
                            "
                        >
                            {{
                                item.stage == 'verified'
                                    ? 'verified'
                                    : 'unverified'
                            }}
                        </nitrozen-badge>
                        <div class="img-box" @click="editStore($event, item)">
                            <adm-inline-svg
                                class="verified-icon left-space-s"
                                :src="'edit'"
                                title="Edit"
                            ></adm-inline-svg>
                        </div>
                    </div>
                </div>
                <div class="store-address">{{ item.address.address1 }}</div>
                <div class="store-address-detail">
                    <div class="store-city" v-if="item.address.city">
                        <label class="n-input-label">City</label>
                        <div class="store-address-name">
                            {{ item.address.city }}
                        </div>
                    </div>
                    <div class="store-pincode" v-if="item.address.pincode">
                        <label class="n-input-label">Pincode</label>
                        <div class="store-address-name">
                            {{ item.address.pincode }}
                        </div>
                    </div>
                    <div class="store-state" v-if="item.address.state">
                        <label class="n-input-label">State</label>
                        <div class="store-address-name">
                            {{ item.address.state }}
                        </div>
                    </div>
                    <div class="store-country" v-if="item.address.country">
                        <label class="n-input-label">Country</label>
                        <div class="store-address-name">
                            {{ item.address.country }}
                        </div>
                    </div>
                </div>
                <div class="bottom-card-button">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        v-if="item.stage != 'verified'"
                        @click="openAdminDialog(item)"
                        >Verify</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        v-if="item.stage == 'verified'"
                        @click="editIntegration(item)"
                        >Edit Integration</nitrozen-button
                    >
                    <nitrozen-button
                        class="left-space"
                        :theme="'secondary'"
                        v-strokeBtn
                        v-if="item.stage == 'verified'"
                        @click="openAdminDialog(item)"
                        >Disable</nitrozen-button
                    >
                </div>
            </div>
        </div>
        <div
            class="pagination-div"
            v-if="paginationConfig.limit < paginationConfig.total"
        >
            <nitrozen-pagination
                name="Stores"
                v-model="paginationConfig"
                @change="paginationChange"
                :pageSizeOptions="[5, 10, 20, 50]"
            ></nitrozen-pagination>
        </div>
        <page-error v-if="pageError" @tryAgain="getStores"></page-error>
        <adm-no-content
            v-if="!pageError && !inProgress && !storesData.length"
            :helperText="'No Stores Found'"
        ></adm-no-content>
        <nitrozen-dialog
            class="remove_staff_dialog"
            ref="store_admin_dialog"
            :title="activeStore ? activeStore.name : 'Company Store'"
        >
            <template slot="body" class="desc-dialog">
                <div>
                    <label class="cust-label">Address</label>
                    <div
                        class="cust-inp"
                        v-if="activeStore && activeStore.address"
                    >
                        {{ activeStore.address.address1 }},&nbsp;{{
                            activeStore.address.city
                        }}
                    </div>
                    <div class="cust-drop">
                        <div class="left-drop">
                            <label class="cust-label">Order Integration*</label>
                            <nitrozen-dropdown
                                label="Order Integration*"
                                placeholder="Choose order integration type"
                                :items="integrationType"
                                v-model="order_choice"
                                @change="changeDropDown"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="order_choice_error.showerror">
                                {{ order_choice_error.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="right-drop">
                            <label class="cust-label"
                                >Inventory Integration*</label
                            >
                            <nitrozen-dropdown
                                label="Inventory Integration*"
                                placeholder="Choose inventory integration type"
                                :items="integrationType"
                                v-model="inventory_choice"
                                @change="changeDropDown"
                            ></nitrozen-dropdown>
                            <nitrozen-error
                                v-if="inventory_choice_error.showerror"
                            >
                                {{ inventory_choice_error.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                    <nitrozen-input
                        class="cust-margin"
                        type="textarea"
                        label="Reason*"
                        placeholder="Explain reason properly..."
                        v-if="!show_verify_button"
                        v-model="rejection_info.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="cust-margin"
                        v-if="rejection_info.showError"
                        >{{ rejection_info.errortext }}</nitrozen-error
                    >
                </div>
                <div class="cust-sent">
                    Are you sure you want to {{ admin_action_text }} this store?
                </div>
            </template>
            <template slot="footer">
                <div>
                    <nitrozen-button
                        v-if="show_verify_button"
                        class="mr24"
                        @click="verifyStore"
                        v-flatBtn
                        :theme="'secondary'"
                        >{{
                            editIntegration ? 'Update' : 'Verify'
                        }}</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="!show_verify_button"
                        class="mr24"
                        @click="rejectStore"
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

.cust-inp {
    margin-bottom: 24px;
}
.bottom-card-button {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
}
.cust-margin {
    margin-bottom: 6px;
}
.cust-sent {
    margin-top: 18px;
    margin-bottom: 24px;
}
.left-space {
    margin-left: 24px;
}
.cust-label {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.cust-drop {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24px;
    overflow: visible;

    .left-drop {
        width: 47%;
        margin-right: 12px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        ::v-deep .nitrozen-dropdown-container {
            width: 100%;
        }

        ::v-deep .nitrozen-select-wrapper {
            width: 100%;
        }
    }
    .right-drop {
        width: 49%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 12px;

        ::v-deep .nitrozen-dropdown-container {
            width: 100%;
        }
        ::v-deep .nitrozen-select-wrapper {
            width: 100%;
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
            width: 250px;
            .filter-dropdown {
                margin-right: 24px;
            }
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
        width: 400px;
        margin-bottom: 24px;
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
            .store-address {
                color: @Mako;
                font-size: 14px;
                margin-top: 12px;
                line-height: 20px;
            }
            .store-address-detail {
                display: flex;
                justify-content: space-between;
                margin-top: 12px;
                .store-address-name {
                    color: @Mako;
                    font-size: 14px;
                    margin-top: 12px;
                }
            }
        }
    }
    .pagination-div {
        margin-bottom: 24px;
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 120px;
    margin-bottom: 24px;
}
.cust-badge {
    display: flex;
    justify-content: flex-end;

    .img-box {
        margin-left: 12px;
        ::v-deep svg {
            color: #5c6bdd;
        }
    }

    .pic-col {
        color: #5c6bdd;
    }
}
</style>

<script>
import CompanyService from '@/services/company-admin.service';
import loader from '@/components/common/adm-loader';
import dateFormat from 'dateformat';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
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
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'adm-company-stores',
    components: {
        'adm-shimmer': admshimmer,
        'adm-no-content': admnocontent,
        'page-error': pageerror,
        loader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSVG
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        }
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
                limit: 10
            },
            selectedChoice: '',
            selectedStoreType: '',
            searchText: '',
            storesData: [],
            choiceType: [],
            storeType: [],
            integrationType: [],
            order_choice: null,
            inventory_choice: null,
            companyId: this.$route.params.companyId,
            activeStore: {},
            button_txt: 'Verify',
            rejection_info: {
                showError: false,
                errortext: 'Please explain reason properly.',
                value: ''
            },
            admin_action_text: '',
            show_verify_button: true,
            enableEditIntegration: false,
            order_choice_error: {
                showerror: false,
                errortext: 'Please select order integration type.'
            },
            inventory_choice_error: {
                showerror: false,
                errortext: 'Please select inventory integration type.'
            }
        };
    },
    filters: {
        dateFormatter: function(value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
        }
    },
    mounted() {
        this.getStores();
        this.getChoiceType({ choice_type: 'stage' });
        this.getChoiceType({ choice_type: 'store_type' });
    },
    methods: {
        getParams: function() {
            const params = {
                page_size:
                    this.$route.query.limit || this.paginationConfig.limit,
                page_no:
                    this.$route.query.current || this.paginationConfig.current,
                name: this.searchText
            };
            if (this.$route.query.stage) {
                this.selectedChoice = this.$route.query.stage;
                params.stage = this.selectedChoice;
            }

            if (this.$route.query.store) {
                this.selectedStoreType = this.$route.query.store;
                params.store = this.selectedStoreType;
            }

            if (this.$route.query.search) {
                this.$route.query.search = this.searchText;
                params.name = this.searchText;
            }
            return params;
        },
        getStores() {
            this.inProgress = true;
            this.pageError = false;
            let params = this.getParams();
            params.company = this.companyId;
            CompanyService.fetchStores(params)
                .then((res) => {
                    this.inProgress = false;
                    this.pageError = false;
                    this.storesData = res.data.data;
                    this.paginationConfig.total = res.data.total_count;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    this.inProgress = false;
                    console.log(err, 'error');
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        getChoiceType(params = {}) {
            CompanyService.fetchChoiceType(params)
                .then((res) => {
                    if (params.choice_type == 'stage') {
                        this.choiceType = res.data.data;
                        this.choiceType.map((ele) => {
                            ele.text = ele.value;
                            ele.value = ele.key;
                        });
                    } else if (params.choice_type == 'store_type') {
                        this.storeType = res.data.data;
                        this.storeType.map((ele) => {
                            ele.text = ele.value;
                            ele.value = ele.key;
                        });
                    } else if (params.choice_type == 'integration_type') {
                        this.integrationType = res.data.data;
                        // this.order_choice = res.data.data[0]['key'];
                        // this.inventory_choice = res.data.data[0]['key'];
                        this.integrationType.map((ele) => {
                            ele.text = ele.value;
                            ele.value = ele.key;
                        });
                    }
                })
                .catch((err) => {
                    console.log(err, 'error');
                });
        },
        searchStores: function() {
            let vm = this;
            let params = {
                page_no: 1,
                page_size: this.paginationConfig.limit,
                name: this.searchText
            };
            _.debounce(function() {
                vm.getStores(params);
            }, 1000)();
        },
        changeStage: function() {
            let params = {
                page_no: 1,
                page_size: this.paginationConfig.limit,
                name: this.searchText,
                stage: this.selectedChoice
            };
            this.getStores(params);
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
            this.getStores();
            // this.setRouteQuery({ current, limit });
        },
        editIntegration(item) {
            this.enableEditIntegration = true;
            this.openAdminDialog(item);
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
            this.getStores();
        },
        verifyStore() {
            if (this.order_choice && this.inventory_choice) {
                const obj = {
                    uid: this.activeStore.uid,
                    stage: 'verified',
                    integration_type: {
                        order: this.order_choice,
                        inventory: this.inventory_choice
                    }
                };
                CompanyService.adminActionStore(obj)
                    .then((res) => {
                        this.closeAdminDialog();
                        this.getStores();
                        this.$snackbar.global.showSuccess(
                            'Store Verified Successfully',
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
                                    ? JSON.stringify(error.response.data.errors)
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
                if (
                    this.order_choice_error.showerror == false &&
                    !this.order_choice
                ) {
                    this.order_choice_error.showerror = true;
                }
                if (
                    this.inventory_choice_error.showerror == false &&
                    !this.inventory_choice
                ) {
                    this.inventory_choice_error.showerror = true;
                }
            }
        },
        rejectStore() {
            if (
                this.rejection_info.value.length > 0 &&
                this.order_choice &&
                this.inventory_choice
            ) {
                const obj = {
                    uid: this.activeStore.uid,
                    reject_reason: this.rejection_info.value,
                    stage: 'rejected',
                    integration_type: {
                        order: this.order_choice,
                        inventory: this.inventory_choice
                    }
                };
                CompanyService.adminActionStore(obj)
                    .then((res) => {
                        this.closeAdminDialog();
                        this.rejection_info.value = '';
                        this.rejection_info.showError = false;
                        this.getStores();
                        this.$snackbar.global.showSuccess(
                            'Store Disabled Successfully',
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
                                    ? JSON.stringify(error.response.data.errors)
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
                if (this.rejection_info.showError == false) {
                    this.rejection_info.showError = true;
                }
                if (!this.order_choice) {
                    this.order_choice_error.showerror = true;
                }
                if (!this.inventory_choice) {
                    this.inventory_choice_error.showerror = true;
                }
            }
        },
        openAdminDialog(item) {
            this.activeStore = { ...item };
            this.rejection_info.showError = false;
            this.order_choice_error.showerror = false;
            this.inventory_choice_error.showerror = false;
            this.order_choice = null;
            this.inventory_choice = null;
            if (item.stage && item.stage == 'verified') {
                this.admin_action_text = 'disable';
                this.show_verify_button = false;
            } else {
                this.admin_action_text = 'verify';
                this.show_verify_button = true;
            }
            if (this.enableEditIntegration) {
                this.show_verify_button = true;
                this.admin_action_text = 'update integration of';
            }

            this.getChoiceType({ choice_type: 'integration_type' });
            if (item.integration_type) {
                this.order_choice = item.integration_type.order;
                this.inventory_choice = item.integration_type.inventory;
            }

            if (item.stage && item.stage != 'verified') {
                if (this.activeStore) {
                    this.$refs['store_admin_dialog'].open({
                        width: '600px',
                        height: '480px',
                        showCloseButton: true,
                        dismissible: true
                    });
                }
            } else {
                this.$refs['store_admin_dialog'].open({
                    width: '600px',
                    height: '480px',
                    showCloseButton: true,
                    dismissible: true
                });
            }
        },
        changeDropDown() {
            if (this.order_choice) {
                this.order_choice_error.showerror = false;
            }
            if (this.inventory_choice) {
                this.inventory_choice_error.showerror = false;
            }
        },
        closeAdminDialog() {
            this.enableEditIntegration = false;
            this.$refs['store_admin_dialog'].close();
        },
        editStore(event, item) {
            event.stopPropagation();
            window.open(
                `https://platform.${this.fyndPlatformDomain}/company/${this.companyId}/profile/edit-store/${item.uid}`
            );
        }
    }
};
</script>
