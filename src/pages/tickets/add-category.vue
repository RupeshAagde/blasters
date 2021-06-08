<template>
    <div class="panel">
        <page-header
            title="Add New Category"
            @backClick="$router.push({ name: 'support' })"
        >
            <nitrozen-button
                v-flatBtn
                theme="secondary"
                @click="saveData"
                :showProgress="loading"
                :disabled="!fetchedSuccesfully"
            >
                Save
            </nitrozen-button>
        </page-header>
        <div class="main-container">
            <p class="heading">All Categories</p>
            <loader v-if="loading"></loader>
            <div class="add-category">
                <nitrozen-input
                    class="category-input"
                    placeholder="Enter new category"
                    v-model="newCategory"
                    @keyup.enter.native="addCategory"
                    @input="onCategoryChange"
                />
                <nitrozen-button
                    class="category-button"
                    :theme="'secondary'"
                    :showProgress="loading"
                    :disabled="!isSubmitable"
                    @click="addCategory"
                    v-flatBtn
                >
                    Add
                </nitrozen-button>
            </div>
            <div v-for="(item, index) in allCategories" v-bind:key="index">
                <div class="category">
                    <div class="category-top">
                        <p style="flex: 1 1 auto">{{ item.display }}</p>
                        <span
                            v-on:click="editCategory(item.key, index)"
                            v-if="item.sub_categories.length != 0 || item.feedback_form"
                            title="Edit sub-categories and Feedback Form"
                        >
                            <inline-svg
                                class="svg-icon"
                                src="edit"
                            ></inline-svg>
                        </span>
                        <span
                            v-on:click="editCategory(item.key, index)"
                            v-else
                            title="Add sub-categories and Feedback Form"
                        >
                            <inline-svg
                                class="svg-icon"
                                src="plus-black"
                            ></inline-svg>
                        </span>
                        <span
                            v-on:click="removeCategory(index)"
                            title="Delete this category"
                        >
                            <inline-svg
                                class="svg-icon"
                                src="delete"
                            ></inline-svg>
                        </span>
                    </div>
                    <div v-if="item.key == editingCatKey">
                        <div class="sub-categories">
                            <p>Sub Categories</p>
                            <nitrozen-chips
                                class="chip-wrapper"
                                v-for="(option, opt_index) in item.sub_categories"
                                :key="opt_index"
                                >{{ option.display }}
                                <nitrozen-inline
                                    :icon="'cross'"
                                    class="nitrozen-icon"
                                    v-on:click="removeChip(index, opt_index)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                            <nitrozen-input
                                placeholder="Add your sub-category"
                                ref="chipInput"
                                type="text"
                                class="chip-input"
                                @keyup.enter.native="addChip(index, $event)"
                                v-model="chipInput"
                            />
                        </div>
                        <div class="feedback-form">
                            <div class="header-line">
                                <p>Feedback Form Schema</p>
                                <nitrozen-button
                                    theme="secondary"
                                    @click="preview('categoryFeedbackForm')"
                                    >
                                    Preview
                                </nitrozen-button>
                                <nitrozen-button
                                    v-flatBtn
                                    theme="secondary"
                                    @click="addFeedbackForm(index, $event)"
                                    :showProgress="loading"
                                >
                                    Save Schema
                                </nitrozen-button>
                            </div>
                            <meta-box
                                ref="categoryFeedbackForm"
                                :showJsonOnly="true"
                                :customJson="formSchema.inputs"
                            ></meta-box>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            ref="previewFeedbackSchema"
            title="Preview"
            class="preview-schema"
        >
            <template slot="body">
                <div v-if="Array.isArray(previewSchema)">
                    <nitrozen-custom-form
                        ref="feedback-form-preview"
                        :inputs="previewSchema || []"
                        v-model=previewModel
                        :disabled="true"
                    />
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog,
    NitrozenInline,
    NitrozenChips,
    NitrozenCustomForm
} from '@gofynd/nitrozen-vue';
import { Loader, PageHeader, MetaBox } from '@/components/common';
import { validateNitrozenCustomFormInputs } from '@/helper/utils';
import inlinesvg from '@/components/common/inline-svg';
import SupportService from './../../services/support.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import slugify from 'slugify';

