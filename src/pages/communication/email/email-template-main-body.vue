<template>
    <div class="panel">
        <div class="main">
            <loader v-if="pageLoading" class="loading"></loader>
            <div class="form page-container" v-if="!pageLoading">
                <div class="form-container">
                    <div class="details">Template Details</div>
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
                                        >Email contains templating variables
                                        <a
                                            class="nunjucks-url"
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
                            <div
                                class="nitrozen-label import-data"
                                @click.stop="openImportDataModal"
                                v-if="options.mode == 'code'"
                            >
                                <span class="plus-icon">+</span> Import data
                            </div>
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
                    <div class="form-field">
                        <nitrozen-input
                            v-model="data.subject.template.value"
                            :label="'Subject*'"
                            :placeholder="'Enter Subject'"
                            v-on:keyup="renderSubjectTemplate"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.subject.template.showerror"
                            >{{ data.subject.template.errortext }}
                        </nitrozen-error>
                        <div
                            class="preview-container"
                            v-if="data.subject.template_type.value == 'nunjucks'"
                        >
                            <div v-if="!subjectPreviewHasError">
                                {{ subjectPreview }}
                            </div>
                            <div v-if="subjectPreviewHasError">
                                <div class="danger">{{ subjectPreview }}</div>
                                <div class="danger">
                                    {{ subjectPreviewError }}
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
                    <div class="details editor-details">Editor</div>
                    <div class="form-field">
                        <nitrozen-button
                            v-strokeBtn
                            :theme="'secondary'"
                            @click.stop="openEditor"
                            class="btn-wrapper no-padding"
                            >Open editor</nitrozen-button
                        >
                        <nitrozen-error v-if="data.html.template.showerror"
                            >{{ data.html.template.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-field">
                        <div class="nitrozen-label">Preview</div>
                        <iframe ref="previewbody" class="preview-body"></iframe>
                    </div>

                    <editor-modal
                        :isOpen="showEditorModal"
                        :title="'Editor'"
                        :childHandleFocus="true"
                        @closedialog="onCloseEditorModal"
                        :modalClass="'modal-editor'"
                    >
                        <template slot="body">
                            <div class="outer-container">
                                <div class="inner-container-2">
                                    <beefreeeditor
                                        v-if="data.editor_type.value == 'bee'"
                                        :template="
                                            JSON.parse(data.editor_meta.value)
                                        "
                                        @onSave="onSaveBeFree"
                                        @onSend="
                                            openSendtestEmailModalForBeeFree
                                        "
                                        ref="beefree"
                                        class="editor-container"
                                    ></beefreeeditor>
                                    <newslettergrapeeditor
                                        v-if="
                                            data.editor_type.value == 'grapeJS'
                                        "
                                        ref="grapeNewsletterEditor"
                                        :input="data.html.template.value"
                                        class="editor-container"
                                    ></newslettergrapeeditor>
                                    <rawhtml-editor
                                        v-if="
                                            data.editor_type.value === 'rawhtml'
                                        "
                                        v-model="data.html.template.value"
                                        ref="rawhtml"
                                    ></rawhtml-editor>
                                </div>
                                <transition name="fade">
                                    <div
                                        class="inner-container-1"
                                        v-show="
                                            personalizationChecked &&
                                                seeVariablesInModal
                                        "
                                    >
                                        <div class="nitrozen-label">
                                            Variables
                                        </div>
                                        <div class="variables-container">
                                            <no-ssr>
                                                <VJsoneditor
                                                    class="vjson-editor-container full-height no-top-margin"
                                                    v-model="json"
                                                    :options="options"
                                                    :plus="false"
                                                    height="100%"
                                                    @error="onError"
                                                ></VJsoneditor>
                                            </no-ssr>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </template>
                        <template slot="header">
                            <div class="editor-save">
                                <nitrozen-button
                                    @click.stop="
                                        seeVariablesInModal = !seeVariablesInModal
                                    "
                                    :theme="'secondary'"
                                    v-strokeBtn
                                    class="see-variables-btn"
                                    v-if="personalizationChecked"
                                    >{{
                                        seeVariablesInModal
                                            ? 'Hide variables'
                                            : 'See variables'
                                    }}
                                </nitrozen-button>
                                <nitrozen-button
                                    v-if="data.editor_type.value != 'bee'"
                                    @click="getTemplateFromEditor"
                                    :theme="'secondary'"
                                    v-flatBtn
                                >
                                    Save
                                </nitrozen-button>
                            </div>
                        </template>
                    </editor-modal>
                    <ukt-modal
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
                    </ukt-modal>
                    <nitrozen-dialog id="sendTestEmail" ref="dialog" title="Send Test Email" @close="closeSendTestEmailModal">
                    <template slot="body">
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

                            <nitrozen-dropdown
                                :label="'Provider'"
                                class="mar-top-24"
                                :items="providersDropdownOptions"
                                v-model="selectedProvider.value"
                            ></nitrozen-dropdown>
                            <nitrozen-error
                                v-if="selectedProvider.showerror"
                                >{{ selectedProvider.errortext }}
                            </nitrozen-error>

                            <div
                                v-show="emailSuccessfullySent"
                                class="email-success"
                            >
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
                             <div>
                                <div class="text-note mar-top-36">
                                    Please check you spam folder if you don't recieve this Email in your inbox.
                                </div>
                            </div>
                            <div class="send-email-container">
                                <nitrozen-button
                                    :disabled="disableSendEmailButton"
                                    class="btn-margin"
                                    @click="sendEmail"
                                    :theme="'secondary'"
                                    v-flatBtn
                                >
                                    Send Email
                                </nitrozen-button>
                            </div>
                        </div>
                    </template>
                    </nitrozen-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// @import './../../less/form.less';
// @import './../../less/page-ui.less';
// @import './../../less/page-header.less';
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
.modal-editor {
    z-index: 13;
    /deep/.modal-container {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        /deep/.modal-body {
            height: calc(100% - 64px);
        }
        .outer-container {
            display: flex;
            width: 100%;
            height: 100%;
            // .fade-enter-active, .fade-leave-active {
            //     transition: opacity 1s;
            // }
            // .fade-enter, .fade-leave-to{
            //     opacity: 0;
            // }
            .fade-enter-active,
            .fade-leave-active {
                transition: width 0.5s;
            }
            .fade-enter,
            .fade-leave-to {
                width: 0px;
            }
            .fade-enter-to,
            .fade-leave {
                width: 325px;
            }

            .inner-container-1 {
                margin: 12px;
                .variables-container {
                    width: 325px;
                    padding: 12px;
                    box-sizing: border-box;
                    font-size: 12px;
                    font-family: Inter, sans-serif;
                    overflow: auto;
                    line-height: 17px;
                    height: 100%;
                }
            }
            .inner-container-2 {
                width: 100%;
                .editor-container {
                    width: 100%;
                    flex: 1;
                    height: 100%;
                    #bee-plugin-container {
                        height: 100%;
                    }
                }
            }
        }
        .editor-save {
            width: 100%;
            text-align: right;
            .see-variables-btn {
                border: none;
                &:hover {
                    background: none;
                }
            }
        }
    }
}
.preview-body {
    width: 100%;
    min-height: 100px;
    background: #f9f9f9;
    padding: 24px;
    box-sizing: border-box;
}

.vjson-editor-container {
    margin-top: 24px;
}
.full-height {
    height: 100%;
}
/deep/.jsoneditor-container {
    height: 300px;
    /deep/.jsoneditor {
        border-color: #2E31BE;
    }
    /deep/.jsoneditor-menu {
        background-color: #2E31BE;
    }
}
/deep/.jsoneditor-poweredBy {
    visibility: hidden;
}
/deep/.ace_gutter {
    z-index: 3;
}
.no-top-margin {
    margin-top: 0px;
}
.page-container {
    background: @Alabaster2;
    padding: 0px;
    .form-container {
        width: 100%;
        margin-right: 24px;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 4px;
        background-color: @White;
        @media @mobile {
            margin-right: 0;
        }
        .preview-container {
            background: #f9f9f9;
            line-height: 21px;
            font-size: 12px;
            padding: 12px;
            margin: 12px 0px 24px 0px;
            font-family: Inter, sans-serif;
            .danger {
                color: #fa3f4d;
            }
            .nunjucks-url {
                font-size: 12px;
                font-weight: 100;
                color: #2E31BE;
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
        .editor-details {
            margin-bottom: 12px;
        }

        .dropdown-container {
            margin-bottom: 12px;
            width: 50%;
        }
        .form-checkbox {
            display: inline-flex;
            margin-right: 30px;
        }
        .form-subject {
            margin-top: 20px;
        }

        .subject-input {
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
        .subject-outer-container {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            min-height: 150px;
        }
        .subject-container {
            width: 48%;
            height: 100%;
            /deep/.nitrozen-form-input {
                /deep/textarea {
                    min-height: 150px;
                }
            }
        }
        .height100 {
            height: 100%;
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
            .nunjucks-url {
                font-size: 12px;
                font-weight: 100;
                color: #2E31BE;
            }
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

.modal-import {
    /deep/.modal-container {
        width: 800px;
        .modal-body {
            padding: 24px;
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
.modal-test-email {
    ::v-deep.modal-container {
        width: 500px;
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
.preview-container {
    background: #f9f9f9;
    line-height: 21px;
    font-size: 12px;
    padding: 12px;
    .danger {
        color: #fa3f4d;
    }
    .nunjucks-url {
        font-size: 12px;
        font-weight: 100;
        color: #2E31BE;
    }
}

/deep/.send-email-container {
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
/deep/.email-success {
    color: #2E31BE;
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
    margin-top:24px;
}
.mar-top-36 {
    margin-top:36px;
}
#sendTestEmail{
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
import loader from '@/components/common/loader.vue';
import { mapGetters } from 'vuex';
import { Promise } from 'q';
// import {
//     ADMIN_COMMS_CREATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_UPDATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_SEND_TEST_EMAIL,
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE,
//     ADMIN_COMMS_DUMMY_DATA_SOURCES,
//     ADMIN_COMMS_DUMMY_DATA_SOURCE_META,
//     ADMIN_COMMS_FETCH_EMAIL_PROVIDERS
// } from '../../../../store/admin/action.type';
import { GET_USER_INFO } from '@/store/getters.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE,
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_GET_EMAIL_PROVIDERS
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE,
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE
// } from '../../../../store/admin/mutation.type';
import NoSSR from 'vue-no-ssr';
import uktCheckbox from '@/components/common/adm-check-box.vue';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import nunjucks from 'nunjucks';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import uktModal from '@/components/common/utk-modal.vue';
import admforminput from '@/components/common/form-input.vue';
import admCheckboxCard from '@/components/common/adm-checkbox-card.vue';
import adminCommsService from './../../../services/pointblank.service';
import newslettergrapeeditor from '../../../components/common/editor/newsletter-grape-editor.vue';
import beefreeeditor from '../../../components/common/beefree-editor.vue';
import editorModal from './editor-modal.vue';
import rawhtmleditor from '../../settings/page-editor/rawhtml-editor.vue';
import hash from 'object-hash';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import { getRoute } from '@/helper/get-route';

const DEFAULT_RAW_HTML_EDITOR_TEXT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body>
    <div>Sample email body</div>
</body>
</html>`;
const VJsoneditor = () => import('v-jsoneditor');

export default {
    components: {
        loader: loader,
        VJsoneditor,
        newslettergrapeeditor,
        beefreeeditor,
        'rawhtml-editor': rawhtmleditor,
        'editor-modal': editorModal,
        'no-ssr': NoSSR,
        'adm-form-input': admforminput,
        'ukt-modal': uktModal,
        'ukt-check-box': uktCheckbox,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'adm-checkbox-card': admCheckboxCard,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-dialog': NitrozenDialog,
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
        templateId: {
            type: String,
            default: ''
        },
        systemDisableEdit: {
            type: Boolean,
            default: false
        },
        templateData:{
            type:Object
        }
    },
    watch: {
        editorMode() {
            this.updateEditorMode();
        }
    },
    data() {
        return {
            seeVariablesInModal: false,
            showEditorModal: false,
            DEFAULT_RAW_HTML_EDITOR_TEXT: DEFAULT_RAW_HTML_EDITOR_TEXT,
            data: {
                editor_type: this.getInitialValue(),
                editor_meta: this.getInitialValue(null),
                html: {
                    template_type: this.getInitialValue('static'),
                    template: this.getInitialValue('')
                },
                subject: {
                    template_type: this.getInitialValue('static'),
                    template: this.getInitialValue('')
                }
            },
            formFields: ['html', 'subject'],
            dummyDataSources: [],
            selectedDataSource: 1000,
            dummyDataSourceMeta: null,
            pageLoading: false,
            pageError: false,
            error_text: null,
            showSendTestEmailModal: false,
            showImportDataModal: false,
            commsCounter: 0,
            disableSendEmailButton: false,
            emailSuccessfullySent: false,
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
                onChangeText: this.onVjsonEditorChange
            },
            editorMode: 'code',
            jsonEditorLoaded: false,
            emailTemplate: null,
            json: {
                hello: 'world'
            },
            subjectPreview: '',
            subjectPreviewHasError: false,
            subjectPreviewError: '',
            htmlPreview: '',
            htmlPreviewError: '',
            testEmail: {
                to: {
                    showerror: false,
                    value: '',
                    errortext: ''
                }
            },
            initialHash: '',
            selectedProvider:{
                showerror: false,
                value: ' ',
                errortext: ''
            },
            providersDropdownOptions:[],
            emailTemplateStore: {},
            emailTemplateToClone: {},
            emailProvidersStore: {},
            emailTemplateStore:{}
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
        //     emailTemplateStore: ADMIN_COMMS_GET_EMAIL_TEMPLATE,
        //     emailTemplateToClone: ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
            userData: GET_USER_INFO,
        //     emailProvidersStore: ADMIN_COMMS_GET_EMAIL_PROVIDERS
        }),
        getData(){
            return this.templateData
        }
    },
    mounted() {
        console.log(this.data);
                let data = {};
                this.fetchEmailProviders().then(emailProviders=>{
                    this.providersDropdownOptions=emailProviders;
                }).then(()=>{
                    this.fetchDefaultEmailProvider().then(defaultProvider=>{
                        this.providersDropdownOptions.unshift(...defaultProvider)
                    })
                }).catch(err=>{
                    console.log(err);
                })
        // this.$store.dispatch(ADMIN_COMMS_DUMMY_DATA_SOURCES, {}).then(data => {
        //     this.dummyDataSources = [
        //         {
        //             text: 'Select data source',
        //             value: 1000
        //         },
        //         ...data.map(i => {
        //             return {
        //                 text: i.name,
        //                 value: i.id
        //             };
        //         })
        //     ];
        // });

        try {
            if (this.isCloneMode) {
                data = cloneDeep(this.getData);
                this.disabledVariables = data.is_system;
            } else {
                data = cloneDeep(this.getData);
                console.log(this.templateData)
                this.disabledVariables =
                    data.meta &&
                    data.meta.type == 'cloned' &&
                    data.meta.is_system;
                this.editorMode = 'preview';
            }

            this.data.editor_type.value = this.data.editor_type.value || {};

            if (this.isCloneMode || this.isEditMode) {
                if (this.disabledVariables) {
                    this.editorMode = 'preview';
                } else {
                    this.editorMode = 'code';
                }
            }

            if (!this.isEditMode && !this.isCloneMode) {
                if (!this.$route.query.editor_type) {
                    this.$router.push(`/administrator/communication/email/templates`);
                }
                this.data.editor_type.value = this.$route.query.editor_type;
                this.editorMode = 'code';
            } else {
                if (data.editor_type) {
                    this.data.editor_type.value = data.editor_type;
                } else if (this.editor_type) {
                    this.data.editor_type.value = this.editor_type;
                } else {
                    this.data.editor_type.value = 'grapeJS';
                }
            }

            if (data.editor_meta) {
                this.data.editor_meta = this.data.editor_meta || {};
                this.data.editor_meta.value = data.editor_meta;
            }

            if (data.template_variables) {
                this.json = data.template_variables;
            }
            if (data.subject) {
                this.personalizationChecked =
                    data.subject.template_type == 'nunjucks';
                this.data.subject = {
                    template: this.getInitialValue(data.subject.template),
                    template_type: this.getInitialValue(
                        data.subject.template_type
                    )
                };
                this.renderSubjectTemplate();
            }
            if (
                this.data.editor_type.value == 'rawhtml' &&
                !(data.html && data.html.template)
            ) {
                data.html = data.html || {};
                data.html.template = this.DEFAULT_RAW_HTML_EDITOR_TEXT;
            }
            if (data.html) {
                this.personalizationChecked =
                    data.html.template_type == 'nunjucks';
                this.data.html = {
                    template: this.getInitialValue(data.html.template),
                    template_type: this.getInitialValue(data.html.template_type)
                };
                this.renderHtmlTemplate();
            }
            let email = this.getPrimaryVerifiedActiveEmail();
            if (email) {
                this.testEmail.to.value = email;
            }
            this.fetchEmailMatchEventSubscriptions().then(() => {
                this.jsonEditorLoaded = true;
            });

            this.getUserData();
            this.getApplicationData();
            this.updateIframe();
            this.initialHash = this.generateHashOfLocalState();
            console.log("hello")
        } catch (error) {
            // this.$snackbar.global.showError('Failed to load Email Template');
            console.log(error);
        }
    },
    updated() {
        this.updateEditorMode();
        this.updateIframe();
    },
    methods: {
        onVjsonEditorChange(obj) {
            try {
                let json = JSON.parse(obj);
                this.json = json;
                this.renderSubjectTemplate();
                this.renderHtmlTemplate();
            } catch (error) {}
        },
        generateHashOfLocalState() {
            console.log("mainbody",{
                ...this.data,
                ...{ json: this.json }
            })
            return hash({
                ...this.data,
                ...{ json: this.json }
            });
        },
        isFormUpdated() {
            return this.generateHashOfLocalState() !== this.initialHash;
        },
        getTemplateFromEditor() {
            if (this.data.editor_type.value == 'grapeJS') {
                this.getGrapeTemplate();
            } else if (this.data.editor_type.value == 'rawhtml') {
                this.getRawHtmlTemplate();
            } else if (this.data.editor_type.value == 'bee') {
                this.getBeeTemplate();
            }
        },
        getBeeTemplate() {
            this.$refs.beefree.save();
        },
        getRawHtmlTemplate() {
            this.renderHtmlTemplate();
            this.onCloseEditorModal();
        },
        updateIframe() {
            if (this.$refs['previewbody']) {
                let iframe = this.$refs['previewbody'];
                var iframedoc = iframe.contentDocument;
                iframedoc.open();
                iframedoc.write(this.htmlPreview);
                iframedoc.close();
                iframe.style.height = iframedoc.body.offsetHeight + 'px';
                iframe.onload = function() {
                    iframe.style.height = iframedoc.body.offsetHeight + 'px';
                };
            }
        },
        openSendtestEmailModalForBeeFree() {},
        onSaveBeFree(e) {
            this.data.editor_meta = this.data.editor_meta || {};
            this.data.editor_meta.value = e.jsonFile;
            this.data.html.template.value = e.htmlFile;
            this.renderHtmlTemplate();
            this.onCloseEditorModal();
        },
        getGrapeTemplate() {
            let template = this.$refs.grapeNewsletterEditor.saveEdits();
            this.data.html.template.value = template;
            this.renderHtmlTemplate();
            this.onCloseEditorModal();
        },
        openEditor() {
            this.showEditorModal = true;
        },
        onCloseEditorModal() {
            this.showEditorModal = false;
        },
        validateAndSave() {
            if (this.validate()) {
                return this.saveForm();
            }
        },
        fetchEmailProviders() {
            return adminCommsService
                .getEmailProvider()
                .then(({ data }) => {
                    let emailProviders = [
                        ...(data
                            ? data.items.map(v => ({
                                  text: v.name,
                                  value: v._id
                              }))
                            : []),
                    ];
                    this.selectedProvider.value = emailProviders[0].value || " ";
                    return emailProviders;
                });
        },
        fetchDefaultEmailProvider() {
            return adminCommsService
                .getDefaultEmailProvider()
                .then(({ data }) => {
                    console.log("p3",data)
                    let defaultProviders = [
                        ...(data
                            ? data.map(v => ({
                                  text: v.name,
                                  value: v._id
                              }))
                            : []),
                    ];
                    this.selectedProvider.value = defaultProviders[0].value || " ";
                    return defaultProviders;
                });
        },
        saveForm() {
            this.initialHash = this.generateHashOfLocalState();
            let { data } = this;
            if (this.data.editor_type == 'grapeJS') {
                let template = this.data.html.template.value;
                if (this.validateNunjucksString(template, this.json)) {
                    let htmlValue = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
​
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>
${template}
</body>
</html>`;
                    this.data.html.template.value = htmlValue;
                    this.renderHtmlTemplate();
                }
            }
            let finalObj = {
                template_variables: this.json,
                published: true,
                subject: {
                    template_type: this.data.subject.template_type.value,
                    template: this.data.subject.template.value
                },
                html: {
                    template_type: this.data.html.template_type.value,
                    template: this.data.html.template.value
                },
                editor_type: this.data.editor_type.value,
                ...(this.data.editor_meta && this.data.editor_meta.value
                    ? { editor_meta: this.data.editor_meta.value }
                    : {})
            };
            let nunjucksRegex = /.*\{\{.*\}\}.*/;
            if (!nunjucksRegex.test(finalObj.subject.template)) {
                finalObj.subject.template_type = 'static';
            }
            // this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {
            //     data: {
            //         ...this.emailTemplateStore,
            //         ...finalObj
            //     }
            // });
            return finalObj;
        },
        validate() {
            this.data.subject.template.showerror = false;
            this.data.subject.template.errortext = '';
            this.data.html.template.showerror = false;
            this.data.html.template.errortext = '';

            let isValid = true;
            isValid = !!this.data.subject.template_type.value;
            isValid = !!this.data.subject.template.value;
            console.log(isValid,this.data)
            if (this.data.subject.template_type.value == 'nunjucks') {
                isValid = this.validateNunjucksString(
                    this.data.subject.template.value,
                    this.json
                );
            }
            isValid = !!this.data.subject.template_type.value;
            isValid = !!this.data.subject.template.value;
            if (!this.data.subject.template.value) {
                this.data.subject.template.showerror = true;
                this.data.subject.template.errortext = 'Required Field';
            }
            isValid = !!this.data.html.template_type.value;
            isValid = !!this.data.html.template.value;
            if (!this.data.html.template.value) {
                this.data.html.template.showerror = true;
                this.data.html.template.errortext = `Click "Open editor" to design the email template`;
            }
            return isValid;
        },
        sendEmail() {
            this.testEmail.to = this.testEmail.to || {};
            this.testEmail.to.showerror = false;
            this.testEmail.to.errortext = '';
            this.selectedProvider.showerror = false;
            this.selectedProvider.errortext = '';
            this.emailSuccessfullySent = false;

            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (this.testEmail && this.testEmail.to && this.selectedProvider.value!==" ") {
                if (!emailRegex.test(this.testEmail.to.value)) {
                    this.testEmail.to.showerror = true;
                    this.testEmail.to.errortext = 'To email is invalid';
                } else {
                    this.disableSendMailButton = true;
                    let obj = {
                        data: [
                            {
                                to: this.testEmail.to.value,
                                ...this.json
                            }
                        ],
                        email: {
                            template: {
                                key: 'object',
                                value: {
                                    ...this.emailTemplateStore,
                                    published: true
                                }
                            },
                            provider:{
                                id:this.selectedProvider.value
                            }
                        }
                    };
                        adminCommsService.postSendSync(obj)
                        .then(data => {
                            this.emailSuccessfullySent = true;
                            this.commsCounter += 1;
                            if (this.commsCounter > 9) {
                                this.disableSendEmailButton = true;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            } else {
                if(!this.testEmail.to.value){
                this.testEmail.to = this.testEmail.to || {};
                this.testEmail.to.showerror = true;
                this.testEmail.to.errortext = 'To email is invalid';
                }

                if(this.selectedProvider.value===" "){
                    this.selectedProvider.showerror = true;
                    this.selectedProvider.errortext =
                        'Please select provider';
                }
            }
        },
        onSelectedDataSource(id) {
            if (id == 1000) {
                this.dummyDataSourceMeta = null;
            } else {
                this.$store
                    .dispatch(ADMIN_COMMS_DUMMY_DATA_SOURCE_META, {
                        params: { id: id }
                    })
                    .then(data => {
                        this.dummyDataSourceMeta = data;
                    });
            }
        },
        onClickReadMore(e) {
            e.stopPropagation();
        },
        importData() {
            if (
                this.selectedDataSource > 0 &&
                this.dummyDataSourceMeta &&
                this.selectedDataSource != 1000
            ) {
                this.json = { ...this.json, ...this.dummyDataSourceMeta };
            }
            let items = [];
            if (this.userChecked) {
                items.push('ref_user');
            }
            if (this.applicationChecked) {
                items.push('ref_application');
            }
            this.addTotemplate_variables(items);
            this.closeImportDataModal();
        },
        checkmarkData(items) {
            let userChecked = items.find(item => item == 'User');
            this.userChecked = userChecked ? true : false;

            let applicationChecked = items.find(item => item == 'Application');
            this.applicationChecked = applicationChecked ? true : false;
        },
        openImportDataModal() {
            this.showImportDataModal = true;
        },
        closeImportDataModal() {
            this.showImportDataModal = false;
        },
        updateEditorMode() {
            this.options.mode = this.editorMode;
        },
        fetchEmailMatchEventSubscriptions() {
            let id = this.isEditMode
                ? this.$route.params.id
                : this.isCloneMode
                ? this.$route.query.clone
                : null;
            if (id) {
                return adminCommsService
                    .getEventSubscription({
                        params: {
                            limit: 200,
                            page: 1,
                            query: JSON.stringify({
                                'template.email.template': id
                            })
                        }
                    })
                    .then(res => res.data)
                    .then(data => {
                        if (data.total > 0) {
                            this.editorMode = 'preview';
                        }
                    });
            }
            return Promise.resolve();
        },
        validateNunjucksString(templateString, json) {
            let template = '';
            let templateValid = true;
            try {
                template = nunjucks.compile(templateString);
                template = template.render(json);
            } catch (err) {
                templateValid = false;
            }
            return templateValid;
        },
        renderHtmlTemplate() {
            let template = '';
            let templateValid = true;
            if (this.data.html.template_type.value == 'nunjucks') {
                try {
                    template = nunjucks.compile(this.data.html.template.value);
                    template = template.render(this.json);
                } catch (err) {
                    templateValid = false;
                    this.htmlPreview = `Invalid html template`;
                    this.htmlPreviewError = err.html;
                    this.subjectPreviewHasError = true;
                }
            } else {
                template = this.data.html.template.value;
            }
            if (templateValid) {
                this.subjectPreviewHasError = false;
                this.htmlPreviewError = '';
                this.htmlPreview = template;
            }
        },
        renderSubjectTemplate() {
            let template = '';
            let templateValid = true;
            if (this.data.subject.template_type.value == 'nunjucks') {
                try {
                    template = nunjucks.compile(
                        this.data.subject.template.value
                    );
                    template = template.render(this.json);
                } catch (err) {
                    templateValid = false;
                    this.subjectPreview = `Invalid subject`;
                    this.subjectPreviewError = err.message;
                    this.subjectPreviewHasError = true;
                }
            } else {
                template = this.data.subject.template.value;
            }
            if (templateValid) {
                this.subjectPreviewHasError = false;
                this.subjectPreviewError = '';
                this.subjectPreview = template;
            }
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
        getUserData() {
            let ref_user = pick(this.userData.user, ['firstName', 'lastName']);

            this.userData.user.phone_numbers
                ? (ref_user.phoneNumber = this.getPrimaryVerifiedActivePhoneNumber())
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
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
                },
                logo: {
                    secure_url:
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
                }
            };
            this.ref_application_data = ref_application;
        },
        addTotemplate_variables(items) {
            let ref_user = pick(this.userData.user, ['firstName', 'lastName']);

            this.userData.user.phone_numbers
                ? (ref_user.phoneNumber = this.getPrimaryVerifiedActivePhoneNumber())
                : null;
            this.userData.user.emails
                ? (ref_user.email = this.getPrimaryVerifiedActiveEmail())
                : null;

            let ref_application = {
                name: 'Lorem ipsum dolor sit amet',
                banner: {
                    secure_url:
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
                },
                logo: {
                    secure_url:
                        'https://res.cloudinary.com/dwzm9bysq/image/upload/v1584701476/production/system/pointblank/fynd_logo_qgupcq.png'
                }
            };

            let values = {
                ref_user,
                ref_application
            };
            delete this.json.hello;
            delete this.json.ref_user;
            delete this.json.ref_application;
            items.forEach(item => {
                this.json[item] = values[item];
            });
            this.json = cloneDeep(this.json);
        },
        onError(err) {
            // console.log('error',err);
        },
        selectTemplateEngine(personalizationChecked) {
            if (personalizationChecked) {
                this.data.subject.template_type.value = 'nunjucks';
                this.data.html.template_type.value = 'nunjucks';
            } else {
                this.data.subject.template_type.value = 'static';
                this.data.html.template_type.value = 'static';
            }
            this.personalizationChecked = personalizationChecked;
            this.renderSubjectTemplate();
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        openSendTestEmailModal() {
            if (typeof this.json != 'object') {
                this.error_text = 'Please provide json in the above editor';
            } else {
                this.error_text = '';
                this.testEmail.to.showerror = false;
                this.testEmail.to.errortext = '';

                this.selectedProvider.showerror = false;
                this.selectedProvider.errortext = '';

                this.emailSuccessfullySent = false;
                this.showSendTestEmailModal = true;
                this.disableSendEmailButton = false;
                this.openTestEmailDialog()
            }
        },
        closeSendTestEmailModal() {
            this.showSendTestEmailModal = false;
        },
        removeEmptyFields(obj) {
            let keys = Object.keys(obj);
            keys.forEach(key => {
                if (
                    ['object', 'array', 'string'].indexOf(typeof obj[key]) !=
                        -1 &&
                    isEmpty(obj[key])
                ) {
                    delete obj[key];
                }
            });
        },

        openTestEmailDialog() {
            this.$refs['dialog'].open({
                width: '500px',
                height: '450px',
                showCloseButton: true,
                dismissible: true,
            });
        },
    }
};
</script>
