<template>
    <div class="panel">
        <div class="page-header-position">
            <adm-page-header
                :title="`${isCreateClientPage ? 'Create' : 'Edit'} Client`"
                :context-menu-items="contextMenuItems"
                @backClick="onCancel"
                @save="save"
            >
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        :disabled="pageError || pageLoading"
                        @click.stop="save"
                        v-flatBtn
                        >Save</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button
                        :theme="'secondary'"
                        :disabled="pageError || pageLoading"
                        @click.stop="save"
                        class="footer-actions"
                        v-flatBtn
                        >Save</nitrozen-button
                    >
                </template>
            </adm-page-header>
        </div>
        <div class="main-container">
            <loader v-if="pageLoading"></loader>
            <loader v-if="inProgress" class="loading"></loader>

            <page-error
                v-if="!pageLoading && pageError"
                :errorText="errorMsg"
                :btnText="errorMsg ? '' : 'Try again'"
                @tryAgain="reloadPage"
            ></page-error>

            <div class="full-width" v-if="!pageLoading && !pageError">
                <div class="feature-container">
                    <div class="common-container">
                        <div class="left-container">
                            <label class="bold-md cl-Mako top-headers"
                                >Details</label
                            >

                            <div class="form-body">
                                <nitrozen-input
                                    label="Client Name*"
                                    placeholder="For eg: Abc Pvt. Ltd."
                                    v-model="formData.meta.name"
                                ></nitrozen-input>

                                <nitrozen-error v-if="showError && error.name"
                                    >Client Name is required</nitrozen-error
                                >
                            </div>

                            <div class="form-body">
                                <nitrozen-input
                                    type="textarea"
                                    label="Description*"
                                    :placeholder="'Description'"
                                    v-model="formData.meta.description"
                                ></nitrozen-input>
                                <nitrozen-error
                                    v-if="showError && error.description"
                                    >Client Description is
                                    required</nitrozen-error
                                >
                            </div>

                            <div class="form-body">
                                <adm-form-input
                                    class="input tags-container"
                                    :custom="true"
                                >
                                    <div>
                                        <span
                                            class="
                                                cl-DustyGray2
                                                dark-xxxs
                                                tag-title
                                            "
                                        >
                                            Tags
                                            <nitrozen-tooltip
                                                class="tags-tooltip"
                                                position="top"
                                                tooltipText="To create tags use keyboard Enter button"
                                            ></nitrozen-tooltip>
                                        </span>
                                    </div>
                                    <div
                                        class="input-text tags"
                                        ref="tagScroll"
                                        @click.stop="focusOnChipInput"
                                    >
                                        <nitrozen-chips
                                            v-for="(tag, index) in formData.meta
                                                .tags"
                                            :key="'chips_' + index"
                                        >
                                            {{ tag }}
                                            <nitrozen-inline
                                                icon="cross"
                                                class="nitrozen-icon"
                                                @click.stop="removeChip(index)"
                                            ></nitrozen-inline>
                                        </nitrozen-chips>
                                        <input
                                            ref="chipInput"
                                            type="text"
                                            class="chip-input cl-Mako light-xs"
                                            @keydown.enter="addChip"
                                            @keydown.tab="addChip"
                                            v-model="chipInput"
                                        />
                                    </div>
                                </adm-form-input>
                            </div>
                        </div>
                    </div>
                    <div class="common-container">
                        <div class="left-container">
                            <nitrozen-error
                                class="nitrozen-error"
                                v-if="showError && error.permissions"
                                >Select at least one permission</nitrozen-error
                            >
                            <label class="bold-md cl-Mako top-headers"
                                >Permissions</label
                            >
                            <div class="form-body">
                                <nitrozen-dropdown
                                    :items="accessTypes"
                                    v-model="currentAccessRole"
                                    :label="'Select Role'"
                                    :disabled="
                                        isCreateClientPage ? false : true
                                    "
                                ></nitrozen-dropdown>
                                <adm-permisson
                                    :permissionData="
                                        aclPermissions ? aclPermissions : {}
                                    "
                                    :currentRole="currentAccessRole"
                                    :currentPermissions="selectedPermissions"
                                    :group="''"
                                    @permission-data="
                                        setPermissionData(
                                            $event,
                                            'company',
                                            null,
                                            'company'
                                        )
                                    "
                                    :isOrganisationUser="
                                        isCreateClientPage ? false : true
                                    "
                                ></adm-permisson>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import loader from '@/components/common/loader';
