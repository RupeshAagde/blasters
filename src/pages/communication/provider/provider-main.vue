<template>
    <div class="outer-container main" v-if="!pageLoading">
        <div class="page-header-position">
            <adm-page-header
                :title="isEditMode ? 'Provider' : 'Create Provider'"
                @backClick="backRedirect"
                :contextMenuItems="threeDotsOptions"
            >
                <div class="header-button-container">
                    <nitrozen-button
                        v-strokeBtn
                        :theme="'secondary'"
                        @click.stop="onTestProviderClick"
                        class="btn-wrapper no-padding"
                        v-if="isEditMode"
                        >Test Provider</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        id="create-btn"
                        @click="saveAndPublish"
                        class="btn-wrapper"
                        v-if="isCreateMode"
                        >Create</nitrozen-button
                    >
                </div>
                <div class="header-button-container">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        @click="saveAndPublish"
                        class="btn-wrapper"
                        v-if="isEditMode"
                        >Save</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button
                        v-strokeBtn
                        :theme="'secondary'"
                        @click.stop="onTestProviderClick"
                        class="btn-wrapper no-padding"
                        v-if="isEditMode"
                        >Test Provider</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveAndPublish"
                        v-flatBtn
                        class="footer-actions"
                        >{{ isEditMode ? 'Save' : 'Create' }}</nitrozen-button
                    >
                </template>
            </adm-page-header>
        </div>
        <div class="main-body">
            <div class="left-container">
                <providermainbody
                    ref="providermainbody"
                    :isEditMode="isEditMode"
                    :isCloneMode="isCloneMode"
                    :isCreateMode="isCreateMode"
                    :providerId="providerId"
                    :providerType="providerType"
                    :providerCategory="providerCategory"
                    @makeProviderDefault="makeProviderDefault"
                ></providermainbody>
            </div>
        </div>
    </div>
</template>

<script>
import providermainbody from './provider-main-body.vue';
//import adminCommsService from './../../../../services/admin/admin-comms.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';

