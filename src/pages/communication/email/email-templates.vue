<template>
    <div class="panel">
        <div class="page-container">
            <div class="templates-container">
                <adm-jumbotron
                    title="Email"
                    :desc="description"
                    illustration="email"
                    btnLabel="Create"
                    @btnClick="openWizardModal()"
                ></adm-jumbotron>
                <div class="main-container">
                    <div class="full-width">
                        <div class="section-content">
                            
                        </div>
                    </div>
                </div>
                <adm-wizard-modal
                    class="wizard-modal"
                    :isOpen="isWizardModalOpen"
                    id="1"
                    :title="'Select Template'"
                    @closeModal="closeWizardModal"
                    :sidebarData="systemEventsFiltered"
                    @selectItem="onCreateModalSelect"
                    @proceedClick="onCreateModalProceedClick"
                >
                    <template slot="sidebar">
                        <nitrozen-input
                            :showSearchIcon="true"
                            placeholder="Search template"
                            v-model="sidebarSearch"
                            @keyup="onSearchInputChange"
                            class="modal-search"
                        >
                        </nitrozen-input>
                    </template>
                    <template slot="body">
                        <div
                            v-if="selectedSystemEvent"
                            class="wizard-body-wrapper"
                        >
                            <div class="modal-body-title">
                                {{
                                    selectedSystemEvent.child.meta.template
                                        .email.template.name
                                }}
                            </div>
                            <div class="modal-body-description">
                                {{
                                    selectedSystemEvent.child.meta.template
                                        .email.template.description
                                }}
                            </div>
                            <div
                                v-if="
                                    selectedSystemEvent.child.meta._id ==
                                        'create-new'
                                "
                            >
                                <div class="editor-type-radio-group">
                                    <nitrozen-radio
                                        name="pageType"
                                        v-model="editor_type"
                                        radioValue="bee"
                                        title="HTML Editor - BEE Free"
                                    >
                                        HTML Editor - BEE Free
                                    </nitrozen-radio>
                                    <nitrozen-radio
                                        name="pageType"
                                        v-model="editor_type"
                                        radioValue="grapeJS"
                                        title="HTML Editor - GrapesJS"
                                    >
                                        HTML Editor - GrapesJS
                                    </nitrozen-radio>
                                    <nitrozen-radio
                                        name="pageType"
                                        v-model="editor_type"
                                        radioValue="rawhtml"
                                        title="Raw HTML"
                                    >
                                        Raw HTML
                                    </nitrozen-radio>
                                </div>
                                <div class="editor-type-details">
                                    <div>
                                        <img
                                            class="preview"
                                            :src="
                                                EDITOR_TYPE_DETAILS[editor_type]
                                                    .image
                                            "
                                        />
                                    </div>
                                    <div>
                                        <div class="modal-body-title">
                                            {{
                                                EDITOR_TYPE_DETAILS[editor_type]
                                                    .name
                                            }}
                                        </div>
                                        <div class="modal-body-description">
                                            <component
                                                :is="
                                                    EDITOR_TYPE_DETAILS[
                                                        editor_type
                                                    ].description
                                                "
                                            ></component>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <iframe
                                    ref="previewbody"
                                    class="preview-body"
                                ></iframe>
                            </div>
                        </div>
                    </template>
                </adm-wizard-modal>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// @import '../../less/page-ui.less';
// @import './../../less/page-header.less';
// @import './../../less/form.less';
.create-btn {
    float: right;
    margin-right: 70px;
    margin-top: 7px;
}
.page-container {
    margin: 24px;
    width: auto;
    @media @mobile {
        margin: 0;
    }
    .templates-container {
        width: 100%;
    }
}
.editor-type-radio-group {
    display: flex;
    height: 80px;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: 1px dashed @DustyGray;
    .nitrozen-radio-group {
        margin: 0 6px;
    }
}
.editor-type-details {
    display: flex;
    > div {
        flex: 1;
        padding: 24px;
    }
    img.preview {
        width: 100%;
    }
}
.preview-body {
    min-height: 300px;
    width: 100%;
    margin-top: 24px;
}
.wizard-modal {
    ::v-deep.modal-search {
        margin: 0px 6px 24px 6px;
        position: relative;
    }
    ::v-deep.modal-body-title {
        color: #212121;
        font-family: Inter;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 23px;
        margin-bottom: 12px;
    }
    ::v-deep.modal-body-description {
        color: #9b9b9b;
        font-family: Inter;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 20px;
    }
}

