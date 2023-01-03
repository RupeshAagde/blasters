<template>
    <div class="shipment-info-header">
        <div class="header">
            <div class="tags-wrapper">
                <div class="title-container" v-if="displayShipmentTags()">
                    <span
                        class="tags-container"
                        v-for="(tags, index) in shipment.meta.shipment_tags"
                        :key="index"
                    >
                        <nitrozen-badge
                            class="right-align"
                            :style="{
                                color: '#E9783D',
                                'border-color': '#E9783D',
                            }"
                        >
                            {{ tags.display_text }}
                        </nitrozen-badge>
                    </span>
                </div>
                <div v-else>
                    <nitrozen-badge
                        class="right-align"
                        :style="{
                            color: '#E9783D',
                            'border-color': '#E9783D'
                        }"
                    >
                        Standard Delivery
                    </nitrozen-badge>
                </div>
                
                <div class="lock-icon" v-if="shipment.lock_status">
                    <ukt-inline-svg src="oms-lock"></ukt-inline-svg>
                </div>
            </div>


            <div class="right-container">
                <div
                    class="sla-status"
                    v-if="shipment.status.meta && shipment.status.meta.estimated_sla_time"
                    :title="
                        shipment.status.meta.estimated_sla_time
                            ? displaySlaTooltip(shipment.status.meta.estimated_sla_time)
                            : ''
                    "
                >
                    <sla-indicator
                        :sla_percent="
                            displaySlaPercentage(
                                shipment.status.status_created_at,
                                shipment.status.meta.estimated_sla_time
                            )
                        "
                    />
                    <span class="sla-time"
                        >
                        {{
                            isBreachedOrNot(
                                shipment.status.meta.estimated_sla_time
                            )
                        }}</span
                    >
                </div>

                <div class="action-items">
                    <div
                        class="activity-log"
                        v-if="shipment && firstBag"
                        title="View Shipment Activity"
                    >
                        <div class="log-activity" @click="showShipmentActivity">
                            <ukt-inline-svg
                                src="new-shipment-activity"
                            ></ukt-inline-svg>
                        </div>
                    </div>

                    <!-- Uncomment this after checkUpdateRole and all starts working -->
                    <!-- <span
                        v-if="ticketCreationStatus && (checkUpdateRole || checkReadRole)"
                        class="report-an-issue"
                        @click="openDialog"
                        title="Report an Issue"
                    > -->
                    <span
                        class="report-an-issue"
                        @click="openDialog"
                        title="Report an Issue"
                        v-if="checkReadRole"
                    >
                        <ukt-inline-svg src="new-report-issue"></ukt-inline-svg>
                        <span
                            v-if="issues && issues.length"
                            class="issues-count"
                            title="Click to see all issues"
                        >
                            {{ issues.length }}
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <transition name="slide">
            <template v-if="quickActivityView">
                <side-drawer
                    class="side-drawer"
                    :css="{ width: '46%' }"
                    @close="closeDetails()"
                    :title="`Activity Logs: ${shipment.shipment_id}`"
                >
                    <template #header>
                        <nitrozen-tab
                            ref="tabs"
                            class="tabs"
                            :tabItem="tabs.map((item) => item.text)"
                            :active-index="selectedStageTabIndex"
                            @tab-change="selectStageTab"
                        ></nitrozen-tab>
                    </template>
                    <activity-logs
                        ref="activity-ref"
                        v-show="selectedStageTabIndex == 0"
                        :shipmentId="shipment.shipment_id"
                        :tab="selectedStageTabIndex"
                        :hasShipmentActivityFetched="hasShipmentActivityFetched"
                    ></activity-logs>
                    <delivery-logs v-show="selectedStageTabIndex == 1"
                     :shipmentId="shipment.shipment_id"/>
                </side-drawer>
            </template>
        </transition>

        <nitrozen-dialog
            ref="dialog"
            :title="`Shipment Issues: ${shipment.shipment_id}`"
        >
            <template slot="body">
                <shipment-issue-list-dialog
                    ref="shipmentIssueListDialog"
                    v-if="shipment && issues"
                    @closeDialog="closeDialog"
                    :shipment_id="shipment.shipment_id"
                    :issues="issues"
                    :isDrawerView="true"
                ></shipment-issue-list-dialog>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenBadge,
    NitrozenTab,
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import ActivityLogs from '@/pages/oms/shipment-info/activity-logs.vue';
import ShipmentActivityDialog from '@/pages/oms/shipment-activity-dialog.vue'; 
import ShipmentIssueListDialog from '@/pages/oms/shipment-issue-list-dialog.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import SlaIndicator from '@/pages/oms/sla/sla-indicator.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import WarnIcon from '@/pages/oms/warn-icon.vue';
import DeliveryLogs from '@/pages/oms/shipment-info/delivery-logs.vue';

