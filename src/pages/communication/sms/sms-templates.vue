<template>
    <div class="panel">
        <div class="page-container">
            <div class="templates-container">
                <adm-jumbotron
                    title="SMS"
                    desc="Use this section to create SMS templates to be used in events, such as order placing and delivery. Format the SMS content, by using sample variables. Also, decide the SMS priority and test the created SMS template."
                    btnLabel="Create"
                    illustration="sms"
                    @btnClick="openWizardModal()"
                ></adm-jumbotron>
                <div class="main-container">
                    <div class="full-width">
                        <div class="section-content">
                            
                        </div>
                    </div>
                </div>
                <adm-modal
                    :isOpen="isWizardModalOpen"
                    id="1"
                    :title="'Select Template'"
                    @closeModal="closeWizardModal"
                    :sidebarData="systemEventsFiltered"
                    @selectItem="onCreateModalSelect"
                    @proceedClick="onCreateModalProceedClick"
                    class="wizard-modal"
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
                                    selectedSystemEvent.child.meta.template.sms
                                        .template.name
                                }}
                            </div>
                            <div class="modal-body-description">
                                {{
                                    selectedSystemEvent.child.meta.template.sms
                                        .template.description
                                }}
                            </div>
                            <div
                                v-if="messagePreview"
                                class="modal-preview-container"
                            >
                                <div class="nitrozen-label">Preview</div>
                                <div
                                    class="preview modal-body-description"
                                    v-html="messagePreview"
                                ></div>
                            </div>
                        </div>
                    </template>
                </adm-modal>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>

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
        margin-bottom: 18px;
    }
    ::v-deep.modal-body-description {
        color: #9b9b9b;
        font-family: Inter;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 20px;
    }
    ::v-deep.modal-preview-container {
        margin-top: 24px;
    }
    ::v-deep.preview {
        margin-top: 18px;
        color: black;
        font-family: Inter;
        border: 1px solid #e4e5e6;
        padding: 24px;
        font-weight: 100;
        background: #f9f9f9;
    }
    // ::v-deep.wizard-body-wrapper {
    // }
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
import loader from '@/components/common/loader';
import pageerror from '@/components/common/page-error';
import nunjucks from 'nunjucks';
// import {
//     ADMIN_COMMS_FETCH_SMS_TEMPLATES,
//     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
//     ADMIN_COMMS_FETCH_SYSTEM_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_SYSTEM_EVENTS
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_SMS_TEMPLATES,
//     ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS,
//     ADMIN_COMMS_GET_SYSTEM_EVENTS,
//     GET_HELP_SECTION_DATA
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_RESET_SMS_TEMPLATE,
//     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE
// } from './../../../../store/admin/mutation.type';
import omitForClone from './services/omit-for-clone';
//import { mapGetters } from 'vuex';
//import { detectFPApp, detectMobileWidth } from '@/helper/utils';
import { NitrozenButton, flatBtn, NitrozenInput } from '@gofynd/nitrozen-vue';
import Jumbotron from '@/components/common/jumbotron';
import admModal from '@/components/common/adm-modal.vue';
import SmsTemplateListing from './sms-template-listing.vue'
// import * as _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
//import AdminCommsService from '../../../../services/admin/admin-comms.service';

