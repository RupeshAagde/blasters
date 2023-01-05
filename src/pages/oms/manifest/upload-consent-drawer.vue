<template>
    <div
        class="filters-section"
        @click="
            stopClick($event);
            checkOutsideClick($event);
        "
    >
        <div class="header-box">
            <div class="filters-title">Upload Consent</div>
        </div>
        <div class="main-body">
            <p class="upload-note">
                Follow these steps to upload the signed manifest <span>(Optional)</span>
            </p>
            <div class="content">
                <manifest-download-box
                    @download="downloadManifest()"
                    :orderRoles="orderRoles"
                    :status="manifestStatus"
                    :downloadUrl="downloadUrl"
                    :pdfGenerationInProgress="pdfGenerationInProgress"
                ></manifest-download-box>
                <manifest-instruction-box />
                <manifest-upload-box
                    class="manifest-upload-box"
                    :status="manifestStatus"
                    @upload="onUpload($event)"
                    :orderRoles="orderRoles"
                ></manifest-upload-box>
            </div>
            <mirage-alert
                :dismissible="false"
                ref="intro"
                class="plain"
                type="plain"
                v-show="isUploadingOrDownloading"
            >
                <div class="alert-content">
                    <span class="text-icon">
                        <span class="space">
                            <ukt-inline-svg src="bulls-eye" />
                        </span>
                        Wait! Manifest file is being {{ fileState }}
                    </span>
                </div>
            </mirage-alert>
        </div>

        <div class="footer-box">
            <div class="declaration-note">
                <p>
                    <span class="checked-box">
                        <nitrozen-checkbox  v-model="declarationChecked"> </nitrozen-checkbox
                    ></span>
                    I declare that the signed manifest provided by me is genuine and I am liable for dispatch
                </p>
            </div>
            <nitrozen-button
                :disabled="manifestStatus !== 'pdf_generated' || !declarationChecked"
                ref="apply-filter-button"
                class="apply-filter-button"
                v-flatBtn
                :theme="'secondary'"
                @click="goToListing()"
                >Dispatch</nitrozen-button
            >
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';
/* Components imports */
import MirageAlert from '@/components/alert/index.vue';
import ManifestUploadBox from '@/pages/oms/manifest/consent-containers/manifest-upload.vue';
import ManifestInstructionBox from '@/pages/oms/manifest/consent-containers/manifest-instruction.vue';
import ManifestDownloadBox from '@/pages/oms/manifest/consent-containers/manifest-download.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Service imports */
import OrderService from '@/services/orders.service';
import GrindorService from '@/services/grindor.service';



