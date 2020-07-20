<template>
    <div>
        <div class="image-uploader-container">
            <div class="image-uploader">
                <div v-if="value.url">
                    <div v-if="value.type === 'image'" class="image">
                        <img
                            :src="value.url"
                            @error="$imageError"
                            @mouseover="showOptions = true"
                            @mouseleave="showOptions = false"
                        />
                        <div
                            v-if="showOptions"
                            @mouseover="showOptions = true"
                            @mouseleave="showOptions = false"
                        >
                            <div
                                class="delete-image"
                                v-if="!loading"
                                @click.stop="$emit('delete', $event)"
                            >
                                <ukt-inline-svg
                                    title="Delete image"
                                    src="delete"
                                    class="delete-icon"
                                ></ukt-inline-svg>
                            </div>
                            <div
                                class="edit-image"
                                v-if="!loading"
                                @click.stop="openDialog()"
                            >
                                <ukt-inline-svg
                                    title="Edit image"
                                    src="image-edit"
                                ></ukt-inline-svg>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else-if="value.type === 'video'"
                        class="image"
                        @mouseover="showOptions = true"
                        @mouseleave="showOptions = false"
                    >
                        <no-ssr>
                            <iframe
                                class="iframe"
                                width="360"
                                height="270"
                                :src="value.url"
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </no-ssr>
                        <div
                            v-if="showOptions"
                            @mouseover="showOptions = true"
                            @mouseleave="showOptions = false"
                        >
                            <div
                                class="delete-image"
                                v-if="!loading"
                                @click.stop="$emit('delete', $event)"
                            >
                                <ukt-inline-svg
                                    title="Delete video"
                                    src="delete"
                                    class="delete-icon"
                                ></ukt-inline-svg>
                            </div>
                            <div
                                class="edit-image"
                                v-if="!loading"
                                @click.stop="openYoutubeDialog(true, value)"
                            >
                                <ukt-inline-svg
                                    title="Edit video"
                                    src="image-edit"
                                ></ukt-inline-svg>
                            </div>
                        </div>
                    </div>
                    <!-- <div v-if="type === 'video'" class="image">
                        <no-ssr>
                            <video-player class="iframe" :options="videoOptions" />
                        </no-ssr>
                    </div>-->
                </div>
                <div v-else class="no-image-container">
                    <div class="inline">
                        <div
                            class="no-image right-gutter"
                            @click.stop="openImageDialog"
                        >
                            <ukt-inline-svg
                                src="plus-black"
                                class="add-image"
                            ></ukt-inline-svg>
                            <span class="label">Image</span>
                            <div v-if="false" class="image-uploader-meta">
                                <span class="meta-info"
                                    >Formats: {{ fileTypes.join(', ') }}</span
                                >
                                <span class="meta-info">
                                    Max size:
                                    {{ formatBytes(maxSize * 1024) }}
                                </span>
                                <span class="meta-info">
                                    Aspect ratio:{{
                                        aspectRatio
                                            ? aspectRatio == '*'
                                                ? 'Original'
                                                : aspectRatio
                                            : '1:1'
                                    }}
                                </span>
                            </div>
                        </div>
                        <div class="no-image">
                            <video-uploader
                                class="video-uploader-container"
                                namespace="products-item-video"
                                :fileName="fileName"
                                :customInput="true"
                                :customVideo="true"
                                @save="
                                    save($event, 'video', { source: 'direct' })
                                "
                            >
                                <template slot="customInput">
                                    <label
                                        for="videoUploader"
                                        class="video-upload"
                                    >
                                        <ukt-inline-svg
                                            src="plus-black"
                                            class="add-image"
                                        ></ukt-inline-svg>
                                        <span class="label">Video</span>
                                    </label>
                                </template>
                            </video-uploader>
                            <!-- <span class="sub-label">Coming soon</span> -->
                        </div>
                    </div>
                    <div class="inline top-gutter">
                        <div
                            class="no-image right-gutter"
                            @click.stop="openYoutubeDialog"
                        >
                            <ukt-inline-svg
                                src="plus-black"
                                class="add-image"
                            ></ukt-inline-svg>
                            <span class="label">YouTube</span>
                            <!-- <span class="sub-label">Coming soon</span> -->
                        </div>
                        <div class="no-image disabled">
                            <!-- <ukt-inline-svg
                                src="plus-black"
                                class="add-image"
                            ></ukt-inline-svg>-->
                            <span class="label">3D Model</span>
                            <span class="sub-label">Coming soon</span>
                        </div>
                    </div>
                </div>
            </div>
            <loader class="image-uploading" v-if="loading"></loader>
        </div>
        <image-uploader-dialog
            ref="dialog"
            :label="label"
            :fileTypes="fileTypes"
            :fileDomain="fileDomain"
            :maxSize="maxSize"
            :aspectRatio="aspectRatio"
            :minimumResolution="minimumResolution"
            :maximumResolution="maximumResolution"
            :recommendedResolution="recommendedResolution"
            :mediaFolder="mediaFolder"
            :namespace="namespace"
            :fileName="fileName"
            @delete="$emit('delete', $event)"
            @save="save($event, 'image')"
            v-model="value.url"
        ></image-uploader-dialog>
        <youtube-uploader
            ref="youtubeUploader"
            v-model="value.url"
            @save="save($event, 'video')"
        ></youtube-uploader>
        <video-uploader
            v-if="value.url && value.type === 'video'"
            namespace="products-item-video"
            ref="videoUploader"
            :uploaderId="`videoUploader${index}`"
            :fileName="fileName"
            :customInput="true"
            :customVideo="true"
            @save="save($event, 'video', { source: 'direct' })"
        >
            <template name="customVideo"></template>
        </video-uploader>
    </div>
