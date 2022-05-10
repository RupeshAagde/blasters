<template>
    <div>
        <div>
            <page-header
                :title="'Add Super User'"
                @backClick="redirectToListing"
            ></page-header>
        </div>
        <div class="main-container">
            <div class="search-heading">Search User</div>
            <div class="box-contain custom-space-ud">
                <div class="box-search">
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search"
                        type="text"
                        placeholder="Search by email, or number . . ."
                        v-model="searchText"
                        v-on:keyup.enter="searchUser"
                    ></nitrozen-input>
                </div>
                <div>
                    <nitrozen-button
                        @click="searchUser"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Search</nitrozen-button
                    >
                </div>
            </div>
            <div class="no-user custom-space-ud" v-if="noUserFound">
                {{ noUserFoundText }}
            </div>
            <div class="no-user custom-space-ud" v-if="enterValidText">
                {{ enterValidTextValue }}
            </div>
            <div
                v-if="
                    !enterValidText &&
                        !noUserFound &&
                        userList &&
                        userList.length > 0
                "
            >
                <div
                    class="container"
                    v-for="(user, index) in userList"
                    :key="index"
                >
                    <div class="card-avatar">
                        <img
                            :src="getUserProfile(user)"
                            alt="profile"
                            @error="$set(user, 'profile_pic', default_img)"
                        />
                    </div>
                    <div class="card-content-section">
                        <div class="full-name">
                            {{ user.firstName }}&nbsp;{{ user.lastName }}
                        </div>
                        <div class="card-content-line-2">
                            {{ user.accountType }}
                        </div>
                        <div class="card-content-line-2">
                            <span
                                v-if="
                                    user.phoneNumbers &&
                                        user.phoneNumbers.length > 0
                                "
                            >
                                +{{ user.phoneNumbers[0].countryCode }}&nbsp;{{
                                    user.phoneNumbers[0].phone
                                }}
                            </span>
                            <adm-inline-svg
                                v-if="
                                    user.phoneNumber &&
                                    user.phoneNumber.length > 0
                                        ? user.phoneNumbers[0].verified
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
                    <div class="cust-button" v-if="!exist">
                        <nitrozen-button
                            @click="openAddDialog(user)"
                            v-strokeBtn
                            :theme="'secondary'"
                            >Add as Super User</nitrozen-button
                        >
                    </div>
                    <div class="cust-button" v-if="exist">
                        <nitrozen-badge :state="'info'"
                            >Already a Super User</nitrozen-badge
                        >
                    </div>
                </div>
            </div>
        </div>
        <edit-permissions
            ref="edit-permission"
            v-if="activeUser"
            :active_user="activeUser"
            @close="addUser"
        ></edit-permissions>
    </div>
</template>

