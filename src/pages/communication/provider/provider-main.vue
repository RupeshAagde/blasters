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
import CommunicationServices from '../../../services/pointblank.service';
import { mapGetters } from 'vuex';
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
            providerType: this.$route.params.providerType || 'sms',
            providerCategory: this.$route.query.type || '',
            providerId: this.$route.params.providerId,
            threeDotsOptions: []
        };
    },
    mounted() {
        this.pageLoading = false;
         //let promiseObj = Promise.resolve();
        if (
            this.isEditMode &&
            this.providerId &&
            this.providerType == 'email'
        ) {
            //promiseObj = 
            //this.fetchEmailProvider(this.providerId)
            //then(() => {
                //this.providerCategory = this.emailProviderStore.provider;
            //});
        } else if (
            this.isEditMode &&
            this.providerId &&
            this.providerType == 'sms'
        ) {
            //promiseObj =
            //this.fetchSmsProvider(this.providerId)
             //.then(() => {
                //this.providerCategory = this.smsProviderStore.provider;
            //});
        }
       // promiseObj.
    //    finally(() => {
             this.pageLoading = false;
    //     });
    },
    methods: {
        onTestProviderClick() {
            this.$refs.providermainbody.openTestProviderModal();
        },
        fetchEmailProvider(id) {
            this.pageLoading = true;
            CommunicationServices.getEmailProviderbyId(id)
        },
        fetchSmsProvider(id) {
            this.pageLoading = true;
        },
        backRedirect() {
            this.$router.back();
        },
        saveAndPublish() {
           //this.$refs.providermainbody.saveForm()
            let mainbodyValid = this.$refs.providermainbody.validate();
            if (mainbodyValid) {
                //this.$refs.providermainbody.validateAndSave();
                //if (this.providerType == 'email'){
                this.emailProviderStore = this.$refs.providermainbody.saveForm()
                //console.log( this.emailProviderStore);
                // }
                // if (this.providerType == 'sms'){
                // this.smsProviderStore = this.$refs.providermainbody.saveForm()
                // }
            }
            this.saveForm()

        },
        makeProviderDefault() {
            this.saveAndPublish();
        },
        saveForm() {
            // return Promise.resolve()
            //     .then(() => {
                    if (this.providerId) {
                        // this.pageLoading = true;
                        if (this.providerType == 'email') {
                             this.updateEmailProvider();
                        } else if (this.providerType == 'sms') {
                             this.updateSmsProvider();
                        }
                    } else {
                        if (this.providerType == 'email') {
                            console.log(this.emailProviderStore);
                             this.createEmailProvider(
                                this.emailProviderStore).then(data => {
                                this.$router.push({
                                    name: 'providerList'
                                });
                            })
                        } 
                      if (this.providerType == 'sms') {
                          console.log(this.smsProviderStore);
                             this.createSmsProvider(this.smsProviderStore).then(data => {
                                this.$router.push({
                                    name: 'providerList'
                                })
                            });
                         }
    }},
            //    })
            //     .then(data => {});

        createEmailProvider(data) {
            this.pageLoading = true;
                CommunicationServices.postEmailProvider(this.emailProviderStore)
                .then(data => {
                    this.$snackbar.global.showSuccess(
                        'Email provider created successfully'
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        createSmsProvider(data) {

            this.pageLoading = true;
            console.log(this.emailProviderStore);
            CommunicationServices.postSmsProvider(this.emailProviderStore)
                .then(data => {
                    this.$snackbar.global.showSuccess(
                        'SMS provider created successfully'
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        updateEmailProvider() {
            this.pageLoading = true;
                CommunicationServices.putEmailProviderbyId(this.providerId,this.emailProviderStore)
                .then(data => {
                    this.$snackbar.global.showSuccess(
                        'Email provider updated successfully'
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        updateSmsProvider() {
            this.pageLoading = true;
                CommunicationServices.putSmsProviderbyId(this.providerId,this.emailProviderStore)
                .then(data => {
                    this.$snackbar.global.showSuccess(
                        'SMS provider updated successfully'
                    );
                    return data;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        isFormDirty() {
            return this.false;
        }
    }
}

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
