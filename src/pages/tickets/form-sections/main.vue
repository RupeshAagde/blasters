<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Details</div>
        <div class="form-row-ticket">
            <div class="form-item">
                <nitrozen-input
                    label="Title"
                    placeholder="Enter title for the ticket"
                    v-model="title"
                    style="width: 100%;"
                    @change="somethingChanged"
                    :disabled="true"
                ></nitrozen-input>
                <nitrozen-input
                    label="Description"
                    placeholder="Enter description for the ticket"
                    style="width: 100%; margin-top: 8px; min-height: 110px;"
                    type="textarea"
                    v-model="description"
                    :disabled="true"
                />
                <div v-if="ticket.created_by" class="width: auto">
                    <div class="n-input-label-ticket">Created By</div>
                    <div
                        class="bombshell-list-card-container"
                        style="margin-top: 0px; height: auto; max-height: 200px;"
                    >
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                {{ createdBy() }}
                            </div>
                            <div class="contact-us card-content-line-2">
                                <div
                                    class="contact-email"
                                    v-if="contactEmail()"
                                >
                                    <!-- <adm-inline-svg :src="'email'"></adm-inline-svg> -->
                                    <a
                                        target="_blank"
                                        :href="'mailto:' + contactEmail()"
                                        class="contact-text"
                                    >
                                        {{ contactEmail() }}
                                    </a>
                                </div>
                                <div v-if="contactPhone()">
                                    <!-- <div v-if="isPlatformTicket">
                                        <a
                                            :href="'tel:+' + contactPhone()"
                                            class="contact-text"
                                        >
                                            {{ '+' + contactPhone() }}
                                        </a>
                                    </div> v-else -->
                                    <div
                                        class="contact-phone"
                                        @click="
                                            clickToCall(
                                                contactPhone(),
                                                'Call customer'
                                            )
                                        "
                                    >
                                        <div style="margin-right: 4px">
                                            {{ '+' + contactPhone() }}
                                        </div>
                                        <!-- <adm-inline-svg
                                            class="make-a-call"
                                            :src="'call'"
                                        ></adm-inline-svg> -->
                                    </div>
                                </div>
                                <!-- <div
                                    class="contact-phone card-content-line-2"
                                    @click="makeAVideoCall()"
                                >
                                    <div style="margin-right: 4px">
                                        Video Call
                                    </div>
                                    <adm-inline-svg
                                        class="make-a-call"
                                        :src="'call'"
                                    ></adm-inline-svg>
                                </div> -->
                                <div v-if="companyInfo">
                                    <a
                                        :href="
                                            '/administrator/company-details/' +
                                                companyInfo.uid
                                        "
                                        >{{ companyInfo.name }}</a
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="history-label" v-if="ticket.created_by">
                        {{
                            createdBy() +
                                ' created this on ' +
                                readableDate(new Date(ticket.createdAt)) +
                                createdOn()
                        }}
                    </div>
                    <div
                        class="history-label"
                        v-for="(event, index) in ticket.history"
                        v-bind:key="index"
                    >
                        <div v-if="eventDetail(event)">
                            {{ eventDetail(event) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <click-to-call-dialog
            ref="clickToCallDialog"
            @close="$clickToCallDialogClosed"
        >
        </click-to-call-dialog> -->
    </div>
</template>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';

.main-section {
    flex: 1;
}
.detail-section {
    width: 368px;
    margin-left: 24px;
}
.n-input-label-ticket {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-top: 7px;
    margin-bottom: 0px;
}

.history-label {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-top: 0px;
    margin-bottom: 0px;
}

.bombshell-list-card-container {
    padding: 8px 12px;
}

.contact-us {
    justify-content: space-around;
    .contact-email {
        cursor: pointer;
    }
    .contact-phone {
        cursor: pointer;
        display: flex;
        .make-a-call {
            cursor: pointer;
            display: inline-block;
            ::v-deep svg {
                width: 16px;
                height: 16px;
                padding-top: 2px;
            }
        }
    }
    .contact-text {
        font-size: 12px;
    }
}

::v-deep .bombshell-list-card-container .card-content-section {
    flex: none;
}

::v-deep .bombshell-list-card-container:hover {
    box-shadow: none;
}

::v-deep .n-input-textarea {
    min-height: 110px;
}

::v-deep
    .v-note-wrapper
    .v-note-panel
    .v-note-edit.divarea-wrapper
    .content-input-wrapper {
    padding-left: 9px;
}
</style>
<script>
import { NitrozenInput, NitrozenError } from '@gofynd/nitrozen-vue';

import { getRoute } from '@/helper/get-route';
import moment from 'moment';
// import ClickToCallDialog from '@/components/common/tools/click-to-call-dialog.vue';
import admInlineSvg from '@/components/common/adm-inline-svg';

import SupportService from '@/services/support.service';
import CompanyService from '@/services/company-admin.service';

// import Video from 'twilio-video';

export default {
    name: 'main-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSvg
        // 'click-to-call-dialog': ClickToCallDialog
    },
    props: {
        filters: {
            type: Object
        },
        staff: {
            type: Array
        },
        ticket: {
            type: Object
        }
    },
    data() {
        return {
            title: '',
            description: '',
            companyInfo: undefined,
            toolBars: {
                subfield: true,
                bold: true,
                italic: true,
                underline: true,
                strikethrough: true,
                mark: true,
                superscript: true,
                subscript: true,
                quote: true,
                ol: true,
                ul: true,
                link: true,
                undo: true,
                redo: true,
                trash: true,
                // "box-shadow": none,
                htmlcode: false
            }
        };
    },
    computed: {
        isEditOnly() {
            const ticketID = this.$route.params.ticket_id;
            return ticketID != undefined;
        },
        isPlatformTicket() {
            const route = getRoute(this.$route);
            return !route.includes('application');
        }
    },
    mounted() {
        this.title = this.ticket.content.title;
        this.description = this.ticket.content.description;
        this.getProfileDetails();
    },
    methods: {
        somethingChanged() {
            this.$emit(`something-changed`, {
                title: this.title,
                description: this.description
            });
        },
        descriptionChanged(newDescription) {
            this.$emit(`something-changed`, {
                title: this.title,
                description: newDescription
            });
        },
        createdBy() {
            let subtitle = '';
            const ticket = this.ticket;
            let username = '';

            if (ticket.created_by.user) {
                username =
                    ticket.created_by.user.firstName +
                    ' ' +
                    ticket.created_by.user.lastName;

                if (ticket.created_by.details) {
                    if (username == ticket.created_by.details.name) {
                        subtitle = subtitle + username;
                    } else {
                        subtitle =
                            subtitle +
                            username +
                            '(' +
                            ticket.created_by.details.name +
                            ')';
                    }
                } else {
                    subtitle = subtitle + username;
                }
            } else if (ticket.created_by.details) {
                subtitle = subtitle + ticket.created_by.details.name;
            }

            return subtitle;
        },
        readableDate(date) {
            return moment(date).format('MMM Do, h:mm a');
        },
        contactEmail() {
            const ticket = this.ticket;
            if (ticket.created_by.details) {
                if (ticket.created_by.details.email) {
                    return ticket.created_by.details.email;
                }
            } else if (ticket.created_by.user) {
                if (
                    ticket.created_by.user.emails &&
                    ticket.created_by.user.emails.length
                ) {
                    return ticket.created_by.user.emails[0].email;
                }
            }

            return undefined;
        },
        contactPhone() {
            const ticket = this.ticket;
            if (ticket.created_by.details) {
                if (ticket.created_by.details.phone) {
                    return (
                        ticket.created_by.details.phone.code +
                        ticket.created_by.details.phone.number
                    );
                }
            } else if (ticket.created_by.user) {
                if (
                    ticket.created_by.user.phoneNumbers &&
                    ticket.created_by.user.phoneNumbers.length
                ) {
                    return (
                        ticket.created_by.user.phoneNumbers[0].countryCode +
                        ticket.created_by.user.phoneNumbers[0].phone
                    );
                }
            }

            return undefined;
        },
        getProfileDetails: function() {
            let params = {
                uid: this.ticket.context.company_id
            };
            CompanyService.fetchCompanyProfile(params)
                .then((res) => {
                    debugger;
                    this.companyInfo = res.data.data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        eventDetail(event) {
            let history =
                event.user.firstName + ' ' + event.user.lastName + ' ';
            const date = ' on ' + this.readableDate(new Date(event.createdAt));
            let additions = 0;

            if (
                event.diff.assigned_to &&
                event.diff.assigned_to.id &&
                event.diff.assigned_to.id.length == 2
            ) {
                const key = event.diff.assigned_to.id[1];
                let value = undefined;

                this.staff.forEach((element) => {
                    if (element.value == key) {
                        value = element.text;
                    }
                });

                if (value) {
                    additions = additions + 1;
                    history = history + 'assigned this to ' + value;
                }
            } else if (
                event.diff.assigned_to &&
                event.diff.assigned_to.length == 2
            ) {
                const key = event.diff.assigned_to[1].id;
                let value = undefined;

                this.staff.forEach((element) => {
                    if (element.value == key) {
                        value = element.text;
                    }
                });

                if (value) {
                    additions = additions + 1;
                    history = history + 'assigned this to ' + value;
                }
            }

            if (event.diff.status && event.diff.status.length == 2) {
                const key = event.diff.status[1];
                let value = undefined;

                this.filters.statuses.forEach((element) => {
                    if (element.key == key) {
                        value = element.display;
                    }
                });

                if (value) {
                    if (additions > 0) {
                        history = history + ', also set Status to ' + value;
                    } else {
                        history = history + 'set Status to ' + value;
                    }
                    additions = additions + 1;
                }
            }

            if (event.diff.priority && event.diff.priority.length == 2) {
                const key = event.diff.priority[1];
                let value = undefined;

                this.filters.priorities.forEach((element) => {
                    if (element.key == key) {
                        value = element.display;
                    }
                });

                if (value) {
                    if (additions > 0) {
                        history = history + ', also set Priority to ' + value;
                    } else {
                        history = history + 'set Priority to ' + value;
                    }
                    additions = additions + 1;
                }
            }

            if (event.diff.category && event.diff.category.length == 2) {
                const key = event.diff.category[1];
                let value = undefined;

                this.filters.categories.forEach((element) => {
                    if (element.key == key) {
                        value = element.display;
                    }
                });

                if (value) {
                    if (additions > 0) {
                        history =
                            history + ', also changed Category to ' + value;
                    } else {
                        history = history + 'changed Category to ' + value;
                    }
                    additions = additions + 1;
                }
            }

            if (additions == 0) {
                return undefined;
            }

            history = history + date;
            return history;
        },
        clickToCall(receiver, title) {
            this.$refs.clickToCallDialog.open({ receiver, title });
        },
        $clickToCallDialogClosed(reason) {
            if (reason == 'success') {
                console.log(reason);
            }
        },
        createdOn() {
            if (this.ticket.created_on) {
                if (this.ticket.created_on.platform == 'ios') {
                    return ' on ' + 'iPhone';
                } else if (this.ticket.created_on.platform == 'android') {
                    return ' on ' + 'Android';
                } else if (this.ticket.created_on.platform == 'web') {
                    return ' on ' + this.ticket.created_on.meta.browser.name;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        },
        makeAVideoCall() {
            SupportService.createVideoRoom()
                .then((res) => {
                    const uniqueName = res.data.uniqueName;
                    this.$router.push({
                        path: `${getRoute(this.$route)}/leads/edit/${
                            this.$route.params.ticket_id
                        }/video-room/${uniqueName}`
                    });
                })
                .catch((err) => {
                    console.log(err && err.message);
                })
                .finally(() => {
                    //
                });
        }
    }
};
</script>
