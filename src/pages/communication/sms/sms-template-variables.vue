<template>
    <div class="panel">
        <div class="main">
            <loader v-if="pageLoading" class="loading"></loader>
            <div class="form page-container" v-if="!pageLoading">
                <div class="form-container">
                    <div class="details">Content</div>
                    <div class="form-field">
                        <div class="template-variables-container form-field">
                            <adm-checkbox-card
                                :status="personalizationChecked"
                                :disabled="
                                    systemDisableEdit || disabledVariables
                                "
                                text1="Personalization"
                                @changeStatus="
                                    selectTemplateEngine(
                                        !personalizationChecked
                                    )
                                "
                                class="personalization-cardbox"
                            >
                                <template slot="text2">
                                    <span class="cardbox-description"
                                        >SMS contains templating variables
                                        <a
                                            class="type-link"
                                            href="https://mozilla.github.io/nunjucks/"
                                            target="_blank"
                                            @click="onClickReadMore"
                                            >read more?</a
                                        ></span
                                    >
                                </template>
                            </adm-checkbox-card>
                        </div>

                        <div
                            v-if="personalizationChecked"
                            class="variables-container"
                        >
                            <!-- <div
                                v-if="!disabledVariables"
                                class="nitrozen-label import-data"
                                @click.stop="openImportDataModal"
                            >
                                <span class="plus-icon">+</span> Import data
                            </div> -->
                            <no-ssr>
                                <VJsoneditor
                                    class="vjson-editor-container"
                                    v-model="json"
                                    :options="options"
                                    :plus="false"
                                    height="400px"
                                    @error="onError"
                                ></VJsoneditor>
                            </no-ssr>
                        </div>
                    </div>
                    <!-- <ukt-modal
                        :isOpen="showImportDataModal"
                        :title="'Import Data'"
                        :childHandleFocus="true"
                        @closedialog="closeImportDataModal"
                        :modalClass="'modal-import'"
                    >
                        <div class="outer-container">
                            <div class="inner-container">
                                <div>
                                    <nitrozen-checkbox
                                        :checkboxValue="'User'"
                                        @change="checkmarkData($event)"
                                        v-model="refVariables"
                                        >User</nitrozen-checkbox
                                    >
                                </div>
                                <pre class="pre-container">{{
                                    JSON.stringify(ref_user_data, null, 4)
                                }}</pre>
                            </div>
                            <div class="inner-container">
                                <div>
                                    <nitrozen-checkbox
                                        :checkboxValue="'Application'"
                                        @change="checkmarkData($event)"
                                        v-model="refVariables"
                                        >Application</nitrozen-checkbox
                                    >
                                </div>
                                <pre class="pre-container">{{
                                    JSON.stringify(
                                        ref_application_data,
                                        null,
                                        4
                                    )
                                }}</pre>
                            </div>
                        </div>
                        <div class="dummy-data-container">
                            <div class="outer-container">
                                <div class="inner-container">
                                    <div class="nitrozen-label">
                                        Select data source
                                    </div>
                                    <nitrozen-dropdown
                                        class="dropdown-container"
                                        :items="dummyDataSources"
                                        v-model="selectedDataSource"
                                        @change="onSelectedDataSource"
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="inner-container"></div>
                            </div>
                            <pre class="pre-container">{{
                                dummyDataSourceMeta
                                    ? JSON.stringify(
                                          dummyDataSourceMeta,
                                          null,
                                          4
                                      )
                                    : 'No data source selected'
                            }}</pre>
                        </div>
                        <div class="import-btn-container">
                            <nitrozen-button
                                class="btn-margin"
                                @click="importData"
                                :theme="'secondary'"
                                v-flatBtn
                                >Add variables</nitrozen-button
                            >
                        </div>
                    </ukt-modal> -->

                    <nitrozen-dialog
                        id="sendTestSms"
                        ref="dialog"
                        title="Send Test SMS"
                        @close="closeSendTestSmsModal"
                    >
                        <template slot="body">
                            <div>
                                <nitrozen-input
                                    v-model="testSms.phone_number.value"
                                    :label="'Enter Number'"
                                    :placeholder="'for e.g 9876543210'"
                                    @keyup="smsSuccessfullySent = false"
                                >
                                </nitrozen-input>
                                <nitrozen-error
                                    v-if="testSms.phone_number.showerror"
                                    >{{ testSms.phone_number.errortext }}
                                </nitrozen-error>
                                <nitrozen-dropdown
                                    :label="'Provider'"
                                    class="mar-top-24 w-100"
                                    :items="providersDropdownOptions"
                                    v-model="selectedProvider.value"
                                ></nitrozen-dropdown>
                                <nitrozen-error
                                    v-if="selectedProvider.showerror"
                                    >{{ selectedProvider.errortext }}
                                </nitrozen-error>
                                <div
                                    v-show="smsSuccessfullySent"
                                    class="sms-success"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        style="fill: #2e31be ;"
                                    >
                                        <path
                                            d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                                        ></path>
                                    </svg>
                                    SMS successfully sent!
                                </div>
                                <div>
                                    <div class="text-note mar-top-36">
                                        Please make sure your SMS template is
                                        DLT approved else SMS delivery will
                                        fail.
                                    </div>
                                </div>
                                <div class="send-sms-container">
                                    <nitrozen-button
                                        :disabled="disableSendSmsButton"
                                        class="btn-margin"
                                        @click="sendSms"
                                        :theme="'secondary'"
                                        v-flatBtn
                                    >
                                        SEND SMS
                                    </nitrozen-button>
                                </div>
                            </div>
                        </template>
                        <template slot="footer">
                            <div></div>
                        </template>
                    </nitrozen-dialog>
                    <div class="message-outer-container">
                        <div class="message-container">
                            <div class="nitrozen-label">
                                Message *
                                {{ data.message.template.value.length }}
                                characters
                                <!-- <span
                                    class="add-url type-link"
                                    @click="openURLBuilder"
                                    >+ Add Link</span
                                > -->
                            </div>
                            <nitrozen-input
                                v-model="data.message.template.value"
                                :type="'textarea'"
                                class="form-field height100 margin-bottom-0"
                                v-on:keyup="renderMessageTemplate"
                                :disabled="systemDisableEdit"
                                :maxlength= "validLength.message"
                            >
                            </nitrozen-input>
                            <nitrozen-error
                                v-if="data.message.template.showerror"
                                >{{ data.message.template.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="message-container">
                            <div class="nitrozen-label">Preview</div>
                            <div
                                v-html="messagePreview"
                                class="preview-container"
                                v-if="!previewHasError"
                            ></div>
                            <div
                                class="preview-container"
                                v-if="previewHasError"
                            >
                                <div class="danger">{{ messagePreview }}</div>
                                <div class="danger">
                                    {{ messagePreviewError }}
                                </div>
                                <br />
                                <a
                                    class="type-link"
                                    target="_blank"
                                    href="https://mozilla.github.io/nunjucks/"
                                    >Read more?</a
                                >
                            </div>
                        </div>
                    </div>
                    <div v-if="error_text">
                        <div
                            v-bind:class="{
                                'show-error': error_text,
                            }"
                        >
                            {{ error_text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog
            ref="url_builder_dialog"
            title="Build Link"
            @close="urlBuilderDialogClose"
        >
            <template slot="body">
                <!-- <adm-url-builder
                    ref="url_builder"
                    :enableCustomLink="true"
                    :enableLinkText="true"
                ></adm-url-builder> -->
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
/deep/.n-input-maxlength{
    display:none;
}
.panel {
    min-height: 100%;
}
.main {
    min-height: 100%;
}
.type-link {
    font-size: 12px;
    font-weight: 100;
    color: #2e31be;
    cursor: pointer;
}
/deep/.page-container{
    width: 100% ;
}
.page-container {
    background: @Alabaster2;
    padding: 0px;
    .form-container {
        width: 100%;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 4px;
        background-color: @White;
        margin-right: 24px;
        @media @mobile {
            margin-right: 0;
        }
        .details {
            color: @Mako;
            font-weight: bold;
            font-size: 18px;
            line-height: 27px;
            text-align: left;
            margin-bottom: 24px;
        }
        /deep/.jsoneditor-poweredBy {
            visibility: hidden;
        }
        /deep/.ace_gutter {
            z-index: 3;
        }
        .dropdown-container {
            margin-bottom: 12px;
            width: 50%;
        }
        .w-100 {
            width: 100%;
        }
        .form-checkbox {
            display: inline-flex;
            margin-right: 30px;
        }
        .form-message {
            margin-top: 20px;
        }
        .vjson-editor-container {
            margin-top: 24px;
        }
        /deep/.jsoneditor-container {
            height: 300px !important;
            /deep/.jsoneditor {
                border-color: #2e31be;
            }
            /deep/.jsoneditor-menu {
                background-color: #2e31be;
            }
        }
        .message-input {
            min-height: 100px;
        }
        .tab {
            height: 45px;
            width: 140px;
            display: inline-block;
            padding-top: 10px;
            text-align: left;
            cursor: pointer;
        }
        .tab-name {
            position: relative;
            top: -8px;
        }
        .message-outer-container {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            max-height: 150px;
        }
        .message-container {
            width: 48%;
            //max-width: 48%;
             word-break: break-all;
            height: 100%;
            /deep/.nitrozen-form-input {
                /deep/textarea {
                    min-height: 150px;
                }
            }
            .add-url {
                float: right;
            }
        }
        .height100 {
            height: 100%;
        }
        .margin-bottom-0 {
            margin-bottom: 0px;
        }
        .tab-container {
            margin-top: 10px;
            padding-left: 20px;
        }
        .icon {
            display: inline-block;
            /deep/ svg {
                width: 30px;
                height: 30px;
                circle {
                    fill: #d7d8db;
                }
            }
            &.done {
                /deep/ circle {
                    fill: #f44c4b;
                }
                /deep/ circle + g {
                    stroke: 2;
                }
            }
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
    .personalization-cardbox {
        width: 100%;
        .cardbox-description {
            font-size: 12px;
            font-weight: normal;
        }
    }
    /deep/.nitrozen-options {
        z-index: 6;
    }
    .save-btn-container {
        margin-top: 15px;
    }
    .show-error {
        color: #ee485d;
        margin-top: 10px;
    }
    .btn-margin {
        margin: 0px 10px;
    }
}
/deep/.common-input {
    padding: 8px 0px 5px 10px;
    border: 1px solid #e4e5e6;
    border-radius: 3px;
}
.variables-container {
    position: relative;
    .import-data {
        cursor: pointer;
        text-align: right;
        position: absolute;
        top: 6px;
        right: 24px;
        z-index: 4;
        color: white;
        font-size: 14px;
        .plus-icon {
            font-size: 20px;
            position: relative;
            top: 2px;
            right: 2px;
        }
    }
}
.modal {
    ::v-deep .modal-container {
        padding: 0px;
        .modal-header {
            border-bottom: 1px solid #d0d0d0;
            padding-left: 24px;
            padding-right: 24px;
        }
        .modal-body {
            margin: 24px;
        }
    }
}
.modal-import {
    /deep/.modal-container {
        width: 800px;
        .modal-body {
            .outer-container {
                display: flex;
                justify-content: space-between;
                .inner-container {
                    width: 48%;
                    .pre-container {
                        padding: 12px;
                        margin: 12px 0px 24px 0px;
                        overflow: auto;
                        background: #f9f9f9;
                        font-size: 12px;
                        font-family: Inter, sans-serif;
                        line-height: normal;
                        min-height: 130px;
                        max-height: 130px;
                    }
                }
            }
            .dummy-data-container {
                margin: 12px 0px;
                .label-container {
                    align-self: center;
                    text-align: right;
                }
                .pre-container {
                    padding: 12px;
                    margin: 12px 0px 24px 0px;
                    overflow: auto;
                    background: #f9f9f9;
                    font-size: 12px;
                    font-family: Inter, sans-serif;
                    line-height: normal;
                    min-height: 130px;
                    max-height: 130px;
                }
            }
            .import-btn-container {
                text-align: right;
            }
        }
    }
}
.modal-test-sms {
    /deep/.modal-container {
        width: 500px;
    }
}
.preview-container {
    background: #f9f9f9;
    min-height: 126px;
    line-height: 21px;
    font-size: 12px;
    padding: 12px;
    .danger {
        color: #fa3f4d;
    }
    .type-link {
        font-size: 12px;
        font-weight: 100;
        color: #2e31be;
    }
}

/deep/.send-sms-container {
    margin-top: 40px;
    text-align: right;
}
/deep/.form-error {
    color: #ee485d;
}
/deep/.generic-button {
    text-align: left;
}
/deep/.generic-button .disable-btn {
    background-color: lightgray;
}
/deep/.sms-success {
    color: #2e31be;
    margin-top: 10px;
    font-size: 14px;
    font-family: Inter, sans-serif;
    position: absolute;
}

.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.mar-top-24 {
    margin-top: 24px;
}
.mar-top-36 {
    margin-top: 36px;
}
#sendTestSms {
    ::v-deep .nitrozen-dialog-footer {
        display: none;
    }
}
.text-note {
    color: #a4a4a4;
    font-size: 12px;
    line-height: 18px;
}
</style>

<script>
import Vue from 'vue';
import loader from '@/components/common/loader';
import { mapGetters } from 'vuex';
import { Promise } from 'q';
// import {
//     ADMIN_COMMS_CREATE_SMS_TEMPLATE_FORM,
//     ADMIN_COMMS_UPDATE_SMS_TEMPLATE_FORM,
//     ADMIN_COMMS_SEND_TEST_SMS,
//     ADMIN_COMMS_FETCH_SMS_TEMPLATE,
//     ADMIN_COMMS_DUMMY_DATA_SOURCES,
//     ADMIN_COMMS_DUMMY_DATA_SOURCE_META,
//     ADMIN_COMMS_FETCH_SMS_PROVIDERS
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_SMS_TEMPLATE,
//     ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_GET_SMS_PROVIDERS
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_SMS_TEMPLATE,
//     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE
// } from '../../../../store/admin/mutation.type';
import NoSSR from 'vue-no-ssr';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import nunjucks from 'nunjucks';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
import uktModal from '@/components/common/utk-modal.vue';
import admforminput from '@/components/common/form-input.vue';
import admCheckboxCard from '@/components/common/adm-checkbox-card.vue';
//import urlBuilder from '@/components/admin/common/url-builder/index.vue';
import hash from 'object-hash';
const VJsoneditor = () => import('v-jsoneditor');
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import { GET_USER_INFO } from '../../../store/getters.type';
import CommunicationServices from '../../../services/pointblank.service';

export default {
    components: {
        loader: loader,
        VJsoneditor,
        'no-ssr': NoSSR,
        'adm-form-input': admforminput,
        'ukt-modal': uktModal,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'adm-checkbox-card': admCheckboxCard,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-dialog': NitrozenDialog,
        //'adm-url-builder': urlBuilder
    },
    directives: {
        flatBtn,
    },
    props: {
        isEditMode: {
            type: Boolean,
            default: false,
        },
        isCloneMode: {
            type: Boolean,
            default: false,
        },
        templateId: {
            type: String,
            default: '',
        },
        systemDisableEdit: {
            type: Boolean,
            default: false,
        },
        templateData: {
            type: Object,
        },
    },
    watch: {
        editorMode() {
            this.updateEditorMode();
        },
    },
    data() {
        return {
            dummyDataSources: [],
            selectedDataSource: 1000,
            selectedProvider: {
                showerror: false,
                value: ' ',
                errortext: '',
            },
            dummyDataSourceMeta: null,
            pageLoading: false,
            pageError: false,
            error_text: null,
            showSendTestSmsModal: false,
            showImportDataModal: false,
            commsCounter: 0,
            disableSendSmsButton: false,
            smsSuccessfullySent: false,
            userChecked: false,
            applicationChecked: false,
            refVariables: [],
            ref_user_data: {},
            ref_application_data: {},
            personalizationChecked: false,
            disabledVariables: false,
            options: {
                mode: 'code',
                enableSort: false,
                enableTransform: false,
                onChangeText: this.onVjsonEditorChange,
            },
            editorMode: 'code',
            jsonEditorLoaded: false,
            smsTemplate: null,
            json: {
                hello: 'world',
            },
            messagePreview: '',
            previewHasError: false,
            messagePreviewError: '',
            data: {
                message: {
                    template_type: this.getInitialValue('static'),
                    template: this.getInitialValue('This is a test message'),
                },
            },
            testSms: {
                phone_number: {
                    showerror: false,
                    value: '',
                    errortext: '',
                },
            },
            initialHash: '',
            providersDropdownOptions: [],
            validLength:{title:200,desc:300,message:500}
        };
    },
    computed: {
        getBreadCrumb() {
            return [];
        },
        ALIGN() {
            return ALIGN;
        },
        ...mapGetters({
            //     smsTemplateStore: ADMIN_COMMS_GET_SMS_TEMPLATE,
            //     smsTemplateToClone: ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE,
            userData: GET_USER_INFO,
            //     smsProvidersStore: ADMIN_COMMS_GET_SMS_PROVIDERS
        }),
    },
    mounted() {
        let data = {};
        CommunicationServices.getSmsProvider({
            page_size: 100,
            page_no: 1,
            sort: { created_at: -1 },
        })
            .then((data) => {
                data = data.data;
                if (data.items.length) {
                    this.selectedProvider.value = data.items[0]._id || ' ';
                }
                this.fetchDefaultSmsProvider().then((defaultProvider) => {
                    this.providersDropdownOptions = data.items.map((ele) => {
                        return {
                            text: ele.name,
                            value: ele._id,
                        };
                    });
                    this.providersDropdownOptions.unshift(...defaultProvider);
                });
                return data;
            })
            .catch((err) => {
                console.log(err);
            });

        try {
            if (this.isCloneMode) {
                data = cloneDeep(this.templateData);
                this.disabledVariables = data.is_system;
            } else {
                data = cloneDeep(this.templateData);
                this.disabledVariables =
                    data.meta &&
                    data.meta.type == 'cloned' &&
                    data.meta.is_system;
                this.editorMode = 'preview';
            }

            if (this.isCloneMode || this.isEditMode) {
                if (this.disabledVariables) {
                    this.editorMode = 'preview';
                } else {
                    this.editorMode = 'code';
                }
            }
            if (!this.isEditMode && !this.isCloneMode) {
                this.editorMode = 'code';
            }
            if (data.template_variables) {
                this.json = data.template_variables;
            }
            if (data.message) {
                this.personalizationChecked =
                    data.message.template_type == 'nunjucks';
                this.data.message = {
                    template: this.getInitialValue(data.message.template),
                    template_type: this.getInitialValue(
                        data.message.template_type
                    ),
                };
                this.renderMessageTemplate();
            }
            let phone = this.getPrimaryVerifiedActivePhoneNumber();
            if (phone && phone.phone) {
                this.testSms.phone_number.value = phone.phone;
            }
            //this.fetchSMSMatchEventSubscriptions().then(() => {
            this.jsonEditorLoaded = true;
            //});

            this.getUserData();
            this.getApplicationData();
            this.initialHash = this.generateHashOfLocalState();
        } catch (error) {
            this.$snackbar.global.showError('Failed to load Sms Template');
        }
    },
    updated() {
        this.updateEditorMode();
    },
    methods: {
        onVjsonEditorChange(obj) {
            try {
                let json = JSON.parse(obj);
                this.json = json;
                this.renderMessageTemplate();
            } catch (error) {}
        },
        generateHashOfLocalState() {
            return hash({
                ...this.data,
                ...{ json: this.json },
            });
        },
        isFormUpdated() {
            return this.generateHashOfLocalState() !== this.initialHash;
        },
        openURLBuilder() {
            this.$refs['url_builder'].init({});
            this.$refs['url_builder_dialog'].open({
                width: '650px',
                neutralButtonLabel: 'Insert Link',
                showCloseButton: true,
            });
        },
        urlBuilderDialogClose(e) {
            if (e == 'Insert Link') {
                this.$refs['url_builder'].get().then((linkData) => {
                    this.data.message.template.value =
                        this.data.message.template.value + ' ' + linkData.url;
                    this.renderMessageTemplate();
                });
            }
        },
        onSelectedDataSource(id) {
            // if (id == 1000) {
            //     this.dummyDataSourceMeta = null;
            // } else {
            //     this.$store
            //         .dispatch(ADMIN_COMMS_DUMMY_DATA_SOURCE_META, {
            //             params: { id: id }
            //         })
            //         .then(data => {
            //             this.dummyDataSourceMeta = data;
            //         });
            // }
        },
        onClickReadMore(e) {
            e.stopPropagation();
        },
        // importData() {
        //     if (
        //         this.selectedDataSource > 0 &&
        //         this.dummyDataSourceMeta &&
        //         this.selectedDataSource != 1000
        //     ) {
        //         this.json = { ...this.json, ...this.dummyDataSourceMeta };
        //     }
        //     let items = [];
        //     if (this.userChecked) {
        //         items.push('ref_user');
        //     }
        //     if (this.applicationChecked) {
        //         items.push('ref_application');
        //     }
        //     this.addTotemplate_variables(items);
        //     this.closeImportDataModal();
        // },
        // checkmarkData(items) {
        //     let userChecked = items.find(item => item == 'User');
        //     this.userChecked = userChecked ? true : false;

        //     let applicationChecked = items.find(item => item == 'Application');
        //     this.applicationChecked = applicationChecked ? true : false;
        // },
        // openImportDataModal() {
        //     this.showImportDataModal = true;
        // },
        // closeImportDataModal() {
        //     this.showImportDataModal = false;
        // },
        urlify(text) {
            let output = text;
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            output = output.replace(urlRegex, function (url) {
                return `<a style="color:#2E31BE;" target="_blank" href="${url}">${url}</a>`;
            });
            var emailRegex =
                /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;
            output = output.replace(emailRegex, function (email) {
                return `<a style="color:#2E31BE;" target="_blank" href="mailto:${email}">${email}</a>`;
            });
            return output;
        },
        updateEditorMode() {
            this.options.mode = this.editorMode;
        },
        fetchSMSMatchEventSubscriptions() {
            // let id = this.isEditMode
            //     ? this.$route.params.id
            //     : this.isCloneMode
            //     ? this.$route.query.clone
            //     : null;
            // if (id) {
            //     return adminCommsService
            //         .fetchAppEventsSubscriptions({
            //             params: {
            //                 page_size: 200,
            //                 page_no: 1,
            //                 query: JSON.stringify({
            //                     'template.sms.template': id
            //                 })
            //             }
            //         })
            //         .then(res => res.data)
            //         .then(data => {
            //             if (data.total > 0) {
            //                 this.editorMode = 'preview';
            //             }
            //         });
            // }
            // return Promise.resolve();
        },
        renderMessageTemplate() {
            this.validateMessageContent();
            let template = '';
            let templateValid = true;
            if (this.data.message.template_type.value == 'nunjucks') {
                try {
                    template = nunjucks.compile(
                        this.data.message.template.value
                    );
                    template = template.render(this.json);
                } catch (err) {
                    templateValid = false;
                    this.messagePreview = `Invalid message template`;
                    this.messagePreviewError = err.message;
                    this.previewHasError = true;
                }
            } else {
                template = this.data.message.template.value;
            }
            if (templateValid) {
                this.previewHasError = false;
                this.messagePreviewError = '';
                this.messagePreview = this.urlify(template);
            }
        },
        getPrimaryVerifiedActivePhoneNumber() {
            return this.userData.user.phone_numbers
                .filter((a) => a.active && a.primary && a.verified)
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
                .filter((a) => a.active && a.primary && a.verified)
                .reduce((result, current, index) => {
                    if (index == 0) {
                        result = current.email;
                    }
                    return result;
                }, '');
        },
        getUserData() {
            let ref_user = pick(this.userData.user, ['firstName', 'lastName']);

            this.userData.user.phone_numbers
                ? (ref_user.phoneNumber =
                      this.getPrimaryVerifiedActivePhoneNumber())
                : null;
            this.userData.user.emails
                ? (ref_user.email = this.getPrimaryVerifiedActiveEmail())
                : null;
            this.ref_user_data = ref_user;
        },
        getApplicationData() {
            let ref_application = {
                name: 'Lorem ipsum dolor sit amet',
                banner: {
                    secure_url:
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png',
                },
                logo: {
                    secure_url:
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png',
                },
            };
            this.ref_application_data = ref_application;
        },
        // addTotemplate_variables(items) {
        //     let ref_user = pick(this.userData.user, ['firstName', 'lastName']);

        //     this.userData.user.phone_numbers
        //         ? (ref_user.phoneNumber = this.getPrimaryVerifiedActivePhoneNumber())
        //         : null;
        //     this.userData.user.emails
        //         ? (ref_user.email = this.getPrimaryVerifiedActiveEmail())
        //         : null;

        //     let ref_application = {
        //         name: 'Lorem ipsum dolor sit amet',
        //         banner: {
        //             secure_url:
        //                 'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
        //         },
        //         logo: {
        //             secure_url:
        //                 'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
        //         }
        //     };

        //     let values = {
        //         ref_user,
        //         ref_application
        //     };
        //     delete this.json.hello;
        //     delete this.json.ref_user;
        //     delete this.json.ref_application;
        //     items.forEach(item => {
        //         this.json[item] = values[item];
        //     });
        //     this.json = cloneDeep(this.json);
        // },
        onError(err) {
            // console.log('error',err);
        },
        selectTemplateEngine(personalizationChecked) {
            if (personalizationChecked) {
                this.data.message.template_type.value = 'nunjucks';
            } else {
                this.data.message.template_type.value = 'static';
            }
            this.personalizationChecked = personalizationChecked;
            this.renderMessageTemplate();
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: '',
            };
        },
        openSendTestSmsModal() {
            if (typeof this.json != 'object') {
                this.error_text = 'Please provide json in the above editor';
            } else {
                this.error_text = '';
                this.testSms.phone_number.showerror = false;
                this.testSms.phone_number.errortext = '';

                this.selectedProvider.showerror = false;
                this.selectedProvider.errortext = '';

                this.smsSuccessfullySent = false;
                this.showSendTestSmsModal = true;
                this.disableSendSmsButton = false;
                this.openTestSmsDialog();
            }
        },
        closeSendTestSmsModal() {
            this.showSendTestSmsModal = false;
        },
        validateMessageContent() {
            if (!this.data.message.template.value) {
                this.data.message.template.showerror = true;
                this.data.message.template.errortext =
                    'Message cannot be empty';
                return false;
            }else {
                this.data.message.template.showerror = false;
                this.data.message.template.errortext = '';
                return true;
            }
        },
        validate() {
            return this.validateMessageContent();
        },
        saveForm() {
            this.error_text = null;
            let _id =
                this.smsTemplateStore && this.smsTemplateStore._id
                    ? this.smsTemplateStore._id
                    : null;
            if (typeof this.json != 'object') {
                this.error_text = 'Please provide json in the above editor';
            } else {
                let finalObj = {
                    template_variables: this.json,
                    published: true,
                    message: {
                        template_type: this.data.message.template_type.value,
                        template: this.data.message.template.value,
                    },
                };
                finalObj = {
                    ...this.smsTemplateStore,
                    ...finalObj,
                };
                this.removeEmptyFields(finalObj);
                return finalObj;
                // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE, {
                //     data: finalObj
                // });
            }
        },
        sendSms() {
            this.smsSuccessfullySent = false;
            this.testSms.phone_number = this.testSms.phone_number || {};
            this.testSms.phone_number.showerror = false;
            this.testSms.phone_number.errortext = '';
            this.selectedProvider.showerror = false;
            this.selectedProvider.errortext = '';
            this.smsSuccessfullySent = false;
            let _id =
                this.smsTemplateStore && this.smsTemplateStore._id
                    ? this.smsTemplateStore._id
                    : null;
            let mobileNumberRegex = /^\d{10}$/;
            if (
                this.testSms &&
                this.testSms.phone_number &&
                this.selectedProvider.value !== ' '
            ) {
                if (!mobileNumberRegex.test(this.testSms.phone_number.value)) {
                    this.testSms.phone_number.showerror = true;
                    this.testSms.phone_number.errortext =
                        'Mobile Number is invalid';
                } else {
                    let obj = {
                        data: [
                            {
                                phone_number: Number(
                                    this.testSms.phone_number.value
                                ),
                                country_code: 91,
                                ...this.json,
                            },
                        ],
                        sms: {
                            template: {
                                key: 'object',
                                value: {
                                    ...this.smsTemplateStore,
                                    template_variables: this.json,
                                    published: true,
                                    message: {
                                        template_type:
                                            this.data.message.template_type
                                                .value,
                                        template:
                                            this.data.message.template.value,
                                    },
                                },
                            },
                            provider: {
                                id: this.selectedProvider.value,
                            },
                        },
                    };
                    CommunicationServices.postSendSync(obj)
                        .then((data) => {
                            this.smsSuccessfullySent = true;
                            this.commsCounter += 1;
                            if (this.commsCounter > 9) {
                                this.disableSendSmsButton = true;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            } else {
                if (!this.testSms.phone_number.value) {
                    this.testSms.phone_number = this.testSms.phone_number || {};
                    this.testSms.phone_number.showerror = true;
                    this.testSms.phone_number.errortext =
                        'Mobile Number is invalid';
                }
                if (this.selectedProvider.value === ' ') {
                    this.selectedProvider.showerror = true;
                    this.selectedProvider.errortext = 'Please select provider';
                }
            }
        },
        removeEmptyFields(obj) {
            let keys = Object.keys(obj);
            keys.forEach((key) => {
                if (
                    ['object', 'array', 'string'].indexOf(typeof obj[key]) !=
                        -1 &&
                    isEmpty(obj[key]) &&
                    key !== 'description'
                ) {
                    delete obj[key];
                }
            });
        },
        openTestSmsDialog() {
            this.$refs['dialog'].open({
                width: '500px',
                height: '450px',
                showCloseButton: true,
                dismissible: true,
            });
        },
        fetchDefaultSmsProvider() {
            return CommunicationServices.getSmsDefault().then(({ data }) => {
                let defaultSmsProviders = [
                    ...(data
                        ? data.map((v) => ({
                              text: v.name,
                              value: v._id,
                          }))
                        : []),
                ];
                this.selectedProvider.value =
                    defaultSmsProviders[0].value || ' ';
                return defaultSmsProviders;
            });
        },
    },
};
</script>
