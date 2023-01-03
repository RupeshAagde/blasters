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
        @dragleave="fileDropListner($event, 'leave')">
    <bulk-action-box @dragenter.prevent @dragover.prevent>
        <template #header>
            <p>
                <span class="bold-text">3. Upload</span>  the updated file once it is filled with all the required fields.
            </p>
        </template>
        <template #content>
            <div class="upload-container">
                <div class="upload-via-img section-container" @drop.prevent.stop="onFileUpload" @dragenter.prevent @dragover.prevent>
                    <!-- <img src="/public/admin/assets/admin/pngs/upload.png" class="upload-icon" /> -->
                    <inline-svg :src="'oms-upload'" class="upload-icon" />
                    <p class="img-help-text">Drag and drop .csv, .xls here (max 2MB)</p>
                </div>
                <p class="section-divider">OR</p>
                <div class="upload-via-btn section-container">
                    <nitrozen-button theme="secondary" v-flatBtn @click="onUploadClick" :disabled="disableUpload" class="fileUploadBtn">
                        <input type="file" accept=".csv,.xls,.xlsx" ref="fileUpload" @change="onFileUpload" class="fileUploadInput" />
                        Upload
                    </nitrozen-button>
                </div>
            </div>
            <div class="uploaded-file-container" v-if="uploadedFileName">
                        <nitrozen-tooltip
                            v-if="uploadedFileNameTitle.length > 0"
                            position="left"
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
    name: 'upload-action-box',
    components: {
        'inline-svg': AdmInlineSvg,
        BulkActionBox,
        NitrozenButton,
        NitrozenTooltip
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            uploadedFileName: '',
            disableUpload: false,
            isActive: false,
            uploadedFileNameTitle: ''
        }
    },
    mounted() {
        this.disableUpload = this.disabled;
    },
    methods: {
        preventFunction(e) {
            e.preventDefault();
        },
        /**
         * Function to emit upload method when user attempts to upload a file.
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} event The event object
         */
        onFileUpload(event) {
            let file = event.target.files[0];
            if(file.size == 0) {
                this.$snackbar.global.showError(
                    `File is empty, please check the file`
                );
            }
            else if(file.size > 2000000){
                this.$snackbar.global.showError(
                    `File size exceeds 2MB, please check the file`
                );
            }
            else if(file.name.slice(-4) == ".csv" || file.name.slice(-4) == ".xls" || file.name.slice(-4) == "xlsx" ) {
                this.uploadedFileName = file.name;

                if(this.uploadedFileName.length > 20 ){
                     this.uploadedFileName = file.name.slice(0, 20)+'....' + file.name.slice(-4) 
                    this.uploadedFileNameTitle = file.name
                    } else {
                    this.uploadedFileNameTitle = ''
                    }
                this.$emit('upload', event.target.files[0]);
            }
            else {
                this.uploadedFileName = null;
                this.$snackbar.global.showError(
                    `Please uplaod csv, xls or xlsx format only`
                );
            }
        },

        /**
         * Function to call file upload method when user clicks on the button.
         *
         * @author: Rushabh Mulraj Shah
         */
        onUploadClick() {
            this.$refs.fileUpload.click();
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
                if(file.size == 0) {
                this.$snackbar.global.showError(
                    `File is empty, please check the file`
                );
                }    else if(file.size > 2000000){
                this.$snackbar.global.showError(`File size exceeds 2MB, please check the file`);
                }
                 else if(file.name.slice(-4) == ".csv" || file.name.slice(-4) == ".xls" || file.name.slice(-4) == "xlsx" ) {
                this.uploadedFileName = file.name;
                
                if(this.uploadedFileName.length > 20 ){
                     this.uploadedFileName = file.name.slice(0, 20)+'....' + file.name.slice(-4) 
                    this.uploadedFileNameTitle = file.name
                    } else {
                    this.uploadedFileNameTitle = ''
                    }

                this.$emit('upload', file); 
                  }
                else {
                this.uploadedFileName = null;
                this.$snackbar.global.showError(
                    `Please uplaod csv, xls or xlsx format only`
                );
                }

                // if (
                //     files.length == 1 &&
                //     file.size <= 2097152 &&
                //     file.type == 'application/pdf'
                // ) {
                //     this.uploadedFileName = file.name;
                //     if(this.uploadedFileName.length > 20 ){
                //      this.uploadedFileName = file.name.slice(0, 20)+'....pdf'
                //     this.uploadedFileNameTitle = file.name
                //     } else {
                //     this.uploadedFileNameTitle = ''
                //     }
                //     this.$emit('upload', file);
                // } else {
                //     this.$snackbar.global.showError(
                //         'please upload single .pdf file, with size upto 2 mb',
                //         1000
                //     );
                // }
            }
        },
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';
.filehover {
    background: rgb(194, 196, 211);
}

.bold-text {
    font-weight: 500;
}

.upload-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #666666;
    margin-bottom: 1rem;

    .section-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
}

.upload-icon {
    margin-bottom: 1rem;
}

.upload-via-img {
    margin-bottom: 1rem;
}

.section-divider {
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
