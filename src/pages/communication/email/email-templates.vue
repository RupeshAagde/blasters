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
                            <email-template-listing>
                            </email-template-listing>
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
    ::v-deep .modal-search {
        margin: 0px 6px 24px 6px;
        position: relative;
    }
    ::v-deep .modal-body-title {
        color: #212121;
        font-family: Inter;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 23px;
        margin-bottom: 12px;
    }
    ::v-deep .modal-body-description {
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
import EmailTemplateListing from './email-template-listing.vue'
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
        'nitrozen-radio': NitrozenRadio,
        "email-template-listing": EmailTemplateListing
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
            systemEventsData: [],
            systemEventsFiltered: [],
            selectedSystemEvent: null,
            editor_type: 'bee',
            messagePreview: '',
            EDITOR_TYPE_DETAILS,
            ORDER: null,
            systemEvents: [],
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
            }
        );
    },
    updated() {
    //     this.$router.replace({
    //         name: 'email-listing',
    //         query: { ...this.$route.query }
    //     }).catch(() => {});
         if (this.$refs['previewbody']) {
             let iframe = this.$refs['previewbody'];
             var iframedoc =
                 iframe.contentDocument || iframe.contentWindow.document;
             iframedoc.body.innerHTML = this.messagePreview;
         }
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
                    populate: ['template.email.template'],
                    query: JSON.stringify({
                        'template.email.template': {
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
            if (emailTemplate._id == 'create-new') {
                setTimeout(() => {
                    this.$router.push({
                    name: 'emailtemplateCreate',
                    query: {
                        editor_type: this.editor_type
                    }
                }).catch({}); 
                }, 0);
            } else {
                // this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE, {
                //     data: emailTemplateForClone
                // });
                 setTimeout(() => {
                this.$router.push({
                    name: 'emailtemplateCreate',
                    query: {
                        clone: emailTemplate._id
                    }
                }).catch({});
                 }, 0)
            }
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
        closeWizardModal() {
             this.isWizardModalOpen = false;
        }
    }
};
</script>
