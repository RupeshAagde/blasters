<template>
    <div class="panel">
        <div class="page-container">
            <jumbotron
                :title="'Events'"
                :desc="'Use this section for configuring an Email or SMS response to the customer, with the help of templates. Send intimations on events such as a new user signup or login, for providing order updates, and for notifying returns and refunds.'"
                class="jumbotron-container"
            ></jumbotron>

            <div class="subscriptions-container">
                <div class="main-container full-width">
                    <loader v-if="pageLoading && !pageError"></loader>
                    <page-error
                        v-else-if="pageError"
                        :text="'Something went wrong'"
                        @tryAgain="onLoad"
                    ></page-error>
                    <div class="full-width" v-else>
                        <div class="group-name-container">
                            <nitrozen-tab
                                class="group-tab"
                                :activeIndex="activeGroupIndex"
                                @tab-change="changeGroupIndex"
                                :tabItem="tabs"
                                :label="'name'"
                            ></nitrozen-tab>
                        </div>
                        <div
                            v-bind:key="group.name"
                            v-for="(group, groupIndex) in subscriptions"
                        >
                            <div v-if="groupIndex == activeGroupIndex">
                                <div
                                    class="item"
                                    v-bind:key="item.appSubscriptionId"
                                    v-for="(item, childIndex) in group.children"
                                >
                                    <div class="subscription-container">
                                        <div>
                                            <div class="event-container">
                                                <div class="save-btn-container">
                                                    <nitrozen-button
                                                        @click="
                                                            save(
                                                                groupIndex,
                                                                childIndex
                                                            )
                                                        "
                                                        :theme="'secondary'"
                                                        v-stroke-btn
                                                    >
                                                        Save
                                                    </nitrozen-button>
                                                </div>
                                                <div
                                                    class="event-name-container"
                                                >
                                                    <span>{{
                                                        item.event.event_name
                                                    }}</span>
                                                    <span
                                                        class="
                                                            description-container
                                                        "
                                                        >{{
                                                            item.event
                                                                .descriptions
                                                        }}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="subscription-body">
                                            <div class="subscription-body">
                                                <div
                                                    class="child-item"
                                                    v-if="item.email"
                                                >
                                                    <div class="outer">
                                                        <span
                                                            class="
                                                                dark-xs
                                                                cl-DustyGray2
                                                                inner-text
                                                            "
                                                            >Email</span
                                                        >
                                                        <nitrozen-toggle-btn
                                                            v-model="
                                                                item.email
                                                                    .subscribed
                                                            "
                                                            class="toggle"
                                                            @change="
                                                                handleToggleEvent(
                                                                    $event,
                                                                    item,
                                                                    'email'
                                                                )
                                                            "
                                                        ></nitrozen-toggle-btn>
                                                    </div>
                                                    <nitrozen-dropdown
                                                        @click="capture()"
                                                        v-if="
                                                            item.email
                                                                .subscribed
                                                        "
                                                        class="
                                                            dropdown-select-container
                                                        "
                                                        label="Email template"
                                                        :items="
                                                            item.filteredEmailDropDownData
                                                        "
                                                        v-model="
                                                            item.email.template
                                                                ._id
                                                        "
                                                        :id="`email-${groupIndex}-${childIndex}`"
                                                        :searchable="true"
                                                        @searchInputChange="
                                                            dropdownSearchInputChange
                                                        "
                                                        @change="
                                                            updatePreview(
                                                                item.email
                                                                    .template
                                                                    ._id,
                                                                'email'
                                                            )
                                                        "
                                                    >
                                                    </nitrozen-dropdown>

                                                    <nitrozen-button
                                                        v-if="
                                                            item.email
                                                                .subscribed
                                                        "
                                                        @click.stop="
                                                            previewTemplate(
                                                                'email',
                                                                groupIndex,
                                                                childIndex
                                                            )
                                                        "
                                                        theme="secondary"
                                                        v-stroke-btn
                                                        class="
                                                            clone-btn
                                                            preview-email-btn
                                                        "
                                                        >Preview</nitrozen-button
                                                    >
                                                </div>
                                                <div
                                                    class="child-item"
                                                    v-if="item.sms"
                                                >
                                                    <div class="outer">
                                                        <span
                                                            class="
                                                                dark-xs
                                                                cl-DustyGray2
                                                                inner-text
                                                            "
                                                            >SMS</span
                                                        >
                                                        <nitrozen-toggle-btn
                                                            v-model="
                                                                item.sms
                                                                    .subscribed
                                                            "
                                                            @change="
                                                                handleToggleEvent(
                                                                    $event,
                                                                    item,
                                                                    'sms'
                                                                )
                                                            "
                                                            class="toggle"
                                                        ></nitrozen-toggle-btn>
                                                    </div>
                                                    <nitrozen-dropdown
                                                        v-if="
                                                            item.sms.subscribed
                                                        "
                                                        class="
                                                            dropdown-select-container
                                                        "
                                                        label="SMS template"
                                                        :items="
                                                            item.filteredSmsDropDownData
                                                        "
                                                        v-model="
                                                            item.sms.template
                                                                ._id
                                                        "
                                                        @change="
                                                            updatePreview(
                                                                item.sms
                                                                    .template
                                                                    ._id,
                                                                'sms'
                                                            )
                                                        "
                                                        :id="`sms-${groupIndex}-${childIndex}`"
                                                        :searchable="true"
                                                        @searchInputChange="
                                                            dropdownSearchInputChange
                                                        "
                                                    >
                                                    </nitrozen-dropdown>
                                                    <!-- {{item.sms.template._id}} -->
                                                    <nitrozen-button
                                                        v-if="
                                                            item.sms.subscribed
                                                        "
                                                        @click.stop="
                                                            previewTemplate(
                                                                'sms',
                                                                groupIndex,
                                                                childIndex
                                                            )
                                                        "
                                                        :theme="'secondary'"
                                                        v-stroke-btn
                                                        class="
                                                            clone-btn
                                                            preview-sms-btn
                                                        "
                                                        :disabled="
                                                            !item.sms.template
                                                                ._id
                                                        "
                                                        >Preview</nitrozen-button
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ukt-modal
            :modalClass="'preview-modal-container'"
            :isOpen="showTemplatePreviewModal"
            :title="'Preview'"
            :childHandleFocus="true"
            @closedialog="closeTemplatePreviewModal"
        >
            <div>
                <div v-if="templateInPreviewModal.template_type == 'email'">
                    <iframe ref="previewbody" class="preview-body"></iframe>
                </div>
                <div v-if="templateInPreviewModal.template_type == 'sms'">
                    <div
                        class="preview modal-body-description"
                        v-html="templateInPreviewModal.templatePreview"
                    ></div>
                </div>
                <div class="clone-btn-container">
                    <nitrozen-button
                        @click="cloneTemplate"
                        :theme="'secondary'"
                        v-strokeBtn
                        class="clone-btn"
                        >Clone</nitrozen-button
                    >
                </div>
            </div>
        </ukt-modal>
    </div>
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';
import loader from '@/components/common/loader.vue';
import PageError from '@/components/common/page-error';
import FormInput from '@/components/common/form-input';
import CommunicationServices from '../../services/pointblank.service';

