<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header @backClick="onCancel" @openHelp="showHelpSection" :title="`Webhook Report`"
                :contextMenuItems="isOrganisationUser ? [] : contextMenuItems">
            </adm-page-header>
        </div>
        <loader v-if="startLoader" class="loading"></loader>
        <div class="main-container">
            <div class="full-width">
                <nitrozen-dialog class="status_dialog" ref="status_dialog" :title="selectedPayloadName">
                    <template v-if="ifJson" slot="body">
                        <div>
                            <div class="url-content">
                                <div class="url-display-name">Webhook URL:</div>
                                <div class="url-value">
                                    {{ dialodWebhookUrl }}
                                </div>
                            </div>
                            <span>
                                <img src="/public/assets/admin/svgs/webhook-copy.svg" alt="copy" class="copy copy-url"
                                    @click="
                                        onCopyCode(
                                            $event,
                                            dialodWebhookUrl,
                                            'url'
                                        )
                                    " />
                            </span>
                            <hr />
                        </div>
                        <div>
                            <div class="url-content">
                                <div class="url-display-name">Event ID:</div>
                                <div class="id-value">
                                    {{ dialogMessageJson.event.id }}
                                </div>
                            </div>
                            <span>
                                <img src="/public/assets/admin/svgs/webhook-copy.svg" alt="copy" class="copy copy-id"
                                    @click="
                                        onCopyCode(
                                            $event,
                                            dialogMessageJson.event.id,
                                            'id'
                                        )
                                    " />
                            </span>
                            <hr />
                        </div>
                        <div>
                            <div class="url-content">
                                <div class="url-display-name">Payload:</div>
                            </div>
                            <img src="/public/assets/admin/svgs/webhook-copy.svg" alt="copy"
                                class="copy copy-json-content" @click="
                                    onCopyCode(
                                        $event,
                                        dialogMessageJson,
                                        'json'
                                    )
                                " />
                            <div class="json-data">
                                <tree-view class="json-content" :data="dialogMessageJson" :options="{ maxDepth: 3 }">
                                </tree-view>
                            </div>
                        </div>
                    </template>
                    <template v-if="!ifJson" slot="body">
                        {{ dialogMessage }}
                    </template>
                    <template class="footer-dialog" slot="footer">
                        <div class="test-webhook-footer">
                            <nitrozen-button @click="closeDialog" class="popup-btn" v-strokeBtn :theme="'secondary'">Ok
                            </nitrozen-button>
                        </div>
                    </template>
                </nitrozen-dialog>
                <div class="sp-settings-container">
                    <div class="page-container common-container report-container">
                        <div class="sub-header">
                            <template>
                                <div class="filter">
                                    <nitrozen-input :showSearchIcon="true" class="search" type="search"
                                        placeholder="Search by Trace ID or Message ID" v-model="searchText" @input="
                                            webhookInput({ search: searchText })
                                        "></nitrozen-input>
                                    <div class="filter-dynamic">
                                        <div v-for="(filter, index) in filters" :key="filter.filter_name"
                                            class="filter-dropdown">
                                            <nitrozen-dropdown :class="
                                                'filter-dropdown-field filter-' +
                                                filter.filter_name
                                            " :label="filter.filter_name" :enable_select_all="true"
                                                :items="filter.values" :id="filter.filter_name" @searchInputChange="
                                                    searchFilter($event)
                                                " v-model="
    filtersToshow[
    filter.filter_name
    ]
" @change="
    filterInputChange(
        filter.filter_name,
        index
    )
" :placeholder="
    'Select ' +
    filter.filter_name
" :searchable="true" :multiple="true"></nitrozen-dropdown>
                                        </div>
                                        <div class="date-content">
                                            <div class="date-search">
                                                <label class="
                                                        nitrozen-dropdown-label
                                                        date-range-label
                                                    ">Date Range
                                                    <nitrozen-tooltip icon="help" class="ort-tooltip"
                                                        :position="'bottom'">
                                                        <p>
                                                            Only last 30 days
                                                            data available
                                                        </p>
                                                    </nitrozen-tooltip>
                                                </label>
                                                <nitrozen-dropdown :class="'filter-dropdown-field filter-date'"
                                                    :label="'Date Range'" :items="dateItems" @change="
                                                        dateRangeChange($event)
                                                    " @searchInputChange="
    clearDateFilter()
