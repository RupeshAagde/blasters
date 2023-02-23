<template>
    <ukt-modal
        :isOpen="showSendTestSmsModal"
        :title="'Send Test Sms'"
        :childHandleFocus="true"
        @closedialog="closeSendTestSmsModal"
        :modalClass="'modal-test-sms'"
    >
        <div>
            <nitrozen-input
                v-model="testSms.phone_number.value"
                :label="'Enter Number'"
                :placeholder="'for e.g 9876543210'"
                @keyup="smsSuccessfullySent = false"
            >
            </nitrozen-input>
            <nitrozen-error v-if="testSms.phone_number.showerror"
                >{{ testSms.phone_number.errortext }}
            </nitrozen-error>
            <nitrozen-input
                class="mar-top-24"
                v-model="testSms.sms_text.value"
                :type="'textarea'"
                :label="'Enter SMS Text'"
                :placeholder="'SMS Text'"
                @keyup="smsSuccessfullySent = false"
            >
            </nitrozen-input>
            <nitrozen-error v-if="testSms.sms_text.showerror"
                >{{ testSms.sms_text.errortext }}
            </nitrozen-error>

            <div v-show="smsSuccessfullySent" class="sms-success">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style="fill: #2E31BE;;"
                >
                    <path
                        d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                    ></path>
                </svg>
                Sms successfully sent!
            </div>
            <nitrozen-error class="sms-error" v-show="errortext"
                >{{ errortext }}
            </nitrozen-error>
            <div class="send-sms-container flex space-between">
                <div class="flex-1">
                    <slot name="button-bar"></slot>
                    <nitrozen-button
                        v-show="provider && failedToSend && showEditProvider"
                        :theme="'secondary'"
                        @click="editProvider"
                        class="btn-wrapper no-padding"
                        >Edit Provider</nitrozen-button
                    >
                </div>
                <div class="flex-1 text-right">
                    <nitrozen-button
                        :disabled="disableSendSmsButton"
                        class="btn-margin float-right"
                        @click="sendSms"
                        :theme="'secondary'"
                        v-flatBtn
                    >
                        Send SMS
                    </nitrozen-button>
                </div>
            </div>
        </div>
    </ukt-modal>
</template>

<script>
import CommunicationServices from '../../../../services/pointblank.service';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import uktModal from '@/components/common/utk-modal.vue';
import path from 'path';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
export default {
    components: {
        'ukt-modal': uktModal,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        if (this.phone_number) {
            this.testSms.phone_number.value = this.phone_number;
        }
    },
    data() {
        return {
            disableSendSmsButton: false,
            smsSuccessfullySent: false,
            testSms: {
                phone_number: {
                    showerror: false,
                    value: '',
                    errortext: ''
                },
                sms_text: {
                    showerror: false,
                    value: '',
                    errortext: ''
                }
            },
            failedToSend: false,
            errortext: '',
            commsCounter: 0
        };
    },
    props: {
        provider: {
            type: String,
            default: ''
        },
        showSendTestSmsModal: {
            type: Boolean,
            default: false
        },
        showEditProvider: {
            type: Boolean,
            default: false
        },
        country_code: {
            type: String,
            default: ''
        },
        phone_number: {
            type: String,
            default: ''
        }
    },
    methods: {
        editProvider() {
            if (this.provider) {
                CommunicationServices.getSmsProviderbyId(this.provider).then((data)=>{
                    let type = data.data.provider
                    this.$router.push({path:`sms/edit/${this.provider}?type=${type}`})

                }
                )

            }
        },
        sendSms() {
            this.testSms.phone_number = this.testSms.phone_number || {};
            this.testSms.phone_number.showerror = false;
            this.testSms.phone_number.errortext = '';
            this.errortext = '';
            let mobileNumberRegex = /^\d{10}$/;
            if (this.testSms && this.testSms.phone_number) {
                if (!mobileNumberRegex.test(this.testSms.phone_number.value)) {
                    this.testSms.phone_number.showerror = true;
                    this.testSms.phone_number.errortext =
                        'Mobile Number is invalid';
                }else if (!this.testSms.sms_text.value) {
                    this.testSms.sms_text.showerror = true;
                    this.testSms.sms_text.errortext =
                        'Please provide DLT approved text';
                } else {
                    this.testSms.sms_text.showerror = false;
                    this.testSms.phone_number.showerror = false;
                    let obj = {
                        data: [
                            {
                                phone_number: Number(
                                    this.testSms.phone_number.value
                                ),
                                country_code: 91
                            }
                        ],
                        sms: {
                            template: {
                                key: 'object',
                                value: {
                                    name: 'test',
                                    priority: 'low',
                                    tags: [],
                                    template_variables: {
                                        hello: 'world'
                                    },
                                    published: true,
                                    message: {
                                        template_type: 'static',
                                        template: this.testSms.sms_text.value || 'This is a test SMS'
                                    }
                                }
                            },
                            provider: {
                                id: this.provider
                            }
                        }
                    };
                

                    CommunicationServices.postSendSync(obj)
                        .then(data => {
                            this.smsSuccessfullySent = true;
                            this.commsCounter += 1;
                            if (this.commsCounter > 9) {
                                this.disableSendSmsButton = true;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.smsSuccessfullySent = false;
                            if (this.provider) {
                                this.failedToSend = true;
                                this.errortext =
                                    'Failed to send sms - please check provider';
                            } else {
                                this.errortext = 'Failed to send sms';
                            }
                        });
                }
            } else {
                this.testSms.phone_number = this.testSms.phone_number || {};
                this.testSms.phone_number.showerror = true;
                this.testSms.phone_number.errortext =
                    'Mobile Number is invalid';
             }
        },
        closeSendTestSmsModal() {
            this.$emit('closeModal');
        }
    }
};
</script>

<style lang="less" scoped>

.modal-test-sms {
    ::v-deep .modal-container {
        width: 500px;
        padding: 0px;
        .modal-header {
            border-bottom: 1px solid #d0d0d0;
            padding-left: 24px;
            padding-right: 24px;
        }
        .modal-body {
            margin: 24px;
            .send-sms-container {
                margin-top: 40px;
            }
            .text-right {
                text-align: right;
            }
            .space-between {
                justify-content: space-between;
            }
            .flex {
                display: flex;
                .flex-1 {
                    flex: 1;
                }
            }
        }
        .sms-success {
            color: #2E31BE;
            margin-top: 10px;
            font-size: 14px;
            font-family: Inter, sans-serif;
            position: absolute;
        }
        .sms-error {
            margin-top: 10px;
            position: absolute;
        }
    }
}
.mar-top-24 {
    margin-top: 24px;
}
</style>
