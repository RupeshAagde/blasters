<template>
    <div class="panel">
        <div class="header-position">
            <page-header :title="pageTitle" @backClick="redirectToListing">
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
                        ref='save-button'
                        @click="saveForm"
                        >Save</nitrozen-button
                    >
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading"></loader>
        <div class="page-container" v-if="!pageLoading">
            <!-- Details -->
            <div class="form-container">
                <div class="cl-Mako bold-md">Details</div>
                <!-- Name -->
                <div class="mt-sm">
                    <nitrozen-input
                        label="Name"
                        :required="true"
                        placeholder="For eg. Material Type, Color, etc"
                        v-model="attribute.name"
                        @input="updateSlug($event), checkRequired('name')"
                        @blur="checkRequired('name')"
                    ></nitrozen-input>
                    <nitrozen-error v-if="errors.name">
                        {{ errors.name }}
                    </nitrozen-error>
                </div>
                <!-- Slug -->
                <!-- <div class="mt-sm">
                    <nitrozen-input
                        label="Slug"
                        :disabled="editMode"
                        :required="true"
                        placeholder="For eg. material-type"
                        v-model="attribute.slug"
                        @input="updateSlug($event), checkRequired('slug')"
                        @blur="checkRequired('slug')"
                    ></nitrozen-input>
                    <nitrozen-error v-if="errors.slug">{{
                        errors.slug
                    }}</nitrozen-error>
                </div>-->
                <!-- Description -->
                <div class="mt-sm">
                    <nitrozen-input
                        label="Description"
                        type="textarea"
                        placeholder="For eg. material-type"
                        v-model="attribute.description"
                    ></nitrozen-input>
                </div>
                <!-- logo Image -->
                <form-input class="mt-sm" label="Logo" :custom="true">
                    <image-uploader-tile
                        label="Logo"
                        aspectRatio="1:1"
                        :minimumResolution="{
                            width: 80,
                            height: 80
                        }"
                        :maximumResolution="{
                            width: 2000,
                            height: 2000
                        }"
                        :recommendedResolution="{
                            width: 196,
                            height: 196
                        }"
                        v-model="logo"
                        @delete="logo = ''"
                        @save="logo = $event"
                        :fileName="attribute.name"
                        namespace="products-attribute-logo"
                    ></image-uploader-tile>
                </form-input>
                <nitrozen-error v-if="errors.logo">
                    {{ errors.logo }}
                </nitrozen-error>
                <!-- Required -->
                <div class="mt-md inline apart">
                    <div class="inline">
                        <div class="cl-Mako dark-xxxs mr-xxxs">Required</div>
                        <nitrozen-tooltip
                            tooltipText="Make this attribute a mandatory property of Product. Empty value will not be allowed for this attribute."
                        ></nitrozen-tooltip>
                    </div>
                    <nitrozen-toggle-btn
                        v-model="attribute.schema.mandatory"
                    ></nitrozen-toggle-btn>
                </div>
                <!-- Show to user -->
                <div class="mt-md inline apart">
                    <div class="inline">
                        <div class="cl-Mako dark-xxxs mr-xxxs">Public</div>
                        <nitrozen-tooltip
                            tooltipText="Display this attribute on Product details page"
                        ></nitrozen-tooltip>
                    </div>
                    <nitrozen-toggle-btn
                        v-model="attribute.enabled_for_end_consumer"
                    ></nitrozen-toggle-btn>
                </div>
                <!-- filter toggle -->
                <div class="mt-md inline apart">
                    <div class="inline">
                        <div class="cl-Mako dark-xxxs mr-xxxs">Filter</div>
                        <nitrozen-tooltip
                            tooltipText="Allow this attribute to be used as a filter property for Product filtering"
                        ></nitrozen-tooltip>
                    </div>
                    <nitrozen-toggle-btn
                        v-model="attribute.filters.indexing"
                    ></nitrozen-toggle-btn>
                </div>
                <!-- Variant toggle -->
                <div class="mt-md inline apart">
                    <div class="inline">
                        <div class="cl-Mako dark-xxxs mr-xxxs">
                            Variant Permissable
                        </div>
                        <nitrozen-tooltip
                            tooltipText="Allow this attribute to be used as a product variants grouping property"
                        ></nitrozen-tooltip>
                    </div>
                    <nitrozen-toggle-btn
                        v-model="attribute.variant"
                    ></nitrozen-toggle-btn>
                </div>
                <loader v-if="inProgress" class="loading"></loader>
            </div>
            <!-- ############################################# -->
            <!-- Value Settings -->
            <div class="settings-container">
                <div class="cl-Mako bold-md">Value Settings</div>
                <!-- Department -->
                <div class="mt-md">
                    <nitrozen-dropdown
                        class="input w-l"
                        label="Departments"
                        :items="departmentsList"
                        v-model="attribute.departments"
                        :required="true"
                        :multiple="true"
                        :searchable="true"
                        @change="checkRequired('departments')"
                        @blur="checkRequired('departments')"
                        @searchInputChange="setDepartmentsList"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="errors.departments">{{
                        errors.departments
                    }}</nitrozen-error>
                    <div class="chip-wrapper inline">
                        <div
                            v-for="(department, index) of attribute.departments"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ getDepartmentName(department) }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="
                                        attribute.departments.splice(index, 1)
                                    "
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>
                <div class="inline">
                    <!-- type -->
                    <div class="input w-md mt-sm mr-md">
                        {{attrType}}
                        <nitrozen-dropdown
                            label="Type"
                            :items="propertyTypes"
                            v-model="attrType"
                            :disabled="editMode"
                            :required="true"
                            :multi="true"
                            @change="() => {}"
                        ></nitrozen-dropdown>
                    </div>
                    <!-- Multiple values toggle -->
                    <div
                        class="mt-sm"
                        v-if="multiAllowedList.includes(attrType)"
                    >
                        <nitrozen-badge
                            class="mt-md"
                            v-if="editMode"
                            state="info"
                        >
                            {{
                                attribute.schema.multi
                                    ? 'MULTIPLE VALUE'
                                    : 'SINGLE VALUE'
                            }}
                        </nitrozen-badge>
                        <div v-else>
                            <div class="inline lh-md">
                                <div class="cl-DustyGray2 dark-xxxs mr-xxxs">
                                    Allow multiple values
                                </div>
                                <nitrozen-tooltip
                                    tooltipText="Allow this attribute to have multiple values. For eg. Attribute 'Color' can have multiple values"
                                ></nitrozen-tooltip>
                            </div>
                            <nitrozen-toggle-btn
                                class="mt-sm"
                                v-model="attribute.schema.multi"
                                @change="() => {}"
                            ></nitrozen-toggle-btn>
                        </div>
                    </div>
                </div>
                <tags-input
                    class="input w-xxl mt-sm"
                    label="Allowed Values"
                    v-if="attrType === 'str'"
                    placeholder="For eg. Red, Blue, etc"
                    v-model="attribute.schema.allowed_values"
                    :max-tags="200"
                ></tags-input>
                <!-- Range Min Max -->
                <div
                    class="inline mt-sm"
                    v-if="numberTypesList.includes(attrType)"
                >
                    <!-- Min -->
                    <div class="input w-sm mr-sm">
                        <nitrozen-input
                            label="Minimum"
                            type="number"
                            placeholder="For eg. 2"
                            :showTooltip="true"
                            tooltipText="Minimum acceptable value of attribute"
                            v-model="attribute.schema.range.min"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.rangeMin">
                            {{ errors.rangeMin }}
                        </nitrozen-error>
                    </div>
                    <!-- Max -->
                    <div class="input w-sm">
                        <nitrozen-input
                            label="Maximum"
                            type="number"
                            placeholder="For eg. 20"
                            :showTooltip="true"
                            tooltipText="Maximum acceptable value of attribute"
                            v-model="attribute.schema.range.max"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.rangeMax">
                            {{ errors.rangeMax }}
                        </nitrozen-error>
                    </div>
                </div>
                <!-- Formatting -->
                <div class="mt-sm" v-if="attrType === 'str'">
                    <nitrozen-dropdown
                        class="input w-md"
                        label="Formatting"
                        :items="formattingList"
                        tooltip="Attribute's value will be formatted as per this on Product detail pages"
                        v-model="attribute.schema.format"
                    ></nitrozen-dropdown>
                </div>
                <!-- Unit -->
                <div class="mt-sm" v-if="numberTypesList.includes(attrType)">
                    <nitrozen-dropdown
                        class="input w-md"
                        label="Unit"
                        :items="unitsList"
                        v-model="attribute.unit"
                        :searchable="true"
                        @searchInputChange="setUnitsList"
                    ></nitrozen-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}
