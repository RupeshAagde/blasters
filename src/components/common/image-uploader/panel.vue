<template>
    <div
        class="image-uploader-panel"
        :class="{ highlight }"
        @drop.prevent.stop="onDrop"
        @dragenter.prevent.stop="highlight = true"
        @dragover.prevent.stop="highlight = true"
        @dragleave.prevent.stop="highlight = false"
    >
        <div class="image-uploader-panel-error" v-if="showError">
            <span
                @click="showError = false"
                class="image-uploader-panel-error-close"
                title="Close"
            >
                <inline-svg src="cross-white"></inline-svg>
            </span>
            <span class="image-uploader-panel-error-message">
                {{ errorMessage }}
            </span>
        </div>
        <input
            type="file"
            name="inputFile"
            ref="inputFile"
            :accept="acceptedMIMETypesString"
            @change="handleFile($event.target.files)"
        />

        <!-- <div v-if="value && fileDomain === 'image'"> -->
        <div
            class="image-cropper"
            :class="{ 'full-width': !showGallery }"
            v-if="value && cropping"
            ref="cropperdiv"
        >
            <div class="dimensions">
                {{ dimensions.x }} x {{ dimensions.y }}
            </div>
            <cropper
                ref="cropper"
                :src="src"
                :stencilProps="stencilProps"
                class="cropImgSize"
                areaClassname="image-cropper__area"
                backgroundClassname="image-cropper__background"
                imageClassname="image-cropper__image"
                @change="$cropperChange"
            ></cropper>
        </div>
        <div
            class="image-preview"
            :class="{ 'full-width': !showGallery }"
            v-else-if="value"
        >
            <div class="dimensions">
                {{ dimensions.x }} x {{ dimensions.y }}
            </div>
            <img
                :src="croppedImageFile || value"
                @error="$imagePreviewError"
                ref="previewImage"
                @load="showDimensions($event)"
            />
        </div>
        <!-- </div> -->
        <div v-else class="container">
            <div class="upload-image">
                <img src="/public/assets/admin/pngs/upload.png" />
            </div>
            <span>Drag and drop a {{ label }} here</span>

            <nitrozen-button
                class="upload-button"
                v-stroke-btn
                :rounded="true"
                theme="secondary"
                @click="$refs.inputFile.click()"
                >Upload</nitrozen-button
            >
            <span>Or upload via URL</span>
            <nitrozen-input
                class="image-url"
                type="url"
                placeholder="Enter image URL"
                v-model="imageURL"
                @blur="$onInpurURLChange"
                @keyup.enter="$onInpurURLChange"
                @error="$emit('input', '')"
            ></nitrozen-input>
            <span class="meta-info"
                >Accepted image types: {{ fileTypes.join(', ') }}</span
            >
            <span class="meta-info">
                Max image size: {{ formatBytes(maxSize * 1024) }},
                <span v-if="aspectR"
                    >Aspect ratio: {{ aspectR.x }}:{{ aspectR.y }}</span
                >
            </span>
        </div>
        <loader v-if="loading"></loader>
    </div>
</template>

