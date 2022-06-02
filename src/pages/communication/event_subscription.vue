<template>
    <div class="panel">
        <div class="page-container">
        <jumbotron
                    :title="'Events'"
                    :desc="'View All Reports'"
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
                        <div class="switch-container">
                            <div>
                                Use the toggle button for enabling or disabling
                                the email and SMS response altogether
                            </div>
                            <div class="inline">
                                <div
                                    class="cursor-pointer cl-RoyalBlue bold-xxxs"
                                    :class="
                                        !comms_enabled
                                            ? 'disabledToggleString'
                                            : ''
                                    "
                                    @click="
                                        () => {
                                            comms_enabled = !comms_enabled;
                                            updateCommsEnabled();
                                        }
                                    "
                                >
                                    {{
                                        toggleString(comms_enabled, 'titleCase')
                                    }}
                                </div>
                                <nitrozen-toggle-btn
                                    v-model="comms_enabled"
                                    :value="comms_enabled"
                                    @change="updateCommsEnabled()"
                                ></nitrozen-toggle-btn>
                            </div>
                        </div>
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
                                                        class="description-container"
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
                                                            class="dark-xs cl-DustyGray2 inner-text"
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
                                                        v-if="
                                                            item.email
                                                                .subscribed
                                                        "
                                                        class="dropdown-select-container"
                                                        label="Email template"
                                                        :items="
                                                            item.filteredEmailDropDownData
                                                        "
                                                        v-model="
                                                            item.email.template
                                                                ._id
                                                        "
                                                        :id="
                                                            `email-${groupIndex}-${childIndex}`
                                                        "
                                                        :searchable="true"
                                                        @searchInputChange="
                                                            dropdownSearchInputChange
                                                        "
                                                    >
                                                    </nitrozen-dropdown>
                                                    <nitrozen-button
                                                        v-if="
                                                            item.email
                                                                .subscribed
                                                        "
                                                        @click.stop="previewTemplate(
                                                                'email',
                                                                groupIndex,
                                                                childIndex
                                                            )"
                                                        :theme="'secondary'"
                                                        v-stroke-btn
                                                        class="clone-btn preview-email-btn"
                                                        >Preview</nitrozen-button
                                                    >
                                                </div>
                                                <div
                                                    class="child-item"
                                                    v-if="item.sms"
                                                >
                                                    <div class="outer">
                                                        <span
                                                            class="dark-xs cl-DustyGray2 inner-text"
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
                                                        class="dropdown-select-container"
                                                        label="SMS template"
                                                        :items="
                                                            item.filteredSmsDropDownData
                                                        "
                                                        v-model="
                                                            item.sms.template
                                                                ._id
                                                        "
                                                        :id="
                                                            `sms-${groupIndex}-${childIndex}`
                                                        "
                                                        :searchable="true"
                                                        @searchInputChange="
                                                            dropdownSearchInputChange
                                                        "
                                                    >
                                                    </nitrozen-dropdown>
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
                                                        class="clone-btn preview-sms-btn"
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
import { titleCase, toggleString } from '@/helper/utils';
import FormInput from '@/components/common/form-input';

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
    NitrozenTab
} from '@gofynd/nitrozen-vue';

//import AppSettingService from '../../../services/admin/admin-settings.service';
import { relativeTimeRounding } from 'moment';


