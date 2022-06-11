<template>
    <div class="panel">
        <div class="main">
            <loader v-if="pageLoading" class="loading"></loader>
            <div class="form page-container" v-if="!pageLoading">
                <div class="form-container">
                    <div class="details">Details</div>
                    <div class="form-field">
                        <nitrozen-input
                            v-model="data.name.value"
                            :label="'Template Title*'"
                            :placeholder="'Enter Template Title'"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.name.showerror"
                            >{{ data.name.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-field" v-if="isEditMode">
                        <nitrozen-input
                            v-model="data.slug"
                            :label="'Slug'"
                            :disabled="true"
                        >
                        </nitrozen-input>
                    </div>
                    <div class="form-field">
                        <nitrozen-input
                            v-model="data.description.value"
                            :label="
                                'Description ' +
                                    data.description.value.length +
                                    '/' +
                                    MAX_DESCRIPTION_CHAR_LIMIT
                            "
                            :type="'textarea'"
                            class="form-field"
                            :placeholder="'Enter description'"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.description.showerror"
                            >{{ data.description.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-field">
                        <div class="form-field">
                            <div class="nitrozen-label">Priority *</div>
                            <div class="radio-btn-container">
                                <nitrozen-radio
                                    class="radio-btn"
                                    name="low"
                                    v-model="data.priority.value"
                                    radioValue="low"
                                    title="Low"
                                    >Low</nitrozen-radio
                                >
                                <nitrozen-radio
                                    class="radio-btn"
                                    name="high"
                                    v-model="data.priority.value"
                                    radioValue="high"
                                    title="High"
                                    >High</nitrozen-radio
                                >
                            </div>
                            <nitrozen-error v-if="data.priority.showerror"
                                >{{ data.priority.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="tags-container form-field">
                            <div>
                                <span class="nitrozen-label">Tags</span>
                            </div>
                            <div class="input-text tags">
                                <div class="chips-input">
                                    <nitrozen-chips
                                        class="chip-wrapper"
                                        v-for="(item, index) in tags"
                                        :key="index"
                                        >{{ item.name }}
                                        <nitrozen-inline
                                            :icon="'cross'"
                                            class="nitrozen-icon"
                                            v-on:click="removeChip(index)"
                                        ></nitrozen-inline>
                                    </nitrozen-chips>
                                    <input
                                        placeholder="For e.g. order (upto 2 tags)"
                                        ref="chipInput"
                                        type="text"
                                        class="chip-input cl-Mako light-xs"
                                        @keydown.enter="addChip"
                                        @keydown.tab="addChip"
                                        v-model="chipInput"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- <div class="details m-top-24">Communication</div>
                        <div class="form-field">
                            <nitrozen-input
                                v-model="data.from_name.value"
                                :label="'Sender Name*'"
                                :disabled="data.from_name.disabled"
                                :placeholder="'Enter Sender Name'"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.from_name.showerror"
                                >{{ data.from_name.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="form-field">
                            <nitrozen-input
                                v-model="data.from.value"
                                :label="'Sender Email*'"
                                :disabled="data.from.disabled"
                                :placeholder="'Enter Sender Email'"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.from.showerror"
                                >{{ data.from.errortext }}
                            </nitrozen-error>
                        </div> -->
                    </div>
                </div>
            </div>
            <div
                class="form page-container m-top-24"
                v-if="
                    !pageLoading &&
                        !(
                            emailTemplateToClone &&
                            emailTemplateToClone.is_system &&
                            isCloneMode
                        )
                "
            >
                <div class="form-container">
                    <accordion
                        class="accordion-container"
                        :title="'Events'"
                        :initialState="true"
                    >
                        <div class="form-field">
                            <nitrozen-dropdown
                                class="link-to-event"
                                label="Link to event"
                                :items="subscriptionsFiltered"
                                v-model="linkToEvent"
                                :searchable="true"
                                :multiple="true"
                                @change="linkEventDropdownSelect"
                                @searchInputChange="dropdownSearchInputChange"
                            >
                            </nitrozen-dropdown>
                            <div>
                                <div
                                    v-for="(item, index) in subscribedAdded"
                                    :key="index"
                                    class="linked-cards"
                                >
                                    <span class="linked-name"
                                        >{{ item.event.group }} -
                                        {{ item.event.event_name }}</span
                                    >
                                    <span
                                        @click="removeLink(item, index)"
                                        class="delete-icon"
                                    >
                                        <adm-inline-svg src="delete">
                                        </adm-inline-svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </accordion>
                </div>
            </div>
            <div class="form page-container m-top-24" v-if="!pageLoading">
                <div class="form-container">
                    <accordion
                        class="accordion-container"
                        :title="'Advanced'"
                        :initialState="false"
                    >
                        <div class="form-field m-top-24">
                            <nitrozen-input
                                v-model="data.reply_to.value"
                                :label="'Reply To'"
                                :placeholder="'Enter Reply To'"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.reply_to.showerror"
                                >{{ data.reply_to.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="form-field">
                            <nitrozen-input
                                v-model="data.staticTo.value"
                                :label="'Static To'"
                                :placeholder="'Enter Static To'"
                                class="form-field"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.staticTo.showerror"
                                >{{ data.staticTo.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="form-field">
                            <nitrozen-input
                                v-model="data.static_cc.value"
                                :label="'Static CC'"
                                :placeholder="'Enter Static CC'"
                                class="form-field float-right"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.static_cc.showerror"
                                >{{ data.static_cc.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="form-field">
                            <nitrozen-input
                                v-model="data.static_bcc.value"
                                :label="'Static Bcc'"
                                :placeholder="'Enter Static Bcc'"
                                class="form-field"
                            >
                            </nitrozen-input>
                            <nitrozen-error v-if="data.static_bcc.showerror"
                                >{{ data.static_bcc.errortext }}
                            </nitrozen-error>
                        </div>

                        <div class="details">SMTP Headers</div>
                        <div class="form-field">
                            <div
                                class="smtp-container"
                                v-for="(header, index) in data.headers"
                                :key="index"
                            >
                                <div
                                    class="remove-icon"
                                    @click="deleteHeader(index)"
                                >
                                    <adm-inline-svg src="delete">
                                    </adm-inline-svg>
                                </div>
                                <div class="form-field">
                                    <nitrozen-input
                                        v-model="header.key"
                                        :label="'Key'"
                                        :placeholder="'Enter Key'"
                                    >
                                    </nitrozen-input>
                                </div>
                                <div class="form-field">
                                    <nitrozen-input
                                        v-model="header.value"
                                        :label="'Value'"
                                        :placeholder="'Enter Value'"
                                    >
                                    </nitrozen-input>
                                </div>
                            </div>
                            <div class="details add-another" @click="addHeader">
                                Add Another
                            </div>
                        </div>
                    </accordion>
                </div>
            </div>
            <ukt-modal
                :isOpen="showEventLinkingModal"
                :title="'Events'"
                :childHandleFocus="true"
                @closedialog="closeEventLinkingModal"
                :modalClass="'event-link-modal'"
            >
                <div class="form-field">
                    <div class="question-title">
                        Would you also like to link this template to the below
                        event{{ subscribedAdded.length > 1 ? 's' : '' }}?
                    </div>
                    <nitrozen-dropdown
                        class="link-to-event"
                        label="Link to event"
                        :items="subscriptionsFiltered"
                        v-model="linkToEvent"
                        :searchable="true"
                        :multiple="true"
                        @change="linkEventDropdownSelect"
                        @searchInputChange="dropdownSearchInputChange"
                    >
                    </nitrozen-dropdown>
                    <div>
                        <div
                            v-for="(item, index) in subscribedAdded"
                            :key="index"
                            class="linked-cards"
                        >
                            <span class="linked-name"
                                >{{ item.event.group }} -
                                {{ item.event.event_name }}</span
                            >
                            <span
                                @click="removeLink(item, index)"
                                class="delete-icon"
                            >
                                <adm-inline-svg src="delete"> </adm-inline-svg>
                            </span>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <nitrozen-button
                            class="btn-margin"
                            @click="eventLinkDecision(false)"
                            :theme="'secondary'"
                            >No</nitrozen-button
                        >
                        <nitrozen-button
                            class="btn-margin"
                            @click="$emit('linkEventContinueClicked')"
                            :theme="'secondary'"
                            >Yes</nitrozen-button
                        >
                    </div>
                </div>
            </ukt-modal>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import loader from '@/components/common/loader.vue';
import { mapGetters } from 'vuex';
import accordion from '@/components/common/accordion.vue';
// import {
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATE,
//     ADMIN_COMMS_CREATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_UPDATE_EMAIL_TEMPLATE_FORM,
//     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION
// } from '../../../../store/admin/action.type';
// import { GET_USER_INFO } from '../../../../store/getters.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE,
//     ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE,
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE
// } from '../../../../store/admin/mutation.type';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    NitrozenRadio,
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import hash from 'object-hash';
import uktModal from '@/components/common/utk-modal.vue';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
export default {
    name: 'email-template-sidebar',
    components: {
        loader: loader,
        accordion: accordion,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'adm-inline-svg': adminlinesvg,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'ukt-modal': uktModal
    },
    directives: {
        flatBtn
    },
    computed: {
        ALIGN() {
            return ALIGN;
        },
        // ...mapGetters({
        //     emailTemplateStore: ADMIN_COMMS_GET_EMAIL_TEMPLATE,
        //     emailTemplateToClone: ADMIN_COMMS_GET_EMAIL_TEMPLATE_TO_CLONE,
        //     appSubscriptions: ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
        //     userData: GET_USER_INFO
        // })
    },
    data() {
        return {
            pageLoading: false,
            MAX_DESCRIPTION_CHAR_LIMIT: 100,
            formFieldNames: [
                'name',
                'description',
                'from',
                'from_name',
                'staticTo',
                'static_cc',
                'static_bcc',
                'reply_to',
                'priority',
                'tags'
            ],
            willBeSingle: ['reply_to'],
            canBeCommaSeperated: ['staticTo', 'static_cc', 'static_bcc'],
            chipInput: '',
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                from: this.getInitialValue('hey@gofynd.com'),
                from_name: this.getInitialValue('Fynd'),
                staticTo: this.getInitialValue(),
                static_cc: this.getInitialValue(),
                static_bcc: this.getInitialValue(),
                reply_to: this.getInitialValue(),
                headers: [],
                subject: {
                    template_type: 'static',
                    template: 'This is test email'
                },
                html: {
                    template_type: 'static',
                    template: 'This is test email'
                },
                text: {
                    template_type: 'static',
                    template: 'This is test email'
                },
                attachments: [],
                tags: [],
                priority: this.getInitialValue('low'),
                headers: [
                    {
                        key: null,
                        value: null
                    }
                ]
            },
            tags: [],
            linkToEvent: null,
            subscribedAdded: [],
            subscribedRemoved: [],
            subscriptionsFiltered: [],
            initialHash: '',
            showEventLinkingModal: false,
            emailTemplateStore: {},
            emailTemplateToClone: {
  "is_system": true,
  "is_internal": false,
  "description": "Use this email template for inviting customers as staff in your application.",
  "static_to": [],
  "static_cc": [],
  "static_bcc": [],
  "tags": [],
  "priority": "low",
  "published": true,
  "_id": "611212f186414775f63dfcc6",
  "slug": "invite-email-template",
  "name": "Invite Email",
  "subject": {
    "template_type": "nunjucks",
    "template": "{{ display or 'Fynd'}} Invite"
  },
  "html": {
    "template_type": "nunjucks",
    "template": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<!-- saved from url=(0069)http://assets.wildbit.com/postmark/templates/dist/password_reset.html -->\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <title>Set up a new password for {{ display or 'Fynd' }}</title>\n    <!-- \n    The style block is collapsed on page load to save you some scrolling.\n    Postmark automatically inlines all CSS properties for maximum email client \n    compatibility. You can just update styles here, and Postmark does the rest.\n    -->\n    <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n        /* Base ------------------------------ */\n\n        *:not(br):not(tr):not(html) {\n            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;\n            box-sizing: border-box;\n        }\n\n        body {\n            width: 100% !important;\n            height: 100%;\n            margin: 0;\n            line-height: 1.4;\n            background-color: #F2F4F6;\n            color: #74787E;\n            -webkit-text-size-adjust: none;\n        }\n\n        p,\n        ul,\n        ol,\n        blockquote {\n            line-height: 1.4;\n            text-align: left;\n        }\n\n        a {\n            color: #3869D4;\n        }\n\n        a img {\n            border: none;\n        }\n\n        /* Layout ------------------------------ */\n\n        .email-wrapper {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #F2F4F6;\n        }\n\n        .email-content {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        /* Masthead ----------------------- */\n\n        .email-masthead {\n            padding: 25px 0;\n            text-align: center;\n        }\n\n        .email-masthead_logo {\n            width: 94px;\n        }\n\n        .email-masthead_name {\n            font-size: 16px;\n            font-weight: bold;\n            color: #bbbfc3;\n            text-decoration: none;\n            text-shadow: 0 1px 0 white;\n        }\n\n        /* Body ------------------------------ */\n\n        .email-body {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            border-top: 1px solid #EDEFF2;\n            border-bottom: 1px solid #EDEFF2;\n            background-color: #FFFFFF;\n        }\n\n        .email-body_inner {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #FFFFFF;\n        }\n\n        .email-footer {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .email-footer p {\n            color: #AEAEAE;\n        }\n\n        .body-action {\n            width: 100%;\n            margin: 30px auto;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .body-sub {\n            margin-top: 25px;\n            padding-top: 25px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .content-cell {\n            padding: 35px;\n        }\n\n        .preheader {\n            display: none !important;\n        }\n\n        /* Attribute list ------------------------------ */\n\n        .attributes {\n            margin: 0 0 21px;\n        }\n\n        .attributes_content {\n            background-color: #EDEFF2;\n            padding: 16px;\n        }\n\n        .attributes_item {\n            padding: 0;\n        }\n\n        /* Related Items ------------------------------ */\n\n        .related {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .related_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .related_item-title {\n            display: block;\n            margin: .5em 0 0;\n        }\n\n        .related_item-thumb {\n            display: block;\n            padding-bottom: 10px;\n        }\n\n        .related_heading {\n            border-top: 1px solid #EDEFF2;\n            text-align: center;\n            padding: 25px 0 10px;\n        }\n\n        /* Discount Code ------------------------------ */\n\n        .discount {\n            width: 100%;\n            margin: 0;\n            padding: 24px;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #EDEFF2;\n            border: 2px dashed #9BA2AB;\n        }\n\n        .discount_heading {\n            text-align: center;\n        }\n\n        .discount_body {\n            text-align: center;\n            font-size: 15px;\n        }\n\n        /* Social Icons ------------------------------ */\n\n        .social {\n            width: auto;\n        }\n\n        .social td {\n            padding: 0;\n            width: auto;\n        }\n\n        .social_icon {\n            height: 20px;\n            margin: 0 8px 10px 8px;\n            padding: 0;\n        }\n\n        /* Data table ------------------------------ */\n\n        .purchase {\n            width: 100%;\n            margin: 0;\n            padding: 35px 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_content {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .purchase_heading {\n            padding-bottom: 8px;\n            border-bottom: 1px solid #EDEFF2;\n        }\n\n        .purchase_heading p {\n            margin: 0;\n            color: #9BA2AB;\n            font-size: 12px;\n        }\n\n        .purchase_footer {\n            padding-top: 15px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .purchase_total {\n            margin: 0;\n            text-align: right;\n            font-weight: bold;\n            color: #2F3133;\n        }\n\n        .purchase_total--label {\n            padding: 0 15px 0 0;\n        }\n\n        /* Utilities ------------------------------ */\n\n        .align-right {\n            text-align: right;\n        }\n\n        .align-left {\n            text-align: left;\n        }\n\n        .align-center {\n            text-align: center;\n        }\n\n        /*Media Queries ------------------------------ */\n\n        @media only screen and (max-width: 600px) {\n\n            .email-body_inner,\n            .email-footer {\n                width: 100% !important;\n            }\n        }\n\n        @media only screen and (max-width: 500px) {\n            .button {\n                width: 100% !important;\n            }\n        }\n\n        /* Buttons ------------------------------ */\n\n        .button {\n            background-color: #3869D4;\n            border-top: 10px solid #3869D4;\n            border-right: 18px solid #3869D4;\n            border-bottom: 10px solid #3869D4;\n            border-left: 18px solid #3869D4;\n            display: inline-block;\n            color: #FFF;\n            text-decoration: none;\n            border-radius: 3px;\n            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);\n            -webkit-text-size-adjust: none;\n        }\n\n        .button--green {\n            background-color: #22BC66;\n            border-top: 10px solid #22BC66;\n            border-right: 18px solid #22BC66;\n            border-bottom: 10px solid #22BC66;\n            border-left: 18px solid #22BC66;\n            color: white !important;\n        }\n\n        .button--red {\n            background-color: #FF6136;\n            border-top: 10px solid #FF6136;\n            border-right: 18px solid #FF6136;\n            border-bottom: 10px solid #FF6136;\n            border-left: 18px solid #FF6136;\n        }\n\n        /* Type ------------------------------ */\n\n        h1 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 19px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h2 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 16px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h3 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 14px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        p {\n            margin-top: 0;\n            color: #74787E;\n            font-size: 16px;\n            line-height: 1.5em;\n            text-align: left;\n        }\n\n        p.sub {\n            font-size: 12px;\n        }\n\n        p.center {\n            text-align: center;\n        }\n\n        .logo-container {\n            display: inline-block;\n            width: 100%;\n            text-align: center;\n            margin-top: 10px;\n        }\n\n        .logo {\n            display: inline-block;\n            height: 100px;\n            width: 100px;\n        }\n    </style>\n</head>\n\n<body>\n    <table class=... (10024 total length)"
  },
  "text": {
    "template_type": "nunjucks",
    "template": "Set up a new password for {{ display or 'Fynd' }}\n\nHi,\n{{ message }}\nCopy and paste the URL below into your web browser. This\nInvite is only valid for the next 24 hours.\n{{ inviteLink }}"
  },
  "template_variables": {
    "display": "Fynd",
    "inviteLink": "https://www.fynd.com/",
    "desktop_image": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png",
    "message": "Welcome to Fynd"
  },
  "headers": [],
  "attachments": [],
  "created_at": "2021-08-10T05:47:29.163Z",
  "updated_at": "2022-05-13T05:05:37.001Z",
  "__v": 0
}
        };
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
        }
    },
    mounted() {
        // let data = {};
        // try {
        //     if (this.isCloneMode) {
        //         data = cloneDeep(this.emailTemplateToClone);
        //         this.meta = {
        //             type: 'cloned',
        //             template: this.emailTemplateToClone._id,
        //             is_system: this.emailTemplateToClone.is_system
        //         };
        //     } else {
        //         data = cloneDeep(this.emailTemplateStore);
        //     }
        //     let obj = {};
        //     this.formFieldNames.forEach(key => {
        //         if (key == 'tags' && data[key]) {
        //             this.tags = data[key].map(val => {
        //                 return { name: val };
        //             });
        //         }
        //         if (key == 'priority') {
        //             if (!data[key]) {
        //                 data[key] = this.data[key].value;
        //             }
        //             obj[key] = obj[key] = this.getInitialValue(data[key]);
        //         } else if (key == 'from') {
        //             if (!data[key]) {
        //                 data[key] = this.data[key].value;
        //             }
        //             obj[key] = this.getInitialValue(data[key]);
        //             obj[key].disabled = true;
        //         } else if (key == 'from_name') {
        //             if (!data[key]) {
        //                 data[key] = this.data[key].value;
        //             }
        //             obj[key] = this.getInitialValue(data[key]);
        //             obj[key].disabled = true;
        //         } else {
        //             obj[key] = this.getInitialValue(data[key]);
        //         }
        //     });
        //     this.canBeCommaSeperated.forEach(key => {
        //         if (
        //             obj[key] &&
        //             obj[key].value &&
        //             typeof obj[key].value == 'object' &&
        //             Array.isArray(obj[key].value)
        //         ) {
        //             obj[key].value = obj[key].value.join(',');
        //         }
        //     });
        //     if (data.slug) {
        //         this.data.slug = data.slug;
        //     }

        //     this.data = { ...this.data, ...obj };

        //     this.fetchAppEventSubscriptions().then(() => {
        //         let groupNames = this.appSubscriptions.items.map(
        //             appSubscription => appSubscription.event.group
        //         );

        //         // extract unique group names
        //         groupNames = Array.from(new Set(groupNames));

        //         if (this.templateId) {
        //             this.subscribedAdded = this.appSubscriptions.items.filter(
        //                 subscription => {
        //                     return (
        //                         subscription.template.email.template._id ==
        //                         this.templateId
        //                     );
        //                 }
        //             );
        //             this.linkToEvent = this.subscribedAdded.map(a => a._id);
        //         } else if (
        //             this.$route.query.clone &&
        //             this.emailTemplateToClone &&
        //             this.emailTemplateToClone.is_system
        //         ) {
        //             this.subscribedAdded = this.appSubscriptions.items.filter(
        //                 subscription => {
        //                     return (
        //                         subscription.event.template.email.template ==
        //                         this.$route.query.clone
        //                     );
        //                 }
        //             );
        //             this.linkToEvent = this.subscribedAdded.map(a => a._id);
        //         }

        //         this.subscriptions = this.appSubscriptions.items.map(
        //             appSubscription => {
        //                 return {
        //                     value: appSubscription._id,
        //                     text: appSubscription.event.event_name,
        //                     group: appSubscription.event.group
        //                 };
        //             }
        //         );
        //         this.subscriptions = this.createSubscriptionsListDropdown(
        //             groupNames,
        //             this.subscriptions
        //         );
        //         this.subscriptionsFiltered = this.subscriptions;
        //         this.initialHash = this.generateHashOfLocalState();
        //         this.pageLoading = false;
        //     });
        // } catch (err) {
        //     this.$snackbar.global.showError('Failed to load Email Template');
        //     this.pageLoading = false;
        //     this.pageError = true;
        // }
    },
    methods: {
        eventLinkDecision(val) {
            if (!val) {
                this.subscribedAdded = [];
                this.linkToEvent = null;
            }
            this.$emit('linkEventContinueClicked');
        },
        openEventLinkingModal() {
            this.showEventLinkingModal = true;
        },
        closeEventLinkingModal() {
            this.showEventLinkingModal = false;
        },
        createSubscriptionsListDropdown(groupNames, subscriptions) {
            let finalArr = [];
            groupNames.forEach(groupName => {
                if (
                    !finalArr.find(a => a.text == groupName && a.isGroupLabel)
                ) {
                    finalArr.push({
                        text: groupName,
                        isGroupLabel: true
                    });
                    let matchingGroupSubscriptions = subscriptions.filter(
                        a => a.group == groupName
                    );
                    finalArr = [...finalArr, ...matchingGroupSubscriptions];
                }
            });
            return finalArr;
        },
        generateHashOfLocalState() {
            return hash({
                ...this.data,
                ...{ subscribedAdded: this.subscribedAdded },
                ...{ subscribedRemoved: this.subscribedRemoved },
                ...{ tags: this.tags }
            });
        },
        isFormUpdated() {
            return this.generateHashOfLocalState() !== this.initialHash;
        },
        validateAndSave() {
            if (this.validate()) {
                this.saveForm();
            }
        },
        saveForm() {
            let { data } = this;
            let finalObj = {};
            this.formFieldNames.forEach(key => {
                if (data[key].value) {
                    finalObj[key] = data[key].value;
                }
            });
            this.canBeCommaSeperated.forEach(key => {
                if (finalObj[key] && !finalObj[key].toString()) {
                    delete finalObj[key];
                }
                if (finalObj[key] && typeof finalObj[key] == 'string') {
                    finalObj[key] = finalObj[key].split(',');
                }
            });
            finalObj['tags'] = this.tags.map(tag => tag.name);
            if (!isEmpty(this.meta)) {
                finalObj['meta'] = this.meta;
            }
            this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {
                data: {
                    ...finalObj
                }
            });
            if (this.linkToEvent) {
                this.$emit('onLinkSubscription', {
                    subscribedAdded: this.subscribedAdded,
                    subscribedRemoved: this.subscribedRemoved
                });
            }
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        addHeader() {
            this.data.headers = this.data.headers.concat({
                key: null,
                value: null
            });
        },
        deleteHeader(index) {
            if (this.data.headers.length > 1) {
                this.data.headers.splice(index, 1);
            } else if (this.data.headers.length == 1 && index == 0) {
                this.data.headers[0].key = null;
                this.data.headers[0].value = null;
            }
        },
        removeChip(index) {
            this.tags.splice(index, 1);
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter(it => it.name === this.chipInput)
                        .length === 0 &&
                    this.tags.length < 2
                )
                    this.tags.push({ name: this.chipInput });
                this.chipInput = '';
            }
            event.preventDefault();
        },
        fetchAppEventSubscriptions() {
        //     return this.$store.dispatch(
        //         ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
        //         {
        //             params: {
        //                 page_size: 200,
        //                 page_no: 1,
        //                 populate: ['event', 'template.email.template'],
        //                 query: JSON.stringify({
        //                     'template.email.template': {
        //                         $nin: [null]
        //                     }
        //                 })
        //             }
        //         }
        //     );
         },
        removeLink(item, index) {
            this.subscribedRemoved.push(item);
            this.subscribedAdded = this.subscribedAdded.filter(
                (a, i) => index != i
            );
            this.linkToEvent = this.linkToEvent.filter((a, i) => index != i);
        },
        linkEventDropdownSelect(items) {
            let gotRemovedItems = [];
            this.subscribedAdded.filter(a => {
                let found = items.find(i => i == a._id);
                if (!found) {
                    gotRemovedItems.push(a);
                }
            });
            gotRemovedItems.forEach(removed => {
                let alreadyRemoved = this.subscribedRemoved.find(
                    a => a._id == removed._id
                );
                if (!alreadyRemoved) {
                    this.subscribedRemoved.push(removed);
                }
            });

            this.subscribedAdded = [];
            items.forEach(e => {
                let selectedItem = this.appSubscriptions.items.find(
                    a => a._id == e
                );
                if (selectedItem) {
                    this.subscribedAdded.push(selectedItem);
                }
            });

            this.subscribedRemoved = this.subscribedRemoved.filter(removed => {
                let found = this.subscribedAdded.find(
                    a => a._id == removed._id
                );
                return found == null;
            });
        },
        dropdownSearchInputChange(e) {
            if (e && e.text) {
                let text = e.text;
                this.subscriptionsFiltered = this.subscriptions.filter(
                    subscription => {
                        return (
                            subscription.text
                                .toLowerCase()
                                .indexOf(e.text.toLowerCase()) > -1 ||
                            subscription.isGroupLabel
                        );
                    }
                );
                this.subscriptionsFiltered = this.subscriptionsFiltered.filter(
                    (a, i, arr) => {
                        if (a.isGroupLabel) {
                            if (arr[i + 1] && !arr[i + 1].isGroupLabel) {
                                return true;
                            }
                            return false;
                        }
                        return true;
                    }
                );
            } else {
                this.subscriptionsFiltered = this.subscriptions;
            }
        },
        validate() {
            this.formFieldNames.forEach(key => {
                if (!this.data[key]) {
                    this.data[key] = {};
                }
                if (this.data[key]) {
                    this.data[key].errortext = '';
                    this.data[key].showerror = false;
                }
            });

            let requiredFields = ['name', 'from', 'from_name', 'priority'];
            let requiredEmptyArr = requiredFields.filter(
                key => !(this.data[key] && this.data[key].value)
            );
            let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            let invalidEmailArr = [];
            this.canBeCommaSeperated.forEach(key => {
                this.data[key].value = this.data[key].value.toString();
                if (this.data[key].value.indexOf(',') != -1) {
                    let emailArr = this.data[key].value.split(',');
                    emailArr.forEach(email => {
                        if (!emailRegex.test(email)) {
                            invalidEmailArr.push(key);
                            return;
                        }
                    });
                } else {
                    if (
                        this.data[key].value &&
                        !emailRegex.test(this.data[key].value)
                    ) {
                        if (
                            requiredFields.indexOf(key) != -1 ||
                            this.data[key].value
                        ) {
                            invalidEmailArr.push(key);
                        }
                    }
                }
            });
            this.willBeSingle.forEach(key => {
                this.data[key].value = this.data[key].value.toString();
                if (this.data[key].value.indexOf(',') != -1) {
                    let emailArr = this.data[key].value.split(',');
                    emailArr.forEach(email => {
                        if (!emailRegex.test(email)) {
                            if (requiredFields.indexOf(key) != -1) {
                                invalidEmailArr.push(key);
                            }
                            return;
                        }
                    });
                } else {
                    if (!emailRegex.test(this.data[key].value)) {
                        if (requiredFields.indexOf(key) != -1) {
                            invalidEmailArr.push(key);
                        }
                    }
                }
            });
            let errorObj = {};
            if (invalidEmailArr.length > 0) {
                invalidEmailArr.forEach(key => {
                    if (this.data[key].value) {
                        this.data[key].errortext = `${key[0].toUpperCase() +
                            key.slice(1)} is not a valid email`;
                        this.data[key].showerror = true;
                    }
                });
            }
            if (requiredEmptyArr.length > 0) {
                requiredEmptyArr.forEach(key => {
                    this.data[key].errortext = `Required Field`;
                    this.data[key].showerror = true;
                });
            }
            return requiredEmptyArr.length == 0 && invalidEmailArr.length == 0;
        }
    }
};
</script>

<style lang="less" scoped>
// @import './../../less/form.less';
// @import './../../less/page-ui.less';
// @import './../../less/page-header.less';
/deep/.nitrozen-dropdown-container
    .nitrozen-option
    .nitrozen-checkbox-container {
    height: auto;
}
.accordion-container {
    /deep/.title {
        font-size: 18px;
    }
}
.panel {
    min-height: 100%;
}
.main {
    min-height: 100%;
}
.m-top-24 {
    margin-top: 24px;
}
.event-link-modal {
    /deep/.modal-container {
        min-width: 500px;
    }
    /deep/.modal-body {
        margin: 24px;
        .question-title {
            margin: 24px 0px;
        }
        .modal-buttons {
            margin-top: 24px;
            text-align: right;
        }
    }
}
.linked-cards {
    margin-top: 6px;
    border: 1px solid #e4e5e6;
    padding: 12px;
    font-family: Inter, sans-serif;
    font-size: 11px;
    display: flex;
    .linked-name {
        width: 90%;
        align-self: center;
    }
    .delete-icon {
        width: 10%;
        cursor: pointer;
    }
}
.page-container {
    background: @Alabaster2;
    padding: 0px;
    .form-container {
        width: 100%;
        padding: 24px;
        border: 1px solid #f3f3f3;
        border-radius: 4px;
        background-color: #ffffff;
        .details {
            color: @Mako;
            font-weight: bold;
            font-size: 18px;
            line-height: 27px;
            text-align: left;
            margin-bottom: 24px;
        }

        .nitrozen-label {
            color: #9b9b9b;
            font-family: Inter, sans-serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 21px;
        }
        .form-field {
            margin-bottom: 24px;
            .link-to-event {
                margin-top: 24px;
            }
        }
        .radio-btn-container {
            display: flex;
            margin-top: 12px;
            .radio-btn:nth-child(2) {
                margin-left: 24px;
            }
        }

        .smtp-container {
            background: #f9f9f9;
            position: relative;
            padding: 24px 12px 12px 12px;
            margin-bottom: 12px;
            .remove-icon {
                position: absolute;
                right: 12px;
                top: 6px;
                cursor: pointer;
            }
        }
        .add-another {
            color: #2E31BE;
            text-align: right;
            cursor: pointer;
            margin-bottom: 0px;
            margin-top: 12px;
            font-size: 13px;
        }
        .tags {
            border: 1px solid @Iron;
            border-radius: 4px;
            min-height: 72px;
            padding: 6px;
            .nitrozen-chip {
                margin: 5px;
                height: 30px;
                padding: 0 9px;
                font-size: 12px;
                line-height: 30px;
            }
            .chip-input {
                width: 200px;
                border: none;
                font-family: Inter, sans-serif;
                font-size: 11px;
                font-weight: 400;
            }
        }
    }
}
</style>
