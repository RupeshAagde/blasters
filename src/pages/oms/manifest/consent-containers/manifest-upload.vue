<template
    @dragenter="preventFunction($event)"
    @dragover="preventFunction($event)"
    @dragleave="preventFunction($event)"
    @drop="preventFunction($event)"
>
    <div
        :class="{ filehover: isActive }"
        @dragenter="fileDropListner($event, 'enter')"
        @dragover="fileDropListner($event, 'over')"
        @drop="fileDropListner($event, 'drop')"
        @dragleave="fileDropListner($event, 'leave')"
    >
        <bulk-action-box>
            <template #header>
                <p>
                    <span class="bold-text">3. Upload</span> the soft copy of signed manifest
                </p>
            </template>
            <template #content>
                <div class="upload-container">
                    <div class="section-container">
                        <inline-svg :src="'oms-upload'" />
                        <p class="img-help-text">
                            Drag and drop PDF file here (max. file size: 2 MB)
                        </p>
                    </div>
                    <p class="section-divider">OR</p>
                </div>
            </template>
            <template #footer>
                <div class="upload-via-btn section-container">
                    <nitrozen-button
                        theme="secondary"
                        v-flatBtn
                        @click="onUploadClick"
                        :disabled="!['pdf_generated', 'complete'].includes(status)"
                        class="fileUploadBtn"
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            ref="fileUpload"
                            @change="onFileUpload"
                            class="fileUploadInput"
                        />
                        Upload
                    </nitrozen-button>
                </div>
                <div class="uploaded-file-container" v-if="uploadedFileName">
                        <nitrozen-tooltip
                            v-if="uploadedFileNameTitle.length > 0"
                            position="top"
                            :tooltipText="uploadedFileNameTitle"
                        />
                    <p class="uploaded-file-name" >
                        {{ uploadedFileName }}
                    </p>
                </div>
            </template>
        </bulk-action-box>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenButton, flatBtn, NitrozenTooltip } from '@gofynd/nitrozen-vue';

/* Component imports */
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'manifest-upload-box',
    components: {
        'inline-svg': AdmInlineSvg,
        BulkActionBox,
        NitrozenButton,
        NitrozenTooltip
    },
    props: {
        status: {
            type: String,
            default: '',
        },
    },
    directives: {
        flatBtn,
    },
    data() {
        return {
            uploadedFileName: '',
            disableUpload: this.disabled,
            isActive: false,
            uploadedFileNameTitle: ''

        };
    },
    methods: {
        onFileUpload(event) {
            /* @author Sameer shaikh
             * onfile upload we are validating the files and emiting the file to the parent
             */
            let file = event.target.files[0];
            if (file.size <= 2097152 && file.type == 'application/pdf') {
                this.uploadedFileName = file.name;
                if(this.uploadedFileName.length > 20 ){
                  this.uploadedFileName = file.name.slice(0, 20)+'....pdf'
                  this.uploadedFileNameTitle = file.name
                } else {
                    this.uploadedFileNameTitle = ''
                }


                this.$emit('upload', event.target.files[0]);
            } else if(file.size >= 2097152) {
                this.$snackbar.global.showError('Uploaded file size is larger than 2 MB. Kindly upload a file smaller than 2 MB.');
            } else {
                this.uploadedFileName = '*Only pdf files accepted';
            }
        },

        onUploadClick() {
            this.$refs.fileUpload.click();
        },
        preventFunction(e) {
            e.preventDefault();
        },

        fileDropListner(e, eventName) {
            /*@author Sameer shaikh
             *  fileDropListner is listening to multiple  events of file drag and drop,
             * here we are validating filetype size and alowing only single file upload.
             * also changing background of upload container when file is in hover state
             */
            let files;
            let file;
            this.preventFunction(e);
            this.uploadedFileName = '';
            if (['enter', 'over'].includes(eventName)) {
                this.isActive = true;
            } else if (['leave', 'drop'].includes(eventName)) {
                this.isActive = false;
            }
            if (eventName == 'drop') {
                files = e.dataTransfer.files;
                file = files['0'];
                if (
                    files.length == 1 &&
                    file.size <= 2097152 &&
                    file.type == 'application/pdf'
                ) {
                    this.uploadedFileName = file.name;
                    if(this.uploadedFileName.length > 20 ){
                     this.uploadedFileName = file.name.slice(0, 20)+'....pdf'
                    this.uploadedFileNameTitle = file.name
                    } else {
                    this.uploadedFileNameTitle = ''
                    }
                    this.$emit('upload', file);
                } else {
                    this.$snackbar.global.showError(
                        'please upload single .pdf file, with size upto 2 mb',
                        1000
                    );
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';
.filehover {
    background: rgb(194, 196, 211);
}
.upload-via-btn {
    display: flex;
    justify-content: center;
}
.bold-text {
    font-weight: 700;
}

.upload-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #666666;

    .section-container {
        margin-top: 6vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .upload-icon {
            margin-bottom: 1rem;
        }
    }
    .section-divider {
        margin: 1rem 0rem 0.5rem 0rem;
    }
}

.upload-via-img {
    margin-bottom: 1rem;
}

.uploaded-file-container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    column-gap: 8px;

    .uploaded-file-name {
        color: @RoyalBlue;
        font-weight: 400;
        pointer-events: none;
    }
}

.fileUploadBtn {
    position: relative;
}

.fileUploadInput {
    position: absolute;
    width: 100%;
    visibility: hidden;
}
</style>
