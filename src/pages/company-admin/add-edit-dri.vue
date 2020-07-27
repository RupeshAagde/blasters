<template>
    <div class="panel">
        <div class="page-header-position">
            <page-header :title="`${headerText} Contact`" @backClick="onCancel">
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="save"
                        :disabled="pageError || pageLoading"
                        v-flatBtn
                        >Save</nitrozen-button
                    >
                </div>
            </page-header>
        </div>
        <loader v-if="!pageError && pageLoading"></loader>
        <div class="main-container" v-if="!pageLoading && !pageError">
            <div class="page-container">
                <div class="row-1">
                    <div class="filter-dropdown">
                        <nitrozen-dropdown
                            label="Responsibilities*"
                            multiple="true"
                            placeholder="Choose responsibilities . . ."
                            :items="designationList"
                            v-model="selectedDesignation.value"
                            @change="checkDesignation"
                        ></nitrozen-dropdown>
                    </div>
                </div>
                <nitrozen-error
                    class="upper-space"
                    v-if="selectedDesignation.showError"
                    >{{ selectedDesignation.errortext }}</nitrozen-error
                >
                <div class="row-2">
                    <div class="cust-label">Tags</div>
                    <div
                        class="input-text tags"
                        @click="$refs.searchText.focus()"
                    >
                        <nitrozen-chips
                            v-for="(item, index) in searchTextArray"
                            :key="'searchText_' + index"
                        >
                            {{ item }}
                            <nitrozen-inline
                                :icon="'cross'"
                                class="nitrozen-icon"
                                v-on:click="removeSearchInput(index)"
                            ></nitrozen-inline>
                        </nitrozen-chips>
                        <input
                            type="text"
                            class="chip-input cl-Mako light-xs"
                            @keydown="getSearchText()"
                            @focusout="addSearchText()"
                            ref="searchText"
                            v-model="searchText.value"
                        />
                    </div>
                </div>
                <nitrozen-error class="bottom-space" v-if="tagMeta.showError">
                    {{ tagMeta.errortext }}
                </nitrozen-error>
                <div class="cust-label" v-if="!isAdded">Assign Contact*</div>
                <div class="cust-label" v-if="isAdded">Assigned Contact*</div>
                <div class="row-3" v-if="!isAdded">
                    <div class="box-search">
                        <nitrozen-input
                            :showSearchIcon="true"
                            class="search"
                            type="text"
                            placeholder="Search by email, or number . . ."
                            v-model="searchDri"
                            v-on:keyup.enter="searchUser"
                        ></nitrozen-input>
                    </div>
                    <div>
                        <nitrozen-button
                            v-strokeBtn
                            :theme="'secondary'"
                            @click="searchUser"
                            >Search</nitrozen-button
                        >
                    </div>
                </div>
                <div class="no-user custom-space-ud" v-if="userLoading">
                    <img src="/public/assets/loader.gif" />
                </div>
                <div class="no-user custom-space-ud" v-if="noUserFound">
                    {{ noUserFoundText }}
                </div>
                <div class="no-user custom-space-ud" v-if="enterValidText">
                    {{ enterValidTextValue }}
                </div>
                <div
                    class="cust-width"
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
                                :src="
                                    '/public/assets/admin/pngs/default-profile.png'
                                "
                                alt="profile"
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
                                    +{{
                                        user.phoneNumbers[0].countryCode
                                    }}&nbsp;{{ user.phoneNumbers[0].phone }}
                                </span>
                                <span class="seperator left-space-md">|</span>
                                <span
                                    v-if="user.emails && user.emails.length > 0"
                                    class="left-space-md"
                                    >{{ user.emails[0].email }}</span
                                >
                            </div>
                        </div>
                        <div class="cust-button" v-if="!update">
                            <nitrozen-button
                                @click="openAddDialog(user)"
                                v-if="!isAdded"
                                v-strokeBtn
                                :theme="'secondary'"
                                >Add</nitrozen-button
                            >
                            <nitrozen-button
                                @click="openRemoveDialog(user)"
                                v-if="isAdded"
                                v-strokeBtn
                                :theme="'secondary'"
                                >Remove</nitrozen-button
                            >
                        </div>
                        <!-- v-if="!exist" -->
                        <!-- <div class="cust-button" v-if="exist">
                            <nitrozen-badge :state="'info'">Already a Super User</nitrozen-badge>
                        </div>-->
                    </div>
                </div>
                <nitrozen-error
                    class="bottom-space"
                    v-if="userMeta.showError"
                    >{{ userMeta.errortext }}</nitrozen-error
                >
                <div class="cust-label" v-if="isAdded && !update">
                    Search Contact
                </div>
                <div class="row-3" v-if="isAdded && !update">
                    <div class="box-search">
                        <nitrozen-input
                            :showSearchIcon="true"
                            class="search"
                            type="text"
                            :disabled="isAdded"
                            placeholder="Search by email, or number . . ."
                            v-model="searchDri"
                            v-on:keyup.enter="searchUser"
                        ></nitrozen-input>
                    </div>
                    <div>
                        <nitrozen-button
                            v-strokeBtn
                            :disabled="isAdded"
                            :theme="'secondary'"
                            @click="searchUser"
                            >Search</nitrozen-button
                        >
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            ref="user_add_dialog"
            :title="
                activeUser
                    ? `${activeUser.firstName} ${activeUser.lastName}`
                    : 'Company DRI'
            "
        >
            <template slot="body" class="desc-dialog">
                <div class="cust-sent">
                    Are you sure you want to add this user?
                </div>
            </template>
            <template slot="footer">
                <div v-if="activeUser">
                    <nitrozen-button
                        class="mr24"
                        @click="addUser(activeUser)"
                        v-flatBtn
                        :theme="'secondary'"
                        >Add</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeAddDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
        <nitrozen-dialog
            ref="user_remove_dialog"
            :title="
                activeUser
                    ? `${activeUser.firstName} ${activeUser.lastName}`
                    : 'Company DRI'
            "
        >
            <template slot="body" class="desc-dialog">
                <div class="cust-sent">
                    Are you sure you want to remove this user?
                </div>
            </template>
            <template slot="footer">
                <div v-if="activeUser">
                    <nitrozen-button
                        class="mr24"
                        @click="removeUser(activeUser)"
                        v-flatBtn
                        :theme="'secondary'"
                        >Remove</nitrozen-button
                    >
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
@import './../less/page-header.less';
@import './../less/page-ui.less';
::v-deep .loader {
    display: flex;
    justify-content: center;
}
.cust-sent {
    margin-bottom: 24px;
}
.bottom-space {
    margin-top: -12px;
    margin-bottom: 24px;
}
.upper-space {
    margin-top: 6px;
}
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