export default {
    name: 'upload-consent-drawer',
    components: {
        NitrozenInput,
        flatBtn,
        NitrozenRadio,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenButton,
        'manifest-upload-box': ManifestUploadBox,
        'manifest-instruction-box': ManifestInstructionBox,
        'manifest-download-box': ManifestDownloadBox,
        'nitrozen-checkbox': NitrozenCheckBox,
        MirageAlert,
        UktInlineSvg,
    },
    directives: { flatBtn },
    props: {
        entryPoint: {
            type: String,
            required: true,
            default: ''
        },
        orderRoles: {
            type: Array,
            required: true,
            default: []
        },
        manifestId: {
            type: String,
            required: true,
            default: ''
        
        },
        manifestInfo: {
            type: Object,
            required: true,
            default: {}
        }
    },
    data() {
        return {
            showAlert: false,
            manifestStatus: '',
            mediaUpdates: {},
            downloadUrl: '',
            file: null,
            isUploadingOrDownloading: false,
            uploadURL: {},
            declarationChecked: true,
            polling: '',
            pdfGenerationInProgress: false,
            retries: 0,
            fileState: ''
        };
    },
    mounted() {
        this.fetchManifestDetails();
        if(!['pdf_generated', 'complete'].includes(this.manifestStatus)){
            this.pollManifestDetails();
        }
    },
    destroyed(){
        clearInterval(this.polling);
    },
    methods: {

        downloadManifest() {
            /*@author Sameer shaikh
             *  This is emission from child component
             */
            this.isUploadingOrDownloading = true;
            this.fileState = 'downloaded';

            return GrindorService.getPublicUrl({
                expiry: 300,
                urls: [this.downloadUrl],
            })
                .then((res) => {
                    let signedurl = res.data.urls[0].signed_url;
                    if (signedurl !== '') {
                        fetch(
                            signedurl
                        )
                            .then((res) => res.blob())
                            .then((blob) => {
                                let link = document.createElement('a');
                                let url = window.URL.createObjectURL(blob);
                                link.href = url;
                                link.download = `${this.manifestId}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                this.isUploadingOrDownloading = false;
                            }).catch((err)=> {
                                this.$snackbar.global.showError('Failed to download consent');
                                console.error('Failed to download consent', err);
                                this.isUploadingOrDownloading = false;
                            })
                    }
                })
                .catch((err) => {
                    console.log('Error in downloading the manifest', err);
                    this.isUploadingOrDownloading = false;
                });
        },

        /**
         * on click of dispach manifest we will call this function
         * and make api call to dispacth the manifest once it's done
         * we will route to the manifest home page if the entry point is generate
         */
        goToListing() {
            OrderService.dispatchManifest({ manifest_id: this.manifestId })
                .then((res) => {
                    if(this.entryPoint == 'home'){
                       this.$emit('dispatch')
                    }else {
                        this.$router.push({ name: 'company-order-manifest' });
                    }
                        this.$snackbar.global.showSuccess(`${this.manifestId} dispatched successfully`);
                })
                .catch((err) => {
                    console.log('Error while updatating the manifest', err);
                });
        },
        stopClick(event) {
            event.stopPropagation();
        },

        onUpload(file) {
            this.file = file;
            this.uploadToGrindor('misc', null);
            this.showAlert = true;''
        },
        fetchManifestDetails(){
            OrderService.fetchManifestDetails({manifest_id:this.manifestId})
            .then((res)=> {
                if(res.data.error) {
                    this.$snackbar.global.showError(
                        `We are unable to fetch details for the manifest: ${this.manifestId}`, 
                        2500
                    );
                    clearInterval(this.polling);
                    console.error('Error in fetching manifest details:', res.data.error.error_msg);
                } else if(res.data && res.data.manifest_details) {
                    let manifestInfo = res.data.manifest_details[0];
                    if(manifestInfo && manifestInfo.pdf_meta && manifestInfo.pdf_meta.media_updates) {
                        this.mediaUpdates =  manifestInfo.pdf_meta.media_updates.slice(-1)[0];
                    }
                    this.manifestStatus = manifestInfo.status;
                    this.downloadUrl = '';
                    if(this.mediaUpdates && this.mediaUpdates.link) {
                        this.downloadUrl = this.mediaUpdates.link;
                    }
                } else {
                    this.$snackbar.global.showError(
                        `We are unable to fetch details for the manifest: ${this.manifestId}`, 
                        2500
                    );
                    clearInterval(this.polling);
                    console.error('Error in fetching manifest details:', res.data.error.error_msg);
                }
            }).catch((err)=> {
                this.$snackbar.global.showError(
                    `We are unable to fetch details for the manifest: ${this.manifestId}`, 
                    2500
                );
                clearInterval(this.polling);
                console.error('Error in fetching manifest details:', err);
            })
        },
        pollManifestDetails() {
            this.polling = setInterval(()=>{
                if(['pdf_generated', 'complete'].includes(this.manifestStatus)) {
                    clearInterval(this.polling);
                    this.pdfGenerationInProgress = false;
                } else {
                    if(this.retries <= 5) {
                        this.retries++;
                        this.pdfGenerationInProgress = true;
                        this.fetchManifestDetails();
                    } else {
                        clearInterval(this.polling);
                        this.retries = 0;
                        this.pdfGenerationInProgress = false;
                        this.$snackbar.global.showError(
                            'Request timed out for fetching manifest details. Kindly try again after some time.',
                            3000
                        );
                    }
                }
            }, 2000);

        },
        checkOutsideClick() {},
        uploadToGrindor(namespace = 'misc', company_id = null) {
            if (!namespace) return;
            if (this.file) {
                this.isUploadingOrDownloading = true;
                this.fileState = 'uploaded';
                let body = {
                    file_name: this.file.name,
                    content_type: this.file.type,
                    size: this.file.size,
                };
                if (company_id)
                    body.params = {
                        company_id: company_id,
                    };
                let file = this.file;
                let request = { body };
                let response = null;
                return GrindorService.uploadToGrindorStart(namespace, body)
                    .then((res) => {
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
                    .then((res) => {
                        let obj = {
                            ...request,
                            response: response,
                        };
                        return GrindorService.uploadToGrindorComplete(
                            namespace,
                            obj
                        );
                    })
                    .then((res) => {
                        let param = {
                            manifest_id: this.manifestId,
                            consent_url: this.uploadURL.cdn.url,
                        };
                        return OrderService.uploadConsent(param);
                    })
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            'File uploaded successfully'
                        );
                    })
                    .catch((err) => {
                        console.log('Error while uploading consent', err);
                    })
                    .finally(() => {
                        this.isUploadingOrDownloading = false;
                        this.fileState = 'uploaded';
                        console.log(this.manifestStatus)
                        if(this.manifestStatus == 'complete') {
                        if(this.entryPoint == 'home') {
                            this.$emit('dispatch')
                             }else {
                                this.$router.push({ name: 'company-order-manifest' });
                            }
                        }

                    });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.plain {
    width: auto;
    margin-top: 24px;
    background-color: #f5f8ff;
    color: #666666;

    .alert-content {
        width: 100%; //will be removed after removing close icon
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #41434c;
        font-size: 13px;
        font-family: 'Inter';
        line-height: 21px;
        .text-icon {
            display: flex;
            align-items: center;
            .space {
                margin-right: 10px;
            }
        }
    }
}
::v-deep {
    .bulk-action-box {
        background: rgba(231, 238, 255, 0.3);
        height: 300px;
        width: 310px;
        font-family: 'Inter', sans-serif;
        padding: 16px;
        font-size: 12px;
        border: 1px dashed #2e31be;
        border-image-width: 2px;
        border-radius: 4px;
        position: relative;
        line-height: 19px;
    }
}
// ::v-deep .content {
    // max-width: 1189px;
    // margin: 0vh 1.5vw 0vh 1vw;
// }
.filters-section {
    height: 100vh;
    position: relative;
    .main-body {
        display: flex;
        justify-content: center;
        flex-direction: column;
        // margin-top: 24px;
        color: @Mako;
        margin: 0 24px;

        .upload-note {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            font-family: inter;
            font-size: 14px;
            line-height: 17px;
            margin: 1rem 0;

            span {
                color: #979797;
            }
        }

        .content {
            display: flex;
            justify-content: center;
            gap: 10px;
        }
    }

    .header-box {
        box-sizing: border-box;
        border-bottom: 1px solid #e0e0e0;
        padding: 24px;

        .filters-title {
            // height: 31px;
            left: 24px;
            top: 24px;
            font-weight: 600;
            font-size: 20px;
            line-height: 31px;
            color: @Mako;
        }
    }
}

.footer-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    margin-top: 72px;
    box-sizing: border-box;
    border-top: 1px solid #e0e0e0;
    padding: 16px 0px 16px 0px;
    background: @White;
    box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
    .declaration-note {
        padding-left: 15px;
        color: #666666;
        font-size: 12px;
        line-height: 17px;
        .checked-box {
            padding-right: 30px;
        }
    }
    .apply-filter-button {
        margin-right: 16px;
    }
}
</style>