.cursor-pointer {
    cursor: pointer;
}
.page-container {
    flex-direction: row-reverse;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    .form-container {
        width: 320px;
        margin-left: 24px;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        background-color: @White;
    }
    .settings-container {
        display: block;
        flex: 1;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        background-color: @White;
    }
}

.chip-wrapper {
    flex-wrap: wrap;
    height: fit-content;
    max-height: 200px;
    overflow-y: auto;
    .blaster-scrollbar;
    .chip {
        margin: 8px 8px 0 0;
    }
}

.input {
    &.w-sm {
        width: 200px;
    }
    &.w-md {
        width: 300px;
    }
    &.w-l {
        width: 400px;
    }
    &.w-xxl {
        max-width: 800px;
    }
}

.mt-sm {
    margin-top: 12px;
}
.mt-md {
    margin-top: 24px;
}

.mr-xxxs {
    margin-right: 4px;
}
.mr-sm {
    margin-right: 12px;
}
.mr-md {
    margin-right: 24px;
}

.lh-md {
    line-height: 22px;
}

.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    .inline-left {
        width: 50%;
    }
    .inline-right {
        flex: 1;
        margin-left: 24px;
    }
}

.toggle {
    display: flex;
    align-items: center;
    .text {
        font-size: 12px;
        font-weight: 700;
        color: @RoyalBlue;
        cursor: pointer;
        &.disabled {
            color: @DustyGray2;
        }
    }
}
</style>

