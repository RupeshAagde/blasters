<template>
    <transition name="modal">
        <div v-bind:class="{ uploading: loading }">
            <!-- <loader
                v-if="visible && loading"
                class="loading uploading"
            ></loader>-->
            <nitrozen-dialog ref="dialog" :title="title">
                <template slot="body">
                    <div class="dialog-body">
                        <image-uploader-panel
                            :label="label"
                            :fileTypes="fileTypes"
                            :fileDomain="fileDomain"
                            :maxSize="maxSize"
                            :aspectRatio="aspectRatio"
                            :minimumResolution="minimumResolution"
                            :maximumResolution="maximumResolution"
                            :recommendedResolution="recommendedResolution"
                            :showGallery="showGallery"
                            v-model="imageURL"
                            @cropped="$setCropping(false, true)"
                            ref="imageuploaderpanel"
                        ></image-uploader-panel>
                        <div class="dialog-saperator" v-if="showGallery"></div>
                        <image-uploader-list
                            v-if="visible && showGallery"
                            :mediaFolder="mediaFolder"
                            :namespace="namespace"
                            :minimumResolution="minimumResolution"
                            @imageSelected="$setImage"
                        ></image-uploader-list>
                    </div>
                </template>
                <template slot="footer">
                    <div
                        class="footer-event"
                        :class="{ 'left-align': !showGallery }"
                    >
                        <nitrozen-button
                            v-if="imageURL && !edit"
                            :disabled="loading"
                            theme="secondary"
                            @click="$removeImage"
                            >Delete</nitrozen-button
                        >
                        <nitrozen-button
                            v-if="fileDomain == 'image' && imageURL && !edit"
                            :disabled="loading"
                            theme="secondary"
                            @click="$setCropping(true)"
                            >Edit</nitrozen-button
                        >
                        <nitrozen-button
                            v-if="edit"
                            theme="secondary"
                            @click="$setCropping(false)"
                            >Discard</nitrozen-button
                        >
                        <nitrozen-button
                            v-if="edit"
                            theme="secondary"
                            @click="$refs.imageuploaderpanel.crop()"
                            >Crop</nitrozen-button
                        >
                    </div>
                    <div class="footer-saperator"></div>
                    <nitrozen-button
                        v-show="(!isHDNImage && !isEmpty) || isCropped"
                        theme="secondary"
                        :disabled="edit || loading || isEmpty"
                        v-flat-btn
                        @click="$saveImage"
                    >
                        Upload
                    </nitrozen-button>
                    <nitrozen-button
                            v-show="(isHDNImage || isEmpty) && !isCropped"
                            theme="secondary"
                            :disabled="edit || loading"
                            v-flat-btn
                            @click="$selectImage"
                        >
                            Select
                        </nitrozen-button>
                </template>
            </nitrozen-dialog>
        </div>
    </transition>
</template>

<script>
import { NitrozenButton, flatBtn, NitrozenDialog } from '@gofynd/nitrozen-vue';
import ImageUploaderPanel from './panel.vue';
import ImageUploaderList from './list.vue';
import loader from '@/components/common/loader';
import GrindorService from '@/services/grindor.service';
import axios from 'axios';
import mime from 'mime-types';

