<template>
    <div class="outer-container main" v-if="!pageLoading">
        <div class="page-header-position">
            <adm-page-header
                :title="
                    isEditMode ? 'Edit SMS Template' : 'Create SMS Template'
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
                        @click.stop="sendTestSms"
                        class="btn-wrapper"
                        >Test SMS</nitrozen-button
                    >
                    <nitrozen-button
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
                            @click.stop="sendTestSms"
                            class="btn-wrapper"
                            >Test SMS</nitrozen-button
                        >
                        <nitrozen-button
                            v-if="!this.smsTemplateStore.is_system"
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
        <div class="main-body" v-if=" isCreateMode || (isEditMode  && smsTemplateStore.slug ) || (isCloneMode && smsTemplateStore.name) ">
            <div class="left-container">
                <smstemplate_variables
                    ref="smstemplate_variables"
                    :systemDisableEdit="
                        isEditMode && this.smsTemplateStore.is_system
                    "
                    :isEditMode="isEditMode"
                    :isCloneMode="isCloneMode"
                    :templateId="templateId"
                    :templateData="smsTemplateStore"
                ></smstemplate_variables>
            </div>
            <div class="right-container">
                <smstemplateedit
                    :systemDisableEdit="
                        isEditMode && this.smsTemplateStore.is_system
                    "
                    :isEditMode="isEditMode"
                    :isCloneMode="isCloneMode"
                    :templateId="templateId"
                    :templateData="smsTemplateStore"
                    ref="smsTemplateEdit"
                    @onLinkSubscription="onLinkSubscription"
                    @linkEventContinueClicked="saveAndPublish"
                ></smstemplateedit>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import omitForClone from './services/omit-for-clone';
import smstemplateedit from './sms-template-edit.vue';
import smstemplate_variables from './sms-template-variables.vue';
// import {
//     ADMIN_COMMS_FETCH_SMS_TEMPLATE,
//     ADMIN_COMMS_FETCH_SMS_TEMPLATE_TO_CLONE_BY_ID,
//     ADMIN_COMMS_BULK_UPDATE_APP_EVENT_SUBSCRIPTION,
//     ADMIN_COMMS_UPDATE_SMS_TEMPLATE_FORM,
//     ADMIN_COMMS_CREATE_SMS_TEMPLATE_FORM
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_SMS_TEMPLATE,
//     ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_SET_SMS_TEMPLATE
// } from '../../../../store/admin/mutation.type';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import admpageheader from '@/components/common/layout/page-header';
//import adminCommsService from './../../../../services/admin/admin-comms.service';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog,
    NitrozenInline,
    NitrozenMenu,
    NitrozenMenuItem
} from '@gofynd/nitrozen-vue';
//import { getRoute } from '@/helper/get-route';

