<template>
    <div class="outer-container main" v-if="!pageLoading">
        <div class="page-header-position">
            <adm-page-header
                class="adm-page-header"
                :title="
                    isEditMode ? 'Edit Email Template' : 'Create Email Template'
                "
                @backClick="backRedirect"
                :contextMenuItems="threeDotsOptions"
                @cloneTemplate="cloneTemplate"
                @onOpenDeleteTemplateDialog="onOpenDeleteTemplateDialog"
            >
                <div class="header-button-container">
                    <nitrozen-button
                        v-strokeBtn
                        :theme="'secondary'"
                        @click.stop="sendTestEmail"
                        class="btn-wrapper no-padding"
                        >Test Email</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="!this.emailTemplateStore.is_system"
                        :theme="'secondary'"
                        v-flatBtn
                        @click.stop="saveClick"
                        class="btn-wrapper"
                        >{{ isEditMode ? 'Save' : 'Create' }}</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <div class="page-footer-buttons">
                        <nitrozen-button
                            v-strokeBtn
                            :theme="'secondary'"
                            @click.stop="sendTestEmail"
                            class="btn-wrapper no-padding"
                            >Test Email</nitrozen-button
                        >
                        <nitrozen-button
                            v-if="!this.emailTemplateStore.is_system"
                            :theme="'secondary'"
                            v-flatBtn
                            @click.stop="saveClick"
                            class="btn-wrapper"
                            >{{
                                isEditMode ? 'Save' : 'Create'
                            }}</nitrozen-button
                        >
                    </div>
                </template>
            </adm-page-header>
        </div>
        <nitrozen-dialog
            ref="confirm_delete_template_dialog"
            title="Confirm"
            @close="onCloseDeleteTemplateDialog"
        >
            <template slot="body" name="body"
                >If template is linked to any event, it will be reset to default
                template. Are you sure you want to delete this
                template?</template
            >
        </nitrozen-dialog>

        <div class="main-body" v-if="isDataLoaded">
            <div class="left-container">
                <emailtemplatemainbody
                    ref="emailtemplatemainbody"
                    :isEditMode="isEditMode"
                    :isCloneMode="isCloneMode"
                    :templateId="templateId"
                    :templateData="emailTemplateStore"
                ></emailtemplatemainbody>
            </div>
            <div class="right-container">
                <emailtemplatesidebar
                    @onLinkSubscription="onLinkSubscription"
                    ref="emailtemplatesidebar"
                    :isEditMode="isEditMode"
                    :isCloneMode="isCloneMode"
                    :templateId="templateId"
                    :templateData="emailTemplateStore"
                    @linkEventContinueClicked="saveAndPublish"
                ></emailtemplatesidebar>
            </div>
        </div>
    </div>
</template>

<script>
import emailtemplatemainbody from './email-template-main-body.vue';
import emailtemplatesidebar from './email-template-sidebar.vue';
import adminCommsService from '../../../services/pointblank.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import { mapGetters } from 'vuex';
// import {
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE
// } from '../../../../store/admin/mutation.type';
// import {
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE,
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE_TO_CLONE_BY_ID,
//     ADMIN_COMMS_UPDATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_CREATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_BULK_UPDATE_APP_EVENT_SUBSCRIPTION
// } from '../../../../store/admin/action.type';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import omitForClone from './services/omit-for-clone';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInline,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import admpageheader from '@/components/common/layout/page-header.vue';
import hash from 'object-hash';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
const THREE_DOT_OPTIONS = [
    {
        text: 'Clone',
        action: 'cloneTemplate'
    },
    {
        text: 'Delete',
        action: 'onOpenDeleteTemplateDialog'
    }
];