" v-model="dateSelected" placeholder="Select Date Range"
                                                    :searchable="true" :multiple="false">
                                                    <label>Date Range</label>
                                                </nitrozen-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="selectedItems">
                                    <div v-for="(name, index) in filtersToshow[
                                        'Event'
                                    ]" :key="index" class="items">
                                        <span class="items-content">{{
                                                name
                                        }}</span>
                                        <img @click="deleteItem(name, 'Event')" class="cross-icon"
                                            src="/public/assets/admin/svgs/cross-black.svg" alt="profile" />
                                    </div>
                                    <div v-for="(name, index) in filtersToshow[
                                        'Subscriber Name'
                                    ]" :key="index + 'subscriber_name'" class="items">
                                        <span class="items-content">{{
                                                name
                                        }}</span>
                                        <img @click="
                                            deleteItem(
                                                name,
                                                'Subscriber Name'
                                            )
                                        " class="cross-icon" src="/public/assets/admin/svgs/cross-black.svg"
                                            alt="profile" />
                                    </div>
                                    <div v-if="selectedFilters" class="clear-section" @click="deleteItem('all', null)">
                                        <span> Clear all </span>
                                    </div>
                                </div>
                            </template>
                            <div v-if="webhookReport && webhookReport.length > 0" class="table-content">
                                <table class="payouts-table">
                                    <tr>
                                        <td class="clickable no-wrap" @click="
                                            sortTable(
                                                'request.event.subscriber_name'
                                            )
                                        ">
                                            Name
                                        </td>
                                        <td class="clickable no-wrap" @click="
                                            sortTable('request.event.name')
                                        ">
                                            Event
                                        </td>
                                        <td class="clickable line-height" @click="
                                            sortTable('response.status')
                                        ">
                                            <div>Response</div>
                                            <div>Code</div>
                                        </td>
                                        <td class="clickable line-height" @click="
                                            sortTable('response.message')
                                        ">
                                            <div>Response</div>
                                            <div>Message</div>
                                        </td>
                                        <td class="clickable line-height" @click="
                                            sortTable(
                                                'processed_time_in_millis'
                                            )
                                        ">
                                            <div>Response</div>
                                            <div class="no-wrap">Time (ms)</div>
                                        </td>
                                        <td class="clickable no-wrap" @click="sortTable('processed_on')">
                                            Processed On
                                        </td>
                                        <td class="clickable">Request</td>
                                        <td class="clickable" @click="sortTable('attempts')">
                                            Attempts
                                        </td>
                                        <td class="clickable" @click="
                                            sortTable('response.status')
                                        ">
                                            Status
                                        </td>
                                    </tr>
                                    <template v-if="
                                        webhookReport &&
                                        webhookReport &&
                                        webhookReport.length > 0
                                    ">
                                        <tr :key="index" v-for="(
                                                method, index
                                            ) in webhookReport">
                                            <td>
                                                <div class="no-wrap">
                                                    {{ method.subscriber_name }}
                                                </div>
                                            </td>
                                            <td>
                                                <div class="no-wrap">
                                                    {{
                                                            method.request.event
                                                                .name
                                                    }}.{{
        method.request.event
            .type
}}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {{ method.response.status }}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {{
                                                            method.response.message
                                                    }}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {{
                                                            method.processed_time_in_millis
                                                    }}
                                                </div>
                                            </td>

                                            <td>
                                                <div class="no-wrap">
                                                    {{ method.processed_on }}
                                                </div>
                                            </td>
                                            <td class="clickable-payload" @click="
                                                showPayload(
                                                    method.request,
                                                    method.webhook_url,
                                                    method.subscriber_name
                                                )
                                            ">
                                                <a class="payload"> Payload </a>
                                            </td>
                                            <td>
                                                <div>
                                                    {{ method.attempt }}
                                                </div>
                                            </td>
                                            <td :class="method.status">
                                                <div>
                                                    {{ method.status }}
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </table>
                            </div>
                            <adm-no-content v-if="
                                webhookReport && webhookReport.length === 0
                            " :helperText="'No Data Found'"></adm-no-content>
                            <nitrozen-pagination name="Items" v-model="pageObject" value="pageObjectValue"
                                @change="paginationChange" :pageSizeOptions="rows">
                            </nitrozen-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

table tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
}

table tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
}

.test-webhook-footer {
    width: 15%;
}

::v-deep .nitrozen-dialog-footer {
    justify-content: center !important;
}

.popup-btn {
    width: 45%;
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    color: #2e31be;
}

.url-content {
    margin: 15px 0 10px 0;
}

.ort-tooltip {
    align-self: center;
    position: absolute;
}

.date-range-label {
    padding-top: 8px;
    margin-right: 2%;
}

.line-height {
    line-height: 1.5;
}

.clear-section {
    cursor: pointer;
    align-self: center;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #2e31be;
    flex: none;
    order: 5;
    flex-grow: 0;
    margin: 0px 12px;
}

::v-deep .filter-date>label {
    display: none;
}

.url-display-name {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 23px;
    color: #41434c;
}

.selectedItems {
    gap: 10px;
    flex-wrap: wrap;
    display: flex;
    margin-bottom: 16px;
}

.cross-icon {
    cursor: pointer;
}

.items-content {
    margin-right: 10px;
}

.items {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 10px 0px 24px;
    font-size: 12px;
    position: static;
    height: 40px;
    background: #fafafa;
    border: 1px solid #e4e5e6;
    box-sizing: border-box;
    border-radius: 22px;
    flex: none;
    order: 4;
    flex-grow: 0;
}

.payload {
    color: #2e31be;
}

.copy-json-content {
    top: 42%;
}

.json-data {
    height: 200px;
    overflow: auto;
}

.json-content {
    width: 100%;
    margin-top: 15px;
}

.url-value {
    color: #2e31be;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 23px;
}

.webhook-url {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 40%;
}

.table-content {
    width: 100%;
    overflow-x: scroll;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 10px;
}

::v-deep .n-input-label {
    margin-right: 7px;
    flex: auto;
    width: 40%;
    align-self: center;
}

::v-deep .filter-Events>label {
    width: 15%;
    align-self: center;
}

::v-deep .filter-Events>div {
    width: 73% !important;
}

::v-deep .filter-Subscriber>label {
    // width: 48%;
    align-self: center;
}

::v-deep .filter-Subscriber .nitrozen-option-container {
    word-break: break-all;
}

::v-deep .tree-view-item-value-number {
    color: #478e2f;
}

::v-deep .tree-view-item-value-string {
    color: #ed423e;
}

hr {
    height: 1px;
    border: none;
    background-color: #e0e0e0;
}

.copy-url {
    top: 6%;
}

.copy-id {
    top: 22%;
}

.copy {
    position: absolute;
    right: 5%;
    margin-bottom: 20px;
    z-index: 10;
    cursor: pointer;
}

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    word-break: break-all;
    visibility: hidden;
    font-size: 12px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px 8px 8px 8px;
    position: absolute;
    z-index: 10;
    bottom: 100%;
    margin-left: -60px;
}

.tooltip .tooltiptext::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    z-index: 10;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}

tr:hover {
    background-color: rgba(0, 0, 0, 0.075);
}

::v-deep .n-button-secondary {
    width: 100%;
}

::v-deep .n-input {
    height: 38px;
}

.filter {
    padding-bottom: 16px;
    display: inline-block;
    width: 100%;
}

.filter-dynamic {
    align-items: flex-end;
    display: flex !important;
    display: inline-block;
    width: 100%;
    gap: 10px;
}

td {
    font-size: 12px;
}

.page-container .payouts-table td {
    text-align: left;
}

.filter-sub-header {
    margin-bottom: 5px;
}

.sub-header {
    width: 100%;
}