</template>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import ImageUploaderDialog from './dialog.vue';
import YoutubeUploader from '@/components/admin/common/video-uploader/youtube';
import VideoUploader from '@/components/admin/common/video-uploader/video.vue';
import { formatBytes } from '@/helper/digital-storage.util';
import NoSSR from 'vue-no-ssr';
import VideoPlayer from '@/components/common/video/VideoPlayer.vue';

const ONE_MB = 1024;
const ONE_GB = ONE_MB * 1024;

// "media": [
//     {
//       "url": "https://www.youtube.com/embed/x0Kv_QRWR-I",
//       "type": "video",
//       "meta": {
//           "source": "youtube"
//       }
//     }
//   ],
export default {
    name: 'image-uploader-banner',
    components: {
        ImageUploaderDialog,
        NitrozenDialog,
        'ukt-inline-svg': uktinlinesvg,
        'no-ssr': NoSSR,
        VideoUploader,
        VideoPlayer,
        YoutubeUploader,
        loader
    },
    props: {
        label: {
            type: String
        },
        text: {
            type: String,
            default: 'Upload'
        },
        aspectRatio: {
            type: String
        },
        minimumResolution: {
            type: Object
        },
        maximumResolution: {
            type: Object
        },
        recommendedResolution: {
            type: Object
        },
        value: {
            type: Object,
            default: () => {
                return {};
            }
        },
        type: {
            type: String,
            default: 'image'
        },
        loading: {
            type: Boolean,
            default: false
        },
        mediaFolder: {
            type: String
        },
        // namespace: {
        //     type: String
        // },
        fileName: {
            type: String
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            showOptions: false,
            namespace: 'products-item-image',
            fileTypes: ['png', 'jpeg'],
            fileDomain: 'image',
            maxSize: ONE_MB * 3,

            videoOptions: {
                autoplay: false,
                controls: false,
                width: 360,
                height: 270,
                sources: [
                    {
                        src:
                            'https://res.cloudinary.com/dwzm9bysq/video/upload/v1587625799/ark/production/order/video_file/null/5dda683944ef371d6c106480/product_VID-20200415-WA0001.mp4',
                        type: 'video/mp4'
                    }
                ]
            }
        };
    },
    methods: {
        formatBytes,
        openDialog() {
            this.$refs.dialog.open();
        },
        $imageError(e) {
            // handle error
            // this.$emit('input', '');
            console.error(e);
        },
        openImageDialog() {
            this.namespace = 'products-item-image';
            this.fileTypes = ['png', 'jpeg'];
            this.fileDomain = 'image';
            this.maxSize = ONE_MB * 3;
            this.openDialog();
        },
        // openVideoDialog() {
        //     this.namespace = 'products-item-video';
        //     this.fileTypes = ['mp4'];
        //     this.fileDomain = 'video';
        //     this.maxSize = ONE_GB;
        //     this.openDialog();
        // },
        openYoutubeDialog(editMode = false, media = {}) {
            if (media && media.meta && media.meta.source === 'direct') {
                this.$refs.videoUploader.openVideoUploader();
            } else {
                this.$refs.youtubeUploader.open(editMode);
            }
        },
        save(url, type, meta) {
            this.$emit('save', {
                url,
                type,
                ...(meta && { meta })
            });
        }
    }
};
</script>

<style lang="less" scoped>
.image-uploader-container {
    display: flex;
    .image-uploader {
        // width: auto;
        // height: 80px;
        .image {
            width: 250px;
            height: 250px;
            position: relative;
            background-color: @Alabaster2;
            border: 1px dashed @RoyalBlue;
            border-radius: @BorderRadius;
            img {
                object-fit: contain;
                display: block;
                margin: 0 auto;
                width: 100%;
                height: 100%;
            }
            .delete-image {
                position: absolute;
                display: inline-block;
                cursor: pointer;
                right: 4px;
                top: 4px;
            }
            .edit-image {
                position: absolute;
                display: inline-block;
                cursor: pointer;
                right: 34px;
                top: 4px;
            }
            .iframe {
                width: 100%;
                height: 100%;
            }
        }
        .no-image-container {
            .inline {
                display: flex;
            }
            .top-gutter {
                margin-top: 12px;
            }
            .right-gutter {
                margin-right: 12px;
            }
            .no-image {
                width: 118px;
                height: 118px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                background-color: @Alabaster2;
                border: 1px dashed @RoyalBlue;
                border-radius: @BorderRadius;
                cursor: pointer;
                &.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                .add-image {
                    ::v-deep {
                        svg {
                            width: 60px;
                            height: 60px;
                            #prefix__Group {
                                stroke: #d5daff;
                            }
                        }
                    }
                }
                .label {
                    color: @RoyalBlue;
                    font-size: 14px;
                    font-weight: 500;
                }
                .sub-label {
                    color: @DustyGray2;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 22px;
                }
                .video-uploader-container {
                    width: 100%;
                    height: 100%;
                    .video-upload {
                        text-align: center;
                        width: 100%;
                        display: block;
                        cursor: pointer;
                        height: 100%;
                        margin: auto;
                        align-items: center;
                        padding: 21px 0px;
                    }
                }
            }
        }
    }
    .image-uploader-meta {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 12px;
        margin-top: 24px;
        align-items: center;
        .meta-info {
            color: @DustyGray2;
            font-size: 13px;
            line-height: 20px;
        }
    }
    .image-uploading {
        padding: 0;
        position: absolute;
        height: 82px;
        width: 82px;
        background: white;
        opacity: 0.6;
        img {
            height: 82px;
        }
    }
}
</style>
