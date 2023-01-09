<template>
    <div >
        <div
                    :class="{
                        highlight,
                        disabled: isDisabled || value
                    }"
                    @drop.prevent.stop="onDrop"
                    @dragenter.prevent.stop="highlight = true"
                    @dragover.prevent.stop="highlight = true"
                    @dragleave.prevent.stop="highlight = false"
                >
                    <input
                        type="file"
                        name="inputFile"
                        ref="inputFile"
                        :accept="acceptedMIMETypesString"
                        @change="handleInputFile($event.target.files)"
                    />
                    <div
                        class="file-upload-box"
                        @click="
                            clearInputFile();
                            $refs.inputFile.click();
                        "
                    >
                        <div class="box-content">
                            <adm-inline-svg src="plus-blue"></adm-inline-svg>
                            <p class="darker-sm cl-RoyalBlue select">
                                Select a file
                            </p>
                            <p class="cl-Mako regular-xxxs">
                                OR drag and drop a file here
                            </p>
                            <p class="cl-DustyGray2 regular-xxxs type">
                                Accepted File Type: .html
                            </p>
                        </div>
                    </div>
                </div>
                <div class="upload-progress" v-if="file">
                    <adm-inline-svg src="file"></adm-inline-svg>
                    <div class="file-details">
                        <div class="flex-content">
                            <div class="darker-md cl-Mako">
                                {{ inputFileMeta.name }}
                            </div>
                            <adm-inline-svg
                                class="pointer"
                                src="cancel_small"
                                @click.stop.native="clearInputFile"
                            ></adm-inline-svg>
                        </div>
                        <div class="progress-bar" v-if="!isCompleted">
                            <div
                                class="progress"
                                :style="{ width: inputFileMeta.progress }"
                            ></div>
                        </div>
                        <div class="flex-content" v-if="!isCompleted">
                            <div class="cl-RoyalBlue darker-xxxs">
                                {{ inputFileMeta.progress }}% complete
                            </div>
                        </div>
                        <div class="completed" v-if="isCompleted">
                            <adm-inline-svg
                                src="completed_green"
                            ></adm-inline-svg>
                            <p class="darker-xxxs">File Upload Completed</p>
                        </div>
                    </div>
                </div>
                <div class="upload-progress" v-else-if="value">
                    <adm-inline-svg src="file"></adm-inline-svg>
                    <div class="file-details">
                        <div class="flex-content">
                            <div class="darker-md cl-Maco">
                                File uploaded: <span class="cl-RoyalBlue">{{ content.split('-').pop() }}</span>
                            </div>
                            <adm-inline-svg
                                class="pointer"
                                src="cancel_small"
                                @click.stop.native="clearInputFile"
                            ></adm-inline-svg>
                        </div>
                    </div>
                </div>
    </div>
</template>

<style lang="less" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/ambiance.css';

input[type='file'] {
        display: none;
    }

.file-upload-box {
        width: auto;
        height: 200px;
        background: rgba(240, 244, 255, 0.5);
        border: 1px dashed rgba(46, 49, 190, 0.5);
        border-radius: 4px;
        margin: 16px;
        position: relative;
        cursor: pointer;

        .box-content {
            text-align: center;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .select {
                padding: 10px 0;
            }

            .type {
                padding-top: 12px;
            }
        }
    }
.upload-progress {
    margin: 16px;
    display: flex;
    align-items: center;
    .file-details {
        padding-left: 10px;
        width: 100%;
    }
    .flex-content {
        display: flex;
        justify-content: space-between;
    }

    .progress-bar {
        height: 6px;
        background: #f2f2f2;
        border-radius: 37px;
        width: 100%;
        margin: 5px 0;

        .progress {
            height: 100%;
            border-radius: inherit;
            background: @RoyalBlue;
        }
    }

    .completed {
        display: flex;
        align-items: center;
        padding-top: 5px;

        p {
            padding-left: 4px;
            color: #0a5f23;
            line-height: 130%;
        }
    }
}

.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

</style>

<script>
import loader from '@/components/common/loader';
import noSsr from 'vue-no-ssr';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import { isBrowser } from 'browser-or-node';
import GrindorService from '@/services/grindor.service';

if (isBrowser) {
    require('codemirror/mode/xml/xml.js');
    require('codemirror/addon/edit/closetag.js');
    require('codemirror/addon/selection/active-line.js');
}
const SUPPORTED_INPUT_FILE_TYPES = ['html'];

export default {
    name: 'upload-file',
    components: {
        loader,
        'no-ssr': noSsr,
        'adm-inline-svg': InlineSvg,
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageData: {},
            highlight: false,
            preview: false,
            showHtmlModal: false,
            selectedFileType: null,
            file: null,
            acceptedMIMETypesString: [
                'text/html'
            ],
            isUploading: false,
            isCompleted: false,
            isLoading: false,
            isDisabled: false,
            namespace: "platform-page-assets",
            inputFileMeta: {},
        };
    },
    computed: {
        content: {
            get: function() {
                return this.value;
            },
            set: function(v) {
                this.$emit('input', v);
            }
        }
    },
    methods: {
        onDrop(e) {
            this.highlight = false;
            const files = e.dataTransfer.files;
            this.handleInputFile(files);
        },
        clearInputFile() {
            this.$refs.inputFile.value = '';
            this.inputFileMeta = { name: '', fileSize: null, progress: null };
            this.file = null;
            this.isUploading;
            this.isDisabled = false;
            this.$emit('input', '')
        },
        handleInputFile(files, subfile) {
            if (!files || !files.length) {
                this.$snackbar.global.showError('No file selected');
                return;
            }
            this.isUploading = true;
            const file = files[0];
            const fileExtension = file.name.split('.').pop();
            if (!SUPPORTED_INPUT_FILE_TYPES.includes(fileExtension)) {
                this.$snackbar.global.showError('Unsupported file format');
                return;
            }

            if (!subfile) this.inputFileMeta.name = file.name;

            if (fileExtension === 'html') {
                this.isLoading = true;
                if (!subfile) this.file = file;
                this.uploadToGrindor(this.file)
                .then(cdn_url => {
                    this.content = cdn_url;
                    this.inputFileMeta.progress = '100';
                    this.isLoading = false;
                    this.isDisabled = true;
                    this.isCompleted = true;
                    this.$snackbar.global.showSuccess('Model Uploaded');
                })
                .catch((err) => {
                    console.error('Error uploading HTML file: ', err);
                    this.isLoading = false;
                    this.$snackbar.global.showError('Upload Failed');
                })
            } 
        },
        uploadToGrindor(file){
            let body = {
                file_name: file.name,
                content_type: file.type,
                size: file.size
            };
            return GrindorService.upload(this.namespace, body, file)
            .then(({ data }) => {
                if (data && data.cdn && data.cdn.url) {
                    return data.cdn.url;
                }
            })
            .catch(err => {
                this.$snackbar.global.showError(
                    err &&
                        err.response &&
                        err.response.data &&
                        err.response.data.message
                        ? err.response.data.message
                        : 'Failed to upload model'
                );
                console.error('Error uploading model: ', err);
            })
        },
    }
};
</script>
