<template>
    <div class="supportCommuincationpanel">
        <div class="container">
            <div class="support-communication">
                <div class="toggle">
                    <label class="label">
                        Support Communication
                        <span class="max-entries"> (Max : 9 Entries) </span>
                    </label>
                    <div class="addContact-btn-container">
                        <nitrozen-button
                            class="addContact-btn"
                            v-stroke-btn
                            :rounded="false"
                            :theme="'secondary'"
                            @click="addContact()"
                        >
                            <inline-svg
                                class="plus-btn"
                                :src="'plus-blue'"
                            ></inline-svg>
                            Add Support Details
                        </nitrozen-button>

                        <nitrozen-toggle-btn
                            v-model="showCommunicationinfo"
                        ></nitrozen-toggle-btn>
                    </div>
                </div>
                <div
                    v-if="supportCommunication.length"
                    class="contact_container"
                >
                    <draggable v-model="supportCommunication">
                        <transition-group>
                            <div
                                v-for="(item, index) in supportCommunication"
                                :key="`${index}`"
                                class="contact-container"
                            >
                                <div class="draggable-icon">
                                    <inline-svg
                                        :src="'drag_indicator'"
                                    ></inline-svg>
                                </div>
                                <div class="contact-container-section">
                                    <div class="contact-container-section-1">
                                        <div
                                            class="contact-container-sub-section-1"
                                        >
                                            <nitrozen-checkbox
                                                class="checkbox"
                                                v-model="item.enabled"
                                            ></nitrozen-checkbox>
                                            <span>{{ item.title }}</span>
                                            <span
                                                v-if="
                                                    item.type === 'phone_number'
                                                "
                                                class="max-entries"
                                            >
                                                (Phone Number)
                                            </span>
                                            <span
                                                v-if="item.type === 'email'"
                                                class="max-entries"
                                            >
                                                (Email)
                                            </span>
                                            <span
                                                v-if="item.type === 'link'"
                                                class="max-entries"
                                            >
                                                (Link)
                                            </span>
                                        </div>
                                        <div
                                            class="contact-container-sub-section-2"
                                        >
                                            <div
                                                class="editContact"
                                                @click="
                                                    editCommincationDetail(
                                                        item,
                                                        index
                                                    )
                                                "
                                            >
                                                <inline-svg
                                                    :src="'edit'"
                                                ></inline-svg>
                                            </div>

                                            <div
                                                class="deleteContact"
                                                @click="
                                                    deleteCommincationDetail(
                                                        index
                                                    )
                                                "
                                            >
                                                <inline-svg
                                                    :src="'delete'"
                                                ></inline-svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="contact-container-section-2">
                                        <nitrozen-input
                                            class="input"
                                            label="Value"
                                            :disabled="true"
                                            v-model="item.value"
                                        ></nitrozen-input>

                                        <nitrozen-input
                                            class="decs"
                                            label="Description"
                                            :disabled="true"
                                            v-model="item.description"
                                        ></nitrozen-input>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div v-else class="empty-contact">
                    <inline-svg :src="'not-found'"></inline-svg>
                    <span class="empty-contact-message"
                        >No contacts to show.
                        <span class="empty_contact_message"
                            >Add contacts</span
                        ></span
                    >
                </div>
                <div
                    v-if="enabledToAddContact && isLimitExceed"
                    class="addSupportDetail"
                >
                    <div class="addSupportDetail-right">
                        <div class="header">
                            <span class="title">Add Support</span>
                            <div class="close-btn" @click="closeAddSupport()">
                                <inline-svg
                                    class="close-btn-svg"
                                    :src="'cross-black'"
                                ></inline-svg>
                            </div>
                        </div>
                        <div class="SupportDetail-container">
                            <div class="SupportDetail-sub-conatainer">
                                <span class="sub-heading">Support contact</span>
                                <div
                                    v-if="!showPreview"
                                    class="preview-icon"
                                    @click="showSupportPreview()"
                                >
                                    <inline-svg
                                        class="preview-icon"
                                        :src="'preview-icon'"
                                    ></inline-svg>
                                </div>
                                <div
                                    v-if="showPreview"
                                    class="preview-icon"
                                    @click="() => (showPreview = !showPreview)"
                                >
                                    <inline-svg
                                        class="preview-icon"
                                        :src="'visibility_off'"
                                    ></inline-svg>
                                </div>
                            </div>
                            <div v-if="showPreview" class="preview">
                                <span class="preview-header">Preview</span>
                                <div class="preview-conatiner">
                                    <div class="preview-icon">
                                        <span
                                            v-if="
                                                selectedSupport ===
                                                    'phone_number'
                                            "
                                        >
                                            <inline-svg
                                                class="phone-icon"
                                                :src="'phone-icon'"
                                            ></inline-svg>
                                        </span>
                                        <span
                                            v-if="selectedSupport === 'email'"
                                        >
                                            <inline-svg
                                                class="email-icon"
                                                :src="'email-icon'"
                                            ></inline-svg>
                                        </span>
                                        <span v-if="selectedSupport === 'link'">
                                            <inline-svg
                                                class="faqLink-icon"
                                                :src="'faqLink-icon'"
                                            ></inline-svg>
                                        </span>

                                        <span class="preview-title"
                                            >{{ supportTitle }} :
                                            {{ supportValue }}</span
                                        >
                                    </div>
                                    <div class="preview-description">
                                        {{ supportDecs }}
                                    </div>
                                </div>
                            </div>
                            <div class="SupportDetail-field">
                                <nitrozen-dropdown
                                    class="dropdown"
                                    :searchable="false"
                                    label="Type"
                                    v-model="selectedSupport"
                                    :items="typeofSupport"
                                    :placeholder="'Select Type'"
                                ></nitrozen-dropdown>
                                <nitrozen-input
                                    class="inpurField"
                                    label="Title"
                                    :maxlength="24"
                                    :showTooltip="true"
                                    :tooltipText="
                                        `Title for displaying to the seller, e.g. 'Phone Number'`
                                    "
                                    placeholder="Title goes here"
                                    v-model="supportTitle"
                                ></nitrozen-input>
                                <nitrozen-input
                                    class="inpurField"
                                    label="Value"
                                    :maxlength="250"
                                    placeholder="Values goes here"
                                    v-model="supportValue"
                                ></nitrozen-input>
                                <nitrozen-error
                                    class="error"
                                    :style="{
                                        visibility:
                                            supportValue &&
                                            !validateSupportValue(supportValue)
                                                ? 'visible'
                                                : 'hidden'
                                    }"
                                    >{{ 'Invalid value' }}</nitrozen-error
                                >

                                <div class="inpurField-decs">
                                    <div class="decs">
                                        Description
                                        <span
                                            >{{ supportDecs.length }}/300</span
                                        >
                                    </div>
                                    <textarea
                                        type="text"
                                        class="decs-textarea"
                                        :maxlength="300"
                                        placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                                        v-model="supportDecs"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="support-btn-container">
                            <nitrozen-button
                                class="cancel-btn"
                                v-stroke-btn
                                :rounded="false"
                                :theme="'secondary'"
                                @click="closeAddSupport()"
                            >
                                Cancel
                            </nitrozen-button>
                            <nitrozen-button
                                class="saveSupportDetail-btn"
                                v-flat-btn
                                :rounded="false"
                                :theme="'secondary'"
                                @click="addSupportDetail()"
                            >
                                Save
                            </nitrozen-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenToggleBtn,
    NitrozenCheckBox,
    NitrozenTooltip,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import draggable from 'vuedraggable';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import { PageHeader } from '@/components/common';
