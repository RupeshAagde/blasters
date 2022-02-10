<template>
    <div class="panel">
        <div class="page-header-position">
            <page-header @backClick="onCancel" :title="'Review Extension'">
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button
                        @click="saveForm(true)"
                        class="footer-actions"
                        v-flatBtn
                        theme="secondary"
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                </template>
            </page-header>
        </div>
        <loader v-if="pageLoading && !pageError"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="fetchExtension"
        ></page-error>
        <div class="main-container" v-else>
            <div class="page-container">
                <a
                    class="cl-RoyalBlue"
                    :href="`https://partners.${fynd_platform_domain}/extensions/preview/${extension_id}`"
                    target="_blank"
                    >Link to extension</a
                >
                <nitrozen-input
                    :disabled="true"
                    :type="'textarea'"
                    :label="'Review Instructions'"
                    v-model="extension_info.review_instructions"
                >
                </nitrozen-input>
                <nitrozen-input
                    class="nitrozen-form-input full-width"
                    :type="'textarea'"
                    :label="'Review Comments'"
                    v-model="review_data.review_comments"
                >
                </nitrozen-input>
                <nitrozen-error :class="{ hidden: !error_comments }">
                    {{ error_comments || '-' }}
                </nitrozen-error>
                <div class="category-display">
                    <div>
                        <nitrozen-dropdown
                            class="nitrozen-form-input"
                            :label="'Category Level 1'"
                            :items="categoryInfo.category_l1"
                            multiple="true"
                            v-model="categoryInfo.categoriesL1Array"
                            :value="categoryInfo.categoriesL1Array"
                            @change="onChangeCategoryL1()"
                        ></nitrozen-dropdown>
                    </div>
                    <div>
                        <nitrozen-dropdown
                            class="nitrozen-form-input"
                            :label="'Category Level 2'"
                            multiple="true"
                            :items="categoryInfo.categoriesL2Options"
                            v-model="categoryInfo.categoriesL2Array"
                            :value="categoryInfo.categoriesL2Array"
                            @change="onChangeCategoryL2()"
                        ></nitrozen-dropdown>
                        <nitrozen-chips
                            class="nitrozen-form-input"
                            v-for="(item, index) in categoryInfo.category
                                .categories_l2"
                            :key="'categoryL2' + index"
                            multiple="true"
                        >
                            {{ item.text_to_show }}
                            <nitrozen-inline
                                :icon="'cross'"
                                class="nitrozen-icon"
                                v-on:click="removeSelectedCategory(index, true)"
                            ></nitrozen-inline>
                        </nitrozen-chips>
                    </div>
                </div>
            </div>
            <loader v-if="inProgress" class="loading"></loader>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';

