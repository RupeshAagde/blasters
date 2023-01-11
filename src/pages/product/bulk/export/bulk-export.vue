<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header
                title="Export"
                @backClick="redirectToList"
            ></adm-page-header>
        </div>
        <loader v-if="pageLoading" class="loading"></loader>
        <page-error v-else-if="pageError" @tryAgain="loadData"></page-error>
        <div class="upload-container">
            <div class="top-content">
                <div class="title-content">
                    <p class="cl-mako darker-md title">{{ getTitle }}</p>
                    <p class="regular-xxxs subtitle">
                        Need help in exporting?
                        <span class="link" @click="goToLearnMore">
                            Learn Here</span
                        >
                    </p>
                </div>
                <div
                    class="right-content"
                    v-if="
                        productType === 'department' ||
                            productType === 'hsn' ||
                            productType === 'attribute'
                    "
                >
                    <div class="flex-align-center">
                        <div class="notify" v-if="getUserEmail() !== ''">
                            <nitrozen-checkbox
                                class="chekbox"
                                v-model="notifyByEmail"
                                @change=""
                            ></nitrozen-checkbox>
                            <p class="cl-Mako regular-xxxs">
                                Notify on
                                <span class="cl-RoyalBlue darker-xxxs">{{
                                    getUserEmail()
                                }}</span>
                            </p>
                        </div>
                        <div class="notify" v-else>
                            <p
                                class="cl-RoyalBlue darker-xxxs pointer"
                                @click="openConfirmationDialogBox"
                            >
                                +Add Email
                                <span class="cl-Mako regular-xxxs"
                                    >to get notified</span
                                >
                            </p>
                        </div>
                        <nitrozen-tooltip
                            position="top"
                            tooltipText="When the export is completed, you'll receive a notification
                            along with the requested file on your email"
                            icon="help"
                        />
                    </div>
                    <div
                        class="ml-16 filters"
                        v-if="productType === 'attribute'"
                    >
                        <nitrozen-dropdown
                            label="Department"
                            :placeholder="
                                selectedDepartments &&
                                selectedDepartments.length
                                    ? `${selectedDepartments.length} selected`
                                    : 'Choose department(s)'
                            "
                            class="selection-dropdown attribute"
                            :items="departmentList"
                            :multiple="true"
                            :searchable="true"
                            :enable_select_all="true"
                            v-model="selectedDepartments"
                            @change=""
                            @searchInputChange="setDepartmentsList"
                        ></nitrozen-dropdown>
                    </div>
                    <div class="download-button ml-16">
                        <nitrozen-dropdown
                            label="Download Sample"
                            :placeholder="'Export'"
                            class="file-download-dropdown"
                            :class="[
                                {
                                    disabled:
                                        productType === 'attribute'
                                            ? !selectedDepartments.length
                                                ? true
                                                : false
                                            : false
                                }
                            ]"
                            :items="fileTypes"
                            v-model="selectedFileType"
                            @change="bulkExport"
                        ></nitrozen-dropdown>
                    </div>
                </div>
            </div>
            <div
                class="bottom-content"
                v-if="
                    productType === 'category' ||
                        productType === 'product-template'
                "
            >
                <div class="department">
                    <nitrozen-dropdown
                        label="Department"
                        :placeholder="
                            selectedDepartments && selectedDepartments.length
                                ? `${selectedDepartments.length} selected`
                                : 'Choose department(s)'
                        "
                        class="selection-dropdown"
                        :items="departmentList"
                        v-model="selectedDepartments"
                        :multiple="true"
                        :enable_select_all="true"
                        :searchable="true"
                        @change="fetchCategories"
                        @searchInputChange="setDepartmentsList"
                    ></nitrozen-dropdown>
                </div>
                <div class="category">
                    <nitrozen-dropdown
                        label="Category"
                        :placeholder="
                            selectedCategories && selectedCategories.length
                                ? `${selectedCategories.length} selected`
                                : 'Select categories'
                        "
                        class="selection-dropdown"
                        :items="templateCategories"
                        :multiple="true"
                        :enable_select_all="
                            templateCategories.length ? true : false
                        "
                        :searchable="true"
                        @searchInputChange="setCategoriesList"
                        v-model="selectedCategories"
                        @change=""
                    ></nitrozen-dropdown>
                </div>
                <div class="download-button">
                    <nitrozen-dropdown
                        :class="[
                            {
                                disabled:
                                    !selectedCategories.length &&
                                    !selectedDepartments.length
                            }
                        ]"
                        label="Download Sample"
                        :placeholder="'Export'"
                        class="file-download-dropdown"
                        :items="fileTypes"
                        v-model="selectedFileType"
                        @change="bulkExport"
                    ></nitrozen-dropdown>
                </div>
            </div>
            <div
                class="notify-bottom"
                v-if="
                    productType === 'category' ||
                        productType === 'product-template'
                "
            >
                <div class="flex-align-center" v-if="getUserEmail() !== ''">
                    <nitrozen-checkbox
                        class="chekbox"
                        v-model="notifyByEmail"
                        @change=""
                    ></nitrozen-checkbox>
                    <p class="cl-Mako regular-xxxs">
                        Notify on
                        <span class="cl-RoyalBlue darker-xxxs">{{
                            getUserEmail()
                        }}</span>
                    </p>
                </div>
                <div class="flex-align-center" v-else>
                    <p
                        class="cl-RoyalBlue darker-xxxs pointer"
                        @click="openConfirmationDialogBox"
                    >
                        +Add Email
                        <span class="cl-Mako regular-xxxs"
                            >to get notified</span
                        >
                    </p>
                </div>
                <nitrozen-tooltip
                    position="top"
                    tooltipText="When the export is completed, you'll receive a notification
                            along with the requested file on your email"
                    icon="help"
                />
            </div>
        </div>
        <div>
            <export-history ref="history"></export-history>
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
        <confirmation-dialog-box
            ref="confirm"
            cancelBtnTitle="Cancel"
            saveBtnTitle="Redirect"
            @save="closeConfirmationDialogBox($event)"
        />
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
        ::v-deep .nitrozen-dropdown-label {
            display: none;
        }
    }
    .download-button {
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

.right-content {
    display: flex;
    .notify {
        display: flex;
        align-items: center;

        .chekbox {
            position: relative;
            bottom: 10px;
        }
    }
    .attribute {
        width: 275px;
    }
    .download-button {
        width: 150px;
    }
}

.notify-bottom {
    display: flex;
    align-items: center;
    margin-top: 18px;
    .chekbox {
        position: relative;
        bottom: 10px;
    }
}

.bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-top: 16px;
    gap: 16px;

    .department {
        width: 42%;
    }

    .category {
        width: 42%;
    }

    .download-button {
        width: 16%;
    }
}

