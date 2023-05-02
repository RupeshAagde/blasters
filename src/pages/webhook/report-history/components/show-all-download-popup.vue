<template>
    <nitrozen-dialog
        ref="show-all-download-popup"
        :title="title"
        class="show-all-download-popup"
    >
        <template slot="header">
            <div class="header">
                <p>{{ header }}</p>
                <span class="export" @click="downloadAll">
                    <inline-svg class="export-icon" :src="'download-export'">
                    </inline-svg>
                    Download All
                </span> 
            </div>
        </template>
        <template slot="body">
            <div class="wrapper">
                <div
                    v-for="(item, key) in filedataToShow"
                    :key="key"
                    class="grid"
                >
                    <div class="filter-key">
                        <p>{{ key }}</p>
                    </div>
                    <div class="filter-value">
                        <div
                            class="clickable csv-img"
                            @click="onDownload(item)"
                        >
                            <inline-svg src="download"></inline-svg>
                        </div>
                        <div class="clickable csv-img" @click="onCopy(item)">
                            <adm-inline-svg src="copy"></adm-inline-svg>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template slot="footer" class="footer">
            <div></div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import admInlineSvg from '../../../../../src/components/common/adm-inline-svg.vue';
import inlinesvg from '../../../../components/common/ukt-inline-svg.vue';
import { copyToClipboard } from '../../../../helper/utils';
import { NitrozenDialog } from '@gofynd/nitrozen-vue';

export default {
    name: 'show-all-download-popup',
    components: {
        'nitrozen-dialog': NitrozenDialog,
        'adm-inline-svg': admInlineSvg,
        'inline-svg': inlinesvg,
    },
    props: {
        filedataToShow: { type: Object },
        title: { type: String, required: true },
    },
    data: () => ({
        header: 'Webhook Report Files',
    }),
    methods: {
        open() {
            this.$refs['show-all-download-popup'].open({
                width: '35%',
                showCloseButton: true,
                dismissible: true,  
            });
        },
        close() {
            this.$refs['show-all-download-popup'].close();
        },
        onDownload(url) {
            window.open(url);
        },
        onCopy(url) {
            copyToClipboard(url);
            this.$snackbar.global.showInfo('Copied url to clipboard', 1000);
        },
        downloadAll() {
            const fileData = this.filedataToShow;
            for (const fileName in fileData) {
                const context = this;
                setTimeout(function () {
                    console.log('file is getting downloaded!');
                    context.onDownload(fileData[fileName]);
                }, 1000);
            }
        },
    },
};
</script>

<style lang="less" scoped>
@container-image-width: 1.5rem;

.wrapper {
    min-height: 30vh;
    max-height: 40vh;
}

.header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.event-type-content {
    border-collapse: separate;
    border-spacing: 0 1em;
}
.bolden {
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #41434c;
}

.filter-key {
    display: flex;
    align-items: center;
}

.filter-value {
    max-height: 10rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    overflow-y: auto;
}

.grid {
    display: grid;
    grid-template-columns: 20% 80%;
    gap: 0.5rem 0.2rem;
    overflow-y: auto;

    .filter-key,
    .filter-value {
        padding: 0.5rem;
    }
}
.csv-img {
    width: @container-image-width;
}
.clickable {
    cursor: pointer;
}
.export {
    // font-size: 14px;
    font-weight: 700;
    color: #2e31be;
    display: flex;
    // align-items: center;
    cursor: pointer;
    // width: 6rem;

    .export-icon {
        margin-top: 2px;
        margin-right: 8px;
    }
}

::v-deep .nitrozen-dialog-footer {
    height: unset;
}
</style>