export default {
    name: 'edit-email-template',
    components: {
        emailtemplatemainbody,
        emailtemplatesidebar,
        uktinlinesvg,
        'nitrozen-button': NitrozenButton,
        'adm-page-header': admpageheader,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-menu-item': NitrozenMenuItem,
        'nitrozen-dialog': NitrozenDialog,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    computed: {
        // ...mapGetters({
        //     emailTemplateToClone: ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
        //     emailTemplateStore: ADMIN_COMMS_GET_EMAIL_TEMPLATE
        // })
    },
    data() {
        return {
            emailTemplate: {},
            pageLoading: false,
            pageError:false,
            isEditMode: !!this.$route.params.templateId,
            isCloneMode: false,
            templateId: this.$route.params.templateId,
            threeDotsOptions: THREE_DOT_OPTIONS,
            subscribedAdded: [],
            subscribedRemoved: [],
            emailTemplateToClone: {},
            emailTemplateStore: {},
            isDataLoaded:false

        };
    },
    mounted() {
        if(this.isEditMode && this.templateId){
            Promise.resolve(this.getTemplatedbyId())
        }else if (this.$route.query && this.$route.query.clone) {
            if (
                isEmpty(this.emailTemplateToClone) ||
                (this.emailTemplateToClone &&
                    this.emailTemplateToClone._id != this.$route.query.clone)
            ) {
                adminCommsService.getEmailTemplatebyId(this.$route.query.clone).then(res=>{
                    this.emailTemplateStore=res.data
                    this.emailTemplateStore.is_system=false;
                    delete this.emailTemplateStore._id;
                    this.isDataLoaded=true;
                })
            }
        }
        else{
            this.isDataLoaded=true;
        }

    //     Promise.resolve(promiseObj)
    //         .then(() => {
    //             this.id = this.$route.params.id;
    //             let pr = null;
    //             if (this.id) {
    //                 pr = this.$store.dispatch(
    //                     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE,
    //                     this.id
    //                 );
    //             } else {
    //                 pr = Promise.resolve(this.emailTemplateStore || {});
    //             }

    //             return pr;
    //         })
    //         .then(data => {
    //             this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {
    //                 data: data
    //             });
    //             if (!this.isEditMode) {
    //                 this.threeDotsOptions = [];
    //             }
    //             this.pageLoading = false;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             if (err.response.status == 404) {
    //                 this.$snackbar.global.showError(
    //                     'Failed to load Email Template'
    //                 );
    //                 this.$router.push(
    //                     `${getRoute(this.$route)}/email/templates/listing`
    //                 );
    //             }

    //             this.pageLoading = false;
    //             this.pageError = true;
    //         });
     },
    methods: {
        getTemplatedbyId(){
            adminCommsService.getEmailTemplatebyId(this.templateId).then((data)=>{
                this.emailTemplateStore = data.data
                this.isDataLoaded=true
            })
        },
        saveClick() {
            if (
                this.isCloneMode &&
                this.emailTemplateToClone &&
                this.emailTemplateToClone.is_system
            ) {
                this.$refs['emailtemplatesidebar'].openEventLinkingModal();
            } else {
                this.saveAndPublish();
            }
        },
        callAction(item) {
            this[item.action]();
        },
        cloneTemplate() {
            let emailTemplate = this.emailTemplateStore;
            let emailTemplateForClone = omitForClone(emailTemplate);
            this.isEditMode=false;
            this.$router.push({
                name: 'emailtemplateCreate',
                query: { clone: emailTemplate._id }
            });
            this.$forceUpdate();
        },
        onOpenDeleteTemplateDialog() {
            this.$refs['confirm_delete_template_dialog'].open({
                width: '400px',
                positiveButtonLabel: 'Delete',
                negativeButtonLabel: 'Cancel',
                neutralButtonLabel: false
            });
        },
        onCloseDeleteTemplateDialog(optionSelected) {
            if (optionSelected == 'Delete') {
                this.deleteTemplate();
            }
        },
        deleteTemplate() {
            let id = this.$route.params.templateId;
            adminCommsService
                .deleteEmailTemplateById(id)
                .then(response => {
                    this.$snackbar.global.showSuccess('Successfully Deleted');
                    this.$router.push(
                        `/administrator/communication/email/templates`
                    );
                })
                .catch(err => {
                    this.$snackbar.global.showError(
                        'Failed to delete template'
                    );
                });
        },
        onLinkSubscription(obj) {
            this.subscribedAdded = obj.subscribedAdded;
            this.subscribedRemoved = obj.subscribedRemoved;
        },
        sendTestEmail() {
            let sidebarValid = this.$refs.emailtemplatesidebar.validate();
            let mainbodyValid = this.$refs.emailtemplatemainbody.validate();
            if (sidebarValid && mainbodyValid) {
                let sidebarData = this.$refs.emailtemplatesidebar.validateAndSave();
                let mainBodyData = this.$refs.emailtemplatemainbody.validateAndSave();
                this.emailTemplateStore = {...sidebarData, ...mainBodyData};
                this.$refs.emailtemplatemainbody.emailTemplateStore = this.emailTemplateStore;
                this.$refs.emailtemplatemainbody.openSendTestEmailModal();
            }
        },
        saveAndPublish() {
            let sidebarValid = this.$refs.emailtemplatesidebar.validate();
            let mainbodyValid = this.$refs.emailtemplatemainbody.validate();
            if (sidebarValid && mainbodyValid) {
                let sidebarData = this.$refs.emailtemplatesidebar.validateAndSave();
                let mainBodyData = this.$refs.emailtemplatemainbody.validateAndSave();
                this.emailTemplateStore = {...sidebarData, ...mainBodyData};
                this.saveForm();
            }
        },
        createTemplate(template){
            return adminCommsService.postEmailTemplate(template)
        },
        updateTemplate(id,template){
            return adminCommsService.putEmailTemplate(id,template)
        },

        saveForm() {
            let promise = this.templateId ? this.updateTemplate(this.templateId, this.emailTemplateStore):this.createTemplate(this.emailTemplateStore)
            
                    promise.then(response => {
                        this.pageLoading = false;
                        // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE, {
                        //     data: response
                        // });
                        this.$router.push({ name: 'emailtemplateMain' })
                            this.$snackbar.global.showSuccess(
                                'Email template has been published!'
                            );
                        
                        return response.data;
                    })
                    .then((addedTemplate) => {
                        if (
                            this.subscribedAdded.length +
                                this.subscribedRemoved.length >
                            0
                        ) {
                            let subscribedAdded = this.subscribedAdded.map(
                                appSubscription => {
                                    let template = cloneDeep(
                                        appSubscription.template
                                    );
                                    template.email.template = addedTemplate._id;
                                    return {
                                        _id: appSubscription._id,
                                        template
                                    };
                                }
                            );
                            let subscribedRemoved = this.subscribedRemoved.map(
                                appSubscription => {
                                    let template = cloneDeep(
                                        appSubscription.template
                                    );
                                    template.email.template =
                                        appSubscription.event.template.email.template;
                                    return {
                                        _id: appSubscription._id,
                                        template
                                    };
                                }
                            );
                            // this.$store.dispatch(
                            //     ADMIN_COMMS_BULK_UPDATE_APP_EVENT_SUBSCRIPTION,
                            //     {
                            //         subscriptions: [
                            //             ...subscribedAdded,
                            //             ...subscribedRemoved
                            //         ]
                            //     }
                            // );
                            adminCommsService.postBulkUpdate({
                                    subscriptions: [
                                        ...subscribedAdded,
                                        ...subscribedRemoved
                                    ]
                                })
                        }
                    })
                    
                    .catch(err => {
                        console.log(err);
                        this.$snackbar.global.showError('Something went wrong');
                        this.pageError = true;
                        this.pageLoading = false;
                    });
            // if (this.templateId) {
            //     this.pageLoading = true;
            //     return this.$store
            //         .dispatch(ADMIN_COMMS_UPDATE_EMAIL_TEMPLATE_FORM, {
            //             _id: this.templateId,
            //             body: this.emailTemplateStore
            //         })
            //         .then(response => {
            //             this.pageLoading = false;
            //             //if (!isEmpty(this.emailTemplateToClone)) {
            //             //  }
            //             this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {
            //                 data: response
            //             });
            //             if (response.published) {
            //                 this.$router.push(
            //                     `${getRoute(
            //                         this.$route
            //                     )}/email/templates/listing`
            //                 );
            //                 this.$snackbar.global.showSuccess(
            //                     'Email template has been published!'
            //                 );
            //             }
            //             return;
            //         })
            //         .then(() => {
            //             if (
            //                 this.subscribedAdded.length +
            //                     this.subscribedRemoved.length >
            //                 0
            //             ) {
            //                 console.log(
            //                     'Email template store',
            //                     this.emailTemplateStore
            //                 );
            //                 let subscribedAdded = this.subscribedAdded.map(
            //                     appSubscription => {
            //                         let template = cloneDeep(
            //                             appSubscription.template
            //                         );
            //                         template.email.template = this.emailTemplateStore._id;
            //                         return {
            //                             _id: appSubscription._id,
            //                             template
            //                         };
            //                     }
            //                 );
            //                 let subscribedRemoved = this.subscribedRemoved.map(
            //                     appSubscription => {
            //                         let template = cloneDeep(
            //                             appSubscription.template
            //                         );
            //                         template.email.template =
            //                             appSubscription.event.template.email.template;
            //                         return {
            //                             _id: appSubscription._id,
            //                             template
            //                         };
            //                     }
            //                 );
            //                 let subscriptions = [
            //                     ...subscribedAdded,
            //                     ...subscribedRemoved
            //                 ];
            //                 if (subscriptions.length > 0) {
            //                     this.$store.dispatch(
            //                         ADMIN_COMMS_BULK_UPDATE_APP_EVENT_SUBSCRIPTION,
            //                         {
            //                             subscriptions: subscriptions
            //                         }
            //                     );
            //                 }
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             this.$snackbar.global.showError('Something went wrong');
            //             this.pageError = true;
            //         });
            // } else {
            //     this.pageLoading = true;
            //     return this.$store
            //         .dispatch(ADMIN_COMMS_CREATE_EMAIL_TEMPLATE_FORM, {
            //             body: this.emailTemplateStore
            //         })
            //         .then(response => {
            //             this.pageLoading = false;
            //             this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {
            //                 data: response
            //             });
            //             if (response.published) {
            //                 this.$router.push(
            //                     `${getRoute(
            //                         this.$route
            //                     )}/email/templates/listing`
            //                 );

            //                 this.$snackbar.global.showSuccess(
            //                     'Email template has been published!'
            //                 );
            //             }
            //             return;
            //         })
            //         .then(() => {
            //             if (
            //                 this.subscribedAdded.length +
            //                     this.subscribedRemoved.length >
            //                 0
            //             ) {
            //                 let subscribedAdded = this.subscribedAdded.map(
            //                     appSubscription => {
            //                         let template = cloneDeep(
            //                             appSubscription.template
            //                         );
            //                         template.email.template = this.emailTemplateStore._id;
            //                         return {
            //                             _id: appSubscription._id,
            //                             template
            //                         };
            //                     }
            //                 );
            //                 let subscribedRemoved = this.subscribedRemoved.map(
            //                     appSubscription => {
            //                         let template = cloneDeep(
            //                             appSubscription.template
            //                         );
            //                         template.email.template =
            //                             appSubscription.event.template.email.template;
            //                         return {
            //                             _id: appSubscription._id,
            //                             template
            //                         };
            //                     }
            //                 );
            //                 let subscriptions = [
            //                     ...subscribedAdded,
            //                     ...subscribedRemoved
            //                 ];
            //                 if (subscriptions.length > 0) {
            //                     this.$store.dispatch(
            //                         ADMIN_COMMS_BULK_UPDATE_APP_EVENT_SUBSCRIPTION,
            //                         {
            //                             subscriptions: subscriptions
            //                         }
            //                     );
            //                 }
            //             }
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             this.pageError = true;
            //             this.pageLoading = false;
            //         });
            // }
        },
        isFormUpdated() {
            if (
                this.$refs.emailtemplatemainbody &&
                this.$refs.emailtemplatesidebar
            ) {
                return (
                    this.$refs.emailtemplatemainbody.isFormUpdated() ||
                    this.$refs.emailtemplatesidebar.isFormUpdated()
                );
            } else {
                return false;
            }
        },
        backRedirect() {
            this.$router.back();
            // this.$router.push(`${getRoute(this.$route)}/email/templates/listing`);
        },
        isFormDirty() {
            return this.isFormUpdated();
        }
    }
};
</script>

<style lang="less" scoped>
// /deep/.nitrozen-dialog {
//     /deep/.n-button-content {
//         color: @PrimaryColor;
//     }
// }
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
    .main-body {
        display: flex;
        margin: 24px;
        @media @mobile {
            margin: 0;
            display: block;
        }
        .left-container {
            width: calc(100% - 300px);
            @media @mobile {
                width: 100%;
            }
        }
        .right-container {
            width: 300px;
            @media @mobile {
                width: 100%;
            }
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
    background-color: @Alabaster2;
}
.page-footer-buttons {
    width: calc(100% - 36px);
    display: flex;
    justify-content: space-between;
}
</style>