.ml-16 {
    margin-left: 16px;
}

.inline {
    display: flex;
}
.flex-align-center {
    display: flex;
    align-items: center;
}
.pointer {
    cursor: pointer;
}
.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}
::v-deep
    .nitrozen-dropdown-container
    .nitrozen-select.nitrozen-dropdown-open
    .nitrozen-options {
    z-index: 100;
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
    strokeBtn,
    NitrozenCheckBox,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';

import PageError from '@/components/common/page-error';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import LearnMore from '../components/learn-more.vue';
import sidebar from '../components/side-bar.vue';
import exportHistory from './export-history.vue';
import GrindorService from '@/services/grindor.service';
import CompanyService from '@/services/company-admin.service';
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
import { mapGetters } from 'vuex';
import { GET_USER_INFO } from '@/store/getters.type';
import ConfirmationDialogBox from '@/components/common/confirmation-dialog.vue';
import root from 'window-or-global';

const env = root.env || {};

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
        'export-history': exportHistory,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-tooltip': NitrozenTooltip,
        loader,
        PageError,
        ConfirmationDialogBox
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        getTitle() {
            return `Export ${this.capitalize(
                this.$route.params.type === 'product-template'
                    ? 'template'
                    : this.$route.params.type
            )} Data`;
        },
        ...mapGetters({
            userData: GET_USER_INFO
        }),
        selectedDeptIds() {
            if (_.isEmpty(this.departments)) return [];
            const uids = [];
            this.departments.forEach((dept) => {
                if (this.selectedDepartments.includes(dept.slug)) {
                    uids.push(dept.uid);
                }
            });
            return uids;
        }
    },
    data() {
        return {
            productType: this.$route.params.type,
            pageLoading: false,
            pageError: false,
            sidebarToggle: false,
            selectedFileType: null,
            fileTypes: FILE_TYPES,
            companyId: this.$route.params.company_id,
            notifyByEmail: true,
            categories: [],
            templateCategories: [],
            selectedCategories: [],
            departmentList: [],
            departments: [],
            selectedDepartments: [],
            exportConfig: {
                attribute: ['department'],
                category: ['department', 'category'],
                'product-template': ['department', 'category'],
                hsn: [],
                department: []
            }
        };
    },
    mounted() {
        this.init();
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
        goToLearnMore() {
            this.sidebarToggle = true;
        },
        closeOverlay() {
            this.sidebarToggle = !this.sidebarToggle;
        },
        getUserEmail() {
            if (this.userData && this.userData.user) {
                const user = this.userData.user;
                if (user.emails && user.emails.length !== 0) {
                    let emailID = user.emails.find((item) => {
                        return item.verified && item.primary;
                    });
                    if (emailID && emailID.email) {
                        return emailID.email;
                    }
                }
            }
            return '';
        },
        init() {
            let typeConfig = this.exportConfig[this.productType];
            typeConfig &&
                typeConfig.length &&
                typeConfig.forEach((type) => {
                    if (type === 'department') {
                        this.fetchDepartments();
                    } else if (type === 'category') {
                        this.fetchCategories();
                    }
                });
        },
        fetchDepartments() {
            return new Promise((resolve, reject) => {
                const query = {
                    page_size: 9999,
                    page_no: 1
                };
                CompanyService.fetchDepartments(query)
                    .then(({ data }) => {
                        this.departments = data.items;
                        this.setDepartmentsList();
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchCategories(e) {
            const params = {
                page_size: 999999,
                page_no: 1
            };
            if (e && e.length !== this.departments.length)
                params.department = this.selectedDeptIds;
            return new Promise((resolve, reject) => {
                CompanyService.fetchCategory_v2(params)
                    .then(({ data }) => {
                        this.categories = data.items;
                        this.selectedCategories = [];
                        this.setCategoriesList();
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        setDepartmentsList(e = {}) {
            this.departmentList = [];
            this.departments.forEach((d) => {
                if (
                    !e.text ||
                    d.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.departmentList.push({
                        text: d.name,
                        value: d.slug
                    });
                }
            });
        },
        setCategoriesList(e = {}) {
            this.templateCategories = [];
            this.categories.forEach((c) => {
                if (
                    !e.text ||
                    c.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.templateCategories.push({
                        text: c.name,
                        value: c.slug
                    });
                }
            });
        },
        selectCategories(type) {
            this.selectedCategories = [this.selectedCategories];
        },
        selectDepartments() {
            this.selectedDepartments = [this.selectedDepartments];
            if (this.productType === 'template') {
                this.fetchCategories();
            }
        },
        bulkExport(type) {
            this.pageLoading = true;
            let payload = {};
            payload.filters = {};
            if (this.selectedDepartments.length) {
                payload.filters.departments = this.selectedDepartments;
            }
            if (this.selectedCategories.length) {
                payload.filters.categories = this.selectedCategories;
            }
            payload.file_type = type;
            if (this.notifyByEmail) {
                if (this.getUserEmail()) {
                    payload.notification_emails = [this.getUserEmail()];
                }
            }

            return CatalogService.bulkRequest(
                this.productType,
                payload,
                'export'
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(`Export Started`);
                    this.clearAllInputs();
                    this.$refs.history.loadHistory();
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
        clearAllInputs() {
            this.selectedCategories = [];
            this.selectedDepartments = [];
            this.selectedFileType = null;
        },
        /**Confirmation dialog box function*/
        openConfirmationDialogBox() {
            this.$refs['confirm'].openConfirmation({
                title: "You'll be redirected",
                message:
                    "You'll be redirected to the “My Profile” section to add an Email ID"
            });
        },
        closeConfirmationDialogBox(e) {
            window.open(`${env.MIRAGE_MAIN_DOMAIN}/user-profile`, '_blank');
        }
    }
};
</script>