// import * as _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import CommunicationServices from '../../../services/pointblank.service';

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
    name: 'sms-template-form',
    components: {
        smstemplateedit,
        smstemplate_variables,
        uktinlinesvg,
        'adm-page-header': admpageheader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-menu-item': NitrozenMenuItem
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    watch: {
        // $route(to, from) {
        //     this.isEditMode = this.$route.meta.action === 'edit';
        //     this.isCloneMode =
        //         this.$route.meta.action == 'create' &&
        //         this.$route.query.hasOwnProperty('clone');
        // }
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            pageLoading: false,
            isEditMode:  !!this.$route.params.templateId,
            isCloneMode: !!this.$route.query.clone,
            templateId: this.$route.params.templateId,
            threeDotsOptions: THREE_DOT_OPTIONS,
            subscribedAdded: [],
            subscribedRemoved: [],
            smsTemplateStore: {},
            isCreateMode: false

        };
    },
    computed: {
        
    },
    mounted() {
        //console.log(this.$route);
        if(!this.isEditMode && !this.isCloneMode){
            this.isCreateMode = true;
        }
        if(this.templateId){
         this.getTemplatedbyId()
        }
        let promiseObj = null;
        if (this.$route.query && this.$route.query.clone) {
            // if (
            //     isEmpty(this.smsTemplateToClone) ||
            //     (this.smsTemplateToClone &&
            //         this.smsTemplateToClone._id != this.$route.query.clone)
            // ) {
                // promiseObj = this.$store
                //     .dispatch(
                //         ADMIN_COMMS_FETCH_SMS_TEMPLATE_TO_CLONE_BY_ID,
                //         this.$route.query.clone
                //     )
                    CommunicationServices.getSmsTemplatebyId(this.$route.query.clone)
                    .then(data => {
                        //let smsTemplate = omitForClone(data);
                        // this.$store.commit(
                        //     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE,
                        //     {
                        //         data: smsTemplate
                        //     }
                        // );
                        console.log(data);
                        this.smsTemplateStore = data.data
                        this.isCloneMode = true;
                    });
            //}
        }
        

        // Promise.resolve(promiseObj)
        //     .then(() => {
        //         let pr = null;
        //         this.id = this.$route.params.id;
        //         if (this.id) {
        //             pr = this.$store.dispatch(
        //                 ADMIN_COMMS_FETCH_SMS_TEMPLATE,
        //                 this.id
        //             );
        //         } else {
        //             pr = Promise.resolve(this.smsTemplateStore || {});
        //         }
        //         return pr;
        //     })
        //     .then(data => {
        //         if (!this.isEditMode) {
        //             this.threeDotsOptions = [];
        //         }
        //         this.pageLoading = false;
        //     })
        //     .catch(err => {
        //         if (err && err.response && err.response.status == 404) {
        //             this.$snackbar.global.showError(
        //                 'Failed to load Sms Template'
        //             );
        //             this.$router.push(
        //                 `${getRoute(this.$route)}/sms/templates/listing`
        //             );
        //         }
        //         this.pageLoading = false;
        //         console.log(err);
        //     });
    },
    methods: {
        getTemplatedbyId(){
        CommunicationServices.getSmsTemplatebyId(this.templateId).then((data)=>{
        this.smsTemplateStore = data.data
        })
        },
        saveForm() {
            if (this.templateId) {
                this.pageLoading = true;
                    CommunicationServices.putSmsTemplate(this.templateId,this.smsTemplateStore)
                    .then(response => {
                        this.pageLoading = false;
                        // if (!isEmpty(this.smsTemplateToClone)) {
                        // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE, {
                        //     data: response
                        // });
                        // }
                        this.smsTemplateStore = response.data
                        this.$router.push({ name: 'smstemplateMain' })
                            this.$snackbar.global.showSuccess(
                                'SMS template has been published!'
                            );
                        
                    })
                    .then(() => {
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
                                    template.sms.template = this.smsTemplateStore._id;
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
                                    template.sms.template =
                                        appSubscription.event.template.sms.template;
                                    return {
                                        _id: appSubscription._id,
                                        template
                                    };
                                }
                            );
                            CommunicationServices.postBulkUpdate({
                                    subscriptions: [
                                        ...subscribedAdded,
                                        ...subscribedRemoved
                                    ]
                                }
                            );
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.pageError = true;
                    });
             } else {
                this.pageLoading = true;
                //return this.$store
                    // .dispatch(ADMIN_COMMS_CREATE_SMS_TEMPLATE_FORM, {
                    //     body: this.smsTemplateStore
                    // })
                    CommunicationServices.postSmsTemplate(this.smsTemplateStore)
                    .then(response => {
                        this.pageLoading = false;
                        // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE, {
                        //     data: response
                        // });
                         this.smsTemplateStore = response.data 
                        this.$router.push({ name: 'smstemplateMain' })
                            this.$snackbar.global.showSuccess(
                                'SMS template has been published!'
                            );
                        
                        //return;
                    })
                    .then(() => {
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
                                    template.sms.template = this.smsTemplateStore._id;
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
                                    template.sms.template =
                                        appSubscription.event.template.sms.template;
                                    return {
                                        _id: appSubscription._id,
                                        template
                                    };
                                }
                            );
                            CommunicationServices.postBulkUpdate({
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
             }
        },
        callAction(item) {
            this[item.action]();
        },
        cloneTemplate() {
            let smsTemplate = this.smsTemplateStore;
            let smsTemplateToClone = omitForClone(smsTemplate);
           
            this.$router.replace({
                name: 'smstemplateCreate',
                query: { clone: smsTemplate._id }
            })
            //.catch(()=>{})
            //this.$forceUpdate();
        },
        onOpenHelp() {},
        onLinkSubscription(obj) {
            this.subscribedAdded = obj.subscribedAdded;
            this.subscribedRemoved = obj.subscribedRemoved;
            console.log("susbcription",obj);
        },
        deleteTemplate() {
            // let id = this.$route.params.id;
            CommunicationServices
                .deleteSmsTemplatebyId(this.templateId)
                .then(response => {
                    this.$snackbar.global.showSuccess('Successfully Deleted');
                    this.$router.push({ name : 'smstemplateMain'})
                })
                .catch(err => {
                    console.log('Error', err);
                    this.$snackbar.global.showError(
                        'Failed to delete template'
                    );
                });
        },
        sendTestSms() {
            if (this.$refs['smsTemplateEdit'].validate()) {
                this.$refs['smsTemplateEdit'].saveForm();
                this.$refs['smstemplate_variables'].openSendTestSmsModal();
            }
        },
        saveClick() {
            if (
                this.isCloneMode &&
                this.smsTemplateToClone &&
                this.smsTemplateToClone.is_system
            ) {
                this.$refs['smsTemplateEdit'].openEventLinkingModal();
            } else {
                this.saveAndPublish();
            }
        },
        saveAndPublish() {
            if (
                this.isCloneMode &&
                this.smsTemplateToClone &&
                this.smsTemplateToClone.is_system
            ) {
                this.$refs['smsTemplateEdit'].closeEventLinkingModal();
            }
            console.log();
            if (
                this.$refs['smsTemplateEdit'].validate() &&
                this.$refs['smstemplate_variables'].validate()
            ) {
               let ob1 = this.$refs['smsTemplateEdit'].saveForm();
                let ob2 = this.$refs['smstemplate_variables'].saveForm();
                console.log(ob2);
                this.smsTemplateStore = {...ob1, ...ob2}
                //console.log(this.smsTemplateStore);
                this.saveForm();
            }
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
        isFormUpdated() {
            if (this.$refs.smsTemplateEdit && this.$refs.smstemplate_variables) {
                return (
                    this.$refs.smsTemplateEdit.isFormUpdated() ||
                    this.$refs.smstemplate_variables.isFormUpdated()
                );
            } else {
                return false;
            }
        },
        backRedirect() {
            this.$router.back();
            // this.$router.push(`${getRoute(this.$route)}/sms/templates/listing`);
        },
        isFormDirty() {
            return this.isFormUpdated();
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.nitrozen-dialog {
    /deep/.n-button-content {
        color: @PrimaryColor;
    }
}
.main {
    /deep/.page-header-position {
        margin: 0;
        height: 60px;
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
    }
    .hidden {
        visibility: hidden;
    }
    .active-tab {
        color: @Black;
    }
    .main-body {
        display: flex;
        @media @mobile {
            margin: 0 0 48px 0;
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
.outer-container {
    background-color: @Alabaster2;
}
.page-footer-buttons {
    width: calc(100% - 36px);
    display: flex;
    justify-content: space-between;
}
</style>
