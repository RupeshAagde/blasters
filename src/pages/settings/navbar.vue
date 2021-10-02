<template>
    <div class="panel">
        <page-header
            title="Navbar"
            @backClick="$router.push({ name: 'settings' })"
        >
            <nitrozen-button
                theme="secondary"
                class="mr-24"
                ref="switch-default"
                @click="switchToDefault"
                >Switch to default</nitrozen-button
            >
            <nitrozen-button @click="save" v-flatBtn theme="secondary">
                Save
            </nitrozen-button>
        </page-header>
        <div class="main-container">
            <loader v-if="pageLoading"></loader>
            <page-error v-else-if="pageError && !pageLoading"></page-error>
            <div class="page-container" v-else>
                <div class="add-new">
                    <nitrozen-button
                        theme="secondary"
                        v-strokeBtn
                        :disabled="navbar.length >= 7"
                        @click="addNew()"
                        ref="add-new"
                        >Add New</nitrozen-button
                    >
                </div>
                <div
                    class="navbar-items"
                    v-for="(nav, index) in navbar"
                    :key="'navbar' + index"
                >
                    <div class="item-title">{{ nav.title }}</div>
                    <div class="item-action">
                        <div :ref="'edit-'+index" @click="edit(nav, index)">
                            <adm-inline-svg
                                :src="'edit'"
                                title="Edit"
                                class="edit-icon"
                            ></adm-inline-svg>
                        </div>
                        <div :ref="'delete-'+index" @click="deleteItem(nav, index)">
                            <adm-inline-svg
                                :src="'delete'"
                                title="Delete"
                            ></adm-inline-svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add new items in navbar -->
        <nitrozen-dialog ref="add-edit-navbar" :title="(isEdit ? 'Edit' : 'Add') + ' Navbar Item'">
            <template slot="body">
                <div class="navbar-tilte mb-24">
                    <nitrozen-input
                        placeholder="Enter Navbar Title"
                        title="Navbar Title"
                        v-model="navbarTitle.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!navbarTitle.value && navbarTitle.showError"
                        >{{ navbarTitle.errortext }}</nitrozen-error
                    >
                </div>
                <div class="navbar-check mb-24">
                    <nitrozen-check-box v-model="isExtenalLink"
                        >External Link</nitrozen-check-box
                    >
                </div>
                <div class="navbar-link mb-24" v-if="isExtenalLink">
                    <nitrozen-input
                        placeholder="Enter Extenal Link"
                        title="External Link"
                        v-model="extenalLink.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="extenalLink.showError"
                        >{{ extenalLink.errortext }}</nitrozen-error
                    >
                </div>
                <div class="navbar-pages" v-else>
                    <nitrozen-dropdown
                        :items="platformPages"
                        v-model="selectedPage.value"
                        :label="'Pages'"
                    ></nitrozen-dropdown>
                    <nitrozen-error
                        v-if="!selectedPage.value && selectedPage.showError"
                        >{{ selectedPage.errortext }}</nitrozen-error
                    >
                </div>
            </template>
            <template slot="footer">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        theme="secondary"
                        class="mr-24"
                        @click="addNavbarItem"
                        v-flatBtn
                        ref="save-btn"
                        >Save</nitrozen-button
                    >
                    <nitrozen-button theme="secondary" v-strokeBtn
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>

        <!-- Confirmation Dialog -->
        <nitrozen-dialog ref="confirm-dialog" title="Confirmation">
            <template slot="body">
                <p>{{ confirmationText }}</p>
            </template>
            <template slot="footer">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        v-if="deleteConfirmation"
                        theme="secondary"
                        class="mr-24"
                        @click="deleteNavItem"
                        v-flatBtn
                        ref="delete-btn"
                        >Delete</nitrozen-button
                    >
                    <nitrozen-button
                        v-else
                        theme="secondary"
                        class="mr-24"
                        @click="setDefaultNavbar"
                        ref="save-default-btn"
                        v-flatBtn
                        >Save</nitrozen-button
                    >
                    <nitrozen-button
                        theme="secondary"
                        @click="closeConfirmationDialog"
                        v-strokeBtn
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>

        <loader v-if="inProgress" class="loading"></loader>
    </div>
</template>

<script>
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import InlineSvg from '@/components/common/inline-svg';
import AdmInlineSvg from '@/components/common/inline-svg';
import InternalSettingsService from '@/services/internal-settings.service';
import { Loader, PageHeader } from '@/components/common/';
import { validUrl } from '@/helper/utils';

