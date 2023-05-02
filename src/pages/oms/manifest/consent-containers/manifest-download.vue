<template>
    <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">1. Click </span> the download button to get a PDF file of the manifest
            </p>
        </template>
        <template #content>
            <div class="upload-container">
                <div
                    class="upload-via-img section-container"

                >
                    <img
                        src="/public/admin/assets/admin/pngs/download.png"
                        class="upload-icon"
                    />
                    <p class="img-help-text">
                       Download PDF File
                    </p>
                </div>

            </div>

        </template>
        <template #footer>
            <div class="download-btn-container">
                <nitrozen-button
                    class="download-btn"
                    theme="secondary"
                    v-stroke-btn
                    @click="onDownloadBtnClick"
                    :disabled="!['pdf_generated', 'complete'].includes(status)"
                    :showProgress="pdfGenerationInProgress"
                >
                    Download
                </nitrozen-button>
            </div>
        </template>
    </bulk-action-box>
</template>

<script>
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';
import {
    NitrozenButton,
    flatBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name:'manifest-download-box',
    components:{
        BulkActionBox,
        NitrozenButton,
    },
    props:{
        status:{
            type: String,
            required: true
        },
        downloadUrl:{
            type: String,
            required: true
        },
        pdfGenerationInProgress:{
            type: Boolean,
            required: true
        }
    },
    directives: { flatBtn },
    methods:{
        onDownloadBtnClick() {
             /* @author Sameer shaikh
             * for happy flow we are downloading the pdf file here but this is a temporary code which will be removed later and just emission will be there
             */
            this.$emit('download');
        }
    }
};
</script>
<style lang="less" scoped>
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
    margin-top: 10vh;

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
.download-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>


