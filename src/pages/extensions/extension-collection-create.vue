<template>
    <div class="panel create-extension-collection">
        <div class="page-header-position">
            <page-header @backClick="onCancel" :title="'Extension Collection'">
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >Create</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button
                        @click="saveForm(true)"
                        class="footer-actions"
                        v-flatBtn
                        theme="secondary"
                        >Create</nitrozen-button
                    >
                </template>
            </page-header>
        </div>
        <div v-if="isEditMode()" class="new-main-container">
            <div class="new-page-container">
                <div class="section p-24-bg-white">
                    <div class="cl-Mako bold-md">Basic Details</div>
                    <loader v-if="inProgress" class="loading"></loader>
                    <!-- Name -->
                    <div class="input">
                        <nitrozen-input
                            label="Name *"
                            placeholder="For eg. Summer Styles, Suit Up, etc."
                            v-model="collection_data.name"
                            :showSuffix="true"
                            :custom="true"
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
                            pattern="[a-z0-9]+(?:--?[a-z0-9]+)*"
                            placeholder="For eg. summer-styles"
                            v-model="collection_data.slug"
                            tooltipText="Part of the URL that explains the page’s content. Allowed characters are alphabets, numbers and hyphens."
                            :showTooltip="true"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="errors.slug"
                        >
                            {{ errors.slug }}
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
                            label="Description"
                            :maxlength="150"
                            placeholder="For eg. Slay in style with our cool summer collection"
                            v-model="collection_data.desc"
                            :showSuffix="true"
                            :custom="true"
                        >
                        </nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="errors.desc"
                            >{{ errors.desc }}</nitrozen-error
                        >
                    </div>
                </div>
                <!-- Image Upload -->
                <div class="image-uploader p-24-bg-white">
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">Icon</div>
                            <div class="sub-label-bottom">
                                (Web &amp; Mobile)
                            </div>
                        </div>
                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div v-if="collection_data.banner.logo == ''">
                                    <image-uploader
                                        :showGallery="false"
                                        class="
                                            nitrozen-form-input
                                            logo-container
                                        "
                                        label="Icon*"
                                        aspectRatio="1:1"
                                        :minimumResolution="{
                                            width: 200,
                                            height: 200,
                                        }"
                                        :maximumResolution="{
                                            width: 256,
                                            height: 256,
                                        }"
                                        @delete="
                                            collection_data.banner.logo = ''
                                        "
                                        @save="onChangeImage($event, 'logo')"
                                        v-model="collection_data.banner.logo"
                                        :mediaFolder="collection_data.slug"
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="collection_data.banner.logo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">Landscape Banner</div>
                            <div class="sub-label-bottom">{Web}</div>
                        </div>

                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div
                                    v-if="collection_data.banner.portrait == ''"
                                >
                                    <image-uploader
                                        :showGallery="false"
                                        class="
                                            nitrozen-form-input
                                            logo-container
                                        "
                                        label="Icon*"
                                        aspectRatio="13:20"
                                        :minimumResolution="{
                                            width: 130,
                                            height: 200,
                                        }"
                                        :maximumResolution="{
                                            width: 312,
                                            height: 480,
                                        }"
                                        @delete="
                                            collection_data.banner.portrait = ''
                                        "
                                        @save="
                                            onChangeImage($event, 'portrait')
                                        "
                                        v-model="
                                            collection_data.banner.portrait
                                        "
                                        :mediaFolder="
                                            collection_data.banner.portrait
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="collection_data.banner.portrait"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="main-label">
                            <div class="sub-label-top">Portrait Banner</div>
                            <div class="sub-label-bottom">{Web}</div>
                        </div>

                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div
                                    v-if="
                                        collection_data.banner.landscape == ''
                                    "
                                >
                                    <image-uploader
                                        :showGallery="false"
                                        class="
                                            nitrozen-form-input
                                            logo-container
                                        "
                                        label="Icon*"
                                        aspectRatio="27:20"
                                        :minimumResolution="{
                                            width: 540,
                                            height: 400,
                                        }"
                                        :maximumResolution="{
                                            width: 1242,
                                            height: 920,
                                        }"
                                        @delete="
                                            collection_data.banner.landscape =
                                                ''
                                        "
                                        @save="
                                            onChangeImage($event, 'landscape')
                                        "
                                        v-model="
                                            collection_data.banner.landscape
                                        "
                                        :mediaFolder="
                                            collection_data.banner.landscape
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="collection_data.banner.landscape"
                                    />
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
                            v-model="collection_data.tags"
                            label="Tags"
                        ></tags-input>
                    </div>
                </div>
                <div class="input p-24-bg-white m-top">
                    <div class="item-catelogue">
                        <div class="cl-Mako bold-md">Extensions</div>
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
                </div>
                <item-drawer
                    v-show="showExtensionModal"
                    :isOpen="showExtensionModal"
                    :isCancelable="true"
                    :title="'Exntension List'"
                    v-on:onAddExtensions="addSelectedExtensions"
                    :selected_extensions="collection_data.selected_extensions"
                    v-on:closeModal="closeModal"
                    @handleModalRef="setModalRef"
                >
                </item-drawer>
                <div class="p-24-bg-white">
                    <page-empty
                        :text="'No Extension selected for this Collection'"
                        v-if="!collection_data.selected_extensions.length"
                    >
                    </page-empty>
                    <div
                        v-if="collection_data.selected_extensions.length"
                        class="extension-list-container"
                    >
                        <div
                            class="extension-card"
                            v-for="(
                                extension, index
                            ) in collection_data.selected_extensions"
                            :key="index"
                            :ref="'extension-' + index"
                        >
                            <nitrozen-checkbox
                                v-on:input="selectExtension($event, extension)"
                                v-model="extension.is_selected"
                            >
                            </nitrozen-checkbox>
                            <div class="base-card-left">
                                <img
                                    class="ext-icon"
                                    :src="extension.listing_info.icon"
                                />
                            </div>
                            <div class="base-card-right">
                                <div class="extension-name">
                                    {{ extension.listing_info.name }}
                                </div>
                                <div class="extension-creator">
                                    by {{ extension.organization.name }}
                                </div>
                                <div class="extension-tag-line">
                                    {{ extension.listing_info.tagline }}
                                </div>
                                <div class="extension-price">
                                    <span
                                        v-if="
                                            extension.plans &&
                                            extension.plans.length &&
                                            extension.plans[0].price.amount
                                        "
                                        >{{
                                            extension.plans[0].price.amount
                                                | currencyformat
                                        }}
                                        <span class="capitalize">
                                            /
                                            {{
                                                extension.plans[0].recurring &&
                                                extension.plans[0].recurring
                                                    .type
                                            }}</span
                                        ></span
                                    >
                                    <span v-else>Free</span>
                                </div>
                            </div>
                        </div>
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
                        :url="`https://test-app-2.hostx0.de/collection/`"
                    />
                </div>
            </div>
        </div>

        <loader v-if="pageLoading && !pageError"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="fetchExtension"
        ></page-error>
        <div class="main-container" v-else>
            <loader v-if="inProgress" class="loading"></loader>
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
import dummy from './dummy_ext_collection.json';

