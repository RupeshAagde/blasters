<template>
    <div class="outer-container main">
        <div class="page-header-position">
            <adm-page-header
                class="adm-page-header"
                :title="'Audit log'"
                @backClick="backRedirect"
                :contextMenuItems="threeDotsOptions"
            >
            </adm-page-header>
        </div>
        <loader v-if="pageLoading"></loader>
        <div
            class="main-body audit-details"
            v-if="!pageLoading && getLogDetails && getLogDetails.length"
        >
            <div class="details">Audit Details</div>
            <div class="details-container">
                <div
                    class="d-block"
                    v-for="(d, index) in getLogDetails"
                    :key="index"
                >
                    <div class="d-title">{{ d.title }}</div>
                    <span v-for="(v, i) in d.values" :key="i">
                        <div class="d-row" v-if="v.desc">
                            <div class="d-subhead">{{ `${v.title}` }}</div>
                            <div
                                v-bind:class="{ 'd-desc': true, link: v.link }"
                                @click="openLink(v.link)"
                            >
                                {{ v.desc }}
                            </div>
                        </div>
                    </span>
                </div>
            </div>
        </div>
        <div class="main-body" v-if="!pageLoading">
            <div class="details">Change Logs</div>
            <div
                class="link-txt"
                @click="goToOldLogDetails"
                v-if="auditLog && auditLog.old_logs"
            >
                Go To Previous State Log
            </div>
            <div class="logs-container">
                <div class="log-json" v-if="showJSONdiff">
                    <div class="json-diff" v-html="htmlOutput" />
                </div>

                <!-- <div class="log-json old-log" v-if="getOldLogsJSON()">
                                    Previous State
                    <no-ssr>
                        <vue-json-pretty
                            class="logs-json"
                            :path="'res'"
                            :data=""
                        />
                    </no-ssr>
                </div>
                <div class="log-json new-log">
                    Changed State
                    <no-ssr>
                        <vue-json-pretty
                            class="logs-json"
                            :path="'res'"
                            :data="getLogsJSON()"
                        />
                    </no-ssr>
                </div> -->
            </div>
        </div>
        <div v-if="!pageLoading">
            <div class="main-body">
                <div class="details">Similar Latest Events</div>
                <div>
                    <div
                        :key="index"
                        v-for="(log, index) in relatedLatestLogs.docs"
                    >
                        <logs-listing-card
                            :truncateTitle="true"
                            :log="log"
                            @openLog="goToLogDetails(log._id)"
                        ></logs-listing-card>
                    </div>
                    <div class="view-more" @click="viewMoreLogs('latest')">
                        View more
                    </div>
                </div>
            </div>
            <div class="main-body">
                <div class="details">Similar Past Events</div>
                <div>
                    <div
                        :key="index"
                        v-for="(log, index) in relatedPastLogs.docs"
                    >
                        <logs-listing-card
                            :truncateTitle="true"
                            :log="log"
                            @openLog="goToLogDetails(log._id)"
                        ></logs-listing-card>
                    </div>
                    <div class="view-more" id="view" @click="viewMoreLogs('past')">
                        View more
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
import dateFormat from 'dateformat';
import { mapGetters } from 'vuex';
import { copyToClipboard } from '@/helper/utils.js';
import AuditTrailService from '../../services/pinpointer.service';
import inlineSvg from '@/components/common/adm-inline-svg';
import PageHeader from '@/components/common/layout/page-header';
import logsListingCard from './logs-listing-card.vue';


import loader from '@/components/common/loader.vue';
import { DiffPatcher, formatters } from 'jsondiffpatch';

const jsondiffpatch = new DiffPatcher({
    objectHash: function (obj) {
        if (typeof obj._id !== 'undefined') {
            return obj._id;
        }
        if (typeof obj.id !== 'undefined') {
            return obj.id;
        }
        if (typeof obj.name !== 'undefined') {
            return obj.name;
        }
        return JSON.stringify(obj);
    },
    arrays: {
        detectMove: true,
        includeValueOnMove: true,
    },
    textDiff: {
        minLength: 60,
    },
    cloneDiffValues: false,
});