import { mapGetters } from 'vuex';
// import {
//     ADMIN_COMMS_CREATE_EMAIL_PROVIDER_FORM,
//     ADMIN_COMMS_CREATE_SMS_PROVIDER_FORM,
//     ADMIN_COMMS_FETCH_EMAIL_PROVIDER,
//     ADMIN_COMMS_FETCH_SMS_PROVIDER,
//     ADMIN_COMMS_UPDATE_EMAIL_PROVIDER_FORM,
//     ADMIN_COMMS_UPDATE_SMS_PROVIDER_FORM
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_PROVIDER,
//     ADMIN_COMMS_GET_SMS_PROVIDER
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_PROVIDER,
//     ADMIN_COMMS_SET_SMS_PROVIDER
// } from '../../../../store/admin/mutation.type';
import uktinlinesvg from '@/components/common/ukt-inline-svg';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInline,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import PageHeader from '@/components/common/layout/page-header';
import path from 'path';
export default {
    name: 'provider-main',
    components: {
        providermainbody,
        uktinlinesvg,
        'nitrozen-button': NitrozenButton,
        'adm-page-header': PageHeader,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-menu-item': NitrozenMenuItem,
        'nitrozen-dialog': NitrozenDialog
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            pageLoading: true,
            isEditMode: this.$route.params.mode === 'edit',
            isCloneMode:
                this.$route.params.mode == 'create' && this.$route.query.clone
                    ? true
                    : false,
            isCreateMode:
                this.$route.params.mode == 'create' && !this.$route.query.clone
                    ? true
                    : false,
            providerType: this.$route.params.providerType || 'email',
            providerCategory: this.$route.query.type || 'falconide',
            providerId: this.$route.params.id,
            threeDotsOptions: []
        };
    },
    mounted() {
        console.log(this.$route);
        this.pageLoading = false;
        // let promiseObj = Promise.resolve();
        // if (
        //     this.isEditMode &&
        //     this.providerId &&
        //     this.providerType == 'email'
        // ) {
        //     promiseObj = this.fetchEmailProvider(this.providerId).then(() => {
        //         this.providerCategory = this.emailProviderStore.provider;
        //     });
        // } else if (
        //     this.isEditMode &&
        //     this.providerId &&
        //     this.providerType == 'sms'
        // ) {
        //     promiseObj = this.fetchSmsProvider(this.providerId).then(() => {
        //         this.providerCategory = this.smsProviderStore.provider;
        //     });
        // }
        // promiseObj.finally(() => {
        //     this.pageLoading = false;
        // });
    },
    methods: {
        onTestProviderClick() {
            this.$refs.providermainbody.openTestProviderModal();
        },
        fetchEmailProvider(id) {
            this.pageLoading = true;
            //return this.$store.dispatch(ADMIN_COMMS_FETCH_EMAIL_PROVIDER, id);
        },
        fetchSmsProvider(id) {
            this.pageLoading = true;
            //return this.$store.dispatch(ADMIN_COMMS_FETCH_SMS_PROVIDER, id);
        },
        backRedirect() {
            this.$router.back();
        },
        saveAndPublish() {
            let mainbodyValid = this.$refs.providermainbody.validate();
            if (mainbodyValid) {
                this.$refs.providermainbody.validateAndSave();
                this.saveForm();
            }
        },
        makeProviderDefault() {
            this.saveAndPublish();
        },
        saveForm() {
            // return Promise.resolve()
            //     .then(() => {
            //         if (this.providerId) {
            //             // this.pageLoading = true;
            //             if (this.providerType == 'email') {
            //                 return this.updateEmailProvider(
            //                     this.providerId,
            //                     this.emailProviderStore
            //                 );
            //             } else if (this.providerType == 'sms') {
            //                 return this.updateSmsProvider(
            //                     this.providerId,
            //                     this.smsProviderStore
            //                 );
            //             }
            //         } else {
            //             if (this.providerType == 'email') {
            //                 return this.createEmailProvider(
            //                     this.emailProviderStore
            //                 ).then(data => {
            //                     this.$router.push({
            //                         path: path.join(
            //                             this.$basePath,
            //                             `/provider/email/edit/${data._id}`
            //                         )
            //                     });
            //                 });
            //             } else if (this.providerType == 'sms') {
            //                 return this.createSmsProvider(
            //                     this.smsProviderStore
            //                 ).then(data => {
            //                     this.$router.push({
            //                         path: path.join(
            //                             this.$basePath,
            //                             `/provider/sms/edit/${data._id}`
            //                         )
            //                     });
            //                 });
            //             }
            //         }
            //     })
            //     .then(data => {});
        },
        createEmailProvider(data) {
            // this.pageLoading = true;
            // return this.$store
            //     .dispatch(ADMIN_COMMS_CREATE_EMAIL_PROVIDER_FORM, {
            //         body: data
            //     })
            //     .then(data => {
            //         this.$snackbar.global.showSuccess(
            //             'Email provider created successfully'
            //         );
            //         return data;
            //     })
            //     .finally(() => {
            //         this.pageLoading = false;
            //     });
        },
        createSmsProvider(data) {
            // this.pageLoading = true;
            // return this.$store
            //     .dispatch(ADMIN_COMMS_CREATE_SMS_PROVIDER_FORM, {
            //         body: data
            //     })
            //     .then(data => {
            //         this.$snackbar.global.showSuccess(
            //             'SMS provider created successfully'
            //         );
            //         return data;
            //     })
            //     .finally(() => {
            //         this.pageLoading = false;
            //     });
        },
        updateEmailProvider(_id, data) {
            // this.pageLoading = true;
            // return this.$store
            //     .dispatch(ADMIN_COMMS_UPDATE_EMAIL_PROVIDER_FORM, {
            //         _id,
            //         body: data
            //     })
            //     .then(data => {
            //         this.$snackbar.global.showSuccess(
            //             'Email provider updated successfully'
            //         );
            //         return data;
            //     })
            //     .finally(() => {
            //         this.pageLoading = false;
            //     });
        },
        updateSmsProvider(_id, data) {
            // this.pageLoading = true;
            // return this.$store
            //     .dispatch(ADMIN_COMMS_UPDATE_SMS_PROVIDER_FORM, {
            //         _id,
            //         body: data
            //     })
            //     .then(data => {
            //         this.$snackbar.global.showSuccess(
            //             'SMS provider updated successfully'
            //         );
            //         return data;
            //     })
            //     .finally(() => {
            //         this.pageLoading = false;
            //     });
        },
        isFormDirty() {
            return this.false;
        }
    }
};
</script>

<style lang="less" scoped>

.main {
    /deep/.page-header-position {
        margin: 0;
        height: 60px;
    }
    .tab-container {
        margin: 20px 125px;
    }
    .hidden {
        visibility: hidden;
    }
    .adm-page-header {
        position: sticky;
        top: 64px;
        width: 100%;
        z-index: 7;
        border-bottom: 1px solid #eee;
        .three-dots {
            display: inline-block;
            vertical-align: middle;
        }
    }
    .main-body {
        display: flex;
        margin: 24px;
        @media @mobile {
            margin: 0 0 48px 0;
        }
        .left-container {
            width: 100%;
        }
        .right-container {
            min-width: 300px;
            width: 300px;
        }
    }
}
/deep/.header-button-container {
    align-self: center;
    .btn-wrapper {
        width: 155px;
        margin: 0px 12px;
        /deep/.n-button-content {
            display: contents;
        }
    }
    .no-padding {
        padding: 0px;
    }
}
.outer-container {
    background-color: #f8f8f8;
}
</style>