/* Helper imports*/
import {
    displaySlaPercentage,
    displaySlaHoursLeft,
    displaySlaTooltip,
} from '@/pages/admin/oms/sla/helper.js';

/* Service imports */
import OrderService from '@/services/orders.service';
import SupportService from '@/services/support.service';

/* Store imports */
import {
    GET_EMPLOYEE_ACCESS_DETAIL,
    GET_USER_INFO,
} from '@/store/getters.type';
import { ADMIN_GET_SELLER_SUPPORT_CONFIG } from '@/store/admin/getters.type';


export default {
    name: 'shipment-info-header',
    props: {
        shipment: Object,
        firstBag: Object,
    },
    components: {
        NitrozenDialog,
        NitrozenTab,
        NitrozenBadge,
        DeliveryLogs,
        ActivityLogs,
        ShipmentActivityDialog,
        ShipmentIssueListDialog,
        SideDrawer,
        SlaIndicator,
        UktInlineSvg,
        WarnIcon,
    },
    data() {
        return {
            activityLogsData: [],
            dpActivityLoading: false,
            dpLogsData: [],
            hasShipmentActivityFetched: false,
            hasDPActivyFetched: false,
            issues: [],
            quickActivityView: false,
            selectedStageTabIndex: 0,
            tabs: [
                {
                    text: 'Activity',
                    value: 'activity',
                },
                {
                    text: 'DP Status',
                    value: 'status',
                },
            ],
            selectedStageTabIndex: 0,
            issues: [],
            quickActivityView: false,
            activityLogsData: [],
            // dpLogsData: DP_LOGS,
            company_id: "",
            applicationId: ""
        };
    },
    mounted() {
        this.company_id = this.$route.params.company_id;
        this.applicationId = this.$route.params.applicationId;
        this.selectedStageTabIndex = 0;
        this.getReportedIssues();
    },
    computed: {
        ...mapGetters({
            accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
            userinfo: GET_USER_INFO,
            support_config: ADMIN_GET_SELLER_SUPPORT_CONFIG,
        }),
        checkReadRole() {
            const role =
                this.accessDetail &&
                this.accessDetail.order_role &&
                this.accessDetail.order_role != 'read_only';
            return role;
        },
        checkUpdateRole() {
            const role =
                this.accessDetail &&
                this.accessDetail.order_role &&
                (this.accessDetail.order_role == 'store_manager' ||
                    this.accessDetail.order_role == 'full_access');
            return role;
        },
        ticketCreationStatus() {
            return (
                this.support_config &&
                this.support_config.integration &&
                this.support_config.integration.enabled
            );
        },
    },

    methods: {
        displaySlaPercentage,
        displaySlaHoursLeft,
        displaySlaTooltip,

         /**
         * This method is used to hide the quick activity view dialog.
         *
         * @author: Rohit Gupta
         */
        closeDetails() {
            this.quickActivityView = false;
            this.selectedStageTabIndex = 0;
        },

        /**
         * Method to call the native function to close the dialog.
         *
         * @author: Rohit Gupta
         */
        closeDialog() {
            this.$refs['dialog'].close();
        },

        /**
         * Method to confirm whether the shipment tags should be displayed
         *
         * @author: Rushabh Mulraj Shah
         */
        displayShipmentTags() {
            return (
                !isEmpty(this.shipment) &&
                this.shipment.meta &&
                this.shipment.meta.shipment_tags &&
                !isEmpty(this.shipment.meta.shipment_tags)
            );
        },

        /**
         * Method to fetch the reported issues
         *
         * @author: Rohit Gupta
         */
        getReportedIssues() {
            let get_tickets = this.company_id && this.applicationId ?
            SupportService.fetchApplicationTickets(
                this.company_id,
                this.applicationId,
                {
                    limit: 200,
                    page: 1,
                    attachment_type: 'shipment',
                    attachment_value: this.shipment.shipment_id,
                }
            ) :
            SupportService.fetchTickets(this.company_id, {
                limit: 200,
                page: 1,
                attachment_type: 'shipment',
                attachment_value: this.shipment.shipment_id,
            });

            get_tickets
            .then(({ data }) => {
                this.issues = data.items;
            })
            .catch((err) => {
                console.error(
                    'Error in fetching the reported issues:   ',
                    err
                );
                this.$snackbar.global.showError(
                    `Unable to fetch the reported issues for shipment ID: ${this.shipment.shipment_id}`,
                    3000
                );
            });
        },

        isBreachedOrNot(estTime) {
            let value = displaySlaHoursLeft(estTime);
            let slicedValue = value.slice(0, 1);
            if(slicedValue == '-') {
                let breachedValue = displaySlaHoursLeft(estTime);
                return `Breached by: ${breachedValue.slice(1)}`;
            }
            else if(["placed", "store_reassigned"].includes(this.shipment.status.status)) {
                return `Confirm by: ${displaySlaHoursLeft(estTime)}`;
            }
            else if(["bag_confirmed", "dp_not_assigned", "ready_for_dp_assignment", "cancelled_at_dp", "dp_assigned"].includes(this.shipment.status.status)) {
                return `Pack by: ${displaySlaHoursLeft(estTime)}`;
            }
        },

        /**
         * Method to call the native function to open the dailog.
         *
         * @author: Rohit Gupta
         */
        openDialog() {
            this.$refs['dialog'].open({
                width: '600px',
                showCloseButton: true,
            });
        },

        /**
         * Method to handle the tab change selection.
         *
         * @author: Rohit Gupta
         * @param {Object} e The native event object.
         */
        selectStageTab(e) {
            /*
                If the selected tab is clicked, it will take no action.
                Else, it will change the value.
            */
            if (this.selectedStageTabIndex == e.index) return;
            else {
                this.selectedStageTabIndex = e.index;
            }
        },

        /**
         * This method is used for fetching the shipment activity.
         *
         * @author: Rohit Gupta
         */
        showShipmentActivity() {
            this.quickActivityView = true;
            let params = {
                shipment_id: this.shipment.shipment_id,
            };

            const get_activity_logs = OrderService.fetchShipmentActivityLogs(
                params
            );
            return get_activity_logs
                .then((response) => {
                    this.hasShipmentActivityFetched = true;
                    let data = response.data;
                    this.activityLogsData = cloneDeep(data.activity_history);
                    this.$refs['activity-ref'].callItInitially(
                        this.activityLogsData
                    );
                })
                .catch((error) => {
                    this.hasShipmentActivityFetched = true;
                    this.$snackbar.global.showError(
                        'Unable to fetch Shipment Activity Logs'
                    );
                    console.error(
                        'Error in fetching the shipment activity logs:   ',
                        error
                    );
                });
        }
    }
};
</script>

