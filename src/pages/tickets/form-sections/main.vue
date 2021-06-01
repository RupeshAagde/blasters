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
                <div class="n-input-label-ticket">Description</div>
                <html-content
                    class="description"
                    :content="description"
                ></html-content>
                <div v-if="ticket.created_by">
                    <div class="n-input-label-ticket">Created By</div>
                    <div class="created-by">
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                {{ createdBy() }}
                            </div>
                            <div class="contact-us card-content-line-2">
                                <div
                                    class="contact-email"
                                    v-if="contactEmail()"
                                >
                                    <a
                                        target="_blank"
                                        :href="'mailto:' + contactEmail()"
                                        class="contact-text"
                                    >
                                        {{ contactEmail() }}
                                    </a>
                                </div>
                                <div v-if="contactPhone()">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="communication">
                            <div
                                class="phone"
                                v-if="contactPhone() && false"
                                @click="clickToCall(contactPhone(),'Call customer')"
                            >
                                <adm-inline-svg
                                    class="make-a-call"
                                    :src="'call'"
                                ></adm-inline-svg>
                            </div>
                            <div
                                class="video"
                                @click="makeAVideoCall()"
                            >
                                <adm-inline-svg
                                    class="make-a-video-call"
                                    :src="'video-call'"
                                ></adm-inline-svg>
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
                        <template v-if="event.type == 'diff'">
                            <div v-if="diffDetail(event)">
                                {{ diffDetail(event) }}
                            </div>
                        </template>
                        <template v-else-if="event.type == 'log'">
                            <div v-if="logDetail(event)">
                                {{ logDetail(event) }}
                            </div>
                        </template>
                        <template v-else-if="event.type == 'rating'">
                            <div v-if="ratingDetail(event)">
                                {{ ratingDetail(event) }}
                            </div>
                        </template>
                    </div>
                    <br/>
                    <comments v-if="isEditOnly" :allComments="this.allComments"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import '@/less/color.less';
@import './../../less/page-ui.less';

.detail-section {
    width: 368px;
    margin-left: 24px;
}
.n-input-label-ticket {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin-top: 7px;
    margin-bottom: 0px;
}

.description {
    padding: 12px;
    border-radius: 3px;
    background-color: #f9f9f9;
    color: #a4a5a8;
    line-height: 1.2;
    font-size: 14px;
    border: 1px solid #f6f6f6;
    word-wrap: break-word;
}

.history-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
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

.created-by {
    padding: 8px 12px;
    background: @White;
    margin: 16px 0px;
    border: 1px solid @Iron;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: auto;
    transition: box-shadow 0.3s;
    flex: none;
    box-shadow: none;
    margin-top: 0px;
    height: auto;
    max-height: 200px;
    -webkit-tap-highlight-color: transparent;
    .card-content-section {
        flex: 0.7;
        @media @mobile {
            flex-direction: row;
        }
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            cursor: pointer;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            cursor: pointer;
            font-size: 12px;
        }
    }
    .communication {
        flex: 0.3;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .video {
            flex: 0.5;
            cursor: pointer;
            .inline-svg {
                padding-top: 10px;
                padding-bottom: 10px;
                width: 50px;
                height: 50px;
            }
        }
        .phone {
            padding-top: 10px;
            padding-bottom: 10px;
            flex: 0.5;
            cursor: pointer;
            .inline-svg {
                width: 35px;
                height: 35px;
            }
        }
    }
}

