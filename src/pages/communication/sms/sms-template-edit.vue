<template>
    <div class="panel">
        <div class="main">
            <loader v-if="pageLoading" class="loading"></loader>
            <div class="form page-container" v-if="!pageLoading">
                <div class="form-container">
                    <div class="details">Details</div>
                    <div class="form-field">
                        <nitrozen-input
                            placeholder="Enter Title"
                            v-model="data.name.value"
                            :label="'Title *'"
                            :disabled="systemDisableEdit"
                            v-on:keyup="trimTitleBy100"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.name.showerror"
                            >{{ data.name.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="form-field" v-if="isEditMode">
                        <nitrozen-input
                            v-model="slug"
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
                            :disabled="systemDisableEdit"
                            v-on:keyup="trimLengthMoreThan100()"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.description.showerror"
                            >{{ data.description.errortext }}
                        </nitrozen-error>
                    </div>

                    <div>
                        <div class="nitrozen-label">Priority *</div>
                        <div class="priority-radio-container">
                            <nitrozen-radio
                                :radioValue="'low'"
                                :id="'low'"
                                v-model="data.priority.value"
                                class="radio-btn-gap"
                                :name="'priority'"
                                :disabled="systemDisableEdit"
                                >Low</nitrozen-radio
                            >

                            <nitrozen-radio
                                :radioValue="'high'"
                                v-model="data.priority.value"
                                :id="'high'"
                                class="radio-btn-gap"
                                :name="'priority'"
                                :disabled="systemDisableEdit"
                                >High</nitrozen-radio
                            >
                            <nitrozen-error v-if="data.priority.showerror"
                                >{{ data.priority.errortext }}
                            </nitrozen-error>
                        </div>
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
                    <div class="form-field">
                        <nitrozen-input
                            placeholder="Enter DLT template id"
                            v-model="data.template_id.value"
                            :label="'DLT template id'"
                        >
                        </nitrozen-input>
                        <nitrozen-error v-if="data.template_id.showerror"
                            >{{ data.template_id.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
            </div>
            <div
                class="form page-container link-event-wrapper"
                v-if="
                    !pageLoading &&
                        !(
                            smsTemplateToClone &&
                            smsTemplateToClone.is_system &&
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

<style lang="less" scoped>

.accordion-container {
    /deep/.title {
        font-size: 18px;
    }
}
.link-event-wrapper {
    margin: 24px;
    width: 84.5%;
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
        border: 1px solid @WhiteSmoke;
        border-radius: 4px;
        background-color: @White;
        @media @mobile {
            margin-right: 0;
        }
        .details {
            color: @Mako;
            font-weight: bold;
            font-size: 18px;
            line-height: 27px;
            text-align: left;
            margin-bottom: 24px;
        }
    }
    .radio-btn-gap {
        margin-right: 20px;
    }
    .nitrozen-label {
        color: #9b9b9b;
        font-family: Inter, sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 21px;
    }
    .priority-radio-container {
        display: flex;
    }
    .inner-container {
        padding-left: 10px;
        padding-right: 10px;
    }
    .size-18 {
        font-size: 18px;
    }
    .form-field {
        margin-bottom: 24px;
        .link-to-event {
            margin-top: 24px;
        }
    }
    /deep/ .half-width {
        width: 48%;
        display: inline-flex;
    }
    .float-right {
        float: right;
    }
    .save-btn-container {
        margin-top: 15px;
    }
    .position-relative {
        position: relative;
    }
    .form-error {
        color: #ee485d;
    }
    .form-error-priority {
        position: absolute;
        bottom: 15px;
    }
    .tags-container {
        margin-top: 24px;
        /deep/label {
            font-size: 12px;
        }
    }
    /deep/.nitrozen-dropdown-container
        .nitrozen-option
        .nitrozen-checkbox-container {
        height: auto;
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
</style>

<script>
import loader from '@/components/common/loader';
import uktoops from '@/components/common/adm-oops.vue';
import uktselect from '@/components/common/ukt-select.vue';
import accordion from '@/components/common/accordion.vue';
import admforminput from '@/components/common/form-input.vue';
import admChip from '@/components/common/adm-chip.vue';
import admradiogroup, {
    ALIGN
} from '@/components/common/adm-radio-group.vue';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
// import * as _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

// import {
//     ADMIN_COMMS_FETCH_SMS_TEMPLATE,
//     ADMIN_COMMS_CREATE_SMS_TEMPLATE_FORM,
//     ADMIN_COMMS_UPDATE_SMS_TEMPLATE_FORM,
//     ADMIN_COMMS_FETCH_APP_EVENT_SUBSCRIPTION
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_SMS_TEMPLATE,
//     ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_SMS_TEMPLATE,
//     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE
// } from '../../../../store/admin/mutation.type';
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    NitrozenRadio,
    NitrozenInline,
    NitrozenChips,
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import CommunicationServices from '../../../services/pointblank.service';
import { Promise } from 'q';
import adminlinesvg from '@/components/common/adm-inline-svg';
import hash from 'object-hash';
import uktModal from '@/components/common/utk-modal.vue';
export default {
    components: {
        loader: loader,
        accordion,
        'ukt-oops': uktoops,
        'ukt-select': uktselect,
        'adm-radio-group': admradiogroup,
        'adm-form-input': admforminput,
        'adm-chip': admChip,
        'adm-inline-svg': adminlinesvg,
        uktinlinesvg,
        'ukt-modal': uktModal,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'nitrozen-dropdown': NitrozenDropdown
    },
    directives: {
        flatBtn
    },

    data() {
        return {
            pageLoading: false,
            pageError: false,
            id: null,
            MAX_DESCRIPTION_CHAR_LIMIT: 100,
            linkToEvent: null,
            title: this.$route.meta.title,
            slug: '',
            subscriptions: [],
            subscriptionsFiltered: [],
            formFieldNames: ['name', 'description', 'priority', 'tags','template_id'],
            priorityOptions: [
                { value: 'low', display: 'low' },
                { value: 'high', display: 'high' }
            ],
            chipInput: '',
            subscribedAdded: [],
            subscribedRemoved: [],
            tags: [],
            meta: {},
            data: {
                name: this.getInitialValue(),
                description: this.getInitialValue(),
                priority: { value: 'low', display: 'low' },
                template_id: this.getInitialValue()
            },
            initialHash: '',
            showEventLinkingModal: false,
            smsTemplateToClone : {},
            appSubscriptions: {},
            smsTemplateStore:{}
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
        ,
        templateData : {
            type: Object,
            default: false
        }
    },
    computed: {
        getBreadCrumb() {
            return [];
        },
        ALIGN() {
            return ALIGN;
        },
        ...mapGetters({
            // smsTemplateStore: ADMIN_COMMS_GET_SMS_TEMPLATE,
            // smsTemplateToClone: ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE,
            // appSubscriptions: ADMIN_COMMS_GET_APP_EVENT_SUBSCRIPTIONS
        })
    },
    mounted() {
        let data = {};
        Promise.all([this.fetchAppEventSubscriptions(), this.fetchSmsTemplates()]).then(
            ()=>{
              try {
            if (this.isCloneMode) {
                data = cloneDeep(this.templateData);
                this.meta = {
                    type: 'cloned',
                    template: data._id,
                    is_system: data.is_system
                };
            } else {
                console.log('tem',this.smsTemplateStore);
                data = this.templateData;
            }
            let obj = {};
             if (data.slug) {
                this.slug = data.slug;
            }
            this.formFieldNames.forEach(key => {
                if (
                    key == 'tags' &&
                    data[key] &&
                    typeof (data[key] == 'object' && Array.isArray(data[key]))
                ) {
                    this.tags = data[key].map(val => {
                        return {
                            name: val
                        };
                    });
                } else {
                    obj[key] = this.getInitialValue(data[key]);
                }
            });
            //this.data.name.value = this.smsTemplateStore.name
            //obj['priority'] = data.priority.value
            this.data = { ...this.data, ...obj };

           
                let groupNames = this.appSubscriptions.items.map(
                    appSubscription => appSubscription.event.group
                );

                // extract unique group names
                groupNames = Array.from(new Set(groupNames));

                if (this.templateId) {
                    this.subscribedAdded = this.appSubscriptions.items.filter(
                        subscription => {
                     if(subscription.template.sms.template && subscription.template.sms.template._id != null){
                            return (
                                subscription.template.sms.template._id ==
                                this.templateId
                            );
                        }    
                        }
                    );
                    this.linkToEvent = this.subscribedAdded.map(a => a._id);
                } else if (
                    this.$route.query.clone &&
                    this.smsTemplateToClone &&
                    this.smsTemplateToClone.is_system
                ) {
                    this.subscribedAdded = this.appSubscriptions.items.filter(
                        subscription => {
                            return (
                                subscription.event.template.sms.template ==
                                this.$route.query.clone
                            );
                        }
                    );
                    this.linkToEvent = this.subscribedAdded.map(a => a._id);
                }

                this.subscriptions = this.appSubscriptions.items.map(
                    appSubscription => {
                        return {
                            value: appSubscription._id,
                            text: appSubscription.event.event_name,
                            group: appSubscription.event.group
                        };
                    }
                );
                this.subscriptions = this.createSubscriptionsListDropdown(
                    groupNames,
                    this.subscriptions
                );
                this.subscriptionsFiltered = this.subscriptions;
                this.initialHash = this.generateHashOfLocalState();
                this.pageLoading = false;
        } catch (err) {
            console.log(err);
            this.$snackbar.global.showError('Failed to load Sms Template');
            this.pageLoading = false;
            this.pageError = true;
        }
            }
        )
        
    },
    methods: {
        fetchSmsTemplates() {
            return CommunicationServices.getSmsTemplates().then(({ data }) => {
                //this.smsTemplateStore = {"name":"","description":"","message":"","priority":"low"};
            })
        },
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
                        populate: ['event', 'template.sms.template'],
                        query: JSON.stringify({
                            'template.sms.template': {
                                $nin: [null]
                            }
                        })
                    }).then(({ data }) => {
                this.appSubscriptions = data;
            })
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
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: ''
            };
        },
        updateSelection(event) {
            this.data.priority = this.priorityOptions.find(
                option => option.value == event.value
            );
        },
        saveForm() {
            if (this.validate()) {
                let { data } = this;
                let finalObj = {};
                this.formFieldNames.forEach(key => {
                    if (data[key].value || key==="description") {
                        finalObj[key] = data[key].value;
                    }
                });
                finalObj['tags'] = this.tags.map(tag => tag.name);
                if (!isEmpty(this.meta)) {
                    finalObj['meta'] = this.meta;
                }
                //console.log(finalObj);
                // this.$store.commit(ADMIN_COMMS_SET_SMS_TEMPLATE, {
                //     data: {
                //         ...finalObj
                //     }
                // });
                if (this.linkToEvent) {
                    this.$emit('onLinkSubscription', {
                        subscribedAdded: this.subscribedAdded,
                        subscribedRemoved: this.subscribedRemoved
                    });
                }
                return finalObj
            }
        },
        trimLengthMoreThan100(){
            if(this.data.description.value.length>100){
                this.data.description.value=String(this.data.description.value).substr(0,100);
            }
        },
        trimTitleBy100(){
            if(this.data.name.value.length > 100){
                this.data.name.value = this.data.name.value.substr(0,100);
            }
        },
        validate() {
            let has_error = false;
            this.formFieldNames.forEach(key => {
                if (!this.data[key]) {
                    this.data[key] = {};
                }
                if (this.data[key]) {
                    this.data[key].errortext = '';
                    this.data[key].showerror = false;
                }
            });

            let requiredFields = ['name', 'priority'];
            let requiredEmptyArr = requiredFields.filter(
                key => !(this.data[key] && this.data[key].value)
            );

            if (requiredEmptyArr.length > 0) {
                requiredEmptyArr.forEach(key => {
                    let displayName = key[0].toUpperCase();
                    if (key == 'name') {
                        displayName: 'Title';
                    }
                    this.data[key].errortext = `${displayName +
                        key.slice(1)} cannot be empty`;
                    this.data[key].showerror = true;
                });
            }

            let dltTemplateId = this.data.template_id.value
            if(dltTemplateId && dltTemplateId.length < 19){
                has_error = true;
                this.data.template_id.showerror = true
                this.data.template_id.errortext = "DLT template id should be atleast 19 characters"
            }
            else{
                this.data.template_id.showerror = false
                this.data.template_id.errortext = ""
            }
            return requiredEmptyArr.length == 0 && !has_error;
        }
    }
};
</script>