<style lang="less" scoped>
.shipment-info-header {
    margin-bottom: 1rem;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .right-container {
            display: flex;
            align-items: center;

            .sla {
                display: flex;
                align-items: center;
                margin-right: 16px;
            }

            .status-badge {
                margin-right: 16px;
            }

            .action-items {
                display: flex;

                .activity-log {
                    margin-right: 8px;
                    cursor: pointer;
                }

                .report-an-issue {
                    cursor: pointer;

                    .issues-count {
                        opacity: 0.9;
                        border-radius: 10px;
                        line-height: 20px;
                        color: white;
                        background-color: tomato;
                        display: flex;
                        justify-content: center;
                        padding: 0px 8px;
                        cursor: pointer;
                        font-size: 10px;
                        position: relative;
                        top: -30px;
                        right: -8px;
                    }
                }
            }
        }
    }
}

.slide-fade {
    overflow-x: initial;
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;
    .container {
        position: absolute;
        right: 0px;
        width: 60%;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            cursor: pointer;
        }
    }
}
.sla-status {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 20px;
    ::v-deep .indicator-container {
        position: relative;
        width: 25px;
        height: 25px;
        bottom: 0px;
    }
    .sla-time {
        margin-top: 2px;
        margin-left: 10px;
        font-weight: 400;
        font-size: 14px;
        white-space: nowrap;
        color: #4d4d4e;
    }
}
.side-drawer {
    ::v-deep .sidedrawer-container {
        min-width: 46%;
        .sidedrawer-header {
            padding: 24px 24px 0px 24px;
        }
    }
    .tabs {
        margin-top: 32px;
        ::v-deep .nitrozen-tab-item {
            padding-bottom: 10px;
        }
    }
}
.tags-container {
    margin-right: 10px;
}

.tags-wrapper {
    display: flex;
    column-gap: 8px;
}
</style>
