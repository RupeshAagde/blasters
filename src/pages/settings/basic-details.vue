<template>
    <div class="panel">
        <page-header
            title="Basic Details"
            @backClick="$router.push({ name: 'settings' })"
        >
            <nitrozen-button
                v-flatBtn
                theme="secondary"
                @click="saveSettings"
                ref="save-btn"
                :disabled="!basicSettings"
            >
                Save
            </nitrozen-button>
        </page-header>
        <div class="main-container">
            <loader v-if="pageLoading"></loader>
            <page-error
                v-else-if="pageError && !pageLoading"
                @tryAgain="fetchSettings"
            ></page-error>
            <section v-if="!pageLoading && !pageError">
                <label class="cl-Mako bold-sm title">Common Settings</label>
                <div class="input-row">
                    <!-- Title -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Title *"
                            placeholder="Enter Platform Title"
                            v-model="title.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="title.showerror">
                            {{ title.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <div class="input-row">
                    <!-- Meta Title -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Meta Title *"
                            placeholder="Enter Platform Meta Title"
                            v-model.trim="metaTitle.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="metaTitle.showerror">
                            {{ metaTitle.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <div class="input-row">
                    <!-- Meta Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Meta Description *"
                            type="textarea"
                            placeholder="Enter Platform Meta Description"
                            v-model.trim="metaDescription.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="metaDescription.showerror">
                            {{ metaDescription.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <div class="input-row">
                    <!-- Meta Image -->
                    <div class="input-field">
                        <image-uploader-tile
                            label="Meta Image"
                            aspectRatio="*"
                            @delete="metaImage.value = ''"
                            @save="metaImage.value = $event"
                            v-model="metaImage.value"
                            :fileName="'platform meta image'"
                            namespace="platform-free-logo"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="metaImage.showerror">
                            {{ metaImage.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <div class="input-row">
                    <!-- Logo -->
                    <div class="input-field">
                        <!-- <div class="n-input-label">Logo *</div> -->
                        <image-uploader-tile
                            label="Logo"
                            aspectRatio="*"
                            @delete="logo.value = ''"
                            @save="logo.value = $event"
                            v-model="logo.value"
                            :fileName="'platform logo'"
                            namespace="platform-free-logo"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="logo.showerror">
                            {{ logo.errortext }}
                        </nitrozen-error>
                    </div>
                    <!-- Favicon -->
                    <div class="input-field">
                        <!-- <div class="n-input-label">Favicon *</div> -->
                        <image-uploader-tile
                            label="Favicon"
                            aspectRatio="*"
                            @delete="favicon.value = ''"
                            @save="favicon.value = $event"
                            v-model="favicon.value"
                            :fileName="'platform favicon'"
                            namespace="platform-favicon-logo"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="favicon.showerror">
                            {{ favicon.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-column">
                <label class="cl-Mako bold-sm">Appereance of Authentication Page</label>
                <div class="input-row">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Overlay Text *"
                            type="textarea"
                            placeholder="Enter Authentication Description"
                            v-model="authDescription.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="authDescription.showerror">
                            {{ authDescription.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row">
                      <!-- Authentication Logo -->
                    <div class="input-field">
                        <!-- <div class="n-input-label">Authentication Logo *</div> -->
                        <image-uploader-tile
                            label="Overlay Logo"
                            aspectRatio="1:1"
                            @delete="authLogo.value = ''"
                            @save="authLogo.value = $event"
                            v-model="authLogo.value"
                            :fileName="'platform logo'"
                            namespace="platform-free-logo"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="authLogo.showerror">
                            {{ authLogo.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- Authentication Image -->
                    <div class="input-field">
                        <!-- <div class="n-input-label">Authentication Image *</div> -->
                        <image-uploader-tile
                            label="Side Image"
                            aspectRatio="*"
                            @delete="authImage.value = ''"
                            @save="authImage.value = $event"
                            v-model="authImage.value"
                            :fileName="'platform logo'"
                            namespace="platform-feature-image"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="authImage.showerror">
                            {{ authImage.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                </div>


                <div class="input-column">
                <label class="cl-Mako bold-sm">Text on Seller Login Page</label>
                <div class="input-row">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Title *"
                            placeholder="Enter Login Title"
                            v-model="loginTitle.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="loginTitle.showerror">
                            {{ loginTitle.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Subtitle *"
                            type="textarea"
                            placeholder="Enter Login Subtitle"
                            v-model="loginDescription.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="loginDescription.showerror">
                            {{ loginDescription.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                </div>


                <div class="input-column">
                <label class="cl-Mako bold-sm">Text on Seller Register Page</label>
                <div class="input-row">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Title *"
                            placeholder="Enter Register Title"
                            v-model="registerTitle.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="registerTitle.showerror">
                            {{ registerTitle.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Subtitle *"
                            type="textarea"
                            placeholder="Enter Register Subtitle"
                            v-model="registerDescription.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="registerDescription.showerror">
                            {{ registerDescription.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                </div>

                <div class="input-column">
                <label class="cl-Mako bold-sm">Business Account Restrictions</label>
                <div class="input-row business-checbox">
                    <!-- Description -->
                    <div class="input-field">
                        <label class="business-create">
                            <nitrozen-toggle-btn
                                v-model="businessAccount.value"
                            ></nitrozen-toggle-btn>
                            <span>Limit the number of business account per seller</span>
                        </label>
                    </div>
                </div>

                <div class="input-row" v-if="businessAccount.value">
                    <!-- Description -->
                    <div class="input-field">
                        <nitrozen-input
                            label="Maximum Accounts Permitted *"
                            type="number"
                            placeholder="Enter Thershold"
                            v-model="businessAccountThershold.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="businessAccountThershold.showerror">
                            {{ businessAccountThershold.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                </div>

                <div class="input-column">
                    <label class="cl-Mako bold-sm">Seller Support Details</label>
                <div class="input-row">
                    <div class="input-field">
                        <nitrozen-input
                            label="Phone Numer *"
                            type="number"
                            placeholder="Enter Phone Number"
                            v-model="sellerPhone.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="sellerPhone.showerror">
                            {{ sellerPhone.errortext }}
                        </nitrozen-error>
                    </div>

                    <div class="input-field">
                        <nitrozen-input
                            label="Email *"
                            placeholder="Enter Email"
                            v-model="sellerEmail.value"
                        ></nitrozen-input>
                        <nitrozen-error v-if="sellerEmail.showerror">
                            {{ sellerEmail.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                </div>


                <!-- <div class="input-column" v-if="basicSettings">
                    <label class="cl-Mako bold-xs title">
                        Whats New Information
                    </label>
                    <div
                        class="input-row"
                        v-for="(wnew, i) in basicSettings
                            ? basicSettings.whats_new
                            : []"
                        :key="i"
                    >
                        <div class="input-field">
                            <nitrozen-input
                                :label="`Whats New ${i + 1}`"
                                placeholder="Enter New Feature"
                                v-model="wnew.description"
                            ></nitrozen-input>
                        </div>
                        <div class="remove-whats-new">
                            <inline-svg
                                src="delete"
                                title="Delete Whats New"
                                @click.stop.native="$showConfirmDeleteDialog(i)"
                            ></inline-svg>
                        </div>
                    </div>
                    <div class="input-row">
                        <nitrozen-button
                            theme="secondary"
                            v-stroke-btn
                            @click="addWhatsNew"
                        >
                            Add Whats New
                        </nitrozen-button>
                    </div>
                </div> -->
            </section>
        </div>

        <!-- Whats new delete confirmation -->
        <nitrozen-dialog
            ref="confirm_delete_dialog"
            title="Confirm Delete"
            @close="$closeConfirmDeleteDialog($event)"
        >
            <template slot="body">
                Are you sure you want to delete whats new field?
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
import { titleCase, debounce } from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import InlineSvg from '@/components/common/inline-svg';
import InternalSettingsService from '@/services/internal-settings.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import { Loader, PageHeader, ImageUploaderTile } from '@/components/common/';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';

export default {
    name: 'basic-detail-settings',
    mixins: [dirtyCheckMixin],
    components: {
        PageEmpty,
        Shimmer,
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
        ImageUploaderTile,
        NitrozenToggleBtn
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            basicSettings: null,
            pristineData: null,

            title: this.getInitialValue(''),
            metaTitle: this.getInitialValue(''),
            metaDescription: this.getInitialValue(''),
            metaImage: this.getInitialValue(''),
            logo: this.getInitialValue(''),
            favicon: this.getInitialValue(''),
            authDescription: this.getInitialValue(''),
            authImage: this.getInitialValue(''),
            authLogo: this.getInitialValue(''),
            loginTitle: this.getInitialValue(''),
            loginDescription: this.getInitialValue(''),
            registerTitle: this.getInitialValue(''),
            registerDescription: this.getInitialValue(''),
            businessAccount: this.getInitialValue(false),
            businessAccountThershold: this.getInitialValue(1),
            sellerPhone: this.getInitialValue(9123456780),
            sellerEmail: this.getInitialValue("seller@gofynd.com"),
            features: [],
            whats_new: []
        };
    },
    mounted() {
        this.pageLoading = true;
        this.fetchSettings();
    },
    methods: {
        titleCase,
        isFormDirty() {
            const pristine = this.pristineData;
            const current = this.getPayload();
            return !_.isEqual(pristine, current);
        },

        fetchSettings() {
            this.pageLoading = true;
            return InternalSettingsService.getBasicSettings()
                .then(({ data }) => {
                    this.basicSettings = data;

                    this.title.value = this.basicSettings.title;
                    this.metaTitle.value = this.basicSettings.meta_title;
                    this.metaDescription.value = this.basicSettings.meta_description;
                    this.metaImage.value = this.basicSettings.meta_image || this.basicSettings.favicon_url;
                    this.logo.value = this.basicSettings.logo_url;
                    this.favicon.value = this.basicSettings.favicon_url;
                    this.whats_new = this.basicSettings.whats_new;
                    this.features = this.basicSettings.features;
                    this.authDescription.value = this.basicSettings.authentication.panel.description || '';
                    this.authLogo.value = this.basicSettings.authentication.panel.logo || '';
                    this.authImage.value = this.basicSettings.authentication.panel.image || '';
                    
                    this.loginTitle.value = this.basicSettings.authentication.login.title || 'Login to Fynd Platform';
                    this.loginDescription.value = this.basicSettings.authentication.login.description || 'Enter account details to manage your online business';
                    this.registerTitle.value = this.basicSettings.authentication.register.title || 'Welcome to Fynd Platform';
                    this.registerDescription.value = this.basicSettings.authentication.register.description || 'Enter details to create your online business';

                    this.businessAccount.value = this.basicSettings.business_account && this.basicSettings.business_account.is_limit || false
                    this.businessAccountThershold.value = this.basicSettings.business_account && this.basicSettings.business_account.threshold || 1

                    this.sellerPhone.value = this.basicSettings.seller_support && this.basicSettings.seller_support.phone_number || 9012345678;
                    this.sellerEmail.value = this.basicSettings.seller_support && this.basicSettings.seller_support.email || 'seller@gofynd.com';

                    this.pageError = false;
                    this.pristineData = this.getPayload();
                })
                .catch((err) => {
                    this.pageError = true;
                    console.error(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },

        getInitialValue(value = '') {
            return { showerror: false, value, errortext: '' };
        },
        getPayload() {
            const authentication = this.basicSettings.authentication
            authentication.panel = {
                description: this.authDescription.value,
                image: this.authImage.value,
                logo: this.authLogo.value
            }
            authentication.login = {
                title: this.loginTitle.value,
                description: this.loginDescription.value
            }
            authentication.register = {
                title: this.registerTitle.value,
                description: this.registerDescription.value
            }
            return {
                name: this.title.value,
                logo_url: this.logo.value,
                favicon_url: this.favicon.value,
                title: this.title.value,
                meta_title: this.metaTitle.value,
                meta_description: this.metaDescription.value,
                meta_image: this.metaImage.value,
                whats_new: this.basicSettings.whats_new.filter(
                    (wnew) => wnew.description != ''
                ),
                features: this.basicSettings.features,
                landingPageDetails:this.basicSettings.landingPageDetails,
                authentication,
                business_account: {
                    is_limit: this.businessAccount.value,
                    threshold: this.businessAccountThershold.value
                },
                seller_support: {
                    email: this.sellerEmail.value,
                    phone_number: this.sellerPhone.value
                },
            };
        },
        checkEmpty(key) {
            const emptyErorrs = {
                title: 'Title is required',
                metaTitle: "Meta Title is required",
                metaDescription: "Meta Description is required",
                metaImage: "Meta Image is required",
                logo: 'Logo is required',
                favicon: 'Favicon is required',
                authDescription: 'Description is required',
                authImage: 'Image is required',
                authLogo: 'Logo is required',
                loginTitle: 'Title is required',
                loginDescription: 'Description is required',
                registerTitle: 'Title is required',
                registerDescription: 'Description is required',
                businessAccountThershold: 'Thershold is required',
                sellerEmail: 'Email is required',
                sellerPhone: 'Phone Number is required'
            };
            if(key == 'businessAccountThershold'){
                if(this[key].value <= 0){
                    this[key].showerror = true;
                    this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                    return false;
                } else {
                    this[key].showerror = false;
                }
            }
            else if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            }
            return true;
        },
        cleanErrors() {
            this.title.showerror = false;
            this.metaTitle.showerror = false;
            this.metaDescription.showerror = false;
            this.metaImage.showerror = false;
            this.logo.showerror = false;
            this.favicon.showerror = false;
        },
        validate() {
            let formValid = true;
            formValid = this.checkEmpty('title') && formValid;
            formValid = this.checkEmpty('metaTitle') && formValid;
            formValid = this.checkEmpty('metaDescription') && formValid;
            formValid = this.checkEmpty('metaImage') && formValid;
            formValid = this.checkEmpty('logo') && formValid;
            formValid = this.checkEmpty('favicon') && formValid;
            formValid = this.checkEmpty('authDescription') && formValid;
            formValid = this.checkEmpty('authImage') && formValid;
            formValid = this.checkEmpty('loginTitle') && formValid;
            formValid = this.checkEmpty('loginDescription') && formValid;
            formValid = this.checkEmpty('registerTitle') && formValid;
            formValid = this.checkEmpty('registerDescription') && formValid;
            if(this.businessAccount.value){
                formValid = this.checkEmpty('businessAccountThershold') && formValid;
            }
            return formValid;
        },
        saveSettings() {
            if (!this.validate()) {
                return;
            }
            this.pageLoading = true;
            const payload = this.getPayload();
            return InternalSettingsService.updateBasicSettings(payload)
                .then(({ data }) => {
                    this.basicSettings = data;
                    this.$snackbar.global.showSuccess('Settings Saved');
                    this.pristineData = this.getPayload();
                    this.cleanErrors();
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },

        addWhatsNew() {
            this.basicSettings.whats_new.push({ description: '' });
        },
        removeWhatsNew(index) {
            this.basicSettings.whats_new.splice(index, 1);
        },

        // whats new delete confirmation dialog
        $showConfirmDeleteDialog(index) {
            this.$refs['confirm_delete_dialog']['index'] = index;
            this.$refs['confirm_delete_dialog'].open({
                width: '350px',
                positiveButtonLabel: 'Cancel',
                negativeButtonLabel: 'Delete',
                neutralButtonLabel: false
            });
        },
        $closeConfirmDeleteDialog(data) {
            if (data == 'Delete') {
                this.removeWhatsNew(
                    this.$refs['confirm_delete_dialog']['index']
                );
                this.$refs['confirm_delete_dialog']['index'] = -1;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.input-row {
    display: flex;
    margin: 6px 0;
    .input-field {
        flex: 1;
    }
    .input-field:not(:first-child) {
        margin-left: 24px;
    }
    label.title {
        padding: 12px 0;
    }
    .business-create{
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
    }
}
.business-checbox{
    margin: 24px 0 12px 0;
}
.input-column {
    .input-row;
    margin: 24px 0 6px 0;
    flex-direction: column;
}
.remove-whats-new {
    display: flex;
    width: 40px;
    justify-content: center;
    top: 12px;
    position: relative;
}
.input-shimmer {
    height: 60px;
    width: 400px;
}
.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
.main-container {
    cursor: pointer;
    background-color: white;
    margin: 24px;
    padding: 24px;
    top: 56.5px;
    position: relative;
    min-height: 400px;
}
</style>