export default {
    name: 'add-category',
    components: {
        NitrozenInput,
        NitrozenBadge,
        NitrozenDialog,
        NitrozenError,
        NitrozenDropdown,
        NitrozenButton,
        Loader,
        PageHeader,
        NitrozenInline,
        NitrozenChips,
        NitrozenCustomForm,
        MetaBox,
        'inline-svg': inlinesvg,
    },
    directives: {
        strokeBtn,
        flatBtn,
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            newCategory: '',
            allCategories: [],
            isSubmitable: false,
            loading: false,
            isUpdated: false,
            fetchedSuccesfully: false,
            chipInput: '',
            editingCatKey: null,
            formSchema: {
                title: 'Feedback Form',
                inputs: []
            },
            previewSchema: [],
            previewModel: {}
        };
    },
    mounted() {
        this.loading = true;
        SupportService.fetchCategories()
            .then((response) => {
                if (response.data.items && response.data.items.length > 0) {
                    this.allCategories = response.data.items;
                }
                this.fetchedSuccesfully = true;
            })
            .catch((error) => {
                if (error.message) {
                    this.$snackbar.global.showError(error.message);
                } else {
                    this.$snackbar.global.showError('Something went wrong');
                }
                this.fetchedSuccesfully = false;
            })
            .finally((this.loading = false));
    },
    methods: {
        isFormDirty() {
            return this.isUpdated;
        },
        addCategory() {
            const slugifiedKey = slugify(this.newCategory.trim(), {
                lower: true,
                strict: true,
            });
            if (!this.isSubmitable && this.loading) {
                return;
            }
            if (slugifiedKey == '') {
                this.$snackbar.global.showError('Please enter a category');
                return;
            }
            for (let item of this.allCategories) {
                if (item.key.trim() == slugifiedKey) {
                    this.$snackbar.global.showError(
                        'This category already exist'
                    );
                    return;
                }
            }
            let data = {
                key: slugifiedKey,
                display: this.newCategory.trim(),
                sub_categories: [],
            };
            this.allCategories.push(data);
            this.newCategory = '';
            this.isUpdated = true;
        },
        onCategoryChange() {
            this.isSubmitable =
                this.newCategory && this.newCategory.trim().length > 0;
        },
        removeCategory(index) {
            if (this.allCategories[index].key == this.editingCatKey) {
                this.chipInput = '';
            }
            this.allCategories.splice(index, 1);
            this.isUpdated = true;
        },
        editCategory(key, index) {
            this.editingCatKey = key;
            this.chipInput = '';
            let selectedForm = this.allCategories[index].feedback_form;
            if (selectedForm) {
                this.formSchema.inputs = selectedForm.inputs || [];
                this.formSchema.title = selectedForm.title || 'Feedback Form';
            } else {
                this.formSchema.inputs = [];
                this.formSchema.title = 'Feedback Form';
            }
            setTimeout(() => {
                if (this.$refs['categoryFeedbackForm'] && this.$refs['categoryFeedbackForm'].length > 0) {
                    this.$refs['categoryFeedbackForm'][0].populateData();
                }
            }, 1);
        },
        saveData() {
            if (this.loading) {
                return;
            }
            let data = {
                items: this.allCategories,
            };
            this.loading = true;
            SupportService.addCategories(data)
                .then((response) => {
                    if (response.data.items && response.data.items.length > 0) {
                        this.allCategories = response.data.items;
                    }
                    this.$snackbar.global.showSuccess('Categories updated');
                    this.isUpdated = false;
                })
                .catch((error) => {
                    this.$snackbar.global.showError(error.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        preview(ref){
            if (this.$refs[ref] && this.$refs[ref].length > 0) {
                this.previewSchema = this.$refs[ref][0].getJSON() || [];
            } else {
                this.previewSchema = []
            }
            this.$refs['previewFeedbackSchema'].open({
                width: '600px',
                showCloseButton: true,
                dismissible: true
            });
        },
        addFeedbackForm(index, event) {
            event.preventDefault();
            let inputs = [];
            if (this.$refs['categoryFeedbackForm'] && this.$refs['categoryFeedbackForm'].length > 0) {
                inputs = this.$refs['categoryFeedbackForm'][0].getJSON() || [];
            } else {
                this.$snackbar.global.showError('Something went wrong');
                return;
            }

            if (!( inputs && Array.isArray(inputs)) ||
                !validateNitrozenCustomFormInputs(inputs)) {
                this.$snackbar.global.showError('Data not saved, please enter proper nitrogen form schema');
                return;
            }           
            const data = {
                inputs: inputs,
                title: "Feedback form"
            };
            if (inputs.length > 0) {
                this.allCategories[index].feedback_form = data;
            } else {
                this.allCategories[index].feedback_form = undefined;
            }
            this.isUpdated = true;
        },
        removeChip(index, opt_index) {
            this.allCategories[index].sub_categories.splice(opt_index, 1);
            this.isUpdated = true;
        },
        addChip(index, event) {
            event.preventDefault();
            const slugifiedKey = slugify(this.chipInput.trim(), {
                lower: true,
                strict: true,
            });
            if (slugifiedKey == '') {
                this.$snackbar.global.showError('Please enter a sub-category');
                return;
            }
            for (let subCat of this.allCategories[index].sub_categories) {
                if (subCat.key.trim() == slugifiedKey) {
                    this.$snackbar.global.showError(
                        'This sub-category already exist'
                    );
                    return;
                }
            }
            const data = {
                key: slugifiedKey,
                display: this.chipInput.trim(),
            };
            this.allCategories[index].sub_categories.push(data);
            this.chipInput = '';
            this.isUpdated = true;
        },
    },
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.heading {
    font-family: Inter, sans-serif;
    font-size: 17px;
    line-height: 1.5;
    padding-bottom: 9px;
}
.main-container {
    background-color: white;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    margin: 24px;
    padding: 24px;
    top: 56.5px;
    position: relative;
    min-height: 400px;
}
.category {
    padding: 8px;
    margin-top: 12px;
    border-radius: 6px;
    border: 1px solid rgb(193, 194, 235);
}
.category-top {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    color: rgb(55, 55, 55);
    font-weight: 500;
}
.add-category {
    text-align: center;
    display: flex;
    align-items: flex-end;
}
.category-input {
    flex: 1 1 auto;
    margin-right: 5px;
}
.category-button {
    width: fit-content;
}
.sub-categories {
    border: 1px solid @Iron;
    border-radius: 4px;
    color: grey;
    padding: 5px;
    .nitrozen-chip {
        color: rgb(55, 55, 55);
        margin: 5px;
        height: 25px;
        padding: 0 6px;
        font-size: 12px;
        line-height: 25px;
    }
    .chip-input {
        width: 200px;
        font-family: Inter, sans-serif;
        color: rgb(55, 55, 55);
        font-size: 12px;
        font-weight: 400;
        margin: 4px;
        ::v-deep.n-input {
            height: 30px;
            padding: 5px 10px;
            font-size: 12px;
        }
    }
}
.feedback-form {
    border: 1px solid @Iron;
    border-radius: 4px;
    color: grey;
    padding: 10px;
    margin-top: 8px;
    .header-line {
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between
    }
    .meta-box {
        margin-top: 10px
    }
}
</style>