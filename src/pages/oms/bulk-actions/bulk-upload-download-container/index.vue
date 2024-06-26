<template>
    <div class="bulk-upload-download-container">
        <div class="container-styling">
            <div class="title-container">
                <p class="title">Bulk Order Processing</p>
                <p class="subtitle">Follow these steps to process multiple orders in bulk</p>
            </div>
            <div>
                <nitrozen-menu class="actions-menu" mode="vertical" ref="menu">
                    <nitrozen-menu-item class="navigate-to-export" @click="openDownloadTemplateDrawer()">
                        <span>Download Template</span> 
                    </nitrozen-menu-item>
                </nitrozen-menu>
            </div>
        </div>
        <div class="content" v-if="globalFilters[0].options">
            <download-action-box 
                @showAdvFilters="$emit('showAdvFilters')"
                :disabled="disableDownload" 
                :globalFilters="globalFilters"
                @download="getGlobalFilters($event)" />
            <instructions-action-box />
            <upload-action-box
                :isUploading="isUploading"
                :disabled="disableUpload" 
                @upload="onUpload" />
        </div>
        <transition name="slide">
            <template v-if="isDownloadTemplate">
                <side-drawer @close="closeDownloadTemplateDrawer()" :title="`Download Template`" :footer="true">
                    <download-template-drawer
                        ref="download-template-drawer"
                        @toggleDownloadBtn="enableBtn($event)"
                    >
                    </download-template-drawer>
                    <template #footer>
                        <div class="footer-change-style">
                            <nitrozen-button
                                class="button-submit"
                                :disabled="!enableDownloadTemplate"
                                theme="secondary"
                                v-flatBtn
                                @click="onDownloadTemplate"
                            >
                                Download
                            </nitrozen-button>
                        </div>
                    </template>
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenMenu, NitrozenMenuItem, NitrozenButton, flatBtn
} from '@gofynd/nitrozen-vue';
/* Component imports */
import DownloadActionBox from '@/pages/oms/bulk-actions/bulk-upload-download-container/download-box.vue';
import InstructionsActionBox from '@/pages/oms/bulk-actions/bulk-upload-download-container/instructions-box.vue';
import UploadActionBox from '@/pages/oms/bulk-actions/bulk-upload-download-container/upload-box.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import DownloadTemplateDrawer from '@/pages/oms/bulk-actions/bulk-upload-download-container/download-template-drawer.vue';

/* Services imports */
import OrderService from '@/services/orders.service';
import GrindorService from '@/services/grindor.service';

/* Data imports */
import alertMsgs from '@/pages/oms/fixtures/alert-msgs.json';