<style lang="less" scoped>
.custom-space-ud {
    margin: 24px 0;
}
.text-margin {
    margin-bottom: 48px;
}
.left-marg {
    margin-left: 12px;
}
.cust-button {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.main-container {
    background-color: white;
    width: 80%;
    margin: 85px auto 24px auto !important;
    padding: 24px;

    .search-heading {
        font-size: 20px;
        font-weight: 600;
        color: #41434c;
        margin-bottom: 24px;
    }

    .box-contain {
        display: flex;
        justify-content: space-between;
        align-content: center;
        .box-search {
            width: 75%;
        }
    }
    .no-user {
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 16px;
        font-weight: 700;
        align-items: center;
        opacity: 0.5;
        padding: 6px 0;
        height: 40px;
        color: #41434c;
        background-color: #f3f3f3;
    }
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
import PageHeader from '@/components/common/layout/page-header';
import Shimmer from '@/components/common/shimmer';
import admInlineSVG from '@/components/common/adm-inline-svg';
import { validatePhone, validateEmail } from '../../helper/utils';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';

import editPermissions from './edit-permission-modal.vue';
import _ from 'lodash';

const DEFAULT_IMG = '/public/assets/admin/pngs/default-profile.png';

export default {
    name: 'add-super-user',
    components: {
        PageHeader,
        Shimmer,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-input': NitrozenInput,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        NitrozenButton,
        NitrozenDropdown,
        'edit-permissions': editPermissions
    },
    data() {
        return {
            searchText: '',
            noUserFound: false,
            noUserFoundText: 'No user found . . .',
            userList: [],
            newUserList: [],
            registeredUserList: [],
            current: 1,
            activeUser: null,
            userPermissions: {
                permissions: [],
                roles: ['custom'],
                access: {
                    all: true,
                    company: []
                }
            },
            limit: 1000,
            exist: false,
            pageLoading: false,
            enterValidText: false,
            enterValidTextValue: 'Please enter valid number or email . . .',
            userId: null
        };
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    computed: {
        default_img() {
            return DEFAULT_IMG;
        }
    },
    methods: {
        redirectToListing() {
            this.$router.push({ path: '/administrator/user-management' });
        },
        getUserProfile(user) {
            let profilePic = DEFAULT_IMG;
            return user.profile_pic || profilePic;
        },
        requestQuery() {
            const query = {
                page: this.current,
                limit: this.limit
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
                    this.registeredUserList = data.docs;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getFullName() {
            return this.activeUser.firstName + ' ' + this.activeUser.lastName;
        },
        addUser(clickBtn, userData) {
            if (clickBtn === 'Add' && userData) {
                userData = {
                    title: 'Super Admin',
                    meta: {},
                    user: userData._id,
                    permissions: userData.permissions,
                    roles: userData.roles,
                    access: userData.access
                };
                return UserService.addUser(userData)
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            'User Added Successfully as Super User',
                            {
                                duration: 2000
                            }
                        );
                        this.$router.push({
                            path: '/administrator/user-management'
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$snackbar.global.showError(
                            `${error.response ? error.response.message : ''}`,
                            {
                                duration: 2000
                            }
                        );
                    });
            }
        },
        openAddDialog(user) {
            this.activeUser = _.merge(user, this.userPermissions);
            this.$nextTick(() => {
                this.$refs['edit-permission'].open();
            });
        },
        checkExist() {
            if (this.userList && this.userList.length > 0) {
                // this.fetchUsers();
                return UserService.getUserList(this.requestQuery())
                    .then(({ data }) => {
                        if (data.docs && data.docs.length > 0) {
                            this.registeredUserList = data.docs;

                            this.newUserList = this.userList.filter((element) =>
                                this.registeredUserList.some(
                                    (item) => element._id == item._id
                                )
                            );
                            if (
                                this.newUserList &&
                                this.newUserList.length > 0
                            ) {
                                this.exist = true;
                                this.userList == this.newUserList;
                            } else {
                                this.exist = false;
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        searchUser() {
            if (this.searchText && this.searchText != '') {
                let validPhone = validatePhone(this.searchText);
                let validEmail = validateEmail(this.searchText);
                if (validPhone) {
                    let params = {
                        query: this.searchText
                    };
                    this.noUserFound = false;
                    this.pageLoading = true;
                    return UserService.searchGrimlockUser(params)
                        .then((res) => {
                            this.enterValidText = false;
                            this.noUserFound = false;
                            if (res.data.length > 0) {
                                this.userList = res.data;
                                this.userId = res.data[0]._id;
                                this.checkExist();
                            } else {
                                this.noUserFound = true;
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
                            this.noUserFound = true;
                            this.enterValidText = false;
                        }).finally(()=>{
                            this.userId = null;
                            this.pageLoading = false;
                        });
                } else {
                    if (validEmail) {
                        let params = {
                            query: this.searchText
                        };
                        this.noUserFound = false;
                        this.pageLoading = true;
                        return UserService.searchGrimlockUser(params)
                            .then((res) => {
                                this.enterValidText = false;
                                this.noUserFound = false;
                                if (res.data.length > 0) {
                                    this.userList = res.data;
                                    if (
                                        this.userList &&
                                        this.userList.length > 0
                                    ) {
                                        this.userId = res.data[0]._id;
                                        this.checkExist();
                                    }
                                } else {
                                    this.noUserFound = true;
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
                                this.noUserFound = true;
                                this.enterValidText = false;
                            }).finally(()=>{
                                this.userId = null;
                                this.pageLoading = false;
                            });
                    } else {
                        this.enterValidText = true;
                    }
                }
            } else {
                this.enterValidText = true;
            }
        }
    }
};
</script>
