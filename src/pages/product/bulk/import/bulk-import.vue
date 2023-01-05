<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header
                title="Import"
                @backClick="redirectToList"
            ></adm-page-header>
        </div>
        <loader v-if="pageLoading" class="loading"></loader>
        <!-- <page-error v-else-if="pageError" @tryAgain="loadData"></page-error> -->
        <div class="upload-container">
            <div class="top-content">
                <div class="title-content">
                    <p class="cl-mako darker-md title">{{ getTitle }}</p>
                    <p class="regular-xxxs subtitle">
                        Need help in importing?
                        <span class="link" @click="goToLearnMore">
                            Learn Here</span
                        >
                    </p>
                </div>
                <div class="filters">
                    <div class="mr-16" v-if="productType === 'category'">
                        <nitrozen-dropdown
                            label="Select Category "
                            :placeholder="'Select Category'"
                            class="selection-dropdown"
                            :class="{
                                disabled: isDisabled
                            }"
                            :items="categoriesList"
                            v-model="selectedCategory"
                            @change="fetchTemplate(selectedCategory)"
                        ></nitrozen-dropdown>
                    </div>
                    <div class="mr-16" v-if="productType === 'hsn'">
                        <nitrozen-dropdown
                            label="Choose Template"
                            :placeholder="'Choose a template'"
                            class="selection-dropdown"
                            :class="{
                                disabled: isDisabled
                            }"
                            :items="templatesList"
                            v-model="selectedTemplate"
                            @change="fetchTemplate(selectedTemplate)"
                        ></nitrozen-dropdown>
                    </div>
                    <div class="download-button">
                        <nitrozen-dropdown
                            label="Download Sample"
                            :placeholder="'Download Sample'"
                            class="file-download-dropdown"
                            :class="{
                                disabled: isDisabled
                            }"
                            :items="fileTypes"
                            v-model="selectedFileType"
                            @change="downloadSample"
                        ></nitrozen-dropdown>
                    </div>
                    <adm-inline-svg
                        class="arrow-icon"
                        :src="isOpen ? 'arrow-up' : 'arrow-down'"
                        @click.stop.native="toggleBtn"
                    ></adm-inline-svg>
                </div>
            </div>
            <div class="divider" v-if="isOpen"></div>
            <div class="bottom-container" v-if="isOpen">
                <div class="t-content">
                    <p class="cl-mako darker-md title">Upload File</p>
                    <div class="history-content" @click="navigateToHistory">
                        <adm-inline-svg src="history"></adm-inline-svg>
                        <p class="darker-xxxs cl-RoyalBlue">Upload History</p>
                    </div>
                </div>
                <div
                    class="alignments"
                    :class="{
                        highlight,
                        disabled:
                            isDisabled ||
                            (productType === 'hsn' && !selectedTemplate) ||
                            (productType === 'category' && !selectedCategory)
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
                                Accepted File Type: .xlsx, .csv, .xls
                            </p>
                        </div>
                    </div>
                </div>
                <div class="upload-progress" v-if="file">
                    <adm-inline-svg src="file"></adm-inline-svg>
                    <div class="file-details">
                        <div class="flex-content">
                            <div class="darker-xxxs cl-Mako">
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
                            <div class="cl-DustyGray2 regular-xxxs">
                                {{
                                    inputFileMeta.loaded +
                                        ' / ' +
                                        inputFileMeta.fileSize
                                }}
                            </div>
                            <div class="cl-RoyalBlue darker-xxxs">
                                {{ inputFileMeta.progress }}% complete
                            </div>
                        </div>
                        <div class="completed" v-if="isCompleted">
                            <adm-inline-svg
                                src="completed_green"
                            ></adm-inline-svg>
                            <p class="darker-xxxs">Import Completed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="validation-summary">
            <div class="summary">
                <div class="record-summary">
                    <div>
                        <p class="cl-Mako darker-md">Validation Summary</p>
                        <div class="record-status">
                            <p class="cl-DustyGray2 regular-xxs total-records">
                                Total Records:
                                <span class="cl-Mako darker-xxs">{{
                                    productsArray.length
                                }}</span>
                            </p>
                            <div class="status" v-if="isSuccessVisible">
                                <adm-inline-svg
                                    src="completed_green"
                                ></adm-inline-svg>
                                <p class="cl-DustyGray2 regular-xxs">
                                    Success:
                                    <span class="cl-Mako darker-xxs">{{
                                        productsArray.length -
                                            errorsTable().data.length
                                    }}</span>
                                </p>
                            </div>
                            <div class="status" v-if="isErrorVisible">
                                <adm-inline-svg
                                    src="error_status"
                                ></adm-inline-svg>
                                <p class="cl-DustyGray2 regular-xxs">
                                    Error:
                                    <span class="cl-Mako darker-xxs">{{
                                        errorsTable().data.length || 0
                                    }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <div v-if="productsTable.data.length && !isTableLoaded">
                            <nitrozen-button
                                class=""
                                theme="secondary"
                                @click="clearInputFile"
                                v-strokeBtn
                                >Cancel</nitrozen-button
                            >
                        </div>
                        <div
                            v-else-if="
                                productsTable.data.length && isTableLoaded
                            "
                            class="inline"
                        >
                            <div class="inline" v-if="isErrorVisible">
                                <adm-inline-svg
                                    src="cloud_download"
                                ></adm-inline-svg>
                                <nitrozen-button
                                    class=""
                                    theme="secondary"
                                    @click="downloadErrors"
                                    >Download File</nitrozen-button
                                >
                            </div>
                            <div class="pl-16">
                                <nitrozen-button
                                    class=""
                                    theme="secondary"
                                    @click="reUploadConfirmationDialogBox"
                                    v-strokeBtn
                                    >Reupload</nitrozen-button
                                >
                            </div>
                            <div
                                class="pl-16"
                                v-if="
                                    productsArray.length &&
                                        errorsTable().data.length !==
                                            productsArray.length
                                "
                            >
                                <nitrozen-button
                                    class=""
                                    theme="secondary"
                                    @click="confirmDialogBox"
                                    v-flatBtn
                                    >Confirm</nitrozen-button
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>
                <no-records
                    v-if="!productsTable.data.length"
                    :image="'empty'"
                ></no-records>
                <no-records
                    v-else-if="productsTable.data.length && !isTableLoaded"
                    :image="'loading_content'"
                ></no-records>

                <div
                    class="form-container csv-table"
                    v-show="productsTable.data.length && isTableLoaded"
                >
                    <info-bar
                        :type="!isSuccessVisible ? 'error' : 'info'"
                        :desc="getInfoDesc"
                    ></info-bar>
                    <div class="csv-container">
                        <csv-view
                            ref="csv-preview"
                            class="csv-preview"
                            v-show="
                                productsTable.data.length && !showErrorsTable
                            "
                        ></csv-view>
                        <!-- <csv-view
                            title="Errors"
                            ref="errors-preview"
                            class="csv-preview"
                            v-show="errorsTable().data.length && showErrorsTable"
                            :csvExportFileName="
                                file ? `validation-errors-${file.name}_.csv` : null
                            "
                        ></csv-view> -->
                    </div>
                </div>
            </div>
        </div>
        <side-bar
            v-if="sidebarToggle"
            ref="sidebar"
            :closeOverlay="closeOverlay"
            :title="'Learn More'"
        >
            <template slot="body">
                <learn-more></learn-more>
            </template>
        </side-bar>
        <!-- confirmation dailog box -->
        <confirmation-dialog-box
            ref="reupload"
            cancelBtnTitle="No"
            saveBtnTitle="Yes"
            @save="clearData"
        />
        <confirmation-dialog-box
            ref="confirm"
            cancelBtnTitle="No"
            saveBtnTitle="Yes"
            @save="uploadBulkProducts"
        />
        <csv-view
            title="Errors"
            ref="errors-preview"
            class="errors-preview"
            v-show="errorsTable().data.length"
            :csvExportFileName="
                file ? `validation-errors-${file.name}_.csv` : null
            "
        ></csv-view>
    </div>
</template>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
    .set-upload {
        line-height: 56.5px;
        cursor: pointer;
        color: @RoyalBlue;
        -webkit-font-smoothing: antialiased;
    }
    .set-upload-disabled {
        color: @DustyGray2;
    }
}