export default {
    name: "sms-template-main",
    components: {
        
        loader: loader,
        'page-error': pageerror,
        'nitrozen-button': NitrozenButton,
        'adm-jumbotron': Jumbotron,
        'adm-modal': admModal,
        'nitrozen-input': NitrozenInput,
        "sms-template-listing": SmsTemplateListing
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            menus: [],
            description:
                'Use this section to create SMS templates to be used in events, such as order placing and delivery. Format the SMS content, by using sample variables. Also, decide the SMS priority and test the created SMS template.',
            isWizardModalOpen: false,
            sidebarSearch: '',
            systemEventsData: [],
            systemEventsFiltered: [
  {
    "group": "Custom",
    "children": [
      {
        "name": "Create New",
        "meta": {
          "_id": "create-new",
          "template": {
            "sms": {
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
              "template": "611212f186414775f63dfcc6"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "611212f18641474f083dfcca"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "611212f18641471d573dfccd"
            },
            "sms": {
              "provider_type": "transaction",
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
              "provider_type": "otp",
              "template": null
            },
            "sms": {
              "provider_type": "otp",
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
          "updated_at": "2022-05-20T10:00:46.557Z",
          "__v": 0
        },
        "name": "Send Otp"
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
              "template": "610d08520b266a3180ae8a68"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "61654c618fd0c474b8d04e53"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this SMS template, for notifying the customers, that their requested order has arrived at the store.",
                "priority": "low",
                "tags": [],
                "published": true,
                "_id": "610d08520b266af53dae8a4c",
                "slug": "arrived_at_store-sms",
                "name": "Order Arrived at Store",
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
                "created_at": "2021-08-06T10:00:50.470Z",
                "updated_at": "2021-08-06T10:00:50.470Z",
                "__v": 0
              }
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
          "updated_at": "2022-05-20T10:00:45.382Z",
          "__v": 0
        },
        "name": "Arrived at store"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61a97b963d167fd41b94"
            },
            "sms": {
              "provider_type": "transaction",
              "template": {
                "is_system": true,
                "is_internal": false,
                "description": "Use this SMS template, for notifying the customers, that their requested order is lost.",
                "priority": "low",
                "tags": [],
                "published": true,
                "_id": "610d08520b266a8aabae8a4e",
                "slug": "bag_lost-sms",
                "name": "Order Lost",
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
                "created_at": "2021-08-06T10:00:50.483Z",
                "updated_at": "2022-03-29T07:07:56.451Z",
                "__v": 0
              }
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
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.466Z",
          "__v": 0
        },
        "name": "Packed"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "621c61a97b963d442cd41b95"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.437Z",
          "__v": 0
        },
        "name": "Arriving Early Sms"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:45.572Z",
          "__v": 0
        },
        "name": "Delay Delivery Sms"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": "610d08520b266a7a81ae8a62"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "61654c618fd0c4075cd04e52"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a3c53ae8a5d"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a9163ae8a65"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "621c61a97b963d6d73d41b96"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a2392ae8a54"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a8282ae8a57"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266ac46aae8a5a"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a2347ae8a71"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a2376ae8a7f"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a0e6eae8a74"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08530b266a0474ae8a85"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a1599ae8a77"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a62d3ae8a7a"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "6282028164ad29cf22cd8022"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08530b266a489fae8a82"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "621c61aa7b963d69e0d41b97"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "6282028164ad29d44fcd8025"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a71f4ae8a6e"
            },
            "sms": {
              "provider_type": "transaction",
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
              "template": "610d08520b266a46e8ae8a6b"
            },
            "sms": {
              "provider_type": "transaction",
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
  },
  {
    "group": "Rewards",
    "children": [
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.634Z",
          "__v": 0
        },
        "name": "Reffered friend"
      },
      {
        "meta": {
          "template": {
            "email": {
              "provider_type": "transaction",
              "template": null
            },
            "sms": {
              "provider_type": "transaction",
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
          "updated_at": "2022-05-20T10:00:46.642Z",
          "__v": 0
        },
        "name": "Referrer"
      }
    ]
  }
],
            selectedSystemEvent: null,
            messagePreview: '',
            ORDER: null
        };
    },
    computed: {

    },
    updated() {
        // this.$router.replace({
        //     name: 'sms-listing',
        //     query: { ...this.$route.query }
        // }).catch(() => {});
    },
    mounted() {
    //     this.$router.replace({
    //         name: 'sms-listing',
    //         query: { ...this.$route.query }
    //     }).catch(() => {});
    //     Promise.all([this.fetchEventsOrder(), this.fetchSystemEvents()]).then(
    //         () => {
    //             let system_events = [
    //                 {
    //                     group: 'Custom',
    //                     children: [
    //                         {
    //                             name: 'Create New',
    //                             meta: {
    //                                 _id: 'create-new',
    //                                 template: {
    //                                     sms: {
    //                                         template: {
    //                                             _id: 'create-new',
    //                                             name: 'Create New',
    //                                             description:
    //                                                 'Create your own custom template'
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     ]
    //                 }
    //             ];
    //             this.systemEvents.forEach(systemEvent => {
    //                 if (systemEvent.group) {
    //                     let foundSystemEvent = system_events.find(
    //                         s => s.group == systemEvent.group
    //                     );
    //                     if (!foundSystemEvent) {
    //                         let obj = {
    //                             group: systemEvent.group,
    //                             children: [
    //                                 {
    //                                     meta: systemEvent,
    //                                     name: systemEvent.event_name
    //                                 }
    //                             ]
    //                         };
    //                         system_events.push(obj);
    //                     } else {
    //                         foundSystemEvent.children.push({
    //                             meta: systemEvent,
    //                             name: systemEvent.event_name
    //                         });
    //                     }
    //                 }
    //             });
    //             this.system_events = system_events;
    //             let selectedSystemEvent = {
    //                 group: system_events[0].group,
    //                 child: system_events[0].children[0]
    //             };
    //             let first = this.system_events.slice(0, 1);
    //             let events = this.system_events.slice(1);
    //             events = this.sortSystemEventTabs(events);
    //             this.systemEventsData = [...first, ...events];
    //             this.systemEventsFiltered = this.systemEventsData;
    //             this.selectedSystemEvent = selectedSystemEvent;
    //         }
    //     );
     },
    methods: {
        fetchEventsOrder() {
            // return AdminCommsService.fetchEventsOrder().then(({ data }) => {
            //     this.ORDER = data;
            // });
        },
        fetchSystemEvents() {
            // return this.$store.dispatch(ADMIN_COMMS_FETCH_SYSTEM_EVENTS, {
            //     params: {
            //         page_size: 200,
            //         page_no: 1,
            //         populate: ['template.sms.template'],
            //         query: JSON.stringify({
            //             'template.sms.template': {
            //                 $nin: [null]
            //             }
            //         })
            //     }
            // });
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
        urlify(text) {
            let output = text;
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            output = output.replace(urlRegex, function(url) {
                return `<a style="color:#2E31BE;" target="_blank" href="${url}">${url}</a>`;
            });
            var emailRegex = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;
            output = output.replace(emailRegex, function(email) {
                return `<a style="color:#2E31BE;" target="_blank" href="mailto:${email}">${email}</a>`;
            });
            return output;
        },
        onSearchInputChange(e) {
            console.log(e);
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
        renderMessageTemplate(smsTemplate) {
            if (smsTemplate._id == 'create-new') {
                this.messagePreview = '';
            } else {
                let template = '';
                let templateValid = true;
                if (smsTemplate.message.template_type == 'nunjucks') {
                    try {
                        template = nunjucks.compile(
                            smsTemplate.message.template
                        );
                        template = template.render(
                            smsTemplate.template_variables
                        );
                    } catch (err) {
                        templateValid = false;
                        this.messagePreview = 'Invalid message template';
                    }
                } else {
                    template = smsTemplate.message.template.value;
                }
                if (templateValid) {
                    this.messagePreview = this.urlify(template);
                }
            }
        },
        onCreateModalProceedClick(id, item) {
            this.selectedSystemEvent = item;
            let smsTemplate = this.selectedSystemEvent.child.meta.template.sms
                .template;
            console.log(JSON.stringify(smsTemplate))
            let smsTemplateForClone = omitForClone(smsTemplate);
            if (smsTemplate._id == 'create-new') {
                setTimeout(() => {
                this.$router.push({
                    name: 'create-sms-template',
                    query: {}
                });
                }, 0)
            } else {
                this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE, {
                    data: smsTemplateForClone
                });
                setTimeout(() => {
                this.$router.push({
                    name: 'create-sms-template',
                    query: { clone: smsTemplate._id }
                });
                }, 0)
            }
        },
        onCreateModalSelect(id, item) {
            this.selectedSystemEvent = item;
            this.renderMessageTemplate(
                this.selectedSystemEvent.child.meta.template.sms.template
            );
        },
        fetchAppEventSubscriptions() {
            // return this.$store.dispatch(
            //     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION,
            //     {
            //         params: {
            //             page_size: 200,
            //             page_no: 1,
            //             populate: ['event', 'template.sms.template'],
            //             query: JSON.stringify({
            //                 'template.sms.template': {
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
