<template>
    <div class="integration">
        <div class="page-header-position">
            <page-header
                :title="`${isEditOnly ? 'Edit' : 'Create'} Integration`"
                @backClick="onCancel"
            >
                <div class="button-box">
                    <div 
                        class="toggle-text"
                        :class="{ disabled: !visible }"
                    >
                        {{visible ? "Visible": "Hidden"}}
                    </div>
                    <nitrozen-toggle-btn
                        v-if="isEditOnly"
                        id="visibility"
                        v-model="visible"
                    ></nitrozen-toggle-btn>
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
                            :customJson="companyForm.value"
                        ></meta-box>
                        <nitrozen-error v-if="companyForm.showerror">
                            {{ companyForm.errortext }}
                        </nitrozen-error>
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
                            :customJson="storeForm.value"
                        ></meta-box>
                        <nitrozen-error v-if="storeForm.showerror">
                            {{ storeForm.errortext }}
                        </nitrozen-error>
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
                            :customJson="inventoryForm.value"
                        ></meta-box>
                        <nitrozen-error v-if="inventoryForm.showerror">
                            {{ inventoryForm.errortext }}
                        </nitrozen-error>
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
                            :customJson="orderForm.value"
                        ></meta-box>
                        <nitrozen-error v-if="orderForm.showerror">
                            {{ orderForm.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
            </div>
            <div class="right-container">
                <div class="page-container basic-deatils mb-24">
                    <label class="bold-xs cl-Mako">Basic Details</label>
                    <div class="form-body">
                        <nitrozen-input
                            v-model="name.value"
                            @input="convertToSlug()"
                            label="Name *"
                            placeholder="Name"
                        ></nitrozen-input>
                        <nitrozen-error v-if="name.showerror && !name.value">
                            {{ name.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-body slug" v-if="!isEditOnly">
                        <nitrozen-input
                            v-model="slug.value"
                            label="Slug *"
                            :disabled="true"
                            placeholder="Slug"
                        ></nitrozen-input>
                        <nitrozen-error v-if="slug.showerror && !slug.value">
                            {{ slug.errortext }}
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
                                :items="companyList"
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
                            <nitrozen-check-box v-model="item.public"
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
        <loader v-if="inProgress" class="loading"></loader>
        <nitrozen-dialog
            ref="previewSchema"
            title="Preview"
            class="preview-schema"
        >
            <template slot="body">
                <div
                    v-if="
                        Array.isArray(activeSchema)
                            ? activeSchema.length
                            : Object.keys(activeSchema).length
                    "
                >
                    <nitrozen-custom-form
                        ref="schema-form"
                        :inputs="activeSchema || []"
                        v-model="activeData"
                        :disabled="true"
                    />
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
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
    NitrozenCustomForm,
    flatBtn,
    strokeBtn,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import {
    Loader,
    PageHeader,
    ImageUploaderTile,
    InlineSvg,
    MetaBox
} from '@/components/common/';
import { copyToClipboard } from '@/helper/utils.js';
import CompanyService from '@/services/company-admin.service';
import IntegrationService from '@/services/integration.service';
import { validateNitrozenCustomFormInputs } from '@/helper/utils';
import { debounce, convertToSlug } from '@/helper/utils';

const PAGINATION = {
    limit: 500,
    total: 0,
    current: 1
};
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
        NitrozenDialog,
        NitrozenCustomForm,
        'nitrozen-toggle-btn': NitrozenToggleBtn
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
            inProgress: false,
            icon: this.getInitialValue(''),
            description: this.getInitialValue(''),
            name: this.getInitialValue(''),
            slug: this.getInitialValue(''),
            tags: [],
            companyForm: this.getInitialValue([]),
            storeForm: this.getInitialValue([]),
            inventoryForm: this.getInitialValue([]),
            orderForm: this.getInitialValue([]),
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
            integrationId: this.$route.params.integrationId,
            pagination: { ...PAGINATION },
            searchText: '',
            visible: true
        };
    },
    mounted() {
        this.pageLoading = true;
        let pArr = [this.getCompanyList()];
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
            if (!this.validateForm()) {
                this.$snackbar.global.showError("Something isn't right");
                return;
            }
            const obj = this.getFormData();
            obj.hidden = !this.visible;
            this.inProgress = true;
            if (this.integrationId) {
                return IntegrationService.saveIntegration(
                    this.integrationId,
                    obj
                )
                    .then(({ data }) => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            `Successfully Updated`,
                            {
                                duration: 2000
                            }
                        );
                        setTimeout(() => {
                            this.$router.push({
                                path: `/administrator/integrations/list`
                            });
                        }, 200);
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
                        setTimeout(() => {
                            this.$router.push({
                                path: `/administrator/integrations/list`
                            });
                        }, 200);
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

            this.companyForm.value = this.$refs['companyForm'].getJSON();

            if (
                !(
                    this.companyForm.value &&
                    Array.isArray(this.companyForm.value)
                ) ||
                !validateNitrozenCustomFormInputs(this.companyForm.value)
            ) {
                formValid = false;
                this.companyForm.showerror = true;
                this.companyForm.errortext =
                    'Company Form Schema format is invalid';
            }

            this.storeForm.value = this.$refs['storeForm'].getJSON();

            if (
                !(
                    this.storeForm.value && Array.isArray(this.storeForm.value)
                ) ||
                !validateNitrozenCustomFormInputs(this.storeForm.value)
            ) {
                formValid = false;
                this.storeForm.showerror = true;
                this.storeForm.errortext =
                    'Store Form Schema format is invalid';
            }

            if (this.selectedSupport.includes('inventory')) {
                this.inventoryForm.value = this.$refs[
                    'inventoryForm'
                ].getJSON();

                if (
                    !(
                        this.inventoryForm.value &&
                        Array.isArray(this.inventoryForm.value)
                    ) ||
                    !validateNitrozenCustomFormInputs(this.inventoryForm.value)
                ) {
                    formValid = false;
                    this.inventoryForm.showerror = true;
                    this.inventoryForm.errortext =
                        'Inventory Form Schema format is invalid';
                }
            }

            if (this.selectedSupport.includes('order')) {
                this.orderForm.value = this.$refs['orderForm'].getJSON();

                if (
                    !(
                        this.orderForm.value &&
                        Array.isArray(this.orderForm.value)
                    ) ||
                    !validateNitrozenCustomFormInputs(this.orderForm.value)
                ) {
                    formValid = false;
                    this.orderForm.showerror = true;
                    this.orderForm.errortext =
                        'Order Form Schema format is invalid';
                }
            }

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
                        browser_script: '',
                        json_schema: this.$refs['companyForm'].getJSON()
                    },
                    store: {
                        browser_script: '',
                        json_schema: this.$refs['storeForm'].getJSON()
                    }
                },
                meta: this.tags,
                name: this.name.value,
                slug: this.slug.value || convertToSlug(this.name.value),
                description: this.description.value,
                description_html: '',
                icon: this.icon.value,
                companies: this.selectedCompany,
                support: this.selectedSupport
            };
            if (this.selectedSupport.includes('inventory')) {
                obj.validators.inventory = {
                    browser_script: '',
                    json_schema: this.$refs['inventoryForm'].getJSON()
                };
            }
            if (this.selectedSupport.includes('order')) {
                obj.validators.order = {
                    browser_script: '',
                    json_schema: this.$refs['orderForm'].getJSON()
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
                public: false
            });
        },
        removeTag(index) {
            this.tags.splice(index, 1);
        },
        requestQuery() {
            const query = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };

            if (this.searchText) {
                query.name = this.searchText;
            }
            return query;
        },

        getCompanyList() {
            return CompanyService.getCompanyList(this.requestQuery())
                .then(({ data }) => {
                    data.data.map((ele) => {
                        ele.text = ele.name;
                        ele.value = ele.uid.toString();
                    });
                    this.companyList = data.data;
                    this.setCompanyList();
                })
                .catch((err) => {})
                .finally(() => {});
        },
        companySearch: debounce(function(e) {
            if (e.length === 0) {
                this.setRouteQuery({ search: undefined });
            }
            if (e && e.text) {
                this.searchText = e.text;
            } else {
                this.searchText = '';
            }
            
            this.getCompanyList();
        }, 500),
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
                    this.icon.value = this.integrationData.icon || '';
                    this.tags = this.integrationData.meta || [];
                    this.token = this.integrationData.token;
                    this.selectedCompany = this.integrationData.companies || [];
                    this.constants = this.integrationData.constants || {};
                    if (this.selectedCompany.length) {
                        this.allCompanies = false;
                    }
                    this.selectedSupport = this.integrationData.support || [
                        'inventory',
                        'order'
                    ];
                    this.companyForm.value = this.integrationData.validators.company.json_schema ||
                        [];
                    this.storeForm.value = this.integrationData.validators.store.json_schema || [];
                    this.inventoryForm.value =
                        (this.integrationData.validators.inventory &&
                            this.integrationData.validators.inventory
                                .json_schema) ||
                        [];
                    this.orderForm.value =
                        (this.integrationData.validators.order &&
                            this.integrationData.validators.order.json_schema) ||
                        [];
                    if(this.integrationData.hidden) {
                        this.visible = !this.integrationData.hidden; 
                    }
                    setTimeout(() => {
                        this.$refs['companyForm'].populateData();
                        this.$refs['storeForm'].populateData();
                        this.$refs['constants'].populateData();
                        if (this.selectedSupport.includes('inventory')) {
                            this.$refs['inventoryForm'].populateData();
                        }
                        if (this.selectedSupport.includes('order')) {
                            this.$refs['orderForm'].populateData();
                        }
                    }, 0);
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    // console.log(err);
                });
        },
        copyToClipboard(data, event) {
            copyToClipboard(data);
            this.$snackbar.global.showInfo('Copied to clipboard');
            event.stopPropagation();
        },
        convertToSlug() {
            if (this.isEditOnly) return;
            this.slug.value = convertToSlug(this.name.value);
        },
    }
};
</script>

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
.preview-schema {
    ::v-deep .nitrozen-dialog-body {
        max-height: calc(100vh - 350px);
    }
    
    .nitrozen-custom-form{
        pointer-events: none;
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
            .token-input {
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
.toggle-text {
    font-size: 12px;
    font-weight: 700;
    color: @RoyalBlue;
    &.disabled {
        color: @DustyGray2;
    }
}
</style>
