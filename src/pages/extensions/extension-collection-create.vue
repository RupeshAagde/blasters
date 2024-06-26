<template>
    <div class="panel create-extension-collection">
        <div class="page-header-position">
            <page-header @backClick="onCancel" :title="'Extension Collection'">
                <div class="button-box">
                    <div
                        class="cursor-pointer cl-RoyalBlue bold-xs status-text"
                    >
                        {{
                            collection_data.published
                                ? 'Published'
                                : 'Unpublished'
                        }}
                    </div>
                    <nitrozen-toggle-btn
                        v-model="collection_data.published"
                    ></nitrozen-toggle-btn>
                    <nitrozen-button
                        class="save-form-button"
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >{{
                            isEditForm() ? 'Update' : 'Create'
                        }}</nitrozen-button
                    >
                </div>
            </page-header>
        </div>

        <loader v-if="pageLoading && !pageError"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="fetchExtensionCollectionDetails(collection_id)"
        ></page-error>
        <div  v-else class="new-main-container">
            <div class="new-page-container">
                <div class="section p-24-bg-white">
                    <loader v-if="inProgress" class="loading"></loader>
                    <div class="cl-Mako bold-md">Basic Details</div>
                    <!-- Name -->
                    <div class="input">
                        <nitrozen-input
                            label="Name *"
                            placeholder="For eg. Summer Styles, Suit Up, etc."
                            v-model="collection_data.name"
                            @input="onNameInput"
                            class="collection-name"
                            :custom="true"
                            :maxlength="30"
                        >
                        </nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="errors.name"
                            >{{ errors.name }}</nitrozen-error
                        >
                    </div>
                    <!-- Slug -->
                    <div class="input">
                        <nitrozen-input
                            label="Slug *"
                            placeholder="For eg. summer-styles"
                            v-model="collection_data.slug"
                            tooltipText="Part of the URL that explains the page’s content. Allowed characters are alphabets, numbers and hyphens."
                            :showTooltip="true"
                            @input="(slug)=>{
                                slug = nameToSlug(slug);
                                $nextTick(()=>{
                                    collection_data.slug = slug;
                                    handleSlugChange(slug);
                                });
                            }"
                            @blur="handleDuplicateSlug"
                            :maxlength="24"
                            :disabled="checkSlugDisable()"
                            class="collection-slug"
                        ></nitrozen-input>
                        <div class="three col" v-if="is_slug_loading">
                            <div class="loader-main" id="loader-1"></div>
                        </div>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="errors.slug"
                        >
                            {{ errors.slug }}
                        </nitrozen-error>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="duplicate_slug.error"
                        >
                            {{ duplicate_slug.error }}
                        </nitrozen-error>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="slug_length.error"
                        >
                            {{ slug_length.error }}
                        </nitrozen-error>
                        <nitrozen-error
                            v-else-if="
                                errors.invalid_slug &&
                                    !/^[a-z0-9]+(?:--?[a-z0-9]+)*$/.test(
                                        slug.value.trim()
                                    )
                            "
                        >
                            Slug Invalid
                        </nitrozen-error>
                    </div>
                    <!-- Description -->
                    <div class="input">
                        <nitrozen-input
                            type="textarea"
                            class="suffix-top"
                            label="Description *"
                            :maxlength="150"
                            placeholder="For eg. Slay in style with our cool summer collection"
                            v-model="collection_data.description"
                            :showSuffix="true"
                            :custom="true"
                        >
                        </nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="errors.description"
                            >{{ errors.description }}</nitrozen-error
                        >
                    </div>
                </div>
                <!-- Image Upload -->
                <div class="image-error" v-if="errors.logo">
                    <nitrozen-error
                        class="nitrozen-error"
                        v-if="errors.logo"
                        >{{ errors.logo }}</nitrozen-error
                    >
                </div>
                <div class="image-uploader p-24-bg-white">
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">Icon *</div>
                            <div class="sub-label-bottom">
                                (Web &amp; Mobile)
                            </div>
                        </div>
                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div>
                                    <image-uploader
                                        :showGallery="false"
                                        class="nitrozen-form-input logo-container"
                                        label="Icon*"
                                        aspectRatio="94:87"
                                        :minimumResolution="{
                                            width: 282,
                                            height: 261
                                        }"
                                        @delete="
                                            collection_data.banner.logo = ''
                                        "
                                        @save="
                                            onChangeImage($event, 'logo')
                                        "
                                        :value="collection_data.banner.logo"
                                        :mediaFolder="
                                            collection_data.banner.logo
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">
                                Mobile Banner *
                            </div>
                            <div class="sub-label-bottom">(Mobile)</div>
                        </div>

                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div>
                                    <image-uploader
                                        :showGallery="false"
                                        class="nitrozen-form-input logo-container"
                                        label="Icon*"
                                        aspectRatio="75:37"
                                        :minimumResolution="{
                                            width: 375,
                                            height: 185
                                        }"
                                        @delete="
                                            collection_data.banner.portrait =
                                                ''
                                        "
                                        @save="
                                            onChangeImage(
                                                $event,
                                                'portrait'
                                            )
                                        "
                                        :value="
                                            collection_data.banner.portrait
                                        "
                                        :mediaFolder="
                                            collection_data.banner.portrait
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">
                                Landscape Banner *
                            </div>
                            <div class="sub-label-bottom">(Web)</div>
                        </div>

                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div>
                                    <image-uploader
                                        :showGallery="false"
                                        class="nitrozen-form-input logo-container land"
                                        label="Icon*"
                                        aspectRatio="35:8"
                                        :minimumResolution="{
                                            width: 1400,
                                            height: 320
                                        }"
                                        @delete="
                                            collection_data.banner.landscape =
                                                ''
                                        "
                                        @save="
                                            onChangeImage(
                                                $event,
                                                'landscape'
                                            )
                                        "
                                        :value="
                                            collection_data.banner.landscape
                                        "
                                        :mediaFolder="
                                            collection_data.banner.landscape
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input p-24-bg-white">
                    <div class="input-text tags" ref="tagScroll">
                        <tags-input
                            ref="chipInput"
                            class="nitrozen-form-input"
                            @keydown.enter="addChip"
                            @keydown.tab="addChip"
                            @keydown.space="addChip"
                            v-model="collection_data.tags"
                            label="Tags"
                            :maxTags="3"
                        ></tags-input>
                    </div>
                    <nitrozen-error
                        class="nitrozen-error"
                        v-if="errors.tags"
                        >{{ errors.tags }}
                    </nitrozen-error>
                </div>
                <div class="input p-24-bg-white m-top">
                    <div class="item-catelogue">
                        <div class="cl-Mako bold-md">
                            Extensions ({{
                                collection_data.selected_items.length
                            }})
                        </div>
                        <div>
                            <nitrozen-button
                                class="save-btn"
                                :theme="'secondary'"
                                v-flatBtn
                                @click="addProducts"
                            >
                                Add Extensions
                            </nitrozen-button>
                        </div>
                    </div>
                    <nitrozen-error
                        class="nitrozen-error"
                        v-if="errors.extensions"
                        >{{ errors.extensions }}
                    </nitrozen-error>
                </div>
                <item-drawer
                    v-if="showExtensionModal"
                    :isOpen="showExtensionModal"
                    :isCancelable="true"
                    :title="'Extension List'"
                    @onAddExtensions="addSelectedExtensions"
                    class="item-drawer-main"
                    :selected_extensions="collection_data.selected_items"
                    @closeProductModal="closeModal"
                    @handleModalRef="setModalRef"
                    @getExtensionData="setExtensionData"
                >
                </item-drawer>
                <div class="p-24-bg-white">
                    <page-empty
                        :text="'No Extensions selected for this collection'"
                        v-if="!collection_data.selected_items.length"
                    >
                    </page-empty>
                    <div
                        v-if="collection_data.selected_items.length"
                        class="extension-list-container"
                    >
                        <public-extension-card
                            v-for="(extension,
                            index) in collection_data.selected_items"
                            :key="index"
                            :ref="'extension-' + index"
                            :extension="extension"
                            :remove_button="true"
                            @remove="removeExtension(extension)"
                        >
                        </public-extension-card>
                    </div>
                </div>
                <div class="input p-24-bg-white m-top">
                    <nitrozen-button
                        class="button"
                        theme="secondary"
                        @click.stop="isCollapsed = !isCollapsed"
                    >
                        Edit website SEO
                    </nitrozen-button>
                    <seo-component
                        v-model="collection_data.seo"
                        :isCollapsed="isCollapsed"
                        :url="
                            `${fynd_partners_domain}/collection/${collection_data.slug ||
                                ':slug'}`
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';

