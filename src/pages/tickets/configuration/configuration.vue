<template>
    <div class="panel">
        <div>
            <page-header
                title="Configuration"
                :showBackButton="false"
                @backClick="$router.push({ name: 'support' })"
            >
                <div class="btn-container">
                    <nitrozen-button
                        class="save-btn"
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        @click="save()"
                    >
                        Save
                    </nitrozen-button>
                </div>
            </page-header>
            <div class="container">
                <div class="support-communication">
                    <div class="toggle">
                        <label class="label">
                            Support Communication
                            <span class="max-entries"> (Max : 9 Entries) </span>
                        </label>
                        <div class="addContact-btn-container">
                            <!-- <div class="addContact-btn" @click="addContact"> -->
                            <!-- 
                                <span class="btn-label">
                                    Add Support Details
                                </span> -->
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
                            <!-- </div> -->

                            <nitrozen-toggle-btn
                                v-model="showCommunicationinfo"
                            ></nitrozen-toggle-btn>
                        </div>
                    </div>
                    <div
                        v-if="supportCommunication.length"
                        class="contact_container"
                    >
                        <!-- @change="handleDraggrable" -->
                        <draggable v-model="supportCommunication">
                            <transition-group>
                                <div
                                    v-for="(item,
                                    index) in supportCommunication"
                                    :key="`${index}`"
                                    class="contact-container"
                                >
                                    <!-- <div> -->
                                    <div class="draggable-icon">
                                        <inline-svg
                                            :src="'drag_indicator'"
                                        ></inline-svg>
                                    </div>
                                    <div class="contact-container-section">
                                        <div
                                            class="contact-container-section-1"
                                        >
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
                                                        item.type ===
                                                            'phone_number'
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
                                        <div
                                            class="contact-container-section-2"
                                        >
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
                                    <!-- </div> -->
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
                </div>

                <div v-if="isDRIenabled" class="support-managers">
                    <div>
                        <label class="label"> Show Support Managers </label>
                        <nitrozen-tooltip :position="'top'">
                            <span class="tooltip-label"
                                >If enabled, the name and contact no. of the
                                dedicated managers will be visible to the
                                merchants</span
                            >
                        </nitrozen-tooltip>
                    </div>
                    <nitrozen-toggle-btn
                        class="toggle"
                        v-model="showSupportdris"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="service-tool">
                    <div class="toggle">
                        <label class="label">
                            Preferred Customer Service Tool
                        </label>
                        <!-- <nitrozen-toggle-btn
                            v-model="integration.enabled"
                        ></nitrozen-toggle-btn> -->
                    </div>
                    <div class="tool-container">
                        <div class="default-tool">
                            <div
                                class="left-container"
                                :class="isAvailable('default') ? '' : 'muted'"
                            >
                                <div class="radio-btn">
                                    <nitrozen-radio
                                        :name="'default'"
                                        :radioValue="'default'"
                                        v-model="integration.type"
                                        @change="switchIntegration($event, 'default')"
                                    ></nitrozen-radio>
                                </div>
                                <div class="fynd-icon">
                                    <inline-svg
                                        :src="'fynd-platform-icon'"
                                    ></inline-svg>
                                </div>
                                <div class="tools-type">
                                    <span class="tool-heading"
                                        >Fynd Platform</span
                                    >
                                    <span class="tool-decs"
                                        >Fynd Platform's default CRM tool for
                                        handling tickets</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('default')"
                                class="right-container"
                            ></div>
                            <div
                                v-if="!isAvailable('default')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(default_integration)"
                                >
                                    Configure
                                </nitrozen-button>
                            </div>
                            <!-- <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div> -->
                        </div>
                        <div class="default-tool">
                            <div
                                class="left-container"
                                :class="isAvailable('freshdesk') ? '' : 'muted'"
                            >
                                <div class="radio-btn">
                                    <nitrozen-radio
                                        :name="'freshdesk'"
                                        :radioValue="'freshdesk'"
                                        v-model="integration.type"
                                        @change="switchIntegration($event, 'freshdesk')"
                                    ></nitrozen-radio>
                                </div>
                                <div class="fynd-icon">
                                    <inline-svg :src="'freshdesk'"></inline-svg>
                                </div>
                                <div class="tools-type">
                                    <span class="tool-heading"
                                        >Freshdesk Integrations</span
                                    >
                                    <span class="tool-decs"
                                        >An advanced customer service tool
                                        widely used by all types of
                                        businesses</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('freshdesk')"
                                class="right-container"
                            >
                                <div class="config-btn-conatiner"></div>
                            </div>
                            <!-- <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div> -->
                            <div
                                v-if="!isAvailable('freshdesk')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(freshdesk_integration)"
                                >
                                    Configure
                                </nitrozen-button>
                            </div>
                        </div>
                        <div class="default-tool">
                            <div
                                class="left-container"
                                :class="isAvailable('kapture') ? '' : 'muted'"
                            >
                                <div class="radio-btn">
                                    <nitrozen-radio
                                        :name="'kapture'"
                                        :radioValue="'kapture'"
                                        v-model="integration.type"
                                        @change="switchIntegration($event, 'kapture')"
                                    ></nitrozen-radio>
                                </div>
                                <div class="fynd-icon">
                                    <inline-svg :src="'kapture'"></inline-svg>
                                </div>
                                <div class="tools-type">
                                    <span class="tool-heading"
                                        >Kapture Integrations</span
                                    >
                                    <span class="tool-decs"
                                        >An enterprise-grade CRM with
                                        ready-to-use integrations</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('kapture')"
                                class="right-container"
                            >
                                <div class="config-btn-conatiner"></div>
                            </div>
                            <!-- <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div> -->
                            <div
                                v-if="!isAvailable('kapture')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(kapture_integration)"
                                >
                                    Configure
                                </nitrozen-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                <span v-if="selectedSupport === 'phone_number'">
                                    <inline-svg
                                        class="phone-icon"
                                        :src="'phone-icon'"
                                    ></inline-svg>
                                </span>
                                <span v-if="selectedSupport === 'email'">
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
                            :tooltipText="`Title for displaying to the seller, e.g. 'Phone Number'`"
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
                                <span>{{ supportDecs.length }}/300</span>
                            </div>
                            <textarea
                                type="text"
                                class="decs-textarea"
                                :maxlength="300"
                                placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                                v-model="supportDecs"
                            />
                        </div>

                        <!-- <nitrozen-input
                            class="inpurField"
                            label="Description"
                            :maxlength="300"
                            placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                            v-model="supportDecs"
                        ></nitrozen-input> -->
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
        <pop-up
            v-if="warningPopUp"
            :infoText="popupDecs"
            :textHeading="popupHeading"
            @cancel="cancelPopup"
            @confirm="confirmPopUp"
        />
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
import { PageHeader } from '@/components/common';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../services/support.service';
import emailValidator from 'email-validator';
import PopUp from '../configuration/common/PopUp.vue';
import { kapture } from '../../../auto_gen/svgs';
import draggable from 'vuedraggable';
import index from 'vue-no-ssr';
export default {
    name: 'category-list',
    components: {
        PageHeader,
        'pop-up': PopUp,
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
            showCommunicationinfo: false,
            isDRIenabled: false,
            _id: undefined,
            showSupportdris: false,
            available_integration: [],
            integration: {
                // enabled: false,
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
            kapture_integration: 'kapture',
            freshdesk_integration: 'freshdesk',
            default_integration: 'default',
            enabledToAddContact: false,
            showPreview: false,
            typeofSupport: [
                { value: 'phone_number', text: 'Phone Number' },
                { value: 'email', text: 'Email' },
                { value: 'link', text: 'Link' }
            ],
            supportCommunication: [],
            selectedSupport: '',
            supportTitle: '',
            supportValue: '',
            supportDecs: '',
            editSelectedIndex: '',
            editContact: false,
            isLimitExceed: false,
            warningPopUp: false,
            selectedIntegrationType:''
        };
    },
    watch: {
        // checkLimit(){
        //     if(this.supportCommunication.length <= 9){
        //         this.isLimitExceed = true
        //     }
        // }
    },
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        switchIntegration(integration) {
            this.selectedIntegrationType = integration
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `You are trying to switch to another integration? This action will remove the current integration.`;
        },
        confirmPopUp() {
            this.integration.type = this.selectedIntegrationType
            this.warningPopUp = false;
        },
        cancelPopup(){
            this.integration.type = ''
            this.warningPopUp = !this.warningPopUp
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
        closeAddSupport() {
            this.enabledToAddContact = false;
            this.showPreview = false;
        },
        resetValues() {
            (this.selectedSupport = ''),
                (this.supportTitle = ''),
                (this.supportValue = ''),
                (this.supportDecs = ''),
                (this.editSelectedIndex = ''),
                (this.isLimitExceed = false);
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
        // validateEmail(email) {
        //     return emailValidator.validate(
        //         String(email)
        //             .toLowerCase()
        //             .trim()
        //     );
        // },
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
        // validatelink(link) {
        //     const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        //     return link && link.length && re.test(link.trim());
        // },
        isAvailable(integration_name) {
            return this.available_integration.includes(integration_name);
        },
        // validateEntries(info, type) {
        //     if (info.enabled) {
        //         if (!info.value) {
        //             this.$snackbar.global.showError(
        //                 'Please enter the value for your enabled communication channel'
        //             );
        //             return false;
        //         }
        //         if (!info.description) {
        //             this.$snackbar.global.showError(
        //                 'Please enter the description for your enabled communication channel'
        //             );
        //             return false;
        //         }
        //         if (type == 'email' && !this.validateEmail(info.value)) {
        //             this.$snackbar.global.showError('Invalid email id');
        //             return false;
        //         }
        //         if (type == 'phone' && !this.validatePhone(info.value)) {
        //             this.$snackbar.global.showError('Invalid phone number');
        //             return false;
        //         }
        //         if (type == 'faq' && !this.validatelink(info.value)) {
        //             this.$snackbar.global.showError('Invalid FAQ link');
        //             return false;
        //         }
        //     }
        //     return true;
        // },
        configure(type) {
            this.$router.push({
                path: `/administrator/support/configuration/integration/${type}`
            });
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
            this.save()
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
            if(!this.validateSupportValue(this.supportValue)){
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
                this.save()
                return this.supportCommunication;
            }
            this.supportCommunication.push(contactDetail);
            this.editContact = false;
            this.enabledToAddContact = false;
            this.save()
            return this.supportCommunication;
        },
        save() {
            // if (!this.validateEntries(this.support_email, 'email')) return;
            // if (!this.validateEntries(this.support_phone, 'phone')) return;
            // if (!this.validateEntries(this.support_faq, 'faq')) return;
            if(this.integration && !this.integration.type){
                return this.$snackbar.global.showError('Please select an integration');
            }
            let data = {
                _id: this._id,
                show_communication_info: this.showCommunicationinfo,
                show_support_dris: this.showSupportdris && this.isDRIenabled,
                support_email: this.support_email,
                support_phone: this.support_phone,
                support_faq: this.support_faq,
                integration: this.integration,
                support_communication: this.supportCommunication
            };
            // if (data.integration.enabled && !data.integration.type) {
            //     this.$snackbar.global.showError('Please select an integration');
            //     return;
            // }
            // if (!data.integration.enabled) {
            //     data.integration.type = undefined;
            // }
            SupportService.setGeneralConfig(data)
                .then((response) => {
                    this.setPageData(response.data);
                    this.$snackbar.global.showSuccess(
                        'Settings changed successfully'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `${err.response.data.message}`
                    );
                });
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
            this.integration.enabled =
                data.integration && data.integration.enabled;
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
        getGeneralConfiguration() {
            SupportService.getGeneralConfig()
                .then((response) => {
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
.panel {
    display: flex;
    flex-direction: column;
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
                        // padding: 16px;
                        margin-top: 14px;
                    }
                    .inpurField-decs {
                        // margin-top: 14px;
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
        }

        // ::v-deep
        // .addSupportDetail-left {
        //     left: 0;
        //     z-index: 13;
        //     // background-color: rgba(0, 0, 0, 0.7);
        // }
        // background: rgba(51, 51, 51, 0.7);
    }
}
.container {
    position: relative;
    margin: 24px;
    padding: 24px;
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
            // display: flex;
            // flex-direction: row;
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
                    // left: 12px;
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
        // .freshdesk-tool {
        //     margin-top: 24px;
        //     display: flex;
        //     padding: 16px 30px;
        //     border: 1px solid #e0e0e0;
        //     border-radius: 12px;
        //     margin: 16px 24px;
        //     justify-content: space-between;
        // }
    }
}
.left-container {
    display: flex;
    .radio-btn {
        display: flex;
        align-items: center;
    }
    .fynd-icon {
        display: flex;
        align-items: center;
    }
    .tools-type {
        display: flex;
        flex-direction: column;
        margin-left: 9px;
        .tool-heading {
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 140%;
            color: #41434c;
        }
        .tool-decs {
            margin-top: 4px;
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            color: #9b9b9b;
        }
    }
}
::v-deep .muted {
    pointer-events: none;
    opacity: 0.4;
}
.right-container {
    display: flex;
    align-items: center;
    .config-btn-conatiner {
        border: 1px solid #2e31be;
        border-radius: 4px;
        ::v-deep .n-flat-button-secondary {
            background-color: #ffffff;
        }
        ::v-deep .n-button-content {
            color: #2e31be;
        }
    }
}
::v-deep .nitrozen-input-grp {
    margin-top: 8px;
}
.tooltip-label {
    line-height: 16px;
    font-family: Inter, sans-serif;
    font-size: 10px;
    text-align: left;
    width: 500px;
    padding: 6px 12px;
}
.coming-soon-icon {
    margin: -16px -30px;
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
// ::v-deep .nitrozen-error-visible {
//     margin-left: 12px;
// }
::v-deep .dropdown .nitrozen-dropdown-label {
    margin-bottom: 8px;
}
</style>