import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
export default {
    name: 'navbar-settings',
    components: {
        PageEmpty,
        InlineSvg,
        PageError,
        NitrozenInput,
        NitrozenBadge,
        NitrozenDialog,
        NitrozenError,
        NitrozenDropdown,
        NitrozenButton,
        PageHeader,
        Loader,
        AdmInlineSvg,
        NitrozenCheckBox
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            navbar: [],
            defaultNavbar: [],
            navbarTitle: this.getInitialValue(''),
            isExtenalLink: false,
            extenalLink: this.getInitialValue(''),
            customPages: [],
            platformPages: [],
            selectedPage: this.getInitialValue(''),
            confirmationText: '',
            activeNavIndex: 0,
            deleteConfirmation: false,
            inProgress: false,
            isEdit: false
        };
    },
    mounted() {
        this.getNavbar();
        Promise.all([this.getDefaultNavbar(), this.getCustomPages()])
            .then((res) => {
                this.defaultNavbar = res[0].data.items;
                this.customPages = res[1].data.items;
                this.platformPages.push({
                    text: 'Default Pages',
                    isGroupLabel: true
                });
                this.defaultNavbar.map((ele) => {
                    if (ele.link) {
                        this.platformPages.push({
                            text: `${ele.title} (${ele.link})`,
                            value: ele.link
                        });
                    }
                });
                this.platformPages.push({
                    text: 'Custom Pages',
                    isGroupLabel: true
                });
                this.customPages.map((ele) => {
                    this.platformPages.push({
                        text: `${ele.title} (${ele.slug})`,
                        value: `/p/${ele.slug}`
                    });
                });
            })
            .catch((err) => {});
    },
    methods: {
        getInitialValue(value = '') {
            return {
                value,
                showError: false,
                errortext: ''
            };
        },
        getNavbar() {
            this.pageLoading = true;
            return InternalSettingsService.getNavbar()
                .then(({ data }) => {
                    this.navbar = data.items;
                    this.pageError = false;
                })
                .catch((err) => {
                    this.pageError = true;
                    console.error(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        getDefaultNavbar() {
            return InternalSettingsService.getDefaultNavbar();
        },
        getCustomPages() {
            const params = {
                page_size: 200,
                page_no: 1,
                published: true
            };
            return InternalSettingsService.getCustomPages(params);
        },
        addNew(isReset = true) {
            if (isReset) {
                this.isEdit = false;
                this.navbarTitle = this.getInitialValue('');
                this.selectedPage = this.getInitialValue('');
                this.extenalLink = this.getInitialValue('');
                this.isExtenalLink = false;
            }
            this.$refs['add-edit-navbar'].open({
                width: '500px',
                height: '400px',
                showCloseButton: true
            });
        },
        edit(item, index) {
            this.activeNavIndex = index;
            this.isEdit = true;
            this.navbarTitle.value = item.title;
            this.isExtenalLink = item.href ? true : false;
            this.selectedPage.value = item.link;
            this.extenalLink.value = item.href ? item.href : '';
            this.addNew(false);
        },
        closeAddDialog() {
            this.$refs['add-edit-navbar'].close();
        },
        deleteItem(item, index) {
            this.deleteConfirmation = true;
            this.activeNavIndex = index;
            this.confirmationText = `Do you want to delete ${item.title} from navbar ?`;
            this.openConfirmationDialog();
        },
        deleteNavItem() {
            this.navbar.splice(this.activeNavIndex, 1);
            this.closeConfirmationDialog();
        },
        switchToDefault() {
            this.deleteConfirmation = false;
            this.confirmationText = `Do you want to switch to default navbar ?`;
            this.openConfirmationDialog();
        },
        openConfirmationDialog() {
            this.$refs['confirm-dialog'].open({
                width: '400px',
                height: '200px',
                showCloseButton: true
            });
        },
        closeConfirmationDialog() {
            this.$refs['confirm-dialog'].close();
        },
        setDefaultNavbar() {
            this.navbar = [...this.defaultNavbar];
            this.save().then(res => {
                this.closeConfirmationDialog()
            })
        },
        addNavbarItem() {
            if (this.validateForm()) {
                const obj = {
                    title: this.navbarTitle.value
                };
                if (this.isExtenalLink) {
                    obj.href = this.extenalLink.value;
                } else {
                    obj.link = this.selectedPage.value;
                }
                if(this.isEdit){
                    this.$set(this.navbar, this.activeNavIndex, obj)
                } else {
                    this.navbar.push(obj);
                }
                this.closeAddDialog();
            }
        },
        checkEmpty(key) {
            const emptyErorrs = {
                navbarTitle: 'Title is required',
                extenalLink: 'Link is required',
                selectedPage: 'Page is required'
            };
            if (!this[key].value || (this[key].value && this[key].value.trim() === '')) {
                this[key].showError = true;
                this[key].errortext = emptyErorrs[key];
                return false;
            }
            return true;
        },
        validateForm() {
            let formValid = true;
            formValid = this.checkEmpty('navbarTitle') && formValid;
            if (this.isExtenalLink) {
                formValid = this.checkEmpty('extenalLink') && formValid;
                if (this.extenalLink.value) {
                    if(!validUrl(this.extenalLink.value)){
                        this.$set(this.extenalLink, 'showError', true)
                        this.$set(this.extenalLink, 'errortext', "Enter valid URL")
                        formValid = false
                    } else {
                        this.$set(this.extenalLink, 'showError', false)
                        this.$set(this.extenalLink, 'errortext', "")
                        formValid = true
                    }
                }
            } else {
                formValid = this.checkEmpty('selectedPage') && formValid;
            }
            return formValid;
        },
        save() {
            this.inProgress = true;
            const data = {
                items: this.navbar
            }
            return InternalSettingsService.saveNavbar(data)
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess('Saved Successfully');
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.inProgress = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}

.main-container {
    margin: 24px;
    top: 56.5px;
    position: relative;
    .page-container {
        width: 60%;
        margin: 0 auto;
        display: block;
        background: transparent;
        padding: 0;
        .add-new {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;
        }
        .navbar-items {
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            background: @White;
            border-radius: 3px;
            .item-title {
                font-weight: 600;
            }
            .item-action {
                display: flex;
                div {
                    cursor: pointer;
                }
                .edit-icon {
                    margin-right: 12px;
                }
            }
        }
    }
}
.mb-24 {
    margin-bottom: 24px;
}
.mr-24 {
    margin-right: 12px;
}
.footer-actions-buttons {
    display: flex;
    justify-content: flex-end;
}
</style>
