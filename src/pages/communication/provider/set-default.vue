<template>
    <div class="panel">
        <loader v-if="pageLoading" class="loading"></loader>
        <div class="outer-container main" v-if="!pageLoading || isInitialLoad">
            <div class="page-header-position">
                <adm-page-header
                    :title="'Set default provider'"
                    @backClick="backRedirect"
                    :contextMenuItems="threeDotsOptions"
                >
                    <div class="header-button-container">
                        <nitrozen-button
                            :theme="'secondary'"
                            v-flatBtn
                            @click="validateAndSave"
                            class="btn-wrapper"
                            >Save</nitrozen-button
                        >
                    </div>
                    <template slot="page-slot-mobile-footer">
                        <nitrozen-button
                            :theme="'secondary'"
                            v-flatBtn
                            @click="validateAndSave"
                            class="footer-actions"
                            >Save</nitrozen-button
                        >
                    </template>
                </adm-page-header>
            </div>
            <div class="main-body">
                <div class="container">
                    <div class="title">Email</div>
                    <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'Transaction'"
                                    placeholder="Choose transaction email provider"
                                    v-model="
                                        appProvider.email.transaction.provider
                                            .value
                                    "
                                    :items="emailProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'email',
                                            appProvider.email.transaction
                                                .provider.value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'email',
                                            appProvider.email.transaction
                                                .provider.value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="
                                appProvider.email.transaction.provider.showerror
                            "
                            >{{
                                appProvider.email.transaction.provider.errortext
                            }}
                        </nitrozen-error>
                    </div>
                    <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'OTP'"
                                    placeholder="Choose OTP email provider"
                                    v-model="
                                        appProvider.email.otp.provider.value
                                    "
                                    :items="emailProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'email',
                                            appProvider.email.otp.provider.value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'email',
                                            appProvider.email.otp.provider.value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="appProvider.email.otp.provider.showerror"
                            >{{ appProvider.email.otp.provider.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'Promotional'"
                                    placeholder="Choose promotional email provider"
                                    v-model="
                                        appProvider.email.promotional.provider
                                            .value
                                    "
                                    :items="emailProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'email',
                                            appProvider.email.promotional
                                                .provider.value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'email',
                                            appProvider.email.promotional
                                                .provider.value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="
                                appProvider.email.promotional.provider.showerror
                            "
                            >{{
                                appProvider.email.promotional.provider.errortext
                            }}
                        </nitrozen-error>
                    </div> -->
                </div>
                <div class="container">
                    <div class="title">SMS</div>
                    <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'Transaction'"
                                    placeholder="Choose transaction SMS provider"
                                    v-model="
                                        appProvider.sms.transaction.provider
                                            .value
                                    "
                                    :items="smsProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'sms',
                                            appProvider.sms.transaction.provider
                                                .value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'sms',
                                            appProvider.sms.transaction.provider
                                                .value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="
                                appProvider.sms.transaction.provider.showerror
                            "
                            >{{
                                appProvider.sms.transaction.provider.errortext
                            }}
                        </nitrozen-error>
                    </div>

                    <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'OTP'"
                                    placeholder="Choose OTP SMS provider"
                                    v-model="appProvider.sms.otp.provider.value"
                                    :items="smsProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'sms',
                                            appProvider.sms.otp.provider.value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'sms',
                                            appProvider.sms.otp.provider.value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="appProvider.sms.otp.provider.showerror"
                            >{{ appProvider.sms.otp.provider.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- <div class="form-field">
                        <div class="flex flex-end">
                            <div class="flex-3 m-r-24">
                                <nitrozen-dropdown
                                    :label="'Promotional'"
                                    placeholder="Choose promotional SMS provider"
                                    v-model="
                                        appProvider.sms.promotional.provider
                                            .value
                                    "
                                    :items="smsProviders"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="flex-1">
                                <nitrozen-button
                                    :class="{
                                        hidden: isProviderGlobal(
                                            'sms',
                                            appProvider.sms.promotional.provider
                                                .value
                                        )
                                    }"
                                    :theme="'secondary'"
                                    @click.stop="
                                        testProvider(
                                            'sms',
                                            appProvider.sms.promotional.provider
                                                .value
                                        )
                                    "
                                    class="btn-wrapper"
                                    >Test Provider</nitrozen-button
                                >
                            </div>
                        </div>
                        <nitrozen-error
                            v-if="
                                appProvider.sms.promotional.provider.showerror
                            "
                            >{{
                                appProvider.sms.promotional.provider.errortext
                            }}
                        </nitrozen-error>
                    </div> -->
                </div>
                <div v-if="!pageLoading">
                    <email-send-test-modal
                        :showSendTestEmailModal="
                            emailTestModal.showSendTestEmailModal
                        "
                        :showEditProvider="true"
                        :to="emailTestModal.to"
                        :provider="testProviderId"
                        @closeModal="closeSendTestProviderModal"
                    >
                    </email-send-test-modal>
                    <sms-send-test-modal
                        :showSendTestSmsModal="
                            smsTestModal.showSendTestSmsModal
                        "
                        :showEditProvider="true"
                        :phone_number="smsTestModal.phone_number"
                        :country_code="smsTestModal.country_code"
                        :provider="testProviderId"
                        @closeModal="closeSendTestProviderModal"
                    >
                    </sms-send-test-modal>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loader from '@/components/common/loader';
import providermainbody from './provider-main-body.vue';
import { GET_USER_INFO } from '../../../store/getters.type';

//import adminCommsService from './../../../../services/admin/admin-comms.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import { mapGetters } from 'vuex';
import CommunicationServices from '../../../services/pointblank.service';
import emailSendTestModal from './common/email-send-test-modal.vue';
import smsSendTestModal from './common/sms-send-test-modal.vue';
import { titleCase } from '@/helper/utils';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInline,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import PageHeader from '@/components/common/layout/page-header';
import hash from 'object-hash';
import path from 'path';
// import * as _ from 'lodash';
import get from 'lodash/get';
import set from 'lodash/set';
export default {
    name: 'provider-default',
    components: {
        providermainbody,
        uktinlinesvg,
        loader,
        'nitrozen-button': NitrozenButton,
        'adm-page-header': PageHeader,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-menu-item': NitrozenMenuItem,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-dropdown': NitrozenDropdown,
        'email-send-test-modal': emailSendTestModal,
        'sms-send-test-modal': smsSendTestModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    
    computed: {
        ...mapGetters({
            userData: GET_USER_INFO,
        }),
        emailProviders() {
            if (!(this.emailProvidersStore && this.emailProvidersStore.items)) {
                return [];
            }
            let emailProviders = this.emailProvidersStore.items.map(
                provider => ({
                    text: titleCase(provider.provider) + ' - ' + provider.name,
                    value: provider._id
                })
            );
            if (this.globalProviders && this.globalProviders.email) {
                let global = {
                    text: this.globalProviders.email.name,
                    value: this.globalProviders.email._id
                };
                emailProviders = [global, ...emailProviders];
            }
            return emailProviders;
        },
        smsProviders() {
            if (!(this.smsProvidersStore && this.smsProvidersStore.items)) {
                return [];
            }
            let smsProviders = this.smsProvidersStore.items.map(provider => ({
                text: titleCase(provider.provider) + ' ' + provider.name,
                value: provider._id
            }));
            if (this.globalProviders && this.globalProviders.sms) {
                let global = {
                    text: this.globalProviders.sms.name,
                    value: this.globalProviders.sms._id
                };
                smsProviders = [global, ...smsProviders];
            }
            return smsProviders;
        }
    },
    data() {
        return {
            initialHash: '',
            isInitialLoad: true,
            pageLoading: false,
            threeDotsOptions: [],
            globalProviders: null,
            appProviderAPIData: null,
            testProviderType: null,
            testProviderId: null,
            emailTestModal: {
                showSendTestEmailModal: false,
                to: ''
            },
            smsTestModal: {
                showSendTestSmsModal: false,
                phone_number: '',
                country_code: ''
            },
            smsProvidersStore: {},
            emailProvidersStore: {},
            appProvider: {
                email: {
                    transaction: {
                        provider: this.getInitialValue(null)
                    },
                    otp: {
                        provider: this.getInitialValue(null)
                    }
                    // ,
                    // promotional: {
                    //     provider: this.getInitialValue(null)
                    // }
                },
                sms: {
                    transaction: {
                        provider: this.getInitialValue(null)
                    },
                    otp: {
                        provider: this.getInitialValue(null)
                    }
                    // ,
                    // promotional: {
                    //     provider: this.getInitialValue(null)
                    // }
                }
            }
        };
    },
    mounted() {
        this.isInitialLoad = true;
        let email = this.getPrimaryVerifiedActiveEmail();
        if (email) {
            this.emailTestModal.to = email;
        }

        let phone = this.getPrimaryVerifiedActivePhoneNumber();
        if (phone) {
            this.smsTestModal.country_code = String(phone.countryCode);
            this.smsTestModal.phone_number = String(phone.phone);
        }

        this.pageLoading = true;
        Promise.all([
            this.fetchEmailProviders(),
            this.fetchSmsProviders(),
            this.fetchGlobalProviders(),
            this.fetchAppProvider()
            //.then(() => {
                //this.updateAppProviderInState();
           // })
        ])
            .catch(e => {
                this.$snackbar.global.showError('Something went wrong');
            })
            .finally(() => {
                this.isInitialLoad = false;
                this.pageLoading = false;
                this.initialHash = this.generateHashOfLocalState();
            });
    },
    methods: {
        generateHashOfLocalState() {
            return hash(this.appProvider);
        },
        isFormUpdated() {
            return this.generateHashOfLocalState() !== this.initialHash;
        },
        isFormDirty() {
            return this.isFormUpdated();
        },
        getPrimaryVerifiedActivePhoneNumber() {
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
            if (this.testProviderType == 'email') {
                this.emailTestModal.showSendTestEmailModal = false;
            } else if (this.testProviderType == 'sms') {
                this.smsTestModal.showSendTestSmsModal = false;
            }
        },
        openTestProviderModal() {
            if (this.testProviderType == 'email') {
                this.emailTestModal.showSendTestEmailModal = true;
            } else if (this.testProviderType == 'sms') {
                this.smsTestModal.showSendTestSmsModal = true;
            }
        },
        isProviderGlobal(type, provider) {
            return get(this.globalProviders, `${type}._id`) == provider;
        },
        testProvider(type, providerId) {
            this.testProviderId = providerId;
            this.testProviderType = type;
            if (type == 'email') {
                let email = this.getPrimaryVerifiedActiveEmail();
                if (email) {
                    this.emailTestModal.to = email;
                }
            }
            if (type == 'sms') {
                let phone = this.getPrimaryVerifiedActivePhoneNumber();
                if (phone) {
                    this.smsTestModal.country_code = String(phone.countryCode);
                    this.smsTestModal.phone_number = String(phone.phone);
                }
            }

            this.openTestProviderModal();
        },
        fetchAppProvider() {
            CommunicationServices.getAppProvider()
                .then(data => {
                    this.appProviderAPIData = data.data;
                    this.updateAppProviderInState()
                });
        },
        updateAppProviderInState() {
            set(
                this.appProvider,
                'email.transaction.provider.value',
                get(this.appProviderAPIData, 'email.transaction.provider')
            );
            set(
                this.appProvider,
                'email.otp.provider.value',
                get(this.appProviderAPIData, 'email.otp.provider')
            );
            // set(
            //     this.appProvider,
            //     'email.promotional.provider.value',
            //     get(this.appProviderAPIData, 'email.promotional.provider')
            // );
            set(
                this.appProvider,
                'sms.transaction.provider.value',
                get(this.appProviderAPIData, 'sms.transaction.provider')
            );
            set(
                this.appProvider,
                'sms.otp.provider.value',
                get(this.appProviderAPIData, 'sms.otp.provider')
            );
            // set(
            //     this.appProvider,
            //     'sms.promotional.provider.value',
            //     get(this.appProviderAPIData, 'sms.promotional.provider')
            // );
        },
        fetchGlobalProviders() {
           CommunicationServices.getGlobalProvider()
                .then(data => {
                    this.globalProviders = data.data;
                });
        },
        getInitialValue(val = null) {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        backRedirect() {
            this.$router.replace({
                name: 'providerList'
            });
        },
        validate() {
            return true;
        },
        validateAndSave() {
            if (this.validate()) {
                this.saveForm();
            }
        },
        saveForm() {
            this.pageLoading = true;
            let finalObj = {
                email: {
                    transaction: {
                        provider: get(
                            this.appProvider,
                            'email.transaction.provider.value'
                        )
                    },
                    otp: {
                        provider: get(
                            this.appProvider,
                            'email.otp.provider.value'
                        )
                    }
                    ,
                    // promotional: {
                    //     provider: get(
                    //         this.appProvider,
                    //         'email.promotional.provider.value'
                    //     )
                    // }
                },
                sms: {
                    transaction: {
                        provider: get(
                            this.appProvider,
                            'sms.transaction.provider.value'
                        )
                    },
                    otp: {
                        provider: get(
                            this.appProvider,
                            'sms.otp.provider.value'
                        )
                    }
                    // ,
                    // promotional: {
                    //     provider: get(
                    //         this.appProvider,
                    //         'sms.promotional.provider.value'
                    //     )
                    // }
                }
            };
                CommunicationServices.postGlobalProvider( finalObj)
                .then(data => {
                    //this.appProviderAPIData = data.data;
                    //this.updateAppProviderInState();
                    this.$snackbar.global.showSuccess(
                        'Successfully updated default provider'
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        fetchEmailProviders() {
             CommunicationServices.getEmailProvider({
                    params: {
                        limit: 100,
                        //sort: JSON.stringify({ created_at: -1 })
                    }
                })
                .then(data => {
                    this.emailProvidersStore = data.data
                });
        },
        fetchSmsProviders() {
             CommunicationServices.getSmsProvider({
                    params: {
                        limit: 100,
                        //sort: JSON.stringify({ created_at: -1 })
                    }
                })
                .then(data => {
                    this.smsProvidersStore = data.data
                });
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
        margin: 24px;
        display: flex;
        @media @mobile {
            margin: 0 0 48px 0;
            display: block;
        }
        .container {
            background: @White;
            border-radius: 4px;
            padding: 24px;
            width: 50%;
            @media @mobile {
                width: calc(100% - 48px);
            }
        }
        .container:first-child {
            margin-right: 24px;
            @media @mobile {
                margin-right: 0;
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
    background-color: #f8f8f8;
}
</style>