function initialState(){
    return {
        pageLoading: false,
        pageError: false,
        comms_enabled: true,
        subscriptions: [
  {
    "name": "Signup & login",
    "children": [
      {
        "appSubscriptionId": "611212f18641476fde3dfcd0",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "611212f186414775f63dfcc6"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "611212f186414708383dfcc7"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email/sms template for inviting users as staff in your application.",
          "enabled": true,
          "editable": true,
          "group": "Signup & login",
          "channels": [
            "all"
          ],
          "priority": 1,
          "_id": "611212f186414793053dfcc8",
          "slug": "invite-event",
          "event_name": "Invite Event",
          "created_at": "2021-08-10T05:47:29.177Z",
          "updated_at": "2022-05-16T07:51:29.388Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
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
        },
        "previousEmail": "611212f186414775f63dfcc6",
        "emailDropDownData": [
          {
            "value": "611212f186414775f63dfcc6",
            "text": "Invite Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "611212f186414775f63dfcc6",
            "text": "Invite Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for inviting customers as staff in your application.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "611212f186414708383dfcc7",
            "slug": "invite-sms-template",
            "name": "Invite SMS",
            "template_variables": {
              "message": "Welcome to Fynd",
              "inviteUrl": "http://fynd.com"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ message }}. You have been invited to join us. Click {{ inviteUrl }} to accept the invite - Team Fynd"
            },
            "created_at": "2021-08-10T05:47:29.170Z",
            "updated_at": "2021-08-10T05:47:29.170Z",
            "__v": 0
          }
        },
        "previousSms": "611212f186414708383dfcc7",
        "smsDropDownData": [
          {
            "value": "611212f186414708383dfcc7",
            "text": "Invite SMS (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "611212f186414708383dfcc7",
            "text": "Invite SMS (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "611212f186414714af3dfccf",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "611212f18641474f083dfcca"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "611212f1864147cd623dfccb"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email template for verifying email ID of users, who recently created an account.",
          "enabled": true,
          "editable": true,
          "group": "Signup & login",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "611212f1864147af413dfccc",
          "slug": "verify-link-event",
          "event_name": "Verify Email",
          "created_at": "2021-08-10T05:47:29.270Z",
          "updated_at": "2022-05-16T07:51:29.425Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for verifying email ID of customers, who recently created their new account.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "611212f18641474f083dfcca",
            "slug": "verify-link-email-template",
            "name": "Verify Email",
            "subject": {
              "template_type": "nunjucks",
              "template": "Verify Email"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<!-- saved from url=(0069)http://assets.wildbit.com/postmark/templates/dist/password_reset.html -->\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <title>Verify Email</title>\n    <!-- \n    The style block is collapsed on page load to save you some scrolling.\n    Postmark automatically inlines all CSS properties for maximum email client \n    compatibility. You can just update styles here, and Postmark does the rest.\n    -->\n    <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n        /* Base ------------------------------ */\n\n        *:not(br):not(tr):not(html) {\n            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;\n            box-sizing: border-box;\n        }\n\n        body {\n            width: 100% !important;\n            height: 100%;\n            margin: 0;\n            line-height: 1.4;\n            background-color: #F2F4F6;\n            color: #74787E;\n            -webkit-text-size-adjust: none;\n        }\n\n        p,\n        ul,\n        ol,\n        blockquote {\n            line-height: 1.4;\n            text-align: left;\n        }\n\n        a {\n            color: #3869D4;\n        }\n\n        a img {\n            border: none;\n        }\n\n        /* Layout ------------------------------ */\n\n        .email-wrapper {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #F2F4F6;\n        }\n\n        .email-content {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        /* Masthead ----------------------- */\n\n        .email-masthead {\n            padding: 25px 0;\n            text-align: center;\n        }\n\n        .email-masthead_logo {\n            width: 94px;\n        }\n\n        .email-masthead_name {\n            font-size: 16px;\n            font-weight: bold;\n            color: #bbbfc3;\n            text-decoration: none;\n            text-shadow: 0 1px 0 white;\n        }\n\n        /* Body ------------------------------ */\n\n        .email-body {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            border-top: 1px solid #EDEFF2;\n            border-bottom: 1px solid #EDEFF2;\n            background-color: #FFFFFF;\n        }\n\n        .email-body_inner {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #FFFFFF;\n        }\n\n        .email-footer {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .email-footer p {\n            color: #AEAEAE;\n        }\n\n        .body-action {\n            width: 100%;\n            margin: 30px auto;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .body-sub {\n            margin-top: 25px;\n            padding-top: 25px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .content-cell {\n            padding: 35px;\n        }\n\n        .preheader {\n            display: none !important;\n        }\n\n        /* Attribute list ------------------------------ */\n\n        .attributes {\n            margin: 0 0 21px;\n        }\n\n        .attributes_content {\n            background-color: #EDEFF2;\n            padding: 16px;\n        }\n\n        .attributes_item {\n            padding: 0;\n        }\n\n        /* Related Items ------------------------------ */\n\n        .related {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .related_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .related_item-title {\n            display: block;\n            margin: .5em 0 0;\n        }\n\n        .related_item-thumb {\n            display: block;\n            padding-bottom: 10px;\n        }\n\n        .related_heading {\n            border-top: 1px solid #EDEFF2;\n            text-align: center;\n            padding: 25px 0 10px;\n        }\n\n        /* Discount Code ------------------------------ */\n\n        .discount {\n            width: 100%;\n            margin: 0;\n            padding: 24px;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #EDEFF2;\n            border: 2px dashed #9BA2AB;\n        }\n\n        .discount_heading {\n            text-align: center;\n        }\n\n        .discount_body {\n            text-align: center;\n            font-size: 15px;\n        }\n\n        /* Social Icons ------------------------------ */\n\n        .social {\n            width: auto;\n        }\n\n        .social td {\n            padding: 0;\n            width: auto;\n        }\n\n        .social_icon {\n            height: 20px;\n            margin: 0 8px 10px 8px;\n            padding: 0;\n        }\n\n        /* Data table ------------------------------ */\n\n        .purchase {\n            width: 100%;\n            margin: 0;\n            padding: 35px 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_content {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .purchase_heading {\n            padding-bottom: 8px;\n            border-bottom: 1px solid #EDEFF2;\n        }\n\n        .purchase_heading p {\n            margin: 0;\n            color: #9BA2AB;\n            font-size: 12px;\n        }\n\n        .purchase_footer {\n            padding-top: 15px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .purchase_total {\n            margin: 0;\n            text-align: right;\n            font-weight: bold;\n            color: #2F3133;\n        }\n\n        .purchase_total--label {\n            padding: 0 15px 0 0;\n        }\n\n        /* Utilities ------------------------------ */\n\n        .align-right {\n            text-align: right;\n        }\n\n        .align-left {\n            text-align: left;\n        }\n\n        .align-center {\n            text-align: center;\n        }\n\n        /*Media Queries ------------------------------ */\n\n        @media only screen and (max-width: 600px) {\n\n            .email-body_inner,\n            .email-footer {\n                width: 100% !important;\n            }\n        }\n\n        @media only screen and (max-width: 500px) {\n            .button {\n                width: 100% !important;\n            }\n        }\n\n        /* Buttons ------------------------------ */\n\n        .button {\n            background-color: #3869D4;\n            border-top: 10px solid #3869D4;\n            border-right: 18px solid #3869D4;\n            border-bottom: 10px solid #3869D4;\n            border-left: 18px solid #3869D4;\n            display: inline-block;\n            color: #FFF;\n            text-decoration: none;\n            border-radius: 3px;\n            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);\n            -webkit-text-size-adjust: none;\n        }\n\n        .button--green {\n            background-color: #22BC66;\n            border-top: 10px solid #22BC66;\n            border-right: 18px solid #22BC66;\n            border-bottom: 10px solid #22BC66;\n            border-left: 18px solid #22BC66;\n            color: white !important;\n        }\n\n        .button--red {\n            background-color: #FF6136;\n            border-top: 10px solid #FF6136;\n            border-right: 18px solid #FF6136;\n            border-bottom: 10px solid #FF6136;\n            border-left: 18px solid #FF6136;\n        }\n\n        /* Type ------------------------------ */\n\n        h1 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 19px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h2 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 16px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h3 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 14px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        p {\n            margin-top: 0;\n            color: #74787E;\n            font-size: 16px;\n            line-height: 1.5em;\n            text-align: left;\n        }\n\n        p.sub {\n            font-size: 12px;\n        }\n\n        p.center {\n            text-align: center;\n        }\n\n        .logo-container {\n            display: inline-block;\n            width: 100%;\n            text-align: center;\n            margin-top: 10px;\n        }\n\n        .logo {\n            display: inline-block;\n            height: 100px;\n            width: 100px;\n        }\n    </style>\n</head>\n\n<body>\n    <table class=\"email-wrapper\" width=\"100%\" cellpadd... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Verify Email\n\nHi {{ userName }},\nYou recently created your {{ display }}\naccount. Copy and paste the URL below into your web browser. This\nInvite is only valid for the next 1 hour.\n{{ verifyLink }}\n\n"
            },
            "template_variables": {
              "display": "Fynd",
              "userName": "Jason Bourne",
              "verifyLink": "https://fynd.com",
              "desktop_image": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-10T05:47:29.259Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "611212f18641474f083dfcca",
        "emailDropDownData": [
          {
            "value": "611212f18641474f083dfcca",
            "text": "Verify Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "611212f18641474f083dfcca",
            "text": "Verify Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for verifying mobile number of customers, who recently created their new account.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "611212f1864147cd623dfccb",
            "slug": "verify-link-sms-template",
            "name": "Verify Link",
            "template_variables": {
              "url": "https://www.fynd.com"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "To link your mobile number with your account, click {{ url }} - Team Fynd"
            },
            "created_at": "2021-08-10T05:47:29.263Z",
            "updated_at": "2021-08-10T05:47:29.263Z",
            "__v": 0
          }
        },
        "previousSms": "611212f1864147cd623dfccb",
        "smsDropDownData": [
          {
            "value": "611212f1864147cd623dfccb",
            "text": "Verify Link (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "611212f1864147cd623dfccb",
            "text": "Verify Link (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f4f16622828",
        "event": {
          "template": {
            "email": {
              "provider_type": "otp",
              "template": "611212f18641471d573dfccd"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "611212f1864147e7183dfcce"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email/sms template for verifying email ID of users, via a One-Time-Password.",
          "enabled": true,
          "editable": true,
          "group": "Signup & login",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08530b266a6e80ae8a8f",
          "slug": "verify-otp-event",
          "event_name": "Verify Otp",
          "created_at": "2021-08-06T10:00:51.186Z",
          "updated_at": "2022-05-16T07:51:29.440Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for verifying email ID of customers, via a One-Time-Password.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "611212f18641471d573dfccd",
            "slug": "verify-otp-email-template",
            "name": "Verify Otp",
            "subject": {
              "template_type": "nunjucks",
              "template": "Verify Email"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<!-- saved from url=(0069)http://assets.wildbit.com/postmark/templates/dist/password_reset.html -->\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <title>Verify Email</title>\n    <!-- \n    The style block is collapsed on page load to save you some scrolling.\n    Postmark automatically inlines all CSS properties for maximum email client \n    compatibility. You can just update styles here, and Postmark does the rest.\n    -->\n    <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n        /* Base ------------------------------ */\n\n        *:not(br):not(tr):not(html) {\n            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;\n            box-sizing: border-box;\n        }\n\n        body {\n            width: 100% !important;\n            height: 100%;\n            margin: 0;\n            line-height: 1.4;\n            background-color: #F2F4F6;\n            color: #74787E;\n            -webkit-text-size-adjust: none;\n        }\n\n        p,\n        ul,\n        ol,\n        blockquote {\n            line-height: 1.4;\n            text-align: left;\n        }\n\n        a {\n            color: #3869D4;\n        }\n\n        a img {\n            border: none;\n        }\n\n        /* Layout ------------------------------ */\n\n        .email-wrapper {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #F2F4F6;\n        }\n\n        .email-content {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        /* Masthead ----------------------- */\n\n        .email-masthead {\n            padding: 25px 0;\n            text-align: center;\n        }\n\n        .email-masthead_logo {\n            width: 94px;\n        }\n\n        .email-masthead_name {\n            font-size: 16px;\n            font-weight: bold;\n            color: #bbbfc3;\n            text-decoration: none;\n            text-shadow: 0 1px 0 white;\n        }\n\n        /* Body ------------------------------ */\n\n        .email-body {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            border-top: 1px solid #EDEFF2;\n            border-bottom: 1px solid #EDEFF2;\n            background-color: #FFFFFF;\n        }\n\n        .email-body_inner {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #FFFFFF;\n        }\n\n        .email-footer {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .email-footer p {\n            color: #AEAEAE;\n        }\n\n        .body-action {\n            width: 100%;\n            margin: 30px auto;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .body-sub {\n            margin-top: 25px;\n            padding-top: 25px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .content-cell {\n            padding: 35px;\n        }\n\n        .preheader {\n            display: none !important;\n        }\n\n        /* Attribute list ------------------------------ */\n\n        .attributes {\n            margin: 0 0 21px;\n        }\n\n        .attributes_content {\n            background-color: #EDEFF2;\n            padding: 16px;\n        }\n\n        .attributes_item {\n            padding: 0;\n        }\n\n        /* Related Items ------------------------------ */\n\n        .related {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .related_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .related_item-title {\n            display: block;\n            margin: .5em 0 0;\n        }\n\n        .related_item-thumb {\n            display: block;\n            padding-bottom: 10px;\n        }\n\n        .related_heading {\n            border-top: 1px solid #EDEFF2;\n            text-align: center;\n            padding: 25px 0 10px;\n        }\n\n        /* Discount Code ------------------------------ */\n\n        .discount {\n            width: 100%;\n            margin: 0;\n            padding: 24px;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #EDEFF2;\n            border: 2px dashed #9BA2AB;\n        }\n\n        .discount_heading {\n            text-align: center;\n        }\n\n        .discount_body {\n            text-align: center;\n            font-size: 15px;\n        }\n\n        /* Social Icons ------------------------------ */\n\n        .social {\n            width: auto;\n        }\n\n        .social td {\n            padding: 0;\n            width: auto;\n        }\n\n        .social_icon {\n            height: 20px;\n            margin: 0 8px 10px 8px;\n            padding: 0;\n        }\n\n        /* Data table ------------------------------ */\n\n        .purchase {\n            width: 100%;\n            margin: 0;\n            padding: 35px 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_content {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .purchase_heading {\n            padding-bottom: 8px;\n            border-bottom: 1px solid #EDEFF2;\n        }\n\n        .purchase_heading p {\n            margin: 0;\n            color: #9BA2AB;\n            font-size: 12px;\n        }\n\n        .purchase_footer {\n            padding-top: 15px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .purchase_total {\n            margin: 0;\n            text-align: right;\n            font-weight: bold;\n            color: #2F3133;\n        }\n\n        .purchase_total--label {\n            padding: 0 15px 0 0;\n        }\n\n        /* Utilities ------------------------------ */\n\n        .align-right {\n            text-align: right;\n        }\n\n        .align-left {\n            text-align: left;\n        }\n\n        .align-center {\n            text-align: center;\n        }\n\n        /*Media Queries ------------------------------ */\n\n        @media only screen and (max-width: 600px) {\n\n            .email-body_inner,\n            .email-footer {\n                width: 100% !important;\n            }\n        }\n\n        @media only screen and (max-width: 500px) {\n            .button {\n                width: 100% !important;\n            }\n        }\n\n        /* Buttons ------------------------------ */\n\n        .button {\n            background-color: #3869D4;\n            border-top: 10px solid #3869D4;\n            border-right: 18px solid #3869D4;\n            border-bottom: 10px solid #3869D4;\n            border-left: 18px solid #3869D4;\n            display: inline-block;\n            color: #FFF;\n            text-decoration: none;\n            border-radius: 3px;\n            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);\n            -webkit-text-size-adjust: none;\n        }\n\n        .button--green {\n            background-color: #22BC66;\n            border-top: 10px solid #22BC66;\n            border-right: 18px solid #22BC66;\n            border-bottom: 10px solid #22BC66;\n            border-left: 18px solid #22BC66;\n            color: white !important;\n        }\n\n        .button--red {\n            background-color: #FF6136;\n            border-top: 10px solid #FF6136;\n            border-right: 18px solid #FF6136;\n            border-bottom: 10px solid #FF6136;\n            border-left: 18px solid #FF6136;\n        }\n\n        /* Type ------------------------------ */\n\n        h1 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 19px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h1.otp{\n            font-size: 30px;\n        }\n\n        h2 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 16px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h3 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 14px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        p {\n            margin-top: 0;\n            color: #74787E;\n            font-size: 16px;\n            line-height: 1.5em;\n            text-align: left;\n        }\n\n        p.sub {\n            font-size: 12px;\n        }\n\n        p.center {\n            text-align: center;\n        }\n\n        .logo-container {\n            display: inline-block;\n            width: 100%;\n            text-align: center;\n            margin-top: 10px;\n        }\n\n        .logo {\n            display: inline-block;\n            height: 100px;\n            width: 100px;\n        }\n    </style>\n</head>\n\n<body... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Verify Email\n\nHi {{ userName }},\nEnter the below OTP to verify your email. This\nOTP is only valid for the next 10 minutes.\n{{ otp }}\n"
            },
            "template_variables": {
              "desktop_image": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png",
              "userName": "Jason Bourne",
              "otp": "1234"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-10T05:47:29.275Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "611212f18641471d573dfccd",
        "emailDropDownData": [
          {
            "value": "611212f18641471d573dfccd",
            "text": "Verify Otp (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "611212f18641471d573dfccd",
            "text": "Verify Otp (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for verifying mobile number of customers, via a One-Time-Password.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "611212f1864147e7183dfcce",
            "slug": "verify-otp-sms-template",
            "name": "Verify Otp",
            "template_variables": {
              "otp": "123456",
              "androidHash": "aK1xS3"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ otp }} is your OTP code for verifying your phone number on your account - Team Fynd {{ androidHash }}"
            },
            "created_at": "2021-08-10T05:47:29.281Z",
            "updated_at": "2021-08-10T05:47:29.281Z",
            "__v": 0
          }
        },
        "previousSms": "611212f1864147e7183dfcce",
        "smsDropDownData": [
          {
            "value": "611212f1864147e7183dfcce",
            "text": "Verify Otp (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "611212f1864147e7183dfcce",
            "text": "Verify Otp (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "61af025ec3e8c4cce5d00a1c",
        "event": {
          "template": {
            "email": {
              "provider_type": "otp",
              "template": null
            },
            "sms": {
              "provider_type": "otp",
              "template": "61af0257c3e8c47974d009f6"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email/sms template for verifying email ID of users, via a One-Time-Password.",
          "enabled": true,
          "editable": true,
          "group": "Signup & login",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "61af0257c3e8c47063d009f7",
          "slug": "send-otp-event",
          "event_name": "Send Otp",
          "created_at": "2021-12-07T06:42:31.138Z",
          "updated_at": "2022-05-16T07:51:29.406Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for verifying mobile number of customers, via a One-Time-Password.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "61af0257c3e8c47974d009f6",
            "slug": "send-otp-sms-template",
            "name": "Send Otp",
            "template_variables": {
              "otp": "123456",
              "androidHash": "aK1xS3"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Please verify your phone with OTP Code - {{otp}} in the box given."
            },
            "created_at": "2021-12-07T06:42:31.131Z",
            "updated_at": "2022-01-10T14:06:15.051Z",
            "__v": 0
          }
        },
        "previousSms": "61af0257c3e8c47974d009f6",
        "smsDropDownData": [
          {
            "value": "61af0257c3e8c47974d009f6",
            "text": "Send Otp (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "61af0257c3e8c47974d009f6",
            "text": "Send Otp (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "61dc3d571876f002b67e1eaa",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "611212f18641475eaa3dfcc9"
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email template for sending it to users, who have forgotten their password and wish to reset it.",
          "enabled": true,
          "editable": true,
          "group": "Signup & login",
          "channels": [
            "all"
          ],
          "priority": 4,
          "_id": "61dc3d571876f054be7e1ea6",
          "slug": "reset-password-event",
          "event_name": "Reset Password",
          "created_at": "2022-01-10T14:06:15.046Z",
          "updated_at": "2022-05-16T07:51:29.397Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for sending it to customers, who have forgotten their password and wish to reset it.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "611212f18641475eaa3dfcc9",
            "slug": "reset-password-email-template",
            "name": "Reset Password Email",
            "subject": {
              "template_type": "nunjucks",
              "template": "Reset Password"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<!-- saved from url=(0069)http://assets.wildbit.com/postmark/templates/dist/password_reset.html -->\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <title>Set up a new password for {{ display }}</title>\n    <!-- \n    The style block is collapsed on page load to save you some scrolling.\n    Postmark automatically inlines all CSS properties for maximum email client \n    compatibility. You can just update styles here, and Postmark does the rest.\n    -->\n    <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n        /* Base ------------------------------ */\n\n        *:not(br):not(tr):not(html) {\n            font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;\n            box-sizing: border-box;\n        }\n\n        body {\n            width: 100% !important;\n            height: 100%;\n            margin: 0;\n            line-height: 1.4;\n            background-color: #F2F4F6;\n            color: #74787E;\n            -webkit-text-size-adjust: none;\n        }\n\n        p,\n        ul,\n        ol,\n        blockquote {\n            line-height: 1.4;\n            text-align: left;\n        }\n\n        a {\n            color: #3869D4;\n        }\n\n        a img {\n            border: none;\n        }\n\n        /* Layout ------------------------------ */\n\n        .email-wrapper {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #F2F4F6;\n        }\n\n        .email-content {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        /* Masthead ----------------------- */\n\n        .email-masthead {\n            padding: 25px 0;\n            text-align: center;\n        }\n\n        .email-masthead_logo {\n            width: 94px;\n        }\n\n        .email-masthead_name {\n            font-size: 16px;\n            font-weight: bold;\n            color: #bbbfc3;\n            text-decoration: none;\n            text-shadow: 0 1px 0 white;\n        }\n\n        /* Body ------------------------------ */\n\n        .email-body {\n            width: 100%;\n            margin: 0;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            border-top: 1px solid #EDEFF2;\n            border-bottom: 1px solid #EDEFF2;\n            background-color: #FFFFFF;\n        }\n\n        .email-body_inner {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #FFFFFF;\n        }\n\n        .email-footer {\n            width: 570px;\n            margin: 0 auto;\n            padding: 0;\n            -premailer-width: 570px;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .email-footer p {\n            color: #AEAEAE;\n        }\n\n        .body-action {\n            width: 100%;\n            margin: 30px auto;\n            padding: 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            text-align: center;\n        }\n\n        .body-sub {\n            margin-top: 25px;\n            padding-top: 25px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .content-cell {\n            padding: 35px;\n        }\n\n        .preheader {\n            display: none !important;\n        }\n\n        /* Attribute list ------------------------------ */\n\n        .attributes {\n            margin: 0 0 21px;\n        }\n\n        .attributes_content {\n            background-color: #EDEFF2;\n            padding: 16px;\n        }\n\n        .attributes_item {\n            padding: 0;\n        }\n\n        /* Related Items ------------------------------ */\n\n        .related {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .related_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .related_item-title {\n            display: block;\n            margin: .5em 0 0;\n        }\n\n        .related_item-thumb {\n            display: block;\n            padding-bottom: 10px;\n        }\n\n        .related_heading {\n            border-top: 1px solid #EDEFF2;\n            text-align: center;\n            padding: 25px 0 10px;\n        }\n\n        /* Discount Code ------------------------------ */\n\n        .discount {\n            width: 100%;\n            margin: 0;\n            padding: 24px;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n            background-color: #EDEFF2;\n            border: 2px dashed #9BA2AB;\n        }\n\n        .discount_heading {\n            text-align: center;\n        }\n\n        .discount_body {\n            text-align: center;\n            font-size: 15px;\n        }\n\n        /* Social Icons ------------------------------ */\n\n        .social {\n            width: auto;\n        }\n\n        .social td {\n            padding: 0;\n            width: auto;\n        }\n\n        .social_icon {\n            height: 20px;\n            margin: 0 8px 10px 8px;\n            padding: 0;\n        }\n\n        /* Data table ------------------------------ */\n\n        .purchase {\n            width: 100%;\n            margin: 0;\n            padding: 35px 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_content {\n            width: 100%;\n            margin: 0;\n            padding: 25px 0 0 0;\n            -premailer-width: 100%;\n            -premailer-cellpadding: 0;\n            -premailer-cellspacing: 0;\n        }\n\n        .purchase_item {\n            padding: 10px 0;\n            color: #74787E;\n            font-size: 15px;\n            line-height: 18px;\n        }\n\n        .purchase_heading {\n            padding-bottom: 8px;\n            border-bottom: 1px solid #EDEFF2;\n        }\n\n        .purchase_heading p {\n            margin: 0;\n            color: #9BA2AB;\n            font-size: 12px;\n        }\n\n        .purchase_footer {\n            padding-top: 15px;\n            border-top: 1px solid #EDEFF2;\n        }\n\n        .purchase_total {\n            margin: 0;\n            text-align: right;\n            font-weight: bold;\n            color: #2F3133;\n        }\n\n        .purchase_total--label {\n            padding: 0 15px 0 0;\n        }\n\n        /* Utilities ------------------------------ */\n\n        .align-right {\n            text-align: right;\n        }\n\n        .align-left {\n            text-align: left;\n        }\n\n        .align-center {\n            text-align: center;\n        }\n\n        /*Media Queries ------------------------------ */\n\n        @media only screen and (max-width: 600px) {\n\n            .email-body_inner,\n            .email-footer {\n                width: 100% !important;\n            }\n        }\n\n        @media only screen and (max-width: 500px) {\n            .button {\n                width: 100% !important;\n            }\n        }\n\n        /* Buttons ------------------------------ */\n\n        .button {\n            background-color: #3869D4;\n            border-top: 10px solid #3869D4;\n            border-right: 18px solid #3869D4;\n            border-bottom: 10px solid #3869D4;\n            border-left: 18px solid #3869D4;\n            display: inline-block;\n            color: #FFF;\n            text-decoration: none;\n            border-radius: 3px;\n            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);\n            -webkit-text-size-adjust: none;\n        }\n\n        .button--green {\n            background-color: #22BC66;\n            border-top: 10px solid #22BC66;\n            border-right: 18px solid #22BC66;\n            border-bottom: 10px solid #22BC66;\n            border-left: 18px solid #22BC66;\n            color: white !important;\n        }\n\n        .button--red {\n            background-color: #FF6136;\n            border-top: 10px solid #FF6136;\n            border-right: 18px solid #FF6136;\n            border-bottom: 10px solid #FF6136;\n            border-left: 18px solid #FF6136;\n        }\n\n        /* Type ------------------------------ */\n\n        h1 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 19px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h2 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 16px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        h3 {\n            margin-top: 0;\n            color: #2F3133;\n            font-size: 14px;\n            font-weight: bold;\n            text-align: left;\n        }\n\n        p {\n            margin-top: 0;\n            color: #74787E;\n            font-size: 16px;\n            line-height: 1.5em;\n            text-align: left;\n        }\n\n        p.sub {\n            font-size: 12px;\n        }\n\n        p.center {\n            text-align: center;\n        }\n\n        .logo-container {\n            display: inline-block;\n            width: 100%;\n            text-align: center;\n            margin-top: 10px;\n        }\n\n        .logo {\n            display: inline-block;\n            height: 100px;\n            width: 100px;\n        }\n    </style>\n</head>\n\n<body>\n    <table class=\"email-wra... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Set up a new password for {{ display }}\n\nHi {{ userName }},\nYou recently requested to reset your password for your {{ display }}\naccount. Copy and paste the URL below into your web browser. This\nInvite is only valid for the next 30 minutes.\n{{ resetLink }}\n                                                    "
            },
            "template_variables": {
              "display": "Fynd",
              "userName": "Jason Bourne",
              "resetLink": "https://fynd.com",
              "desktop_image": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-10T05:47:29.185Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "611212f18641475eaa3dfcc9",
        "emailDropDownData": [
          {
            "value": "611212f18641475eaa3dfcc9",
            "text": "Reset Password Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "611212f18641475eaa3dfcc9",
            "text": "Reset Password Email (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ]
      }
    ]
  },
  {
    "name": "Order Processing",
    "children": [
      {
        "appSubscriptionId": "610d1805f6ad2fa0f862281d",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a3180ae8a68"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266af28cae8a69"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their order is successfully placed.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 1,
          "_id": "610d08520b266a6dcfae8a6a",
          "slug": "placed-event",
          "event_name": "Online order placed ",
          "created_at": "2021-08-06T10:00:50.776Z",
          "updated_at": "2022-05-16T07:51:28.827Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order is successfully placed.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "610d08520b266a3180ae8a68",
            "slug": "placed-email",
            "name": "Online order Placed",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n    <title>{{title}}</title>\n  </head>\n\n  <body\n    class=\"order_cnf_bg\"\n    style=\"background: #f2f2f2; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n  >\n    <span\n      class=\"subject-line\"\n      style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n      >{{subject_line}}</span\n    >\n    <table\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      height=\"100%\"\n      width=\"600px\"\n      align=\"center\"\n      class=\"order-confirmation\"\n      style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n    >\n      <tr>\n        <td\n          align=\"center\"\n          valign=\"top\"\n          class=\"border\"\n          style=\"border-bottom: 1px solid #D7D7D7;\"\n        >\n          <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"100%\"\n            align=\"center\"\n          >\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\">\n                <a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"\n                  ><img\n                    style=\"max-height:150px\"\n                    src=\"{{ ref_application.logo.secure_url }}\"\n                    border=\"0\"\n                    alt=\"\"\n                /></a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p\n                    class=\"title-name\"\n                    style=\"font-size: 14px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Hey {{name}},\n                  </p>\n                  <p\n                    class=\"title-order-line\"\n                    style=\"font-size: 14px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Woohoo! Your Order No. <b>{{order_no}} </b>has been\n                    successfully placed.\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"items-cont\"\n                    style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        class=\"img-portion\"\n                        style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <a href=\"{{item.item_image_link}}\" target=\"_blank\"\n                          ><img\n                            src=\"{{item.item_image}}\"\n                            alt=\"{{item.item_name}}\"\n                            style=\"width: 89px; height: 139px; display: block;\"\n                        /></a>\n                      </td>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        width=\"300px\"\n                        style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <p\n                          class=\"product\"\n                          style=\"color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          {{item.item_name}}\n                        </p>\n                        <p\n                          class=\"product size\"\n                          style=\"color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          Size: {{item.item_size}}\n                        </p>\n                      </td>\n                      <td\n                        align=\"right\"\n                        valign=\"top\"\n                        class=\"price-td\"\n                        style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; width: 120px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <b\n                          class=\"product price\"\n                          style=\"color: #41434C; font-size: 14px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\"\n                          >&#8377; {{item.price_effective}}</b\n                        >\n                      </td>\n                    </tr>\n                  </table>\n\n                  {% endfor %}\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"break-up-values\"\n                    style=\"padding: 10px 20px;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"top\"\n                        width=\"280px\"\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      ></td>\n                      <td\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      >\n                        <table\n                          border=\"0\"\n                          cellpadding=\"0\"\n                          cellspacing=\"0\"\n                          height=\"100%\"\n                          width=\"100%\"\n                          class=\"break-up\"\n                          style=\"padding-right: 16px;\"\n                        >\n                          <tr>\n                            <td\n                              align=\"left\"\n                              valign=\"top\"\n                              class=\"breakup-text\"\n                              style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              Sub Total\n                            </td>\n                            <td\n                              align=\"right\"\n                              valign=\"top\"\n                              class=\"breakup-amount\"\n                              style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              &#8377; {{sub_total}}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    Convenience Fee\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    &#8377; {{convenience_fee}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin: 0;width: 100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                  ... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nYour order# {{order_no}} has been received. The following item(s) will be delivered to you soon.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": "FY5E53AFAA091115C235",
              "total": "1,099.00",
              "convenience_fee": null,
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069    Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "ALWIRASHEIKH@GMAIL.COM",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.764Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a3180ae8a68",
        "emailDropDownData": [
          {
            "value": "610d08520b266a3180ae8a68",
            "text": "Online order Placed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a3180ae8a68",
            "text": "Online order Placed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for notifying the customers, that their order is successfully placed.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "610d08520b266af28cae8a69",
            "slug": "placed-sms",
            "name": "Online order placed",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "orderedItems": [
                {
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "amount_paid": 2100,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "is_max_date_present": "true",
              "cashback": 0,
              "max_delivery_date_display": "Mon, 29 Nov",
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ brand }} {{ orderID }} for {{ articles }} has been placed and will be delivered{% if is_max_date_present %} before {{max_delivery_date_display}}{% endif %} via Fynd. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.770Z",
            "updated_at": "2022-05-09T09:11:15.343Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266af28cae8a69",
        "smsDropDownData": [
          {
            "value": "610d08520b266af28cae8a69",
            "text": "Online order placed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266af28cae8a69",
            "text": "Online order placed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "616feb618f4b28e780bcd9d3",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "61654c618fd0c474b8d04e53"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "61654c618fd0c4e297d04e54"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customer, that their order is placed and can be picked up by customer from the store.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 1,
          "_id": "616feb608f4b2851d9bcd9d1",
          "slug": "pick_at_store_placed-event",
          "event_name": "Pick at store order placed",
          "created_at": "2021-10-20T10:11:44.188Z",
          "updated_at": "2022-05-16T07:51:28.813Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order can be picked up by customer.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "61654c618fd0c474b8d04e53",
            "slug": "pick_at_store_placed-email",
            "name": "Pick at store order Placed",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n    <title>{{title}}</title>\n  </head>\n\n  <body\n    class=\"order_cnf_bg\"\n    style=\"background: #f2f2f2; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n  >\n    <span\n      class=\"subject-line\"\n      style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n      >{{subject_line}}</span\n    >\n    <table\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      height=\"100%\"\n      width=\"600px\"\n      align=\"center\"\n      class=\"order-confirmation\"\n      style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n    >\n      <tr>\n        <td\n          align=\"center\"\n          valign=\"top\"\n          class=\"border\"\n          style=\"border-bottom: 1px solid #D7D7D7;\"\n        >\n          <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"100%\"\n            align=\"center\"\n          >\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\">\n                <a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"\n                  ><img\n                    style=\"max-height:150px\"\n                    src=\"{{ ref_application.logo.secure_url }}\"\n                    border=\"0\"\n                    alt=\"\"\n                /></a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p\n                    class=\"title-name\"\n                    style=\"font-size: 14px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Hey {{name}},\n                  </p>\n                  <p\n                    class=\"title-order-line\"\n                    style=\"font-size: 14px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Woohoo! Your Order No. <b>{{order_no}} </b>has been\n                    successfully placed.\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"items-cont\"\n                    style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        class=\"img-portion\"\n                        style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <a href=\"{{item.item_image_link}}\" target=\"_blank\"\n                          ><img\n                            src=\"{{item.item_image}}\"\n                            alt=\"{{item.item_name}}\"\n                            style=\"width: 89px; height: 139px; display: block;\"\n                        /></a>\n                      </td>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        width=\"300px\"\n                        style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <p\n                          class=\"product\"\n                          style=\"color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          {{item.item_name}}\n                        </p>\n                        <p\n                          class=\"product size\"\n                          style=\"color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          Size: {{item.item_size}}\n                        </p>\n                      </td>\n                      <td\n                        align=\"right\"\n                        valign=\"top\"\n                        class=\"price-td\"\n                        style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; width: 120px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <b\n                          class=\"product price\"\n                          style=\"color: #41434C; font-size: 14px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\"\n                          >&#8377; {{item.price_effective}}</b\n                        >\n                      </td>\n                    </tr>\n                  </table>\n\n                  {% endfor %}\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"break-up-values\"\n                    style=\"padding: 10px 20px;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"top\"\n                        width=\"280px\"\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      ></td>\n                      <td\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      >\n                        <table\n                          border=\"0\"\n                          cellpadding=\"0\"\n                          cellspacing=\"0\"\n                          height=\"100%\"\n                          width=\"100%\"\n                          class=\"break-up\"\n                          style=\"padding-right: 16px;\"\n                        >\n                          <tr>\n                            <td\n                              align=\"left\"\n                              valign=\"top\"\n                              class=\"breakup-text\"\n                              style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              Sub Total\n                            </td>\n                            <td\n                              align=\"right\"\n                              valign=\"top\"\n                              class=\"breakup-amount\"\n                              style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              &#8377; {{sub_total}}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    Convenience Fee\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    &#8377; {{convenience_fee}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin: 0;width: 100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                  ... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nYour order# {{order_no}} has been received. The following item(s) will be delivered to you soon.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": "FY5E53AFAA091115C235",
              "total": "1,099.00",
              "convenience_fee": null,
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069    Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "ALWIRASHEIKH@GMAIL.COM",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-10-12T08:50:41.190Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "61654c618fd0c474b8d04e53",
        "emailDropDownData": [
          {
            "value": "61654c618fd0c474b8d04e53",
            "text": "Pick at store order Placed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "61654c618fd0c474b8d04e53",
            "text": "Pick at store order Placed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for notifying the customers, that their order can be picked up by customer.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "61654c618fd0c4e297d04e54",
            "slug": "pick_at_store_placed-sms",
            "name": "Pick at store order Placed",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "order_type": "PICKATSTORE",
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ brand }} {{ orderID }} for {{ articles }} has been placed and can be picked up at the store. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd."
            },
            "created_at": "2021-10-12T08:50:41.197Z",
            "updated_at": "2021-11-25T11:02:33.703Z",
            "__v": 0
          }
        },
        "previousSms": "61654c618fd0c4e297d04e54",
        "smsDropDownData": [
          {
            "value": "61654c618fd0c4e297d04e54",
            "text": "Pick at store order Placed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "61654c618fd0c4e297d04e54",
            "text": "Pick at store order Placed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fd31762280f",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266af53dae8a4c"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template for notifying the customers, that their requested order has arrived at the store.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "610d08520b266a2d70ae8a4d",
          "slug": "arrived_at_store-event",
          "event_name": "Arrived at store",
          "created_at": "2021-08-06T10:00:50.478Z",
          "updated_at": "2022-05-16T07:51:28.293Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": false,
            "is_internal": false,
            "description": "Use this SMS template, for notifying the customers, that their requested order has arrived at the store.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "62516d33c6465a555039cd38",
            "name": "Order Arrived at Store",
            "meta": {
              "type": "cloned",
              "template": "610d08520b266af53dae8a4c",
              "is_system": true
            },
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Delivered. Your shipment for {{ articles }} with {{ orderID }} has been delivered today at {{ delivered_at }}. You can collect it from store on or before {{ collection_date }}. Notification via Fynd"
            },
            "application": "000000000000000000000001",
            "created_at": "2022-04-09T11:25:39.498Z",
            "updated_at": "2022-04-09T11:25:39.498Z",
            "slug": "Order-Arrived-at-Store--bCoiYXwR",
            "__v": 0
          }
        },
        "previousSms": "62516d33c6465a555039cd38",
        "smsDropDownData": [
          {
            "value": "610d08520b266af53dae8a4c",
            "text": "Order Arrived at Store (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266af53dae8a4c",
            "text": "Order Arrived at Store (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fc7b4622810",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a2b81ae8a50"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template for notifying the customers, that their requested order is being dispatched to a store.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08520b266a2e31ae8a51",
          "slug": "bag_packed-event",
          "event_name": "Packed",
          "created_at": "2021-08-06T10:00:50.499Z",
          "updated_at": "2022-05-16T07:51:28.392Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template, for notifying the customers, that their requested order is being dispatched to a store.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a2b81ae8a50",
            "slug": "bag_packed-sms",
            "name": "Order Packed",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "payment_mode": "NB",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "action_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "amount_paid": 3000,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Dear {{ name }}, your {{ orderID }} for {{ brand }} - {{ articles }} with shipment {{ shipmentID }} is ready to be dispatched at {{ action_date }}.{% if payment_mode == 'COD' %} Please keep cash ready of Rs.{{amount_paid}}.{% endif %} For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.493Z",
            "updated_at": "2022-04-13T05:18:32.626Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a2b81ae8a50",
        "smsDropDownData": [
          {
            "value": "610d08520b266a2b81ae8a50",
            "text": "Order Packed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a2b81ae8a50",
            "text": "Order Packed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2ffe3362280e",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61a97b963d167fd41b94"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a8aabae8a4e"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template for notifying the customers, that their requested order is being lost.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08520b266abf87ae8a4f",
          "slug": "bag_lost-event",
          "event_name": "Lost",
          "created_at": "2021-08-06T10:00:50.488Z",
          "updated_at": "2022-05-16T07:51:28.381Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order is lost.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "621c61a97b963d167fd41b94",
            "slug": "bag_lost-email",
            "name": "Order Lost",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your <b>Order# {{order_no}}</b> has been accidentally lost by our delivery partner. we are really sorry for the inconvenience.</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"> If you have made an online payment the refund will be processed in the next 2-3 working days. </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your Order# {{order_no}} is/are  has been accidentally lost by our delivery partner. we are really sorry for the inconvenience.\n\nIf you have made an online payment the refund will be processed in the next 2-3 working days..\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nDelivery Address\n\n{{delivery_address}}\n\nWe've got you covered here, but in case of any mess up, kindly drop a mail to care@gofynd.com and we'll try our best to get your issue resolved.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "total": "1,099.00",
              "convenience_fee": "80.00",
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "alwirasheikh@gofynd.com",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "coupon_code": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235with shipment ID : SH-2020224-5E53AFAA0-1172A1789",
              "title": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-02-28T05:46:17.257Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "621c61a97b963d167fd41b94",
        "emailDropDownData": [
          {
            "value": "621c61a97b963d167fd41b94",
            "text": "Order Lost (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "621c61a97b963d167fd41b94",
            "text": "Order Lost (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": false,
            "is_internal": false,
            "description": "Use this SMS template, for notifying the customers, that their requested order is lost.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "62541f86c6465a8e6139cd3e",
            "name": "Order Lost Test",
            "meta": {
              "type": "cloned",
              "template": "610d08520b266a8aabae8a4e",
              "is_system": true
            },
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "payment_mode": "NB",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "SAPPER",
              "name": "Pranav Verma",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "action_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "amount_paid": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Dear {{ name }}, your {{ orderID }} for {{ brand }} - {{ articles }} with shipment {{ shipmentID }} has been accidentally lost by our delivery partner. If you have made online payment the refund will be proceed in next 2-3 working days. Notification via Fynd"
            },
            "application": "000000000000000000000001",
            "created_at": "2022-04-11T12:31:02.293Z",
            "updated_at": "2022-04-11T12:31:02.293Z",
            "slug": "Order-Lost-Test-w_csVy9Fm",
            "__v": 0
          }
        },
        "previousSms": "62541f86c6465a8e6139cd3e",
        "smsDropDownData": [
          {
            "value": "610d08520b266a8aabae8a4e",
            "text": "Order Lost (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a8aabae8a4e",
            "text": "Order Lost (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f063f622811",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61a97b963d442cd41b95"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266abc17ae8a52"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template for notifying the customers, that their requested order is being dispatched from a store.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08520b266ad94dae8a53",
          "slug": "bag_picked-event",
          "event_name": "Picked",
          "created_at": "2021-08-06T10:00:50.547Z",
          "updated_at": "2022-05-16T07:51:28.409Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order has been dispatched.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "621c61a97b963d442cd41b95",
            "slug": "bag_picked-email",
            "name": "Order picked",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your<b> Order#{{order_no}} </b>has been dispatched.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Delivery Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Now</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your Order#{{order_no}} has been dispatched.\n\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nDelivery Address\n\n{{delivery_address}}\n\nWe've got you covered here, but in case of any mess up, kindly drop a mail to care@gofynd.com and we'll try our best to get your issue resolved.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "total": "1,099.00",
              "convenience_fee": "80.00",
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "alwirasheikh@gofynd.com",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "coupon_code": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235with shipment ID : SH-2020224-5E53AFAA0-1172A1789",
              "title": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-02-28T05:46:17.311Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "621c61a97b963d442cd41b95",
        "emailDropDownData": [
          {
            "value": "621c61a97b963d442cd41b95",
            "text": "Order picked (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "621c61a97b963d442cd41b95",
            "text": "Order picked (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template, for notifying the customers, that their requested order is being dispatched from a store.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266abc17ae8a52",
            "slug": "bag_picked-sms",
            "name": "Order Picked",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16494991436731346101",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "is_promise_date_present": "true",
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "amount_paid": 3054,
              "cod": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your {{orderID}} for {{ brand }} - {{ articles }} has been picked{% if is_promise_date_present %} and will be delivered on {{promise_date_display}}{% endif %} via Fynd. Track your shipment at: {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.503Z",
            "updated_at": "2022-04-13T05:18:32.650Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266abc17ae8a52",
        "smsDropDownData": [
          {
            "value": "610d08520b266abc17ae8a52",
            "text": "Order Picked (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266abc17ae8a52",
            "text": "Order Picked (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "61d28da92bb02a16c3d68306",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "61d28d9e2bb02a4178d682e0"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "This sms will be delivered to customer when shipment will be delivered to customer before promise date.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "61d28d9e2bb02af1eed682e1",
          "slug": "arriving_early_out_for_delivery-event",
          "event_name": "Arriving Early Sms",
          "created_at": "2022-01-03T05:46:06.935Z",
          "updated_at": "2022-05-16T07:51:28.307Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "This sms will be delivered to customer when shipment will be delivered to customer before promise date.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "61d28d9e2bb02a4178d682e0",
            "slug": "arriving_early-sms",
            "name": "Arriving Early Sms",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "payment_mode": "NB",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "action_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "amount_paid": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Arriving Early!! {{ articles }} in {{ brand }} {{ orderID }} is out for delivery via Fynd. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2022-01-03T05:46:06.915Z",
            "updated_at": "2022-01-03T05:46:06.915Z",
            "__v": 0
          }
        },
        "previousSms": "61d28d9e2bb02a4178d682e0",
        "smsDropDownData": [
          {
            "value": "61d28d9e2bb02a4178d682e0",
            "text": "Arriving Early Sms (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "61d28d9e2bb02a4178d682e0",
            "text": "Arriving Early Sms (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "61dc3d571876f099237e1ea9",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "61dc3d551876f069f27e1ea4"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "This sms will be delivered to customer when shipment was not delivered to customer as per the promise date.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "61dc3d551876f007ac7e1ea5",
          "slug": "delay_delivery-event",
          "event_name": "Delay Delivery Sms",
          "created_at": "2022-01-10T14:06:13.952Z",
          "updated_at": "2022-05-16T07:51:28.498Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "This sms will be delivered to customer when shipment was not delivered to customer as per the promise date.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "61dc3d551876f069f27e1ea4",
            "slug": "delay_delivery-sms",
            "name": "Delay delivery Sms",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "payment_mode": "NB",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "action_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "amount_paid": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your order delivery will be delayed for {{ brand }} {{ orderID }} for {{ articles }}. Sorry for inconvenience. Visit {{tracking_url}} to track. Notification via Fynd"
            },
            "created_at": "2022-01-10T14:06:13.941Z",
            "updated_at": "2022-01-10T14:06:13.941Z",
            "__v": 0
          }
        },
        "previousSms": "61dc3d551876f069f27e1ea4",
        "smsDropDownData": [
          {
            "value": "61dc3d551876f069f27e1ea4",
            "text": "Delay delivery Sms (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "61dc3d551876f069f27e1ea4",
            "text": "Delay delivery Sms (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f1b0e62281a",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a7a81ae8a62"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266af489ae8a63"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their order is out for delivery.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 4,
          "_id": "610d08520b266ab616ae8a64",
          "slug": "out_for_delivery-event",
          "event_name": "Out for delivery",
          "created_at": "2021-08-06T10:00:50.698Z",
          "updated_at": "2022-05-16T07:51:28.782Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order is out for delivery.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "610d08520b266a7a81ae8a62",
            "slug": "out_for_delivery-email",
            "name": "Out for delivery",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your <b>Order# {{order_no}} </b>is/are out for delivery. Our delivery executive should reach you any moment now.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Delivery Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Now</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your Order# {{order_no}} is/are out for delivery. Our delivery executive should reach you any moment now.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nDelivery Address\n\n{{delivery_address}}\n\nWe've got you covered here, but in case of any mess up, kindly drop a mail to care@gofynd.com and we'll try our best to get your issue resolved.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "total": "1,099.00",
              "convenience_fee": "80.00",
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "alwirasheikh@gofynd.com",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "coupon_code": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235with shipment ID : SH-2020224-5E53AFAA0-1172A1789",
              "title": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.687Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a7a81ae8a62",
        "emailDropDownData": [
          {
            "value": "610d08520b266a7a81ae8a62",
            "text": "Out for delivery (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a7a81ae8a62",
            "text": "Out for delivery (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for notifying the customers, that their order is out for delivery.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "610d08520b266af489ae8a63",
            "slug": "out_for_delivery-sms",
            "name": "Out for delivery",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16298768762811794288",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ articles }} in {{ brand }} {{ orderID }} is out for delivery via Fynd. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.692Z",
            "updated_at": "2022-05-09T09:11:15.233Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266af489ae8a63",
        "smsDropDownData": [
          {
            "value": "610d08520b266af489ae8a63",
            "text": "Out for delivery (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266af489ae8a63",
            "text": "Out for delivery (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f40b8622817",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "61654c618fd0c4075cd04e52"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266afd25ae8a60"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template for informing the customers, that their order is successfully handed over to them.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 5,
          "_id": "610d08520b266a0c6fae8a61",
          "slug": "handed_over_to_customer-event",
          "event_name": "Handed over to customer",
          "created_at": "2021-08-06T10:00:50.682Z",
          "updated_at": "2022-05-16T07:51:28.613Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their order is successfully placed and picked from store.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "61654c618fd0c4075cd04e52",
            "slug": "handed_over_to_customer-email",
            "name": "Order handed over to customer for pick at store order",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n    <title>{{title}}</title>\n  </head>\n\n  <body\n    class=\"order_cnf_bg\"\n    style=\"background: #f2f2f2; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n  >\n    <span\n      class=\"subject-line\"\n      style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n      >{{subject_line}}</span\n    >\n    <table\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      height=\"100%\"\n      width=\"600px\"\n      align=\"center\"\n      class=\"order-confirmation\"\n      style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n    >\n      <tr>\n        <td\n          align=\"center\"\n          valign=\"top\"\n          class=\"border\"\n          style=\"border-bottom: 1px solid #D7D7D7;\"\n        >\n          <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"100%\"\n            align=\"center\"\n          >\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\">\n                <a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"\n                  ><img\n                    style=\"max-height:150px\"\n                    src=\"{{ ref_application.logo.secure_url }}\"\n                    border=\"0\"\n                    alt=\"\"\n                /></a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p\n                    class=\"title-name\"\n                    style=\"font-size: 14px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Hey {{name}},\n                  </p>\n                  <p\n                    class=\"title-order-line\"\n                    style=\"font-size: 14px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Your Order No. <b>{{order_no}} </b>has been picked up by you.                   <a href=\"{{shipment_invoice_link}}\">Click here to get invoice</a>\n\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"items-cont\"\n                    style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        class=\"img-portion\"\n                        style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <a href=\"{{item.item_image_link}}\" target=\"_blank\"\n                          ><img\n                            src=\"{{item.item_image}}\"\n                            alt=\"{{item.item_name}}\"\n                            style=\"width: 89px; height: 139px; display: block;\"\n                        /></a>\n                      </td>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        width=\"300px\"\n                        style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <p\n                          class=\"product\"\n                          style=\"color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          {{item.item_name}}\n                        </p>\n                        <p\n                          class=\"product size\"\n                          style=\"color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                        >\n                          Size: {{item.item_size}}\n                        </p>\n                      </td>\n                      <td\n                        align=\"right\"\n                        valign=\"top\"\n                        class=\"price-td\"\n                        style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; width: 120px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\"\n                      >\n                        <b\n                          class=\"product price\"\n                          style=\"color: #41434C; font-size: 14px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\"\n                          >&#8377; {{item.price_effective}}</b\n                        >\n                      </td>\n                    </tr>\n                  </table>\n\n                  {% endfor %}\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"break-up-values\"\n                    style=\"padding: 10px 20px;\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"top\"\n                        width=\"280px\"\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      ></td>\n                      <td\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                      >\n                        <table\n                          border=\"0\"\n                          cellpadding=\"0\"\n                          cellspacing=\"0\"\n                          height=\"100%\"\n                          width=\"100%\"\n                          class=\"break-up\"\n                          style=\"padding-right: 16px;\"\n                        >\n                          <tr>\n                            <td\n                              align=\"left\"\n                              valign=\"top\"\n                              class=\"breakup-text\"\n                              style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              Sub Total\n                            </td>\n                            <td\n                              align=\"right\"\n                              valign=\"top\"\n                              class=\"breakup-amount\"\n                              style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                            >\n                              &#8377; {{sub_total}}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 419px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    Convenience Fee\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"color: #41434C; padding: 6px 0; width: 139px; font-size: 14px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"\n                                  >\n                                    &#8377; {{convenience_fee}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin: 0;width: 100%;\">\n                                <tr>\n                                  <td\n                             ... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHey {{name}},\nYour order# {{order_no}} has been picked up by you. Click here to get invoice: {{shipment_invoice_link}}\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": "FY5E53AFAA091115C235",
              "total": "1,099.00",
              "convenience_fee": null,
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069    Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "ALWIRASHEIKH@GMAIL.COM",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "bag_count": 10,
              "email_subject": "Your SAPPER Order of Blue Solid Slim Fit Trackpants (28) has been placed",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-10-12T08:50:41.084Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "61654c618fd0c4075cd04e52",
        "emailDropDownData": [
          {
            "value": "61654c618fd0c4075cd04e52",
            "text": "Order handed over to customer for pick at store order (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "61654c618fd0c4075cd04e52",
            "text": "Order handed over to customer for pick at store order (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template, for informing the customers that their order is successfully handed over to them.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266afd25ae8a60",
            "slug": "handed_over_to_customer-sms",
            "name": "Order Handed Over to Customer",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "shipment_invoice_link": "https://fplt.ly/6qotXvcbA",
              "bag_count": 10,
              "amount_paid": 999,
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "delivered_at": "GT_Store, Vashi",
              "collection_date": "Fri, Nov 15",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ brand }} {{ orderID }} for {{ articles }} has been picked up by you at the store. Get invoice here {{shipment_invoice_link}} for queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd."
            },
            "created_at": "2021-08-06T10:00:50.677Z",
            "updated_at": "2021-11-23T05:05:37.934Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266afd25ae8a60",
        "smsDropDownData": [
          {
            "value": "610d08520b266afd25ae8a60",
            "text": "Order Handed Over to Customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266afd25ae8a60",
            "text": "Order Handed Over to Customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f54fe622816",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a3c53ae8a5d"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a111aae8a5e"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for sending it to customers, whose orders have been successfully delivered.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 6,
          "_id": "610d08520b266a7926ae8a5f",
          "slug": "delivery_done-event",
          "event_name": "Delivered",
          "created_at": "2021-08-06T10:00:50.673Z",
          "updated_at": "2022-05-16T07:51:28.580Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for sending it to customers, whose orders have been successfully delivered.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "610d08520b266a3c53ae8a5d",
            "slug": "delivery_done-email",
            "name": "Order delivered",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body><span class=\"subject-line\" style=\"font-family: Arial; -webkit-font-smoothing: antialiased; display: none; font-size: 14px; padding: 0 10px; text-align: center; visibility: hidden; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"delivered-confirmation\" style=\"letter-spacing: 0.3px; font-family: Arial; -webkit-font-smoothing: antialiased; border: 1px solid #ccc;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"grey-bg\" style=\"background: #f4f4f4; padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-weight: bold;\">Hello {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 13pt; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; word-spacing: 2px;\">Your {{item_name}}({{item_size}})<b> in order# {{order_no}} </b> has been delivered.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\">\n                    <tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"padding: 20px 0; border-bottom: 1px solid #D7D7D7; width: 86px;\"><a href=\"{{item_image_link}}\"><img src=\"{{item_image}}\" alt=\"\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"310px\" style=\"padding: 20px 0; border-bottom: 1px solid #D7D7D7;\">\n                        <p class=\"product\" style=\"margin: 3px 0; font-size: 13pt; color: #41434C;\">{{item_brand}}</p>\n                        <p class=\"product\" style=\"margin: 3px 0; font-size: 13pt; color: #41434C;\">{{item_name}}</p>\n                        <p class=\"product size\" style=\"margin: 3px 0; font-size: 13pt; color: #41434C; padding: 8px 0;\">Size: {{item_size}}</p>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td align=\"left\" valign=\"top\" width=\"50%\" style=\"padding: 15px 20px; border-bottom: 1px solid #D7D7D7;\">\n                <p class=\"address\" style=\"margin: 7px; font-size: 12pt; color: #41434C;\"><b>Delivery Address</b></p>\n                <p class=\"address\" style=\"margin: 7px; font-size: 12pt; color: #41434C;\">{{delivery_address}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Fynd - Online Fashion Shopping\n\nHello {{name}}\n\nYour {{item_name}}({{item_size}}) in order# {{order_no}} has been delivered.\n\n<loop>\n  {{item_brand}} {{item_name}} [Size: {{item_size}}]\n</loop>\n\nDelivery Address\n{{delivery_address}}\n\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "cashback_applied": 0,
              "cod_charges": "0.00",
              "convenience_fee": "80.00",
              "coupon_code": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_charges": "0.00",
              "delivery_slot": "",
              "discount_coupon": "0",
              "fynd_cash_referral": 0,
              "fynd_cash_refund": 0,
              "invoice_id": 7255087,
              "item_brand": "SAPPER",
              "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
              "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
              "item_size": "28",
              "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
              "name": "Alwira Sheikh",
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "sub_total": "2,199.00",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": null,
              "total": "1,099.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_email": "alwirasheikh@gofynd.com",
              "you_saved": "1,100.00",
              "ordering_channel": "ECOMM",
              "email_subject": "SAPPER Order for Blue Solid Slim Fit Trackpants (28) has been delivered ",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.658Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a3c53ae8a5d",
        "emailDropDownData": [
          {
            "value": "610d08520b266a3c53ae8a5d",
            "text": "Order delivered (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a3c53ae8a5d",
            "text": "Order delivered (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for sending it to customers, whose orders have been successfully delivered.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a111aae8a5e",
            "slug": "delivery_done-sms",
            "name": "Order delivered",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16495005795601272454",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "amount_paid": 3054,
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ articles }} in your {{ brand }} order {{ orderID }} is delivered. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Delivered via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.666Z",
            "updated_at": "2022-04-13T05:18:32.824Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a111aae8a5e",
        "smsDropDownData": [
          {
            "value": "610d08520b266a111aae8a5e",
            "text": "Order delivered (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a111aae8a5e",
            "text": "Order delivered (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fffbe62281b",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a9163ae8a65"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a45bbae8a66"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to inform the customers, that an executive will soon collect their items.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 7,
          "_id": "610d08520b266a0f18ae8a67",
          "slug": "out_for_pickup-event",
          "event_name": "Out for pickup",
          "created_at": "2021-08-06T10:00:50.758Z",
          "updated_at": "2022-05-16T07:51:28.797Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to inform the customers, that an executive will reach soon to collect the rejected items.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a9163ae8a65",
            "slug": "out_for_pickup-email",
            "name": "Out for pickup",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n<!--                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Our executive is on his way to pick up the following product(s) in Order#<b>{{order_no}}</b>. Please ensure your presence at the pick up address mentioned below for a smooth return experience.</p>-->\n                      <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Your order {{order_no}} for {{item_name}} is ready for pick up and delivered to you soon. For more details {{tracking_url}}</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Pickup Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Now</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        <... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nDear {{name}}, Your order {{orderID}} for {{ articles }} of {{ brand }} is ready for pick up and delivered to you soon. For more details {{tracking_url}}\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nPickup Address\n\n{{delivery_address}}\n\nWe know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have more queries just drop us a mail on care@gofynd.com\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E53AFAA091115C235",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": 1099,
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "sub_total": "2,199.00",
              "convenience_fee": null,
              "discount_coupon": null,
              "delivery_charges": null,
              "cod_charges": null,
              "you_saved": null,
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "total": "1,099.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "Alwira Sheikh",
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "alwirasheikh@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have more queries just drop us a mail on care@fynd.com",
              "payment_mode": "Cash on Delivery",
              "brand_name": "SAPPER",
              "ordering_channel": "ECOMM",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": "Out for Pickup - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "email_subject": "Out for Pickup - SAPPER Order FY5E53AFAA091115C235"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.703Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a9163ae8a65",
        "emailDropDownData": [
          {
            "value": "610d08520b266a9163ae8a65",
            "text": "Out for pickup (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a9163ae8a65",
            "text": "Out for pickup (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to inform the customers, that there ordder is ready and will be soon picked up.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a45bbae8a66",
            "slug": "out_for_pickup-sms",
            "name": "Out for pickup",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16298768762811794288",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your {{orderID}} for {{ articles }} of {{ brand }} is ready for pick up and will be delivered to you via Fynd. For more details {{tracking_url}}"
            },
            "created_at": "2021-08-06T10:00:50.752Z",
            "updated_at": "2022-05-09T09:11:15.314Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a45bbae8a66",
        "smsDropDownData": [
          {
            "value": "610d08520b266a45bbae8a66",
            "text": "Out for pickup (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a45bbae8a66",
            "text": "Out for pickup (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f4d23622824",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61a97b963d6d73d41b96"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a82ceae8a7d"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to inform the customers, that an executive will soon collect their rejected items.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "all"
          ],
          "priority": 7,
          "_id": "610d08520b266a2e0eae8a7e",
          "slug": "return_dp_out_for_pickup-event",
          "event_name": "Return Dp Out for pickup",
          "created_at": "2021-08-06T10:00:50.988Z",
          "updated_at": "2022-05-16T07:51:29.199Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that an executive will reach soon to collect the rejected items.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "621c61a97b963d6d73d41b96",
            "slug": "return_dp_out_for_pickup-email",
            "name": "Return Dp Out for pickup",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your <b>Order# {{order_no}} </b>will be picked up by our exicutive today. Keep the product ready for pickup. </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Pickup Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Now</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your Order#{{order_no}} will be picked up by our exicutive today. Keep the product ready for pickup.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nDelivery Address\n\n{{delivery_address}}\n\nWe've got you covered here, but in case of any mess up, kindly drop a mail to care@gofynd.com and we'll try our best to get your issue resolved.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "total": "1,099.00",
              "convenience_fee": "80.00",
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "alwirasheikh@gofynd.com",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "coupon_code": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235with shipment ID : SH-2020224-5E53AFAA0-1172A1789",
              "title": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-02-28T05:46:17.903Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "621c61a97b963d6d73d41b96",
        "emailDropDownData": [
          {
            "value": "621c61a97b963d6d73d41b96",
            "text": "Return Dp Out for pickup (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "621c61a97b963d6d73d41b96",
            "text": "Return Dp Out for pickup (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to inform the customers, that an executive will reach soon to collect the rejected items.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a82ceae8a7d",
            "slug": "return_dp_out_for_pickup-sms",
            "name": "Return Dp Out for pickup",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ articles }} of {{ brand }} {{ orderID }} will be picked up by {{dp_name}} today. Keep it ready for pickup. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}.Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.984Z",
            "updated_at": "2022-01-03T05:46:07.785Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a82ceae8a7d",
        "smsDropDownData": [
          {
            "value": "610d08520b266a82ceae8a7d",
            "text": "Return Dp Out for pickup (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a82ceae8a7d",
            "text": "Return Dp Out for pickup (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      }
    ]
  },
  {
    "name": "Order Cancellation",
    "children": [
      {
        "appSubscriptionId": "610d1805f6ad2f7bf8622813",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a2392ae8a54"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a55ddae8a55"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for customers who cancelled their orders.",
          "enabled": true,
          "editable": true,
          "group": "Order Cancellation",
          "channels": [
            "all"
          ],
          "priority": 1,
          "_id": "610d08520b266a3c41ae8a56",
          "slug": "cancelled_customer-event",
          "event_name": "Cancelled by customer",
          "created_at": "2021-08-06T10:00:50.568Z",
          "updated_at": "2022-05-16T07:51:28.424Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for customers who cancelled their orders.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "610d08520b266a2392ae8a54",
            "slug": "cancelled_customer-email",
            "name": "Order cancelled by customer",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0.3px; border: 1px solid #ccc;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"grey-bg\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-weight: bold; font-family: Arial; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 13pt; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; word-spacing: 2px; font-family: Arial; -webkit-font-smoothing: antialiased;\">The following item from <b>order# {{order_no}} </b>on {{date}} has been cancelled. {% if refund_text %} {{refund_text}} {% endif %}</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\">\n                    <tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 20px; padding: 20px 0; border-bottom: 1px solid #D7D7D7;\"><a href=\"{{item_image_link}}\" target=\"_blank\"><img src=\"{{item_image}}\" alt=\"{{item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"310px\" style=\"padding: 20px 0; border-bottom: 1px solid #D7D7D7;\">\n                        <p class=\"product\" style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C;\">{{item_name}}</p>\n                        <p class=\"product size\" style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C; padding: 8px 0;\">Size: {{item_size}}</p>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"break-up-values\" style=\"padding: 10px 20px;\">\n                    <tr>\n                      <td align=\"left\" valign=\"top\" width=\"280px\" class=\"border\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; border-bottom: 1px solid #D7D7D7;\"></td>\n                      <td class=\"border\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; border-bottom: 1px solid #D7D7D7;\">\n                        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"break-up\">\n                          <tr>\n                            <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Sub Total</td>\n                            <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{sub_total}}</td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Convenience Fee</td>\n                                  <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{convenience_fee}}</td>\n                                </tr>\n                              </table>\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Coupon</td>\n                                  <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{discount_coupon}}</td>\n                                </tr>\n                              </table>\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if delivery_charges %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Delivery Charges</td>\n                                  <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{delivery_charges}}</td>\n                                </tr>\n                              </table>\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if cod_charges %}\n                                <table style=\"margin:0;width:100%;\">\n                                  <tr>\n                                    <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Payment Fee</td>\n                                    <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{cod_charges}}</td>\n                                  </tr>\n                                </table>\n                                {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if you_saved %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> You Saved</td>\n                                  <td align=\"right\" valign=\"top\" class=\"breakup-amount green\" style=\"font-size: 13.5px; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px; color: #20ce81;\"> &#8377; {{you_saved}}</td>\n                                </tr>\n                              </table>\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if fynd_cash_refund %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td align=\"left\" valign=\"top\" class=\"breakup-text\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"> Fynd Cash Refund</td>\n                                  <td align=\"right\" valign=\"top\" class=\"breakup-amount\" style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"> &#8377; {{fynd_cash_refund}}</td>\n                                </tr>\n                              </table>\n                              {% endif %}\n                            </td>\n                            \n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if fynd_cash_referral... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\n\nhttp://https://www.fynd.com.com\n\nHello {{name}},\n\nThe following item from order# {{order_no}} on {{date}} has been cancelled. {Your refund for amount {{total}} has been initiated.}\n{{item_name}}\n{{item_image}}\n{{item_image_link}}\n\n{{item_brand}}\n\n{{item_name}}\n\nSize: {{item_size}}\nItem Refund {{sub_total}}\n\n{% if convenience_fee %}\nFynd Cash Refund {{convenience_fee}}\n{% endif %}\n\n{% if discount_coupon %}\nCoupon {{discount_coupon}}\n{% endif %}\n\n{% if delivery_charges %}\nDelivery Charges {{delivery_charges}}\n{% endif %}\n\n{% if cod_charges %}\nCOD Charges {{cod_charges}}\n{% endif %}\n\n{% if you_saved %}\nYou Saved {{you_saved}}\n{% endif %}\n\n{% if fynd_cash %}\nFynd Cash Refund {{fynd_cash}}\n{% endif %}\n\nTotal Refund Amount {{total}}\n\n{% if similarItems %}\n\nYou May Also Like\n{% for item in similarItems %}\n{{item.image}}\n{{item.name}}\n{{item.image_link}}\n{{item.price}}\n{% endfor %}\n{% endif %}\n\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E5F741A01AA3D2C5F",
              "orderedItems": [],
              "sub_total": "999.00",
              "convenience_fee": "0.00",
              "discount_coupon": "0.00",
              "delivery_charges": null,
              "cod_charges": 0,
              "you_saved": "0.00",
              "fynd_cash_referral": "0.00",
              "fynd_cash_refund": "0.00",
              "cashback_applied": "0.00",
              "total": "999.00",
              "track_now_link": null,
              "user_name": "Alwira Sheikh",
              "delivery_address": null,
              "user_email": "alwirasheikh@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": null,
              "payment_mode": null,
              "brand_name": "Linwood Cuda",
              "ordering_channel": "UNIKET",
              "brand_logo_url": null,
              "subject_line": "Cancellation details for your order FY5E5F741A01AA3D2C5F",
              "title": "Pink Frock (4XL) in your Uniket Order has been cancelled",
              "email_subject": "Pink Frock (4XL) in your Uniket Order has been cancelled",
              "product_name": null,
              "refund_amount": null,
              "source_name": null,
              "item_name": "Linwood Cuda Pink Frock",
              "item_brand": "Linwood Cuda",
              "item_size": "4XL",
              "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/270x0/1_BHTS6028@FADED_RED/1.jpg",
              "item_image_link": "www.gofynd.com",
              "address": null,
              "delivery_slot": null,
              "invoice_id": null,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.554Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a2392ae8a54",
        "emailDropDownData": [
          {
            "value": "610d08520b266a2392ae8a54",
            "text": "Order cancelled by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a2392ae8a54",
            "text": "Order cancelled by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for customers who cancelled their orders.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a55ddae8a55",
            "slug": "cancelled_customer-sms",
            "name": "Order cancelled by customer",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E54C4C809FA53C09E",
              "shipmentID": "16298768762811794288",
              "brand": "NIKE",
              "name": "Alwira S Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Black Sneakers (7)",
              "contact": 8767087087,
              "ordering_channel": "UNIKET",
              "refund_amount": 2999,
              "amount_paid": 2999,
              "refund_string": "",
              "source": "Cash on Delivery",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Mar 02",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Cancelled. {{ articles }} in your {{ brand }} order {{ orderID }} has been cancelled by you. If prepaid, the refund of Rs.{{ refund_amount }} will be initiated via Fynd. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.561Z",
            "updated_at": "2022-05-09T09:11:15.004Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a55ddae8a55",
        "smsDropDownData": [
          {
            "value": "610d08520b266a55ddae8a55",
            "text": "Order cancelled by customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a55ddae8a55",
            "text": "Order cancelled by customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f3fda622812",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a8282ae8a57"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a5c98ae8a58"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for conveying that the ordered item is currently unavailable.",
          "enabled": true,
          "editable": true,
          "group": "Order Cancellation",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "610d08520b266ae764ae8a59",
          "slug": "cancelled_fynd-event",
          "event_name": "Cancelled by admin",
          "created_at": "2021-08-06T10:00:50.582Z",
          "updated_at": "2022-05-16T07:51:28.487Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for conveying that the ordered item is currently unavailable.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a8282ae8a57",
            "slug": "cancelled_fynd-email",
            "name": "Order cancelled by admin",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n    <title>{{title}}</title>\n  </head>\n\n  <body>\n    <span\n      class=\"subject-line\"\n      style=\"font-family: Arial; -webkit-font-smoothing: antialiased; display: none; font-size: 14px; padding: 0 10px; text-align: center; visibility: hidden; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n      >{{subject_line}}</span\n    >\n    <table\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      height=\"100%\"\n      width=\"600px\"\n      align=\"center\"\n      class=\"order-confirmation\"\n      style=\"letter-spacing: 0.3px; border: 1px solid #ccc;\"\n    >\n      <tr>\n        <td\n          align=\"center\"\n          valign=\"top\"\n          class=\"border\"\n          style=\"border-bottom: 1px solid #D7D7D7;\"\n        >\n          <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"100%\"\n            align=\"center\"\n          >\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\">\n                <a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"\n                  ><img\n                    style=\"max-height:150px\"\n                    src=\"{{ ref_application.logo.secure_url }}\"\n                    border=\"0\"\n                    alt=\"\"\n                /></a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"grey-bg\" style=\"padding: 0 20px;\">\n                  <p\n                    class=\"title-name\"\n                    style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-weight: bold; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Hello {{name}},\n                  </p>\n                  <p\n                    class=\"title-order-line\"\n                    style=\"font-size: 13pt; color: #41434C; margin: 0; line-height: 1.6; word-spacing: 2px; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                  >\n                    {{brand_name}} has cancelled an item from\n                    <b>order# {{order_no}} </b>on {{date}} as the item is\n                    currently unavailable. {% if refund_text %} Your refund for\n                    amount &#8377; {{refund_text}} has been initiated. {% endif\n                    %}\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        class=\"img-portion\"\n                        style=\"width: 86px; padding-right: 20px; padding: 10px 0; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <a href=\"{{item_image_link}}\" target=\"_blank\"\n                          ><img\n                            src=\"{{item_image}}\"\n                            alt=\"{{item_name}}\"\n                            style=\"width: 86px; height: 122px; display: block;\"\n                        /></a>\n                      </td>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        width=\"310px\"\n                        style=\"padding: 10px 0; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <p\n                          class=\"product\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C;\"\n                        >\n                          {{item_brand}}\n                        </p>\n                        <p\n                          class=\"product\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C;\"\n                        >\n                          {{item_name}}\n                        </p>\n                        <p\n                          class=\"product size\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C; padding: 8px 0;\"\n                        >\n                          Size: {{item_size}}\n                        </p>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"break-up-values\"\n                    style=\"padding: 10px 20px;\"\n                  >\n                    <tr>\n                      <td\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <table\n                          border=\"0\"\n                          cellpadding=\"0\"\n                          cellspacing=\"0\"\n                          height=\"100%\"\n                          width=\"100%\"\n                          class=\"break-up\"\n                        >\n                          <tr>\n                            <td\n                              align=\"left\"\n                              valign=\"top\"\n                              class=\"breakup-text\"\n                              style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                            >\n                              Sub Total\n                            </td>\n                            <td\n                              align=\"right\"\n                              valign=\"top\"\n                              class=\"breakup-amount\"\n                              style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                            >\n                              &#8377; {{sub_total}}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                                  >\n                                    Convenience Fee\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                                  >\n                                    &#8377; {{convenience_fee}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                                  >\n                                    Coupon\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                                  >\n                                    &#8377; {{discount_coupon}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if delivery_charges %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n             ... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\n\nhttps://www.fynd.com\n\nHello {{name}},\n\n{{brand_name}} has cancelled an item from order# {{order_no}} on {{date}} as the item is currently unavailable. {Your refund for amount Rs. {{total}} has been initiated}\n{{item_image}} {{item_image_link}}\n\n{{item_brand}}\n\n{{item_name}}\n\nSize: {{item_size}}\nItem Refund {{sub_total}}\n\n{% if fynd_cash%}\nFynd Cash Refund {{fynd_cash}}\n{% endif %}\n\n{% if convenience_fee %}\nConvenience Fee {{convenience_fee}}\n{% endif %}\n\n{% if discount_coupon %}\nCoupon {{discount_coupon}}\n{% endif %}\n\n{% if delivery_charges %}\nDelivery Charges {{delivery_charges}}\n{% endif %}\n\n{% if cod_charges %}\nPayment Fee {{cod_charges}}\n{% endif %}\n\n{% if you_saved %}\nYou Saved {{you_saved}}\n{% endif %}\n\nTotal Refund Amount {{total}}\n{% if similarItems %}\n\nYOU MAY ALSO LIKE\n{% for item in similarItems %}\n{{item.image}}\n{{item.image_link}}\n{{item.name}}\n{{item.price}}\n{% endfor %}\n{% endif %}\n\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E5F741A01AA3D2C5F",
              "orderedItems": [],
              "sub_total": "999.00",
              "convenience_fee": "0.00",
              "discount_coupon": "0.00",
              "delivery_charges": null,
              "cod_charges": 0,
              "you_saved": "0.00",
              "fynd_cash_referral": "0.00",
              "fynd_cash_refund": "0.00",
              "cashback_applied": "0.00",
              "total": "999.00",
              "track_now_link": null,
              "user_name": "Alwira Sheikh",
              "delivery_address": null,
              "user_email": "alwirasheikh@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": null,
              "payment_mode": null,
              "brand_name": "Linwood Cuda",
              "ordering_channel": "UNIKET",
              "brand_logo_url": null,
              "subject_line": "Cancellation details for your order FY5E5F741A01AA3D2C5F",
              "title": "Pink Frock (4XL) in your Uniket Order has been cancelled",
              "email_subject": "Pink Frock (4XL) in your Uniket Order has been cancelled",
              "product_name": null,
              "refund_amount": null,
              "source_name": null,
              "item_name": "Linwood Cuda Pink Frock",
              "item_brand": "Linwood Cuda",
              "item_size": "4XL",
              "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/270x0/1_BHTS6028@FADED_RED/1.jpg",
              "item_image_link": "www.gofynd.com",
              "address": null,
              "delivery_slot": null,
              "invoice_id": null,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.573Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a8282ae8a57",
        "emailDropDownData": [
          {
            "value": "610d08520b266a8282ae8a57",
            "text": "Order cancelled by admin (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a8282ae8a57",
            "text": "Order cancelled by admin (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template for conveying that the ordered item is currently unavailable.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a5c98ae8a58",
            "slug": "cancelled_fynd-sms",
            "name": "Order cancelled by admin",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E54C3620941DCECA0",
              "brand": "NIKE",
              "name": "Alwira S Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Black Sneakers (7)",
              "contact": 8767087087,
              "ordering_channel": "UNIKET",
              "refund_amount": 0,
              "refund_string": "",
              "source": "Cash on Delivery",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Mar 02",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Sorry, order declined. {{ articles }} from your {{ brand }} order {{ orderID }} has been declined as it just went out of stock.If prepaid, the refund will be initiated via Fynd. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.578Z",
            "updated_at": "2022-05-09T09:11:15.023Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a5c98ae8a58",
        "smsDropDownData": [
          {
            "value": "610d08520b266a5c98ae8a58",
            "text": "Order cancelled by admin (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a5c98ae8a58",
            "text": "Order cancelled by admin (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f8550622815",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266ac46aae8a5a"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a5425ae8a5b"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to convey that delivery attempt has been failed.",
          "enabled": true,
          "editable": true,
          "group": "Order Cancellation",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08520b266a1719ae8a5c",
          "slug": "delivery_attempt_failed-event",
          "event_name": "Delivery Attempt Failed",
          "created_at": "2021-08-06T10:00:50.653Z",
          "updated_at": "2022-05-16T07:51:28.514Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to convey that the customer has refused to receive the ordered item.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266ac46aae8a5a",
            "slug": "delivery_attempt_failed-email",
            "name": "Order rejected by customer",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n<!--                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your Order#<b>{{order_no}} </b>has/have been rejected by you.</p>-->\n<!--                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Order {{shipment_id}} containing {{brand}} - {{article_name}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}.</p>-->\n                      <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Order {{shipment_id}} containing {{brand_name}} - {{articles}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\n<!--Order {{shipment_id}} containing {{brand}} - {{article_name}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}-->\nOrder {{shipment_id}} containing {{brand_name}} - {{articles}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nWe know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have any queries just drop us a mail on care@gofynd.com\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "kaushil",
              "order_no": "FY5E4526E809272241E0",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 3699,
                  "quantity": 1,
                  "item_size": "L",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
                  "marked_price": 3699,
                  "discount": 0,
                  "sub_total": 3699
                }
              ],
              "sub_total": "3,699.00",
              "convenience_fee": "None",
              "discount_coupon": "None",
              "delivery_charges": "None",
              "cod_charges": "None",
              "you_saved": "None",
              "fynd_cash_referral": "None",
              "fynd_cash_refund": "None",
              "cashback_applied": "None",
              "total": "1.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "kaushil",
              "delivery_address": "Kaushil,<br/> Test,<br/> Test,<br/> test,<br/> Mumbai,<br/> 400078<br/> <br/> Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "kaushilrambhia@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have any queries just drop us a mail on care@fynd.com",
              "payment_mode": "Net Banking",
              "brand_name": "Basics",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/2716_e54b0ab9da4244a28bfac90f57844537.jpg",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.588Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266ac46aae8a5a",
        "emailDropDownData": [
          {
            "value": "610d08520b266ac46aae8a5a",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266ac46aae8a5a",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to convey that the customer that delivery attempt has been failed.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a5425ae8a5b",
            "slug": "delivery_attempt_failed-sms",
            "name": "Order delivery attempt failed",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E37F05009B99E69E2",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "BASICS",
              "name": "Kaushil",
              "articles": "Black Melange Casual Shirt (S)",
              "contact": 8767087087,
              "credits": 0,
              "slot": "By 9:00 PM",
              "slot_date": "7th Feb 2020",
              "datetime": "07 Feb",
              "cashback": 0,
              "value": 500,
              "delivery_attempt_date": "7th Feb 2020",
              "reschedule_form_link ": "https://formlink",
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "tracking_url": "https://track.fynd.com/"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Dear {{ name }}, order {{ shipmentID }} containing {{ brand }} - {{ articles }} was attempted by our delivery executive on {{delivery_attempt_date}} but was unsuccessful. A delivery re-attempt will be made tomorrow again. Click here to reschedule: {{reschedule_form_link}}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.646Z",
            "updated_at": "2021-08-06T10:00:50.646Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a5425ae8a5b",
        "smsDropDownData": [
          {
            "value": "610d08520b266a5425ae8a5b",
            "text": "Order delivery attempt failed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a5425ae8a5b",
            "text": "Order delivery attempt failed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fe87e62281f",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a2347ae8a71"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a4be2ae8a72"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to convey that the customer has refused to receive the ordered item.",
          "enabled": true,
          "editable": true,
          "group": "Order Cancellation",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08520b266a3bc8ae8a73",
          "slug": "rejected_by_customer-event",
          "event_name": "Rejected by customer",
          "created_at": "2021-08-06T10:00:50.887Z",
          "updated_at": "2022-05-16T07:51:28.982Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to convey that the customer has refused to receive the ordered item.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a2347ae8a71",
            "slug": "rejected_by_customer-email",
            "name": "Order rejected by customer",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n<!--                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your Order#<b>{{order_no}} </b>has/have been rejected by you.</p>-->\n<!--                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Order {{shipment_id}} containing {{brand}} - {{article_name}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}.</p>-->\n                      <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Order {{shipment_id}} containing {{brand_name}} - {{articles}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\n<!--Order {{shipment_id}} containing {{brand}} - {{article_name}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}-->\nOrder {{shipment_id}} containing {{brand_name}} - {{articles}} was attempted by our delivery executive on {{delivery_attempt_date}} but was un-successful. A delivery re-attempt will be made tomorrow again. Click here to reschedule : {{reschedule_form_link}}\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nWe know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have any queries just drop us a mail on care@gofynd.com\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "kaushil",
              "order_no": "FY5E4526E809272241E0",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 3699,
                  "quantity": 1,
                  "item_size": "L",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
                  "marked_price": 3699,
                  "discount": 0,
                  "sub_total": 3699
                }
              ],
              "sub_total": "3,699.00",
              "convenience_fee": "None",
              "discount_coupon": "None",
              "delivery_charges": "None",
              "cod_charges": "None",
              "you_saved": "None",
              "fynd_cash_referral": "None",
              "fynd_cash_refund": "None",
              "cashback_applied": "None",
              "total": "1.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "kaushil",
              "delivery_address": "Kaushil,<br/> Test,<br/> Test,<br/> test,<br/> Mumbai,<br/> 400078<br/> <br/> Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "kaushilrambhia@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have any queries just drop us a mail on care@fynd.com",
              "payment_mode": "Net Banking",
              "brand_name": "Basics",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/2716_e54b0ab9da4244a28bfac90f57844537.jpg",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.878Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a2347ae8a71",
        "emailDropDownData": [
          {
            "value": "610d08520b266a2347ae8a71",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a2347ae8a71",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to convey that the customer has refused to receive the ordered item.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a4be2ae8a72",
            "slug": "rejected_by_customer-sms",
            "name": "Order rejected by customer",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E37F05009B99E69E2",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "BASICS",
              "name": "Kaushil",
              "articles": "Black Melange Casual Shirt (S)",
              "contact": 8767087087,
              "credits": 0,
              "slot": "By 9:00 PM",
              "slot_date": "7th Feb 2020",
              "datetime": "07 Feb",
              "cashback": 0,
              "value": 500,
              "delivery_attempt_date": "7th Feb 2020",
              "reschedule_form_link ": "https://formlink",
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "tracking_url": "https://track.fynd.com/"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Dear {{ name }}, order {{ shipmentID }} containing {{ brand }} - {{ articles }} was attempted by our delivery executive on {{delivery_attempt_date}} but was unsuccessful as it was rejected by you. {% if reschedule_form_link %} Click here to reschedule or give feedback: {{reschedule_form_link}}.{% endif %} Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.883Z",
            "updated_at": "2022-03-29T07:07:56.866Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a4be2ae8a72",
        "smsDropDownData": [
          {
            "value": "610d08520b266a4be2ae8a72",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a4be2ae8a72",
            "text": "Order rejected by customer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      }
    ]
  },
  {
    "name": "Order Return",
    "children": [
      {
        "appSubscriptionId": "610d1805f6ad2f381d622819",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a2376ae8a7f"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08530b266a39e8ae8a80"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to notify the customer that the returning process of an item has been initiated.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 1,
          "_id": "610d08530b266a32e3ae8a81",
          "slug": "return_initiated-event",
          "event_name": "Initiated",
          "created_at": "2021-08-06T10:00:51.006Z",
          "updated_at": "2022-05-16T07:51:29.276Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to notify the customer that the returning process of an item has been initiated.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a2376ae8a7f",
            "slug": "return_initiated-email",
            "name": "Order return initiated",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n    <head>\n        <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n        <title>{{title}}</title>\n    </head>\n    <body>\n        <span\n            class=\"subject-line\"\n            style=\"font-family: Arial; -webkit-font-smoothing: antialiased; display: none; font-size: 14px; padding: 0 10px; text-align: center; visibility: hidden; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n            >{{subject_line}}</span\n        >\n        <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"600px\"\n            align=\"center\"\n            class=\"order-confirmation\"\n            style=\"letter-spacing: 0.3px; border: 1px solid #ccc;\"\n        >\n        <tr>\n          <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n              <tr>\n                <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n              </tr>\n            </table>\n          </td>\n        </tr>\n            <tr>\n                <td align=\"center\" valign=\"top\">\n                    <table\n                        border=\"0\"\n                        cellpadding=\"0\"\n                        cellspacing=\"0\"\n                        width=\"100%\"\n                    >\n                        <tbody>\n                            <tr>\n                                <td class=\"text-lines\" style=\"padding: 0 20px;\">\n                                    <p\n                                        class=\"title-name\"\n                                        style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                    >\n                                        Hello {{name}},\n                                    </p>\n                                    <p\n                                        class=\"title-order-line\"\n                                        style=\"font-size: 13pt; color: #41434C; margin: 0; line-height: 1.6; word-spacing: 2px; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                    >\n                                        Return for the following item in your\n                                        <b>order# {{order_no}} </b\n                                        ><span>has been initiated.</span>\n                                    </p>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td\n                                    class=\"product-detail\"\n                                    style=\"padding: 0 20px;\"\n                                >\n                                    <table\n                                        border=\"0\"\n                                        cellpadding=\"0\"\n                                        cellspacing=\"0\"\n                                        height=\"100%\"\n                                        width=\"100%\"\n                                    >\n                                        <tr>\n                                            <td\n                                                align=\"left\"\n                                                valign=\"middle\"\n                                                class=\"img-portion\"\n                                                style=\"width: 86px; padding: 15px 0; padding-right: 20px; border-bottom: 1px solid #D7D7D7;\"\n                                            >\n                                                <a\n                                                    href=\"{{item_image_link}}\"\n                                                    target=\"_blank\"\n                                                    ><img\n                                                        src=\"{{item_image}}\"\n                                                        alt=\"{{item_name}}\"\n                                                        style=\"width: 89px; height: 139px; display: block;\"\n                                                /></a>\n                                            </td>\n                                            <td\n                                                align=\"left\"\n                                                valign=\"middle\"\n                                                width=\"310px\"\n                                                style=\"padding: 15px 0; padding-right: 20px; border-bottom: 1px solid #D7D7D7;\"\n                                            >\n                                                <p\n                                                    class=\"light\"\n                                                    style=\"font-size: 13pt; color: #41434C; margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                                >\n                                                    {{item_brand}}\n                                                </p>\n                                                <p\n                                                    class=\"light\"\n                                                    style=\"font-size: 13pt; color: #41434C; margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                                >\n                                                    {{item_name}}\n                                                </p>\n                                                <p\n                                                    class=\"light size\"\n                                                    style=\"font-size: 13pt; color: #41434C; margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; padding: 8px 0;\"\n                                                >\n                                                    Size: {{item_size}}\n                                                </p>\n                                                <p\n                                                    class=\"return-initaited\"\n                                                    style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; color: #ee485d; font-weight: bold;\"\n                                                >\n                                                    {{return_status}}\n                                                </p>\n                                            </td>\n                                        </tr>\n                                    </table>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <p\n                        class=\"bold\"\n                        style=\"font-size: 13pt; font-weight: bold; color: #41434C; font-family: Arial; -webkit-font-smoothing: antialiased; margin: 20px 20px 5px 20px;\"\n                    >\n                        Pickup Address:\n                    </p>\n                    <p\n                        class=\"light\"\n                        style=\"font-size: 13pt; color: #41434C; font-family: Arial; -webkit-font-smoothing: antialiased; margin: 0 20px;\"\n                    >\n                        {{address}}\n                    </p>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <p\n                        class=\"bold\"\n                        style=\"font-size: 13pt; font-weight: bold; color: #41434C; font-family: Arial; -webkit-font-smoothing: antialiased; margin: 20px 20px 5px 20px;\"\n                    >\n                        Pickup Schedule:\n                    </p>\n                    <p\n                        class=\"light bottom\"\n                        style=\"font-size: 13pt; color: #41434C; font-family: Arial; -webkit-font-smoothing: antialiased; margin: 0 20px; padding-bottom: 20px;\"\n                    >\n                        Your item would be picked up in 3 business days.\n                    </p>\n                </td>\n            </tr>\n            <tr align=\"center\">\n              <td>\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n                  <tr>\n                    <td>\n                      <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td>\n                      <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                        {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                          {{ ref_application.app_information.additional_data.address_line }}\n                        {% endif %}\n                        {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                          {{ ref_application.app_information.additional_data.city_pincode }}\n                        {% endif %}\n                      </div>\n                      <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                        {% if ref_application.app_information... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{title}}\n{{subject_line}}\n\nHello {{name}},\nRefund amount of Rs. {{refund_amount}} for {{product_name}} in order {{order_no}} has been initiated from your Fynd Cash to {{source_name}}.\n\nNote: It may take atleast 7 working days to reflect the refund amount at your source account depending on the payment gateway. In case of any query please email us on care@fynd.com or call us at +91 8767087087\n\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E53AFAA091115C235",
              "item_name": "Blue Solid Slim Fit Trackpants",
              "item_brand": "SAPPER",
              "item_size": "28",
              "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
              "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
              "user_email": "ALWIRASHEIKH@GMAIL.COM",
              "address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069    Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "subject_line": "Return details for your order FY5E53AFAA091115C235",
              "title": "Return initiated for Blue Solid Slim Fit Trackpants (28) in your SAPPER Order",
              "ordering_channel": "ECOMM",
              "email_subject": "Return initiated for Blue Solid Slim Fit Trackpants (28) in your SAPPER Order",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.996Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a2376ae8a7f",
        "emailDropDownData": [
          {
            "value": "610d08520b266a2376ae8a7f",
            "text": "Order return initiated (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a2376ae8a7f",
            "text": "Order return initiated (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to notify the customer that the returning process of an item has been initiated.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08530b266a39e8ae8a80",
            "slug": "return_initiated-sms",
            "name": "Order return initiated",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16495005795601272454",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "amount_paid": 3054,
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Return scheduled via Fynd. We have scheduled a pick up for {{ articles }} in your {{ brand }} order {{ orderID }}. Please keep the product ready with original tags and packaging. It will be picked up in the next 2-3 days from your address. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:51.001Z",
            "updated_at": "2022-04-13T05:18:33.430Z",
            "__v": 0
          }
        },
        "previousSms": "610d08530b266a39e8ae8a80",
        "smsDropDownData": [
          {
            "value": "610d08530b266a39e8ae8a80",
            "text": "Order return initiated (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08530b266a39e8ae8a80",
            "text": "Order return initiated (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f7b62622818",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a0e6eae8a74"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a763cae8a75"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to notify the customer that their returned item has been accepted.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "610d08520b266a3e97ae8a76",
          "slug": "return_accepted-event",
          "event_name": "Accepted",
          "created_at": "2021-08-06T10:00:50.948Z",
          "updated_at": "2022-05-16T07:51:29.000Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to notify the customer that their returned item has been accepted.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a0e6eae8a74",
            "slug": "return_accepted-email",
            "name": "Order return accepted",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n    <title>{{title}}</title>\n  </head>\n\n  <body>\n    <span\n      class=\"subject-line\"\n      style=\"font-family: Arial; -webkit-font-smoothing: antialiased; display: none; font-size: 14px; padding: 0 10px; text-align: center; visibility: hidden; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n      >{{subject_line}}</span\n    >\n    <table\n      border=\"0\"\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      height=\"100%\"\n      width=\"600px\"\n      align=\"center\"\n      class=\"order-confirmation\"\n      style=\"letter-spacing: 0.3px; border: 1px solid #ccc;\"\n    >\n      <tr>\n        <td\n          align=\"center\"\n          valign=\"top\"\n          class=\"border\"\n          style=\"border-bottom: 1px solid #D7D7D7;\"\n        >\n          <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"100%\"\n            align=\"center\"\n          >\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\">\n                <a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"\n                  ><img\n                    style=\"max-height:150px\"\n                    src=\"{{ ref_application.logo.secure_url }}\"\n                    border=\"0\"\n                    alt=\"\"\n                /></a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"grey-bg\" style=\"padding: 0 20px;\">\n                  <p\n                    class=\"title-name\"\n                    style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-weight: bold; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Hello {{name}},\n                  </p>\n                  <p\n                    class=\"title-order-line\"\n                    style=\"font-size: 13pt; color: #41434C; margin: 0; line-height: 1.6; word-spacing: 2px; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                  >\n                    Return for the following item in your\n                    <b>order# {{order_no}} &nbsp;</b> has been completed.\n                    {{refund_text}}\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                  >\n                    <tr>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        class=\"img-portion\"\n                        style=\"width: 86px; padding: 10px 20px 10px 0; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <a href=\"{{item_image_link}}\" target=\"_blank\"\n                          ><img\n                            src=\"{{item_image}}\"\n                            alt=\"{{item_name}}\"\n                            style=\"width: 86px; height: 122px; display: block;\"\n                        /></a>\n                      </td>\n                      <td\n                        align=\"left\"\n                        valign=\"middle\"\n                        width=\"310px\"\n                        style=\"padding: 10px 20px 10px 0; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <p\n                          class=\"product\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C;\"\n                        >\n                          {{item_brand}}\n                        </p>\n                        <p\n                          class=\"product\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C;\"\n                        >\n                          {{item_name}}\n                        </p>\n                        <p\n                          class=\"product size\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #41434C; padding: 8px 0;\"\n                        >\n                          Size: {{item_size}}\n                        </p>\n                        <p\n                          class=\"product red\"\n                          style=\"margin: 3px 0; font-family: Arial; -webkit-font-smoothing: antialiased; font-size: 13pt; color: #ee485d;\"\n                        >\n                          {{item_status}}\n                        </p>\n                      </td>\n                    </tr>\n                  </table>\n                </td>\n              </tr>\n              <tr>\n                <td>\n                  <table\n                    border=\"0\"\n                    cellpadding=\"0\"\n                    cellspacing=\"0\"\n                    height=\"100%\"\n                    width=\"100%\"\n                    class=\"break-up-values\"\n                    style=\"padding: 10px 20px;\"\n                  >\n                    <tr>\n                      <td\n                        class=\"border\"\n                        style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; border-bottom: 1px solid #D7D7D7;\"\n                      >\n                        <table\n                          border=\"0\"\n                          cellpadding=\"0\"\n                          cellspacing=\"0\"\n                          height=\"100%\"\n                          width=\"100%\"\n                          class=\"break-up\"\n                        >\n                          <tr>\n                            <td\n                              align=\"left\"\n                              valign=\"top\"\n                              class=\"breakup-text\"\n                              style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                            >\n                              Sub Total\n                            </td>\n                            <td\n                              align=\"right\"\n                              valign=\"top\"\n                              class=\"breakup-amount\"\n                              style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                            >\n                              &#8377; {{sub_total}}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if convenience_fee %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                                  >\n                                    Convenience Fee\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                                  >\n                                    &#8377; {{convenience_fee}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if discount_coupon %}\n                              <table style=\"margin:0;width:100%;\">\n                                <tr>\n                                  <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"breakup-text\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 419px;\"\n                                  >\n                                    Coupon\n                                  </td>\n                                  <td\n                                    align=\"right\"\n                                    valign=\"top\"\n                                    class=\"breakup-amount\"\n                                    style=\"font-size: 13.5px; color: #41434C; padding: 6px 0; font-family: Arial; -webkit-font-smoothing: antialiased; width: 139px;\"\n                                  >\n                                    &#8377; {{discount_coupon}}\n                                  </td>\n                                </tr>\n                              </table>\n\n                              {% endif %}\n                            </td>\n                          </tr>\n                          <tr>\n                            <td colspan=\"2\">\n                              {% if delivery_charges %}\n                              <table style=\"margin:0;width:100%;\">\n                             ... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{title}}\n{{subject_line}}\nHello {{name}},\nReturn for the following item in your order# {{order_no}} has been completed. {Your refund for amount Rs. {{total}} has been initiated}\n\n{{item_image}} {{item_image_link}}\n{{item_brand}}\n{{item_name}}\nSize: {{item_size}}\n{{item_status}}\nREFUND SUMMARY\nItem Refund {{sub_total}}\n\n{% if convenience_fee %} Convenience Fee {{convenience_fee}} {% endif %}\n{% if discount_coupon %} Coupon {{discount_coupon}} {% endif %}\n{% if delivery_charges %} Delivery Charges {{delivery_charges}} {% endif %}\n{% if cod_charges %} Payment Fee {{cod_charges}} {% endif %}\n{% if you_saved %} You Saved {{you_saved}} {% endif %}\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}} {% endif %}\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}} {% endif %}\n\nTotal Refund Amount {{total}}\n\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Kaushil",
              "order_no": "FY5E4526E809272241E0",
              "brand_name": "Basics",
              "item_name": "Basics Navy Solid Bomber Tshirt",
              "item_brand": "Basics",
              "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
              "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
              "item_size": "L",
              "total": "3,699.00",
              "date": "13 February 2020",
              "sub_total": "3,699.00",
              "convenience_fee": "0.00",
              "shipment_value": "3,699.00",
              "delivery_charges": "0.00",
              "discount_coupon": "0.00",
              "user_email": "kaushilrambhia@gofynd.com",
              "cod_charges": 0,
              "you_saved": "0.00",
              "fynd_cash_referral": "0.00",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "similarItems": [],
              "subject_line": "Return Completed details for your order FY5E4526E809272241E0",
              "title": "test mial",
              "fynd_cash_refund": "0.00",
              "cashback_applied": "0.00",
              "faqs": "None",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.892Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a0e6eae8a74",
        "emailDropDownData": [
          {
            "value": "610d08520b266a0e6eae8a74",
            "text": "Order return accepted (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a0e6eae8a74",
            "text": "Order return accepted (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to notify the customer that their returned item has been accepted.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a763cae8a75",
            "slug": "return_accepted-sms",
            "name": "Order return accepted",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "refund_amount": 1099,
              "refund_string": "",
              "source": "Cash on Delivery",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Return accepted. Hey {{ name }}, return of {{ articles }} from {{ brand }} {{ orderID }} has been accepted. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.897Z",
            "updated_at": "2021-08-06T10:00:50.897Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a763cae8a75",
        "smsDropDownData": [
          {
            "value": "610d08520b266a763cae8a75",
            "text": "Order return accepted (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a763cae8a75",
            "text": "Order return accepted (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f96dc62281c",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08530b266a0474ae8a85"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08530b266aed25ae8a86"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template, in case a customer requests for a return and later cancels it.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 3,
          "_id": "610d08530b266a7d12ae8a87",
          "slug": "return_request_cancelled-event",
          "event_name": "Request cancelled",
          "created_at": "2021-08-06T10:00:51.077Z",
          "updated_at": "2022-05-16T07:51:29.308Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "In case a customer requests for a return and later cancels it, use this email template.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08530b266a0474ae8a85",
            "slug": "return_request_cancelled-email",
            "name": "Return request cancelled",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr align=\"center\" valign=\"top\">\n              <td class=\"brand-logo-wrapper\" style=\"padding: 30px 0 30px 0;\"><img src=\"{{brand_logo_url}}\" border=\"0\" alt=\"\" class=\"brand-logo\" style=\"max-height: 80px;\"></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">We’ve received a cancel return request for following product(s) in Order#<b>{{order_no}} </b></p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nWe’ve received a cancel return request for following product(s) in Order# {{order_no}}.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nWe’re guessing the return request was raised by error. If you have further questions regarding this order, please drop a mail to care@gofynd.com.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E4B8B9409AA7C82F4",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 1199,
                  "quantity": 1,
                  "item_size": "3XL",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/EnjYYeYsKV",
                  "marked_price": 1199,
                  "discount": 0,
                  "sub_total": 1199
                }
              ],
              "sub_total": "1,199.00",
              "convenience_fee": null,
              "discount_coupon": null,
              "delivery_charges": null,
              "cod_charges": null,
              "you_saved": null,
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "total": "1,199.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "Alwira Sheikh",
              "delivery_address": "Alwira Sheikh,  501, Fynd, Shopsense , Corporate Center, Ak Road, Jb Nagar, Andheri East, Test,  Test,  test,  Mumbai,  400059   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "alwirasheikh@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We're guessing the return request was raised by error. If you have  further questions regarding this order, please drop a mail to care@fynd.com",
              "payment_mode": "Cash on Delivery",
              "brand_name": "Being Human",
              "ordering_channel": "UNIKET",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/4597_40d1ce44d61940d4829a3c54951bd9ee.jpg",
              "subject_line": "Details of your order FY5E4B8B9409AA7C82F4",
              "title": "Return Cancelled - Uniket Order FY5E4B8B9409AA7C82F4",
              "email_subject": "Return Cancelled - Uniket Order FY5E4B8B9409AA7C82F4",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:51.066Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08530b266a0474ae8a85",
        "emailDropDownData": [
          {
            "value": "610d08530b266a0474ae8a85",
            "text": "Return request cancelled (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08530b266a0474ae8a85",
            "text": "Return request cancelled (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "In case a customer requests for a return and later cancels it, use this SMS template.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08530b266aed25ae8a86",
            "slug": "return_request_cancelled-sms",
            "name": "Return request cancelled",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E4B8B9409AA7C82F4",
              "brand": "BEING HUMAN",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Ecru Printed T-Shirt (3XL)",
              "contact": 8767087087,
              "ordering_channel": "UNIKET",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 23",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Return cancelled. Return request for {{ articles }} in your {{ brand }} order {{ orderID }} has been cancelled. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:51.071Z",
            "updated_at": "2021-08-06T10:00:51.071Z",
            "__v": 0
          }
        },
        "previousSms": "610d08530b266aed25ae8a86",
        "smsDropDownData": [
          {
            "value": "610d08530b266aed25ae8a86",
            "text": "Return request cancelled (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08530b266aed25ae8a86",
            "text": "Return request cancelled (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f5d1f622822",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a1599ae8a77"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266ac5a5ae8a78"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to convey that an executive has received the returned item from the customer.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 4,
          "_id": "610d08520b266a052eae8a79",
          "slug": "return_bag_picked-event",
          "event_name": "Return bag picked",
          "created_at": "2021-08-06T10:00:50.961Z",
          "updated_at": "2022-05-16T07:51:29.102Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to convey that an executive has received the returned item from the customer.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a1599ae8a77",
            "slug": "return_bag_picked-email",
            "name": "Returned bag picked up",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Our executive has picked up the following product(s) in Order# <b>{{order_no}}</b>. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{% if payment_mode == 'Cash on Delivery' and not beneficiary_added %} Please provide your bank details in the link below to initiate the payment {{bank_form_link}}{% endif %} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n\n\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Pickup Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Return</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additio... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nOur executive has picked up the following product(s) in Order# {{order_no}}.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nPickup Address\n\n{{delivery_address}}\n\nIn case of queries, just drop a mail to care@gofynd.com.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "kaushil",
              "order_no": "FY5E4526E809272241E0",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 3699,
                  "quantity": 1,
                  "item_size": "L",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
                  "marked_price": 3699,
                  "discount": 0,
                  "sub_total": 3699
                }
              ],
              "sub_total": "3,699.00",
              "convenience_fee": "None",
              "discount_coupon": "None",
              "delivery_charges": "None",
              "cod_charges": "None",
              "you_saved": "None",
              "fynd_cash_referral": "None",
              "fynd_cash_refund": "None",
              "cashback_applied": "None",
              "total": "1.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "kaushil",
              "delivery_address": "Kaushil,<br/> Test,<br/> Test,<br/> test,<br/> Mumbai,<br/> 400078<br/> <br/> Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "kaushilrambhia@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "In case of queries, just drop a mail to care@fynd.com.",
              "payment_mode": "Net Banking",
              "brand_name": "Basics",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/2716_e54b0ab9da4244a28bfac90f57844537.jpg",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.952Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a1599ae8a77",
        "emailDropDownData": [
          {
            "value": "610d08520b266a1599ae8a77",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a1599ae8a77",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to convey that an executive has received the returned item from the customer.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266ac5a5ae8a78",
            "slug": "return_bag_picked-sms",
            "name": "Returned bag picked up",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "SH-2020915-000000000-000000000",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "cod": 0,
              "bank_form_link": "http://formlink.in",
              "refund_amount": 999,
              "amount_paid": 999,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Dear {{ name }}, your {{ brand }} - {{ shipmentID }} refund of Rs.{{ amount_paid }} is due and will be processed in the next 2-3 days.{% if payment_mode == 'COD' and not beneficiary_added %} Please provide your bank details in the link below to initiate the payment {{bank_form_link}}{% endif %} Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.957Z",
            "updated_at": "2022-04-13T05:18:33.330Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266ac5a5ae8a78",
        "smsDropDownData": [
          {
            "value": "610d08520b266ac5a5ae8a78",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266ac5a5ae8a78",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fbb68622823",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a62d3ae8a7a"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a3fb6ae8a7b"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to convey that an executive has received the returned item from the customer.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 4,
          "_id": "610d08520b266a5906ae8a7c",
          "slug": "return_bag_picked_by_dp-event",
          "event_name": "Bag picked up by delivery partner",
          "created_at": "2021-08-06T10:00:50.979Z",
          "updated_at": "2022-05-16T07:51:29.117Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to convey that an executive has received the returned item from the customer.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a62d3ae8a7a",
            "slug": "return_bag_picked_by_dp-email",
            "name": "Returned bag picked up",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Our executive has picked up the following product(s) in Order# <b>{{order_no}}</b>. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Pickup Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Return</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nOur executive has picked up the following product(s) in Order# {{order_no}}.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nPickup Address\n\n{{delivery_address}}\n\nIn case of queries, just drop a mail to care@gofynd.com.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "kaushil",
              "order_no": "FY5E4526E809272241E0",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 3699,
                  "quantity": 1,
                  "item_size": "L",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
                  "marked_price": 3699,
                  "discount": 0,
                  "sub_total": 3699
                }
              ],
              "sub_total": "3,699.00",
              "convenience_fee": "None",
              "discount_coupon": "None",
              "delivery_charges": "None",
              "cod_charges": "None",
              "you_saved": "None",
              "fynd_cash_referral": "None",
              "fynd_cash_refund": "None",
              "cashback_applied": "None",
              "total": "1.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "kaushil",
              "delivery_address": "Kaushil,<br/> Test,<br/> Test,<br/> test,<br/> Mumbai,<br/> 400078<br/> <br/> Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "kaushilrambhia@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "In case of queries, just drop a mail to care@fynd.com.",
              "payment_mode": "Net Banking",
              "brand_name": "Basics",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/2716_e54b0ab9da4244a28bfac90f57844537.jpg",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.969Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a62d3ae8a7a",
        "emailDropDownData": [
          {
            "value": "610d08520b266a62d3ae8a7a",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a62d3ae8a7a",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to convey that an executive has received the returned item from the customer.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a3fb6ae8a7b",
            "slug": "return_bag_picked_by_dp-sms",
            "name": "Returned bag picked up",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "bank_form_link": "https://formlink",
              "refund_amount": 999,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Return picked up. {{ articles }} from {{ brand }} {{ orderID }} has been picked up. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:50.974Z",
            "updated_at": "2021-08-06T10:00:50.974Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a3fb6ae8a7b",
        "smsDropDownData": [
          {
            "value": "610d08520b266a3fb6ae8a7b",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a3fb6ae8a7b",
            "text": "Returned bag picked up (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "6282028964ad294f71cd8071",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "6282028164ad29cf22cd8022"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "6282028164ad29176acd8023"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to convey that return bag has been delivered.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 4,
          "_id": "6282028164ad290472cd8024",
          "slug": "return_bag_delivered-event",
          "event_name": "Return bag delivered",
          "created_at": "2022-05-16T07:51:29.089Z",
          "updated_at": "2022-05-16T07:51:29.089Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to convey that return bag has been delivered.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "6282028164ad29cf22cd8022",
            "slug": "return_bag_delivered-email",
            "name": "Return bag delivered",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{email_subject}}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Dear Customer,</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Greetings from JioMart Partner. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Your JioMart Partner Order No.{{orderID}} returned on {{datetime}} of Rs.{{refund_amount}} is successful. Please note the return ID {{shipmentID}}. Your refund, if applicable, will be done within 5-7 working days. Please contact merchant care at 18008912345 for any queries.\n                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n\n      <tr>\n\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n\n                    <td align=\"center\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Return</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">Warm Regards, <br>\n                  Team JioMart Partner</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>\n"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Dear Customer,\nGreetings from JioMart Partner.\nYour JioMart Partner Order No.{{orderID}} returned on {{datetime}} of Rs.{{refund_amount}} is successful. Please note the return ID {{shipmentID}}. Your refund, if applicable, will be done within 5-7 working days. Please contact merchant care at 18008912345 for any queries.\nWarm Regards,\nTeam JioMart Partner\n"
            },
            "template_variables": {
              "orderID": "FY62616DA501799E4831",
              "shipmentID": "16506105795361457488J",
              "datetime": "Sat, 23 Apr",
              "refund_amount": 30,
              "email_subject": "JioMart Partner:Return Successful",
              "title": "JioMart Partner:Return Successful"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-05-16T07:51:29.007Z",
            "updated_at": "2022-05-16T07:51:29.007Z",
            "__v": 0
          }
        },
        "previousEmail": "6282028164ad29cf22cd8022",
        "emailDropDownData": [
          {
            "value": "6282028164ad29cf22cd8022",
            "text": "Return bag delivered (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "6282028164ad29cf22cd8022",
            "text": "Return bag delivered (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to convey that return bag has been delivered.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "6282028164ad29176acd8023",
            "slug": "return_bag_delivered-sms",
            "name": "Return bag delivered",
            "template_variables": {
              "orderID": "FY62616DA501799E4831",
              "shipmentID": "16506105795361457488J",
              "datetime": "Sat, 23 Apr",
              "refund_amount": 30
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your JioMart Partner Order No.{{orderID}} returned on {{datetime}} of Rs. {{refund_amount}} is successful. Please note the return ID {{shipmentID}}. Your refund, if applicable, will be done within 5-7 working days. Please contact merchant care at 18008912345 for any queries\n"
            },
            "created_at": "2022-05-16T07:51:29.078Z",
            "updated_at": "2022-05-16T07:51:29.078Z",
            "__v": 0
          }
        },
        "previousSms": "6282028164ad29176acd8023",
        "smsDropDownData": [
          {
            "value": "6282028164ad29176acd8023",
            "text": "Return bag delivered (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "6282028164ad29176acd8023",
            "text": "Return bag delivered (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f68c8622825",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08530b266a489fae8a82"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08530b266a6c87ae8a83"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to notify the customer that their returned item has not been accepted.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 5,
          "_id": "610d08530b266a4f29ae8a84",
          "slug": "return_not_accepted-event",
          "event_name": "Not accepted",
          "created_at": "2021-08-06T10:00:51.058Z",
          "updated_at": "2022-05-16T07:51:29.291Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to notify the customer that their returned item has not been accepted.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08530b266a489fae8a82",
            "slug": "return_not_accepted-email",
            "name": "Return not accepted",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Your return of the following product(s) in Order#<b>{{order_no}} </b>\n                    <has>been rejected by the brand. We asked them why and this is what they told us - </has><b>{{rejected_reason}}</b>\n                  </p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Pickup Address</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{delivery_address}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Now</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nYour return of the following product(s) in Order# {{order_no}} has been rejected by the brand.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nPickup Address\n\n{{delivery_address}}\n\nWe know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have more queries just drop us a mail on care@gofynd.com.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "kaushil",
              "order_no": "FY5E4526E809272241E0",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "Basics Navy Solid Bomber Tshirt",
                  "item_brand": "Basics",
                  "price_effective": 3699,
                  "quantity": 1,
                  "item_size": "L",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/1188_B1W18MHK0161NAVYBLUE/1_1564227364172.jpg",
                  "item_image_link": "https://go.fyndi.ng/0vH2aI9JVY",
                  "marked_price": 3699,
                  "discount": 0,
                  "sub_total": 3699
                }
              ],
              "sub_total": "3,699.00",
              "convenience_fee": "None",
              "discount_coupon": "None",
              "delivery_charges": "None",
              "cod_charges": "None",
              "you_saved": "None",
              "fynd_cash_referral": "None",
              "fynd_cash_refund": "None",
              "cashback_applied": "None",
              "total": "1.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "kaushil",
              "delivery_address": "Kaushil,<br/> Test,<br/> Test,<br/> test,<br/> Mumbai,<br/> 400078<br/> <br/> Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "kaushilrambhia@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We know this has not been a great experience but we promise you we will make it up, next time you order on Fynd. Meanwhile, if you have more queries just drop us a mail on care@fynd.com",
              "payment_mode": "Net Banking",
              "brand_name": "Basics",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/2716_e54b0ab9da4244a28bfac90f57844537.jpg",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:51.049Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08530b266a489fae8a82",
        "emailDropDownData": [
          {
            "value": "610d08530b266a489fae8a82",
            "text": "Return not accepted (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08530b266a489fae8a82",
            "text": "Return not accepted (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to notify the customer that their returned item has not been accepted.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08530b266a6c87ae8a83",
            "slug": "return_not_accepted-sms",
            "name": "Return not accepted",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E37F05009B99E69E2",
              "brand": "BASICS",
              "name": "Kaushil",
              "articles": "Black Melange Casual Shirt (S)",
              "contact": 8767087087,
              "credits": 0,
              "slot": "By 9:00 PM",
              "slot_date": "7th Feb 2020",
              "datetime": "07 Feb",
              "cashback": 0,
              "value": 500,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "tracking_url": "https://track.fynd.com/"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Return rejected. Return of {{ articles }} in {{ brand }} {{ orderID }} has been rejected due to {{ reason }}. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:51.053Z",
            "updated_at": "2021-08-06T10:00:51.053Z",
            "__v": 0
          }
        },
        "previousSms": "610d08530b266a6c87ae8a83",
        "smsDropDownData": [
          {
            "value": "610d08530b266a6c87ae8a83",
            "text": "Return not accepted (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08530b266a6c87ae8a83",
            "text": "Return not accepted (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "621c61b07b963df30bd41bbe",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61aa7b963d69e0d41b97"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "621c61aa7b963d108cd41b98"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to notify the customer that their item returning to origin after multiple attempts of delivery",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 5,
          "_id": "621c61aa7b963d5c4cd41b99",
          "slug": "rto_in_transit-event",
          "event_name": "Order returning to origin",
          "created_at": "2022-02-28T05:46:18.053Z",
          "updated_at": "2022-05-16T07:51:29.326Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template for notifying the customers, that their item returning to origin after multiple attempts of delivery.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "621c61aa7b963d69e0d41b97",
            "slug": "rto_in_transit-email",
            "name": "Order returning to origin",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Following product(s) in your <b>Order# {{order_no}} </b> was/were attempted by our delivery executive multiple times but was unsuccessful. Hence, The order is returning to its origin.</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your Order#{{order_no}} was/were attempted by our delivery executive multiple times but was unsuccessful. Hence, The order is returning to its origin.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nDelivery Address\n\n{{delivery_address}}\n\nWe've got you covered here, but in case of any mess up, kindly drop a mail to care@gofynd.com and we'll try our best to get your issue resolved.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "invoice_id": 7255087,
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": "1,099.00",
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "order_no": " FY5E53AFAA091115C235 Shipment# SH-2020224-5E53AFAA0-1172A1789",
              "total": "1,099.00",
              "convenience_fee": "80.00",
              "sub_total": "2,199.00",
              "delivery_charges": null,
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "delivery_slot": "",
              "discount_coupon": null,
              "user_email": "alwirasheikh@gofynd.com",
              "cod_charges": null,
              "you_saved": "1,100.00",
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "coupon_code": null,
              "track_now_link": "http://go.fyndi.ng/track-order",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "subject_line": "Details of your order FY5E53AFAA091115C235with shipment ID : SH-2020224-5E53AFAA0-1172A1789",
              "title": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
              "ordering_channel": "ECOMM",
              "email_subject": "Out for Delivery - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-02-28T05:46:18.042Z",
            "updated_at": "2022-05-13T05:05:37.002Z",
            "__v": 0
          }
        },
        "previousEmail": "621c61aa7b963d69e0d41b97",
        "emailDropDownData": [
          {
            "value": "621c61aa7b963d69e0d41b97",
            "text": "Order returning to origin (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "621c61aa7b963d69e0d41b97",
            "text": "Order returning to origin (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to notify the customer that their item returning to origin after multiple attempts of delivery.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "621c61aa7b963d108cd41b98",
            "slug": "rto_in_transit-sms",
            "name": "Order returning to origin",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E37F05009B99E69E2",
              "brand": "BASICS",
              "name": "Kaushil",
              "articles": "Black Melange Casual Shirt (S)",
              "contact": 8767087087,
              "credits": 0,
              "slot": "By 9:00 PM",
              "slot_date": "7th Feb 2020",
              "datetime": "07 Feb",
              "cashback": 0,
              "value": 500,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "tracking_url": "https://track.fynd.com/"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "{{ articles }} in {{ brand }} {{ orderID }} is returning to its origin. If prepaid, the refund of Rs.{{ refund_amount }} will be initiated via Fynd For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2022-02-28T05:46:18.048Z",
            "updated_at": "2022-02-28T05:46:18.048Z",
            "__v": 0
          }
        },
        "previousSms": "621c61aa7b963d108cd41b98",
        "smsDropDownData": [
          {
            "value": "621c61aa7b963d108cd41b98",
            "text": "Order returning to origin (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "621c61aa7b963d108cd41b98",
            "text": "Order returning to origin (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "6282028964ad29f493cd8070",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "6282028164ad29d44fcd8025"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "6282028164ad296be6cd8026"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to inform the customers, that a return dp has been assigned.",
          "enabled": true,
          "editable": true,
          "group": "Order Return",
          "channels": [
            "all"
          ],
          "priority": 7,
          "_id": "6282028164ad29ef9fcd8027",
          "slug": "return_dp_assigned-event",
          "event_name": "Return DP Assigned",
          "created_at": "2022-05-16T07:51:29.180Z",
          "updated_at": "2022-05-16T07:51:29.180Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to inform the customers, that a return dp has been assigned.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "6282028164ad29d44fcd8025",
            "slug": "return_dp_assigned-email",
            "name": "Return DP Assigned",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{email_subject}}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Dear Customer,</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Greetings from JioMart Partner. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Your return request for JioMart Partner Order No. {{orderID}} against {{shipmentID}} will be picked up shortly. Please keep the material ready in its original form and you may contact our merchant care at 18008912345 for any queries.\n                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n\n      <tr>\n\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n\n                    <td align=\"center\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Return</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">Warm Regards, <br>\n                  Team JioMart Partner</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</html>\n"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "Dear Customer,\nGreetings from JioMart Partner.\nYour return request for JioMart Partner Order No. {{orderID}} against {{shipmentID}} will be picked up shortly. Please keep the material ready in its original form and you may contact our merchant care at 18008912345 for any queries.\nWarm Regards,\nTeam JioMart Partner\n"
            },
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "FY62616DA501799E4831",
              "shipmentID": "16506105795361457488J",
              "title": "JioMart Partner return request item will be picked up shortly",
              "email_subject": "JioMart Partner return request item will be picked up shortly"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2022-05-16T07:51:29.124Z",
            "updated_at": "2022-05-16T07:51:29.124Z",
            "__v": 0
          }
        },
        "previousEmail": "6282028164ad29d44fcd8025",
        "emailDropDownData": [
          {
            "value": "6282028164ad29d44fcd8025",
            "text": "Return DP Assigned (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "6282028164ad29d44fcd8025",
            "text": "Return DP Assigned (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to inform the customers, that a return dp has been assigned.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "6282028164ad296be6cd8026",
            "slug": "return_dp_assigned-sms",
            "name": "Return DP Assigned",
            "template_variables": {
              "orderID": "FY5E53AFAA091115C235",
              "shipmentID": "16506105795361457488J"
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your return request for JioMart Partner Order No. {{orderID}} against {{shipmentID}} will be picked up shortly. Please keep the material ready in its original form and you may contact our merchant care at 18008912345 for any queries.\n"
            },
            "created_at": "2022-05-16T07:51:29.130Z",
            "updated_at": "2022-05-16T07:51:29.130Z",
            "__v": 0
          }
        },
        "previousSms": "6282028164ad296be6cd8026",
        "smsDropDownData": [
          {
            "value": "6282028164ad296be6cd8026",
            "text": "Return DP Assigned (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "6282028164ad296be6cd8026",
            "text": "Return DP Assigned (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      }
    ]
  },
  {
    "name": "Order Refund",
    "children": [
      {
        "appSubscriptionId": "610d1805f6ad2fa114622814",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a71f4ae8a6e"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266a70eaae8a6f"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to notify the customers that a refund is initiated on their returned items.",
          "enabled": true,
          "editable": true,
          "group": "Order Refund",
          "channels": [
            "all"
          ],
          "priority": 6,
          "_id": "610d08520b266a55ddae8a70",
          "slug": "refund_initiated-event",
          "event_name": "Initiated",
          "created_at": "2021-08-06T10:00:50.873Z",
          "updated_at": "2022-05-16T07:51:28.904Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to notify the customers that a refund is initiated on their returned items.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "high",
            "published": true,
            "_id": "610d08520b266a71f4ae8a6e",
            "slug": "refund_initiated-email",
            "name": "Refund initiated",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n    <head>\n        <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />\n        <title>{{title}}</title>\n    </head>\n    <body>\n        <span\n            class=\"subject-line\"\n            style=\"font-family: Arial; -webkit-font-smoothing: antialiased; display: none; font-size: 14px; padding: 0 10px; text-align: center; visibility: hidden; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\"\n            >{{subject_line}}</span\n        >\n        <table\n            border=\"0\"\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            height=\"100%\"\n            width=\"600px\"\n            align=\"center\"\n            class=\"order-confirmation\"\n            style=\"letter-spacing: 0.3px; border: 1px solid #ccc;\"\n        >\n            <tr>\n                <td\n                    align=\"center\"\n                    valign=\"top\"\n                    class=\"border\"\n                    style=\"border-bottom: 1px solid #D7D7D7;\"\n                >\n                    <table\n                        border=\"0\"\n                        cellpadding=\"0\"\n                        cellspacing=\"0\"\n                        height=\"100%\"\n                        width=\"100%\"\n                        align=\"center\"\n                    >\n                      <tr>\n                        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n                          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n                            <tr>\n                              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n                            </tr>\n                          </table>\n                        </td>\n                      </tr>\n                    </table>\n                </td>\n            </tr>\n            <tr>\n                <td align=\"center\" valign=\"top\">\n                    <table\n                        border=\"0\"\n                        cellpadding=\"0\"\n                        cellspacing=\"0\"\n                        width=\"100%\"\n                    >\n                        <tbody>\n                            <tr>\n                                <td\n                                    align=\"left\"\n                                    valign=\"top\"\n                                    class=\"text-lines border\"\n                                    style=\"border-bottom: 1px solid #D7D7D7; padding: 0 20px 20px 20px;\"\n                                >\n                                    <p\n                                        class=\"title-name\"\n                                        style=\"font-size: 14pt; color: #41434C; margin: 0; padding: 15px 0; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                    >\n                                        Hello {{name}},\n                                    </p>\n                                    <p\n                                        class=\"title-order-line\"\n                                        style=\"font-size: 13pt; color: #41434C; margin: 0; line-height: 1.6; word-spacing: 2px; font-family: Arial; -webkit-font-smoothing: antialiased;\"\n                                    >\n                                        Refund amount of\n                                        <b\n                                            >Rs. {{refund_amount}} for\n                                            {{product_name}} in order\n                                            {{order_no}} has been initiated </b\n                                        >to <b>{{source_name}}.</b>\n                                    </p>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td\n                                    class=\"text-lines border\"\n                                    style=\"border-bottom: 1px solid #D7D7D7; padding: 0 20px 20px 20px;\"\n                                >\n                                    <p\n                                        class=\"small-text\"\n                                        style=\"font-size: 11pt; color: #41434C; font-family: Arial; -webkit-font-smoothing: antialiased; line-height: 1.7; text-align: justify; margin: 20px 0 0 0; padding: 0;\"\n                                    >\n                                        Note: It may take at-least 7 business\n                                        days for the refund to reflect in your\n                                        account depending on the payment\n                                        gateway. In case of any query please\n                                        email us on care@fynd.com\n                                    </p>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </td>\n            </tr>\n            <tr align=\"center\">\n              <td>\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n                  <tr>\n                    <td>\n                      <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td>\n                      <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                        {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                          {{ ref_application.app_information.additional_data.address_line }}\n                        {% endif %}\n                        {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                          {{ ref_application.app_information.additional_data.city_pincode }}\n                        {% endif %}\n                      </div>\n                      <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                        {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                        </div>\n                      <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n                    </td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n        </table>\n    </body>\n</html>\n"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\n\nHello {{name}},\n\nReturn for the following item in your order# {{order_no}} has been initiated.\n\n{{item_image_link}}\n\n{{item_image}}\n\n{{item_brand}}\n\n{{item_name}}\n\nSize: {{item_size}}\n\n{{return_status}}\n\nPickup Address:\n\n{{address}}\n\nPickup Schedule:\n\n{{date}}, {{time}}\n\nThis mail is intended only for {{email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E53AFAA091115C235",
              "product_name": "SAPPER Blue Solid Slim Fit Trackpants",
              "refund_amount": "1,099.00",
              "user_email": "ALWIRASHEIKH@GMAIL.COM",
              "source_name": "Cash on Delivery",
              "subject_line": "Refund details for your order FY5E53AFAA091115C235",
              "title": "Refund initiated for Blue Solid Slim Fit Trackpants (28) in your SAPPER Order",
              "ordering_channel": "ECOMM",
              "email_subject": "Refund initiated for Blue Solid Slim Fit Trackpants (28) in your SAPPER Order",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.860Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a71f4ae8a6e",
        "emailDropDownData": [
          {
            "value": "610d08520b266a71f4ae8a6e",
            "text": "Refund initiated (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a71f4ae8a6e",
            "text": "Refund initiated (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to notify the customers that a refund is initiated on their returned items.",
            "priority": "high",
            "tags": [],
            "published": true,
            "_id": "610d08520b266a70eaae8a6f",
            "slug": "refund_initiated-sms",
            "name": "Refund initiated",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16298768762811794288",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "refund_amount": 1099,
              "value": 1099,
              "source": "Cash on Delivery",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Refund initiated via Fynd. We have initiated refund for {{ articles }} of your {{ brand }} {{ orderID }}. It will be processed in next 2-3 days. For queries email: {{ ref_application.support_email }} or visit {{ tracking_url }}"
            },
            "created_at": "2021-08-06T10:00:50.867Z",
            "updated_at": "2022-05-09T09:11:15.402Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266a70eaae8a6f",
        "smsDropDownData": [
          {
            "value": "610d08520b266a70eaae8a6f",
            "text": "Refund initiated (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266a70eaae8a6f",
            "text": "Refund initiated (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2f1e4a62281e",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a46e8ae8a6b"
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08520b266ab611ae8a6c"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template to inform the customers that their paid amount is successfully refunded.    ",
          "enabled": true,
          "editable": true,
          "group": "Order Refund",
          "channels": [
            "all"
          ],
          "priority": 7,
          "_id": "610d08520b266acf78ae8a6d",
          "slug": "refund_completed-event",
          "event_name": "Completed",
          "created_at": "2021-08-06T10:00:50.856Z",
          "updated_at": "2022-05-16T07:51:28.885Z",
          "__v": 0
        },
        "email": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this email template to inform the customers that their paid amount is successfully refunded.",
            "static_to": [],
            "static_cc": [],
            "static_bcc": [],
            "tags": [],
            "priority": "low",
            "published": true,
            "_id": "610d08520b266a46e8ae8a6b",
            "slug": "refund_completed-email",
            "name": "Refund completed",
            "subject": {
              "template_type": "nunjucks",
              "template": "{{ email_subject }}"
            },
            "html": {
              "template_type": "nunjucks",
              "template": "<!DOCTYPE html>\n<html>\n\n  <head>\n    <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n    <title>{{title}}</title>\n  </head>\n\n  <body class=\"order_cnf_bg\" style=\"background: #f4f4f4; padding-top: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><span class=\"subject-line\" style=\"visibility: hidden; font-family: Arial; display: none; font-size: 14px; padding: 0 10px; text-align: center; -webkit-font-smoothing: antialiased; height: 0; width: 0; opacity: 0; margin: 0 auto; color: transparent;\">{{subject_line}}</span>\n    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"600px\" align=\"center\" class=\"order-confirmation\" style=\"letter-spacing: 0px; background: #fff; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n      <tr>\n        <td align=\"center\" valign=\"top\" class=\"border\" style=\"border-bottom: 1px solid #D7D7D7;\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\">\n            <tr>\n              <td align=\"center\" style=\"padding: 15px 0px\"><a href=\"{{ ref_application.domain.name }}\" target=\"_blank\"><img style=\"max-height:150px\" src=\"{{ ref_application.logo.secure_url }}\" border=\"0\" alt=\"\"></a></td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td align=\"center\" valign=\"top\">\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n            <tbody>\n              <tr>\n                <td colspan=\"3\" class=\"greeting\" style=\"padding: 0 20px;\">\n                  <p class=\"title-name\" style=\"font-size: 12px; color: #41434C; margin: 0; padding: 15px 0 7px 0; font-weight: bold; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Hey {{name}},</p>\n                  <p class=\"title-order-line\" style=\"font-size: 12px; color: #41434C; padding: 0 0 10px 0; margin: 0; line-height: 1.6; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Refund for the following product(s) in Order# <b>{{order_no}} </b>has been completed.\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\n                </td>\n              </tr>\n              <tr>\n                <td class=\"product-detail\" style=\"padding: 0 20px;\">\n                  {% for item in orderedItems %}\n                  <table cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"items-cont\" style=\"border: 1px solid #e3e3e3; border-collapse: collapse;\"><tr>\n                      <td align=\"left\" valign=\"middle\" class=\"img-portion\" style=\"width: 86px; padding-right: 10px; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{item.item_image_link}}\" target=\"_blank\"><img src=\"{{item.item_image}}\" alt=\"{{item.item_name}}\" style=\"width: 89px; height: 139px; display: block;\"></a></td>\n                      <td align=\"left\" valign=\"middle\" width=\"300px\" style=\"padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_brand}}</p>\n                        <p class=\"product\" style=\"font-size: 12px; color: #41434C; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">{{item.item_name}} </p>\n                        <p class=\"product size\" style=\"font-size: 12px; color: #41434C; padding: 8px 0; margin: 3px 0; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">Size: {{item.item_size}}</p>\n                      </td>\n                      <td align=\"right\" valign=\"top\" class=\"price-td\" style=\"border-left: 1px solid #e3e3e3; vertical-align: middle; padding: 10px 10px 10px 10px; border-bottom: 1px solid #e3e3e3; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><b class=\"product price\" style=\"color: #41434C; font-size: 12px; padding-top: 10px; padding: 10px 5px 0 5px; display: block;\">&#8377; {{item.price_effective}}</b></td>\n                    </tr>\n                  </table>\n                  {% endfor %}\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"delivery-address\">\n            <tr>\n              <td class=\"address-td-cont\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; padding: 0 20px;\">\n                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" class=\"address-wrapper\" style=\"border: 1px solid #e3e3e3; margin-top: 20px;\">\n                  <tr>\n                    <td align=\"left\" valign=\"top\" width=\"70%\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\">\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\"><b>Payment Mode</b></p>\n                      <p class=\"address\" style=\"font-size: 12px; color: #41434C; line-height: 1.4; margin: 5px 0;\">{{payment_mode}}</p>\n                    </td>\n                    <td align=\"right\" valign=\"middle\" style=\"padding: 10px 12px 10px 10px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased;\"><a href=\"{{track_now_link}}\" class=\"sea-green track-now\" style=\"background: #33b2c1; text-transform: uppercase; display: block; text-align: center; color: #fff; font-weight: bold; min-width: 150px; text-decoration: none; font-size: 14px; width: 150px; border-radius: 3px; padding: 14px 0;\">Track Refund</a></td>\n                  </tr>\n                </table>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr>\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer-care\" style=\"padding: 10px 20px 0 20px; color: #41434C; line-height: 20px; font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">\n            <tr>\n              <td>\n                <p class=\"text\" style=\"font-family: Verdana, Tahoma, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px;\">{{care_text}}</p>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n      <tr align=\"center\">\n        <td>\n          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" align=\"center\" class=\"footer footer-backround\" style=\"text-align: center; background-color: #f2f2f2;\">\n            <tr>\n              <td>\n                <p style=\"font-family: Arial; -webkit-font-smoothing: antialiased; margin: 13.5px; font-size: 13.5px; color: #6E6D6D; line-height: 1.5; padding: 0 30px;\"></p>\n              </td>\n            </tr>\n            <tr>\n              <td>\n                <div class=\"footerTextEmails20welcome address\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; line-height: 20px; font-size: 12px; color: #aeaeae; padding: 0 25px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.address_line %}\n                    {{ ref_application.app_information.additional_data.address_line }}\n                  {% endif %}\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.city_pincode %}\n                    {{ ref_application.app_information.additional_data.city_pincode }}\n                  {% endif %}\n                </div>\n                <div class=\"footerTextEmails20welcome\" style=\"font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; color: #aeaeae; line-height: 20px;\">\n                  {% if ref_application.app_information and ref_application.app_information.additional_data.privacyPolicy %}<a href=\"{{ ref_application.app_information.additional_data.privacyPolicy }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Privacy Policy </a><span>| </span>{% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.contactUs %}<a href=\"{{ ref_application.app_information and ref_application.app_information.additional_data.contactUs }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">Contact us </a><span>| </span>  {% endif %}{% if ref_application.app_information and ref_application.app_information.additional_data.domain %}<a href=\"{{ ref_application.app_information.additional_data.domain }}\" target=\"_blank\" class=\"footerTextEmails20welcome\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\"> {{ ref_application.app_information and ref_application.app_information.additional_data.domain }}</a>{% endif %}\n                  </div>\n                <div class=\"footerTextEmails20welcome intented\" style=\"color: #aeaeae; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 10px; line-height: 20px;\">This email is intended only for {{user_email}}</div>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n\n</ht... (10024 total length)"
            },
            "text": {
              "template_type": "nunjucks",
              "template": "{{subject_line}}\nHello {{name}},\nRefund for the following product(s) in Order# {{order_no}} has been completed.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.price_effective}}\n{% endfor %}\n\nPayment Mode\n\n{{payment_mode}}\n\nWe hope that cheers you up :) If you have any questions, you can always drop a mail to care@gofynd.com.\n\n#HappyFynding\nThis mail is intended only for {{user_email}}"
            },
            "template_variables": {
              "name": "Alwira Sheikh",
              "order_no": "FY5E53AFAA091115C235",
              "orderedItems": [
                {
                  "delivery_time": "",
                  "item_name": "SAPPER Blue Solid Slim Fit Trackpants",
                  "item_brand": "SAPPER",
                  "price_effective": 1099,
                  "quantity": 1,
                  "item_size": "28",
                  "item_image": "https://hdn-1.fynd.com/media/pictures/tagged_items/360x0/217_S1810404-404/1_1533108310456.jpg",
                  "item_image_link": "https://go.fyndi.ng/4dnhvxlI20",
                  "marked_price": 2199,
                  "discount": 1100,
                  "sub_total": 2199
                }
              ],
              "sub_total": "2,199.00",
              "convenience_fee": null,
              "discount_coupon": null,
              "delivery_charges": null,
              "cod_charges": null,
              "you_saved": null,
              "fynd_cash_referral": null,
              "fynd_cash_refund": null,
              "cashback_applied": null,
              "total": "1,099.00",
              "track_now_link": "http://go.fyndi.ng/track-order",
              "user_name": "Alwira Sheikh",
              "delivery_address": "Alwira Sheikh,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069   Kindly reach us at care@fynd.com for any concerns, or track details for your orders at https://track.fynd.com",
              "user_email": "alwirasheikh@gofynd.com",
              "refer_earn_link": "http://go.fyndi.ng/refer_earn",
              "care_text": "We hope that cheers you up :) If you have any questions, you can always drop a mail to care@fynd.com",
              "payment_mode": "Cash on Delivery",
              "brand_name": "SAPPER",
              "ordering_channel": "ECOMM",
              "brand_logo_url": "http://cdn4.gofynd.com/media/logo/brand/original/13826_b0799a3a2afa4637806b18a7f58f13de.jpg",
              "subject_line": "Details of your order FY5E53AFAA091115C235",
              "title": "Refund Completed - SAPPER Order FY5E53AFAA091115C235",
              "ref_application": {
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              },
              "email_subject": "Refund Completed - SAPPER Order FY5E53AFAA091115C235"
            },
            "headers": [],
            "attachments": [],
            "created_at": "2021-08-06T10:00:50.847Z",
            "updated_at": "2022-05-13T05:05:37.001Z",
            "__v": 0
          }
        },
        "previousEmail": "610d08520b266a46e8ae8a6b",
        "emailDropDownData": [
          {
            "value": "610d08520b266a46e8ae8a6b",
            "text": "Refund completed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "filteredEmailDropDownData": [
          {
            "value": "610d08520b266a46e8ae8a6b",
            "text": "Refund completed (Default)"
          },
          {
            "text": "Test Email 1",
            "value": "6144793922cdbc22339e871d"
          },
          {
            "text": "This is for test 1",
            "value": "615ae0760c9df8a82795540e"
          }
        ],
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Use this SMS template to inform the customers that their paid amount is successfully refunded.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08520b266ab611ae8a6c",
            "slug": "refund_completed-sms",
            "name": "Refund completed",
            "template_variables": {
              "email": "care@fynd.com",
              "orderID": "Order ID FY5E53AFAA091115C235",
              "shipmentID": "16298768762811794288",
              "brand": "SAPPER",
              "name": "Alwira Sheikh",
              "tracking_url": "http://go.fyndi.ng/track-order",
              "articles": "Blue Solid Slim Fit Trackpants (28)",
              "contact": 8767087087,
              "ordering_channel": "ECOMM",
              "refund_amount": 1099,
              "value": 1099,
              "source": "Cash on Delivery",
              "credits": 0,
              "slot": "By 9:00 PM",
              "datetime": "Feb 28",
              "cashback": 0,
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Refund completed via Fynd. Your refund for {{ articles }} of your {{ brand }} {{ orderID }} is completed. For queries email: {{ ref_application.support_email}}"
            },
            "created_at": "2021-08-06T10:00:50.852Z",
            "updated_at": "2022-05-09T09:11:15.357Z",
            "__v": 0
          }
        },
        "previousSms": "610d08520b266ab611ae8a6c",
        "smsDropDownData": [
          {
            "value": "610d08520b266ab611ae8a6c",
            "text": "Refund completed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08520b266ab611ae8a6c",
            "text": "Refund completed (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      }
    ]
  },
  {
    "name": "Rewards",
    "children": [
      {
        "appSubscriptionId": "610d1805f6ad2fe557622827",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08530b266a14ffae8a92"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template to inform your customers about the reward points granted for successfully inviting others to sign-up.",
          "enabled": true,
          "editable": true,
          "group": "Rewards",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "610d08530b266a36d1ae8a93",
          "slug": "referral-code-applied-to-referrer",
          "event_name": "Referrer",
          "created_at": "2021-08-06T10:00:51.262Z",
          "updated_at": "2022-05-16T07:51:29.492Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Select an SMS template to inform your customers about the reward points granted for successfully inviting others to sign-up.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08530b266a14ffae8a92",
            "slug": "referral-code-applied-to-referrer",
            "name": "Referrer",
            "template_variables": {
              "records": {
                "reffered_name": "Prince",
                "referree_name": "Piyush",
                "validity": "21"
              },
              "ref_user": {
                "firstName": "Prince",
                "lastName": "Raj",
                "phoneNumber": {
                  "phone": "7008963113",
                  "countryCode": 91
                },
                "email": "princeraj@gofynd.com"
              },
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Your referred friend {{records.friend}}, has signed up on {{ref_application.name}}. It's your amazing bond and trust that keeps us motivated. Here's your {{records.referrer_amount}} points, keep shopping! Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:51.258Z",
            "updated_at": "2021-08-06T10:00:51.258Z",
            "__v": 0
          }
        },
        "previousSms": "610d08530b266a14ffae8a92",
        "smsDropDownData": [
          {
            "value": "610d08530b266a14ffae8a92",
            "text": "Referrer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08530b266a14ffae8a92",
            "text": "Referrer (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      },
      {
        "appSubscriptionId": "610d1805f6ad2fac1c622829",
        "event": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": "610d08530b266a02a3ae8a90"
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an SMS template to inform your new users about the reward points granted for successfully signing-up through a referral invite.",
          "enabled": true,
          "editable": true,
          "group": "Rewards",
          "channels": [
            "all"
          ],
          "priority": 2,
          "_id": "610d08530b266ac891ae8a91",
          "slug": "referral-code-applied-to-referred-friend",
          "event_name": "Reffered friend",
          "created_at": "2021-08-06T10:00:51.255Z",
          "updated_at": "2022-05-16T07:51:29.483Z",
          "__v": 0
        },
        "sms": {
          "subscribed": true,
          "template": {
            "is_system": true,
            "is_internal": false,
            "description": "Select an SMS template to inform your new users about the reward points granted for successfully signing-up through a referral invite.",
            "priority": "low",
            "tags": [],
            "published": true,
            "_id": "610d08530b266a02a3ae8a90",
            "slug": "referral-code-applied-to-referred-friend",
            "name": "Reffered friend",
            "template_variables": {
              "records": {
                "reffered_name": "Prince",
                "referree_name": "Piyush",
                "validity": "21"
              },
              "ref_user": {
                "firstName": "Prince",
                "lastName": "Raj",
                "phoneNumber": {
                  "phone": "7008963113",
                  "countryCode": 91
                },
                "email": "princeraj@gofynd.com"
              },
              "ref_application": {
                "support_email": "care@fynd.com",
                "app_information": {
                  "additional_data": {
                    "address_line": "Kurar village,Malad",
                    "city_pincode": "Mumbai - 400097",
                    "contactUs": "https://uniket-testing.addsale.link/contact-us",
                    "domain": "uniket-testing.addsale.link",
                    "privacyPolicy": "https://fynd.freshdesk.com/support/solutions/articles/33000214398-privacy-policy"
                  }
                },
                "domain": {
                  "name": "https://fynd.com"
                },
                "logo": {
                  "secure_url": "https://res.cloudinary.com/dwzm9bysq/image/upload/v1587981831/production/system/pointblank/fynd_logo_square_vunk4f.png"
                }
              }
            },
            "message": {
              "template_type": "nunjucks",
              "template": "Hi {{records.friend}}, thanks for signing up on {{ref_application.name}}. Yay! You have earned {{records.amount}} points. Shop now to get more exciting offers and discounts. Offer valid for {{records.validity}} days only. T&C Apply. Notification via Fynd"
            },
            "created_at": "2021-08-06T10:00:51.249Z",
            "updated_at": "2021-08-06T10:00:51.249Z",
            "__v": 0
          }
        },
        "previousSms": "610d08530b266a02a3ae8a90",
        "smsDropDownData": [
          {
            "value": "610d08530b266a02a3ae8a90",
            "text": "Reffered friend (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ],
        "filteredSmsDropDownData": [
          {
            "value": "610d08530b266a02a3ae8a90",
            "text": "Reffered friend (Default)"
          },
          {
            "text": "Invite SMS",
            "value": "6177a20f50571210dd6778f1"
          },
          {
            "text": "Invite SMS",
            "value": "62516d06c6465a27da39cd35"
          },
          {
            "text": "Online order placed",
            "value": "62516d23c6465a7d4f39cd37"
          },
          {
            "text": "Order Arrived at Store",
            "value": "62516d33c6465a555039cd38"
          },
          {
            "text": "Order Lost Test",
            "value": "62541f86c6465a8e6139cd3e"
          },
          {
            "text": "Order Placed",
            "value": "615ae19b0c9df8abda955410"
          },
          {
            "text": "Parvez Test",
            "value": "62691c6570cbc585a6b1c830"
          },
          {
            "text": "Rv test",
            "value": "6253c984c6465a07b439cd39"
          },
          {
            "text": "Verify Link",
            "value": "6177a2c950571240fe6778f2"
          },
          {
            "text": "Verify Otp",
            "value": "62516d13c6465a4d2a39cd36"
          },
          {
            "text": "Test",
            "value": "626922b770cbc5947ab1c832"
          },
          {
            "text": "test 3",
            "value": "6253c9b6c6465a7d9439cd3c"
          },
          {
            "text": "test",
            "value": "6269209370cbc5737db1c831"
          },
          {
            "text": "test1",
            "value": "6253c999c6465a50b339cd3a"
          },
          {
            "text": "test2",
            "value": "6253c9a7c6465a343039cd3b"
          },
          {
            "text": "test5",
            "value": "62541c57c6465a990f39cd3d"
          },
          {
            "text": "test6",
            "value": "6256551bc6465ab8d339cd3f"
          }
        ]
      }
    ]
  }
],
        activeGroupIndex: 0,
        tabs: [
  {
    "name": "Signup & login"
  },
  {
    "name": "Order Processing"
  },
  {
    "name": "Order Cancellation"
  },
  {
    "name": "Order Return"
  },
  {
    "name": "Order Refund"
  },
  {
    "name": "Rewards"
  }
],
        showTemplatePreviewModal: false,
        ORDER: null,
        templateInPreviewModal: {
            template: null,
            template_type: null,
            templatePreview: '',
            error: ''
        }
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
        'ukt-modal': uktModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },

    data() {
        return initialState();
    },
    // computed: {
    //     getBreadCrumb() {
    //         let arr = [];
    //         arr.push({
    //             display: 'Communication',
    //             link: '/admin/'
    //         });
    //         arr.push({
    //             display: 'Subscriptions',
    //             link: '/admin/subscriptions/'
    //         });
    //         return arr;
    //     },
    //     ...mapGetters({
    //         appSubscriptions: ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
    //         systemEmailTemplates: ADMIN_COMMS_GET_SYSTEM_EMAIL_TEMPLATES,
    //         systemSmsTemplates: ADMIN_COMMS_GET_SYSTEM_SMS_TEMPLATES,
    //         emailTemplates: ADMIN_COMMS_GET_EMAIL_TEMPLATES,
    //         smsTemplates: ADMIN_COMMS_GET_SMS_TEMPLATES,
    //         helpData: GET_HELP_SECTION_DATA
    //     }),
    //     jumbotronData() {
    //         if (this.helpData && this.helpData.length) {
    //             return this.helpData.find(it => {
    //                 return this.$route.path.includes(it.path);
    //             });
    //         }
    //     }
    // },
    mounted() {
        //this.onLoad()
    },
    
    updated() {
        if (
            this.$refs['previewbody'] &&
            this.templateInPreviewModal.template_type == 'email'
        ) {
            let iframe = this.$refs['previewbody'];
            let iframedoc = iframe.contentDocument ?
                            iframe.contentDocument :
                            iframe.contentWindow ?
                            iframe.contentWindow.document :
                            null
            if(iframedoc){
                iframedoc.body.innerHTML = this.templateInPreviewModal.templatePreview;
            }
        }
    },
    methods: {
        // onLoad(){
        //     Object.assign(this.$data, initialState());
        //     this.pageLoading = true;
        //     let allPromises = [
        //         this.fetchEventsOrder(),
        //         this.fetchEmailTemplates(),
        //         this.fetchSystemEmailTemplates(),
        //         this.fetchSmsTemplates(),
        //         this.fetchSystemSmsTemplates(),
        //         this.fetchAppEventSubscriptions(),
        //         this.getAppInventory()
        //     ];

        //     Promise.all(allPromises)
        //         .then(() => {
        //             this.updateInfo();
        //         })
        //         .then(()=>{
        //             if (this.$route.query.hasOwnProperty('activeTab')) {
        //                 let activeTab = Number(this.$route.query.activeTab);
        //                 this.changeGroupIndex({ index: activeTab });
        //             } else {
        //                 this.changeGroupIndex({ index: 0 });
        //             }
        //             this.pageLoading = false;
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             this.pageLoading = false;
        //             this.pageError = true;
        //         });
        // },
        toggleString,
        // fetchEventsOrder() {
        //     return AdminCommsService.fetchEventsOrder().then(({ data }) => {
        //         this.ORDER = data;
        //     })
        // },
        cloneTemplate() {
            let type = this.templateInPreviewModal.template_type;
            let template = this.templateInPreviewModal.template;
            this.$router.push({
                name: `create-${type}-template`,
                query: { clone: template._id }
            });
        },
        renderHtmlTemplate(emailTemplate) {
            this.templateInPreviewModal.error = '';
            let template = '';
            let templateValid = true;
            console.log(emailTemplate);
            if (emailTemplate.html.template_type == 'nunjucks') {
                try {
                    template = nunjucks.compile(emailTemplate.html.template);
                    template = template.render(emailTemplate.template_variables);
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
        // renderSMSTemplate(smsTemplate) {
        //     this.templateInPreviewModal.error = '';
        //     let template = '';
        //     let templateValid = true;
        //     if (smsTemplate.message.template_type == 'nunjucks') {
        //         try {
        //             template = nunjucks.compile(smsTemplate.message.template);
        //             template = template.render(smsTemplate.template_variables);
        //         } catch (err) {
        //             templateValid = false;
        //             this.templateInPreviewModal.error =
        //                 'Invalid message template';
        //         }
        //     } else {
        //         template = smsTemplate.message.template.value;
        //     }
        //     if (templateValid) {
        //         template = this.urlify(template);
        //         return template;
        //     }
        // },
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
        updateCommsEnabled() {
            // AppSettingService.patchAppConfiguration({
            //     comms_enabled: this.comms_enabled
            // })
            //     .then(data => {
            //         this.$snackbar.global.showSuccess('Updated Successfully');
            //     })
            //     .catch(err => {
            //         this.$snackbar.global.showError('Failed to update');
            //     });
        },
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
            let template = this.subscriptions[groupIndex].children[childIndex][
                type
            ].template;
            this.templateInPreviewModal.template = template;
            this.templateInPreviewModal.template_type = type;
            if (type == 'sms') {
                this.templateInPreviewModal.templatePreview = this.renderSMSTemplate(
                    template
                );
            } else if (type == 'email') {
                this.templateInPreviewModal.templatePreview = this.renderHtmlTemplate(
                    template
                );
                let el = this.$refs['previewbody'];
                if (this.$refs['previewbody']) {
                    let iframe = this.$refs['previewbody'];
                    var iframedoc =
                        iframe.contentDocument || iframe.contentWindow.document;
                    iframedoc.body.innerHTML = this.templateInPreviewModal.templatePreview;
                }
            }

            this.showTemplatePreviewModal = true;
            // this.$router.push({
            //     name: `create-${type}-template`,
            //     query: { clone: template._id }
            // });
            // console.log(type, groupIndex, childIndex);
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
            ].filter(template => {
                return (
                    template.text.toLowerCase().indexOf(e.text.toLowerCase()) >
                    -1
                );
            });
        },
        changeGroupIndex(item) {
            this.activeGroupIndex = item.index;
            let activeTab = this.activeGroupIndex;
            this.$router.replace({
                name: 'events',
                query: { ...this.$route.query, activeTab }
            })
            .catch((e)=>{
                console.log(e)
            })
        },
        // fetchEmailTemplates() {
        //     return this.$store.dispatch(ADMIN_COMMS_FETCH_EMAIL_TEMPLATES, {
        //         params: {
        //             page_size: 200,
        //             page_no: 1
        //         }
        //     });
        // },
        // fetchSystemEmailTemplates() {
        //     return this.$store.dispatch(
        //         ADMIN_COMMS_FETCH_SYSTEM_EMAIL_TEMPLATES,
        //         {
        //             params: {
        //                 page_size: 200,
        //                 page_no: 1
        //             }
        //         }
        //     );
        // },
        // fetchSmsTemplates() {
        //     return this.$store.dispatch(ADMIN_COMMS_FETCH_SMS_TEMPLATES, {
        //         params: {
        //             page_size: 200,
        //             page_no: 1
        //         }
        //     });
        // },
        // fetchSystemSmsTemplates() {
        //     return this.$store.dispatch(
        //         ADMIN_COMMS_FETCH_SYSTEM_SMS_TEMPLATES,
        //         {
        //             params: {
        //                 page_size: 200,
        //                 page_no: 1
        //             }
        //         }
        //     );
        // },
        // fetchAppEventSubscriptions() {
        //     return this.$store.dispatch(
        //         ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
        //         {
        //             params: {
        //                 page_size: 200,
        //                 page_no: 1,
        //                 populate: [
        //                     'event',
        //                     'template.sms.template',
        //                     'template.email.template'
        //                 ]
        //             }
        //         }
        //     );
        // },
        // dropDownReachedBottom(e) {
        //     // console.log(e);
        // },
        // getSubscriptionTabs() {
        //     let tabs = [];
        //     this.subscriptions.forEach(subscription => {
        //         tabs[this.ORDER[subscription.name]] = {
        //             name: subscription.name
        //         };
        //     });
        //     return tabs;
        // },
        // updateInfo() {
        //     let subscriptions = this.subscriptions;
        //     let groupNames = this._fetchUniqueGroupNames(this.appSubscriptions);

        //     this.appSubscriptions.items.forEach(appSubscription => {
        //         let groupNameIndex = groupNames.findIndex(
        //             groupName => groupName == appSubscription.event.group
        //         );

        //         let child = {
        //             appSubscriptionId: appSubscription._id,
        //             event: appSubscription.event
        //         };

        //         if (get(appSubscription, 'template.email.template')) {
        //             child.email = appSubscription.template.email;
        //             child.previousEmail =
        //                 appSubscription.template.email.template._id;

        //             let emailDropDownData = this._getDropdownData(
        //                 this.emailTemplates.items
        //             );
        //             let defaultSystemEmailTemplate = this._getDefaultTemplate(
        //                 'email',
        //                 this.systemEmailTemplates,
        //                 appSubscription
        //             );
        //             if (defaultSystemEmailTemplate) {
        //                 if(!defaultSystemEmailTemplate.name.endsWith(` (Default)`)){
        //                     defaultSystemEmailTemplate.name = `${defaultSystemEmailTemplate.name} (Default)`;
        //                 }
        //                 emailDropDownData = this._addSystemTemplateOnTop(
        //                     defaultSystemEmailTemplate,
        //                     emailDropDownData
        //                 );
        //             }
        //             child.emailDropDownData = emailDropDownData;
        //             child.filteredEmailDropDownData = fp.cloneDeep(
        //                 emailDropDownData
        //             );
        //         }

        //         if (get(appSubscription, 'template.sms.template')) {
        //             child.sms = appSubscription.template.sms;
        //             child.previousSms =
        //                 appSubscription.template.sms.template._id;

        //             let smsDropDownData = this._getDropdownData(
        //                 this.smsTemplates.items
        //             );
        //             let defaultSystemSmsTemplate = this._getDefaultTemplate(
        //                 'sms',
        //                 this.systemSmsTemplates,
        //                 appSubscription
        //             );

        //             if (defaultSystemSmsTemplate) {
        //                 if(!defaultSystemSmsTemplate.name.endsWith(` (Default)`)){
        //                     defaultSystemSmsTemplate.name = `${defaultSystemSmsTemplate.name} (Default)`;
        //                 }
        //                 smsDropDownData = this._addSystemTemplateOnTop(
        //                     defaultSystemSmsTemplate,
        //                     smsDropDownData
        //                 );
        //             }

        //             child.smsDropDownData = smsDropDownData;
        //             child.filteredSmsDropDownData = fp.cloneDeep(
        //                 smsDropDownData
        //             );
        //         }

        //         if (!get(subscriptions, `${groupNameIndex}.children`)) {
        //             subscriptions[groupNameIndex] = {
        //                 name: appSubscription.event.group,
        //                 children: [child]
        //             };
        //         } else {
        //             subscriptions[groupNameIndex].children.push(child);
        //         }
        //         subscriptions[groupNameIndex].children.sort((a, b) => {
        //             return a.event.priority - b.event.priority;
        //         });
        //     });
        //     this.subscriptions = this.sortSubscriptionTabs(this.subscriptions);
        //     this.tabs = this.getSubscriptionTabs();
        // },
        // _addSystemTemplateOnTop(defaultTemplate, dropdownData) {
        //     return [
        //         {
        //             value: defaultTemplate._id,
        //             text: defaultTemplate.name
        //         },
        //         ...dropdownData
        //     ];
        // },
        // _getDefaultTemplate(type, systemTemplates, appSubscription) {
        //     return systemTemplates.find(et => {
        //         return et._id == appSubscription.event.template[type].template;
        //     });
        // },
        // _getDropdownData(templates) {
        //     return templates.map(et => {
        //         return {
        //             text: et.name,
        //             value: et._id
        //         };
        //     });
        // },
        // _fetchUniqueGroupNames(appSubscriptions) {
        //     return fp.pipe(
        //         fp.get('items'),
        //         fp.map(fp.get('event.group')),
        //         fp.uniq
        //     )(appSubscriptions);
        // },
        // sortSubscriptionTabs(subscriptions) {
        //     let subscriptionsArr = [];
        //     subscriptions.forEach((sub, i) => {
        //         let subscription = cloneDeep(sub);
        //         subscription.children.sort((a, b) => {
        //             return a.event.priority - b.event.priority;
        //         });
        //         subscriptionsArr[this.ORDER[subscription.name]] = subscription;
        //     });
        //     return subscriptionsArr;
        // },
        // handleToggleEvent(event, item, type) {
        //     item[type].subscribed = event.target.checked;
        // },
        // save(groupIndex, childIndex) {
        //     let finalSubscription = null;

        //     if (groupIndex !== undefined && childIndex !== undefined) {
        //         let subscription = this.subscriptions[groupIndex];
        //         let child = subscription.children[childIndex];

        //         let appSubscription = this.appSubscriptions.items.find(
        //             a => a._id == child.appSubscriptionId
        //         );
        //         let obj = {
        //             _id: child.appSubscriptionId,
        //             template: cloneDeep(appSubscription.template),
        //         };

        //         if (child.email) {
        //             obj.template.email.subscribed = child.email.subscribed;
        //             if (child.email.subscribed) {
        //                 obj.template.email.template = child.email.template._id;
        //             } else {
        //                 obj.template.email.template = child.previousEmail;
        //             }
        //         }
        //         if (child.sms) {
        //             obj.template.sms.subscribed = child.sms.subscribed;
        //             if (child.sms.subscribed) {
        //                 obj.template.sms.template = child.sms.template._id;
        //             } else {
        //                 obj.template.sms.template = child.previousSms;
        //             }
        //         }
        //         finalSubscription = obj;
        //     }
        //     this.pageError = false;
        //     this.$store
        //         .dispatch(ADMIN_COMMS_UPDATE_APP_EVENT_SUBSCRIPTION, {
        //             id: finalSubscription._id,
        //             body: finalSubscription
        //         })
        //         .then(() => {
        //             return this.fetchAppEventSubscriptions();
        //         })
        //         .then(() => {
        //             this.subscriptions = [];
        //             return this.updateInfo();
        //         })
        //         .then(() => {
        //             this.$snackbar.global.showSuccess('Successfully Saved');
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             this.pageError = true;
        //         })
        //         .finally(()=>{
        //             this.pageLoading = false;
        //         })
        // }
    }
   
};
</script>

<style lang="less" scoped>
//@import './../less/page-ui.less';
//@import './../less/page-header.less';
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
    ::v-deep.modal-container {
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
