<template>
    <div class="announcement">
        <div class="page-header-position">
            <page-header
                :title="`${isEditOnly ? 'Edit' : 'Create'} Ticket`"
                :contextMenuItems="isEditOnly ? contextMenu : undefined"
                @delete="deleteTicket"
                @backClick="onCancel"
            >
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveTicket"
                        :showProgress="saving"
                        v-flatBtn
                        >{{ `${isEditOnly ? 'Save' : 'Create'}` }}
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="loading"></loader>
        <div v-else class="main-container">
            <div class="ticket-form-container">
                <main-section
                    class="main-section"
                    @something-changed="mainSectionchanged"
                    :ticket="ticket"
                    :filters="filters"
                    :staff="staff"
                />
                <detail-section
                    class="detail-section"
                    :staff="staff"
                    :filters="filters"
                    :ticket="ticket"
                    @something-changed="sideSectionchanged"
                />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.announcement {
    ::v-deep .button-box {
        display: flex;
        align-items: center;
    }
    ::v-deep .pad-right {
        margin-right: 16px;
    }
    .clickable-label {
        cursor: pointer;
    }

    .schedule-btn {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .ticket-form-container {
        display: flex;
        width: 100%;
        ::v-deep .page-container {
            box-sizing: border-box;
            flex-direction: column;
            border: 1px solid @WhiteSmoke;
            margin: 0px;

            .top-headers {
                line-height: 27px;
            }

            .custom-label {
                flex: 0;
            }
            .form-row-ticket {
                width: 100%;
                display: flex;
                padding: 8px 0;
                margin: 0;
                label > span {
                    margin-bottom: 2px;
                }
                .form-item {
                    width: 100%;
                    .custom-checkbox {
                        .nitrozen-container {
                            margin-bottom: 0;
                        }
                    }
                }
                .form-item + .form-item {
                    margin-left: 20px;
                }

                &.form-compact-items {
                    flex-wrap: wrap;
                    .form-item {
                        width: auto;
                    }
                }
            }
            .nitrozen-error-visible {
                visibility: hidden;
                margin-bottom: 7px;
            }
            .nitrozen-error-visible.visible {
                visibility: visible;
            }
        }
        .main-section {
            flex: 1;
        }
        .detail-section {
            width: 368px;
            margin-left: 24px;
        }
    }
}
</style>

<script>
import { getRoute } from '@/helper/get-route';
import PageHeader from '@/components/common/layout/page-header';
import Loader from '@/components/common/loader';
import mainSection from './form-sections/main.vue';
import detailSection from './form-sections/side-pane.vue';

import {
    NitrozenButton,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

import _ from 'lodash';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';

import UserService from '@/services/user-access.service';
import SupportService from './../../services/support.service';

const PAGINATION = {
    limit: 40,
    total: 0,
    current: 1
};

export default {
    name: 'create-ticket',
    components: {
        loader: Loader,
        'page-header': PageHeader,
        'main-section': mainSection,
        'detail-section': detailSection,
        'nitrozen-button': NitrozenButton,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'nitrozen-toggle': NitrozenToggleBtn
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    mounted() {
        this.ticketID = this.$route.params.ticket_id;
        this.originalTicket = JSON.parse(JSON.stringify(this.ticket));
        this.loadEverything();
    },
    data() {
        return {
            ticketID: undefined,
            pagination: { ...PAGINATION },
            staff: [],
            ticket: {
                content: {
                    title: '',
                    description: '',
                    attachments: []
                }
            },
            originalTicket: undefined,
            loading: true,
            saving: false,
            filters: undefined,
            contextMenu: [
                // {
                //     text: 'Delete',
                //     action: 'delete'
                // }
            ]
        };
    },
    computed: {
        isEditOnly() {
            return this.ticketID != undefined;
        },
        isPlatformTicket() {
            return true;
        }
    },
    methods: {
        mainSectionchanged(content) {
            this.ticket.content = Object.assign(this.ticket.content, content);
        },
        sideSectionchanged(option) {
            if (option['status'] && option['status'] != '') {
                this.ticket.status = option['status'];
            }

            if (option['priority'] && option['priority'] != '') {
                this.ticket.priority = option['priority'];
            }

            if (option['category'] && option['category'] != '') {
                this.ticket.category = option['category'];
            }

            if (option['sub_category'] && option['sub_category'] != '') {
                this.ticket.sub_category = option['sub_category'];
            }

            this.ticket.tags = option.tags;
            this.ticket.content.attachments = option.attachments;
            this.ticket.assigned_to = {
                agent_id: option.assigned_to
            };
        },
        requestQuery() {
            const query = {
                page: this.pagination.current,
                limit: this.pagination.limit
            };

            return query;
        },
        loadEverything() {
            let promises = [];
            promises.push(
                SupportService.fetchOptions()
            );

            if (this.ticketID) {
                promises.push(SupportService.getTicket(this.ticketID));
                promises.push(SupportService.fetchHistory(this.ticketID));
            }

            promises.push(UserService.getUserList(this.requestQuery()));

            Promise.all(promises)
                .then((responses) => {
                    let res = responses[0];

                    this.filters = res.data.filters;

                    this.filters.statuses.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                    });

                    this.filters.priorities.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                    });

                    this.filters.categories.forEach((element) => {
                        element.text = element.display;
                        element.value = element.key;
                        element.sub_categories.forEach((item) => {
                            item.text = item.display;
                            item.value = item.key;
                        });
                    });

                    if (this.ticketID) {
                        res = responses[1];

                        const ticket = res.data;
                        this.ticketID = ticket._id;
                        this.ticket.content = ticket.content;
                        this.ticket.status = ticket.status.key;
                        this.ticket.category = ticket.category.key;
                        if (ticket.sub_category) {
                            this.ticket.sub_category = ticket.sub_category.key;
                        } else {
                            this.ticket.sub_category = '';
                        }
                        this.ticket.priority = ticket.priority.key;
                        this.ticket.assigned_to = ticket.assigned_to;
                        this.ticket.created_by = ticket.created_by;
                        this.ticket.source = ticket.source;
                        this.ticket.tags = ticket.tags;
                        this.ticket.createdAt = ticket.createdAt;
                        this.ticket.history = ticket.history;
                        this.ticket.time_slot = ticket.time_slot;
                        this.ticket.created_on = ticket.created_on;
                        this.ticket.context = ticket.context;

                        res = responses[2];
                        this.ticket.history = res.data.items;
                    }

                    res = responses[1];
                    if (this.ticketID) {
                        res = responses[3];
                    }

                    const array = [];
                    res.data.docs.forEach((element) => {
                        array.push({
                            text:
                                (element.first_name || 'Team') +
                                ' ' +
                                (element.last_name || 'Member'),
                            value: element._id
                        });
                    });
                    this.staff = array;
                })
                .catch((err) => {
                    console.log(err);
                    this.$snackbar.global.showError(
                        `Failed to load ticket${
                            err && err.message ? ' : ' + err.message : ''
                        }`
                    );
                })
                .finally(() => {
                    let promises = [];
                    this.ticket.content.attachments =
                        this.ticket.content.attachments || [];
                    this.ticket.content.attachments.forEach((attachment) => {
                        if (attachment.type == 'product') {
                            promises.push(
                                SupportService.fetchProductInfo(
                                    attachment.value
                                )
                            );
                        }

                        if (attachment.type == 'shipment') {
                            promises.push(
                                SupportService.fetchShipmentInfo(
                                    attachment.value,
                                    this.ticket.context.company_id
                                )
                            );
                        }
                        // Handle collection n brand too
                    });

                    Promise.all(promises)
                        .then((responses) => {
                            let index = 0;
                            this.ticket.content.attachments.forEach(
                                (attachment) => {
                                    if (attachment.type == 'product') {
                                        attachment.details =
                                            responses[index].data;
                                        index = index + 1;
                                    }

                                    if (attachment.type == 'shipment') {
                                        attachment.details =
                                            // responses[index].data.orders[0];
                                            responses[index].data.items[0];
                                        index = index + 1;
                                    }
                                }
                            );
                        })
                        .catch((error) => {})
                        .finally(() => {
                            this.originalTicket = JSON.parse(
                                JSON.stringify(this.ticket)
                            );
                            this.loading = false;
                        });
                });
        },
        saveTicket() {
            if (!this.ticket.content.title.length) {
                return this.$snackbar.global.showError(
                    'Please add a title to ticket'
                );
            }

            if (!this.ticket.content.description.length) {
                return this.$snackbar.global.showError(
                    'Please add a description to ticket'
                );
            }

            if (!this.ticket.priority) {
                return this.$snackbar.global.showError(
                    'Please select a priority'
                );
            }

            if (!this.ticket.category) {
                return this.$snackbar.global.showError(
                    'Please select a category'
                );
            }

            this.saving = true;

            this.ticket.content.attachments = this.ticket.content.attachments.map(
                (v) => {
                    return { type: v.type, display: v.display, value: v.value };
                }
            );

            this.ticket.context = undefined;
            if (this.ticketID) {
                SupportService.updateTicket(this.ticketID, this.ticket)
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            'Ticket updated successfully'
                        );
                        this.onCancel();
                    })
                    .catch((err) => {
                        console.log(err && err.message);
                    })
                    .finally(() => {
                        this.saving = false;
                    });
            } else {
                SupportService.saveTicket(this.ticket)
                    .then((res) => {
                        this.$snackbar.global.showSuccess(
                            'Ticket created successfully'
                        );
                        this.onCancel();
                    })
                    .catch((err) => {
                        console.log(err && err.message);
                    })
                    .finally(() => {
                        this.saving = false;
                    });
            }
        },
        deleteTicket() {
            SupportService.deleteTicket(
                this.$route.params.company_id,
                this.ticketID
            )
                .then((res) => {
                    this.$snackbar.global.showSuccess(
                        'Ticket deleted successfully'
                    );
                    this.onCancel();
                })
                .catch((err) => {
                    console.log(err && err.message);
                })
                .finally(() => {
                    this.saving = false;
                });
        },
        isFormDirty() {
            if (this.saving) {
                return false;
            }
            return (
                JSON.stringify(this.originalTicket) !=
                JSON.stringify(this.ticket)
            );
        },
        onCancel() {
            // const route = getRoute(this.$route);
            // if (route.includes('application')) {
            //     this.$router.push({
            //         path: `${getRoute(this.$route)}/tickets`
            //     });
            // } else {
            //     this.$router.push({
            //         path: `${getRoute(this.$route)}/administrator/support`
            //     });
            // }
            this.$router.back();
        }
    }
};
</script>