export default {
    name: 'log-details',
    props: ['log'],
    mounted() {
        this.init();
    },
    computed: {
        getLogDetails() {
            const det = this.auditLog;
            return det && Object.keys(det).length
                ? [
                      {
                          title: 'Event Information',
                          values: [
                              {
                                  title: 'Entity Id',
                                  desc: this.safeGet(() => det.entity.id),
                              },
                              {
                                  title: 'Entity Type',
                                  desc: this.safeGet(() => det.entity.type),
                              },
                              {
                                  title: 'Entity Action',
                                  desc: this.safeGet(() => det.entity.action),
                              },
                              {
                                  title: 'Application Id',
                                  desc: this.safeGet(() => this.application.id),
                              },
                              {
                                  title: 'Application Name',
                                  desc: this.safeGet(
                                      () => this.application.name
                                  ),
                              },
                              {
                                  title: 'Application URL',
                                  desc: this.safeGet(
                                      () => this.application.domain.name
                                  ),
                                  link: this.safeGet(
                                      () => this.application.domain.name
                                  ),
                              },
                              {
                                  title: 'Domain',
                                  desc: this.safeGet(() => det.domain.name),
                              },
                              {
                                  title: 'Event Date',
                                  desc: this.dateFormatter(
                                      this.safeGet(() => det.date)
                                  ),
                              },
                          ],
                      },
                      {
                          title: 'User Information',
                          values: [
                              {
                                  title: 'User Id',
                                  desc: this.safeGet(
                                      () => det.modifier.user_id
                                  ),
                              },
                              {
                                  title: 'First Name',
                                  desc: this.safeGet(
                                      () => det.modifier.user_details.first_name
                                  ),
                              },
                              {
                                  title: 'Last Name',
                                  desc: this.safeGet(
                                      () => det.modifier.user_details.last_name
                                  ),
                              },
                              {
                                  title: 'Email Address',
                                  desc: this.safeGet(
                                      () => det.modifier.user_details.email
                                  ),
                              },
                              {
                                  title: 'As Administrator',
                                  desc: this.safeGet(() =>
                                      det.modifier.as_administrator
                                          ? 'Yes'
                                          : 'No'
                                  ),
                              },
                          ],
                      },
                      {
                          title: 'Machine Information',
                          values: [
                              {
                                  title: 'Device',
                                  desc: this.safeGet(() =>
                                      det.meta.device.vendor
                                          ? `${det.meta.device.vendor} ${
                                                det.meta.device.model
                                            } ${
                                                det.meta.device.type
                                                    ? `(${det.meta.device.type})`
                                                    : ''
                                            }`
                                          : null
                                  ),
                              },
                              {
                                  title: 'CPU Build',
                                  desc: this.safeGet(
                                      () => det.meta.cpu.architecture
                                  ),
                              },
                              {
                                  title: 'Operating System',
                                  desc: this.safeGet(() =>
                                      det.meta.os.name
                                          ? `${det.meta.os.name} ${
                                                det.meta.os.version
                                                    ? `(${det.meta.os.version})`
                                                    : ''
                                            }`
                                          : null
                                  ),
                              },
                              {
                                  title: 'Browser',
                                  desc: this.safeGet(() =>
                                      det.meta.browser.name
                                          ? `${det.meta.browser.name} ${
                                                det.meta.browser.version
                                                    ? `(${det.meta.browser.version})`
                                                    : ''
                                            }`
                                          : null
                                  ),
                              },
                              {
                                  title: 'IP Address',
                                  desc: this.safeGet(() => det.location.IP),
                              },
                              {
                                  title: 'Location',
                                  desc: this.safeGet(() =>
                                      det.location.city || det.location.country
                                          ? `${
                                                det.location.city
                                                    ? `${det.location.city},`
                                                    : ''
                                            }${det.location.country}`
                                          : null
                                  ),
                              },
                              {
                                  title: 'UserAgent',
                                  desc: this.safeGet(
                                      () => det.device_info.user_agent,
                                      null
                                  ),
                              },
                          ],
                      },
                  ]
                : null;
        },
    },
     watch: {
        $route() {
            this.init();
        },
    },
    components: {
        'nitrozen-badge': NitrozenBadge,
        'adm-text-avatar': admTextAvatar,
        loader,
        'adm-inline-svg': inlineSvg,
        'adm-page-header': PageHeader,
        'logs-listing-card': logsListingCard,
    },
   
    data() {
        return {
            pageLoading: true,
            id: null,
            auditLog: null,
            relatedLatestLogs: {
                docs: [],
            },
            relatedPastLogs: {
                docs: [],
            },
            threeDotsOptions: [],
            showJSONdiff: false,
            htmlOutput: '',
        };
    },
    methods: {
        init(id = null) {
            if(id) {
                this.id = id
            } else {
                this.id = this.$route.params.id;
            }
            
            this.pageLoading = true;
            this.fetchLogDetails()
                .then(({ data }) => {
                    this.auditLog = data;
                    // Configure Log Diff
                    const leftJSON = this.getOldLogsJSON() || {};
                    const rightJSON = this.getLogsJSON() || {};
                    let delta = jsondiffpatch.diff(leftJSON, rightJSON);
                    this.htmlOutput = formatters.html.format(delta, leftJSON);

                    return Promise.all([
                        this.getLatestRelatedLogs(),
                        this.getPastRelatedLogs(),
                    ]);
                })
                .then(([relatedLatestLogs, relatedPastLogs]) => {
                    this.relatedLatestLogs = relatedLatestLogs;
                    this.relatedPastLogs = relatedPastLogs;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                    this.showJSONdiff = true;
                });
        },
        viewMoreLogs(type) {
            let query = {
                limit: 10,
            };
            if (type == 'latest') {
                const lastElement = this.relatedLatestLogs.docs[
                    this.relatedLatestLogs.docs.length - 1
                ];
                query.nxt = lastElement._id;
                query.enttyp = lastElement.entity.type;
            } else if (type == 'past') {
                const lastElement = this.relatedPastLogs.docs[
                    this.relatedPastLogs.docs.length - 1
                ];
                query.nxt = lastElement._id;
                query.enttyp = lastElement.entity.type;
                query.edate = this.auditLog.date;
            }

            let routePath = this.$router.resolve({
                name: 'audit-trail',
                query: query,
            });
            window.open(routePath.href, '_blank');
        },
        openLink(link) {
            if (!link) {
                return;
            }
            var prefix = 'https://';
            if (link.substr(0, prefix.length) !== prefix) {
                link = prefix + link;
            }
            window.open(link, '_blank');
        },
        goToLogDetails(log_id) {
            this.$router.push({
                        name: 'audit-trail-detail',
                        params: {
                        id: log_id,
                     },
                        })
            this.init(log_id)              
        },
        dateFormatter(value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
        },
        fetchLogDetails() {
            return AuditTrailService.getLogById(this.id);
        },
        getLatestRelatedLogs() {
            let params = {
                qs: {
                    'entity.type': this.auditLog.entity.type,
                },
                limit: 4,
                sort: JSON.stringify({ _id: -1 }),
            };
            params.qs = JSON.stringify(params.qs);

            return AuditTrailService.getLogs(params).then((res) => res.data);
        },
        getPastRelatedLogs() {
            let params = {
                qs: {
                    'entity.type': this.auditLog.entity.type,
                    date: {
                        $lte: this.auditLog.date,
                    },
                },
                limit: 4,
                sort: JSON.stringify({ _id: -1 }),
            };
            params.qs = JSON.stringify(params.qs);

            return AuditTrailService.getLogs(params).then((res) => res.data);
        },
        backRedirect() {
            let historyLength = window.history.length;
            if (historyLength > 2) {
                this.$router.go(-1);
            } else {
                this.$router
                    .push(`administrator/audit-trail`)
                    .catch(() => {});
            }
        },
        getLogsJSON() {
            return this.auditLog && this.auditLog.logs
                ? this.auditLog.logs
                : null;
        },
        getOldLogsJSON() {
            return this.auditLog.old_logs && this.auditLog.old_logs.logs
                ? this.auditLog.old_logs.logs
                : null;
        },
        safeGet(fn, defaultValue) {
            try {
                return fn();
            } catch (e) {
                return defaultValue;
            }
        },
        goToOldLogDetails() {
            let old_log_id = this.auditLog.old_logs._id;
            if (old_log_id) {
                this.goToLogDetails(old_log_id);
            }
        },
    },
};
</script>

