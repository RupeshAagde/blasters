<template>
    <div class="panel">
        <div class="main">
            <loader v-if="pageLoading" class="loading"></loader>
            <div class="form page-container" v-if="!pageLoading">
                <div
                    class="form-container width-50"
                    v-if="
                        providerType == 'email' &&
                            providerCategory == 'falconide'
                    "
                >
                    <email-falconide
                        ref="email-falconide"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></email-falconide>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerCategory == 'pepipost'"
                >
                    <email-pepipost
                        ref="email-pepipost"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></email-pepipost>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerCategory == 'smtp'"
                >
                    <email-smtp
                        ref="email-smtp"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></email-smtp>
                </div>

                <div
                    class="form-container width-50"
                    v-if="
                        providerType == 'sms' && providerCategory == 'netcore'
                    "
                >
                    <sms-netcore
                        ref="sms-netcore"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></sms-netcore>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerType == 'sms' && providerCategory == 'smpp'"
                >
                    <sms-smpp
                        ref="sms-smpp"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></sms-smpp>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerType == 'sms' && providerCategory == 'telspiel'"
                >
                    <sms-telspiel
                        ref="sms-telspiel"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></sms-telspiel>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerType == 'sms' && providerCategory == 'vivaconnect'"
                >
                    <sms-vivaconnect
                        ref="sms-vivaconnect"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></sms-vivaconnect>
                </div>
                <div
                    class="form-container width-50"
                    v-if="providerType == 'sms' && providerCategory == 'timesinternet'"
                >
                    <sms-timesinternet
                        ref="sms-timesinternet"
                        :isEditMode="isEditMode"
                        :isCreateMode="isCreateMode"
                        :id="providerId"
                    ></sms-timesinternet>
                </div>
            </div>
            <div v-if="!pageLoading">
                <email-send-test-modal
                    :showSendTestEmailModal="
                        emailTestModal.showSendTestEmailModal
                    "
                    :to="emailTestModal.to"
                    :provider="providerId"
                    @closeModal="closeSendTestProviderModal"
                >
                    <!-- <template slot="button-bar">
                        <nitrozen-button
                            v-strokeBtn
                            :theme="'secondary'"
                            @click="onModalUseAsDefaultClick"
                            class="btn-wrapper no-padding"
                            >Test Provider</nitrozen-button
                        >
                    </template> -->
                </email-send-test-modal>
                <sms-send-test-modal
                    :showSendTestSmsModal="smsTestModal.showSendTestSmsModal"
                    :phone_number="smsTestModal.phone_number"
                    :country_code="smsTestModal.country_code"
                    :provider="providerId"
                    @closeModal="closeSendTestProviderModal"
                >
                    <template slot="button-bar">
                        <nitrozen-button
                            :theme="'secondary'"
                            @click="onModalUseAsDefaultClick"
                            class="btn-wrapper float-left"
                            >Use as default</nitrozen-button
                        >
                    </template>
                </sms-send-test-modal>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.float-left {
    float: left;
}
.dashboard-block {
    margin: 0px 24px 0 0;
    flex-basis: 200px;
    height: 110px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
}
.dashboard-card-header {
    height: 50%;
    border-bottom: 1px solid #e1e1e1;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    color: @Mako;
}
.dashboard-card-body {
    height: 50%;
    border-top: 1px solid #e1e1e1;
    font-size: 22px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-weight: bold;
    color: @Mako;
}
.panel {
    min-height: 100%;
}
.main {
    min-height: 100%;
}
.danger {
    color: #fa3f4d;
}
.type-link {
    font-size: 12px;
    font-weight: 100;
    color: #2E31BE;
    cursor: pointer;
}

.full-height {
    height: 100%;
}
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .flex-50 {
        flex-basis: calc(50% - 12px);
        @media @mobile {
            width: calc(100% - 24px);
        }
    }
    .flex-1 {
        flex: 1;
    }
    .flex-2 {
        flex: 2;
    }
    .flex-3 {
        flex: 3;
    }
}
.align-base {
    align-items: baseline;
}
.page-container {
    background: @Alabaster2;
    padding: 0px;
    .form-container {
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 4px;
        background-color: @White;
        .width-50 {
            width: 50%;
            @media @mobile {
                width: 100%;
            }
        }
        .details {
            color: @Mako;
            font-weight: bold;
            font-size: 18px;
            line-height: 27px;
            text-align: left;
            margin-bottom: 24px;
        }
        .audience-dropdown {
            /deep/.nitrozen-select.disabled .nitrozen-select__trigger {
                background-color: #f9f9f9;
                cursor: default;
            }
        }
        .analytics-container {
            display: flex;
        }
        .schedule-text {
            font-size: 12px;
            color: #9e9e9e;
            margin-top: 12px;
        }
    }
    .form-field {
        margin-bottom: 24px;
    }

    .template-variables-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
    }
    .btn-margin {
        margin: 0px 10px;
    }
}

.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
</style>

<script>
import Vue from 'vue';
import loader from '@/components/common/loader';