<script>
import TagsInput from '@/components/common/tags-input';
import PageHeader from '@/components/common/layout/page-header';
import ImageUploader from '@/components/common/image-uploader/index';
import CompanyService from '@/services/company-admin.service';
import { ImageUploaderTile } from '@/components/common/';
import Loader from '@/components/common/loader';
import FormInput from '@/components/common/form-input';
import slugify from 'slugify';
import { compactDeepObject } from '@/helper/utils';
// import { dirtyCheckMixin } from '@/mixins/form.mixin';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenError,
    NitrozenChips,
    NitrozenInline,
    NitrozenToggleBtn,
    NitrozenDropdown,
    NitrozenTooltip,
    NitrozenBadge,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
import _ from 'lodash';
import path from 'path';

const PROPERTY_TYPES = [
    {
        text: 'Text',
        value: 'str'
    },
    {
        text: 'Number',
        value: 'int'
    },
    {
        text: 'Decimal Number',
        value: 'float'
    },
    {
        text: 'HTML',
        value: 'html'
    }
];

const FORMATTING_LIST = [
    {
        text: 'None',
        value: ''
    },
    {
        text: 'Title Case',
        value: 'title case'
    },
    {
        text: 'UPPER CASE',
        value: 'upper case'
    },
    {
        text: 'lower case',
        value: 'lower case'
    }
];