<style lang="less" scoped>
@import '../../../node_modules/jsondiffpatch/dist/formatters-styles/annotated.css';
@import '../../../node_modules/jsondiffpatch/dist/formatters-styles/html.css';
@import '../../../node_modules/vue-json-pretty/lib/styles.css';
.main {
    .view-more {
        text-align: right;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        color: @RoyalBlue;
        cursor: pointer;
    }
    .link-txt {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        color: @RoyalBlue;
        cursor: pointer;
    }
    .flex {
        display: flex;
    }
    .flex-1 {
        flex: 1;
    }
    .similar-events-left {
        margin: 0px 12px 24px 24px;
        padding: 24px;
        background-color: #ffffff;
    }
    .similar-events-right {
        margin: 0px 24px 24px 12px;
        padding: 24px;
        background-color: #ffffff;
    }
    /deep/.page-header-position {
        margin: 0;
        height: 60px;
    }
    .main-body {
        margin: 24px;
        padding: 24px;
        background-color: #ffffff;
    }
    .details {
        color: @Mako;
        font-weight: bold;
        font-size: 20px;
        line-height: 48px;
        text-align: left;
        margin-bottom: 24px;
    }
    .table-container {
        column-count: 2;
        -moz-column-count: 2;
        -webkit-column-count: 2;

        width: 100%;
    }
    .log-table {
        tr {
            td {
                padding: 12px;
            }
            td:nth-child(odd) {
                font-weight: 800;
                color: @Mako;
            }
        }
        .link {
            color: #2e31be;
            cursor: pointer;
        }
    }

    .logs-container {
        display: flex;
        gap: 10px;

        @media @mobile {
            flex-wrap: wrap;
        }

        .log-json {
            // overflow-wrap: break-word;
            // word-wrap: break-word;
            // -ms-word-break: break-all;
            background: rgba(0, 0, 0, 0.02);
            overflow: auto;
            max-height: 600px;
            flex: 1;

            /* scrollbar */
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
                background-color: @White;
            }
            /* Track */
            &::-webkit-scrollbar-track {
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
                background-color: @White;
            }
            /* Handle */
            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: @DoveGray;
            }

            ::v-deep .logs-json {
                padding: 20px 0px 20px 20px;

                .c-json.line {
                    line-height: 13px;
                }

                .c-json-outter {
                    display: none;
                }

                .vjs-tree__node .vjs-tree__indent {
                    flex: 0 0 1.6em;
                }
                .vjs-key {
                    color: #cc3eca;
                }
                .vjs-value__string {
                    color: #d81717;
                }
                .vjs-value__number {
                    color: #321acb;
                }
                .vjs-value__boolean {
                    color: #25aed8;
                }
            }
        }

        .json-diff {
            ::v-deep .jsondiffpatch-delta {
                font-size: 14px;
                line-height: 22px;
            }
        }

        .log-json.new-log {
            padding: 0px 0px 0px 10px;
            background: rgba(31, 243, 177, 0.04);
        }

        .log-json.old-log {
            background: rgba(243, 31, 116, 0.04);
        }
    }

    .details-container {
        display: flex;

        @media @mobile {
            flex-wrap: wrap;
        }

        .d-block {
            flex: 1;

            @media @mobile {
                width: 100%;
                margin-bottom: 6%;
            }

            .d-title {
                font-size: 17px;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.8);
                margin-bottom: 6px;
            }
            .d-row {
                //display: flex;
                margin: 12px 0px;
            }
            .d-subhead {
                font-size: 13px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.5);
                text-transform: uppercase;
                margin-bottom: 4px;
            }
            .d-desc {
                font-size: 16px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.8);
                line-height: 20px;
            }

            .d-desc.link {
                color: @RoyalBlue;
                cursor: pointer;
            }
        }
    }
}
.outer-container {
    background-color: #f8f8f8;
}
</style>