.upload-container {
    margin: 24px;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;
    .top-content {
        display: flex;
        justify-content: space-between;
    }

    .title {
        line-height: 130%;
    }

    .subtitle {
        color: #757575;
        line-height: 160%;

        .link {
            color: #2e31be;
            font-weight: 700;
            cursor: pointer;
            padding-top: 4px;
        }
    }

    .filters {
        display: flex;

        ::v-deep .nitrozen-dropdown-label {
            display: none;
        }
        ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger {
            color: #9b9b9b;
            font-weight: 400;
            font-size: 12px;
            line-height: 160%;
        }
        .download-button {
            width: 170px;
            ::v-deep
                .nitrozen-dropdown-container
                .nitrozen-select__trigger
                span {
                font-weight: 700;
                font-size: 14px;
                line-height: 140%;
                color: #2e31be;
            }

            ::v-deep .nitrozen-dropdown-container .nitrozen-select {
                border: 1px solid #2e31be;
            }
        }

        .arrow-icon {
            cursor: pointer;
            padding-left: 24px;
        }
    }

    .divider {
        border: 1px solid #e0e0e0;
        margin: 24px 0 24px 0;
    }
}

.bottom-container {
    .t-content {
        display: flex;
        justify-content: space-between;
    }

    .history-content {
        display: flex;
        align-items: center;
        cursor: pointer;

        p {
            padding-left: 4px;
        }
    }

    input[type='file'] {
        display: none;
    }

    .file-upload-box {
        width: 100%;
        height: 200px;
        background: rgba(240, 244, 255, 0.5);
        border: 1px dashed rgba(46, 49, 190, 0.5);
        border-radius: 4px;
        margin-top: 16px;
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
}

.upload-progress {
    margin-top: 16px;
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

.summary {
    margin: 24px;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;
    min-height: 320px;

    .record-summary {
        display: flex;
        justify-content: space-between;

        .buttons {
            ::v-deep .n-button {
                height: 35px;
            }

            ::v-deep .n-button-stroke,
            .n-flat-button {
                padding: 0 16px;
            }
        }
    }

    .record-status {
        display: flex;
        padding-top: 8px;
    }

    .divider {
        margin-top: 16px;
        border: 1px solid #e0e0e0;
    }

    .status {
        display: flex;
        align-items: center;
        padding-left: 16px;

        p {
            padding-left: 4px;
        }
    }
}

.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.errors-preview {
    visibility: hidden;
}

.total-records {
    align-self: center;
}

.pointer {
    cursor: pointer;
}

.selection-dropdown {
    text-align: justify;
    width: 273px;
}

.pl-16 {
    padding-left: 16px;
}

.mr-16 {
    margin-right: 16px;
}

.inline {
    display: flex;
}
</style>

<script>
import CatalogService from '@/services/catalog.service';
import admpageheader from '@/components/common/layout/page-header';
import {
    NitrozenButton,
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDropdown,
    NitrozenError,
    NitrozenDialog,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

import PageError from '@/components/common/page-error';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import ConfirmationDialogBox from '@/components/common/confirmation-dialog.vue';
import LearnMore from '../components/learn-more.vue';
import sidebar from '../components/side-bar.vue';
import NoRecords from '../components/no-records.vue';
import InfoBar from '../components/info-bar.vue';
import CsvView from '@/components/common/adm-csv-viewer.vue';
import {
    parseCsvV1,
    getCSVValidationErrors,
    getBoolean
} from '@/helper/csv-parser.helper.js';
import * as XLSX from 'xlsx';
import { CatalogueSchemaService } from '@/services/bulk-upload.service';
import GrindorService from '@/services/grindor.service';
import { saveAs } from 'file-saver';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import pickBy from 'lodash/pickBy';
import uniqBy from 'lodash/uniqBy';
import keys from 'lodash/keys';
import uniq from 'lodash/uniq';
import find from 'lodash/find';
import chunk from 'lodash/chunk';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import cloneDeep from 'lodash/cloneDeep';
import { debounce } from '@/helper/utils';
import { mapGetters } from 'vuex';
import { GET_USER_INFO } from '@/store/getters.type';

const PRODUCT_NAME_MAPPING = {
    attribute: 'attributes',
    hsn: 'taxation',
    'product-template': 'templates',
    department: 'department',
    category: 'category'
};

const FILE_TYPES = [
    { value: 'excel', text: 'Excel (.xlsx)' },
    { value: 'csv', text: 'CSV (.csv)' }
];

const SUPPORTED_INPUT_FILE_TYPES = ['csv', 'xls', 'xlsx'];

export default {
    name: 'bulk-import',
    components: {
        NitrozenButton,
        NitrozenInput,
        NitrozenInline,
        NitrozenDropdown,
        NitrozenDialog,
        NitrozenError,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenToggleBtn,
        'adm-page-header': admpageheader,
        'adm-inline-svg': InlineSvg,
        'side-bar': sidebar,
        'learn-more': LearnMore,
        loader,
        PageError,
        'no-records': NoRecords,
        'info-bar': InfoBar,
        'csv-view': CsvView,
        ConfirmationDialogBox
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        getTitle() {
            return `Import ${this.capitalize(
                this.$route.params.type === 'product-template'
                    ? 'template'
                    : this.$route.params.type
            )} Data`;
        },
        isSuccessVisible() {
            return !(
                this.productsArray.length === this.errorsTable().data.length
            );
        },
        isErrorVisible() {
            return this.errorsTable().data.length ? true : false;
        },
        getInfoDesc() {
            if (!this.isSuccessVisible) {
                return `All the ${
                    this.productsArray.length ? this.productsArray.length : ''
                } records contain error. Check your file contents and reupload the file again`;
            } else {
                return 'Validate and confirm to save your import progress';
            }
        },
        ...mapGetters({
            userData: GET_USER_INFO
        })
    },
    data() {
        return {
            productType: this.$route.params.type,
            pageLoading: false,
            pageError: false,
            isOpen: true,
            sidebarToggle: false,
            selectedFileType: null,
            fileTypes: FILE_TYPES,
            highlight: false,
            file: null,
            acceptedMIMETypesString: [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ],
            inputFileMeta: {},
            productsTable: {
                meta: { fields: [] },
                data: []
            },
            templateSchema: null,
            templateDetails: null,
            companyId: this.$route.params.company_id,
            productsArray: [],
            showErrorsTable: false,
            errorsArray: [],
            validSchema: false,
            templates: [],
            selectedTemplate: null,
            categoriesList: [
                { value: 'l1_l2', text: 'Level 1 and Level 2 Categories' },
                { value: 'l3', text: 'Level 3 Category' }
            ],
            templatesList: [
                { value: 'update', text: 'Update HSN Codes' },
                { value: 'create', text: 'Add New HSN Codes' }
            ],
            selectedCategory: null,
            isUploading: false,
            isCompleted: false,
            isTableLoaded: false,
            isDisabled: false
        };
    },
    mounted() {
        if (
            ['attribute', 'department', 'product-template'].includes(
                this.productType
            )
        ) {
            this.fetchTemplate(null);
        }
    },
    methods: {
        redirectToList() {
            this.$router.push(
                `/administrator/product/${
                    PRODUCT_NAME_MAPPING[this.productType]
                }`
            );
        },
        capitalize(str) {
            return str && str.charAt(0).toUpperCase() + str.slice(1);
        },
        toggleBtn() {
            this.isOpen = !this.isOpen;
        },
        goToLearnMore() {
            this.sidebarToggle = true;
        },
        closeOverlay() {
            this.sidebarToggle = !this.sidebarToggle;
        },
        /**Confirmation dialog box function*/
        reUploadConfirmationDialogBox: function() {
            this.$refs['reupload'].openConfirmation({
                title: 'Are you sure?',
                message:
                    'If you reupload, your current upload progress will be lost'
            });
        },
        clearData() {
            this.inputFileMeta = { name: '', fileSize: null, progress: null };
            this.validSchema = false;
            this.productsArray = [];
            this.errorsArray = [];
            this.showErrorsTable = false;
            this.file = null;
            this.isUploading;
            this.isTableLoaded = false;
            this.productsTable = {
                meta: { fields: [] },
                data: []
            };
            this.isDisabled = false;
            this.isOpen = true;
        },
        confirmDialogBox() {
            if (
                this.errorsTable().data.length &&
                this.errorsTable().data.length !== this.productsArray.length
            ) {
                this.$refs['confirm'].openConfirmation({
                    title: 'Are you sure?',
                    message: `Your file contains '${
                        this.errorsTable().data.length
                    } error' records and '${this.productsArray.length -
                        this.errorsTable().data.length} Validated' records.
                              If you confirm, only the validated records will get uploaded`
                });
            } else {
                this.uploadBulkProducts();
            }
        },
        navigateToHistory() {
            this.$router.push({
                path: `/administrator/product/${this.productType}/import/upload-history`
            });
        },
        downloadSample(type) {
            let filter;
            if (this.productType === 'category') {
                if (!this.selectedCategory) {
                    this.$snackbar.global.showError('Select category');
                    return;
                }
                filter = this.selectedCategory;
            } else if (this.productType === 'hsn') {
                if (!this.selectedTemplate) {
                    this.$snackbar.global.showError('Select template');
                    return;
                }
                filter = this.selectedTemplate;
            }
            return CatalogService.sampleBulkTemplateLink(
                this.productType,
                type,
                filter
            ).then((res) => {
                if (type === 'csv') {
                    const file = new File(
                        [res.data],
                        `sample_bulk_import_${this.productType}.csv`,
                        { type: 'data:text/csv;charset=utf-8' }
                    );
                    saveAs(file);
                } else if (type === 'excel') {
                    saveAs(
                        new Blob([res.data], {
                            type:
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        }),
                        `sample_bulk_import_${this.productType}`
                    );
                }
                // this.$openDownloadContextMenu();
            });
        },
        onDrop(e) {
            this.highlight = false;
            const files = e.dataTransfer.files;
            // TODO: allow only one file
            this.handleInputFile(files);
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

            if (fileExtension === 'csv') {
                if (!subfile) this.file = file;
                parseCsvV1(files, (csvFile) => {
                    csvFile.data = csvFile.data.map((d) => {
                        return pickBy(d, (prop) => prop !== '');
                    });

                    let loaded = Math.floor(file.size / 1024) + ' KB';
                    let fileSize = Math.floor(file.size / 1024) + ' KB';
                    this.inputFileMeta = {
                        ...this.inputFileMeta,
                        progress: 100,
                        fileSize: fileSize,
                        loaded: loaded
                    };
                    this.isCompleted = true;
                    this.onUploadCsv(csvFile);
                });
            } else if (['xlsx', 'xls'].includes(fileExtension)) {
                let reader = new FileReader();
                reader.onprogress = this.updateProgress;
                reader.onload = (e) => {
                    let data = new Uint8Array(e.target.result);
                    let workbook = XLSX.read(data, { type: 'array' });

                    if (!workbook.SheetNames || !workbook.SheetNames.length) {
                        this.$snackbar.global.showError('Empty file');
                        return;
                    }
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];

                    const xlsJSON = XLSX.utils.sheet_to_json(sheet);
                    if (!xlsJSON | !xlsJSON.length) {
                        this.$snackbar.global.showError('Empty file');
                        return;
                    }
                    const parsedXls = {
                        meta: { fields: Object.keys(xlsJSON[0]) },
                        data: xlsJSON
                    };

                    if (!subfile) this.file = file;
                    this.onUploadCsv(parsedXls);
                };

                reader.readAsArrayBuffer(file);
            }
        },
        updateProgress(evt) {
            if (evt.lengthComputable) {
                let percentLoaded = Math.round((evt.loaded / evt.total) * 100);
                let loaded = Math.floor(evt.loaded / 1024);
                let fileTotal = Math.floor(evt.total / 1024);
                this.inputFileMeta.fileSize = fileTotal + ' KB';
                this.inputFileMeta.loaded = loaded + ' KB';
                // Increase the progress bar length.
                if (percentLoaded !== null) {
                    this.inputFileMeta = {
                        ...this.inputFileMeta,
                        progress: percentLoaded
                    };
                    if (parseInt(percentLoaded) === 100) {
                        this.isUploading = false;
                        this.isCompleted = true;
                    }
                }
            }
        },
        clearInputFile() {
            this.$refs.inputFile.value = '';
            this.inputFileMeta = { name: '', fileSize: null, progress: null };
            //this.$refs['csv-preview'] && this.$refs['csv-preview'].removeGrid();
            this.validSchema = false;
            this.productsArray = [];
            this.errorsArray = [];
            this.showErrorsTable = false;
            this.file = null;
            this.isUploading;
            this.isTableLoaded = false;
            this.productsTable = {
                meta: { fields: [] },
                data: []
            };
            this.isDisabled = false;
            this.isOpen = true;
        },
        onUploadCsv(productsTable = {}) {
            // this.isTableLoaded = true;
            this.productsTable = productsTable;
            this.renderTable();
            this.processBulkProducts();
        },
        renderTable() {
            this.$refs['csv-preview'].createGrid({
                column: this.productsTable.meta.fields.map((e) => ({
                    headerName: e,
                    field: e,
                    resizable: true,
                    width: 120
                })),
                rows: this.productsTable.data
            });
            this.isDisabled = true;
            this.isOpen = false;
            this.isTableLoaded = true;
        },
        schema() {
            let templateSchema = cloneDeep(this.templateSchema);
            return templateSchema.schema;
        },
        schemaProp() {
            switch (this.productType) {
                case 'department':
                    return '_Department';
                case 'category':
                    return this.selectedCategory === 'l1_l2'
                        ? '_Category'
                        : '_L3Category';
                case 'product-template':
                    return '_ProductTemplate';
                case 'attribute':
                    return '_Attribute';
                case 'hsn':
                    return this.selectedTemplate === 'update_delete_hsn'
                        ? '_HsnUpdateDelete'
                        : '_HsnCodeV2';
                default:
                    break;
            }
        },
        fetchTemplate(filter) {
            this.clearInputFile();
            this.loadTemplateSchema(filter);
        },
        loadTemplateSchema(filter) {
            CatalogService.fetchTemplateSchema(this.productType, {}, filter)
                .then(({ data }) => {
                    this.pageError = false;
                    this.templateSchema = data;
                    this.templateDetails = data;
                })
                .catch((err) => {
                    this.pageError = true;
                    this.$snackbar.global.showError(
                        'Failed to load template schema'
                    );
                    console.error(err);
                });
        },
        processBulkProducts() {
            // merge json schema
            let cssObj;
            try {
                cssObj = new CatalogueSchemaService(
                    this.schema(),
                    this.schemaProp()
                );
            } catch (err) {
                this.clearInputFile();
                console.log(err);
                this.$snackbar.global.showError(
                    'Validation schema error, please report an issue to support team'
                );
                return;
            }
            //map values
            let result = [];
            try {
                mapValues(this.productsTable.data, (item) => {
                    let synonyms;
                    let tryouts;
                    let departments;
                    let attributes;
                    let categories;
                    if (item['Synonyms']) {
                        synonyms = item['Synonyms'];
                    }

                    if (item['Departments']) {
                        departments = item['Departments'];
                    }

                    if (item['Attributes']) {
                        attributes = item['Attributes'];
                    }
                    if (item['Categories']) {
                        categories = item['Categories'];
                    }

                    if (this.productType === 'department') {
                        result.push({
                            name: item['Name'],
                            logo: item['Logo'],
                            slug: item['Slug'],
                            priority_order: item['Priority'],
                            is_active: this.parseBoolean(item['Active']),
                            synonyms: synonyms
                        });
                    } else if (this.productType === 'category') {
                        let media;
                        if (
                            item['Logo'] &&
                            item['Landscape'] &&
                            item['Portrait']
                        ) {
                            let logo = item['Logo'];
                            let landscape = item['Landscape'];
                            let portrait = item['Portrait'];
                            media = { logo, landscape, portrait };
                        }

                        result.push({
                            level: item['Level'],
                            name: item['Name'],
                            slug: item['Slug'],
                            departments: departments,
                            media: media,
                            synonyms: synonyms,
                            priority: item['Priority'],
                            is_active: this.parseBoolean(item['Active']),
                            hierarchy: item['Hierarchy'],
                            tryouts: item['Tryouts'],
                            command: item['COMMAND'],
                        });
                    } else if (this.productType === 'product-template') {
                        result.push({
                            slug: item['Slug'],
                            name: item['Name'],
                            departments: departments,
                            description: item['Description'],
                            categories: categories,
                            attributes: attributes,
                            is_active: this.parseBoolean(item['Active']),
                            logo: item['Logo'],
                            is_physical: this.parseBoolean(item['Physical']),
                            is_expirable: this.parseBoolean(item['Expirable'])
                        });
                    } else if (this.productType === 'hsn') {
                        let taxes;

                        let rate = item['GST Rate #1'];
                        let rate_1 = item['GST Rate #2'];
                        let threshold = item['Threshold'];
                        let effective_date = item['Effective Date'];
                        let cess = item['CESS #1'];
                        let cess_1 = item['CESS #2'];
                        taxes = {
                            rate,
                            rate_1,
                            threshold,
                            effective_date,
                            cess,
                            cess_1
                        };
                        result.push({
                            reporting_hsn: item['Reporting HSN Code'],
                            type: item['Type'],
                            description: item['Description'],
                            hsn_code: item['HSN Code'],
                            command: item['Command'],
                            country: item['Country'],
                            taxes: taxes
                        });
                    } else if (this.productType === 'attribute') {
                        let details;
                        let filters;
                        let schema;
                        if (item['Display Type']) {
                            details = { display_type: item['Display Type'] };
                        }

                        schema = {
                            type: item['Type'],
                            allowed_values: item['Allowed Values'],
                            multi: this.parseBoolean(
                                item['Allow Multiple Values']
                            ),
                            mandatory: this.parseBoolean(item['Required']),
                            format: item['Formatting'],
                            range: { min: item['Min'], max: item['Max'] }
                        };
                        result.push({
                            slug: item['Slug'],
                            name: item['Name'],
                            description: item['Description'],
                            departments: departments,
                            enabled_for_end_consumer: this.parseBoolean(
                                item['Public']
                            ),
                            variant: this.parseBoolean(
                                item['Variant Permissable']
                            ),
                            logo: item['Logo'],
                            unit: item['Unit'],
                            filter: this.parseBoolean(item['Filter']),
                            attribute_schema: schema
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                this.$snackbar.global.showError(err);
            }
            this.productsArray = result;
            if (this.productsArray.length) {
                this.validSchema = cssObj.validate({
                    data: this.productsArray
                });
                this.errorsArray = cssObj.getSchemaErrors();
                this.validSchema =
                    this.validSchema && this.errorsArray.length == 0;
                if (this.validSchema) {
                    this.$snackbar.global.showSuccess(
                        'File is in valid format, you can start upload'
                    );
                } else {
                    this.$snackbar.global.showError('File data is invalid');
                    // this.$refs['csv-preview'].csvExportFileName = this.file
                    //     ? `validation-errors-${this.file.name}_.csv`
                    //     : null;
                    const errorsData = this.errorsTable().data;
                    this.$refs[
                        'csv-preview'
                    ].grid.gridOptions.getRowClass = function(params) {
                        const exists = errorsData.find(
                            (item) => item.index == params.rowIndex
                        );
                        if (exists) {
                            return 'error-row';
                        }
                    };
                    setTimeout(() => {
                        this.$refs[
                            'csv-preview'
                        ].grid.gridOptions.api.redrawRows();
                    }, 0);
                }
            }
        },
        errorsTable() {
            const mappedErrors = this.errorsArray.map((err) => {
                const msgs = [];
                err.map((e) => {
                    if (e.keyword == 'enum') {
                        msgs.push(`${e.property}: '${e.data}' ${e.message}`);
                    } else if (
                        [
                            'type',
                            'maxLength',
                            'minLength',
                            'pattern',
                            'minItems',
                            'size-meta'
                        ].includes(e.keyword)
                    ) {
                        msgs.push(`${e.property}: ${e.message}`);
                    } else {
                        msgs.push(`${e.property}: ${e.message}`);
                    }
                });
                const index = err[0].index;
                return {
                    index,
                    Errors: msgs.join(', \n')
                };
            });

            return {
                meta: { fields: ['Errors'] },
                data: values(mappedErrors)
            };
        },
        downloadErrors() {
            this.getErrorsTable();
            this.$refs['errors-preview'].csvExportFileName = this.file
                ? `validation-errors-${this.file.name}_.csv`
                : null;
            this.$refs['errors-preview'].exportErrorsInCsv();
        },
        getErrorsTable() {
            // if (this.showErrorsTable) {
            //     this.showErrorsTable = false;
            //     return;
            // }
            // this.showErrorsTable = true;
            this.$refs['errors-preview'].createGrid(
                {
                    column: this.errorsTable().meta.fields.map((e) => ({
                        headerName: e,
                        field: e,
                        resizable: true,
                        width: e == 'Errors' ? 600 : 120
                    })),
                    rows: this.errorsTable().data
                },
                { rowClass: 'error-row' }
            );
        },
        uploadBulkProducts() {
            this.pageLoading = true;
            this.uploadToGrindor(this.file).then((filePath) => {
                // bulk upload catalogue
                if (filePath && this.productsArray.length) {
                    const fileExtension = this.file.name.split('.').pop();
                    let file_type;
                    if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                        file_type = 'excel';
                    } else if (fileExtension === 'csv') {
                        file_type = 'csv';
                    }
                    this.bulkRequest(
                        this.productsArray.length,
                        filePath,
                        file_type
                    );
                }
                // this.pageLoading = false; // for now
            });
        },
        bulkRequest(count, file_path, file_type) {
            let payload = {};
            // payload.stats = { total: count };
            payload.total_count = count;
            payload.tracking_url = file_path;
            payload.file_type = file_type;
            if (this.getUserEmail()) {
                payload.notification_emails = [this.getUserEmail()];
            }
            return CatalogService.bulkRequest(
                this.productType,
                payload,
                'import'
            )
                .then(({ data }) => {
                    this.navigateToHistory();
                    this.$snackbar.global.showSuccess('File import started');
                    this.pageLoading = false;
                })
                .catch((ex) => {
                    this.pageLoading = false;
                    this.$snackbar.global.showError(
                        `Failed to request bulk upload ${
                            ex && ex.message ? ' : ' + ex.message : ''
                        }`
                    );
                    return false;
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        uploadToGrindor(file) {
            if (file) {
                let body = {
                    file_name: file.name,
                    content_type: file.type,
                    size: file.size,
                    params: {
                        company_id: this.companyId || '1',
                        type: this.productType
                    }
                };
                let request = { body };
                this.loading = true;
                return GrindorService.upload(
                    'admin-catalogue-import-export',
                    body,
                    file
                )
                    .then(({ data }) => {
                        if (data && data.cdn && data.cdn.url) {
                            return data.cdn.url;
                        }
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            err &&
                                err.response &&
                                err.response.data &&
                                err.response.data.message
                                ? err.response.data.message
                                : 'Failed to upload image'
                        );
                        console.error(err);
                        return false;
                    })
                    .finally(() => {
                        // this.loading = false;
                    });
            }
        },
        getUserEmail() {
            return this.userData.user.emails[0].email;
        },
        getFileType() {
            return this.file.name.split('.').pop();
        },
        parseBoolean(data) {
            if (this.getFileType() === 'csv') {
                return getBoolean(data);
            } else {
                return data;
            }
        }
    }
};
</script>