.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container {
    margin: 0;
    flex-direction: column;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenTooltip,
    NitrozenChips,
    NitrozenInline,
    NitrozenCheckBox,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import ItemDrawer from './item-drawer.vue';
import { BaseModal } from '../../components/common/';
import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import imageUploader from '@/components/common/image-uploader/index.vue';
import root from 'window-or-global';
import { formatBytes } from '@/helper/digital-storage.util';
const env = root.env || {};
import tagsInput from '@/components/common/tags-input.vue';
import seoComponent from './seo-component.vue';
import publicExtensionCard from '@/components/extension/public-extension-card.vue';
import ExtensionService from '@/services/extension.service';
import { isEmpty } from 'lodash';
import { debounce } from '@/helper/utils';
const RequiredFields = [
    { key: 'name', message: 'Required field' },
    { key: 'slug', message: 'Required field' },
    { key: 'description', message: 'Required field' },
    {
        key: 'logo',
        message: 'Logo and Banner(s) are required',
        validator: (data) => {
            if (
                data.banner.logo &&
                data.banner.portrait &&
                data.banner.landscape
            ) {
                return true;
            }
            return false;
        }
    },
    {
        key: 'extensions',
        message: 'Select mininum 1 extension',
        validator: (data) => {
            if (data.selected_items.length) {
                return true;
            }
            return false;
        }
    }
];

export default {
    name: 'extension-review',
    components: {
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seo-component': seoComponent,
        'item-drawer': ItemDrawer,
        'base-modal': BaseModal,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        'image-uploader': imageUploader,
        'tags-input': tagsInput,
        loader: loader,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-checkbox': NitrozenCheckBox,
        'public-extension-card' :publicExtensionCard
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            isCollapsed: true,
            showExtensionModal: false,
            inProgress: false,
            pageError: false,
            pageLoading: false,
            is_slug_dirty: false,
            collection_data: {
                collection_category: 'extension',
                collection_type: 'handpicked',
                seo: {
                    title: 'Title',
                    description: 'Breif description about the collection'
                },
                banner: {
                    logo: '',
                    portrait: '',
                    landscape: ''
                },
                name: '',
                tags: [],
                current_status: '',
                selected_items: [],
                icon: '',
                description: '',
                published: true,
                slug: ''
            },
            errors: {},
            tags: [],
            chipInput: '',
            selected_items: [],
            modalRef: null,
            extension_data: [],
            duplicate_slug: { error: '' },
            slug_length: { error: '' },
            is_slug_loading: false
        };
    },
    computed: {
        fynd_partners_domain() {
            return env.BOMBSHELL_MAIN_DOMAIN;
        },
        collection_id() {
            return this.$route.params.collection_id;
        }
    },
    mounted() {
        if (this.collection_id) {
            this.fetchExtensionCollectionDetails(this.collection_id);
        }
    },
    methods: {
        onNameInput(slug) {
            if (this.is_slug_dirty || this.checkSlugDisable()) {
                return;
            }
            this.collection_data.slug = this.nameToSlug(slug).substr(0, 24);
            this.handleSlugChange(this.collection_data.slug, true);
        },
        checkSlugDisable() {
            return !!this.collection_id || this.is_slug_loading;
        },
        setExtensionData(extension_data) {
            this.extension_data = extension_data;
            this.$set(this.extension_data, extension_data);
        },
        checkRequiredFields() {
            this.errors = {};
            RequiredFields.forEach(({ key, message, validator }) => {
                if (validator && !validator(this.collection_data)) {
                    this.$set(this.errors, key, message);
                }
                if (!validator && !this.collection_data[key].trim()) {
                    this.$set(this.errors, key, message);
                }
            });
            return !isEmpty(this.errors);
        },
        removeExtension(item) {
            const selected_items = this.collection_data.selected_items.filter(
                (x) => x._id !== item._id
            );
            this.collection_data.selected_items = selected_items;
            this.$set(this.collection_data, 'selected_items', selected_items);
        },
        isEditForm() {
            if (this.collection_id) {
                return true;
            }
            return false;
        },
        fetchExtensionCollectionDetails(id) {
            this.pageLoading = true;
            ExtensionService.getExtensionCollectionDetails(id)
                .then((res) => {
                    this.collection_data = res.data;
                    this.$set(
                        this.collection_data,
                        'tags',
                        this.collection_data.tags
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        setModalRef(modalRef) {
            this.modalRef = modalRef;
        },
        addSelectedExtensions(selected_items) {
            this.selected_items = selected_items;
            this.collection_data.selected_items = selected_items;
            this.showExtensionModal = false;
        },
        addProducts() {
            this.modalRef && this.modalRef.open();
            this.showExtensionModal = true;
        },
        closeModal() {
            this.showExtensionModal = false;
        },
        onSelectedFilters() {},
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
        onChangeImage(event, name) {
            this.collection_data.banner[name] = event;
            document.body.style = {
                ...document.body.style,
                position: 'relative'
            };
        },
        formatBytes,
        saveForm() {
            if (this.checkRequiredFields()) {
                this.$snackbar.global.showError('Missing required fields');
                return;
            }
            if (this.duplicate_slug.error) {
                this.$snackbar.global.showError(
                    'Please use different slug for the collection'
                );
                return;
            }
            this.collection_data.collection_items = this.collection_data.selected_items.map(
                (selceted_ext) => {
                    return {
                        entity_id: selceted_ext.extension_id,
                        entity_type: 'extension'
                    };
                }
            );
            const { selected_items, ...postObject } = this.collection_data;
            if (this.collection_id) {
                ExtensionService.updateExtensionCollection(
                    postObject,
                    this.collection_id
                )
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            'Extension Updated successfully',
                            1000
                        );
                        return this.$router.push({
                            path: '/administrator/extensions/collection'
                        });
                    })
                    .catch((err) => {
                        console.log('>> err', err);
                        if (err.response.data.message) {
                            this.$snackbar.global.showError(
                                err.response.data.message
                            );
                            return;
                        }
                        this.$snackbar.global.showError(
                            'Error occured! Extension could not be saved'
                        );
                    });
                return;
            }

            ExtensionService.saveExtensionCollection(postObject)
                .then((res) => {
                    this.$snackbar.global.showSuccess(
                        'Extension saved successfully',
                        1000
                    );
                    return this.$router.push({
                        path: '/administrator/extensions/collection'
                    });
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        this.$snackbar.global.showError(
                            err.response.data.message
                        );
                        return;
                    }
                    this.$snackbar.global.showError(
                        'Error occured! Extension could not be saved'
                    );
                });
            //TODO: Add form dirty
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/collection`)
                .catch(() => {});
        },
        nameToSlug(str) {
            return str
                .toLowerCase()
                .trim()
                .replace(/\s/gi, '-')
                .replace(/[^a-z-0-9]/g, '');
        },
        handleSlugChange: debounce(function(slug, is_not_dirty) {
            this.is_slug_dirty = !is_not_dirty;
            if (this.collection_data.slug.length > 24 && slug.length > 24) {
                this.$set(
                    this.slug_length,
                    'error',
                    'Maximum length for slug is 24'
                );
                return;
            }
            this.$set(this.slug_length, 'error', null);
        }, 100),
        handleDuplicateSlug() {
            const { slug } = this.collection_data;
            this.is_slug_loading = true;
            if (slug.length) {
                ExtensionService.checkDuplicateSlug(slug).then((res) => {
                    if (res.data.slug_exist) {
                        this.$set(
                            this.duplicate_slug,
                            'error',
                            'Slug is already in use, please use different one'
                        );
                    } else {
                        this.$set(this.duplicate_slug, 'error', null);
                        this.collection_data.slug = this.nameToSlug(slug);
                    }
                    this.is_slug_loading = false;
                })
            } else {
                this.is_slug_loading = false;
                this.$set(this.duplicate_slug, 'error', null);
            }
        },
        removeChip(index) {
            this.collection_data.tags.splice(index, 1);
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.collection_data.tags &&
                    this.collection_data.tags.filter(
                        (tag) => tag.display === this.chipInput
                    ).length === 0
                )
                    this.collection_data.tags.push({ display: this.chipInput });
                this.chipInput = '';
            }
            setTimeout(() => {
                this.$refs.tagScroll &&
                    (this.$refs.tagScroll.scrollTop = this.$refs.tagScroll.scrollHeight);
            }, 20);
            event.preventDefault();
        }
    }
};
</script>

<style lang="less">
.image-error {
    .nitrozen-error-visible {
        background: white;
        padding-left: 24px;
    }
}
.three.col {
    position: absolute;
    right: 5px;
    top: 37px;
}
.input {
    position: relative;
}
.loader-main {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    position: relative;
    margin: 0 auto;
}

/* LOADER 1 */

#loader-1:before,
#loader-1:after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    border: 4px solid transparent;
    border-top-color: #2e31be;
}

#loader-1:before {
    z-index: 100;
    animation: spin 0.5s infinite;
}

#loader-1:after {
    border: 4px solid #ccc;
}

@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

.img-cls {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 40px 0px;
}
.create-extension-collection {
    .button-box {
        display: flex;
        align-items: center;
    }
    .new-main-container {
        width: 60%;
        margin: 0 auto;
        .p-24-bg-white {
            padding: 24px;
            background-color: #fff;
        }
        .m-top {
            margin-top: 30px;
        }
        .new-page-container {
            margin: 24px 0;
            border-radius: 6px;

            .image-uploader {
                display: flex;
                justify-content: space-between;
            }
            .main-label {
                margin-bottom: -30px;
                .sub-label-top {
                    color: #9b9b9b;
                    font-size: 12px;
                    line-height: 18px;
                }
                .sub-label-bottom {
                    color: #9b9b9b;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 22px;
                }
            }
            .item-catelogue {
                display: flex;
                justify-content: space-between;
            }
            .no-image-container {
                .inline {
                    margin-top: 35px;
                }
            }
            .image-uploader-container {
                max-width: 200px;
                flex-direction: column;
                .image-uploader,
                .no-image {
                    width: 200px;
                    height: 200px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    background-color: #f8f8f8;
                    border: 1px dashed #2e31be;
                    border-radius: 3px;
                    box-sizing: border-box;
                    cursor: pointer;
                    text-align: center;
                    position: relative;
                    .image {
                        height: auto;
                        width: auto;
                        max-height: 200px;
                        .edit-image {
                            position: absolute;
                            display: flex;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            bottom: 0px;
                            top: 10px;
                            left: 0;
                            justify-content: center;
                            align-items: flex-end;
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        max-height: 200px;
                    }
                }
            }
            .image-uploader-meta {
                padding: 0;
                margin-top: 10px;
                .meta-info {
                    font-size: 12px;
                }
            }
        }
    }
}
.extension-list-container {
    display: grid;
    grid-template-columns: 50% 50%;
}
</style>