import admpageerror from '@/components/common/page-error';
import admpageheader from '@/components/common/layout/page-header';
import admpermission from '@/components/common/adm-permission.vue';
import { getRoute } from '@/helper/get-route';
import admforminput from '@/components/common/form-input';
import { detectMobileWidth } from '@/helper/utils.js';
import OAuthClientService from '../../../services/oauth-client.service';
import { ADMIN_PERMISSIONS } from '../../../store/getters.type';
import { FETCH_ADMIN_PERMISSIONS } from '../../../store/action.type';
import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
    clickOutside,
    NitrozenTooltip,
    NitrozenChips,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenRadio,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';
import merge from 'lodash/merge';
export default {
    name: 'adm-create-brand',
    components: {
        'page-error': admpageerror,
        'adm-page-header': admpageheader,
        loader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-form-input': admforminput,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-dropdown': NitrozenDropdown,
        'adm-permisson': admpermission,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
    },
    directives: {
        flatBtn,
        strokeBtn,
        clickOutside,
    },
    data() {
        return {
            contextMenuItems: [],
            inProgress: false,
            pageError: false,
            pageLoading: false,
            errorMsg: '',
            formData: {
                scopes: {
                    type: 'specific',
                    permissions: [],
                },
                grants: ['client_credentials'],
                meta: {
                    tags: [],
                    name: '',
                    description: '',
                },
            },
            chipInput: '',
            error: {},
            showError: false,
            currentAccessRole: 'custom',
            accessTypes: [
                { text: 'Full Access', value: 'admin' },
                { text: 'Custom', value: 'custom' },
            ],
            selectedPermissions: [],
        };
    },
    computed: {
        isCreateClientPage() {
            return this.$route.name === 'create-oauth-client';
        },
        verifyFormData() {
            return !Object.values(this.error).includes(true);
        },
        ...mapGetters({
            aclPermissions: ADMIN_PERMISSIONS,
        }),
    },
    created() {
        if (!this.aclPermissions) {
            this.$store.dispatch(FETCH_ADMIN_PERMISSIONS);
        }
        if (!this.isCreateClientPage) {
            this.getClientData();
        }
    },
    methods: {
        detectMobileWidth,
        getClientData() {
            this.pageLoading = true;
            this.pageError = false;
            OAuthClientService.fetchClient(this.$route.params.client_id)
                .then((res) => {
                    merge(this.formData.meta, res.data.meta);
                    if (res.data.scopes.type === 'all') {
                        this.currentAccessRole = 'admin';

                        this.selectedPermissions =
                            this.aclPermissions.permissions.map(
                                (permission) => {
                                    return permission.key;
                                }
                            );
                    } else {
                        this.currentAccessRole = 'custom';

                        this.selectedPermissions = res.data.scopes.permissions;
                    }
                    this.pageLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        setPermissionData: function (event) {
            if (this.currentAccessRole === 'admin') {
                this.selectedPermissions = ['*'];
            } else {
                this.selectedPermissions = event;
            }
        },
        onCancel() {
            this.$router.push({
                path: `${getRoute(this.$route)}/administrator/oauthclient`,
            });
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.formData.meta.tags &&
                    this.formData.meta.tags.filter(
                        (tag) => tag === this.chipInput
                    ).length === 0
                )
                    this.formData.meta.tags.push(this.chipInput);
                this.chipInput = '';
            }
            setTimeout(() => {
                this.$refs.tagScroll &&
                    (this.$refs.tagScroll.scrollTop =
                        this.$refs.tagScroll.scrollHeight);
            }, 20);
            event.preventDefault();
        },
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
        removeChip(index) {
            this.formData.meta.tags.splice(index, 1);
        },
        save() {
            this.pageLoading = true;
            this.showError = false;
            if (this.isCreateClientPage) {
                if(this.currentAccessRole == 'custom'){
                    this.$set(this.formData.scopes, 'type', 'specific');
                }else{
                     this.$set(this.formData.scopes, 'type', 'all');
                }
                
                this.$set(
                    this.formData.scopes,
                    'permissions',
                    this.selectedPermissions
                );
                this.validateForm();
                if (this.verifyFormData) {
                    OAuthClientService.createClient(this.formData)
                        .then((res) => {
                            this.$snackbar.global.showSuccess(
                                'Client created successfully',
                                {
                                    duration: 2000,
                                }
                            );
                            this.$router.push({
                                path: `${getRoute(
                                    this.$route
                                )}/administrator/oauthclient`,
                            });
                        })
                        .catch((err) => {
                            this.pageLoading = false;
                            this.pageError = true;
                        });
                } else {
                    this.pageLoading = false;
                    this.showError = true;
                    this.$snackbar.global.showError(
                        'Invalid data entered. Please enter valid data.',
                        {
                            duration: 2000,
                        }
                    );
                }
            } else {
                this.validateForm();
                if (this.verifyFormData) {
                    OAuthClientService.updateClient(
                        this.$route.params.client_id,
                        { meta: this.formData.meta }
                    )
                        .then((res) => {
                            this.$snackbar.global.showSuccess(
                                'Client saved successfully',
                                {
                                    duration: 2000,
                                }
                            );
                            this.$router.push({
                                path: `${getRoute(
                                    this.$route
                                )}/administrator/oauthclient`,
                            });
                        })
                        .catch((err) => {
                            this.pageLoading = false;
                            this.pageError = true;
                        });
                } else {
                    this.pageLoading = false;
                    this.showError = true;
                    this.$snackbar.global.showError(
                        'Invalid data entered. Please enter valid data.',
                        {
                            duration: 2000,
                        }
                    );
                }
            }
        },
        validateForm() {
            this.error = {
                name: this.formData.meta.name.trim() === '',
                description: this.formData.meta.description.trim() === '',
                permissions:
                    this.formData.scopes.permissions.length > 0 ||
                    this.formData.scopes.type === 'all' ||
                    !this.isCreateClientPage
                        ? false
                        : true,
            };
        },
        reloadPage() {
            if (!this.isCreateClientPage) {
                this.getClientData();
            } else {
                this.$router.push({
                    path: `${getRoute(
                        this.$route
                    )}/administrator/oauthclient/create`,
                });
            }
        },
    },
};
</script>


<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';

.not-visible {
    position: relative;
    visibility: hidden;
    height: 0;
    overflow: hidden;
}

.main-container {
    margin-right: 0;
    .full-width {
        width: 100%;
        display: flex;
        @media @mobile {
            display: block;
        }
        .feature-container {
            width: 100%;
            .common-container {
                margin-bottom: 24px;
                width: auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                @media @mobile {
                    margin-right: 0;
                }
                .left-container {
                    max-width: 800px;
                    padding: 24px;
                    background-color: @White;

                    .nitrozen-error {
                        margin-bottom: 24px;
                    }
                }
                .form-body {
                    margin-top: 24px;
                    .input {
                        margin-top: 24px;

                        ::v-deep label {
                            font-size: 12px;
                            line-height: 18px;
                        }
                    }
                    .tag-title {
                        margin-bottom: 2px;
                        display: inline-block;
                    }
                    .tags-tooltip {
                        line-height: 1.4;
                    }
                    .tags-container {
                        .tags {
                            border: 1px solid @Iron;
                            border-radius: 4px;
                            min-height: 72px;
                            padding: 8px;
                            max-height: 150px;
                            overflow: auto;
                            .mirage-scrollbar();
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
                            }
                        }
                        div.tags.input-text:focus-within {
                            border: 1px solid #2e31be !important;
                        }
                    }
                    .order-access-radio {
                        display: flex;
                        justify-content: flex-start;
                        .nitrozen-radio-group {
                            margin-right: 10px;
                            margin-bottom: 10px;
                        }
                    }
                    .sales-channel {
                        border: 1px solid @Iron;
                        border-radius: 4px;
                        margin-top: 12px;
                        padding: 24px;
                        cursor: pointer;
                        &:hover {
                            box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
                        }
                        .app-info {
                            display: flex;
                            align-items: center;
                            .app-details {
                                padding-left: 24px;
                                display: flex;
                                .app-name {
                                    font-weight: bold;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    width: 200px;
                                    @media @mobile {
                                        width: 80px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>