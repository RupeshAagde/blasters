<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <adm-jumbotron class="jumbotron-h" :title="'Webhook Integration'"
                    :desc="'Webhook is a mechanism to get real-time notifications whenever a certain event occurs on Fynd Platform. For example, you\'ll receive a notification whenever you or your staff creates a product, or when your customers place orders.'"
                    btnLabel="Create Webhook" @btnClick="createWebhook">
                    <nitrozen-button theme="secondary" v-strokeBtn @click="reportWebhook">
                        Reports
                    </nitrozen-button>
                </adm-jumbotron>
                <nitrozen-dialog class="test_status_dialog" ref="test_status_dialog" :title="'Selected Events'">
                    <template slot="body">
                        <table class="event-type-content">
                            <tr v-for="(item, key) in selectedWebhookEvent" :key="key">
                            <td class="event-key">{{key}}: </td> <td class="event-value">&nbsp; {{item.join(",")}}</td>
                        </tr>
                        </table>
                </template>
                <template slot="footer">
                <div></div>
            </template>
            </nitrozen-dialog>
        <loader v-if="startLoader" class="loading" ></loader>
        <adm-no-content
            v-if="!startLoader && subscriberList.length === 0"
            :helperText="'No Subscriber Registered'"
        ></adm-no-content>
        <div v-if="subscriberList && subscriberList.length > 0" class="webhook-list" >
            <div v-for="(items, index) in subscriberList" :key="items.id" class="full-width">
                <!-- new cards -->
                <div @click.self="redirectEdit(items.id)" class="blaster-list-card-container" :class="['full-width']">
                    <span @click="redirectEdit(items.id)" class="settings-icon">
                        <img
                            src="/public/assets/admin/svgs/webhook.svg"
                            alt="profile"
                        />
                    </span>
                    <div class="card-content-section">
                        <div @click="redirectEdit(items.id)" class="full-name card-content-line-1">
                            <span class="webhook-span webhook-name">{{items.name? items.name :'NA'}} </span>
                        </div>
                        <div class="card-content-body">
                            <div  @click.self="redirectEdit(items.id)" class="full-name card-content-line-3">
                            <span class="info-heading"> Events</span> <span @click.self="redirectEdit(items.id)"  class="webhook-span list-events">{{items.event_name.length> 3 ? items.event_name.slice(0,2).join(","):items.event_name.join(",")}}
                            <a @click="selectedEvent(items)" class="event-type-count">{{items.event_name.length> 3 ?"+"+(items.event_name.length-3).toString()+"more":""}}</a></span>
                        </div>
                        <div @click="redirectEdit(items.id)" class="full-name card-content-line-3">
                            <span class="info-heading"> Modified by  </span> <span class="webhook-span user-details">{{items.modified_by}}</span> 
                        </div>
                        <div @click="redirectEdit(items.id)" class="full-name card-content-line-3">
                            <span class="info-heading">Modified on </span><span class="webhook-span user-details">{{items.updated_on}}</span>
                        </div>
                        </div>
                        
                    </div>
                    <div @click.self="redirectEdit(items.id)" class="card-badge-section">
                        <nitrozen-badge
                            v-if="items.status=='active'"
                            class="tag"
                            state="success"
                            >Active</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="items.status=='blocked'"
                            class="tag"
                            state="default"
                            >Blocked</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="items.status=='inactive'"
                            class="tag"
                            state="default"
                            >Inactive</nitrozen-badge
                        >
                        <nitrozen-menu 
                        class="dot-menu"
                        mode="vertical"
                        ref="list-menu"
                        >
                            <nitrozen-menu-item @click="report(items.id)">
                                View Report
                            </nitrozen-menu-item>
                            <nitrozen-menu-item @click="onCopyCode($event,items.webhook_url); closeContextMenu(index)">
                                Copy
                            </nitrozen-menu-item>
                        </nitrozen-menu>
                    </div>
                </div>
                
            </div>
            <nitrozen-pagination
                name="Items"
                v-model="pageObject"
                value= "pageObjectValue"
                @change="paginationChange"
                :pageSizeOptions="rows"
            >
            </nitrozen-pagination>
        </div>
        </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.webhook-report-btn{
    height: 30px;
    margin-right: 15px;
    padding: 12px;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 11px;
    line-height: 21px;
    text-align: center;
    color: #2E31BE;
}
.list-events{
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 21px;
    color: #666666;
}
.card-content-line-3:hover{
    color: black
}