export default {
    name: 'bulk-upload-download-container',
    components: {
        DownloadActionBox,
        InstructionsActionBox,
        UploadActionBox,
        NitrozenMenu,
        NitrozenMenuItem,
        SideDrawer,
        DownloadTemplateDrawer,
        NitrozenButton
    },
    props: {
        globalFilters: {
            type: Array,
        },
        selectedFilters: {
            type: Object,
        }
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            disableDownload: false,
            disableUpload: false,
            downloadInProgress: false,
            uploadInProgress: false,
            file: null,
            uploadURL: {},
            isDownloadTemplate: false,
            enableDownloadTemplate: false,
            isUploading:false,
        }
    },
    methods: {
        openDownloadTemplateDrawer() {
            this.isDownloadTemplate = true;
        },
        closeDownloadTemplateDrawer() {
            this.isDownloadTemplate = false;
        },
        enableBtn(e) {
            if(e == true) {
                this.enableDownloadTemplate = false;
            }
            else {
                this.enableDownloadTemplate = true;
            }
        },
        onDownloadTemplate() {
            this.$refs['download-template-drawer'].callDownloadApi();
            // this.closeDownloadTemplateDrawer();
        },
        /**
         * Function to be called to hit API when a file needs to be uploaded.
         * The relevant flags to show loading and disable buttons will be triggered.
         * An alert that needs to be shown will be sent to parent.
         * Finally, the API needs to be triggered.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {file} file The file object
         */
        onUpload(file) {
            this.file = file;
            this.uploadToGrindor();
            // this.disableUpload = true;
            // this.uploadInProgress = true;
            
            // this.$emit('showAlert', alertMsgs['bulkUpload']);

            // /* setTimeout will be replaced by the uploader API service */
            // setTimeout(() => {
            //     this.uploadInProgress = false;
            //     this.disableUpload = false;
            //     this.$emit('showAlert', false);
            // }, 2000);
        },

        uploadToGrindor(namespace = "misc", company_id = null) {
            this.errorMessage = '';
            if (!namespace) return;
            if (this.file) {
                this.isUploading = true;
                let body = {
                    file_name: this.file.name,
                    content_type: this.file.type,
                    size: this.file.size
                };
                if (company_id)
                    body.params = {
                        company_id: company_id
                    };
                let file = this.file;
                let request = { body };
                let response = null;
                return GrindorService.uploadToGrindorStart(namespace, body)
                    .then(res => {
                        response = res.data;
                        this.uploadURL = response;
                        let uploadUrl =
                            response.upload && response.upload.url
                                ? response.upload.url // send the reponse to the bulk api
                                : '';
                        if (uploadUrl) {
                            return GrindorService.uploadToGrindorS3(
                                uploadUrl,
                                file
                            );
                        } else {
                            throw { message: 'Failed to upload file' };
                        }
                    })
                    .then(res => {
                        let obj = {
                            ...request,
                            response: response
                        };
                        return GrindorService.uploadToGrindorComplete(
                            namespace,
                            obj
                        );
                    })
                    .then(res => {
                        return res.data;
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => {
                        this.isUploading = false;
                        this.postLinkBulkAction();
                    });
            }
        },

        postLinkBulkAction() {
            const data = {
                url: this.uploadURL.cdn.url,
                grindor_response: this.uploadURL
            }
            const postLink =  OrderService.postLinkV2BulkAction(data)
            return postLink
            .then(() => {
                this.$snackbar.global.showSuccess(
                    `Your file has been successfully uploaded`,
                    3000
                );
                this.$emit('makeFetchInvoiceList', true);
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to save your uploaded file to the database');
                console.error("Error in posting the uploaded file to the database:   ", error);
            })
        },
        
        /**
         * Function to download reports by hitting an API.
         * * The relevant flags to show loading and disable buttons will be triggered.
         * An alert that needs to be shown will be sent to parent.
         * Finally, the API needs to be triggered.
         * 
         * @author: Rushabh Mulraj Shah
         */
        // onDownload() {
        //     this.disableDownload = true;
        //     this.downloadInProgress = true;

        //     this.$emit('showAlert', alertMsgs['templateDownload']);

        //     /* setTimeout will be replaced by the downloader API service */
        //     setTimeout(() => {
        //         this.downloadInProgress = false;
        //         this.disableDownload = false;
        //         this.$emit('showAlert', false);
        //     }, 2000);
        // }

        /**
         * Function to download reports by hitting an API.
         * * The relevant flags to show loading and disable buttons will be triggered.
         * An alert that needs to be shown will be sent to parent.
         * Finally, the API needs to be triggered.
         * 
         * @author: Rohit Gupta
         */
        getGlobalFilters(globalData) {
            this.selectedFilters['stores'] = globalData[0];
            this.selectedFilters['bag_status'] = globalData[1];
            this.selectedFilters['file_type'] = globalData[2];
            this.getBulkGenerateExcel();
        },

        getBulkGenerateExcelRequestParams() {
            let params = {
                ...this.selectedFilters
            }
            for (let item in params) {
                if (Array.isArray(params[item])){
                    params[item] = params[item].join(",")
                }
            }
            return params
        },

        getBulkGenerateExcel() {
            this.selectedFilters['group_entity'] = "shipments"
            if(this.selectedFilters.stores  && this.selectedFilters.bag_status && this.selectedFilters.file_type){
                const params = this.getBulkGenerateExcelRequestParams()
                const get_excel = OrderService.fetchBulkGenerateExcel(params)
                return get_excel
                .then(({data}) => {
                    // const url = URL.createObjectURL(new Blob([data.cdn.url]));
                    const url = data.cdn.url;
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', data.file_name);
                    document.body.appendChild(link);
                    link.click();

                    this.disableDownload = true;
                    this.downloadInProgress = true;
                    this.$emit('showAlert', alertMsgs['templateDownload']);

                    setTimeout(() => {
                        this.downloadInProgress = false;
                        this.disableDownload = false;
                        this.$emit('showAlert', false);
                    }, 2000);
                })
                .catch((error) => {
                    this.$snackbar.global.showError('Unable to Download Excel');
                    console.error("error:   ", error);
                })
            }
            else {
                this.$snackbar.global.showError(
                    'Kindly ensure that you have selected location name, status and file type before attempting to download'
                );
            }
        },
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.bulk-upload-download-container {
    margin: 24px;
    padding: 24px;
    background: @White;
    font-family: 'Inter', sans-serif;

    .title-container {
        margin-bottom: 24px;

        .title {
            font-weight: 600;
            color: @Mako;
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 12px;
            font-weight: 400;
            color: #666666;
        }
    }

    .content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 24px;
    }
}

.container-styling {
    display: flex;
    justify-content: space-between;
}

.navigate-to-export {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: initial;
    }
}

::v-deep .nitrozen-menu-item {
    padding: 12px;
    margin-bottom: 8px;
}

::v-deep .nitrozen-menu-vertical-dropdown {
    width: max-content;
    row-gap: 1rem;
}

.footer-change-style {
    display: flex;
    justify-content: flex-end;
}
</style>
