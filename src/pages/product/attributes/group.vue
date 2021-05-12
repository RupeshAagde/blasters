<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="title"
                @backClick="redirectToListing"
            ></page-header>
        </div>
        <loader v-if="inProgress" class="loading"></loader>
        <loader v-if="pageLoading" class="loading"></loader>
        <div class="page-container" v-if="!pageLoading">
            <!-- Groups -->
            <div class="section left">
                <div class="pane">
                    <div class="inline apart">
                        <div class="cl-Mako bold-md">Groups</div>
                        <div>
                            <nitrozen-button
                                class="mr-sm"
                                :theme="'secondary'"
                                v-strokeBtn
                                title="Create Attributes Group"
                                @click="unselectGroup"
                                >Create</nitrozen-button
                            >
                            <nitrozen-button
                                :theme="'secondary'"
                                v-flatBtn
                                title="Save Attributes Group Sequence"
                                @click="shuffleAttributeGroups"
                                >Save</nitrozen-button
                            >
                        </div>
                    </div>
                    <div class="attribute-container mt-md">
                        <draggable
                            class="list group"
                            v-model="groupSequence"
                            handle=".reorder"
                            @start="drag = true"
                            @end="drag = false"
                        >
                            <div
                                v-for="(slug, index) of groupSequence"
                                :key="index"
                                class="item space-between pointer"
                                :class="{
                                    active: selectedGroupSlug === slug
                                }"
                                @click="selectGroup(slug)"
                            >
                                <div class="inline v-center">
                                    <inline-svg
                                        class="reorder mr-md"
                                        src="reorder"
                                    ></inline-svg>
                                    {{ index + 1 }}. &nbsp;
                                    {{ getGroupName(slug) }}
                                </div>
                            </div>
                        </draggable>
                        <!-- Hidden groups -->
                        <div v-if="hiddenList.length">
                            <div
                                class="border-top pad-sm mt-sm cl-DustyGray2 darker-xxs"
                            >
                                Hidden Groups
                            </div>

                            <div class="list mt-sm">
                                <div
                                    v-for="(slug, index) of hiddenList"
                                    :key="index"
                                    class="item space-between pointer inline v-center"
                                    :class="{
                                        active: selectedGroupSlug === slug
                                    }"
                                    @click="selectGroup(slug)"
                                >
                                    <div>{{ getGroupName(slug) }}</div>
                                    <div>
                                        <nitrozen-badge state="warn"
                                            >DISABLED</nitrozen-badge
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->
            <!-- &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& -->
            <div class="section right">
                <!-- Settings Pane -->
                <div class="pane">
                    <div class="inline apart">
                        <div class="cl-Mako bold-md">
                            {{ groupDetails._new ? 'New Group' : 'Settings' }}
                        </div>
                        <div class="inline v-center">
                            <!-- displayed toggle -->
                            <div
                                class="toggle-display-txt pointer cl-RoyalBlue bold-xxxs"
                                :class="{
                                    'cl-DustyGray2': !groupDetails[entity]
                                        .display
                                }"
                                @click="toggleGroupDisplay(groupDetails.slug)"
                            >
                                {{
                                    groupDetails[entity].display
                                        ? 'Displayed'
                                        : 'Hidden'
                                }}
                            </div>
                            <nitrozen-toggle-btn
                                class="mr-sm"
                                v-model="groupDetails[entity].display"
                                @change="toggleGroupDisplay(groupDetails.slug)"
                            ></nitrozen-toggle-btn>
                            <nitrozen-button
                                :theme="'secondary'"
                                v-flatBtn
                                title="Save Attribute Group Settings"
                                @click="saveForm"
                                >Save</nitrozen-button
                            >
                        </div>
                    </div>
                    <!-- Name -->
                    <div class="mt-sm">
                        <nitrozen-input
                            class="input w-l"
                            label="Name"
                            :required="true"
                            placeholder="For eg. Material Type, Color, etc"
                            v-model="groupDetails.name"
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
                            class="input w-l"
                            label="Slug"
                            :disabled="!groupDetails._new"
                            :required="true"
                            placeholder="For eg. material-type"
                            v-model="groupDetails.slug"
                            @input="updateSlug($event), checkRequired('slug')"
                            @blur="checkRequired('slug')"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.slug">
                            {{ errors.slug }}
                        </nitrozen-error>
                    </div> -->
                    <!-- MOVE -->
                    <div class="inline mt-sm" v-if="!groupDetails._new">
                        <nitrozen-input
                            class="input w-sm mr-sm"
                            type="number"
                            placeholder="Enter new position number"
                            v-model="positionNumber"
                        ></nitrozen-input>
                        <nitrozen-button :theme="'secondary'" @click="moveGroup"
                            >Move to Position</nitrozen-button
                        >
                    </div>
                    <div class="mt-sm inline v-center">
                        <nitrozen-dropdown
                                class="input w-l mr-md"
                                label="Templates"
                                :items="templatesList"
                                v-model="groupDetails[entity].template_slugs"
                                :required="true"
                                :multiple="true"
                                :searchable="true"
                                @change="filterAttributes"
                                @blur="checkRequired('template_slugs')"
                                @searchInputChange="setTemplatesList"
                         ></nitrozen-dropdown>
                    </div>
                    <nitrozen-error v-if="errors.template_slugs">
                        {{ errors.template_slugs }}
                    </nitrozen-error>
                    <div class="chip-wrapper inline">
                        <div
                            v-for="(template,
                            index) of groupDetails[entity].template_slugs"
                            :key="index"
                        >
                            <nitrozen-chips class="chip">
                                {{ template }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    @click="removeItem(entity, index)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                        </div>
                    </div>
                    <!-- Attributes -->
                    <div class="mt-sm inline v-center">
                        
                        <nitrozen-dropdown
                            class="input w-l mr-md"
                            label="Attributes"
                            :items="filteredAttributes"
                            v-model="groupDetails[entity].attributes"
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
                    <nitrozen-error v-if="errors.attributes">
                        {{ errors.attributes }}
                    </nitrozen-error>
                    <!-- Attribute sequence list -->
                    <div class="attribute-container mt-sm">
                        <draggable
                            class="list attribute"
                            v-model="groupDetails[entity].attributes"
                            handle=".reorder"
                            @start="drag = true"
                            @end="drag = false"
                        >
                            <div
                                class="item inline apart"
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
                                            groupDetails[
                                                entity
                                            ].attributes.splice(index, 1)
                                        "
                                    ></inline-svg>
                                </div>
                            </div>
                        </draggable>
                    </div>
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
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    .section {
        width: calc(50% - 12px);
        &.right {
            margin-left: 24px;
        }
        .pane {
            padding: 24px;
            border: 1px solid @WhiteSmoke;
            border-radius: 8px;
            background-color: @White;
        }
    }

    .settings-container {
        width: 50%;
        display: block;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        background-color: @White;
    }
}