::v-deep .n-input-label>span {
    font-size: 11px;
}

.search {
    align-self: flex-end;
    margin-right: 10px;
    margin-bottom: 20px;
    width: 100%;
    float: left;
}

.search-button-box {
    align-self: flex-end;
    margin-top: 10px;
    width: 20%;
}

.report-container {
    width: 96%;
}

.date {
    display: inline-grid;
}

.full-width {
    display: inline-flex;
    width: 100%;
}

.bold-xs {
    font-weight: 700;
    font-size: 18px;
}

.StripeElement {
    box-sizing: border-box;
    height: 40px;
    padding: 10px 12px;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0 1px 3px 0 #e6ebf1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
}

.clickable {
    cursor: pointer;
    font-size: 14px;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
}

.clickable-payload {
    cursor: pointer;
    color: #1a73ea;
    text-decoration: underline;
}

.StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
    border-color: #fa755a;
}

.StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
}

.sp-settings-container {
    width: 100%;
}

.title {
    margin-bottom: 3%;
    width: 30%;
    color: #41434c;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    margin-bottom: 24px;
}

.inline {
    display: inline-flex;
}

.hide {
    visibility: hidden;
}

.header-margin {
    margin-top: 56.5px;
}

.plan-info {
    padding: 14px;
    border-radius: 5px;
    border: 1px solid lightgray;
    line-height: 24px;
}

.plan-bolder {
    font-weight: 500;
    font-size: 15px;
}

label {
    display: block;
    padding-bottom: 2%;
}

input {
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    background-color: #fff;
    padding: 3px 5px;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1);
    width: 190px;
}

.plan-thin {
    font-weight: 400;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    color: #696969;
}

.page-container {
    display: flex;
    flex-direction: column;

    #side-link {
        position: relative;
        top: -3px;

        ::v-deep .n-button-content {
            height: auto;
        }
    }

    .current-inactive-plan {
        color: #fa3f4d;
        border: 1px solid #fa3f4d;
        margin-bottom: 24px;
        padding: 14px;
        border-radius: 5px;
        display: inline-block;
    }

    .under-trial-plan {
        color: #2e31be;
        border: 1px solid #2e31be;
        margin-bottom: 24px;
        padding: 14px;
        border-radius: 5px;
        display: inline-block;
    }

    .filter-dropdown-field {
        display: contents;
    }

    .filter-dropdown {
        align-self: flex-end;
        min-width: 30%;
        display: flex;
        float: left;
    }

    ::v-deep .nitrozen-select-wrapper {
        width: 100%;
    }

    .pagination-dropdown {
        width: 50%;
        margin-left: auto;
    }

    .current-active-plan {
        padding: 14px;
        border-radius: 5px;
        border: 1px solid lightgray;
    }

    .plan-container {
        line-height: 24px;
    }

    .cancel-upgrade-container {
        max-width: 628px;
    }

    .button-container {
        text-align: right;
    }

    .payouts-description {
        margin-bottom: 24px;
        border: 1px solid lightgray;
        padding: 24px;
        background: #f9f9f9;
    }

    .plan-components {
        -webkit-column-count: 3;
        -moz-column-count: 3;
        column-count: 3;
        font-size: 14px;

        li {
            padding: 0px 0px 25px 0px;
        }
    }

    .payouts-table {
        width: 100%;
        margin-bottom: 24px;
        font-family: Inter, sans-serif;
        font-size: 10px;

        ::v-deep .eye-icon>svg {
            width: 16px;
            height: 16px;

            #prefix__Eye_Open {
                stroke: @Mako;
            }

            &:hover {
                box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

                #prefix__Eye_Open {
                    stroke: @RoyalBlue;
                }
            }
        }

        tr:first-child {
            background: #f8f8f8;
            color: black;
        }

        tr:not(:first-child) {
            border-bottom: 1px solid lightgray;
        }

        td {
            text-align: left;
            padding: 15px 21px;

            .actions-container {
                display: flex;
                align-items: center;

                .current-default {
                    text-align: right;
                    color: #2e31be;
                    border: 1px solid #2e31be;
                    padding: 5px;
                }

                .action {
                    cursor: pointer;
                    margin-right: 12px;
                }

                span:nth-child(1) {
                    color: #2e31be;
                    flex: 4;
                }

                span:nth-child(2) {
                    flex: 1;
                }
            }
        }
    }

    .no-payouts-found-message {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid lightgray;
        text-align: center;
    }

    .plans {
        display: flex;

        .plan-item {
            min-width: 150px;
            margin: 10px;
            padding: 10px;
            border: 1px solid lightgray;
        }

        .selected-item {
            border: 1px solid #2e31be;
            color: #2e31be;
            background: #ebedfb;
        }
    }

    .plan-container {
        max-width: 600px;
        min-width: 300px;

        .plan-name {
            font-weight: bold;
        }

        .text-line {
            margin: 5px 0px;
        }

        .spacing-component {
            margin: 10px 0px;
        }

        .subscribe-button {
            height: 50px;
        }
    }
}