.card-content-line-3{
    display: flex;
    flex-direction: column;
    width: fit-content;
    white-space: nowrap;
}
.event-type-content{
    border-collapse: separate;
    border-spacing: 0 1em;
}
.webhook-name{
    font-size: 1.125rem;
}
.info-heading{
    color: #9B9B9B;
}
.event-value{
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    color: #41434C;
}
.event-key{
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #41434C;
}
.user-details{
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 21px;
    color: #666666;
}
::v-deep .nitrozen-badge{
    float: right;
}
.card-detail{
    margin-top: 50px;
}
::v-deep #prefix__Capa_1 {
    fill: green;
    color: green;
    width: 15px;
    height: 15px;
}
::v-deep  svg#prefix__Capa_1 > g {
    fill: #494BC6
}

.webhook-list{
    width: 100%
}
.card-content-line-badge-3{
    margin-left: 8px;
}

.card-content-body{
    width: 100%;
    display: flex;
    gap: 1.5rem;
}


.settings-icon {
    // min-width: 7%;
    width: 4.375rem;
    height: 4.375rem;
    margin-right: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid @Alabaster2;
    background-color: @Alabaster2;
    border-radius: 50%;
    img {
        width: auto;
    }
}
span{
    word-break: break-all;
}
.nitrozen-checkbox-container{
    color: #9b9b9b;
    font-family: Inter,sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.jumbotron-h {
    margin-bottom: 15px;
    box-sizing: border-box;
    width: 100%;
    @media @mobile {
        min-height: initial;
    }
}
.test-webhook-btn{
    align-self: flex-start;
    background-color: #2E35BE;
    color: white;
}
.card-badge-section{
    display: flex;
    color: #9B9B9B;
    line-height: 15px;
    font-size: 12px;
    align-self: flex-end;
    height: 100%;
    gap: 1.125rem;
}

::v-deep #Shape-Copy-2{
    fill: #8F8F8F;
}
::v-deep .nitrozen-dialog{
    max-height: 50%;
}
::v-deep .nitrozen-dialog-footer {
    height: unset;
}
::v-deep .nitrozen-badge-success{
    border: 1px solid #0A5F23 !important;
    color: #0A5F23 !important;
}