//import admhelpsection from './../../../components/admin/common/adm-help-section.vue';
import uktModal from '@/components/common/utk-modal.vue';

// import * as _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import nunjucks from 'nunjucks';
//import AdminCommsService from '../../../services/admin/admin-comms.service';
import fp from 'lodash/fp';
// import {
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE,
//     ADMIN_COMMS_FETCH_SYSTEM_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_SMS_TEMPLATES,
//     ADMIN_COMMS_FETCH_SYSTEM_SMS_TEMPLATES,
//     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
//     ADMIN_COMMS_UPDATE_APP_EVENT_SUBSCRIPTION,
//     ADMIN_COMMS_FETCH_EVENT_APP_INVENTORY,
//     ADMIN_COMMS_UPDATE_EVENT_APP_INVENTORY
// } from '../../../store/admin/action.type';

// import {
//     ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
//     ADMIN_COMMS_GET_SYSTEM_EMAIL_TEMPLATES,
//     ADMIN_COMMS_GET_SYSTEM_SMS_TEMPLATES,
//     ADMIN_COMMS_GET_EMAIL_TEMPLATES,
//     ADMIN_COMMS_GET_SMS_TEMPLATES,
//     GET_HELP_SECTION_DATA
// } from '../../../store/admin/getters.type';

import { mapGetters } from 'vuex';
import { Promise } from 'q';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenToggleBtn,
    NitrozenBadge,
    NitrozenDropdown,
    NitrozenTab,
} from '@gofynd/nitrozen-vue';

