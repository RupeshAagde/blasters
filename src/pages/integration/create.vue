<template>
    <div class="integration">
        <div class="page-header-position">
            <page-header
                :title="`${isEditOnly ? 'Edit' : 'Create'} Integration`"
                @backClick="onCancel"
            >
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm"
                        v-flatBtn
                        >{{ `${isEditOnly ? 'Save' : 'Create'}` }}
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading && !pageError"></loader>
        <div class="main-container" v-show="!pageLoading && !pageError">
            <div class="left-container">
                <div class="page-container company-form mb-24">
                    <div class="schmea-head">
                        <div class="bold-xs cl-Mako">Company Schema</div>
                        <nitrozen-button
                            theme="secondary"
                            @click="preview('companyForm')"
                            >Preview</nitrozen-button
                        >
                    </div>
                    <div class="form-body">
                        <meta-box
                            ref="companyForm"
                            :showJsonOnly="true"
                            :customJson="companyForm"
                        ></meta-box>
                    </div>
                </div>
                <div class="page-container store-form mb-24">
                    <div class="schmea-head">
                        <div class="bold-xs cl-Mako">Store Schema</div>
                        <nitrozen-button
                            theme="secondary"
                            @click="preview('storeForm')"
                            >Preview</nitrozen-button
                        >
                    </div>
                    <div class="form-body">
                        <meta-box
                            ref="storeForm"
                            :showJsonOnly="true"
                            :customJson="storeForm"
                        ></meta-box>
                    </div>
                </div>
                <div class="page-container extra-form mb-24">
                    <label class="bold-xs cl-Mako">Permissions</label>
                    <div class="form-body selection-div">
                        <nitrozen-check-box
                            v-model="selectedSupport"
                            checkboxValue="inventory"
                            >Inventory</nitrozen-check-box
                        >
                        <nitrozen-check-box
                            class="selection-checkbox"
                            v-model="selectedSupport"
                            checkboxValue="order"
                            >Order</nitrozen-check-box
                        >
                    </div>
                    <nitrozen-error v-if="!selectedSupport.length"
                        >Please select atleast one option</nitrozen-error
                    >
                    <div
                        class="form-body mb-24"
                        v-if="selectedSupport.includes('inventory')"
                    >
                        <div class="schmea-head">
                            <div class="bold-xs cl-Mako">Inventory Schema</div>
                            <nitrozen-button
                                theme="secondary"
                                @click="preview('inventoryForm')"
                                >Preview</nitrozen-button
                            >
                        </div>
                        <meta-box
                            ref="inventoryForm"
                            :showJsonOnly="true"
                            :customJson="inventoryForm"
                        ></meta-box>
                    </div>
                    <div
                        class="form-body mb-24"
                        v-if="selectedSupport.includes('order')"
                    >
                        <div class="schmea-head">
                            <div class="bold-xs cl-Mako">Order Schema</div>
                            <nitrozen-button
                                theme="secondary"
                                @click="preview('orderForm')"
                                >Preview</nitrozen-button
                            >
                        </div>
                        <meta-box
                            ref="orderForm"
                            :showJsonOnly="true"
                            :customJson="orderForm"
                        ></meta-box>
                    </div>
                </div>
            </div>
            <div class="right-container">
                <div class="page-container basic-deatils mb-24">
                    <label class="bold-xs cl-Mako">Basic Details</label>
                    <div class="form-body">
                        <nitrozen-input
                            v-model="name.value"
                            label="Name *"
                            placeholder="Name"
                        ></nitrozen-input>
                        <nitrozen-error v-if="name.showerror && !name.value">
                            {{ name.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-body token" v-if="isEditOnly">
                        <nitrozen-input
                            class="token-input"
                            v-model="token"
                            label="Token"
                            :disabled="true"
                            placeholder="Token"
                        ></nitrozen-input>
                        <div
                            id="pageLink"
                            class="pointer"
                            @click="copyToClipboard(token, $event)"
                        >
                            <inline-svg src="copy"></inline-svg>
                        </div>
                    </div>
                    <div class="form-body">
                        <nitrozen-input
                            v-model="description.value"
                            type="textarea"
                            label="Description"
                            placeholder="Description"
                        ></nitrozen-input>
                        <nitrozen-error
                            v-if="description.showerror && !description.value"
                        >
                            {{ description.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-body">
                        <div class="n-input-label">Icon *</div>
                        <image-uploader-tile
                            label="Icon"
                            aspectRatio="*"
                            @delete="icon.value = ''"
                            @save="icon.value = $event"
                            v-model="icon.value"
                            :fileName="'platform integration logo'"
                            namespace="integration-square-logo"
                        ></image-uploader-tile>
                        <nitrozen-error v-if="icon.showerror && !icon.value">
                            {{ icon.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <div class="page-container select-company mb-24">
                    <label class="bold-xs cl-Mako">Company</label>
                    <div class="form-body selection-div">
                        <nitrozen-radio
                            :name="'allCompany'"
                            :radioValue="1"
                            v-model="allCompanies"
                            >All Companies</nitrozen-radio
                        >
                        <nitrozen-radio
                            class="selection-checkbox"
                            :name="'allCompany'"
                            :radioValue="0"
                            v-model="allCompanies"
                            >Specific Companies</nitrozen-radio
                        >
                    </div>
                    <div v-if="!allCompanies">
                        <div class="form-body">
                            <nitrozen-dropdown
                                :items="filteredCompanyList"
                                v-model="selectedCompany"
                                :multiple="true"
                                :searchable="true"
                                @change="setCompanyList"
                                @searchInputChange="companySearch"
                                :label="'Company'"
                            ></nitrozen-dropdown>
                        </div>
                        <nitrozen-error
                            v-if="!selectedCompany.length && !allCompanies"
                            >Please select atleast one company</nitrozen-error
                        >
                        <div class="form-body">
                            <nitrozen-chips
                                v-for="(item, index) in companyChips"
                                :key="'company' + index"
                                class="mb-12"
                            >
                                {{ item.text }}
                                <nitrozen-inline
                                    :icon="'cross'"
                                    class="nitrozen-icon"
                                    v-on:click="removeFromChips(index, item)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>
                <div class="page-container tags mb-24">
                    <label class="bold-xs cl-Mako">Tags</label>
                    <div class="form-body" v-if="tags.length">
                        <div
                            class="tag-row"
                            v-for="(item, index) in tags"
                            :key="'tag' + index"
                        >
                            <nitrozen-input
                                label="Name"
                                placeholder="Name"
                                v-model="item.name"
                            ></nitrozen-input>
                            <nitrozen-input
                                label="Value"
                                placeholder="Value"
                                v-model="item.value"
                            ></nitrozen-input>
                            <nitrozen-check-box v-model="item.isPublic"
                                >Public</nitrozen-check-box
                            >
                            <a class="pointer" @click="removeTag(index)">
                                <inline-svg src="delete"></inline-svg>
                            </a>
                        </div>
                    </div>
                    <div class="form-body">
                        <nitrozen-button theme="secondary" @click="addTags"
                            >Add</nitrozen-button
                        >
                    </div>
                </div>
                <div class="page-container constants mb-24">
                    <label class="bold-xs cl-Mako">Constants</label>
                    <div class="form-body">
                        <meta-box
                            :showJsonOnly="true"
                            :customJson="constants"
                            ref="constants"
                        ></meta-box>
                    </div>
                </div>
            </div>
        </div>

        <nitrozen-dialog ref="previewSchema" title="Preview">
            <template slot="body">
                <div v-if="Object.keys(activeSchema).length">
                    <json-to-form
                        class="form"
                        ref="schema-form"
                        :schema="activeSchema"
                        v-model="activeData"
                        input-wrapping-class="input-wrapping-class"
                    ></json-to-form>
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.integration {
    ::v-deep .button-box {
        display: flex;
        align-items: center;
    }
    ::v-deep .pad-right {
        margin-right: 16px;
    }
    .clickable-label {
        cursor: pointer;
    }
}
.main-container {
    .page-container {
        margin: 0;
        width: auto;
        display: block;
    }
    .schmea-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .mb-24 {
        margin-bottom: 24px;
    }
    .mb-12 {
        margin-bottom: 12px;
    }
    .form-body {
        margin-top: 12px;
    }
    .selection-div {
        display: flex;
        .selection-checkbox {
            margin-left: 24px;
        }
    }
    .right-container {
        flex: 0 calc(40% - 0px);
        .token {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .token-input{
                width: 90%;
            }
        }
        .tags {
            .tag-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }
        }
    }
    .left-container {
        flex: 0 calc(60% - 24px);
        margin-right: 24px;
    }
}
.pointer {
    cursor: pointer;
}
</style>

<script>
import { getRoute } from '@/helper/get-route';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline,
    NitrozenRadio,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import {
    Loader,
    PageHeader,
    ImageUploaderTile,
    InlineSvg,
    MetaBox
} from '@/components/common/';
import JsonToForm from '@/components/common/json-to-form';
import { copyToClipboard } from '@/helper/utils.js';
import CompanyService from '@/services/company-admin.service';
import IntegrationService from '@/services/integration.service';
export default {
    name: 'create-edit-integration',
    components: {
        loader: Loader,
        'page-header': PageHeader,
        'nitrozen-button': NitrozenButton,
        NitrozenInput,
        NitrozenError,
        ImageUploaderTile,
        NitrozenCheckBox,
        InlineSvg,
        MetaBox,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenRadio,
        JsonToForm,
        NitrozenDialog
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        isEditOnly() {
            if (this.$route.params.integrationId) {
                return 'true';
            }
            return false;
        }
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            icon: this.getInitialValue(''),
            description: this.getInitialValue(''),
            name: this.getInitialValue(''),
            tags: [],
            companyForm: {},
            storeForm: {},
            inventoryForm: {},
            orderForm: {},
            constants: {},
            selectedSupport: [],
            companyList: [],
            selectedCompany: [],
            filteredCompanyList: [],
            companyChips: [],
            allCompanies: true,
            activeSchema: {},
            activeData: {},
            integrationData: {},
            token: '',
            integrationId: this.$route.params.integrationId
        };
    },
    mounted() {
        this.pageLoading = true;
        let pArr = [this.getCompanyList()];
        this.getCompanyList();
        if (this.isEditOnly) {
            pArr.push(this.getIntegration());
        }
        Promise.all(pArr)
            .then((res) => {
                this.pageLoading = false;
            })
            .catch((err) => {
                this.pageLoading = false;
                this.pageError = true;
            });
    },
    methods: {
        onCancel() {
            this.$router.push({
                path: `/administrator/integrations/list`
            });
        },
        saveForm() {
            if (!this.validateForm()) return;
            const obj = this.getFormData();
            this.inProgress = true;
            if (this.integrationId) {
                return IntegrationService.saveIntegration(
                    this.integrationId,
                    obj
                )
                    .then(({ data }) => {
                        console.log(data);
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            `Successfully Updated`,
                            {
                                duration: 2000
                            }
                        );
                    })
                    .catch((err) => {
                        this.inProgress = false;
                        this.$snackbar.global.showError('Something went wrong');
                        console.log(err);
                    });
            } else {
                return IntegrationService.addIntegration(obj)
                    .then(({ data }) => {
                        console.log(data);
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            `Successfully Added`,
                            {
                                duration: 2000
                            }
                        );
                    })
                    .catch((err) => {
                        this.inProgress = false;
                        this.$snackbar.global.showError('Something went wrong');
                        console.log(err);
                    });
            }
        },
        validateForm() {
            let formValid = true;
            formValid = this.checkEmpty('name') && formValid;
            formValid = this.checkEmpty('description') && formValid;
            formValid = this.checkEmpty('icon') && formValid;
            formValid = this.selectedSupport.length && formValid;
            if (!this.allCompanies) {
                formValid = this.selectedSupport.length && formValid;
            }
            // if(this.tags.length){

            // }
            return formValid;
        },
        checkEmpty(key) {
            const emptyErorrs = {
                name: 'Name is required',
                description: 'Description is required',
                icon: 'Icon is required'
            };
            if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            }
            return true;
        },
        getFormData() {
            let obj = {
                constants: this.$refs['constants'].getJSON(),
                validators: {
                    company: {
                        browserScript: '',
                        jsonSchema: this.$refs['companyForm'].getJSON()
                    },
                    store: {
                        browserScript: '',
                        jsonSchema: this.$refs['storeForm'].getJSON()
                    }
                },
                meta: this.tags,
                name: this.name.value,
                description: this.description.value,
                descriptionHTML: '',
                icon: this.icon.value,
                companies: this.selectedCompany,
                support: this.selectedSupport
            };
            if (this.selectedSupport.includes('inventory')) {
                obj.validators.inventory = {
                    browserScript: '',
                    jsonSchema: this.$refs['inventoryForm'].getJSON()
                };
            }
            if (this.selectedSupport.includes('order')) {
                obj.validators.order = {
                    browserScript: '',
                    jsonSchema: this.$refs['orderForm'].getJSON()
                };
            }
            obj = Object.assign(this.integrationData, obj);
            return obj;
        },
        getInitialValue(value = '') {
            return { showerror: false, value, errortext: '' };
        },
        addTags() {
            this.tags.push({
                name: '',
                value: '',
                isPublic: false
            });
        },
        removeTag(index) {
            this.tags.splice(index, 1);
        },
        getCompanyList() {
            return CompanyService.fetchCompanyList()
                .then(({ data }) => {
                    data.company_info.map((ele) => {
                        ele.text = ele.name;
                        ele.value = ele.company_id.toString();
                        this.setCompanyList();
                    });
                    this.companyList = data.company_info;
                    this.filteredCompanyList = this.companyList;
                })
                .catch((err) => {})
                .finally(() => {});
        },
        companySearch(e) {
            this.filteredCompanyList = [];
            this.companyList.forEach((ele) => {
                if (e && e.text) {
                    if (ele.name.toLowerCase().includes(e.text.toLowerCase())) {
                        this.filteredCompanyList.push(ele);
                    }
                } else {
                    this.filteredCompanyList = this.companyList;
                }
            });
        },
        setCompanyList() {
            let chipsCompanies = this.companyChips.map((it) => it.value);
            let newCompanies = this.selectedCompany.filter(
                (val) => !chipsCompanies.includes(val)
            );
            let removedCompanies = chipsCompanies.filter(
                (val) => !this.selectedCompany.includes(val)
            );

            this.companyChips.push(
                ...this.companyList.filter((ele) =>
                    newCompanies.includes(ele.value)
                )
            );

            for (let companyId of removedCompanies) {
                let rmIndex = this.companyChips.findIndex(
                    (item) => item.value === companyId
                );
                this.companyChips.splice(rmIndex, 1);
            }
        },
        removeFromChips(index, item) {
            const comIndex = this.selectedCompany.findIndex((ele) => {
                return ele == item.value;
            });
            this.selectedCompany.splice(comIndex, 1);
            this.companyChips.splice(index, 1);
        },
        // changeSelection(e) {
        //     if (!this.allCompanies && !this.companyList.length) {
        //         this.getCompanyList();
        //     }
        // },
        preview(ref) {
            this.activeData = {};
            this.activeSchema = this.$refs[ref].getJSON();
            this.$refs['previewSchema'].open({
                width: '600px',
                showCloseButton: true,
                dismissible: true
            });
        },
        getIntegration() {
            return IntegrationService.getIntegrationById(this.integrationId)
                .then(({ data }) => {
                    this.integrationData = data;
                    this.name.value = this.integrationData.name;
                    this.description.value = this.integrationData.description;
                    this.icon.value = this.integrationData.icon;
                    this.tags = this.integrationData.meta;
                    this.token = this.integrationData.token;
                    this.selectedCompany = this.integrationData.companies || [];
                    if (this.selectedCompany.length) {
                        this.allCompanies = false;
                    }
                    this.selectedSupport = this.integrationData.support || [
                        'inventory',
                        'order'
                    ];
                    this.companyForm =
                        this.integrationData.validators.company.jsonSchema ||
                        {};
                    this.storeForm =
                        this.integrationData.validators.store.jsonSchema || {};
                    this.inventoryForm =
                        (this.integrationData.validators.inventory &&
                            this.integrationData.validators.inventory
                                .jsonSchema) ||
                        {};
                    this.orderForm =
                        (this.integrationData.validators.order &&
                            this.integrationData.validators.order.jsonSchema) ||
                        {};
                    setTimeout(() => {
                        this.$refs['companyForm'].populateData();
                        this.$refs['storeForm'].populateData();
                        if (Object.keys(this.inventoryForm).length) {
                            this.$refs['inventoryForm'].populateData();
                        }
                        if (Object.keys(this.orderForm).length) {
                            this.$refs['orderForm'].populateData();
                        }
                    }, 0);
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.log(err);
                });
        },
        copyToClipboard(data, event) {
            copyToClipboard(data);
            this.$snackbar.global.showInfo('Copied to clipboard');
            event.stopPropagation();
        }
    }
};
</script>