.contact-us {
    justify-content: space-around;
    .contact-email {
        cursor: pointer;
    }
    .contact-phone {
        cursor: pointer;
        display: flex;
    }
    .contact-text {
        font-size: 12px;
    }
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
import HtmlContent from '@/components/common/html-content';
import SupportService from '@/services/support.service';
import CompanyService from '@/services/company-admin.service';
import comments from './comments.vue'

export default {
    name: 'main-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-inline-svg': admInlineSvg,
        'html-content': HtmlContent,
        comments
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
            allComments: [],
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
        this.ticket.history = this.ticket.history || [];
        this.allComments = this.ticket.history.filter( event => event.type.includes("comment"));
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
                    ticket.created_by.user.first_name +
                    ' ' +
                    ticket.created_by.user.last_name;

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
            var isSameYear = moment(date).isSame(moment(), 'year');
            if (isSameYear) {
                return moment(date).format('MMM Do, h:mm a');
            } else {
                return moment(date).format('MMM Do y, h:mm a');
            }
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
                    this.companyInfo = res.data.data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        ratingDetail(event) {
            let creator = 'User';
            let final = '';
            if (event.created_by) {
                creator =
                    event.created_by.first_name +
                    ' ' +
                    event.created_by.last_name +
                    ' ';
            }

            final = final + creator + ' rated Video Call: ';

            event.value.ratings = event.value.ratings || event.value.rating;
            for (let index = 0; index < event.value.ratings.length; index++) {
                const element = event.value.ratings[index];
                final = final + " " + element.title + " as " + element.rating
                if (event.value.ratings.length == 1) {
                    //
                } else if (index == event.value.ratings.length - 2) {
                    final = final + " and"
                } else {
                    final = final + ","
                }
            }

            final =
                final + ' at ' + this.readableDate(new Date(event.createdAt));
            return final;
        },
        diffDetail(event) {
            let history =
                event.created_by.first_name +
                ' ' +
                event.created_by.last_name +
                ' ';
            const date = ' at ' + this.readableDate(new Date(event.createdAt));
            let additions = 0;

            if (
                event.value.assigned_to &&
                event.value.assigned_to.id &&
                event.value.assigned_to.id.length == 2
            ) {
                const key = event.value.assigned_to.id[1];
                let value = undefined;

                this.staff.forEach(element => {
                    if (element.value == key) {
                        value = element.text;
                    }
                });

                if (value) {
                    additions = additions + 1;
                    history = history + 'assigned this to ' + value;
                }
            } else if (
                event.value.assigned_to &&
                event.value.assigned_to.length == 2
            ) {
                const key = event.value.assigned_to[1].id;
                let value = undefined;

                this.staff.forEach(element => {
                    if (element.value == key) {
                        value = element.text;
                    }
                });

                if (value) {
                    additions = additions + 1;
                    history = history + 'assigned this to ' + value;
                }
            }

            if (event.value.status && event.value.status.length == 2) {
                const key = event.value.status[1];
                let value = undefined;

                this.filters.statuses.forEach(element => {
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

            if (event.value.priority && event.value.priority.length == 2) {
                const key = event.value.priority[1];
                let value = undefined;

                this.filters.priorities.forEach(element => {
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

            if (event.value.category && event.value.category.length == 2) {
                const key = event.value.category[1];
                let value = undefined;

                this.filters.categories.forEach(element => {
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

            if (event.value.content && event.value.content.description) {
                if (additions > 0) {
                    history = history + ', also changed the description';
                } else {
                    history = history + 'changed the description';
                }
                additions = additions + 1;
            }

            if (
                event.value.content &&
                event.value.content.title &&
                event.value.content.title.length == 2
            ) {
                if (additions > 0) {
                    history =
                        history +
                        ', also changed the title to "' +
                        event.value.content.title[1] +
                        '"';
                } else {
                    history =
                        history +
                        'changed the title to "' +
                        event.value.content.title[1] +
                        '"';
                }
                additions = additions + 1;
            }

            if (additions == 0) {
                return undefined;
            }

            history = history + date;
            return history;
        },
        logDetail(event) {
            let history =
                event.created_by.first_name +
                ' ' +
                event.created_by.last_name +
                ' ';
            const date = ' at ' + this.readableDate(new Date(event.createdAt));
            let additions = 0;

            history = history + event.value.log;

            history = history + date;
            return history;
        },
        clickToCall(receiver, title) {
            //this.$refs.clickToCallDialog.open({ receiver, title });
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
            const notify = [];

            if (
                this.ticket.created_by &&
                this.ticket.created_by.details &&
                this.ticket.created_by.details.phone
            ) {
                notify.push({
                    country_code: this.ticket.created_by.details.phone.code,
                    phone_number: this.ticket.created_by.details.phone.number,
                });
            } else if (
                this.ticket.created_by &&
                this.ticket.created_by.user &&
                this.ticket.created_by.user.phone_numbers
            ) {
                const phone = this.ticket.created_by.user.phone_numbers.find(
                    (a) => a.primary
                );
                notify.push({
                    country_code: phone.country_code,
                    phone_number: phone.phone,
                });
            }
            
            let createVideoPayload = {
                company_id: this.ticket.context.company_id,
                notify: notify,
                unique_name: this.$route.params.ticket_id
            }

            SupportService.createVideoRoom(createVideoPayload)
                .then((res) => {
                    const uniqueName = res.data.uniqueName || this.$route.params.ticket_id;
                    this.$router.push({
                        path: `${getRoute(this.$route)}/administrator/support/ticket/${uniqueName}/video-room`
                        });
                })
                .catch((err) => {
                    console.log(err && err.message);
                })
        }
    }
};
</script>
