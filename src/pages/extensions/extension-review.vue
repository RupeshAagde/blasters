<template>
    <div class="panel">
        <div class="page-header-position">
            <page-header @backClick="onCancel" :title="getExtensionName">
                <div class="button-box">
                    <nitrozen-button
                        v-if="extension_info.current_status === 'pending'"
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="extension_info.current_status === 'pending'"
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                    <nitrozen-badge
                        v-if="extension_info.current_status !== 'pending'"
                        :state="
                            extension_info.current_status === 'rejected'
                                ? 'error'
                                : 'success'
                        "
                        >{{ extension_info.current_status }}</nitrozen-badge
                    >
                </div>
                <template
                    v-if="extension_info.current_status === 'pending'"
                    slot="page-slot-mobile-footer"
                >
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

        <div class="main-container" v-if="extension_info.listing_info">
            <div class="page-container">
                <div class="content-container">
                    <div class="left-container">
                        <div class="cl-Mako bold-md">Extension Info</div>
                        <div class="extension-info">
                            <span>Extension Tagline:</span>
                            {{ extension_info.listing_info.tagline }}
                        </div>
                        <div class="extension-info">
                            <span>Requsted By:</span>
                            {{
                                extension_info.contact_info
                                    .review_notification_email
                            }}
                        </div>
                        <div class="extension-info">
                            <span>Requested On:</span>
                            {{ toDateTimeString(extension_info.created_at) }}
                        </div>
                        <div class="extension-info">
                            <span>Organization Name:</span>
                            {{ extension_info.organization_name }}
                        </div>

                        <div class="extension-info">
                            <nitrozen-button
                                v-if="!showScopes"
                                theme="secondary"
                                @click="showScopes = true"
                                >View Requested Scopes</nitrozen-button
                            >
                            <div class="scope-listing" v-else>
                                <ul
                                    class="ext-scopes"
                                >
                                <li v-for="(scope,
                                    index) in extension_info.scope"
                                    :key="scope + index">{{scope}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        class="right-container"
                        v-if="
                            extension_info.current_status !== 'pending' &&
                                reviewer_name &&
                                reviewer_email &&
                                reviewer_phone
                        "
                    >
                        <div class="cl-Mako bold-md">Reviewed By:</div>
                        <div class="extension-info">
                            <span>Reviewer Name:</span>
                            {{ reviewer_name }}
                        </div>
                        <div class="extension-info">
                            <span>Reviewer Email:</span>
                            {{ reviewer_email }}
                        </div>
                        <div class="extension-info">
                            <span>Reviewer Phone:</span>
                            {{ reviewer_phone }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="page-container">
                <a
                    class="cl-RoyalBlue"
                    :href="`${fynd_partners_domain}/extensions/preview/${extension_id}`"
                    target="_blank"
                    >Link to extension</a
                >
                <a v-if="companyId"
                    class="cl-RoyalBlue extension-link"
                    :href="`${fyndPlatformDomain}/company/${companyId}/extensions/${extension_id}`"
                    target="_blank"
                    >Launch extension</a
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
                    v-model="extension_info.review_comments"
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
                            ref="input-category-1"
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
                            ref="input-category-2"
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
        <transition name="modal">
            <nitrozen-dialog
                ref="confirm_password_dialog"
                title="Enter Password"
                @close="()=>{this.review_data.password=''}"
            >
                <template slot="body">
                    <div class="meta-container">
                        <nitrozen-input
                            class="search"
                            type="password"
                            label="Password*"
                            placeholder="Enter password to update review status of extension"
                            v-model="review_data.password"
                            @change="errors['password'] = ''"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors['password']"
                            >This field is required</nitrozen-error
                        >
                    </div>
                </template>
                <template slot="footer">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-strokeBtn
                        :showProgress="inProgress"
                        @click="saveForm(review_data.current_status === 'published')"
                        >{{this.review_data.current_status === 'published'? "Approve": "Reject"}}
                    </nitrozen-button>
                </template>
            </nitrozen-dialog>
        </transition>
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
    margin: 0 0 24px 0;
    flex-direction: column;
    width: calc(100% - 48px);
    .content-container {
        display: flex;

        .left-container {
            width: 50%;
        }
        .right-container {
            flex: 1;
            margin-left: 24px;
        }
        .extension-info {
            margin-top: 24px;
            font-size: 14px;
            color: @Mako;
            span {
                font-weight: bold;
            }
            .scope-listing{
                margin-left: 24px;
                .ext-scopes{
                    list-style: disc;
                    li{
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }
    .extension-link {
        padding-top: 15px;
    }
}
.default-image {
    width: auto;
    height: 60px;
    position: absolute;
    left: -10px;
    top: 0px;
}
.circle-clip {
    clip-path: circle(30px at center);
}

.main-container {
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
    NitrozenBadge,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import ExtensionService from '@/services/extension.service';
import root from 'window-or-global';
import moment from 'moment';
import CompanyService from '@/services/company-admin.service';

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
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
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
                password: ''
            },
            errors: {
                password: ''
            },
            error_comments: '',
            reviewer_name: '',
            reviewer_email: '',
            reviewer_phone: '',
            showScopes: false,
            companyId: ''
        };
    },
    computed: {
        fynd_partners_domain() {
            return env.BOMBSHELL_MAIN_DOMAIN;
        },
        fyndPlatformDomain() {
            return env.MIRAGE_MAIN_DOMAIN;
        },
        extension_id() {
            return this.extension_info.extension_id;
        },
        review_id() {
            return this.$route.params.review_id;
        },
        getExtensionName() {
            return (
                (this.extension_info &&
                    this.extension_info.listing_info &&
                    this.extension_info.listing_info.name) ||
                'Extension Name'
            );
        }
    },
    mounted() {
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
                    if (this.extension_info.current_status !== 'pending') {
                        this.getUserInfo(this.extension_info.reviewed_by);
                    }
                    this.companyId = this.extension_info.admin_dev_account_uid;
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
            this.review_data.review_comments = this.extension_info.review_comments
            if (!approve && !this.review_data.review_comments) {
                this.error_comments =
                    'Review comments required for rejecting extension changes';
                this.$snackbar.global.showError('Missing required data');
                return;
            }
            if (!this.review_data.password.trim()) {
                if (!this.$refs['confirm_password_dialog'].isModalVisible) {
                    this.openPasswordModal();
                }
                else{
                    this.errors['password'] = 'Password is required to update the status';
                }
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
                .finally(() => {
                    this.inProgress = false; 
                    this.$refs['confirm_password_dialog'].close()
                });
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
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },
        backClick() {
            this.$emit('backClick');
        },
        getUserInfo(userId) {
            CompanyService.searchUser({ query: userId })
                .then((res) => {
                    if (res.data.users.length) {
                        this.reviewer_name =
                            res.data.users[0].first_name +
                            ' ' +
                            res.data.users[0].last_name;
                        for (
                            let i = 0;
                            i < res.data.users[0].emails.length;
                            i++
                        ) {
                            if (res.data.users[0].emails[i].primary === true) {
                                this.reviewer_email =
                                    res.data.users[0].emails[i].email;
                            }
                        }
                        for (
                            let i = 0;
                            i < res.data.users[0].phone_numbers.length;
                            i++
                        ) {
                            if (
                                res.data.users[0].phone_numbers[i].primary ===
                                true
                            ) {
                                this.reviewer_phone =
                                    '+' +
                                    res.data.users[0].phone_numbers[i]
                                        .country_code +
                                    ' ' +
                                    res.data.users[0].phone_numbers[i].phone;
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        openPasswordModal() {
            this.$refs['confirm_password_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
                neutralButtonLabel: false,
                positiveButtonLabel: 'Proceed',
                negativeButtonLabel: 'Cancel',
            });
        },
    }
};
</script>
