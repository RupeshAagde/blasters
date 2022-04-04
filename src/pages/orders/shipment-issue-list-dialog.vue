<template>
    <!-- issue listy -->
    <nitrozen-dialog
        class="shipment-issue-list"
        ref="shipmentIssueList"
        :title="`Shipment Issues: ${shipment_id}`"
    >
        <template slot="body">
            <div class="issue-list">
                <div class="top-row">
                    <nitrozen-button theme="secondary" @click="reportAnIssue">
                        Create New
                    </nitrozen-button>
                </div>
                <div class="issue-list-header">
                    <div class="ticket-id">Ticket #</div>
                    <div class="title">Title</div>
                    <div class="status">Status</div>
                    <div class="category">Category</div>
                </div>
                <div class="no-issus" v-if="issues && issues.length === 0">
                    No issues reported for this shipment
                </div>
                <div
                    class="issue-list-row"
                    :style="getPriorityColor(issue)"
                    v-for="issue in issues"
                    :key="issue._id"
                >
                    <div class="ticket-id">
                        {{ issue.ticket_id }}
                    </div>
                    <div class="title">
                        <span class="link" @click="goToTicket(issue._id)">
                            {{ issue.content.title || "No title"}}
                        </span>
                    </div>
                    <div class="status">
                        <nitrozen-badge>
                            {{ issue.status.display || 'Pending' }}
                        </nitrozen-badge>
                    </div>
                    <div class="category">
                        <nitrozen-badge>
                            {{ issue.category.display }}
                        </nitrozen-badge>
                    </div>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenDialog,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'shipment-issue-list-dialog',
    components: { NitrozenBadge, NitrozenButton, NitrozenDialog },
    props: {
        shipment_id: {
            type: String,
            required: true
        },
        issues: {
            type: Array,
            required: true
        },
        isDrawerView: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    data: function() {
        return {};
    },
    mounted() {},
    methods: {
        open() {
            this.$refs.shipmentIssueList.open({
                showCloseButton: true
            });
        },
        close(reason) {
            this.$refs.shipmentIssueList.close(reason);
            this.$emit('close', reason);
        },
        getSubcategories(category) {
            try {
                return [
                    category.display,
                    ...this.getSubcategories(category.sub_category)
                ];
            } catch (e) {
                return [];
            }
        },
        getPriorityColor(issue) {
            return { 
                "border-left": `5px solid ${issue.priority.color || "gray"}`
            }
        },
        goToTicket(ticket_id) {
            this.close();
            this.$router.push({
                name: 'company-support-view',
                query: {
                    redirect_url: this.$route.fullPath
                },
                params: { ticket_id }
            });
        },
        reportAnIssue() {
            this.close('');
            let routeData = this.$router.resolve({ name: 'company-support-create', query: { redirect_url: this.$route.fullPath, shipment: this.shipment_id } }); 
            if(this.isDrawerView){
                window.open(routeData.href, '_blank')
            }else{
                setTimeout(() => {
                    this.$router.push(routeData.location)
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.shipment-issue-list {
    ::v-deep .nitrozen-dialog {
        min-width: 600px;
        max-width: 90%;
        max-height: 90%;
        .nitrozen-dialog-body {
            .top-row {
                display: flex;
                justify-content: flex-end;
            }
            .issue-list {
                display: flex;
                flex-direction: column;
                .no-issus {
                    border: 1px solid @Iron;
                    border-radius: 3px;
                    background-color: @WhiteSmoke;
                    padding: 6px;
                    text-align: center;
                }
                .issue-list-header {
                    display: flex;
                    border: 1px solid @Iron;
                    border-radius: 3px;
                    margin-bottom: 12px;
                    font-weight: bold;
                    padding: 6px;
                    background-color: @WhiteSmoke;
                    & > div:nth-child(1) {
                        flex: 0.15;
                        padding-left: 12px;
                    }
                    & > div:nth-child(2) {
                        flex: 0.3;
                        padding-right: 15px;
                    }
                    & > div:nth-child(3) {
                        flex: 0.2;
                        padding-right: 15px;
                    }
                    & > div:nth-child(4) {
                        flex: 0.3;
                    }
                }
                .issue-list-row {
                    display: flex;
                    width: 100%;
                    border: 1px solid @Iron;
                    border-radius: 3px;
                    padding: 12px 0;
                    margin-bottom: 6px;
                    line-height: 26px;
                    &:hover {
                        background-color: @WhiteSmoke;
                    }
                    .ticket-id {
                        padding-left: 12px;
                        flex: 0.15;
                    }
                    .title {
                        flex: 0.3;
                        word-break: break-word;
                        padding-right: 5px;
                        .link {
                            cursor: pointer;
                            color: @RoyalBlue;
                            &:hover {
                                text-decoration: underline;
                            }
                        }
                    }
                    .status {
                        flex: 0.2;
                        padding-right: 12px;
                        .nitrozen-badge {
                            height: fit-content;
                            white-space: normal;
                        }
                    }
                    .category {
                        flex: 0.3;
                        padding-right: 12px;
                        word-break: break-word;
                        .nitrozen-badge {
                            height: fit-content;
                            white-space: normal;
                        }
                    }
                }
            }
        }
    }
}
</style>