.section {
    margin: 20px;

    .sub-section {
        margin: 20px 20px 20px 0px;
    }
}

.date-picker {
    width: 33%;
    margin-right: 10px;
    align-self: flex-end;
    display: flex;
    float: right;
}

.date-content {
    margin-left: auto;
    align-self: flex-end;
    display: flex;
    float: left;
}

.date-search {
    display: flex;
}

::v-deep .nitrozen-dropdown-label {
    align-self: center;
    margin-right: 25px;
    white-space: nowrap;
}

::v-deep .nitrozen-dropdown-container>.nitrozen-dropdown-label {
    margin-right: 10px;
}

.SUCCESS {
    color: green;
}

.FAILED {
    color: red;
}

.DISABLED {
    color: grey;
}

.no-wrap {
    white-space: nowrap;
}

@media (max-width: 1320px) {
    .date-picker {
        width: 35%;
    }

    ::v-deep .n-input-label {
        width: 55%;
    }
}

@media (max-width: 1411px) {
    ::v-deep .form-date-picker.mx-datepicker {
        min-width: 65%;
    }

    .date-picker {
        width: 40%;
    }

    .search {
        margin-right: 30px;
    }
    .date-range-label {
        margin-right: 7%;
    }
}

@media (max-width: 1435px) {
    ::v-deep .filter-Subscriber>label {
        width: 50%;
    }
}
</style>
<script>
import { GET_HELP_SECTION_DATA } from '@/store/getters.type';
import loader from '@/components/common/loader.vue';
import mirageimageuploader from '@/components/common/image-uploader/index.vue';
import admjumbotron from '@/components/common/jumbotron';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import admpageheader from '@/components/common/layout/page-header';
import path from 'path';
import moment from 'moment';
import { TreeView } from 'vue-json-tree-view';
import {
    flatBtn,
    NitrozenBadge,
    NitrozenButton,
    NitrozenCheckBox,
    NitrozenDialog,
    NitrozenDropdown,
    NitrozenError,
    NitrozenInput,
    NitrozenPagination,
    NitrozenToggleBtn,
    NitrozenTooltip,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import root from 'window-or-global';
import { copyToClipboard, debounce } from '@/helper/utils';
import AdminWebhookService from '../../services/admin-webhook.service';
import datePicker from '@/components/common/date-picker.vue';
import admnocontent from '@/components/common/adm-no-content';
const env = root.env || {};
const extraDateRange = [
    {
        text: 'Last 6 Months',
        start: moment().subtract(6, 'months'),
        end: new Date(),
    },
];
export default {
    name: 'webhook-report',
    components: {
        'mirage-image-uploader': mirageimageuploader,
        'adm-jumbotron': admjumbotron,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-error': NitrozenError,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'date-picker': datePicker,
        'nitrozen-tooltip': NitrozenTooltip,
        'adm-page-header': admpageheader,
        'tree-view': TreeView,
        'adm-no-content': admnocontent,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        ...mapGetters({
            helpData: GET_HELP_SECTION_DATA,
        }),
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            companyId: this.$route.params.company_id,
            ssoUrl: '',
            certificate: '',
            entityId: '',
            note: '',
            logo: '',
            dialogInfo: '',
            dateItems: [],
            selectedPayloadName: '',
            dateSelected: '',
            dialogMessage: '',
            startLoader: true,
            query_param: {},
            dialogMessageJson: {},
            contextMenuItems: [
                {
                    text: 'Remove',
                    action: 'remove',
                },
            ],
            pageObject: {
                total: 0,
                current: 1,
                limit: 10,
            },
            pageObjectValue: {},
            isOrganisationUser: [],
            sessionAge: 24,
            dateRangeShortcuts: [...dateRangeShortcuts, ...extraDateRange],
            orderDateRange: [
                moment().subtract(1, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            notBefore: new Date(
                moment().subtract(1, 'months').startOf('month')
            ).toISOString(),
            callbackUrl: '',
            issuer: '',
            selectedProvider: 0,
            ifJson: false,
            assignRolesManually: false,
            webhookReport: [],
            pagination_row: '',
            filter_event_name: '',
            selectedFilters: false,
            filter_events: [],
            filtersToshow: {},
            actualFilters: [],
            filters: [],
            searchText: '',
            dialodWebhookUrl: '',
            rows: [5, 10, 15, 20, 25],
            showErrorPage: false,
            eventMap: {},
            subscriberIdMap: {},
            eventsToShow: {},
            selectedEvents: new Set(),
            docUrl:
                env.SEARCHLIGHT_MAIN_DOMAIN +
                '/docs/company-settings/webhook/webhook',
        };
    },
    mounted() {
        this.populateDate();
        this.fetchQueryFilter();
    },
    methods: {
        searchFilter(event) {
            this.actualFilters.forEach((item, index) => {
                if (item.filter_name == event.id) {
                    this.filters[index]['values'] = this.actualFilters[
                        index
                    ].values.filter((elem) => {
                        const elemText = elem.text.toLowerCase();
                        const eventText = event.text.toLowerCase();
                        if (elemText.includes(eventText)) {
                            return elem;
                        }
                    });
                }
            });
        },
        dateRangeChange(event) {
            this.query_param['start_date'] = moment()
                .subtract(event, 'days')
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss');
            this.query_param['end_date'] = moment()
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss');
            this.search(this.query_param);
        },
        deleteItem(itemName, key) {
            if (itemName == 'all') {
                this.filtersToshow['Subscriber Name'] = [];
                this.filtersToshow['Event'] = [];
                this.query_param['event'] = '';
                this.query_param['subscriber_name'] = '';

                this.selectedFilters = false;
            } else {
                if (this.filtersToshow[key]) {
                    const index = this.filtersToshow[key].indexOf(itemName);
                    if (index > -1) {
                        let filtersVariable = this.filtersToshow[key].filter(
                            (response) => response != itemName
                        );
                        this.filtersToshow[key] = [];
                        this.filtersToshow[key] = filtersVariable;
                    }
                    if (key == 'Event') {
                        if (this.filtersToshow[key].length > 0) {
                            this.query_param['event'] =
                                this.filtersToshow[key].join(',');
                        } else {
                            this.filtersToshow[key] = [];
                            delete this.query_param['event'];
                        }
                    } else {
                        if (this.filtersToshow[key].length > 0) {
                            this.query_param[
                                key.toLowerCase().replace(/ /g, '_')
                            ] = this.filtersToshow[key].join(',');
                        } else {
                            this.filtersToshow[key] = [];
                            delete this.query_param[
                                key.toLowerCase().replace(/ /g, '_')
                            ];
                        }
                    }
                }
            }
            let count = 0;
            Object.keys(this.filtersToshow).forEach((item) => {
                count = count + this.filtersToshow[item].length;
            });
            if (count > 0) {
                this.selectedFilters = true;
            } else {
                this.selectedFilters = false;
            }
            this.search(this.query_param);
        },
        populateDate() {
            this.dateItems.push({ value: '1', text: 'Last 24 hours' });
            this.dateItems.push({ value: '2', text: 'Last 2 days' });
            this.dateItems.push({ value: '7', text: 'Last 1 week' });
            this.dateItems.push({ value: '14', text: 'Last 2 week' });
            this.dateItems.push({ value: '31', text: 'Last 1 month' });
        },
        webhookInput: debounce(function (e) {
            this.query_param['search_text'] = e.search.trim();
            this.search(this.query_param);
        }, 200),
        setRouteQuery(query) {
            this.$router
                .push({
                    path: this.$route.path,
                    query: {
                        page_no: query['page_no'],
                        page_size: query['page_size'],
                        event: query['event'],
                        search_text: query['search_text'],
                        start_date: query['start_date'],
                        end_date: query['end_date'],
                        subscriber_name: encodeURIComponent(query['subscriber_name']),
                    },
                })
                .catch((e) => { });
        },
        filterInputChange(filterName) {
            if (filterName == 'Event') {
                this.query_param['event'] =
                    this.filtersToshow[filterName].join(',');
            } else {
                var key = filterName.toLowerCase().replace(/ /g, '_');
                this.query_param[key] =
                    this.filtersToshow[filterName].join(',');
            }
            let count = 0;
            Object.keys(this.filtersToshow).forEach((item) => {
                count = count + this.filtersToshow[item].length;
            });
            if (count > 0) {
                this.selectedFilters = true;
            } else {
                this.selectedFilters = false;
            }
            this.search(this.query_param);
        },
        clearFilter(filterName) {
            delete this.query_param[filterName];
            this.search(this.query_param);
        },
        clearDateFilter() {
            delete this.query_param['start_date'];
            delete this.query_param['end_date'];
            this.search(this.query_param);
        },
        fetchQueryFilter() {
            AdminWebhookService.getFilterList().then((res) => {
                this.filters = res.data;
                this.eventMap = this.filters[0].values.reduce((a, i) => {
                    a[i.text] = i.value;
                    return a;
                }, {});
                this.subscriberIdMap = this.filters[1].values.reduce((a, i) => {
                    a[i.text] = i.value;
                    return a;
                }, {});
                this.filters[0].values = this.filters[0].values.map((v) => ({
                    ...v,
                    value: v.text,
                }));
                this.filters[1].values = this.filters[1].values.map(
                    (filter) => {
                        filter.text = filter.text;
                        filter.value = filter.text;
                        // filter.value =JSON.stringify(filter.value)
                        return filter;
                    }
                );
                this.actualFilters = JSON.parse(JSON.stringify(this.filters));
                // this.actualFilters[1].values = this.filters[1].values;
                Object.keys(this.$route.query).forEach((key) => {
                    var value = this.$route.query[key];
                    if (value != '') {
                        this.query_param[key] = value;
                    }
                    if (key == 'page_no') {
                        this.pageObject.current = value;
                    }
                    if (key == 'page_size') {
                        this.pageObject.limit = value;
                    }
                    if (key == 'search_text') {
                        this.searchText = value;
                    }
                    if (key == 'event') {
                        if (value) {
                            this.filtersToshow['Event'] = value.split(',');
                        }
                    }
                    if (key == 'start_date') {
                        this.query_param['start_date'] = value;
                    }
                    if (key == 'end_date') {
                        this.query_param['end_date'] = value;
                    }
                    if (key == 'subscriber_name') {
                        if (value && value != 'undefined') {
                            this.filtersToshow['Subscriber Name'] =
                                decodeURIComponent(value).split(',');
                        }
                    }
                });
                let count = 0;
                Object.keys(this.filtersToshow).forEach((item) => {
                    count = count + this.filtersToshow[item].length;
                });
                if (count > 0) {
                    this.selectedFilters = true;
                } else {
                    this.selectedFilters = false;
                }
                if (Object.keys(this.query_param).length === 0) {
                    this.dateRangeChange(1);
                } else {
                    this.search(this.query_param);
                }
            });
        },
        onCopyCode(event, data, type) {
            if (type == 'json') {
                copyToClipboard(JSON.stringify(data));
            } else {
                copyToClipboard(JSON.stringify(data).replace(/['"]+/g, ''));
            }
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
            event.stopPropagation();
            event.preventDefault();
        },
        onCancel() {
            this.$router.push({
                path: 'webhook',
            });
            // this.$router.go(-1);
        },
        showPayload(message, webhook_url_name, event_name) {
            this.startLoader = true;
            this.ifJson = true;
            this.dialogInfo = 'Payload';
            (this.selectedPayloadName = event_name),
                (this.dialodWebhookUrl = webhook_url_name);
            (this.dialogMessageJson = message),
                this.openRemoveDialog('750px', '570px');
            this.startLoader = false;
        },
        paginationChange(filter) {
            const { current, limit } = filter;
            this.pageObject.current = current;
            this.pageObject = Object.assign({}, this.pageObject, filter);
            this.search(this.query_param);
        },
        search(query_param) {
            const encoded_query_param = Object.create(query_param);
            this.dialogMessageJson = {};
            this.ifJson = false;
            this.startLoader = true;
            encoded_query_param['page_no'] = this.pageObject.current;
            encoded_query_param['page_size'] = this.pageObject.limit;
            encoded_query_param['subscriber_name'] =
                decodeURIComponent(query_param['subscriber_name']);
            this.setRouteQuery(encoded_query_param);
            const data = {
                page_no: this.pageObject.current,
                page_size: this.pageObject.limit,
            };
            if (this.searchText && this.searchText.length != 0) {
                data['search_text'] = this.searchText;
            }
            if (query_param['end_date']) {
                data['end_date'] = query_param['end_date'];
            }
            if (query_param['start_date']) {
                data['start_date'] = query_param['start_date'];
            }
            if (this.filtersToshow['Subscriber Name']) {
                data['subscriber_ids'] = this.filtersToshow['Subscriber Name']
                    ? this.filtersToshow['Subscriber Name'].map(
                        (x) => this.subscriberIdMap[(x)]
                    )
                    : [];
            }
            if (this.filtersToshow['Event']) {
                data['event'] = this.filtersToshow['Event']
                    ? this.filtersToshow['Event'].map((x) => this.eventMap[x])
                    : [];
            }
            data["type"] = 'global'
            AdminWebhookService.getWebhookReport(data)
                .then((res) => {
                    if (res.data.items.length > 0) {
                        this.webhookReport = res.data.items.map((items) => {
                            items['webhook_url_trimmed'] =
                                items.webhook_url.substring(0, 30) + '...';
                            items['processed_on'] = moment
                                .utc(items.processed_on)
                                .utcOffset('+05:30')
                                .format('MMM Do, YY hh:mm A');
                            return items;
                        });
                        this.pageObject.total = res.data.page.item_total;
                        this.pageObject.current = res.data.page.current;
                        this.startLoader = false;
                    } else {
                        this.webhookReport = [];
                        this.startLoader = false;
                        this.showErrorPage = true;
                        this.pageObject.total = res.data.page.item_total;
                        this.pageObject.current = res.data.page.current;
                        this.startLoader = false;
                    }
                })
                .catch((err) => {
                    this.dialogInfo = 'ERROR';
                    this.dialogMessage = err.toString();
                    this.startLoader = false;
                    this.showErrorPage = true;
                    this.openRemoveDialog('500px', 'auto');
                });
        },
        sortTable(key) {
            this.webhookReport.sort(function (a, b) {
                var key_a = eval('a.' + key);
                var key_b = eval('b.' + key);
                if (key_a < key_b) return -1;
                if (key_a > key_b) return 1;
                return 0;
            });
        },
        openRemoveDialog: function (width, height) {
            this.$refs['status_dialog'].open({
                width: width,
                height: height,
                overflow: 'scroll',
                showCloseButton: true,
                dismissible: true,
            });
        },
        closeDialog: function () {
            this.$refs['status_dialog'].close();
            this.dialogMessageJson = {};
            this.ifJson = false;
        },
        showHelpSection: function () {
            window.open(this.docUrl, '_blank');
        },
    },
};
</script>