<template>
    <div class="panel">
        <page-header
            title="Platform Features"
            @backClick="$router.push({ name: 'settings' })"
        >
            <nitrozen-button
                v-flatBtn
                theme="secondary"
                ref="save-btn"
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
                <div class="input-column" v-if="basicSettings">
                    <div
                        class="feature-item"
                        v-for="(feature, i) in basicSettings
                            ? basicSettings.features
                            : []"
                        :key="i"
                    >
                        <label class="cl-Mako bold-xs title-row">
                            <span>Features {{ i + 1 }}</span>

                            <div class="remove-feature">
                                <inline-svg
                                    src="delete"
                                    title="Delete Feature"
                                    @click.stop.native="
                                        $showConfirmDeleteDialog(i)
                                    "
                                ></inline-svg>
                            </div>
                        </label>
                        <!-- Features -->
                        <div class="input-field">
                            <nitrozen-input
                                :label="`Title`"
                                placeholder="Enter Feature Title"
                                v-model="feature.title"
                            ></nitrozen-input>
                        </div>
                        <div class="input-field input-field-image">
                            <div class="n-input-label">Feature Image</div>
                            <image-uploader-tile
                                label="Feature Image"
                                aspectRatio="*"
                                @delete="feature.image = ''"
                                @save="feature.image = $event"
                                v-model="feature.image"
                                :fileName="'platform feature'"
                                namespace="platform-feature-image"
                            ></image-uploader-tile>
                        </div>
                        <div class="input-field">
                            <nitrozen-input
                                :label="`Description`"
                                placeholder="Enter Feature Description"
                                type="textarea"
                                v-model="feature.text"
                            ></nitrozen-input>
                        </div>
                        <div class="input-field feature-list">
                            <span class="n-input-label">List</span>
                            <div
                                v-for="(item, j) in feature.list"
                                :key="j"
                                class="feature-list-item"
                            >
                                <nitrozen-input
                                    placeholder="Enter Feature Description"
                                    :value="item"
                                    @input="feature.list.splice(j, 1, $event)"
                                ></nitrozen-input>
                                <div class="remove-list-item">
                                    <inline-svg
                                        src="delete"
                                        title="Delete List Item"
                                        @click.stop.native="
                                            $showConfirmDeleteDialog(i, j)
                                        "
                                    ></inline-svg>
                                </div>
                            </div>
                            <nitrozen-button
                                theme="secondary"
                                @click="addFeatureListItem(i)"
                            >
                                Add Feature List Item
                            </nitrozen-button>
                        </div>
                    </div>
                    <div class="input-row">
                        <nitrozen-button
                            theme="secondary"
                            v-stroke-btn
                            @click="addFeature"
                        >
                            Add Feature
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
                Are you sure you want to delete?
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
import { titleCase, debounce } from '@/helper/utils';
import AdmShimmer from '@/components/common/shimmer';
import AdmNoContent from '@/components/common/page-empty';
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
        AdmNoContent,
        AdmShimmer,
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
                name: this.basicSettings.name,
                logo_url: this.basicSettings.logo_url,
                favicon_url: this.basicSettings.favicon_url,
                title: this.basicSettings.title,
                whats_new: this.basicSettings.whats_new,
                features: this.basicSettings.features
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
            // this.title.showerror = false;
            // this.logo.showerror = false;
            // this.favicon.showerror = false;
        },
        validate() {
            let formValid = true;
            // formValid = this.checkEmpty('title') && formValid;
            // formValid = this.checkEmpty('logo') && formValid;
            // formValid = this.checkEmpty('favicon') && formValid;
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

        addFeature() {
            this.basicSettings.features.push({
                title: '',
                image: '',
                text: '',
                list: []
            });
        },
        addFeatureListItem(index) {
            this.basicSettings.features[index].list.push('');
        },
        removeFeature(index, listItemIndex) {
            if (listItemIndex != undefined) {
                this.basicSettings.features[index].list.splice(
                    listItemIndex,
                    1
                );
            } else {
                this.basicSettings.features.splice(index, 1);
            }
        },

        // whats new delete confirmation
        $showConfirmDeleteDialog(index, listItemIndex) {
            this.$refs['confirm_delete_dialog']['index'] = index;
            this.$refs['confirm_delete_dialog'][
                'listItemIndex'
            ] = listItemIndex;
            this.$refs['confirm_delete_dialog'].open({
                width: '350px',
                positiveButtonLabel: 'Cancel',
                negativeButtonLabel: 'Delete',
                neutralButtonLabel: false
            });
        },
        $closeConfirmDeleteDialog(data) {
            const index = this.$refs['confirm_delete_dialog']['index'];
            const listItemIndex = this.$refs['confirm_delete_dialog'][
                'listItemIndex'
            ];
            if (data == 'Delete') {
                this.removeFeature(index, listItemIndex);
                this.$refs['confirm_delete_dialog']['index'] = -1;
                this.$refs['confirm_delete_dialog']['listItemIndex'] = -1;
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
        margin-bottom: 12px;

        &.input-field-image {
            width: 50%;
        }
    }
    .input-field:not(:first-child) {
        margin-left: 24px;
    }
    label.title {
        padding: 12px 0;
    }
    .title-row {
        display: flex;
        justify-content: space-between;
    }
}
.input-column {
    .input-row;

    flex-direction: column;
}
.feature-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    border-bottom: 1px solid @Iron;
    .feature-list {
        .feature-list-item {
            display: flex;
            ::v-deep .nitrozen-form-input {
                margin: 6px 0;
                width: 600px;
            }
        }
        .remove-list-item {
            width: 40px;
            cursor: pointer;
            display: flex;
            justify-content: center;
        }
    }
    .remove-feature {
        cursor: pointer;
        display: flex;
        width: 40px;
        justify-content: center;
        position: relative;
        ::v-deep svg {
            width: 36px;
            height: 36px;
        }
    }
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
    background-color: white;
    margin: 24px;
    padding: 24px;
    top: 56.5px;
    position: relative;
    min-height: 400px;
}
</style>