.left-space {
    margin-left: 12px;
}
.cust-label {
    color: #9b9b9b;
    font-size: 12px;
    font-weight: 500;
    margin: 6px 0;
    align-items: center;
}
.cust-width {
    width: 100%;
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
            color: #9b9b9b;
        }
    }
}
.main-container {
    .page-container {
        width: 80%;
        margin: 0 auto 24px auto;
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
        .row-1 {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .row-2 {
            width: 100%;
            margin: 24px 0 0 0;
            .input-text {
                margin: 0px 10px 20px 2px;
                input {
                    padding: 8px 0px 5px 10px;
                    border-radius: @BorderRadius;
                }
            }
            .tags {
                min-height: 100px;
                width: 97%;
                cursor: text;
                .chip-input {
                    border: none !important;
                    &:focus {
                        outline: none;
                    }
                }
            }
        }
        .row-3 {
            width: 100%;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-content: center;
            .box-search {
                width: 75%;
            }
        }
        .filter-dropdown {
            width: 100%;
        }
        section {
            width: 100%;
            color: @Mako;
            .title {
                font-size: 18px;
                font-weight: bold;
                line-height: 35px;
                margin-bottom: 8px;
            }
            .subtitle {
                font-size: 16px;
                line-height: 26px;
            }
            .input-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 20px 0;
                > div {
                    flex: 1;
                    margin-left: 12px;
                }
                > div:first-child {
                    margin-left: 0;
                }
                ::v-deep .n-input-textarea {
                    resize: vertical;
                    max-height: 100px;
                    min-height: 60px;
                }
                .how-to {
                    // padding: 4px;
                    a {
                        font-size: 12px;
                        line-height: 16px;
                        color: @RoyalBlue;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
        .tos {
            color: @RoyalBlue;
            &:hover {
                text-decoration: underline;
            }
        }
        .same-address {
            margin-bottom: 24px;
        }
        .input-text {
            border: 1px solid @Iron;
            padding: 12px;
            min-height: 70px;
            border-radius: @BorderRadius;
            cursor: text;
            .chip-input {
                border: none;
            }
        }
    }
}
</style>
<script>
import CompanyService from '@/services/company-admin.service';
import loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import admInlineSVG from '@/components/common/adm-inline-svg';
import PageHeader from '@/components/common/layout/page-header';

import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenBadge,
    NitrozenInput,
    NitrozenError,
    NitrozenCheckBox,
    NitrozenInline,
    NitrozenChips,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'add-edit-dri',
    components: {
        Shimmer,
        PageEmpty,
        'page-error': pageerror,
        loader,
        PageHeader,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-chips': NitrozenChips
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            headerText: 'Create',
            saveText: 'DRI created successfully',
            pageError: false,
            pageLoading: false,
            companyId: this.$route.params.companyId,
            searchText: {
                value: '',
                showerror: false,
                errortext: ''
            },
            searchDri: '',
            searchTextArray: [],
            noUserFound: false,
            userLoading: false,
            noUserFoundText: 'No user found . . .',
            userList: [],
            newUserList: [],
            isAdded: false,
            status: 'active',
            selectedUser: '',
            registeredUserList: [],
            current: 1,
            activeUser: null,
            limit: 1000,
            exist: false,
            designationList: [],
            userId: null,
            update: false,
            userData: null,
            selectedDesignation: {
                value: [],
                showError: false,
                errortext: 'Please choose Designation'
            },
            enterValidText: false,
            enterValidTextValue: 'Please enter valid number or email . . .',
            tagMeta: {
                showError: false,
                errortext: 'Please add tags'
            },
            userMeta: {
                showError: false,
                errortext: 'Please add a contact'
            }
        };
    },
    mounted() {
        if (this.$route.params.uid) {
            this.userId = this.$route.params.uid;
            this.update = true;
            this.headerText = 'Edit';
            this.saveText = 'DRI updated successfully';
            this.getDesignation();
            this.getUserInfo();
        } else {
            this.getDesignation();
        }
    },
    methods: {
        initialiseForm() {
            if (this.userData && Object.keys(this.userData).length > 0) {
                (this.selectedDesignation.value = this.userData.responsibilities
                    ? this.userData.responsibilities
                    : []),
                    (this.searchTextArray = this.userData.tags
                        ? this.userData.tags
                        : []),
                    (this.selectedUser = this.userData.contact
                        ? this.userData.contact
                        : '');
                this.status = this.userData.status
                    ? this.userData.status
                    : 'active';
                this.getContactInfo();
            }
        },
        getContactInfo() {
            this.noUserFound = false;
            this.userLoading = true;
            const params = {
                query: this.selectedUser ? this.selectedUser : ''
            };
            return CompanyService.searchDri(params)
                .then((res) => {
                    this.enterValidText = false;
                    this.noUserFound = false;
                    this.userLoading = false;
                    if (res.data.length > 0) {
                        this.userList = res.data;
                        this.isAdded = true;
                    } else {
                        this.noUserFound = true;
                    }
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
                    this.noUserFound = true;
                    this.enterValidText = false;
                });
        },
        getUserInfo() {
            const params = {
                uid: this.userId ? this.userId : ''
            };
            this.pageLoading = true;
            this.pageError = false;
            CompanyService.fetchDri(params)
                .then((res) => {
                    this.pageLoading = false;
                    this.userData = res.data;
                    this.initialiseForm();
                })
                .catch((error) => {
                    console.error(error);
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        getDesignation() {
            let params = {
                choice_type: 'designations'
            };
            CompanyService.fetchDesignation(params)
                .then((res) => {
                    this.designationList = res.data.data;
                    this.designationList.map((ele) => {
                        ele.text = ele.value;
                        ele.value = ele.key;
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getSearchText() {
            if (
                event.keyCode == 32 ||
                event.keyCode == 13 ||
                event.keyCode == 44 ||
                event.keyCode == 9 ||
                event.keyCode == 188
            ) {
                this.addSearchText(event);
                event.target.value = '';
            }
            if (event.keyCode == 8 && !this.searchText.value) {
                if (this.searchTextArray.length) {
                    this.searchTextArray.pop();
                }
            }
        },
        addSearchText(event) {
            if (this.searchText.value) {
                if (
                    this.searchTextArray.filter(
                        (it) => it === this.searchText.value
                    ).length === 0
                ) {
                    let splitString = this.searchText.value.split(',');
                    for (let i = 0; i < splitString.length; i++) {
                        this.searchTextArray.push(splitString[i]);
                        this.tagMeta.showError = false;
                    }
                }
                this.searchText.value = '';
            }
        },
        validatePhone(text) {
            let check = Number(text);
            if (!isNaN(check)) {
                let regex = new RegExp('^[6-9][0-9]{9}$');
                if (regex.test(this.searchDri)) {
                    return true;
                }
            }
            return false;
        },
        validateEmail(text) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(text).toLowerCase());
        },
        searchUser() {
            this.userMeta.showError = false;
            if (this.searchDri && this.searchDri != '') {
                let validPhone = this.validatePhone(this.searchDri);
                let validEmail = this.validateEmail(this.searchDri);
                if (validPhone) {
                    let params = {
                        query: this.searchDri
                    };
                    this.noUserFound = false;
                    this.userLoading = true;
                    return CompanyService.searchDri(params)
                        .then((res) => {
                            this.enterValidText = false;
                            this.noUserFound = false;
                            this.userLoading = false;
                            if (res.data.length > 0) {
                                this.userList = res.data;
                            } else {
                                this.noUserFound = true;
                            }
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
                            this.noUserFound = true;
                            this.enterValidText = false;
                        });
                } else {
                    if (validEmail) {
                        let params = {
                            query: this.searchDri
                        };
                        this.noUserFound = false;
                        this.userLoading = true;
                        return CompanyService.searchDri(params)
                            .then((res) => {
                                this.enterValidText = false;
                                this.noUserFound = false;
                                this.userLoading = false;
                                if (res.data.length > 0) {
                                    this.userList = res.data;
                                } else {
                                    this.noUserFound = true;
                                }
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
                                this.noUserFound = true;
                                this.enterValidText = false;
                            });
                    } else {
                        this.enterValidText = true;
                    }
                }
            } else {
                this.enterValidText = true;
            }
        },
        removeSearchInput(index) {
            this.searchTextArray.splice(index, 1);
        },
        addUser(user) {
            if (user) {
                this.closeAddDialog();
                this.selectedUser = user._id;
                this.isAdded = true;
            }
        },
        removeUser() {
            this.closeRemoveDialog();
            this.userList = [];
            this.selectedUser = '';
            this.isAdded = false;
        },
        checkDesignation() {
            if (this.selectedDesignation.value.length > 0) {
                this.selectedDesignation.showError = false;
            }
        },
        openAddDialog(item) {
            this.activeUser = item;

            this.$refs['user_add_dialog'].open({
                width: '600px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeAddDialog() {
            this.$refs['user_add_dialog'].close();
        },
        openRemoveDialog(item) {
            this.activeUser = item;

            this.$refs['user_remove_dialog'].open({
                width: '600px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeRemoveDialog() {
            this.$refs['user_remove_dialog'].close();
        },
        save() {
            const postData = {
                company_id: this.companyId,
                status: this.status,
                tags: this.searchTextArray
            };
            if (this.update && this.userId) {
                postData.uid = this.userId;
            }
            if (this.selectedDesignation.value.length > 0) {
                postData.responsibilities = this.selectedDesignation.value;
            } else {
                this.selectedDesignation.showError = true;
            }
            if (this.selectedUser != '') {
                postData.contact = this.selectedUser;
            } else {
                this.userMeta.showError = true;
            }
            if (
                !this.selectedDesignation.showError &&
                !this.tagMeta.showError &&
                !this.userMeta.showError
            ) {
                this.pageLoading = true;
                CompanyService.createDri(postData)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(`${this.saveText}`, {
                            duration: 2000
                        });
                        setTimeout(() => {}, 2000);
                        this.$router.push({
                            path: `/administrator/company-details/${this.companyId}`
                        });
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        console.error(error);
                        this.$snackbar.global.showError(
                            `${error.response.data.errors.error}`
                        );
                    });
            }
        },
        onCancel() {
            this.$router.push({
                path: `/administrator/company-details/${this.companyId}`
            });
        }
    }
};
</script>
