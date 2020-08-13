<template>
    <div class="panel">
        <div class="header-position">
            <page-header :title="title" @backClick="redirectToListing">
            </page-header>
        </div>
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
                                @click="unselectGroup"
                                >Create</nitrozen-button
                            >
                            <nitrozen-button
                                :theme="'secondary'"
                                v-flatBtn
                                @click="shuffleAttributeGroups"
                                >Save</nitrozen-button
                            >
                        </div>
                    </div>
                    <div class="attribute-container mt-md">
                        <draggable
                            class="list h-xl"
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
                        <div v-if="hiddenGroups.length">
                            <div
                                class="border-top pad-sm mt-sm cl-DustyGray2 darker-xxs"
                            >
                                Publicly Hidden Groups
                            </div>

                            <div class="list mt-sm">
                                <div
                                    v-for="(slug, index) of hiddenGroups"
                                    :key="index"
                                    class="item space-between pointer"
                                    :class="{
                                        active: selectedGroupSlug === slug
                                    }"
                                    @click="selectGroup(slug)"
                                >
                                    <div class="inline v-center">
                                        {{ getGroupName(slug) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section right">
                <!-- Settings Pane -->
                <div class="pane">
                    <div class="inline apart">
                        <div class="cl-Mako bold-md">
                            {{ groupDetails.name || 'New Group' }}
                        </div>
                        <nitrozen-button
                            :theme="'secondary'"
                            v-flatBtn
                            @click="saveForm"
                            >Save</nitrozen-button
                        >
                    </div>
                    <!-- Name -->
                    <div class="mt-sm">
                        <nitrozen-input
                            label="Name"
                            :required="true"
                            placeholder="For eg. Material Type, Color, etc"
                            v-model="groupDetails.name"
                            @input="updateSlug()"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.name">{{
                            errors.name
                        }}</nitrozen-error>
                    </div>
                    <!-- Slug -->
                    <div class="mt-sm">
                        <nitrozen-input
                            label="Slug"
                            :disabled="!groupDetails._new"
                            :required="true"
                            placeholder="For eg. material-type"
                            v-model="groupDetails.slug"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.slug">{{
                            errors.slug
                        }}</nitrozen-error>
                    </div>
                    <div class="inline mt-md">
                        <div
                            class="toggle-display-txt pointer cl-RoyalBlue bold-xxxs"
                            :class="{
                                'cl-DustyGray2': !groupDetails[entity].display
                            }"
                            @click="toggleGroupDisplay(groupDetails.slug)"
                        >
                            Publicly
                            {{
                                groupDetails[entity].display
                                    ? 'Displayed'
                                    : 'Hidden'
                            }}
                        </div>
                        <nitrozen-toggle-btn
                            class="mr-sm"
                            :value="groupDetails[entity].display"
                            @change="toggleGroupDisplay(groupDetails.slug)"
                        ></nitrozen-toggle-btn>
                    </div>
                    <!-- Attributes -->
                    <div class="mt-md inline v-center">
                        <nitrozen-dropdown
                            class="input w-l mr-md"
                            label="Attributes"
                            :items="attributesList"
                            v-model="groupDetails[entity].attributes"
                            :required="true"
                            :multiple="true"
                            :searchable="true"
                            @searchInputChange="setAttributesList"
                        ></nitrozen-dropdown>
                        <a
                            class="txt-btn mt-md"
                            href="/administrator/product/attributes/add"
                            target="_blank"
                            title="Go to 'Create Attribute' page"
                            >Create Attribute</a
                        >
                    </div>
                    <!-- Attribute ordering list -->
                    <div class="attribute-container mt-sm">
                        <draggable
                            class="list h-md"
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
        <!-- <loader v-if="inProgress" /> -->
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
        &.h-md {
            max-height: 400px;
        }
        &.h-xl {
            max-height: 500px;
        }

        .item {
            max-width: 100%;
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

.toggle-display-txt {
    width: 120px;
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
import { compactDeepObject } from '../../../helper/utils';
import ImageUploader from '@/components/common/image-uploader/index';
import CompanyService from '@/services/company-admin.service';
import Loader from '@/components/common/loader';
import FormInput from '@/components/common/form-input';
import InlineSvg from '@/components/common/ukt-inline-svg';
import Draggable from 'vuedraggable';
import slugify from 'slugify';
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
    details: { attributes: [], display: false },
    comparisons: { attributes: [], display: false }
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
            entity:
                this.$route.params.entity === 'compare'
                    ? 'comparisons'
                    : 'details',

            pageLoading: false,
            inProgress: false,
            pageError: false,
            formSaved: false,

            groups: [],
            selectedGroupSlug: '',
            groupSequence: [],
            groupDetails: { ...EMPTY_GROUP_DETAILS },
            departments: [],
            attributes: [],
            errors: {},

            departmentsList: [],
            attributesList: []
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
        },
        hiddenGroups() {
            const list = [];
            this.groups.forEach((g) => {
                if (
                    g.type === this.entity &&
                    // !g[this.entity].display &&
                    !this.groupSequence.includes(g.slug)
                ) {
                    list.push(g.slug);
                }
            });
            return list;
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
                this.fetchAttributes()
            ])
                .then(() => {
                    this.pageLoading = false;
                    this.setDepartmentsList();
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchGroups() {
            const params = {
                page: 1,
                limit: 999,
                sort: 'created_desc',
                type: this.entity
            };
            return CompanyService.fetchGroups(params)
                .then(({ data }) => {
                    this.groups = data.data;
                })
                .catch((err) => {
                    return err;
                });
        },
        fetchGroupSequence() {
            return CompanyService.fetchShuffleAttributeGroups(this.entity)
                .then(({ data }) => {
                    this.groupSequence = data.data.sequence;
                    this.selectGroup();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        fetchGroupDetails() {
            this.inProgress = true;
            const params = {
                type: this.entity
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
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.log(err);
                });
        },
        fetchAttributes() {
            const params = {
                limit: 999999
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
        fetchDepartments() {
            return new Promise((resolve, reject) => {
                CompanyService.fetchDepartments()
                    .then(({ data }) => {
                        this.departments = data.data;
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
                        'Successfully saved Group ordering'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Failed to save Group ordering'
                    );
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
            } else {
                this.selectedGroupSlug = slug;
            }
            this.fetchGroupDetails();
        },
        unselectGroup() {
            this.selectedGroupSlug = '';
            this.groupDetails = { ...EMPTY_GROUP_DETAILS, _new: true };
        },
        toggleGroupDisplay(slug) {
            this.$set(
                this.groupDetails[this.entity],
                'display',
                !this.groupDetails[this.entity].display
            );

            if (this.groupDetails[this.entity].display) {
                this.groupSequence.push(slug);
            } else {
                const index = this.groupSequence.indexOf(slug);
                this.groupSequence.splice(index, 1);
            }
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
        updateSlug() {
            if (!this.groupDetails._new) return;
            this.groupDetails.slug = slugify(this.groupDetails.name, {
                lower: true,
                strict: true
            });
        },
        getFormData() {
            try {
                if (!this.groupDetails[this.entity].priority) {
                    this.groupDetails[this.entity].priority =
                        this.groupSequence.length + 1;
                }
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
                            'Group updated successfully'
                        );
                        this.offer = res.data;
                        this.formSaved = true;
                        this.init();
                    })
                    .catch((err) => {
                        this.inProgress = false;
                        this.$snackbar.global.showError(
                            `Failed to update${
                                err && err.message ? ' : ' + err.message : ''
                            }`
                        );
                    });
            } catch (err) {
                console.log(err);
            }
        },
        redirectToListing() {
            this.$goBack('/administrator/product/attributes');
        },
        validateForm() {
            let formValid = true;
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
