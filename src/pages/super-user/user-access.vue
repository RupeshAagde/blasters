<template>
    <div class="main-container">
        <div class="custom-header">
            <jumbotron
                :title="'User Management'"
                btnLabel="Add User"
                :desc="'Manage user roles and permissions'"
                illustration="team"
                @btnClick="addUser"
            ></jumbotron>
        </div>
        <div class="second-container">
            <div
                class="search-box"
                v-if="
                    pageLoading ||
                        (searchText !== '' || (userList && userList.length > 0))
                "
            >
                <div
                    v-if="pageLoading && isInitialLoad && !pageError"
                    class="input-shimmer shimmer"
                ></div>
                <!-- <template v-else> -->
                <nitrozen-input
                    :showSearchIcon="true"
                    class="search"
                    type="search"
                    placeholder="Search email or number"
                    v-model="searchText"
                    @input="debounceInput({ search: searchText })"
                ></nitrozen-input>
                <!-- <div class="filter">
                        <label class="label">Filter</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            :items="filters"
                            v-model="selectedFilter"
                            @change="fetchCompany()"
                        ></nitrozen-dropdown>
                </div>-->
                <!-- </template> -->
            </div>
            <div class="product-list">
                <shimmer v-if="pageLoading && !pageError" :count="4"></shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="fetchUsers"
                ></page-error>
                <div v-else-if="userList && userList.length">
                    <!-- new cards -->
                    <div
                        v-for="(user, index) in userList"
                        :key="index"
                        class="container pointer"
                        @click="editUserPermissions(user)"
                    >
                        <div class="card-avatar">
                            <img
                                :src="getUserProfile(user)"
                                alt="profile"
                                @error="$set(user, 'profile_pic', default_img)"
                            />
                        </div>
                        <div class="card-content-section">
                            <div class="card-content-line-1 full-name">
                                {{ user.first_name }}&nbsp;{{ user.last_name }}
                            </div>
                            <div class="card-content-line-2">
                                {{ user.title }}
                            </div>
                            <div class="card-content-line-2">
                                <span
                                    v-if="
                                        user.phone_numbers &&
                                            user.phone_numbers.length > 0
                                    "
                                >
                                    +{{
                                        user.phone_numbers[0].countryCode
                                    }}&nbsp;{{ user.phone_numbers[0].phone }}
                                </span>
                                <adm-inline-svg
                                    v-if="
                                        user.phone_numbers &&
                                        user.phone_numbers.length > 0
                                            ? user.phone_numbers[0].verified
                                            : false
                                    "
                                    class="inline-svg verified-icon left-space-s"
                                    :src="'check-circle'"
                                    title="Verified"
                                ></adm-inline-svg>
                                <span
                                    v-if="user.emails && user.emails.length > 0"
                                    class="left-space-md"
                                    >{{ user.emails[0].email }}</span
                                >
                                <adm-inline-svg
                                    v-if="
                                        user.emails && user.emails.length > 0
                                            ? user.emails[0].verified
                                            : false
                                    "
                                    class="verified-icon left-space-s"
                                    :src="'check-circle'"
                                    title="Verified"
                                ></adm-inline-svg>
                            </div>
                        </div>
                        <div class="cust-button">
                            <nitrozen-button
                                @click="openRemoveDialog(user, $event)"
                                v-strokeBtn
                                :theme="'secondary'"
                                >Remove</nitrozen-button
                            >
                        </div>
                    </div>
                </div>
                <page-empty v-else :text="'No User Found'"></page-empty>
                <div class="pagination" v-if="userList && userList.length > 0">
                    <nitrozen-pagination
                        name="Super Admins"
                        v-model="pagination"
                        @change="paginationChange"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            class="remove_staff_dialog"
            ref="user_remove_dialog"
            :title="activeUser ? getFullName() : 'User'"
        >
            <template slot="body" class="desc-dialog" v-if="activeUser">
                <div class="text-margin">
                    Are you sure you want to remove
                    {{ activeUser.first_name }}&nbsp;{{ activeUser.last_name }}?
                </div>
            </template>
            <template slot="footer">
                <nitrozen-button
                    @click="removeUser"
                    v-flatBtn
                    :theme="'secondary'"
                    >Remove</nitrozen-button
                >
                <div class="left-marg">
                    <nitrozen-button
                        @click="closeRemoveDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
        <edit-permissions
            ref="edit-permission"
            v-if="activeUser"
            :edit_mode="true"
            :active_user="activeUser"
            @close="closePermissions"
        >
        </edit-permissions>
    </div>
</template>