.main-container {
    background-color: @White;
    display: block;
    margin: 24px 0px;
    .settings {
        border-bottom: 1px solid @LightGray;
        width: 100%;
    }
    .full-width {
        width: 100%;
    }
    .menu {
        display: flex;
        justify-content: flex-start;
        // border-top: 1px dashed @Gray;
        background-color: @White;
        .menu-item {
            display: flex;
            justify-content: center;
            color: @Gray;
            a {
                margin-right: 30px;
                padding: 20px 0px 15px;
            }
            a.router-link-exact-active {
                color: @Mako;
                border-bottom: 3px solid @PurpleHeart;
            }
        }
    }
}
</style>

<script>
import loader from '@/components/common/loader.vue';
import pageerror from '@/components/common/page-error';
// import {
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
//     ADMIN_COMMS_FETCH_SYSTEM_EVENTS
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE
// } from '../../../../store/admin/mutation.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_TEMPLATES,
//     ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
//     ADMIN_COMMS_GET_SYSTEM_EVENTS,
//     GET_HELP_SECTION_DATA
// } from '../../../../store/admin/getters.type';
// import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenRadio
} from '@gofynd/nitrozen-vue';
import omitForClone from './services/omit-for-clone';
import admWizardModal from '@/components/common/adm-modal.vue';
import Jumbotron from '@/components/common/jumbotron';
import CommunicationServices from '../../../services/pointblank.service';
import nunjucks from 'nunjucks';
import cloneDeep from 'lodash/cloneDeep';
const EDITOR_TYPE_DETAILS = {
    bee: {
        name: 'BEE Free Editor',
        description: {
            template:
                '<div><span>For basic users</span><li>Now build more with less! Intuitively build templates using drag-and-drop elements like text, audio/video, buttons, HTML block and more.</li><li>Get multiple types of rows for any content and basic styling such as colour, dimensions, and padding for all the elements</li></div>'
        },
        image:
            'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587047806/production/platform/admin-panel/page-editor/bee-free-editor.jpg'
    },
    grapeJS: {
        name: 'GrapesJS Editor',
        description: {
            template:
                '<div><span>For advanced users</span><li>Use readily available drag-and-drop blocks to build any template with multiple styles (CSS). Easily manage layers and media files (assets).</li><li> Get all the content tools, forms and its components, along with extras like custom code, tooltips and many more.</li></div>'
        },
        image:
            'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587047567/production/platform/admin-panel/page-editor/grapesjs-editor.jpg'
    },
    rawhtml: {
        name: 'Raw HTML Editor',
        description: {
            template:
                '<p>Create a template using HTML, a conventionally used language that supports all the markup tags within angle brackets.</p>'
        },
        image:
            'https://res.cloudinary.com/dwzm9bysq/image/upload/v1587050182/production/platform/admin-panel/page-editor/rawhtml-editor.png'
    }
};
export default {
    components: {
        loader: loader,
        'page-error': pageerror,
        'nitrozen-button': NitrozenButton,
        'adm-jumbotron': Jumbotron,
        'adm-wizard-modal': admWizardModal,
        'nitrozen-input': NitrozenInput,
        'nitrozen-radio': NitrozenRadio
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            menus: [],
            description:
                'Use this section to create Email templates to be used in events, such as order placing and delivery. Use an in-built editor and sample variables to format the Email content. Also, preview and test the created Email template.',
            isWizardModalOpen: false,
            sidebarSearch: '',
            systemEventsData: [
  {
    "group": "Custom",
    "children": [
      {
        "name": "Create New",
        "meta": {
          "_id": "create-new",
          "template": {
            "email": {
              "template": {
                "_id": "create-new",
                "name": "Create New",
                "description": "Create your own custom template"
              }
            }
          }
        }
      }
    ]
  },
  {
    "group": "Signup & login",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.537Z",
          "__v": 0
        },
        "name": "Invite Event"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.570Z",
          "__v": 0
        },
        "name": "Verify Email"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "otp",
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
          "updated_at": "2022-05-20T10:00:46.585Z",
          "__v": 0
        },
        "name": "Verify Otp"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.548Z",
          "__v": 0
        },
        "name": "Reset Password"
      }
    ]
  },
  {
    "group": "Order Processing",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.840Z",
          "__v": 0
        },
        "name": "Online order placed "
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.773Z",
          "__v": 0
        },
        "name": "Pick at store order placed"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that their order is Confirmed.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad292292cd801c",
                "slug": "bag_confirmed-email",
                "name": "Online order confirmed",
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
                  "template": "{{subject_line}}\nHello {{name}},\nWoohoo! Your Order {{orderID}} Shipment {{shipmentID}} has been confirmed.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.313Z",
                "updated_at": "2022-05-16T07:51:28.313Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their order is confirmed",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29c47acd801d",
          "slug": "bag_confirmed-event",
          "event_name": "Bag Confirmed ",
          "created_at": "2022-05-16T07:51:28.329Z",
          "updated_at": "2022-05-16T07:51:28.329Z",
          "__v": 0
        },
        "name": "Bag Confirmed "
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that dp is assigned for their shipment.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad2979ddcd801e",
                "slug": "dp_assigned-email",
                "name": "DP assigned",
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
                  "template": "{{subject_line}}\nHello {{name}},\nYour Order {{orderID}} Shipment {{shipmentID}} has been assigned a delivery partner.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.586Z",
                "updated_at": "2022-05-16T07:51:28.586Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their shipment is assigned a Delivery Partner.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29d985cd801f",
          "slug": "dp_assigned-event",
          "event_name": "DP assigned",
          "created_at": "2022-05-16T07:51:28.595Z",
          "updated_at": "2022-05-16T07:51:28.595Z",
          "__v": 0
        },
        "name": "DP assigned"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that their order is in Transit.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad2923cccd8020",
                "slug": "in_transit-email",
                "name": "In transit",
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
                  "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your order {{orderID}} Shipment {{shipmentID}} is/are in Transit.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.678Z",
                "updated_at": "2022-05-16T07:51:28.678Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email template for notifying the customers, that their order is in transit.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29241acd8021",
          "slug": "in_transit-event",
          "event_name": "In Transit",
          "created_at": "2022-05-16T07:51:28.686Z",
          "updated_at": "2022-05-16T07:51:28.686Z",
          "__v": 0
        },
        "name": "In Transit"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.454Z",
          "__v": 0
        },
        "name": "Lost"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.529Z",
          "__v": 0
        },
        "name": "Picked"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.741Z",
          "__v": 0
        },
        "name": "Out for delivery"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.670Z",
          "__v": 0
        },
        "name": "Handed over to customer"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.651Z",
          "__v": 0
        },
        "name": "Delivered"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.755Z",
          "__v": 0
        },
        "name": "Out for pickup"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.347Z",
          "__v": 0
        },
        "name": "Return Dp Out for pickup"
      }
    ]
  },
  {
    "group": "Order Cancellation",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.545Z",
          "__v": 0
        },
        "name": "Cancelled by customer"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.562Z",
          "__v": 0
        },
        "name": "Cancelled by admin"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.636Z",
          "__v": 0
        },
        "name": "Delivery Attempt Failed"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.142Z",
          "__v": 0
        },
        "name": "Rejected by customer"
      }
    ]
  },
  {
    "group": "Order Return",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.432Z",
          "__v": 0
        },
        "name": "Initiated"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.238Z",
          "__v": 0
        },
        "name": "Accepted"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.459Z",
          "__v": 0
        },
        "name": "Request cancelled"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.254Z",
          "__v": 0
        },
        "name": "Return bag picked"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.331Z",
          "__v": 0
        },
        "name": "Bag picked up by delivery partner"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
        "name": "Return bag delivered"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.446Z",
          "__v": 0
        },
        "name": "Not accepted"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.470Z",
          "__v": 0
        },
        "name": "Order returning to origin"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
        "name": "Return DP Assigned"
      }
    ]
  },
  {
    "group": "Order Refund",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.937Z",
          "__v": 0
        },
        "name": "Initiated"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.855Z",
          "__v": 0
        },
        "name": "Completed"
      }
    ]
  }
],
            systemEventsFiltered: [
  {
    "group": "Custom",
    "children": [
      {
        "name": "Create New",
        "meta": {
          "_id": "create-new",
          "template": {
            "email": {
              "template": {
                "_id": "create-new",
                "name": "Create New",
                "description": "Create your own custom template"
              }
            }
          }
        }
      }
    ]
  },
  {
    "group": "Signup & login",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.537Z",
          "__v": 0
        },
        "name": "Invite Event"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.570Z",
          "__v": 0
        },
        "name": "Verify Email"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "otp",
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
          "updated_at": "2022-05-20T10:00:46.585Z",
          "__v": 0
        },
        "name": "Verify Otp"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.548Z",
          "__v": 0
        },
        "name": "Reset Password"
      }
    ]
  },
  {
    "group": "Order Processing",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.840Z",
          "__v": 0
        },
        "name": "Online order placed "
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.773Z",
          "__v": 0
        },
        "name": "Pick at store order placed"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that their order is Confirmed.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad292292cd801c",
                "slug": "bag_confirmed-email",
                "name": "Online order confirmed",
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
                  "template": "{{subject_line}}\nHello {{name}},\nWoohoo! Your Order {{orderID}} Shipment {{shipmentID}} has been confirmed.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.313Z",
                "updated_at": "2022-05-16T07:51:28.313Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their order is confirmed",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29c47acd801d",
          "slug": "bag_confirmed-event",
          "event_name": "Bag Confirmed ",
          "created_at": "2022-05-16T07:51:28.329Z",
          "updated_at": "2022-05-16T07:51:28.329Z",
          "__v": 0
        },
        "name": "Bag Confirmed "
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that dp is assigned for their shipment.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad2979ddcd801e",
                "slug": "dp_assigned-email",
                "name": "DP assigned",
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
                  "template": "{{subject_line}}\nHello {{name}},\nYour Order {{orderID}} Shipment {{shipmentID}} has been assigned a delivery partner.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "delivery_time": "",
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.586Z",
                "updated_at": "2022-05-16T07:51:28.586Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email or SMS template for notifying the customers, that their shipment is assigned a Delivery Partner.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29d985cd801f",
          "slug": "dp_assigned-event",
          "event_name": "DP assigned",
          "created_at": "2022-05-16T07:51:28.595Z",
          "updated_at": "2022-05-16T07:51:28.595Z",
          "__v": 0
        },
        "name": "DP assigned"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this email template for notifying the customers, that their order is in Transit.",
                "static_to": [],
                "static_cc": [],
                "static_bcc": [],
                "tags": [],
                "priority": "high",
                "published": true,
                "_id": "6282028064ad2923cccd8020",
                "slug": "in_transit-email",
                "name": "In transit",
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
                  "template": "{{subject_line}}\nHello {{name}},\nFollowing product(s) in your order {{orderID}} Shipment {{shipmentID}} is/are in Transit.\n{% for item in orderedItems %}\n{{item.item_brand}}\n{{item.item_name}}\nSize: {{item.item_size}}\n{{item.delivery_time}}&#8377;\n{{item.price_effective}}\n{% endfor %}\n\nSub Total {{sub_total}}{% if convenience_fee %}\n\nConvenience Fee {{convenience_fee}}{% endif %}\n\n{% if discount_coupon %} Coupon {{discount_coupon}}{% endif %}\n\n{% if delivery_charges %} Delivery Charges {{delivery_charges}}\n\n{% endif %} {% if cod_charges %} COD Charges {{cod_charges}}{% endif %}\n\n{% if you_saved %} You Saved {{you_saved}}{% endif %}\n\n{% if fynd_cash_referral %} Fynd Cash Referral {{fynd_cash_referral}}{% endif %}\n\n{% if fynd_cash_refund %} Fynd Cash Refund {{fynd_cash_refund}}\n\n{% endif %} Total &#8377; {{total}}Delivery Address\n\n{{delivery_address}}\n\nTrack Now#HappyFynding\nIt pays to have friends\nEarn upto &#8377; 10,000\nRefer & Earn This mail is intended only for {{user_email}}"
                },
                "template_variables": {
                  "name": "Azhar sayyed",
                  "orderId": "FY62600A06014E261131",
                  "shipmentId": "FY62600A06014E261131",
                  "orderedItems": [
                    {
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 2,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    },
                    {
                      "item_name": "SUGAR Cosmetics SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g",
                      "item_brand": "SUGAR Cosmetics",
                      "price_effective": "799.00",
                      "quantity": 1,
                      "item_size": "OS",
                      "item_image": "https://hdn-1.jiox0.de/jiox2/products/pictures/item/free/270x0/972354/gZPekymyto-1.png",
                      "item_image_link": "www.gofynd.com",
                      "marked_price": 799,
                      "discount": 0,
                      "sub_total": 799
                    }
                  ],
                  "sub_total": "799.00",
                  "convenience_fee": 11,
                  "discount_coupon": null,
                  "delivery_charges": null,
                  "cod_charges": 100,
                  "you_saved": 100,
                  "fynd_cash_referral": null,
                  "fynd_cash_refund": null,
                  "cashback_applied": 100,
                  "amount_paid": "512.00",
                  "total": "512.00",
                  "url": "https://www.jiomart.com/customer/orderhistory",
                  "customer_name": "Shweta",
                  "delivery_address": "azhar sayyed,  Fynd Wework Vijay Diamond,  Kondivita,  andheri east midc,  Mumbai,  400069",
                  "user_email": "shwetaayre@gofynd.com",
                  "refer_earn_link": "http://go.fyndi.ng/refer_earn",
                  "care_text": "We've got you covered here, but in case of any mess up, kindly drop a mail to care@fynd.com and we'll try our best to get your issue resolved.",
                  "payment_mode": "COD",
                  "brand_name": null,
                  "ordering_channel": "ECOMM",
                  "brand_logo_url": null,
                  "subject_line": "Your order FY62600A06014E261131 is in transit",
                  "title": "Your JioMart Order booked: ",
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
                      "secure_url": "https://hdn-1.jiox0.de/jiox2/company/2/applications/61bc34f2bf3c9b427acc0b54/application/pictures/free-logo/original/7kAZX4tIf-Tira.png"
                    }
                  },
                  "articles": "SUGAR Cosmetics SUGAR X Wonder Woman Everlasting Matte Lipstick - 04 Power (Coral Pink/Peach), 3.2 g"
                },
                "headers": [],
                "attachments": [],
                "created_at": "2022-05-16T07:51:28.678Z",
                "updated_at": "2022-05-16T07:51:28.678Z",
                "__v": 0
              }
            },
            "sms": {
              "provider_type": "transaction",
              "template": null
            },
            "pushnotification": {
              "template": null
            }
          },
          "descriptions": "Select an email template for notifying the customers, that their order is in transit.",
          "enabled": true,
          "editable": true,
          "group": "Order Processing",
          "channels": [
            "email"
          ],
          "priority": 1,
          "_id": "6282028064ad29241acd8021",
          "slug": "in_transit-event",
          "event_name": "In Transit",
          "created_at": "2022-05-16T07:51:28.686Z",
          "updated_at": "2022-05-16T07:51:28.686Z",
          "__v": 0
        },
        "name": "In Transit"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.454Z",
          "__v": 0
        },
        "name": "Lost"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.529Z",
          "__v": 0
        },
        "name": "Picked"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.741Z",
          "__v": 0
        },
        "name": "Out for delivery"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.670Z",
          "__v": 0
        },
        "name": "Handed over to customer"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.651Z",
          "__v": 0
        },
        "name": "Delivered"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.755Z",
          "__v": 0
        },
        "name": "Out for pickup"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.347Z",
          "__v": 0
        },
        "name": "Return Dp Out for pickup"
      }
    ]
  },
  {
    "group": "Order Cancellation",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.545Z",
          "__v": 0
        },
        "name": "Cancelled by customer"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.562Z",
          "__v": 0
        },
        "name": "Cancelled by admin"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.636Z",
          "__v": 0
        },
        "name": "Delivery Attempt Failed"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.142Z",
          "__v": 0
        },
        "name": "Rejected by customer"
      }
    ]
  },
  {
    "group": "Order Return",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.432Z",
          "__v": 0
        },
        "name": "Initiated"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.238Z",
          "__v": 0
        },
        "name": "Accepted"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.459Z",
          "__v": 0
        },
        "name": "Request cancelled"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.254Z",
          "__v": 0
        },
        "name": "Return bag picked"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.331Z",
          "__v": 0
        },
        "name": "Bag picked up by delivery partner"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
        "name": "Return bag delivered"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.446Z",
          "__v": 0
        },
        "name": "Not accepted"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.470Z",
          "__v": 0
        },
        "name": "Order returning to origin"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
        "name": "Return DP Assigned"
      }
    ]
  },
  {
    "group": "Order Refund",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.937Z",
          "__v": 0
        },
        "name": "Initiated"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.855Z",
          "__v": 0
        },
        "name": "Completed"
      }
    ]
  }
],
            selectedSystemEvent: null,
            editor_type: 'bee',
            messagePreview: '',
            EDITOR_TYPE_DETAILS,
            ORDER: null
        };
    },
    computed: {
        // getBreadCrumb() {
        //     let arr = [];
        //     arr.push({
        //         display: 'Communication',
        //         link: '/admin/'
        //     });
        //     arr.push({
        //         display: this.$route.meta.name,
        //         link: this.$router.path
        //     });
        //     return arr;
        // },
        // ...mapGetters({
        //     appSubscriptions: ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
        //     systemEvents: ADMIN_COMMS_GET_SYSTEM_EVENTS,
        //     helpData: GET_HELP_SECTION_DATA,
        //     emailTemplatesStore: ADMIN_COMMS_GET_EMAIL_TEMPLATES
        // }),
        // jumbotronData() {
        //     if (this.helpData && this.helpData.length) {
        //         return this.helpData.find(it => {
        //             return this.$route.path.includes(it.path);
        //         });
        //     }
        // }
    },
    mounted() {
        // this.$router.replace({
        //     name: 'email-listing',
        //     query: { ...this.$route.query }
        // }).catch(() => {});
        // Promise.all([this.fetchEventsOrder(), this.fetchSystemEvents()]).then(
        //     () => {
                let system_events = [
                    {
                        group: 'Custom',
                        children: [
                            {
                                name: 'Create New',
                                meta: {
                                    _id: 'create-new',
                                    template: {
                                        email: {
                                            template: {
                                                _id: 'create-new',
                                                name: 'Create New',
                                                description:
                                                    'Create your own custom template'
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ];
                this.systemEvents.forEach(systemEvent => {
                    if (systemEvent.group) {
                        let foundSystemEvent = system_events.find(
                            s => s.group == systemEvent.group
                        );
                        if (!foundSystemEvent) {
                            let obj = {
                                group: systemEvent.group,
                                children: [
                                    {
                                        meta: systemEvent,
                                        name: systemEvent.event_name
                                    }
                                ]
                            };
                            system_events.push(obj);
                        } else {
                            foundSystemEvent.children.push({
                                meta: systemEvent,
                                name: systemEvent.event_name
                            });
                        }
                    }
                });
                this.system_events = system_events;
                let selectedSystemEvent = {
                    group: system_events[0].group,
                    child: system_events[0].children[0]
                };
                let first = this.system_events.slice(0, 1);
                let events = this.system_events.slice(1);
                events = this.sortSystemEventTabs(events);
                this.systemEventsData = [...first, ...events];
                this.systemEventsFiltered = this.systemEventsData;
                this.selectedSystemEvent = selectedSystemEvent;
        //     }
        // );
    },
    // updated() {
    //     this.$router.replace({
    //         name: 'email-listing',
    //         query: { ...this.$route.query }
    //     }).catch(() => {});
    //     if (this.$refs['previewbody']) {
    //         let iframe = this.$refs['previewbody'];
    //         var iframedoc =
    //             iframe.contentDocument || iframe.contentWindow.document;
    //         iframedoc.body.innerHTML = this.messagePreview;
    //     }
    // },
    methods: {
        fetchEventsOrder() {
            return CommunicationServices.getEventsOrder().then(({ data }) => {
                this.ORDER = data;
            })
        },
        fetchSystemEvents() {
            // return this.$store.dispatch(ADMIN_COMMS_FETCH_SYSTEM_EVENTS, {
            //     params: {
            //         page_size: 200,
            //         page_no: 1,
            //         populate: ['template.email.template'],
            //         query: JSON.stringify({
            //             'template.email.template': {
            //                 $nin: [null]
            //             }
            //         })
            //     }
            //});
        },
        sortSystemEventTabs(system_events) {
            let systemEventsArr = [];
            system_events.forEach((sub, i) => {
                let systemEvent = cloneDeep(sub);
                systemEvent.children.sort((a, b) => {
                    return a.meta.priority - b.meta.priority;
                });
                systemEventsArr[this.ORDER[systemEvent.group]] = systemEvent;
            });

            return systemEventsArr.filter(a => a);
        },
        onSearchInputChange(e) {
            let value = e.target.value;
            let system_events = cloneDeep(this.systemEventsData);
            if (value != '') {
                let filtered = [];
                system_events.forEach(system_event => {
                    let children = system_event.children.filter(child => {
                        return (
                            child.name
                                .toLowerCase()
                                .indexOf(value.toLowerCase()) > -1
                        );
                    });
                    system_event.children = children;
                    if (children.length > 0) {
                        filtered.push(system_event);
                    }
                });
                this.systemEventsFiltered = filtered;
            } else {
                this.systemEventsFiltered = system_events;
            }
        },
        renderMessageTemplate(emailTemplate) {
            if (emailTemplate._id == 'create-new') {
                this.messagePreview = '';
            } else {
                let template = '';
                let templateValid = true;
                if (emailTemplate.html.template_type == 'nunjucks') {
                    try {
                        template = nunjucks.compile(
                            emailTemplate.html.template
                        );
                        template = template.render(
                            emailTemplate.template_variables
                        );
                    } catch (err) {
                        templateValid = false;
                        this.messagePreview = 'Invalid email template';
                    }
                } else {
                    template = emailTemplate.html.template.value;
                }
                if (templateValid) {
                    this.messagePreview = template;
                }
            }
        },
        onCreateModalProceedClick(id, item) {
            this.selectedSystemEvent = item;
            let emailTemplate = this.selectedSystemEvent.child.meta.template
                .email.template;
            let emailTemplateForClone = omitForClone(emailTemplate);
            // if (emailTemplate._id == 'create-new') {
            //     setTimeout(() => {
            //         this.$router.push({
            //         name: 'create-email-template',
            //         query: {
            //             editor_type: this.editor_type
            //         }
            //     }).catch({}); 
            //     }, 0);
            // } else {
            //     this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE, {
            //         data: emailTemplateForClone
            //     });
                 setTimeout(() => {
                this.$router.push({
                    name: 'emailtemplateCreate',
                    query: {
                        clone: emailTemplate._id
                    }
                }).catch({});
                 }, 0)
            // }
        },
        onCreateModalSelect(id, item) {
            this.selectedSystemEvent = item;
            this.renderMessageTemplate(
                this.selectedSystemEvent.child.meta.template.email.template
            );
        },
        fetchAppEventSubscriptions() {
            // return this.$store.dispatch(
            //     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
            //     {
            //         params: {
            //             page_size: 200,
            //             page_no: 1,
            //             populate: ['event', 'template.email.template'],
            //             query: JSON.stringify({
            //                 'template.email.template': {
            //                     $nin: [null]
            //                 }
            //             })
            //         }
            //     }
            // );
        },
        openWizardModal() {
            this.isWizardModalOpen = true;
        },
        closeWizardModal(id) {
            //this.isWizardModalOpen = false;
        }
    }
};
</script>
