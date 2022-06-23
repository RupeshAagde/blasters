<template>
    <div class="panel">
        <div class="page-container">
            <div class="templates-container">
                <adm-jumbotron
                    title="SMS"
                    desc="Use this section to create SMS templates to be used in events, such as order placing and delivery. Format the SMS content, by using sample variables. Also, decide the SMS priority and test the created SMS template."
                    btnLabel="Create"
                    illustration="sms"
                    @btnClick="openWizardModal"
                ></adm-jumbotron>
                <div class="main-container">
                    <div class="full-width">
                        <div class="section-content">
                            <sms-template-listing>
                            </sms-template-listing>
                        </div>
                    </div>
                </div>
                <adm-modal
                    :isOpen="isWizardModalOpen"
                    id="1"
                    :title="'Select Template'"
                    :sidebarData="systemEventsFiltered"
                    @selectItem="onCreateModalSelect"
                    @proceedClick="onCreateModalProceedClick"
                    @closeModal="closeWizardModal"
                    ref="create-dialog"
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
import CommunicationServices from '../../../services/pointblank.service';
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
            systemEventsFiltered: [],
            selectedSystemEvent: null,
            messagePreview: '',
            ORDER: null,
            appSubscriptions: {},
            systemEvents: [],
            //helpData: GET_HELP_SECTION_DATA,
            smsTemplates: {},
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
        Promise.all([this.fetchEventsOrder(), this.fetchSystemEvents()]).then(
            () => {
                let system_events = [
                    {
                        group: 'Custom',
                        children: [
                            {
                                name: 'Create New',
                                meta: {
                                    _id: 'create-new',
                                    template: {
                                        sms: {
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
            }
        );
     },
    methods: {
        fetchEventsOrder() {
            return CommunicationServices.getEventsOrder().then(({ data }) => {
                this.ORDER = data;
            })
        },
        fetchSystemEvents() {
            return CommunicationServices.getSystemEvents(
                {
                    page_size: 200,
                    page_no: 1,
                    populate: ['template.sms.template'],
                    query: JSON.stringify({
                        'template.sms.template': {
                            $nin: [null]
                        }
                    })
                }
            ).then(({ data }) => {
                this.systemEvents = data.items;
            })
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
            let smsTemplateForClone = omitForClone(smsTemplate);
            if (smsTemplate._id == 'create-new') {
                setTimeout(() => {
                this.$router.push({
                    name: 'smstemplateCreate',
                    query: {}
                });
                }, 0)
            } else {
                // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE, {
                //     data: smsTemplateForClone
                // });
                setTimeout(() => {
                this.$router.push({
                    name: 'smstemplateCreate',
                    query: { clone: smsTemplate._id }
                });
                }, 0)
            }
        },
        onCreateModalSelect(id, item) {
            console.log("meta.template",item);
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
            return CommunicationServices.getEventSubscription({
                        page_size: 200,
                        page_no: 1,
                        populate: [
                            'event',
                            'template.sms.template',
                            'template.email.template'
                        ]
                    }).then(({ data }) => {
                this.appSubscriptions = data;
            })

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
