<template>
    <ukt-modal
        :isOpen="showSendTestEmailModal"
        :title="'Send Test Email'"
        :childHandleFocus="true"
        @closedialog="closeSendTestEmailModal"
        :modalClass="'modal-test-email'"
    >
        <div>
            <nitrozen-input
                v-model="testEmail.to.value"
                :label="'Enter Email'"
                :placeholder="'for e.g abcxyz@gmail.com'"
                @keyup="emailSuccessfullySent = false"
            >
            </nitrozen-input>
            <nitrozen-error v-if="testEmail.to.showerror"
                >{{ testEmail.to.errortext }}
            </nitrozen-error>

            <div v-show="emailSuccessfullySent" class="email-success">
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
                Email successfully sent!
            </div>
            <nitrozen-error class="email-error" v-show="errortext"
                >{{ errortext }}
            </nitrozen-error>
            <div class="send-email-container flex space-between">
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
                        :disabled="disableSendEmailButton"
                        class="btn-margin float-right"
                        @click="sendEmail"
                        :theme="'secondary'"
                        v-flatBtn
                    >
                        Send Email
                    </nitrozen-button>
                </div>
            </div>
        </div>
    </ukt-modal>
</template>

<script>
//import { ADMIN_COMMS_SEND_TEST_EMAIL } from './../../../../../store/admin/action.type';
import uktinlinesvg from '@/components/common/ukt-inline-svg';
import uktModal from '@/components/common/utk-modal.vue';
import path from 'path';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import CommunicationServices from '../../../../services/pointblank.service';
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
        if (this.to) {
            this.testEmail.to.value = this.to;
        }
    },
    data() {
        return {
            disableSendEmailButton: false,
            emailSuccessfullySent: false,
            failedToSend: false,
            testEmail: {
                to: {
                    showerror: false,
                    value: '',
                    errortext: ''
                }
            },
            errortext: '',
            commsCounter: 0
        };
    },
    props: {
        provider: {
            type: String,
            default: ''
        },
        showSendTestEmailModal: {
            type: Boolean,
            default: false
        },
        showEditProvider: {
            type: Boolean,
            default: false
        },
        to: {
            type: String,
            default: ''
        }
    },
    methods: {
        editProvider() {
             CommunicationServices.getEmailProviderbyId(this.provider).then((data)=>{
                    let type = data.data.provider
                    this.$router.push({path:`email/edit/${this.provider}?type=${type}`})
                }
                )
        },
        sendEmail() {
          this.testEmail.to = this.testEmail.to || {};
            this.testEmail.to.showerror = false;
            this.testEmail.to.errortext = '';
            this.errortext = '';
            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (this.testEmail && this.testEmail.to) {
                if (!emailRegex.test(this.testEmail.to.value)) {
                    this.testEmail.to.showerror = true;
                    this.testEmail.to.errortext = 'To email is invalid';
                } else {
                    this.disableSendMailButton = true;
                    let obj = {
                        data: [
                            {
                                to: this.testEmail.to.value
                            }
                        ],
                        email: {
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
                                    subject: {
                                        template_type: 'static',
                                        template: 'test email'
                                    },
                                    html: {
                                        template_type: 'static',
                                        template:
                                            '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Test Email</title>\n</head>\n<body>\n    <div>This is a test email</div>\n</body>\n</html>'
                                    },
                                    editor_type: 'rawhtml'
                                }
                            },
                            ...(this.provider
                                ? {
                                      provider: {
                                          id: this.provider
                                      }
                                  }
                                : {})
                        }
                    };

                        CommunicationServices.postSendSync(obj)
                        .then(data => {
                            this.emailSuccessfullySent = true;
                            this.commsCounter += 1;
                            if (this.commsCounter > 9) {
                                this.disableSendEmailButton = true;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.emailSuccessfullySent = false;
                            if (this.provider) {
                                this.failedToSend = true;
                                this.errortext =
                                    'Failed to send email - please check provider';
                            } else {
                                this.errortext = 'Failed to send email';
                            }
                        });
                }
            } else {
                this.testEmail.to = this.testEmail.to || {};
                this.testEmail.to.showerror = true;
                this.testEmail.to.errortext = 'To email is invalid';
            }
        },
        closeSendTestEmailModal() {
            this.$emit('closeModal');
        }
    }
};
</script>

<style lang="less" scoped>

.modal-test-email {
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
            .send-email-container {
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
        .email-success {
            color: #2E31BE;
            margin-top: 10px;
            font-size: 14px;
            font-family: Inter, sans-serif;
            position: absolute;
        }
        .email-error {
            margin-top: 10px;
            position: absolute;
        }
    }
}
</style>
