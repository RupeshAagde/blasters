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
            <br>
            <loader v-if="loading"></loader>
            <h4>All Categories</h4>
            <br>
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
                        <p style="flex: 1 1 auto;">{{ item.display }}</p>
                        <span v-on:click="editCategory(item.key)">
                            <inline-svg
                                v-if="item.sub_categories.length == 0"
                                class="svg-icon"
                                src="plus-black"
                            ></inline-svg>
                            <inline-svg
                                v-else
                                class="svg-icon"
                                src="edit"
                            ></inline-svg>
                        </span>
                        <span v-on:click="removeCategory(index)">
                            <inline-svg
                                class="svg-icon"
                                src="delete"
                            ></inline-svg>
                        </span>
                    </div>
                    <div class="sub-categories" v-if="item.key == editingCatKey">
                        <p>Sub Categories</p>
                        <nitrozen-chips
                            class="chip-wrapper"
                            v-for="(option, opt_index) in item.sub_categories"
                            :key="opt_index"
                            >{{ option.display }}
                            <nitrozen-inline
                                :icon="'cross'"
                                class="nitrozen-icon"
                                v-on:click="removeChip(index,opt_index)"
                            ></nitrozen-inline>
                        </nitrozen-chips>
                        <input
                            placeholder="Add your sub-category"
                            ref="chipInput"
                            type="text"
                            class="chip-input"
                            @keydown.enter="addChip(index,$event)"
                            @keydown.tab="addChip(index,$event)"
                            v-model="chipInput"
                        />
                    </div>
                </div>
            </div>
        </div>
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
    NitrozenChips
} from '@gofynd/nitrozen-vue';
import { Loader, PageHeader } from '@/components/common';
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
                    this.$snackbar.global.showError('This category already exist');
                    return;
                }
            }
            let data = {
                key: slugifiedKey,
                display: this.newCategory.trim(),
                sub_categories: []
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
                this.chipInput = ''
            }
            this.allCategories.splice(index, 1)
            this.isUpdated = true;
        },
        editCategory(key) {
            this.editingCatKey = key
            this.chipInput = ''
        },
        saveData() {
            if (this.loading) {
                return;
            }
            let data = {
                items: this.allCategories
            };
            this.loading = true;
            SupportService.addCategories(data)
                .then((response) => {
                    if (response.data.items && response.data.items.length > 0) {
                        this.allCategories = response.data.items
                    }
                    this.$snackbar.global.showSuccess('Categories updated');
                })
                .catch((error) => {
                    this.$snackbar.global.showError(error.message);
                })
                .finally(() => {
                    this.loading = false;
                    this.isUpdated = false;
                });
        },
        removeChip(index, opt_index) {
            this.allCategories[index].sub_categories.splice(opt_index, 1)
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
                    console.log('This sub-category already exist');
                    this.$snackbar.global.showError('This sub-category already exist');
                    return;
                }
            }
            const data = {
                key: slugifiedKey,
                display: this.chipInput.trim(),
            }
            this.allCategories[index].sub_categories.push(data);
            this.chipInput = '';
            this.isUpdated = true;
        }
    },
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.main-container {
    background-color: white;
    font-family: Inter, sans-serif;
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
    padding: 5px;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 30px;
    }
    .chip-input {
        width: 200px;
        border: none;
        font-family: Inter, sans-serif;
        font-size: 11px;
        font-weight: 400;
        margin: 4px;
    }
}
</style>