export default {
    name: 'AttributeEdit',
    components: {
        PageHeader,
        TagsInput,
        FormInput,
        ImageUploader,
        ImageUploaderTile,
        Loader,

        NitrozenInput,
        NitrozenError,
        NitrozenInline,
        NitrozenButton,
        NitrozenChips,
        NitrozenToggleBtn,
        NitrozenDropdown,
        NitrozenTooltip,
        NitrozenBadge
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    // mixins: [dirtyCheckMixin],
    data: function() {
        return {
            showModal: false,
            tags: [],
            status: false,
            slug: this.$route.params.slug || '',
            editMode: !!this.$route.params.slug,
            propertyTypes: [...PROPERTY_TYPES],
            formattingList: [...FORMATTING_LIST],
            logo: '',
            numberTypesList: ['int', 'float'],
            multiAllowedList: ['str', 'int', 'float', 'list'],

            pageLoading: false,
            pageError: false,
            inProgress: false,
            formSaved: false,

            attrType: 'str',
            attribute: {
                schema: { allowed_values: [], range: {}, format: '', multi: false },
                details: {},
                filters: { indexing: false },
                meta: { enriched: false, mandatory_details: { l3_keys: [] } }
            },
            departments: [],
            units: [],
            errors: {},

            departmentsList: [],
            unitsList: []
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        pageTitle() {
            if (!this.editMode) {
                return 'Create Atttribute';
            }
            if (_.isEmpty(this.attribute)) {
                return 'Edit Attribute';
            }
            return `Edit ${this.attribute.name}`;
        },
        isNumberType() {
            if (['int', 'float'].includes(this.attrType)) {
                return true;
            }
            return false;
        }
    },
    methods: {
        isEmpty: _.isEmpty,
        init() {
            const pArr = [this.fetchDepartments(), this.fetchUnits()];
            if (this.editMode) {
                pArr.push(this.fetchAttribute());
            }

            this.pageLoading = true;
            Promise.all(pArr)
                .then(() => {
                    this.pageLoading = false;
                    this.setDepartmentsList();
                    this.setUnitsList();
                })
                .catch((err) => {
                    console.log("error",err)
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchAttribute() {
            return new Promise((resolve, reject) => {
                CompanyService.fetchAttribute(this.slug)
                    .then(({ data }) => {
                        this.attribute = this.sanitizeAttribute(data.items);
                        this.logo = this.attribute.logo
                            ? this.attribute.logo
                            : '';

                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchDepartments() {
            return new Promise((resolve, reject) => {
                CompanyService.fetchDepartments()
                    .then(({ data }) => {
                        this.departments = data.items;
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchUnits() {
            return new Promise((resolve, reject) => {
                CompanyService.fetchUnits()
                    .then(({ data }) => {
                        this.units = data.data;
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        sanitizeAttribute(attributes = []) {
            const attribute = _.first(attributes);
            if (!attribute) return {};

            if (attribute.details.display_type === 'text') {
                this.attrType = attribute.schema.type;
            } else {
                this.attrType = attribute.details.display_type;
            }

            attribute.schema.allowed_values = attribute.schema.allowed_values || [];
            attribute.schema.range = attribute.schema.range || {};
            return attribute;
        },

        setDepartmentsList(e = {}) {
            this.departmentsList = [];
            this.departments.forEach((d) => {
                if (
                    !e ||
                    !e.text ||
                    d.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.departmentsList.push({
                        text: d.name,
                        value: d.slug
                    });
                }
            });
        },
        setUnitsList(e = {}) {
            this.unitsList = [];
            this.units.forEach((unit) => {
                let parentAdded = false;
                unit.units.forEach((u) => {
                    if (
                        !e ||
                        !e.text ||
                        u.display
                            .toLowerCase()
                            .includes(e.text.toLowerCase()) ||
                        u.key.toLowerCase().includes(e.text.toLowerCase())
                    ) {
                        if (!parentAdded) {
                            this.unitsList.push({
                                text: unit.family,
                                isGroupLabel: true
                            });
                            parentAdded = true;
                        }
                        this.unitsList.push({
                            text: u.display,
                            value: u.key
                        });
                    }
                });
            });
        },
        updateSlug(str) {
            if (this.editMode) return;
            this.$set(
                this.attribute,
                'slug',
                slugify(str, {
                    lower: true,
                    strict: true
                })
            );
        },
        getDepartmentName(slug) {
            const department = this.departments.find((d) => d.slug === slug);
            if (department) return department.name;
            return slug;
        },
        getFormData() {
            try {
                const attribute = {
                    ...this.attribute
                };
                if (this.attrType === 'str') {
                    attribute.details.display_type = 'text';
                    attribute.schema.type = 'str';
                } else if (this.attrType === 'html') {
                    attribute.details.display_type = this.attrType;
                    attribute.schema.type = 'str';
                } else {
                    attribute.details.display_type = 'text';
                    attribute.schema.type = this.attrType;
                }
                return attribute;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        saveForm() {
            try {
                if (!this.validateForm()) {
                    this.$snackbar.global.showError(
                        'Form validation failed. Please correct the form according to the error messages displayed in red'
                    );
                    return;
                }
                const formData = this.getFormData();
                if (this.logo != '') {
                    formData.logo = this.logo;
                } else {
                    delete formData.logo;
                }

                let upsertFunc = CompanyService.updateAttribute;
                if (!this.editMode) {
                    upsertFunc = CompanyService.createAttribute;
                }

                this.inProgress = true;
                upsertFunc(formData)
                    .then((res) => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            'Attribute saved successfully'
                        );
                        this.offer = res.data;
                        this.formSaved = true;
                        this.redirectToListing();
                    })
                    .catch((err) => {
                        this.inProgress = false;

                        if (err.response.data.errors) {
                            Object.values(err.response.data.errors).forEach(
                                (ele) => {
                                    this.$snackbar.global.showError(
                                        `Failed to save : ${ele}`
                                    );
                                }
                            );
                        } else {
                            this.$snackbar.global.showError(
                                `Failed to save${
                                    err && err.response.data.message
                                        ? ' : ' + err.response.data.message
                                        : err && err.message
                                        ? ' : ' + err.message
                                        : ''
                                }`
                            );
                        }
                    });
            } catch (err) {
                console.log(err);
            }
        },
        redirectToListing() {
            this.$goBack('/administrator/product/attributes');
        },
        checkRequired(prop) {
            let isValid = true;
            this.$set(this.errors, prop, '');

            if (!this.attribute[prop] || _.isEmpty(this.attribute[prop])) {
                isValid = false;
                this.errors[prop] = 'field is required';
            }

            return isValid;
        },
        validateForm() {
            let formValid = true;

            formValid = this.checkRequired('name') && formValid;
            formValid = this.checkRequired('slug') && formValid;
            // formValid = this.checkRequired('logo') && formValid;
            formValid = this.checkRequired('departments') && formValid;

            return formValid;
        },
        copyTextToClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard');
        },
        isFormDirty() {
            if (this.formSaved) {
                return false;
            }

            let dirtyForm = { ...this.offer, ...this.getFormData() };
            if (dirtyForm.banner_image.secure_url === '') {
                delete dirtyForm.banner_image.secure_url;
            }

            return !_.isEqual(this.offer, dirtyForm);
        }
    }
};
</script>
