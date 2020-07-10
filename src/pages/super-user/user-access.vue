<template>
    <div class="main-container">
        <div>
            <adm-jumbotron
                :title="'User Management'"
                btnLabel="Add User"
                illustration="team"
                @btnClick="addUser"
            ></adm-jumbotron>
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
                <template v-else>
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search"
                        type="search"
                        placeholder="Search by name, email, or number..."
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
                </template>
            </div>
            <div class="product-list">
                <adm-shimmer
                    v-if="pageLoading && !pageError"
                    :count="4"
                ></adm-shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="fetchUsers"
                ></page-error>
                <div v-else-if="userList && userList.length">
                    <!-- new cards -->
                    <div
                        v-for="(user, index) in userList"
                        :key="index"
                        class="container"
                    >
                        <div class="card-avatar">
                            <img
                                :src="getUserProfile(user)"
                                @error="getErrorImage(user)"
                                alt="profile"
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
                                    >+{{
                                        user.phone_numbers[0].countryCode
                                    }}&nbsp;{{
                                        user.phone_numbers[0].phone
                                    }}</span
                                >
                                <adm-inline-svg
                                    v-if="
                                        user.phone_numbers[0].verified || false
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
                                    v-if="user.emails[0].verified || false"
                                    class="verified-icon left-space-s"
                                    :src="'check-circle'"
                                    title="Verified"
                                ></adm-inline-svg>
                            </div>
                        </div>
                        <div class="cust-button">
                            <nitrozen-button
                                @click="openRemoveDialog(user)"
                                v-strokeBtn
                                :theme="'secondary'"
                                >Remove</nitrozen-button
                            >
                        </div>
                    </div>
                </div>
                <adm-no-content
                    v-else
                    :helperText="'No user found'"
                ></adm-no-content>
                <div class="pagination" v-if="userList && userList.length > 0">
                    <nitrozen-pagination
                        name="Users"
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
        font-family: Poppins;
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
            color: #5c6bdd;
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
import admjumbotron from '@/components/common/adm-jumbotron';
import { titleCase, debounce } from '@/helper/utils';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
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

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};

export default {
    name: 'user-management',
    components: {
        'adm-jumbotron': admjumbotron,
        'adm-no-content': admnocontent,
        'adm-shimmer': admshimmer,
        'adm-inline-svg': admInlineSVG,
        'page-error': pageerror,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-error': NitrozenError,
        NitrozenDropdown,
        NitrozenButton
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
            pageId: '',
            userList: null,
            searchText: '',
            isInitialLoad: false,
            activeUser: null
        };
    },
    mounted() {
        this.pageLoading = true;
        this.fetchUsers();
    },
    methods: {
        titleCase,
        populateFromURL() {
            const { search, pageId } = this.$route.query;
            if (search) this.searchText = search;
            if (pageId) this.pageId = pageId;
        },
        addUser() {
            this.$router.push({ path: '/administrator/add-user' });
        },
        requestQuery() {
            const query = {
                page: this.pagination.current,
                limit: this.pagination.limit
            };

            return query;
        },
        fetchUsers() {
            this.pageLoading = true;
            return UserService.getUserList(this.requestQuery())
                .then(({ data }) => {
                    this.userList = data.docs;
                    console.log(this.userList, 'USER');
                    // this.pagination.current = this.pagination.current + 1;=
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
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ name: this.searchText });
            }
            this.fetchCompany();
        }, 200),
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ search: undefined });
        },
        getUserProfile(user) {
            let profilePic = '/public/assets/admin/pngs/default-profile.png';
            return user.profile_pic || profilePic;
        },
        getErrorImage(user) {
            let image = '/public/assets/admin/pngs/default-profile.png';
            this.$set(user, 'profile_pic', image);
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
                        this.closeRemoveDialog();
                        this.fetchUsers();
                    });
            }
        },
        openRemoveDialog(user) {
            this.activeUser = user;
            this.$refs['user_remove_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeRemoveDialog() {
            this.$refs['user_remove_dialog'].close();
        }
    }
};
</script>
