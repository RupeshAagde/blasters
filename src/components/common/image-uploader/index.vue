<template>
    <div>
        <div v-if="label" class="n-input-label-container"><label class="n-input-label">{{label}}</label></div>
        <div class="image-uploader-container">
            <div class="image-uploader">
                <div v-if="value" class="image">
                    <img :src="value" @error="$imageError" />
                    <div
                        class="edit-image"
                        v-if="!loading"
                        @click.stop="openDialog()"
                    >
                        <inline-svg
                            title="Edit image"
                            src="image-edit"
                        ></inline-svg>
                    </div>
                </div>
                <div v-else class="no-image" @click.stop="openDialog">
                    <inline-svg
                        src="plus-black"
                        class="add-image"
                    ></inline-svg>
                    <span class="label">{{ text }}</span>
                </div>
            </div>
            <div class="image-uploader-meta">
                <span class="meta-info">
                    Accepted image types: {{ fileTypes.join(', ') }}
                </span>
                <span class="meta-info">
                    Max image size: {{ formatBytes(maxSize * 1024) }}
                </span>
                <span class="meta-info">
                    Aspect ratio:
                    {{
                        aspectRatio
                            ? aspectRatio == '*'
                                ? 'Original'
                                : aspectRatio
                            : '1:1'
                    }}
                </span>
            </div>
            <loader class="image-uploading" v-if="loading"></loader>
        </div>
        <image-uploader-dialog
            ref="dialog"
            :label="label"
            :fileTypes="fileTypes"
            :maxSize="maxSize"
            :aspectRatio="aspectRatio"
            :minimumResolution="minimumResolution"
            :maximumResolution="maximumResolution"
            :recommendedResolution="recommendedResolution"
            :mediaFolder="mediaFolder"
            :namespace="namespace"
            :fileName="fileName"
            :showGallery="showGallery"
            @delete="$emit('delete', $event)"
            @save="$emit('save', $event)"
            v-model="value"
            :height="dialogHeight"
        ></image-uploader-dialog>
    </div>
</template>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/inline-svg.vue';
import ImageUploaderDialog from './dialog.vue';
import { formatBytes } from '@/helper/digital-storage.util';
export default {
    name: 'image-uploader',
    components: {
        ImageUploaderDialog,
        NitrozenDialog,
        InlineSvg,
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
            type: String
        },
        fileTypes: {
            type: Array,
            default: () => {
                return ['png', 'jpeg'];
            }
        },
        maxSize: {
            type: Number, // in KB
            default: 2048
        },
        loading: {
            type: Boolean,
            default: false
        },
        mediaFolder: {
            type: String
        },
        namespace: {
            type: String
        },
        fileName: {
            type: String
        },
        showGallery: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        dialogHeight: {
            type: String,
            default: ''
        }
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
        }
    }
};
</script>

<style lang="less" scoped>
.image-uploader-container {
    display: flex;
    .image-uploader {
        width: auto;
        height: 80px;
        border: 1px dashed @RoyalBlue;
        border-radius: @BorderRadius;
        .image {
            width: 80px;
            height: 80px;
            img {
                width: auto;
                height: 80px;
                display: block;
                margin: 0 auto;
            }
            .edit-image {
                position: relative;
                display: inline-block;
                cursor: pointer;
                left: 65px;
                top: -20px;
            }
        }
        .no-image {
            width: 80px;
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: @Snow;
            cursor: pointer;
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
        }
    }
    .image-uploader-meta {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 12px;
        background-color: @Alabaster2;
        flex: 1;
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