<style lang="less" scoped>
.input-shimmer {
    height: 60px;
    width: 400px;
}
.main-container {
    width: 100%;
    background-color: white;
    margin: 24px;
    padding: 24px;
    padding-bottom: 0;
}
.text-margin {
    margin-bottom: 48px;
}
.left-marg {
    margin-left: 12px;
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
.pointer {
    cursor: pointer;
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
        font-family: Inter;
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
.second-container {
    margin: 24px 0px;
}

.cust-inp {
    margin-bottom: 24px;
}
.cust-button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.container {
    border: 1px solid #e4e5e6;
    height: 70px;
    display: flex;
    overflow: visible;
    max-height: 70px;
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
        align-self: center;
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

        .full-name {
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
            color: #2E31BE;
        }

        .card-content-line-2 {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }

        .verified-icon {
            display: inline;
            ::v-deep svg {
                cursor: pointer;
                width: 6px;
                height: 6px;
            }
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
        }
    }
}
</style>

<script>
import UserService from '@/services/user-access.service';
import Jumbotron from '@/components/common/jumbotron';
import {
    debounce,
    validateEmail,
    validatePhone
} from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import fynotfound from '@/components/common/ukt-not-found';
import admInlineSVG from '@/components/common/adm-inline-svg';
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

import editPermissionsModal from './edit-permission-modal.vue';
import { VALIDATE_USER } from '../../store/action.type';
import { GET_USER_PERMISSIONS } from '../../store/getters.type';
import { mapGetters } from 'vuex';

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};

const DEFAULT_IMAGE = '/public/assets/admin/pngs/default-profile.png';

export default {
    name: 'user-management',
    components: {
        PageEmpty,
        Shimmer,
        'adm-inline-svg': admInlineSVG,
        'page-error': pageerror,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        NitrozenDropdown,
        NitrozenButton,
        Jumbotron,
        'edit-permissions': editPermissionsModal
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            pagination: { ...PAGINATION },
            userList: null,
            userId: '',
            searchText: '',
            isInitialLoad: false,
            activeUser: null
        };
    },
    computed: {
        ...mapGetters({
            currentUserPermission: GET_USER_PERMISSIONS
        }),
        default_img() {
            return DEFAULT_IMAGE;
        }
    },
    mounted() {
        this.pageLoading = true;
        this.fetchUsers();
    },
    methods: {
        addUser() {
            this.$router.push({ path: '/administrator/add-user' });
        },
        requestQuery() {
            const query = {
                page: this.pagination.current,
                limit: this.pagination.limit,
                org_users: "false"
            };
            if (this.userId) {
                query['query'] = JSON.stringify({
                    user: this.userId
                });
            }
            return query;
        },
        fetchUsers() {
            this.pageLoading = true;
            return UserService.getUserList(this.requestQuery())
                .then(({ data }) => {
                    this.userList = data.docs;
                    this.pagination.total = data.total;
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.log(err);
                });
        },
        debounceInput: debounce(function(e) {
            let searchUserId = '';
            if (
                validateEmail(this.searchText) ||
                validatePhone(this.searchText)
            ) {
                UserService.searchGrimlockUser({
                    query: this.searchText,
                    org_users: "false"
                })
                    .then(({ data }) => {
                        searchUserId = data[0] ? data[0]._id : null;
                        if (!data[0]) {
                            this.userId = null;
                            this.pagination.total = 0;
                            this.userList = [];
                        }
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Failed to search user'
                        );
                        console.log(err);
                    })
                    .finally(() => {
                        if (this.userId !== searchUserId) {
                            this.userId = searchUserId;
                            this.pagination.current = 1; 
                            this.fetchUsers();
                        }
                    });
            } else {
                searchUserId = '';
                if (this.userId !== searchUserId) {
                    this.userId = searchUserId;
                    this.fetchUsers();
                }
            }
        }, 200),
        clearSearchFilter() {
            this.searchText = '';
            // this.setRouteQuery({ search: undefined });
        },
        getUserProfile(user) {
            let profilePic = DEFAULT_IMAGE;
            return user.profile_pic || profilePic;
        },
        getFullName() {
            return this.activeUser.first_name + ' ' + this.activeUser.last_name;
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);

            // let pageQuery = { pageId: current, limit };
            // this.setRouteQuery(pageQuery);

            this.fetchUsers();
        },
        removeUser() {
            if (this.activeUser) {
                this.pageLoading = true;
                let uid = this.activeUser._id;
                return UserService.deleteUser(uid)
                    .then((res) => {
                        this.pageLoading = false;
                        this.closeRemoveDialog();
                        this.fetchUsers();
                        this.$snackbar.global.showSuccess(
                            'User Removed Successfully',
                            {
                                duration: 2000
                            }
                        );
                        if (this.currentUserPermission.user === uid) {
                            this.$store.dispatch(VALIDATE_USER);
                            this.$router.push({ path: '/' });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
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
                        this.closeRemoveDialog();
                        this.fetchUsers();
                    });
            }
        },
        openRemoveDialog(user, evt) {
            evt.stopPropagation();
            this.activeUser = user;
            this.$refs['user_remove_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeRemoveDialog() {
            this.$refs['user_remove_dialog'].close();
        },
        editUserPermissions(user) {
            this.activeUser = user;
            this.$nextTick(() => {
                this.$refs['edit-permission'].open();
            });
        },
        closePermissions(clickedBtn, userData) {
            if (clickedBtn === 'Update') {
                let userId = this.activeUser._id;
                UserService.updateUser(this.activeUser._id, userData)
                    .then(() => {
                        this.fetchUsers();
                        this.$snackbar.global.showSuccess(
                            'Successfully updated user data'
                        );
                        if (this.currentUserPermission.user === userId) {
                            this.$store.dispatch(VALIDATE_USER);
                        }
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Failed to update user data'
                        );
                        console.log(err);
                    });
            }
            this.activeUser = null;
        }
    }
};
</script>