.card-badge-section ::v-deep .nitrozen-badge{
    width: 5.688rem;
    text-align: center;
    border-radius: 4px;
}
.main-container {
    width: auto;
    display: block;
    margin: 24px;
    border-radius: 4px;
    @media @mobile {
        margin: 0px !important;
    }
}
.card-content-line-1{
    margin-bottom: 5px;
    word-break: break-all;
    font-size: 15px !important;
    line-height: 10px;
}
.card-content-line-2{
    margin-bottom: 1px;
    font-weight: 400;
    font-size: 14px !important;
    color: black !important;
}
.event-type-count{
    color: #494BC6;
    font-weight: 600;
    text-decoration: none;
    z-index: 1000;
}
.inline_column{
    display: flex;
    margin-bottom: 35px;
}
.inline_test-webhook-column{
    display: flex;
    margin-top: 60px;
}
.width{
    width: 100%;
}
.events_group{
    border: 1px solid #ADADAD;
    padding: 2%;  
}
.page-container {
    display: flex;
    flex-wrap: wrap;
    width: auto;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;
    .copy {
        cursor: pointer;
        float: right;
    }
    @media @mobile {
        padding: 24px 24px 0px 24px;
    }
}
.webhook-settings-container {
    width: 100%;
    margin-right: 24px;
    .page-container {
        padding-bottom: 24px;
    }
    @media @mobile {
        width: 100%;
        margin-right: 0px;
    }
    .error {
        margin-bottom: 10px;
    }
    .logo-upload {
        margin-bottom: 10px;
    }
    .visibility-visible {
        visibility: visible;
    }
    .visibility-hidden {
        visibility: hidden;
    }

    .submit {
        width: 100px;
        align-self: flex-end;
        @media @mobile {
            width: 100%;
        }
    }
}
.webhook-url-text{
    color: blue;
}
.sp-settings-container {
    width: 40%;
    @media @mobile {
        width: 100%;
        margin-bottom: 24px;
    }
}
.sub-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    line-height: 35px;
    .bold-xs {
        font-size: 18px;
    }
}
.full-width {
    width: 100%;
    display: flex;
    @media @mobile {
        flex-direction: column-reverse;
    }
}
.common-container {
    width: auto;
    padding: 0 24px 24px 24px;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
}
.form-row {
    .input-container {
        display: flex;
        .nitrozen-form-input {
            flex-grow: 1;
        }
        nitrozen-button {
            margin-left: 15px;
        }
        .svg {
            margin-left: 5px;
        }
    }
}
.no-role-container{
    display:flex;
}
.refresh-icon{
    margin:0px 10px;
    cursor: pointer;
}
.check-item{
    margin:10px 0px 15px 0px;
    /deep/label{
        padding-top:3px;
    }  
    color: #9b9b9b;
    font-family: Inter,sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.mb15 {
    margin: 15px 0;
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.blaster-list-card-container {
        width: 100%;
        overflow: visible;
}
.staff-list {
    width: auto;
    background-color: @White;
    .blaster-list-card-container{
        width: 100%;
        overflow: visible;
        .verified-icon {
            display: inline;
            ::v-deep svg {
                cursor: pointer;
                width: 12px;
                height: 12px;
            }
        }
        .left-space-s {
            margin-left: 4px;
        }
        .left-space-md {
            margin-left: 12px;
        }
        .separator {
            width: 12px;
            text-align: center;
        }
        .tag {
            float: right;
        }
        .tooltip {
            text-transform: none;
            position: relative;
            &:hover {
                .tooltiptext {
                    visibility: visible;
                    max-height: 250px;
                    overflow-y: scroll;
                }
            }
            .nitrozen-tooltip-bottom {
                top: 120%;
                left: -5em;
                margin-left: -20px;
                &::after {
                    bottom: 100%;
                    left: 80%;
                    -webkit-transform: rotate(180deg);
                    transform: rotate(180deg);
                }
            }
            .tooltiptext {
                visibility: hidden;
                color: black;
                border-radius: 6px;
                padding: 15px;
                border: 1px solid #e4e5e6;
                position: absolute;
                z-index: 1;
                max-width: 100px;
                min-width: 100px;
                line-height: 1.7;
                background-color: #ebedfb;
                &::after {
                    content: ' ';
                    position: absolute;
                    border-style: solid;
                    border-color: #ebedfb transparent transparent transparent;
                    border-width: 5px;
                }
            }
        }
        .card-avatar {
            display: flex;
            align-items: center;
            img {
                min-height: 60px;
                max-height: 60px;
                min-width: 60px;
                max-width: 60px;
                border-radius: 50%;
            }
        }
        .full-name {
            color: @RoyalBlue;
        }
    }
}
.full-width {
    width: 100%;
}

</style>

<script>
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import { GET_HELP_SECTION_DATA } from '@/store/getters.type';
import loader from '@/components/common/loader.vue';
import mirageimageuploader from '@/components/common/image-uploader/index.vue';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';
import admjumbotron from '@/components/common/jumbotron';
import SamlProvider from '@/components/settings/saml-provider';
import admnocontent from '@/components/common/adm-no-content';
import path from 'path';
import { copyToClipboard } from '@/helper/utils';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenError,
    NitrozenCheckBox,
    NitrozenToggleBtn,
    NitrozenBadge,
    NitrozenPagination,
    NitrozenDialog,
    strokeBtn, NitrozenMenu,
    NitrozenMenuItem
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import moment from 'moment';
import svg from '@/auto_gen/admin-svgs.js';
import AdminWebhookService from '@/services/admin-webhook.service';

export default {
    name: 'list-webhooks',
    components: {
        'nitrozen-menu' : NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'inline-svg': inlinesvg,
        'mirage-image-uploader': mirageimageuploader,
        'adm-jumbotron': admjumbotron,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-error': NitrozenError,
        'nitrozen-toggle': NitrozenToggleBtn,
        'saml-provider': SamlProvider,
        'adm-inline-svg': admInlineSvg,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'adm-no-content': admnocontent,
        loader: loader
    },
    directives: {
        flatBtn,
        strokeBtn
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
            selectedWebhookEvent: {},
            entityId: '',
            note: '',
            logo: '',
            sessionAge: 24,
            startLoader: false,
            callbackUrl: '',
            issuer: '',
            query_param: {},
            dateEvent:{},
            dates: {},
            rows: [5, 10, 15, 20, 25],
            pageObject: {
                total: 0,
                current: 1,
                limit: 10,
            },
            selectedProvider: 0,
            assignRolesManually: false,
            subscriberList: '',
            copyIcon: svg['webhook-copy'],
            role: ''
        };
    },
    mounted() {
        sessionStorage.clear();
        this.getSubscriberList()
    },
    methods: {
        dateRangeChanges(event) {
            this.dates['start_date'] = moment()
                .subtract(event, 'days')
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss');
            this.dates['end_date'] = moment()
                .utc()
                .format('YYYY-MM-DDTHH:mm:ss');
            this.dateEvent=event;
            sessionStorage.setItem('Date',this.dateEvent);
        },
        report(name) {
            this.dateRangeChanges(1);
            let date={
                "start_date": this.dates['start_date'],
                "end_date": this.dates['end_date'],
                "subscriber_ids":[name],
            };
            let subs={
                "Subscriber Name":[name],
            };
            sessionStorage.setItem("data",JSON.stringify(date));
            sessionStorage.setItem("companyId",this.companyId);
            sessionStorage.setItem("filtersSelected",JSON.stringify(subs));
            let path = `webhook-report` + `/${name}`
            this.$router.push({
                path: path
            });
        },
        selectedEvent(item) {
            var flatternEvent = _.mapValues(
                _.groupBy(item.event_configs, 'event_name'),
                (clist) =>
                    clist.map((event) =>
                        _.omit(event, 'event_name')
                    )
            );
            var eventObj = {}
            Object.keys(flatternEvent).forEach((key, index) => {
                flatternEvent[key].forEach(elem => {
                    if (key in eventObj) {
                        eventObj[key].push(elem['event_type']);
                    } else {
                        eventObj[key] = [elem['event_type']];
                    }
                })

            })
            this.selectedWebhookEvent = eventObj
            this.openTestDialog()
        },
        onCopyCode(event, data) {
            copyToClipboard(data);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
            event.stopPropagation();
            event.preventDefault();
        },
        paginationChange(filter) {
            const { current, limit } = filter;
            this.pageObject.current = current;
            this.pageObject = Object.assign({}, this.pageObject, filter);
            this.getSubscriberList();
        },
        reportWebhook() {
            this.$router.push({
                path: 'webhook-report'
            });
        },
        getSubscriberList() {
            this.startLoader = true
            this.query_param = {
                page_no: this.pageObject.current,
                page_size: this.pageObject.limit
            }
            AdminWebhookService.getSubscriberList(this.query_param).then((res) => {
                this.subscriberList = res.data.items.map(item => {
                    item["updated_on"] = moment.utc(item.updated_on).utcOffset("+05:30").format('MMM Do, YY hh:mm A');
                    return item;
                })
                this.subscriberList.map(item => {
                    var itemGroup = _.mapValues(_.groupBy(item.event_configs, 'event_name'),
                        clist => clist.map(event => _.omit(event, 'event_name')));
                    var element_front_name = []
                    Object.keys(itemGroup).forEach((key, index) => {
                        element_front_name.push(key)
                    });
                    if (element_front_name.length > 0) {
                        item['event_name'] = element_front_name;
                    } else {
                        item['event_name'] = ["No events subscriber"]
                    }
                    return item
                })
                this.pageObject.total = res.data.page.item_total
                this.pageObject.current = res.data.page.current
                this.startLoader = false
            })
                .catch((err) => {
                    this.startLoader = false
                    console.log(err, 'error');
                })

        },
        createWebhook() {
            this.$router.push({
                path: 'create-webhook',
            });
        },
        redirectEdit(id) {
            this.$router.push({
                path: `edit-webhook/${id.toString()}`,
            });
        },
        openTestDialog: function () {
            this.$refs['test_status_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
            });
        },
        closeTestDialog: function () {
            this.$refs['test_status_dialog'].close();
        },
        closeContextMenu(i){
            console.log("dqdqd",this.$refs['list-menu'])
            this.$refs['list-menu'][i].closeMenu()
        }
    },
};
</script>