//import AppSettingService from '../../../services/admin/admin-settings.service';
import { relativeTimeRounding } from 'moment';
import logsListingCardVue from './logs-listing-card.vue';

function initialState() {
    return {
        systemEmailTemplates: [],
        systemSmsTemplates: [],
        emailTemplates: {},
        smsTemplates: {},
        appSubscriptions: {},
        pageLoading: false,
        pageError: false,
        comms_enabled: true,
        subscriptions: [],
        activeGroupIndex: 0,
        tabs: [],
        showTemplatePreviewModal: false,
        ORDER: null,
        templateInPreviewModal: {
            template: null,
            template_type: null,
            templatePreview: '',
            error: '',
        },
        slug: '',
        type: '',
        child: '',
        group: '',
    };
}
export default {
    name: 'admin-events-subscriptions',
    components: {
        loader: loader,
        jumbotron: Jumbotron,
        'page-error': PageError,
        //'adm-help-section': admhelpsection,
        'adm-form-input': FormInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-tab': NitrozenTab,
        'ukt-modal': uktModal,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },

    data() {
        return initialState();
    },
    mounted() {
        this.onLoad();
    },

    updated() {
        if (
            this.$refs['previewbody'] &&
            this.templateInPreviewModal.template_type == 'email'
        ) {
            let iframe = this.$refs['previewbody'];
            let iframedoc = iframe.contentDocument
                ? iframe.contentDocument
                : iframe.contentWindow
                ? iframe.contentWindow.document
                : null;
            if (iframedoc) {
                iframedoc.body.innerHTML =
                    this.templateInPreviewModal.templatePreview;
            }
        }
    },
    methods: {
        capture(e = '') {
            console.log(e);
        },
        onLoad() {
            //     Object.assign(this.$data, initialState());
            this.pageLoading = true;
            let allPromises = [
                this.fetchEventsOrder(),
                this.fetchEmailTemplates(),
                this.fetchSystemEmailTemplates(),
                this.fetchSmsTemplates(),
                this.fetchSystemSmsTemplates(),
                this.fetchAppEventSubscriptions(),
                //        this.getAppInventory()
            ];

            Promise.all(allPromises)
                .then(() => {
                    this.updateInfo();
                })
                .catch((err) => {
                    console.log(err);
                })
                .then(() => {
                    if (this.$route.query.hasOwnProperty('activeTab')) {
                        let activeTab = Number(this.$route.query.activeTab);
                        this.changeGroupIndex({ index: activeTab });
                    } else {
                        this.changeGroupIndex({ index: 0 });
                    }
                    this.pageLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchEventsOrder() {
            return CommunicationServices.getEventsOrder().then(({ data }) => {
                this.ORDER = data;
            });
        },
        updatePreview(id, type) {
            if (type == 'email') {
                CommunicationServices.getEmailTemplatebyId(id).then((data) => {
                    this.templateInPreviewModal.template = data.data;
                    this.templateInPreviewModal.template_type = type;
                    this.templateInPreviewModal.templatePreview =
                        this.renderHtmlTemplate(data.data);
                });
            }
            if (type == 'sms') {
                CommunicationServices.getSmsTemplatebyId(id).then((data) => {
                    this.templateInPreviewModal.template = data.data;
                    this.templateInPreviewModal.template_type = type;
                    this.templateInPreviewModal.templatePreview =
                        this.renderSMSTemplate(data.data);
                });
            }
            //console.log(this.templateInPreviewModal.template.slug)
            //this.slug = this.templateInPreviewModal.template.slug
            let el = this.$refs['previewbody'];
            if (this.$refs['previewbody']) {
                let iframe = this.$refs['previewbody'];
                var iframedoc =
                    iframe.contentDocument || iframe.contentWindow.document;
                iframedoc.body.innerHTML =
                    this.templateInPreviewModal.templatePreview;
            }
        },
        cloneTemplate() {
            let template = this.templateInPreviewModal.template;
            let mode = 'sms';
            if (template.html) {
                mode = 'email';
            }
            this.showTemplatePreviewModal = true;
            this.$router.push({
                path: `/administrator/communication/${mode}/templates/create`,
                query: { clone: template._id },
            });
        },
        renderHtmlTemplate(emailTemplate) {
            this.templateInPreviewModal.error = '';
            let template = '';
            let templateValid = true;
            if (emailTemplate.html.template_type == 'nunjucks') {
                try {
                    template = nunjucks.compile(emailTemplate.html.template);
                    template = template.render(
                        emailTemplate.template_variables
                    );
                } catch (err) {
                    templateValid = false;
                    this.templateInPreviewModal.error =
                        'Invalid message template';
                }
            } else {
                template = emailTemplate.html.template.value;
            }
            if (templateValid) {
                return template;
            }
        },
        renderSMSTemplate(smsTemplate) {
            this.templateInPreviewModal.error = '';
            let template = '';
            let templateValid = true;
            if (smsTemplate.message.template_type == 'nunjucks') {
                try {
                    template = nunjucks.compile(smsTemplate.message.template);
                    template = template.render(smsTemplate.template_variables);
                } catch (err) {
                    templateValid = false;
                    this.templateInPreviewModal.error =
                        'Invalid message template';
                }
            } else {
                template = smsTemplate.message.template;
            }
            if (templateValid) {
                //template = this.urlify(template);
                return template;
            }
        },
        closeTemplatePreviewModal() {
            this.showTemplatePreviewModal = false;
        },
        // getAppInventory() {
        //     this.$store
        //         .dispatch(ADMIN_COMMS_FETCH_EVENT_APP_INVENTORY)
        //         .then(data => {
        //             this.comms_enabled = data.comms_enabled;
        //         });
        // },
        //updateCommsEnabled() {
        // AppSettingService.patchAppConfiguration({
        //     comms_enabled: this.comms_enabled
        // })
        //     .then(data => {
        //         this.$snackbar.global.showSuccess('Updated Successfully');
        //     })
        //     .catch(err => {
        //         this.$snackbar.global.showError('Failed to update');
        //     });
        //},
        // urlify(text) {
        //     let output = text;
        //     var urlRegex = /(https?:\/\/[^\s]+)/g;
        //     output = output.replace(urlRegex, function(url) {
        //         return `<a style="color:#2E31BE;" target="_blank" href="${url}">${url}</a>`;
        //     });
        //     var emailRegex = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;
        //     output = output.replace(emailRegex, function(email) {
        //         return `<a style="color:#2E31BE;" target="_blank" href="mailto:${email}">${email}</a>`;
        //     });
        //     return output;
        // },
        previewTemplate(type, groupIndex, childIndex) {
            let slug = false;
            let a = this.subscriptions[groupIndex].children[childIndex].event.slug 
            let Type
            if(this.child == childIndex && this.group == groupIndex){
               Type = this.type != type;
            }
             if(this.slug){
            slug = a != this.slug
             }
            if (!this.templateInPreviewModal.templatePreview || slug || Type ) {
                let template =
                    this.subscriptions[groupIndex].children[childIndex][type]
                        .template;
                this.templateInPreviewModal.template = template;
                this.templateInPreviewModal.template_type = type;
                if (type == 'sms') {
                    this.templateInPreviewModal.templatePreview =
                        this.renderSMSTemplate(template);
                } else if (type == 'email') {
                    this.templateInPreviewModal.templatePreview =
                        this.renderHtmlTemplate(template);
                    let el = this.$refs['previewbody'];
                    if (this.$refs['previewbody']) {
                        let iframe = this.$refs['previewbody'];
                        var iframedoc =
                            iframe.contentDocument ||
                            iframe.contentWindow.document;
                        iframedoc.body.innerHTML =
                            this.templateInPreviewModal.templatePreview;
                    }
                }
            }
            this.showTemplatePreviewModal = true;
            this.slug = a;
            this.type = type;
            this.group = groupIndex;
            this.child = childIndex;
        },
        dropdownSearchInputChange(e) {
            let type = e.id.split('-')[0];
            let groupIndex = Number(e.id.split('-')[1]);
            let childIndex = Number(e.id.split('-')[2]);
            let key = type == 'sms' ? 'smsDropDownData' : 'emailDropDownData';
            let filteredKey =
                type == 'sms'
                    ? 'filteredSmsDropDownData'
                    : 'filteredEmailDropDownData';
            this.subscriptions[groupIndex]['children'][childIndex][
                filteredKey
            ] = this.subscriptions[groupIndex]['children'][childIndex][
                key
            ].filter((template) => {
                return (
                    template.text.toLowerCase().indexOf(e.text.toLowerCase()) >
                    -1
                );
            });
        },
        changeGroupIndex(item) {
            this.activeGroupIndex = item.index;
            let activeTab = this.activeGroupIndex;
            this.$router
                .replace({
                    name: 'events',
                    query: { ...this.$route.query, activeTab },
                })
                .catch((e) => {
                    console.log(e);
                });
        },
        fetchEmailTemplates() {
            return CommunicationServices.getEmailTemplates({
                params: { limit: 200 },
            }).then(({ data }) => {
                this.emailTemplates = data;
            });
        },
        fetchSystemEmailTemplates() {
            return CommunicationServices.getEmailSysTemplates({
                params: { limit: 200 },
            }).then(({ data }) => {
                this.systemEmailTemplates = data;
            });
        },
        fetchSmsTemplates() {
            return CommunicationServices.getSmsTemplates({ limit: 200 }).then(
                ({ data }) => {
                    this.smsTemplates = data;
                }
            );
        },
        fetchSystemSmsTemplates() {
            return CommunicationServices.getSmsSysTemplates({
                limit: 200,
            }).then(({ data }) => {
                this.systemSmsTemplates = data;
            });
        },
        fetchAppEventSubscriptions() {
            return CommunicationServices.getEventSubscription({
                page_size: 200,
                page_no: 1,
                populate: [
                    'event',
                    'template.sms.template',
                    'template.email.template',
                ],
            }).then(({ data }) => {
                this.appSubscriptions = data;
            });
        },
        dropDownReachedBottom(e) {
            // console.log(e);
        },
        getSubscriptionTabs() {
            let tabs = [];
            this.subscriptions.forEach((subscription) => {
                tabs[this.ORDER[subscription.name]] = {
                    name: subscription.name,
                };
            });
             let sub = [];
            tabs.forEach((r) => {
                if (r !== null) {
                    sub.push(r);
                }
            });
            tabs = sub
            return tabs;
        },
        updateInfo() {
            let subscriptions = this.subscriptions;
            let groupNames = this._fetchUniqueGroupNames(this.appSubscriptions);

            this.appSubscriptions.items.forEach((appSubscription) => {
                let groupNameIndex = groupNames.findIndex(
                    (groupName) => groupName == appSubscription.event.group
                );

                let child = {
                    appSubscriptionId: appSubscription._id,
                    event: appSubscription.event,
                };

                if (get(appSubscription, 'template.email.template')) {
                    child.email = appSubscription.template.email;
                    child.previousEmail =
                        appSubscription.template.email.template._id;
                    let emailDropDownData = this._getDropdownData(
                        this.emailTemplates.items
                    );
                    let defaultSystemEmailTemplate = this._getDefaultTemplate(
                        'email',
                        this.systemEmailTemplates,
                        appSubscription
                    );
                    if (defaultSystemEmailTemplate) {
                        if (
                            !defaultSystemEmailTemplate.name.endsWith(
                                ` (Default)`
                            )
                        ) {
                            defaultSystemEmailTemplate.name = `${defaultSystemEmailTemplate.name} (Default)`;
                        }
                        emailDropDownData = this._addSystemTemplateOnTop(
                            defaultSystemEmailTemplate,
                            emailDropDownData
                        );
                    }
                    child.emailDropDownData = emailDropDownData;
                    child.filteredEmailDropDownData =
                        fp.cloneDeep(emailDropDownData);
                }

                if (get(appSubscription, 'template.sms.template')) {
                    child.sms = appSubscription.template.sms;
                    child.previousSms =
                        appSubscription.template.sms.template._id;

                    let smsDropDownData = this._getDropdownData(
                        this.smsTemplates.items
                    );
                    let defaultSystemSmsTemplate = this._getDefaultTemplate(
                        'sms',
                        this.systemSmsTemplates,
                        appSubscription
                    );

                    if (defaultSystemSmsTemplate) {
                        if (
                            !defaultSystemSmsTemplate.name.endsWith(
                                ` (Default)`
                            )
                        ) {
                            defaultSystemSmsTemplate.name = `${defaultSystemSmsTemplate.name} (Default)`;
                        }
                        smsDropDownData = this._addSystemTemplateOnTop(
                            defaultSystemSmsTemplate,
                            smsDropDownData
                        );
                    }

                    child.smsDropDownData = smsDropDownData;
                    child.filteredSmsDropDownData =
                        fp.cloneDeep(smsDropDownData);
                }

                if (!get(subscriptions, `${groupNameIndex}.children`)) {
                    subscriptions[groupNameIndex] = {
                        name: appSubscription.event.group,
                        children: [child],
                    };
                } else {
                    subscriptions[groupNameIndex].children.push(child);
                }
                subscriptions[groupNameIndex].children.sort((a, b) => {
                    return a.event.priority - b.event.priority;
                });
            });            
            this.subscriptions = this.sortSubscriptionTabs(this.subscriptions);
            let sub = [];
            this.subscriptions.forEach((r) => {
                if (r !== null) {
                    sub.push(r);
                }
            });
            this.subscriptions = sub
            this.tabs = this.getSubscriptionTabs();
        },
        _addSystemTemplateOnTop(defaultTemplate, dropdownData) {
            return [
                {
                    value: defaultTemplate._id,
                    text: defaultTemplate.name,
                },
                ...dropdownData,
            ];
        },
        _getDefaultTemplate(type, systemTemplates, appSubscription) {
            return systemTemplates.find((et) => {
                return et._id == appSubscription.event.template[type].template;
            });
        },
        _getDropdownData(templates) {
            return templates.map((et) => {
                return {
                    text: et.name,
                    value: et._id,
                };
            });
        },
        _fetchUniqueGroupNames(appSubscriptions) {
            return fp.pipe(
                fp.get('items'),
                fp.map(fp.get('event.group')),
                fp.uniq
            )(appSubscriptions);
        },
        sortSubscriptionTabs(subscriptions) {
            let subscriptionsArr = [];
            subscriptions.forEach((sub, i) => {
                let subscription = cloneDeep(sub);
                subscription.children.sort((a, b) => {
                    return a.event.priority - b.event.priority;
                });
                subscriptionsArr[this.ORDER[subscription.name]] = subscription;
            });
            return subscriptionsArr;
        },
        // handleToggleEvent(event, item, type) {
        //     item[type].subscribed = event.target.checked;
        // },
        save(groupIndex, childIndex) {
            let finalSubscription = null;

            if (groupIndex !== undefined && childIndex !== undefined) {
                let subscription = this.subscriptions[groupIndex];
                let child = subscription.children[childIndex];

                let appSubscription = this.appSubscriptions.items.find(
                    (a) => a._id == child.appSubscriptionId
                );
                let obj = {
                    _id: child.appSubscriptionId,
                    template: cloneDeep(appSubscription.template),
                };

                if (child.email) {
                    obj.template.email.subscribed = child.email.subscribed;
                    if (child.email.subscribed) {
                        obj.template.email.template = child.email.template._id;
                    } else {
                        obj.template.email.template = child.previousEmail;
                    }
                }
                if (child.sms) {
                    obj.template.sms.subscribed = child.sms.subscribed;
                    if (child.sms.subscribed) {
                        obj.template.sms.template = child.sms.template._id;
                    } else {
                        obj.template.sms.template = child.previousSms;
                    }
                }
                finalSubscription = obj;
            }
            this.pageError = false;
            CommunicationServices.putEventSubscription({
                id: finalSubscription._id,
                body: finalSubscription,
            })
                .then(() => {
                    return this.fetchAppEventSubscriptions();
                })
                .then(() => {
                    this.subscriptions = [];
                    return this.updateInfo();
                })
                .then(() => {
                    this.$snackbar.global.showSuccess('Successfully Saved');
                })
                .catch((err) => {
                    console.log(err);
                    this.pageError = true;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
//@import './../less/page-ui.less';
//@import './../less/page-header.less';

::v-deep .n-button-stroke:disabled {
    background-color: #ffffff;
}

.jumbotron-container {
    width: 100%;
}

.page-container {
    margin: 24px;
    width: auto;
    @media @mobile {
        margin: 0;
    }
    .subscriptions-container {
        width: 100%;
    }
}
.preview-modal-container {
    ::v-deep .modal-container {
        width: 720px;
        .preview-body {
            min-height: 500px;
            width: 100%;
            margin-top: 24px;
        }
        .preview {
            margin-top: 18px;
            color: black;
            font-family: Inter;
            border: 1px solid #e4e5e6;
            padding: 24px;
            font-weight: 100;
            background: #f9f9f9;
        }
        .modal-body {
            margin: 24px;
        }
        .clone-btn-container {
            text-align: right;
            margin-top: 24px;
        }
    }
}
.cursor-pointer {
    cursor: pointer;
}
.inline {
    display: flex;
    align-items: center;
}
.main-container {
    background-color: @White;
    display: block;
    margin: 24px 0px;
    @media @mobile {
        margin: 48px 0;
    }
    .switch-container {
        display: flex;
        background: #ebedfb;
        height: 48px;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px 0 24px;
        border-radius: 4px;
        margin-bottom: 24px;
        color: @Mako;
        @media @mobile {
            height: 64px;
            margin: 0 -24px 24px -24px;
        }
    }
    .disabledToggleString {
        color: #9b9b9b;
    }
    .full-width {
        width: 100%;
    }
    /deep/.generic-button {
        float: left;
        margin-left: 20px;
        margin-top: 20px;
    }
    /deep/.generic-button .disable-btn {
        background-color: lightgray;
    }
    .subscription-container {
        position: relative;
        border: 1px solid #dadada;
        border-radius: 5px;
        padding: 24px;
        margin-bottom: 12px;
        /deep/.subscription-body {
            margin: 0px 24px;
            @media @mobile {
                margin: 0;
            }
        }
        .event-container {
            // display: flex;
            // align-items: center;
        }
        /deep/.event-name-container {
            width: 100%;
        }
        /deep/.badges-container {
            margin-right: 40px;
            width: 130px;
            text-align: right;
        }
        /deep/.description-container {
            font-weight: 100;
            display: block;
            margin-top: 12px;
            width: 80%;
            line-height: 16px;
            font-size: 12px;
        }
        /deep/.label {
            padding: 25px 20px;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        .save-btn-container {
            // position:absolute;
            // right:24px;
            // top:24px;
            float: right;
        }
        .child-item {
            display: flex;
            flex-direction: row;
            margin: 20px 0px;
            height: 40px;
            @media @mobile {
                display: block;
                height: initial;
                margin: 20px 0 0 0;
            }
            .inner-text {
                width: 35px;
            }
            .outer {
                display: flex;
                width: 150px;
                position: relative;
                align-items: center;
                justify-items: center;
                @media @mobile {
                    width: 100%;
                    margin-bottom: 16px;
                }
            }
            .toggle {
                margin: 0px 15px;
                // position: absolute;
                // left: 40px;
                // top: 8px;
            }
            .clone-btn {
                margin-left: 24px;
                border: none;
                padding-left: 0px;
                padding-right: 0px;
                @media @mobile {
                    margin-left: 0;
                }
            }
            .clone-btn:hover {
                background: @White;
            }
            .dropdown-select-container {
                display: inline-block;
                width: 350px;
                /deep/.nitrozen-dropdown-label {
                    display: none;
                }
                @media @mobile {
                    width: 100%;
                    margin-bottom: 16px;
                }
            }
            .dropdown-select {
                width: 300px;
                margin-left: 10px;
                display: inline-table;
            }
        }
    }
    .group-name-container {
        margin-bottom: 24px;
        .group-tab {
            border-bottom: 1px solid #e4e5e6;
            /deep/.nitrozen-tab {
                padding: 0px;
            }
        }
    }
}
</style>