import SupportService from '../../../services/support.service';
import emailValidator from 'email-validator';

export default {
    name: 'support-communication',
    props: ['type', 'savedata'],
    components: {
        PageHeader,
        'inline-svg': inlineSvgVue,
        NitrozenButton,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-input': NitrozenInput,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-error': NitrozenError,
        draggable
    },
    data() {
        return {
            supportCommunication: [],
            showCommunicationinfo: false,
            selectedSupport: '',
            supportTitle: '',
            supportValue: '',
            supportDecs: '',
            enabledToAddContact: false,
            isLimitExceed: false,
            warningPopUp: false,
            integration: {
                type: undefined
            },
            support_email: {
                value: '',
                description: '',
                enabled: false
            },
            support_phone: {
                value: '',
                description: '',
                enabled: false
            },
            support_faq: {
                value: '',
                description: '',
                enabled: false
            },
            generalConfigData: {},
            editData: {},
            enabledToAddContact: false,
            showPreview: false,
            typeofSupport: [
                { value: 'phone_number', text: 'Phone Number' },
                { value: 'email', text: 'Email' },
                { value: 'link', text: 'Link' }
            ],
            selectedSupport: '',
            supportTitle: '',
            supportValue: '',
            supportDecs: ''
        };
    },
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        closeAddSupport() {
            this.enabledToAddContact = false;
            this.showPreview = false;
        },
        addSupportDetail() {
            if (
                !this.selectedSupport ||
                !this.supportTitle ||
                !this.supportValue ||
                !this.supportDecs
            ) {
                return this.$snackbar.global.showError(
                    'Please provide all details'
                );
            }
            if (!this.validateSupportValue(this.supportValue)) {
                return this.$snackbar.global.showError(
                    'Please provide correct details'
                );
            }
            let contactDetail = {
                type: this.selectedSupport,
                title: this.supportTitle,
                value: this.supportValue,
                description: this.supportDecs,
                enabled: true
            };
            if (this.editContact) {
                let selectedContact = this.supportCommunication.find(
                    (item, index) => {
                        if (index === this.editSelectedIndex) {
                            this.supportCommunication[
                                this.editSelectedIndex
                            ].type = this.selectedSupport;
                            this.supportCommunication[
                                this.editSelectedIndex
                            ].title = this.supportTitle;
                            this.supportCommunication[
                                this.editSelectedIndex
                            ].value = this.supportValue;
                            this.supportCommunication[
                                this.editSelectedIndex
                            ].description = this.supportDecs;
                        }
                    }
                );
                this.enabledToAddContact = false;
                this.save();
                return this.supportCommunication;
            }
            this.supportCommunication.push(contactDetail);
            this.editContact = false;
            this.enabledToAddContact = false;
            this.save();
            return this.supportCommunication;
        },
        showSupportPreview() {
            if (
                this.selectedSupport &&
                this.supportTitle &&
                this.supportValue &&
                this.supportDecs
            ) {
                return (this.showPreview = !this.showPreview);
            }
            return this.$snackbar.global.showError('Please enter all details');
        },
        validateSupportValue(supportValue) {
            if (this.selectedSupport === 'phone_number') {
                const re = /^\+?([0-9]{2})\)?[- ]?([0-9]{8,10})$/;
                return (
                    supportValue &&
                    supportValue.length &&
                    re.test(supportValue.trim())
                );
            }
            if (this.selectedSupport === 'email') {
                return emailValidator.validate(
                    String(supportValue)
                        .toLowerCase()
                        .trim()
                );
            }
            if (this.selectedSupport === 'link') {
                const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
                return (
                    supportValue &&
                    supportValue.length &&
                    re.test(supportValue.trim())
                );
            }
        },
        addContact() {
            this.resetValues();
            this.enabledToAddContact = true;
            if (this.supportCommunication.length < 9) {
                this.isLimitExceed = true;
                return;
            } else {
                return this.$snackbar.global.showError(
                    'limit to add support contact is exceeds'
                );
            }
        },
        DisableToAddContact(value) {
            this.enabledToAddContact = value;
        },
        resetValues() {
            (this.selectedSupport = ''),
                (this.supportTitle = ''),
                (this.supportValue = ''),
                (this.supportDecs = ''),
                (this.editSelectedIndex = ''),
                (this.isLimitExceed = false);
        },
        editCommincationDetail(contact, selectedIndex) {
            this.enabledToAddContact = true;
            this.isLimitExceed = true;
            this.editContact = true;
            (this.selectedSupport = contact.type),
                (this.supportTitle = contact.title),
                (this.supportValue = contact.value),
                (this.supportDecs = contact.description),
                (this.editSelectedIndex = selectedIndex);
        },
        deleteCommincationDetail(selectedIndex) {
            this.supportCommunication.splice(selectedIndex, 1);
            this.save();
        },

        setPageData(data) {
            this._id = data._id;
            this.isDRIenabled = data.enable_dris;
            this.showCommunicationinfo =
                data.show_communication_info || this.showCommunicationinfo;
            this.showSupportdris =
                data.show_support_dris || this.showSupportdris;
            this.available_integration =
                data.available_integration || this.available_integration;
            this.integration.type =
                data.integration && data.integration.type
                    ? data.integration.type
                    : undefined;
            this.supportCommunication = data.support_communication
                ? data.support_communication
                : [];
            if (data.support_phone) {
                let phone = data.support_phone;
                this.support_phone.value =
                    phone.value || this.support_phone.value;
                this.support_phone.description =
                    phone.description || this.support_phone.description;
                this.support_phone.enabled =
                    phone.enabled || this.support_phone.enabled;
            }
            if (data.support_email) {
                let email = data.support_email;
                this.support_email.value =
                    email.value || this.support_email.value;
                this.support_email.description =
                    email.description || this.support_email.description;
                this.support_email.enabled =
                    email.enabled || this.support_email.enabled;
            }

            if (data.support_faq) {
                let faq = data.support_faq;
                this.support_faq.value = faq.value || this.support_faq.value;
                this.support_faq.description =
                    faq.description || this.support_faq.description;
                this.support_faq.enabled =
                    faq.enabled || this.support_faq.enabled;
            }
        },
        save() {
            if (this.type === 'platform') {
                if (this.integration && !this.integration.type) {
                    return this.$snackbar.global.showError(
                        'Please select an integration'
                    );
                }
            }
            let data = {}
            if (this.type === 'platform') {
                data = {
                    _id: this._id,
                    show_communication_info: this.showCommunicationinfo,
                    show_support_dris:
                        this.showSupportdris && this.isDRIenabled,
                    support_email: this.support_email,
                    support_phone: this.support_phone,
                    support_faq: this.support_faq,
                    integration: this.integration,
                    support_communication: this.supportCommunication,
                    type: this.type
                };
            }
            if (this.type === 'partner') {
                data = {
                    _id: this._id,
                    show_communication_info: this.showCommunicationinfo,
                    support_communication: this.supportCommunication,
                    type: this.type
                };
            }
            SupportService.setGeneralConfig(data)
                .then((response) => {
                    this.enabledToAddContact = false;
                    this.setPageData(response.data);
                    this.$snackbar.global.showSuccess(
                        'Settings changed successfully'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError(`${err.response.data.message}`);
                });
        },
        getGeneralConfiguration() {
            SupportService.getGeneralConfig(this.type)
                .then((response) => {
                    this.generalConfigData = response.data;
                    this.setPageData(response.data);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Failed to get configuration data'
                    );
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';

.supportCommuincationpanel {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
}
.header {
}

.container {
    top: 56.5px;
    background: #ffffff;
    border-radius: 12px;
    .support-communication {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        .toggle {
            display: flex;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
            .label {
                .max-entries {
                    color: #9b9b9b;
                    font-weight: 400;
                    margin-left: 4px;
                }
            }
            .addContact-btn-container {
                display: flex;
                align-items: center;
                .addContact-btn {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    .btn-label {
                        font-family: Inter, sans-serif;
                        font-style: normal;
                        font-weight: 700;
                        font-size: 14px;
                        color: #2e31be;
                    }
                    .plus-btn {
                        margin-right: 7px;
                        width: 17px;
                        height: 30px;
                    }
                }
            }
        }
        .label {
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            display: flex;
            align-items: center;
            color: #000000;
        }
    }
    .support-managers {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        padding: 16px 24px;
        margin-top: 24px;
        .nitrozen-inline-svg {
            height: 13px;
            margin-left: 11px;
        }
        .label {
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            color: #41434c;
        }
    }
    .service-tool {
        margin-top: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        .toggle {
            display: flex;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
        }
        .label {
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            color: #41434c;
        }
    }
    .contact-container {
        display: flex;
        flex-direction: row;
        padding: 24px 24px 24px 20px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        margin: 16px 24px;
        .draggable-icon {
            display: flex;
            align-items: center;
        }
        .contact-container-section {
            margin-left: 24px;
            width: 100%;
            .contact-container-section-1 {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .contact-container-sub-section-1 {
                    display: flex;
                    flex-direction: row;
                    .checkbox {
                        display: flex;
                        align-items: center;
                    }
                    .max-entries {
                        color: #9b9b9b;
                        font-weight: 400;
                        margin-left: 4px;
                    }
                }
                .contact-container-sub-section-2 {
                    display: flex;
                    flex-direction: row;
                    .editContact {
                        cursor: pointer;
                    }
                    .deleteContact {
                        margin-left: 16px;
                        cursor: pointer;
                    }
                }
            }
            .contact-container-section-2 {
                display: flex;
                flex-direction: row;
                margin-top: 18px;
                .input {
                    width: 333px;
                }
                .decs {
                    margin-left: 36px;
                    width: 100%;
                }
            }
        }

        .radio {
            display: flex;
            align-items: center;
        }

        .icon {
            display: flex;
            align-items: center;
        }
    }
    .tool-container {
        .default-tool {
            display: flex;
            padding: 16px 30px;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            margin: 16px 24px;
            justify-content: space-between;
            margin-bottom: 24px;
        }
    }
}
.empty-contact {
    padding: 6px 0px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .empty-contact-message {
        font-family: Inter, sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: #666666;
        .empty_contact_message {
            font-weight: 600;
            color: #000000;
        }
    }
}
.addSupportDetail {
    height: 100%;
    width: 100%;
    z-index: 13;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(51, 51, 51, 0.7);
    .addSupportDetail-right {
        position: absolute;
        right: 0;
        z-index: 14;
        height: 100%;
        width: 35%;
        background: #ffffff;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 24px 26px;
            border-bottom: 1px solid #e0e0e0;
            .title {
                font-family: Inter, sans-serif;
                font-style: normal;
                font-weight: 700;
                font-size: 20px;
                line-height: 31px;
                color: #41434c;
            }
            .close-btn {
                cursor: pointer;
            }
        }
        .SupportDetail-container {
            margin: 24px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;

            .SupportDetail-sub-conatainer {
                padding: 16px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                .sub-heading {
                    font-family: Inter, sans-serif;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 140%;
                    color: #000000;
                }
                .preview-icon {
                    cursor: pointer;
                }
            }
            .preview {
                padding: 16px;
                .preview-header {
                    font-family: Inter, sans-serif;
                    font-style: normal;
                    font-weight: 600;
                    font-size: 12px;
                    line-height: 31px;
                    color: #41434c;
                }
                .preview-conatiner {
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    padding: 16px;
                    .preview-icon {
                        display: flex;
                        align-items: center;
                        .preview-title {
                            font-family: Inter, sans-serif;
                            font-style: normal;
                            font-weight: 600;
                            font-size: 14px;
                            line-height: 140%;
                            color: #41434c;
                            margin-left: 10px;
                        }
                    }
                    .preview-description {
                        font-family: Inter, sans-serif;
                        font-style: normal;
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 18px;
                        color: #828282;
                        margin-top: 14px;
                    }
                }
            }
            .SupportDetail-field {
                padding: 16px;

                .dropdown {
                }
                .inpurField {
                    margin-top: 14px;
                }
                .inpurField-decs {
                    .decs {
                        font-family: Inter, sans-serif;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 160%;
                        color: #9b9b9b;
                        display: flex;
                        justify-content: space-between;
                    }
                    .decs-textarea {
                        height: 60px;
                        border-color: #9b9b9b;
                        width: 93%;
                        border: 1px solid #e0e0e0;
                        border-radius: 4px;
                        margin-top: 8px;
                        padding: 12px;
                    }
                }
            }
        }
        .support-btn-container {
            display: flex;
            justify-content: flex-end;
            padding: 16px 60px;
            bottom: 16px;
            position: absolute;
            right: 0px;
            .cancel-btn {
                margin-right: 16px;
            }
        }
    }
}
::v-deep .page-header {
    width: 100% !important;
}
</style>
