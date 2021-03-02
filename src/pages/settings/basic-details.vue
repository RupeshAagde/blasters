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
            <section v-show="!pageLoading && !pageError">
                <label class="cl-Mako bold-sm title">Basic Details</label>
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
                    <!-- Logo -->
                    <div class="input-field">
                        <div class="n-input-label">Logo *</div>
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
                        <div class="n-input-label">Favicon *</div>
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
                <div class="input-column" v-if="basicSettings">
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
                        <!-- Whats NEw -->
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
                </div>
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
    NitrozenDialog
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
        ImageUploaderTile
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
            logo: this.getInitialValue(''),
            favicon: this.getInitialValue(''),
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
                    this.logo.value = this.basicSettings.logo_url;
                    this.favicon.value = this.basicSettings.favicon_url;
                    this.whats_new = this.basicSettings.whats_new;
                    this.features = this.basicSettings.features;

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
            return {
                name: this.title.value,
                logo_url: this.logo.value,
                favicon_url: this.favicon.value,
                title: this.title.value,
                whats_new: this.basicSettings.whats_new.filter(
                    (wnew) => wnew.description != ''
                ),
                features: this.basicSettings.features,
                landingPageDetails:this.basicSettings.landingPageDetails,
                authentication:this.basicSettings.authentication    
            };
        },
        checkEmpty(key) {
            const emptyErorrs = {
                title: 'Title is required',
                logo: 'Logo is required',
                favicon: 'Favicon is required'
            };
            if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            }
            return true;
        },
        cleanErrors() {
            this.title.showerror = false;
            this.logo.showerror = false;
            this.favicon.showerror = false;
        },
        validate() {
            let formValid = true;
            formValid = this.checkEmpty('title') && formValid;
            formValid = this.checkEmpty('logo') && formValid;
            formValid = this.checkEmpty('favicon') && formValid;
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
}
.input-column {
    .input-row;

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