export default {
    name: 'extension-review',
    components: {
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
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            isCollapsed: true,
            showExtensionModal: false,
            inProgress: false,
            pageError: false,
            pageLoading: false,
            isPageLoading: true,
            collection_data: {
                collection_category: 'extension',
                collection_type: 'handpicked',
                seo: {
                    title: 'Title',
                    description: 'Breif description about the',
                },
                banner: {
                    logo: '',
                    portrait: '',
                    landscape: '',
                },
                name: '',
                tags: [],
                current_status: '',
                selected_extensions: [],
                icon: '',
            },
            errors: {
                name: '',
            },
            tags: [],
            chipInput: '',
            fynd_platform_domain: 'fynd.com',
            selected_extensions: [],
            modalRef: null,
        };
    },
    computed: {},
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        if (this.$route.query.id) {
            this.fetchExtensionCollectionDetails(this.$route.query.id);
            console.log('>>this.$route.query', this.$route.query);
        }
        this.fetchExtension();
    },
    methods: {
        isEditMode() {
            if (this.$route.query.id) {
                return !this.isPageLoading;
            }
            return true;
        },
        fetchExtensionCollectionDetails(id) {
            this.isPageLoading = true;
            this.collection_data = dummy.find((x) => x._id === id);
            this.isPageLoading = false;
            this.$set(this.collection_data, 'tags', this.collection_data.tags);
            console.log('>>this.collection_data', this.collection_data);
        },
        setModalRef(modalRef) {
            this.modalRef = modalRef;
        },
        addSelectedExtensions(selected_extensions) {
            this.selected_extensions = selected_extensions;
            this.collection_data.selected_extensions = selected_extensions;
            this.showExtensionModal = false;
        },
        addProducts() {
            this.modalRef && this.modalRef.open();
            this.showExtensionModal = true;
        },
        closeModal() {
            this.showExtensionModal = false;
            this.modalRef && this.modalRef.close();
        },
        onSelectedFilters() {},
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
        onChangeImage(event, name) {
            this.collection_data.banner[name] = event;
            document.body.style = {
                ...document.body.style,
                position: 'relative',
            };
        },
        formatBytes,
        fetchExtension() {},
        saveForm(approve) {
            console.log('>>this', this);
            // this.error_comments = '';
            // this.review_data.current_status = approve
            //     ? 'published'
            //     : 'rejected';
            // if (!approve && !this.review_data.review_comments) {
            //     this.error_comments =
            //         'Review comments required for rejecting extension changes';
            //     this.$snackbar.global.showError('Missing required data');
            //     return;
            // }
            // this.inProgress = true;
            //TODO: Add form dirty
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
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
                    (this.$refs.tagScroll.scrollTop =
                        this.$refs.tagScroll.scrollHeight);
            }, 20);
            event.preventDefault();
        },
    },
};
</script>

<style lang="less">
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
                margin-top: 20px;
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
                    .image {
                        width: 200px;
                        height: 200px;
                    }
                    img {
                        width: 200px;
                        height: 200px;
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
    .extension-card {
        min-width: 200px;
        display: flex;
        align-items: center;
        margin: 10px;
        padding: 10px;
        transition: all 0.5s ease;
        border: 1px solid #e0e0e0;
        &:hover {
            transition: all 0.5s ease;
            box-shadow: 0 9px 13px 0 rgb(221 221 221);
        }
    }
    .base-card-left {
        .ext-icon {
            width: 100px;
        }
    }
    .base-card-right {
        flex: 1;
        padding-left: 24px;
        word-break: break-all;
        .extension-name {
            color: @RoyalBlue;
            font-weight: 500;
            margin-bottom: 6px;
            line-height: 1.5;
            font-size: 16px;
            // white-space: nowrap;
        }
        .extension-creator {
            color: @Mako;
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: 400;
        }
        .extension-tag-line {
            color: @Mako;
            margin-bottom: 18px;
            line-height: 19px;
            font-size: 14px;
            font-weight: 300;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .extension-price {
            color: @Mako;
            font-weight: 300;
            margin-bottom: 6px;
        }
    }
}
</style>