.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container {
    margin: 0;
    flex-direction: column;
}
.category-display {
    margin-top: 12px;
}
.category-display-label {
    font-size: 16px;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenChips,
    NitrozenInline,
    NitrozenDropdown,
} from '@gofynd/nitrozen-vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import ExtensionService from '@/services/extension.service';
import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-inline': NitrozenInline,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            categoryInfo: {
                category_level_1: '',
                category_level_2: '',
                category: { categories_l1: [], categories_l2: [] },
                categoriesL1Array: [],
                categoriesL2Array: [],
                categoriesL2Options: [],
            },
            review_data: {
                review_comments: '',
                current_status: '',
            },
            error_comments: '',
            fynd_platform_domain: 'fynd.com',
        };
    },
    computed: {
        extension_id() {
            return this.extension_info.extension_id;
        },
        review_id() {
            return this.$route.params.review_id;
        },
    },
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        this.fetchExtension();
    },
    methods: {
        selectedCategoryOptions(categoriesL1, category_l2) {
            const selectedParents = categoriesL1.map((ext) => ext._id);
            const category_level2 = (category_l2 || []).filter((ext) =>
                selectedParents.includes(ext.parent)
            );
            this.categoryInfo.category.categories_l2 =
                this.categoryInfo.category.categories_l2.filter((ext) =>
                    selectedParents.includes(ext.parent)
                );
            this.categoryInfo.categoriesL2Array =
                this.categoryInfo.category.categories_l2.map((x) => x.text);
            this.categoryInfo.categoriesL2Options = category_level2.map(
                (ext) => ({
                    _id: ext._id,
                    value: ext.display,
                    text: ext.display + ' - ' + ext.parent_doc.display,
                    parent: ext.parent,
                })
            );
        },
        fetchExtension() {
            this.pageLoading = true;
            this.pageError = false;
            let extensionCategories =
                ExtensionService.getAllExtensionCategories();
            const getExtensionInfo = ExtensionService.getExtensionReviewInfo(
                this.review_id
            );
            Promise.all([getExtensionInfo, extensionCategories])
                .then(([{ data }, extensionCategoriesInfo]) => {
                    this.extension_info = data;
                    this.categoryInfo.category_l1 =
                        extensionCategoriesInfo.data.data.category_l1.map(
                            (ext) => ({
                                ...ext,
                                text: ext.display,
                            })
                        );
                    this.categoryInfo.category_l2 =
                        extensionCategoriesInfo.data.data.category_l2.map(
                            (ext) => ({
                                ...ext,
                                text: ext.display,
                                parent_doc:
                                    extensionCategoriesInfo.data.data.category_l1.find(
                                        (catl1) => catl1._id === ext.parent
                                    ),
                                text_to_show: `${
                                    extensionCategoriesInfo.data.data.category_l1.find(
                                        (catl1) => catl1._id === ext.parent
                                    ).display
                                } - in ${ext.display}`,
                            })
                        );
                    if (data.category) {
                        data.category.categories_l1 =
                            data.category.categories_l1.map((ext_category) => {
                                const ext_category_info =
                                    this.categoryInfo.category_l1.find(
                                        (category) =>
                                            category._id === ext_category._id
                                    );
                                return ext_category_info;
                            });
                        data.category.categories_l2 =
                            data.category.categories_l2.map((ext_category) => {
                                const ext_category_info =
                                    this.categoryInfo.category_l2.find(
                                        (category) =>
                                            category._id === ext_category._id
                                    );
                                return ext_category_info;
                            });
                        this.selectedCategoryOptions(
                            data.category.categories_l1,
                            this.categoryInfo.category_l2
                        );
                        data.category.categories_l2 =
                            data.category.categories_l2.map((ext) => {
                                return {
                                    ...ext,
                                    text_to_show: `${
                                        data.category.categories_l1.find(
                                            (catl1) => catl1._id === ext.parent
                                        ).display
                                    } - in ${ext.text}`,
                                };
                            });
                        this.categoryInfo.categoriesL1Array =
                            data.category.categories_l1.map((x) => x.display);
                        this.categoryInfo.categoriesL2Array =
                            data.category.categories_l2.map((x) => x.display);

                        this.categoryInfo.category = {
                            categories_l1: data.category.categories_l1,
                            categories_l2: data.category.categories_l2,
                        };
                    }
                })
                .catch((err) => {
                    this.pageError = true;
                    console.log(err);
                    this.$snackbar.global.showError(
                        `Failed to load extension information`
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        saveForm(approve) {
            this.error_comments = '';
            this.review_data.current_status = approve
                ? 'published'
                : 'rejected';
            if (!approve && !this.review_data.review_comments) {
                this.error_comments =
                    'Review comments required for rejecting extension changes';
                this.$snackbar.global.showError('Missing required data');
                return;
            }
            this.inProgress = true;
            //TODO: Add form dirty
            const { categories_l1, categories_l2 } = this.categoryInfo.category;
            this.review_data.category = {
                categories_l1: categories_l1.map((x) => ({
                    id: x._id,
                    slug: x.slug,
                    _id: x._id,
                })),
                categories_l2: categories_l2.map((x) => ({
                    id: x._id,
                    slug: x.slug,
                    _id: x._id,
                    parent: x.parent,
                })),
            };
            ExtensionService.updateExtensionReviewInfo(
                this.review_id,
                this.review_data
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(
                        'Updated extension status'
                    );
                    this.onCancel();
                })
                .catch((err) => {
                    console.log(err);
                    this.$snackbar.global.showError(
                        'Failed to update extension status'
                    );
                })
                .finally(() => (this.inProgress = false));
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        },
        removeSelectedCategory(index, isL2 = false, idL1) {
            if (isL2) {
                this.categoryInfo.category.categories_l2 =
                    this.categoryInfo.category.categories_l2.filter(
                        (x, i) => i !== index
                    );
                this.categoryInfo.categoriesL2Array =
                    this.categoryInfo.category.categories_l2.map(
                        (x) => x.display
                    );
                return;
            }
            this.categoryInfo.category.categories_l1 =
                this.categoryInfo.category.categories_l1.filter(
                    (x, i) => i !== index
                );
            this.categoryInfo.category.categories_l2 =
                this.categoryInfo.category.categories_l2.filter(
                    (x, i) => x.parent !== idL1
                );
        },
        onChangeCategoryL1() {
            let {
                category_l1,
                category_l2,
                category: { categories_l1, categories_l2 },
                categoriesL1Array,
            } = this.categoryInfo;
            if (categoriesL1Array.length >= 4) {
                this.$snackbar.global.showError(`Maximum 3 Categories allowed`);
                categoriesL1Array = categoriesL1Array.pop();
                return;
            }
            this.categoryInfo.category.categories_l1 = categoriesL1Array.map(
                (ext) => category_l1.find((extVal) => extVal.display === ext)
            );
            this.selectedCategoryOptions(
                this.categoryInfo.category.categories_l1,
                category_l2
            );
            categoriesL1Array = categoriesL1Array;
        },
        onChangeCategoryL2() {
            let { category_l2, categoriesL2Array } = this.categoryInfo;
            if (categoriesL2Array.length >= 4) {
                this.$snackbar.global.showError(`Maximum 3 Categories allowed`);
                categoriesL2Array = categoriesL2Array.pop();
                return;
            }
            let category_level_value = category_l2.filter((ext) =>
                categoriesL2Array.includes(ext.text)
            );
            this.categoryInfo.category.categories_l2 = category_level_value;
        },
    },
};
</script>
