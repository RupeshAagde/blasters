<template>
    <div>
        <div v-if="label" class="n-input-label-container">
            <label class="n-input-label">{{ label }}</label>
        </div>
        <div class="image-uploader-container">
            <div class="image-uploader">
                <div v-if="value" class="image">
                    <img :src="value" @error="$imageError" />
                    <div
                        class="edit-image"
                        v-if="!loading"
                        @click.stop="openDialog()"
                    >
                        <inline-svg title="Edit image" src="image-edit" />
                    </div>
                </div>
                <div v-else class="no-image" @click.stop="openDialog">
                    <inline-svg src="plus-black" class="add-image" />
                </div>
            </div>
            <loader class="image-uploading" v-if="loading" />
        </div>
        <image-uploader-dialog
            ref="dialog"
            v-model="value"
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
        />
    </div>
</template>

<script>
// Copied from mirage on 20/07/2020
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/inline-svg.vue';
import { formatBytes } from '@/helper/digital-storage.util';
import ImageUploaderDialog from './dialog.vue';

export default {
    name: 'mini-image-uploader',
    components: {
        ImageUploaderDialog,
        InlineSvg,
        loader
    },
    props: {
        label: {
            type: String
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
    flex-direction: column;
    .image-uploader {
        width: auto;
        height: 40px;
        border: 1px dashed @RoyalBlue;
        border-radius: @BorderRadius;
        .image {
            width: 40px;
            height: 40px;
            img {
                width: auto;
                height: 40px;
                display: block;
                margin: 0 auto;
            }
            .edit-image {
                position: relative;
                display: inline-block;
                cursor: pointer;
                left: 35px;
                top: -10px;
            }
        }
        .no-image {
            width: 40px;
            height: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: @Snow;
            cursor: pointer;
            .add-image {
                ::v-deep {
                    svg {
                        width: 40px;
                        height: 40px;
                        #prefix__Group {
                            stroke: #d5daff;
                        }
                    }
                }
            }
        }
    }
    .image-uploading {
        padding: 0;
        position: absolute;
        height: 42px;
        width: 42px;
        background: white;
        opacity: 0.6;
        img {
            height: 42px;
        }
    }
}
</style>