.attribute-container {
    .list {
        overflow-y: auto;
        padding-right: 24px;
        .blaster-scrollbar;
        &.group {
            max-height: calc(100vh - 285px);
        }
        &.attribute {
            height: calc(100vh - 285px);
        }

        .item {
            max-width: 100%;
            border: 1px solid @Iron;
            border-radius: 4px;
            margin-bottom: 12px;
            height: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            color: @Mako;
            font-size: 14px;
            font-weight: 500;
            &.active {
                background: rgba(92, 107, 221, 0.1) !important;
            }
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
.chip-wrapper {
    margin-top: 12px;
    flex-wrap: wrap;
}
.toggle-display-txt {
    width: 60px;
}

.pointer {
    cursor: pointer;
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
    .h-spbtw {
        justify-content: space-between;
        align-items: center;
    }
}
.border-top {
    border-top: 1px solid @Iron;
    &.pad-sm {
        padding-top: 24px;
    }
}
.txt-btn {
    color: @RoyalBlue;
    font-size: 12px;
    font-weight: 600;
    .pointer;
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
import Loader from '@/components/common/loader';
import FormInput from '@/components/common/form-input';
import InlineSvg from '@/components/common/ukt-inline-svg';
import Draggable from 'vuedraggable';
import slugify from 'slugify';
import { moveArrayItem } from '../../../helper/utils';
import {
    generateArrItem,
    filterDuplicateObject,
} from '@/helper/utils';
// import { dirtyCheckMixin } from '@/mixins/form.mixin';
import root from 'window-or-global';
import _ from 'lodash';
import path from 'path';
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

const EMPTY_GROUP_DETAILS = {
    details: { attributes: [],template_slugs: [], display: false },
    comparisons: { attributes: [],template_slugs: [], display: false }
};

export default {
    name: 'AttributeGroupAndOrder',
    components: {
        PageHeader,
        TagsInput,
        FormInput,
        ImageUploader,
        InlineSvg,
        Draggable,
        Loader,

        NitrozenInput,
        NitrozenError,
        NitrozenInline,
        NitrozenButton,
        NitrozenToggleBtn,
        NitrozenDropdown,
        NitrozenTooltip,
        NitrozenBadge,
        'nitrozen-chips': NitrozenChips,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    // mixins: [dirtyCheckMixin],
    data: function() {
        return {
            entity: this.$route.params.entity,

            pageLoading: false,
            inProgress: false,
            pageError: false,
            formSaved: false,
            groups: [],
            hiddenList: [],
            selectedGroupSlug: '',
            positionNumber: null,
            groupSequence: [],
            groupDetails: { ...EMPTY_GROUP_DETAILS },
            departments: [],
            attributes: [],
            templates:[],
            errors: {},
            templatesList: [],
            departmentsList: [],
            attributesList: [],
            filteredAttributes:[],
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        title() {
            return `Attribute Group & Sequence - ${
                this.entity === 'comparisons' ? 'Compare' : 'Detail'
            }`;
        },
        attrSelectedList() {
            const list = [];
            if (this.groupDetails[this.entity].attributes) {
                this.groupDetails[this.entity].attributes.forEach((attr) => {
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
            }
        }
    },
    methods: {
        isEmpty: _.isEmpty,
        init() {
            this.pageLoading = true;
            Promise.all([
                this.fetchGroups(),
                this.fetchGroupSequence(),
                this.fetchDepartments(),
                this.fetchProductTemplates(),
                this.fetchAttributes(), 
            ])
                .then(() => {
                    this.pageLoading = false;
                    this.fetchHidden();
                    this.setDepartmentsList();
                    this.selectGroup(this.$route.params.slug);
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchHidden() {
            this.hiddenList = [];
            this.groups.forEach((g) => {
                if (
                    g.type === this.entity &&
                    !this.groupSequence.includes(g.slug)
                ) {
                    this.hiddenList.push(g.slug);
                }
            });
        },
        fetchProductTemplates() {
            const query = {
                page_size: 9999999,
                sort: 'created_desc'
            }
                return CompanyService.fetchProductTemplates(query)
                    .then(({ data }) => {
                        // this.templatesList = generateArrItem(data.items);
                        console.log("data--------template", this.templatesList)
                        // this.templatesList = filterDuplicateObject(this.templatesList);
                         this.templates = data.items;
                         this.setTemplatesList();
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.pageError = true;
                        console.log(err);
                    });
            
        },
        fetchGroups() {
            const params = {
                page_no: 1,
                page_size: 999,
                sort_on: 'created_desc',
                type: this.entity
            };
            return CompanyService.fetchGroups(params)
                .then(({ data }) => {
                    this.groups = data.items;
                })
                .catch((err) => {
                    return err;
                });
        },
        fetchGroupSequence() {
            return CompanyService.fetchShuffleAttributeGroups(this.entity)
                .then(({ data }) => {
                    this.groupSequence = data.data.sequence;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        fetchGroupDetails() {
            this.inProgress = true;
            const params = {
                type: this.entity,
                ca: true
            };
            return CompanyService.fetchGroupDetails(
                this.selectedGroupSlug,
                params
            )
                .then(({ data }) => {
                    this.inProgress = false;
                    this.groupDetails = {
                        ...EMPTY_GROUP_DETAILS,
                        ...data.data
                    };
                    this.filterAttributes();
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.log(err);
                });
        },
        fetchAttributes() {
            const params = {
                page_size: 999999,
                ca: true
            };
            return CompanyService.fetchAttributes(params)
                .then(({ data }) => {
                    this.attributes = data.items;
                    this.setAttributesList();
                })
                .catch((err) => {
                    console.log(err);
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
        shuffleAttributeGroups() {
            const data = {
                sequence: this.groups.map((g) => g.slug)
            };
            return CompanyService.shuffleAttributeGroups(this.entity, data)
                .then(({ data }) => {
                    this.departments = data.data;
                    this.$snackbar.global.showSuccess(
                        'Successfully saved Group sequence'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to save');
                });
        },
        getGroupName(slug) {
            const group = this.groups.find((g) => g.slug === slug);
            if (!group) return slug;
            return group.name;
        },
        selectGroup(slug) {
            if (!this.groupSequence.length) return;

            if (!slug) {
                this.selectedGroupSlug = _.first(this.groupSequence);
                slug = this.selectedGroupSlug;
            } else {
                this.selectedGroupSlug = slug;
            }
            const redirectPath = `/administrator/product/attributes/group/${this.entity}/${slug}`;
            if (this.$route.path !== redirectPath)
                this.$router.replace({
                    path: redirectPath
                });
            this.fetchGroupDetails();
            this.groupDetails[this.entity].template_slugs = [];
        },
        unselectGroup() {
            this.selectedGroupSlug = '';
            this.groupDetails = { ...EMPTY_GROUP_DETAILS, _new: true };
            this.groupDetails[this.entity].attributes = [];
            this.groupDetails[this.entity].template_slugs = [];
        },
        toggleGroupDisplay(slug) {
            // this.$set(
            //     this.groupDetails[this.entity],
            //     'display',
            //     !this.groupDetails[this.entity].display
            // );
            // if (this.groupDetails[this.entity].display) {
            //     this.groupSequence.push(slug);
            // } else {
            //     const index = this.groupSequence.indexOf(slug);
            //     this.groupSequence.splice(index, 1);
            // }
        },
        setTemplatesList(e = {}) {
            this.templatesList = [];
            this.templates.forEach((a) => {
                if (
                    !e.text ||
                    a.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.templatesList.push({
                        text: a.name,
                        value: a.slug
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
        filterAttributes(){
            let new_attributes = [];
            const templates = this.groupDetails[this.entity].template_slugs ? this.groupDetails[this.entity].template_slugs : [];
            const temp_templates = this.templates.filter((temp) => templates.some((slug) => slug === temp.slug))
            temp_templates.forEach((temp) => {
                new_attributes = new_attributes.concat(temp.attributes)
            })
            this.filteredAttributes = this.attributesList.filter((attrib) => new_attributes.some((slug) => slug === attrib.value) )
        },
        updateSlug(str) {
            if (!this.groupDetails._new) return;

            this.$set(
                this.groupDetails,
                'slug',
                slugify(str, {
                    lower: true,
                    strict: true
                })
            );
        },
        removeItem(entity, index) {
            this.groupDetails[this.entity].template_slugs.splice(index,1);
            this.filterAttributes();
        },
        moveGroup() {
            if (
                this.positionNumber < 1 ||
                this.positionNumber > this.groupSequence.length
            ) {
                this.$snackbar.global.showError(
                    `Invalid position entered. Number should be from 1 to ${this.groupSequence.length}`
                );
                this.positionNumber = null;
                return;
            }

            const oldIndex = this.groupSequence.indexOf(this.groupDetails.slug);
            if (oldIndex < 1 || oldIndex > this.groupSequence.length) {
                this.$snackbar.global.showError(
                    `This is group is hidden, please enable the toggle button above to Activate this group for shuffling.`
                );
                this.positionNumber = null;
                return;
            } else {
                this.groupSequence = moveArrayItem(
                    this.groupSequence,
                    oldIndex,
                    this.positionNumber - 1
                );
                this.positionNumber = null;
            }
        },
        getFormData() {
            try {
                return {
                    ...this.groupDetails,
                    type: this.entity
                };
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
                this.inProgress = true;

                let upsertFunc = CompanyService.updateAttributeGroup;
                if (formData._new) {
                    upsertFunc = CompanyService.createAttributeGroup;
                }

                upsertFunc(formData)
                    .then((res) => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess(
                            'Group saved successfully'
                        );
                        this.offer = res.data;
                        this.formSaved = true;
                        this.init();
                    })
                    .catch((err) => {
                        this.inProgress = false;
                        console.error(err);
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

            let val;
            if (prop === 'attributes') {
                val = this.groupDetails[this.entity][prop];
            } else {
                val = this.groupDetails[prop];
            }

            if ( prop === 'template_slugs') {
                val = this.groupDetails[this.entity][prop];
            }

            if (!val || _.isEmpty(val)) {
                isValid = false;
                this.errors[prop] = 'field is required';
            }

            return isValid;
        },
        validateForm() {
            let formValid = true;

            formValid = this.checkRequired('name') && formValid;
            formValid = this.checkRequired('slug') && formValid;
            formValid = this.checkRequired('attributes') && formValid;
            formValid = this.checkRequired('template_slugs') && formValid;

            return formValid;
        },
        redirectToListing() {
            this.$goBack('/administrator/product/attributes');
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