<script>
import { NitrozenButton, NitrozenInput, strokeBtn } from '@gofynd/nitrozen-vue';
import { Cropper } from 'vue-advanced-cropper';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/inline-svg.vue';
import { debounce } from '@/helper/utils';
import { formatBytes } from '@/helper/digital-storage.util';
import GrindorService from '@/services/grindor.service';
import ApiService from '@/services/api.service';
export default {
    name: 'image-uploader-panel',
    components: {
        NitrozenButton,
        NitrozenInput,
        Cropper,
        InlineSvg,
        loader
    },
    props: {
        label: {
            type: String,
            default: 'image'
        },
        fileTypes: {
            type: Array,
            default: () => {
                return ['png', 'jpeg'];
            }
        },
        fileDomain: {
            type: String,
            default: 'image'
        },
        maxSize: {
            type: Number, // in KB
            default: 2048
        },
        aspectRatio: {
            type: String,
            default: '1:1'
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
        showGallery: {
            type: Boolean,
            default: true
        },
        value: {
            type: String
        }
    },
    directives: {
        strokeBtn
    },
    data: function() {
        return {
            loading: false,
            cropping: false,
            croppedImageFile: '',
            highlight: false,
            showError: false,
            errorMessage: '',
            image: null,
            imageURL: '',
            dimensions: { x: 0, y: 0 },
            hdns: GrindorService.hdns,
        };
    },
    computed: {
        acceptedMIMETypes() {
            return this.fileTypes.map((type) => `${this.fileDomain}/${type}`);
        },
        acceptedMIMETypesString() {
            return this.acceptedMIMETypes.toString();
        },
        aspectR() {
            if (this.aspectRatio == '*') {
                return;
            }
            const splitted = this.aspectRatio.split(':');
            const x = +splitted[0];
            const y = +splitted[1];
            return { x, y };
        },
        stencilProps() {
            if (this.aspectR)
                return {
                    aspectRatio: this.aspectR.x / this.aspectR.y
                };
            else {
                return {};
            }
        },
        src() {
            // try {
            //     // to bypass HDN CORS issue
            //     const url = new URL(this.value);
            //     if (this.hdns.includes(url.hostname)) {
            //         return `${GrindorService.getProxyURL()}?url=${this.value}`;
            //     }
            //     return this.value;
            // } catch (err) {
            //     return this.value;
            // }
            try {
                // to bypass HDN CORS issue
                const url = new URL(this.value);
                if (this.hdns.includes(url.hostname)) {
                    ApiService.get(`${GrindorService.getProxyURL()}?url=${url}`,{}).then((res) => {
                        return res.data
                    });
                }
                return this.value;
            } catch (err) {
                return this.value;
            }
        }
    },
    watch: {
        value(newVal, oldVal) {
            if (this.minimumResolution) {
                var img = new Image();
                img.onload = () => {
                    if (!this.validateDimensions(img)) {
                        this.$snackbar.global.showError(
                            `Selected image don't have minimum required dimensions i.e. ${this.minimumResolution.width} x ${this.minimumResolution.height}`
                        );
                        this.$emit('input', oldVal);
                    }
                };
                img.src = newVal;
            }
        }
    },
    mounted() {},
    methods: {
        formatBytes,
        crop() {
            let image = new Image();
            image.src = this.$refs.cropper.getResult().canvas.toDataURL();
            image.onload = () => {
                if (!this.validateDimensions(image)) {
                    this.$snackbar.global.showError(
                        `Minimum required dimensions are ${this.minimumResolution.width} x ${this.minimumResolution.height}`
                    );
                    return;
                }
                if (this.aspectR) {
                    const aspectQ = (this.aspectR.x / this.aspectR.y).toFixed(
                        2
                    );
                    const imageQ = (image.width / image.height).toFixed(2);
                    if (
                        !(aspectQ <= imageQ + 0.01 && aspectQ >= imageQ - 0.01)
                    ) {
                        console.log(aspectQ, imageQ);
                        this.$snackbar.global.showError(
                            `Aspect ratio not matching with ${this.aspectRatio}`
                        );
                        return;
                    }
                }
                this.croppedImageFile = image.src;
                this.$emit('cropped');
                // this.$emit('input', image.src);
                // this.imageFile = this.changeImageDimension(
                //     image,
                //     image.width,
                //     image.height
                // );
                // image.src = this.imageFile;
                // image.onload = () => {
                //     this.adjustImageDimenion(image);
                // };
            };
        },
        onDrop(e) {
            this.highlight = false;
            const files = e.dataTransfer.files;
            // TODO: allow only one image
            this.handleFile(files);
        },
        handleFile(files) {
            const file = this.getValidFile(files);
            const reader = new FileReader();
            reader.onload = () => {
                // convert image file to base64 string
                this.$emit('input', reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        },
        $cropperChange(e) {
            this.dimensions = {
                x: Math.floor(e.coordinates.width),
                y: Math.floor(e.coordinates.height)
            };
        },
        getValidFile(files) {
            if (files.length > 1) {
                this.errorMessage = 'You have selected more than one files';
                this.showError = true;
                return null;
            }
            if (files.length == 1) {
                const file = [...files][0];
                if (!this.acceptedMIMETypes.includes(file.type)) {
                    this.errorMessage = `${file.type} file type not supported`;
                    this.showError = true;
                    return null;
                }
                if (file.size > this.maxSize * 1024) {
                    this.errorMessage = `Image size exceeds maximum allowable size. i.e. ${formatBytes(
                        this.maxSize * 1024
                    )}`;
                    this.showError = true;
                    return null;
                }
                return file;
            }
        },
        validateDimensions(img) {
            if (
                this.minimumResolution &&
                (img.width < this.minimumResolution.width ||
                    img.height < this.minimumResolution.height)
            ) {
                return false;
            }
            return true;
        },
        showDimensions(e) {
            this.dimensions = {
                x: e.target.naturalWidth,
                y: e.target.naturalHeight
            };
        },
        $onInpurURLChange(e) {
            this.$emit('input', e.target.value);
        },
        $imagePreviewError(e) {
            this.$snackbar.global.showError('Not a valid image URL');
            this.$emit('input', '');
        }
    }
};
</script>

<style lang="less" scoped>
.image-uploader-panel {
    display: flex;
    width: auto;
    height: 480px;
    background-color: @Alabaster2;
    border: 1px dashed @Iron;
    border-radius: @BorderRadius;
    .dimensions {
        display: inline-block;
        position: absolute;
        bottom: 25px;
        left: 26px;
        background: white;
        padding: 0 6px;
        z-index: 1;
    }
    .image-cropper {
        display: flex;
        justify-content: center;
        flex: 1;
        background-color: #4d4d4e96;
        .cropImgSize {
            max-width: 425px;
            max-height: 480px;
        }
        ::v-deep .image-cropper__area {
            max-width: 425px;
            max-height: 480px;
            .vue-square-handler {
                width: 4px;
                height: 4px;
            }
            .vue-handler-wrapper--east,
            .vue-handler-wrapper--west {
                .vue-square-handler {
                    height: 45px;
                    border-radius: 4px;
                }
            }
            .vue-handler-wrapper--north,
            .vue-handler-wrapper--south {
                .vue-square-handler {
                    width: 45px;
                    border-radius: 4px;
                }
            }
        }
        ::v-deep .image-cropper__background {
            background: #4d4d4e96;
            opacity: 0.59 !important;
            max-width: 425px;
            max-height: 480px;
        }
        ::v-deep .image-cropper__image {
            max-width: 425px;
            max-height: 480px;
        }

        &.full-width {
            .cropImgSize {
                max-width: 900px;
            }
            ::v-deep .image-cropper__area {
                max-width: 900px;
            }
            ::v-deep .image-cropper__background {
                max-width: 900px;
            }
            ::v-deep .image-cropper__image {
                max-width: 900px;
            }
        }
    }
    .image-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        background: white;
        max-width: 425px;
        max-height: 480px;
        overflow: hidden;
        img {
            max-width: 425px;
            max-height: 480px;
        }
        &.full-width {
            max-width: 900px;
            img {
                max-width: 900px;
            }
        }
    }
    .image-uploader-panel-error {
        width: 330px;
        height: 406px;
        padding: 48px;
        background-color: #4d4d4e;
        color: white;
        font-size: 16px;
        position: absolute;
        z-index: 1;
        opacity: 0.96;
        display: flex;
        align-items: center;
        .image-uploader-panel-error-close {
            display: inline-block;
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
        }
        .image-uploader-panel-error-message {
            text-align: center;
        }
    }
    input[type='file'] {
        display: none;
    }
    .container {
        display: flex;
        flex-direction: column;
        margin: 24px;
        padding: 24px;
        width: 100%;
        background-color: @White;
        border: 1px dashed #d7d7d7;
        border-radius: @BorderRadius;
        align-items: center;
        color: #61636a;
        font-size: 16px;
        line-height: 23px;
        text-align: center;
        .upload-image {
            width: 100%;
            margin-bottom: 36px;
        }
        .upload-button {
            margin: 12px;
        }
        .image-url {
            margin: 8px 0 24px;
        }
        .meta-info {
            color: @DustyGray2;
            font-size: 14px;
            line-height: 20px;
        }
    }

    &.highlight {
        .container {
            border: 1px dashed @RoyalBlue;
        }
    }
}
</style>
