<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header
                title="Import"
                @backClick="redirectToList"
            ></adm-page-header>
        </div>
        <!-- <loader v-if="pageLoading" class="loading"></loader>
        <page-error v-else-if="pageError" @tryAgain="loadData"></page-error> -->
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
                    <nitrozen-dropdown
                        label="Download Sample"
                        :placeholder="'Download Sample'"
                        class="file-download-dropdown"
                        :items="fileTypes"
                        v-model="selectedFileType"
                        @change="downloadSample"
                    ></nitrozen-dropdown>
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
                        highlight
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
                        <div class="progress-bar">
                            <div
                                class="progress"
                                :style="{ width: inputFileMeta.progress }"
                            ></div>
                        </div>
                        <div class="flex-content">
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
            <validation-summary> </validation-summary>
        </div>
        <side-bar
            v-if="sidebarToggle"
            ref="sidebar"
            :closeOverlay="closeOverlay"
            :title="'Learn More'"
        >
            <learn-more></learn-more>
        </side-bar>
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

        ::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger span {
            font-weight: 700;
            font-size: 14px;
            line-height: 140%;
            color: #2e31be;
        }

        ::v-deep .nitrozen-dropdown-container .nitrozen-select {
            border: 1px solid #2e31be;
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

.pointer {
    cursor: pointer;
}

.inline {
    display: flex;
}
</style>

<script>
// import CatalogService from '@/services/catalog.service';
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

// import BulkHistory from './bulk-history.vue';
import PageError from '@/components/common/page-error';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import LearnMore from '../components/learn-more.vue';
import sidebar from '../components/side-bar.vue';
import validationSummary from './validation-summary.vue';
import CsvView from '@/components/common/adm-csv-viewer.vue';
import {
    parseCsvV1,
    getCSVValidationErrors
} from '@/helper/csv-parser.helper.js';
import XLSX from 'xlsx';
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

const PRODUCT_NAME_MAPPING = {
    attribute: 'attributes',
    hsn: 'taxation',
    template: 'templates',
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
        'validation-summary': validationSummary,
        loader,
        PageError
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        getTitle() {
            return `Import ${this.capitalize(this.$route.params.type)} Data`;
        }
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
            label: 'CSV file',
            file: null,
            acceptedMIMETypesString: [
                'text/csv',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ],
            errorMessage: '',
            inputFileMeta: {},
            productsTable: {
                meta: { fields: [] },
                data: []
            },
            templateSchema: null,
            templateDetails: null,
            productsImages: {},
            companyId: this.$route.params.company_id,
            productsArray: [],
            showErrorsTable: false,
            errorsArray: [],
            validSchema: false,
            item_type: '',
            productTypeList: [],
            departmentsList: [],
            templates: [],
            selectedTemplate: null,
            isSet: false,
            categoriesList: [
                { value: 'l1_l2', text: 'Level 1 and Level 2 Categories' },
                { value: 'l3', text: 'Level 3 Category' }
            ],
            templatesList: [
                { value: 'update_delete_hsn', text: 'Update HSN Codes' },
                { value: 'create_hsn', text: 'Add New HSN Codes' }
            ],
            selectedCategory: null,
            brandsList: [],
            selectedBrands: [],
            isUploading: false,
            isCompleted: false,
            tableLoader: false
        };
    },
    mounted() {
        // if(['attribute', 'department', 'template'].includes(this.productType)) {
        //     this.refetchTemplate(null);
        // }
        console.log(this.$route.params);
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
                // this.refetchTemplate(filter);
            } else if (this.productType === 'hsn') {
                if (!this.selectedTemplate) {
                    this.$snackbar.global.showError('Select template');
                    return;
                }
                filter = this.selectedTemplate;
                // this.refetchTemplate(filter);
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
                this.$openDownloadContextMenu();
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
                console.log(this.file);
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
            console.log(this.file);
            debugger;
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
            this.productsTable = {
                meta: { fields: [] },
                data: []
            };
        },
        onUploadCsv(productsTable = {}) {
            this.tableLoader = true;
            this.productsTable = productsTable;
            // this.renderTable();
            // this.processBulkProducts();
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
        }
    }
};
</script>