// import {} from '../../../../store/admin/action.type';
// import { GET_USER_INFO } from '../../../../store/getters.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_PROVIDER,
//     ADMIN_COMMS_GET_SMS_PROVIDER
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_PROVIDER,
//     ADMIN_COMMS_SET_SMS_PROVIDER
// } from '../../../../store/admin/mutation.type';
import emailSendTestModal from './common/email-send-test-modal.vue';
import smsSendTestModal from './common/sms-send-test-modal.vue';
import uktinlinesvg from '@/components/common/ukt-inline-svg';
import nunjucks from 'nunjucks';
import root from 'window-or-global';
import emailFalconide from './email/falconide.vue';
 import emailPepipost from './email/pepipost.vue';
import emailSmtp from './email/smtp.vue';
import smsNetcore from './sms/netcore.vue';
import smsSMPP from './sms/smpp.vue';
import smsTelspiel from './sms/telspiel.vue'
import smsVivaconnect from './sms/vivaconnect.vue'
import smsTimesInternet from './sms/timesinternet.vue'
const config = root.config || {};
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import admforminput from '@/components/common/form-input.vue';
import hash from 'object-hash';
// import * as _ from 'lodash';
import datePicker from '@/components/common/date-picker.vue';
export default {
    components: {
        loader: loader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'ukt-inline-svg': uktinlinesvg,
        'adm-form-input': admforminput,
        'adm-date-picker': datePicker,
        'email-falconide': emailFalconide,
        'email-pepipost': emailPepipost,
        'email-smtp': emailSmtp,
        'sms-netcore': smsNetcore,
        'sms-smpp': smsSMPP,
        'sms-telspiel':smsTelspiel,
        'sms-vivaconnect':smsVivaconnect,
        'sms-timesinternet':smsTimesInternet,
        'email-send-test-modal': emailSendTestModal,
        'sms-send-test-modal': smsSendTestModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        isCloneMode: {
            type: Boolean,
            default: false
        },
        isCreateMode: {
            type: Boolean,
            default: false
        },
        providerId: {
            type: String,
            default: ''
        },
        providerType: {
            type: String,
            default: ''
        },
        providerCategory: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageLoading: true,
            initialHash: '',
            emailTestModal: {
                showSendTestEmailModal: false,
                to: ''
            },
            smsTestModal: {
                showSendTestSmsModal: false,
                phone_number: '',
                country_code: ''
            },
            pagination: {
                limit: 10,
                current: 1,
                total: 0
            }
        };
    },
    computed: {
        getBreadCrumb() {
            return [];
        },
        ALIGN() {
            return ALIGN;
        },
    },
    mounted() {
        // if (this.providerType == 'email') {
        //     let email = this.getPrimaryVerifiedActiveEmail();
        //     if (email) {
        //         this.emailTestModal.to = email;
        //     }
        // }
        // if (this.providerType == 'sms') {
        //     let phone = this.getPrimaryVerifiedActivePhoneNumber();
        //     if (phone) {
        //         this.smsTestModal.country_code = String(phone.countryCode);
        //         this.smsTestModal.phone_number = String(phone.phone);
        //     }
        // }
        this.pageLoading = false;
    },
    methods: {
        onModalUseAsDefaultClick() {
            let component = this.$refs[
                this.providerType + '-' + this.providerCategory
            ];
            this.$router.replace({
                name: 'provider-default'
            });
            // if (component) {
            //     component.makeDefault();
            //     this.$emit('makeProviderDefault');
            // }
        },
        getPrimaryVerifiedActivePhoneNumber() {
            if(!this.userData || !this.userData.user || !this.userData.user.phone_numbers){
                return {}
            }
            return this.userData.user.phone_numbers
                .filter(a => a.active && a.primary && a.verified)
                .reduce((result, current, index) => {
                    if (index == 0) {
                        result.phone = current.phone;
                        result.countryCode = current.countryCode;
                    }
                    return result;
                }, {});
        },
        getPrimaryVerifiedActiveEmail() {
            if(!this.userData || !this.userData.user || !this.userData.user.emails){
                return ''
            }
            return this.userData.user.emails
                .filter(a => a.active && a.primary && a.verified)
                .reduce((result, current, index) => {
                    if (index == 0) {
                        result = current.email;
                    }
                    return result;
                }, '');
        },
        closeSendTestProviderModal() {
            if (this.providerType == 'email') {
                this.emailTestModal.showSendTestEmailModal = false;
            } else if (this.providerType == 'sms') {
                this.smsTestModal.showSendTestSmsModal = false;
            }
        },
        openTestProviderModal() {
            if (this.providerType == 'email') {
                this.emailTestModal.showSendTestEmailModal = true;
            } else if (this.providerType == 'sms') {
                this.smsTestModal.showSendTestSmsModal = true;
            }
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        validate() {
            let component = this.$refs[
                this.providerType + '-' + this.providerCategory
            ];
            if (component) {
                return component.validate();
            }
            return false;
        },
        saveForm() {
            let component = this.$refs[
                this.providerType + '-' + this.providerCategory
            ];
            if (component) {
                let data = component.validateAndSaveForm();
                return data;
            }
        },
        validateAndSave() {
            if (this.validate()) {
                console.log('vs');
                this.saveForm();
            }
        }
    }
};
</script>