export default {
    name: 'image-uploader-dialog',
    components: {
        NitrozenButton,
        NitrozenDialog,
        ImageUploaderPanel,
        ImageUploaderList,
        loader,
    },
    directives: {
        flatBtn,
    },
    props: {
        label: {
            type: String,
            default: 'image',
        },
        fileTypes: {
            type: Array,
            default: () => {
                return ['png', 'jpeg'];
            },
        },
        fileDomain: {
            type: String,
            default: 'image',
        },
        maxSize: {
            type: Number, // in KB
            default: 2048,
        },
        aspectRatio: {
            type: String,
        },
        minimumResolution: {
            type: Object,
        },
        maximumResolution: {
            type: Object,
        },
        recommendedResolution: {
            type: Object,
        },
        value: {
            type: String,
        },
        mediaFolder: {
            type: String,
        },
        namespace: {
            type: String,
        },
        fileName: {
            type: String,
        },
        showGallery: {
            type: Boolean,
            default: true,
        },
        height: {
            type: String,
            default: ''
        }
    },
    computed: {
        title() {
            return `Upload ${this.label}`;
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
        isHDNImage() {
            return GrindorService.isHDNPath(this.imageURL);
        },
        isEmpty() {
            return this.imageURL == '';
        },
    },
    mounted() {
        this.$refs['dialog'].$on('close', (e) => {
            this.visible = false;
        });
    },
    data: function () {
        return {
            loading: false,
            data: null, // use for data transfer
            imageURL: '',
            initialImageURL: '',
            edit: false,
            visible: false,
            isCropped: false,
        };
    },
    methods: {
        open() {
            this.visible = true;
            this.imageURL = this.initialImageURL = this.value;
            this.$refs['dialog'].open({
                width: '950px',
                height: this.height || '632px',
                showCloseButton: true,
                dismissible: false,
            });
        },
        close(e) {
            this.$refs['dialog'] && this.$refs['dialog'].close(e);
        },
        $saveImage() {
            const imagePath =
                this.$refs.imageuploaderpanel.croppedImageFile || this.imageURL;
            if (this.initialImageURL == imagePath) {
                this.close();
                return;
            }
            if (imagePath == '') {
                this.$emit('delete', imagePath);
                this.close('delete');
                return;
            }
            var image = new Image();
            image.onload = () => {
                if (!this.validateMinimumResolution(image)) {
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
                            `Aspect ratio not matching with ${this.aspectRatio}, Please crop an image.`
                        );
                        return;
                    }
                }
                this.$setImage(this.resizeToMaximumResolution(image));
                if (this.namespace && /^data:/i.test(this.imageURL)) {
                    this.uploadToGrindor(this.dataURItoFile(this.imageURL))
                        .then((cdn_url) => {
                            this.isCropped = false;
                            this.$emit('save', cdn_url);
                            // this.$emit('input', cdn_url);
                        })
                        .finally(() => {
                            this.close('save');
                        });
                } else if (!GrindorService.isHDNPath(this.imageURL)) {
                    // download external image file and upload to HDN
                    this.externalURIToFile(this.imageURL).then((file) => {
                        if (file) {
                            this.uploadToGrindor(file)
                                .then((cdn_url) => {
                                    this.isCropped = false;
                                    this.$emit('save', cdn_url);
                                    // this.$emit('input', cdn_url);
                                })
                                .finally(() => {
                                    this.close('save');
                                });
                        } else {
                            this.$snackbar.global.showError(
                                `Failed to download external image`
                            );
                        }
                    });
                } else {
                    this.$emit('save', this.imageURL);
                    // this.$emit('input', this.imageURL);
                    this.close('save');
                }
            };
            image.src = imagePath;
            // image.src = this.getNonCORSHDNURL(imagePath);
        },
         $selectImage() {
            const imagePath =
                this.$refs.imageuploaderpanel.croppedImageFile || this.imageURL;
            if (this.initialImageURL == imagePath) {
                this.$emit('save', imagePath);
                this.close();
                return;
            }
            if (imagePath == '') {
                this.$emit('delete', imagePath);
                this.close('delete');
                return;
            }
            // select image
            this.$emit('save', this.imageURL);
            this.close('save');
        },
        dataURItoFile(dataURI) {
            try {
                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
                var byteString = atob(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0];

                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);

                // create a view into the buffer
                var ia = new Uint8Array(ab);

                // set the bytes of the buffer to the correct values
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                // write the ArrayBuffer to a blob, and you're done
                var file = new File(
                    [ab],
                    `${this.fileName.replace(/ /g, '-')}.${mime.extension(
                        mimeString
                    )}`,
                    { type: mimeString }
                );
                return file;
            } catch (err) {
                return dataURI;
            }
        },
        externalURIToFile(fileURI) {
            const nonCORSURL = this.getNonCORSHDNURL(fileURI, true);
            const filePath = new URL(fileURI).pathname;
            const fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
            return axios({
                type: 'get',
                url: nonCORSURL,
                responseType: 'blob',
            })
                .then((response) => {
                    const f = response.data;
                    return new File([f], fileName, {
                        type: mime.contentType(fileName),
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return null;
                });
        },
        validateMinimumResolution(image) {
            if (
                this.minimumResolution &&
                (image.width < this.minimumResolution.width ||
                    image.height < this.minimumResolution.height)
            ) {
                return false;
            }
            return true;
        },
        resizeToMaximumResolution(image) {
            // TODO: implement resizeToMaximumResolution without tanting canvas
            return image.src;
            if (
                this.maximumResolution &&
                (image.naturalWidth > this.maximumResolution.width ||
                    image.naturalHeight > this.maximumResolution.height)
            ) {
                let canvas = document.createElement('canvas');

                console.log(image);
                canvas.width = this.maximumResolution.width;
                canvas.height = this.maximumResolution.height;
                canvas
                    .getContext('2d')
                    .drawImage(
                        image,
                        0,
                        0,
                        image.naturalWidth,
                        image.naturalHeight,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );
                console.log(canvas);
                return canvas.toDataURL();
            }
            return image.src;
        },
        getNonCORSHDNURL(path, any) {
            try {
                // to bypass HDN CORS issue
                const url = new URL(path);
                if (GrindorService.hdns.includes(url.hostname) || any) {
                    return `${GrindorService.getProxyURL()}?url=${path}`;
                }
                return path;
            } catch (err) {
                return path;
            }
        },
        $setCropping(edit, cropped = false) {
            this.isCropped = cropped;
            this.$refs.imageuploaderpanel.cropping = edit;
            this.edit = edit;
        },
        $setImage(e) {
            if (this.edit) {
                this.$snackbar.global.showError(
                    `Can't change image in edit mode`
                );
                return;
            }
            this.imageURL = e;
            this.$refs.imageuploaderpanel.croppedImageFile = '';
        },
        $removeImage() {
            this.imageURL = '';
            this.isCropped = false;
            this.$refs.imageuploaderpanel.croppedImageFile = '';
        },
        uploadToGrindor(file) {
            if (!this.namespace) return;
            if (file) {
                let body = {
                    file_name: file.name,
                    content_type: file.type,
                    size: file.size,
                };
                let request = { body };
                this.loading = true;
                return GrindorService.upload(this.namespace, body, file)
                    .then(({ data }) => {
                        if (data && data.cdn && data.cdn.url) {
                            return data.cdn.url;
                        }
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            err &&
                                err.response &&
                                err.response.data &&
                                err.response.data.message
                                ? err.response.data.message
                                : 'Failed to upload image'
                        );
                        console.log(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.uploading {
    pointer-events: none;
}
.dialog-body {
    display: flex;
    .image-uploader-panel {
        flex: 1;
    }
    .dialog-saperator {
        width: 48px;
    }
    .image-uploader-list {
        flex: 1;
    }
}
.footer-event {
    width: 425px;
    display: flex;
    justify-content: flex-end;
    ::v-deep button {
        font-size: 12px;
        .n-button-content {
            align-items: flex-start;
        }
    }
    &.left-align {
        justify-content: flex-start;
    }
}
.footer-saperator {
    flex: 1;
}
</style>
