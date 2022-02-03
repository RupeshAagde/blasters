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
        <div class="new-main-container">
            <div class="new-page-container">
                <div class="section">
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
                <div class="image-uploader">
                    <div class="no-image-container">
                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div v-if="collection_data.imageObj.logo == ''">
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
                                            collection_data.imageObj.logo = ''
                                        "
                                        @save="onChangeImage($event, 'logo')"
                                        v-model="collection_data.imageObj.logo"
                                        :mediaFolder="collection_data.slug"
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="collection_data.imageObj.logo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div
                                    v-if="
                                        collection_data.imageObj.portrait == ''
                                    "
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
                                            collection_data.imageObj.portrait =
                                                ''
                                        "
                                        @save="
                                            onChangeImage($event, 'portrait')
                                        "
                                        v-model="
                                            collection_data.imageObj.portrait
                                        "
                                        :mediaFolder="
                                            collection_data.imageObj.portrait
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="collection_data.imageObj.portrait"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-image-container">
                        <div class="inline">
                            <div class="no-image right-gutter">
                                <div
                                    v-if="
                                        collection_data.imageObj.landscape == ''
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
                                            collection_data.imageObj.landscape =
                                                ''
                                        "
                                        @save="
                                            onChangeImage($event, 'landscape')
                                        "
                                        v-model="
                                            collection_data.imageObj.landscape
                                        "
                                        :mediaFolder="
                                            collection_data.imageObj.landscape
                                        "
                                        :fileName="'logo'"
                                        :namespace="'icon'"
                                    ></image-uploader>
                                </div>
                                <div v-else>
                                    <img
                                        class="img-cls"
                                        :src="
                                            collection_data.imageObj.landscape
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input">
                    <tags-input
                        class="nitrozen-form-input"
                        v-model="collection_data.tags"
                        label="Search Keywords"
                    ></tags-input>
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
} from '@gofynd/nitrozen-vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import imageUploader from '@/components/common/image-uploader/index.vue';
import root from 'window-or-global';
import { formatBytes } from '@/helper/digital-storage.util';
const env = root.env || {};
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import tagsInput from '@/components/common/tags-input.vue';

export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        'image-uploader': imageUploader,
        'ukt-inline-svg': uktinlinesvg,
        'tags-input': tagsInput,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            collection_data: {
                imageObj: {
                    logo: '',
                    portrait: '',
                    landscape: '',
                },
                name: '',
                tags: '',
                current_status: '',
                icon: '',
            },
            errors: {
                name: '',
            },
            fynd_platform_domain: 'fynd.com',
        };
    },
    computed: {},
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        this.fetchExtension();
    },
    methods: {
        onChangeImage(event, name) {
            this.collection_data.imageObj[name] = event;
            console.log('>>event', event);
        },
        formatBytes,
        fetchExtension() {},
        saveForm(approve) {
            this.error_comments = '';
            this.review_data.current_status = approve
                ? 'published'
                : 'rejected';
            if (!approve && !this.review_data.review_comments) {
                this.error_comments =
                    'Review comments required for rejecting extension changes';
                this.$snackbar.global.showError('Missing required data');
                return;
            }
            this.inProgress = true;
            //TODO: Add form dirty
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        },
    },
};
</script>

<style lang="less">
.create-extension-collection {
    .new-main-container {
        width: 60%;
        margin: 0 auto;

        .new-page-container {
            padding: 24px;
            margin: 24px 0;
            background-color: #fff;
            border-radius: 6px;
            .image-uploader {
                display: flex;
                justify-content: space-between;
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
</style>