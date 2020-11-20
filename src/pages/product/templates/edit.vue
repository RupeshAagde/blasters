<template>
    <div class="panel">
        <div class="header-position">
            <page-header :title="pageTitle" @backClick="redirectToListing">
                <div class="button-box">
                    <div
                        class="pointer cl-RoyalBlue bold-xxxs"
                        :class="{ 'cl-DustyGray2': !template.is_active }"
                        @click="template.is_active = !template.is_active"
                    >
                        {{ template.is_active ? 'Enabled' : 'Disabled' }}
                    </div>
                    <nitrozen-toggle-btn
                        class="mr-sm"
                        v-model="template.is_active"
                    ></nitrozen-toggle-btn>
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
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
                        v-model="template.name"
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
                        v-model="template.slug"
                        @input="updateSlug($event), checkRequired('slug')"
                        @blur="checkRequired('slug')"
                    ></nitrozen-input>
                    <nitrozen-error v-if="errors.slug">
                        {{ errors.slug }}
                    </nitrozen-error>
                </div> -->
                <!-- Description -->
                <div class="mt-sm">
                    <nitrozen-input
                        label="Description"
                        type="textarea"
                        placeholder="For eg. material-type"
                        v-model="template.description"
                    ></nitrozen-input>
                </div>

                <!-- Logo -->
                <form-input
                    class="mt-sm"
                    label="Logo"
                    :required="true"
                    :custom="true"
                >
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
                        v-model="template.logo"
                        @delete="template.logo = ''"
                        @save="template.logo = $event"
                        @input="checkRequired('logo')"
                        :fileName="template.name"
                        namespace="products-template-logo"
                    ></image-uploader-tile>
                </form-input>
                <nitrozen-error v-if="errors.logo">
                    {{ errors.logo }}
                </nitrozen-error>

                <!-- Physical -->
                <div class="mt-md inline apart">
                    <div class="inline">
                        <div class="cl-Mako dark-xxxs mr-xxxs">Physical</div>
                        <nitrozen-tooltip
                            tooltipText="Enable it for physical products or disable it for non-physical/digital products."
                        ></nitrozen-tooltip>
                    </div>

                    <nitrozen-toggle-btn
                        title="Physical"
                        v-model="template.is_physical"
                        :class="{
                            'disable-btn': editMode
                        }"
                    ></nitrozen-toggle-btn>
                </div>

                <loader v-if="inProgress" class="loading"></loader>
            </div>
            <!-- ############################################# -->
            <!-- Settings -->
            <div class="settings-container">
                <div class="cl-Mako bold-md">Attributes Selection</div>
                <!-- Department -->
                <div class="mt-md">
                    <nitrozen-dropdown
                        class="input w-l"
                        label="Departments"
                        :items="departmentsList"
                        v-model="template.departments"
                        :required="true"
                        :multiple="true"
                        :searchable="true"
                        @change="
                            fetchCategories(),
                                fetchAttributes(),
                                checkRequired('departments')
                        "
                        @blur="checkRequired('departments')"
                        @searchInputChange="setDepartmentsList"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="errors.departments">{{
                        errors.departments
                    }}</nitrozen-error>
                    <div class="chip-wrapper inline">
                        <div
                            v-for="(department, index) of template.departments"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ getDepartmentName(department) }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="
                                        template.departments.splice(index, 1)
                                    "
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>
                <!-- Categories -->
                <div class="mt-md">
                    <nitrozen-dropdown
                        class="input w-l"
                        label="Categories"
                        :items="categoriesList"
                        v-model="template.categories"
                        :required="true"
                        :multiple="true"
                        :searchable="true"
                        @change="checkRequired('categories')"
                        @blur="checkRequired('categories')"
                        @searchInputChange="setCategoriesList"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="errors.categories">{{
                        errors.categories
                    }}</nitrozen-error>
                    <div class="chip-wrapper inline">
                        <div
                            v-for="(category, index) of template.categories"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ getCategoryName(category) }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="
                                        template.categories.splice(index, 1)
                                    "
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                </div>

                <!-- Attributes -->
                <div class="mt-md inline v-center">
                    <nitrozen-dropdown
                        class="input w-l mr-md"
                        label="Attributes"
                        :items="attributesList"
                        v-model="template.attributes"
                        :required="true"
                        :multiple="true"
                        :searchable="true"
                        @change="checkRequired('attributes')"
                        @blur="checkRequired('attributes')"
                        @searchInputChange="setAttributesList"
                    ></nitrozen-dropdown>
                    <a
                        class="txt-btn mt-md"
                        href="/administrator/product/attributes/create"
                        target="_blank"
                        title="Go to 'Create Attribute' page"
                        >Create Attribute</a
                    >
                </div>
                <nitrozen-error v-if="errors.categories">{{
                    errors.categories
                }}</nitrozen-error>

                <!-- Attribute ordering list -->
                <div class="attribute-container">
                    <div class="input w-xl cl-DustyGray2 regular-xxxs mt-sm">
                        <span class="cl-Mako dark-xxxs clh-desc">Note:</span>
                        Sequencing of attributes below comes in effect only on
                        Product create/edit page. It does not affect the
                        sequencing of attributes on Product details page. To
                        Sequence for Product details page, visit
                        <a
                            class="cl-RoyalBlue dark-xxxs"
                            href="/administrator/product/attributes/group/detail"
                            target="_blank"
                            >Group & Sequence</a
                        >
                    </div>
                    <draggable
                        class="list"
                        v-model="template.attributes"
                        handle=".reorder"
                        @start="drag = true"
                        @end="drag = false"
                    >
                        <div
                            class="item space-between"
                            v-for="(attr, index) of attrSelectedList"
                            :key="index"
                        >
                            <div class="inline v-center">
                                <inline-svg
                                    class="reorder mr-md"
                                    src="reorder"
                                ></inline-svg>
                                {{ index + 1 }}. &nbsp;
                                {{ attr.name }}
                            </div>
                            <div class="inline v-center">
                                <nitrozen-badge
                                    class="mr-sm"
                                    v-if="attr.invalid"
                                    state="warn"
                                    title="This attribute is not available for this department. Remove or create it to make it visible on Product detail pages."
                                    >INVALID</nitrozen-badge
                                >
                                <nitrozen-badge
                                    class="mr-sm"
                                    v-if="attr.schema.mandatory"
                                    state="error"
                                    >REQUIRED</nitrozen-badge
                                >
                                <inline-svg
                                    title="Remove Attribute"
                                    class="cross-icon pointer"
                                    src="plus-black"
                                    @click.stop.native="
                                        template.attributes.splice(index, 1)
                                    "
                                ></inline-svg>
                            </div>
                        </div>
                    </draggable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.clh-desc {
    line-height: 20px;
}
.header-position {
    height: 58.5px;
}
.button-box {
    display: flex;
    align-items: center;
}
.page-container {
    flex-direction: row-reverse;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    .form-container {
        width: 320px;
        height: fit-content;
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
.attribute-container {
    .list {
        height: 500px;
        overflow-y: auto;
        margin-top: 24px;
        padding-right: 24px;
        .blaster-scrollbar;
        .item {
            max-width: 600px;
            border: 1px solid @Iron;
            border-radius: 4px;
            margin-bottom: 12px;
            height: 24px;
            display: flex;
            align-items: center;
            padding: 12px;
            color: @Mako;
            font-size: 14px;
            font-weight: 500;
        }
        .msg {
            font-size: 12px;
            font-weight: 400;
            color: @DustyGray2;
            text-align: center;
            line-height: 18px;
            padding: 24px 12px;
        }
        .invalid {
            color: @Required;
        }
    }
}

.pointer {
    cursor: pointer;
}
.cross-icon {
    ::v-deep svg {
        -ms-transform: rotate(20deg); /* IE 9 */
        transform: rotate(45deg);
        width: 28px;
        height: 28px;
    }
}
.reorder {
    cursor: -webkit-grab;
}

.space-between {
    display: flex;
    justify-content: space-between;
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
    &.w-xl {
        max-width: 600px;
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
    &.v-center {
        align-items: center;
    }

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

.txt-btn {
    color: @RoyalBlue;
    font-size: 12px;
    font-weight: 600;
    .pointer;
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

.disable-btn {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}
</style>

<script>
import TagsInput from '@/components/common/tags-input.vue';
import PageHeader from '@/components/common/layout/page-header.vue';
import { compactDeepObject } from '../../../helper/utils';
import ImageUploader from '@/components/common/image-uploader/index';
import { ImageUploaderTile } from '@/components/common/';
import CompanyService from '@/services/company-admin.service';
import Loader from '@/components/common/loader.vue';
import FormInput from '@/components/common/form-input';
import InlineSvg from '@/components/common/ukt-inline-svg';
import Draggable from 'vuedraggable';
import slugify from 'slugify';
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

export default {
    name: 'TemplateUpdate',
    components: {
        PageHeader,
        TagsInput,
        FormInput,
        ImageUploaderTile,
        ImageUploader,
        Loader,
        InlineSvg,
        Draggable,

        NitrozenInput,
        NitrozenError,
        NitrozenInline,
        NitrozenChips,
        NitrozenButton,
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
            slug: this.$route.params.slug || '',
            editMode: !!this.$route.params.slug,

            pageLoading: false,
            pageError: false,
            inProgress: false,
            formSaved: false,

            attrType: 'str',
            template: {
                active: false,
                departments: [],
                categories: [],
                attributes: [],
                is_physical: true
            },
            attributes: [],
            departments: [],
            categories: [],
            units: [],
            errors: {},
            unselectedSearchTxt: '',

            departmentsList: [],
            categoriesList: [],
            attributesList: [],
            unitsList: []
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        pageTitle() {
            if (!this.editMode) {
                return 'Add Template';
            }
            if (_.isEmpty(this.template)) {
                return 'Edit Template';
            }
            return `Edit ${this.template.name}`;
        },
        attrSelectedList() {
            const list = [];
            this.template.attributes.forEach((attr) => {
                const a = this.attributes.find((a) => a.slug === attr);
                if (a) {
                    list.push(a);
                } else {
                    // no attribute found with that slug for the selected departments
                    list.push({
                        name: attr,
                        slug: attr,
                        invalid: true,
                        schema: {}
                    });
                }
            });
            return list;
        },
        selectedDeptIds() {
            if (_.isEmpty(this.departments)) return [];
            const uids = [];
            this.departments.forEach((dept) => {
                if (this.template.departments.includes(dept.slug)) {
                    uids.push(dept.uid);
                }
            });
            return uids;
        }
    },
    methods: {
        isEmpty: _.isEmpty,
        init() {
            this.pageLoading = true;
            Promise.all([this.fetchProductTemplate(), this.fetchDepartments()])
                .then(() => {
                    return Promise.all([
                        this.fetchAttributes(),
                        this.fetchCategories()
                    ]);
                })
                .then(() => {
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchProductTemplate() {
            if (!this.editMode) {
                return;
            }
            return new Promise((resolve, reject) => {
                CompanyService.fetchProductTemplate(this.slug)
                    .then(({ data }) => {
                        this.template = _.first(data.data);

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
                        this.departments = data.data;
                        this.setDepartmentsList();
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchCategories() {
            if (!this.selectedDeptIds.length) return;

            const params = {
                page_size: 999999,
                page_no: 1,
                dept_id: this.selectedDeptIds
            };
            return new Promise((resolve, reject) => {
                CompanyService.fetchCategories(params)
                    .then(({ data }) => {
                        this.categories = data.data;
                        this.setCategoriesList();
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchAttributes() {
            if (_.isEmpty(this.template.departments)) {
                this.attributes = [];
                return;
            }
            const params = {
                limit: 999999,
                department: this.template.departments
            };
            return CompanyService.fetchAttributes(params)
                .then(({ data }) => {
                    this.attributes = data.data;
                    this.setAttributesList();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        setDepartmentsList(e = {}) {
            this.departmentsList = [];
            this.departments.forEach((d) => {
                if (
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
        setCategoriesList(e = {}) {
            this.categoriesList = [];
            this.categories.forEach((c) => {
                if (
                    !e.text ||
                    c.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.categoriesList.push({
                        text: c.name,
                        value: c.slug_key
                    });
                }
            });
        },
        setAttributesList(e = {}) {
            this.attributesList = [];
            this.attributes.forEach((a) => {
                if (
                    !e.text ||
                    a.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.attributesList.push({
                        text: a.name,
                        value: a.slug
                    });
                }
            });
        },
        getDepartmentName(slug) {
            const department = this.departments.find((d) => d.slug === slug);
            if (department) return department.name;
            return slug;
        },
        getCategoryName(slug) {
            const category = this.categories.find((c) => c.slug_key === slug);
            if (category) return category.name;
            return slug;
        },
        updateSlug(str) {
            if (this.editMode) return;
            this.$set(
                this.template,
                'slug',
                slugify(str, {
                    lower: true,
                    strict: true
                })
            );
        },
        getFormData() {
            try {
                return this.template;
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

                let upsertFunc = CompanyService.updateProductTemplate;
                if (!this.editMode) {
                    upsertFunc = CompanyService.createProductTemplate;
                }

                this.inProgress = true;
                upsertFunc(this.slug, formData)
                    .then((res) => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            'Template saved successfully'
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
        checkRequired(prop) {
            let isValid = true;
            this.$set(this.errors, prop, '');

            if (!this.template[prop] || _.isEmpty(this.template[prop])) {
                isValid = false;
                this.errors[prop] = 'field is required';
            }

            return isValid;
        },
        validateForm() {
            let formValid = true;

            formValid = this.checkRequired('name') && formValid;
            formValid = this.checkRequired('slug') && formValid;
            formValid = this.checkRequired('logo') && formValid;
            // formValid = this.checkRequired('banner') && formValid;
            formValid = this.checkRequired('departments') && formValid;
            formValid = this.checkRequired('categories') && formValid;
            formValid = this.checkRequired('attributes') && formValid;

            return formValid;
        },
        redirectToListing() {
            this.$goBack('/administrator/product/templates');
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
