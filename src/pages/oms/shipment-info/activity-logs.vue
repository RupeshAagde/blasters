<template>
    <div class="activity-logs-wrapper">
        <adm-loader v-if="!hasShipmentActivityFetched"> </adm-loader>
        <adm-no-content
            v-if="hasShipmentActivityFetched &&
                (activityLogsData === undefined || activityLogsData.length === 0)
            "
            :helperText="`No activity logs found for the shipment ID: ${shipmentId}`"
        ></adm-no-content>
        <div class="activity-logs-container" v-if="activityLogsData.length > 0">
            <div class="check-box">
                <nitrozen-checkbox
                    @change="toggle('activity_status')"
                    v-model="checkBoxValue"
                    >Status ({{
                        getLength(['activity_status', 'activity_escalation', 'activity_comment'])
                    }})</nitrozen-checkbox
                >

                <nitrozen-checkbox @change="toggle('outbound_notification')"
                    >Email &#38; SMS ({{
                        getLength(['outbound_notification'])
                    }})</nitrozen-checkbox
                >

                <nitrozen-checkbox @change="toggle('outbound_voice')"
                    >Call ({{ getLength(['outbound_voice']) }})</nitrozen-checkbox
                >
            </div>
            <div class="all-logs" v-if="arrr">
                <div v-for="(types, index) in arrr" :key="index">
                    <div class="all-day">{{ calenderFormat(types) }}</div>
                    <div class="style-margin">
                        <div
                            v-for="(status, index) in sortedHistory"
                            :key="index"
                        >
                            <div
                                class="all-status"
                                v-if="
                                    calenderFormat(types) ==
                                    showDate(status.dateInMilli)
                                "
                            >
                                <div class="date">
                                    {{
                                        showTime(status.dateInMilli)
                                    }}
                                </div>
                                <div class="message">
                                    <div>{{ status.message }} </div>
                                    <div 
                                        class="message-info" 
                                        v-if="status.meta">
                                        <div v-if="status.meta && status.meta.sms"> 
                                            <span class="message-label"> Message: </span> {{ status.meta.sms }}
                                        </div>
                                        <div v-if="status.meta && status.meta.reason && status.meta.reason.display_name && status.meta.reason.text"> 
                                            <span class="message-label"> Reason: </span> {{ status.meta.reason.display_name }}({{ status.meta.reason.text }})
                                        </div>
                                        <div v-if="status.meta && status.meta.slug"> 
                                            <span class="message-label"> Event Name: </span> {{ status.meta.slug }}
                                        </div>
                                        <div v-if="status.meta && status.meta.channel_type"> 
                                            <span class="message-label"> Channel Name: </span> {{ status.meta.channel_type }}
                                        </div>
                                        <div v-if="status.meta && status.meta.recipient"> 
                                            <span class="message-label"> Recipient: </span> {{ status.meta.recipient }}
                                        </div>
                                    </div>
                                </div>
                                <div class="user">{{ status.user }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="warn-message" v-if="!arrr.length">
                <adm-no-content
                    helperText="No items found"
                ></adm-no-content>
            </div>
            <!-- <div class="all-logs">
                <div
                    v-for="(status, index) in shipment.activity_logs[0].status"
                    :key="index.user"
                >
                    <div class="all-status" v-if="isStatus">
                        <div class="date-message">
                            <span>{{ showTime(status.date) }}</span>
                            <span>{{  status.message }}</span>
                        </div>
                        <div class="user">{{ status.user  }}</div>
                    </div>
                </div>
                <div
                    v-for="(status, index) in shipment.activity_logs[0].email_sms"
                    :key="index.user"
                >
                    <div class="all-status" v-if="isEmailSms">
                        <div class="date-message">
                            <span>{{ showTime(status.date) }}</span>
                            <span>{{  status.email }}</span>
                        </div>
                        <div class="user">{{ status.user  }}</div>
                    </div>
                </div>
                <div
                    v-for="(status, index) in shipment.activity_logs[0].call"
                    :key="index.user"
                >
                    <div class="all-status" v-if="isCall">
                        <div class="date-message">
                            <span>{{ showTime(status.date) }}</span>
                            <span>{{  status.message }}</span>
                        </div>
                        <div class="user">{{ status.user  }}</div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

/* Components import */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import admLoader from '@/components/common/loader.vue';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';


export default {
    name: 'activity-logs',
    props: {
        shipmentId: String,
        tab: Number,
        hasShipmentActivityFetched: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            checkBoxValue: true,
            isStatus: false,
            isEmailSms: false,
            isCall: false,
            arrr: [],
            newParsedArr: [],
            sortedHistory: [],
            checkBoxSelectedValue: [],
            typesArray: [],
            activityLogsData : []
        };
    },
    mounted() {},
    components: {
        'adm-no-content': AdmNoContent,
        'nitrozen-checkbox': NitrozenCheckBox,
        'adm-loader': admLoader,
        NitrozenDropdown,
    },
    computed: {},
    methods: {
        convertToOMSDate,
        /**
         * This functions is being called from the parent component
         * reason for calling it from the parent was we are showing
         * loader which is passed as a prop until api is giving the data.
         * but all the code was in the mounted block. but the mounted was run
         * before data is assigned in the parent component and we could not
         * display anything in the UI.
         * @author: Sameer Shaikh
         *
         */
         callItInitially(data) {
          this.activityLogsData = data
            // The below loop is written to put all the types(status, email, calls) in one array for the purpose
            // of showing the number of types of status, email, calls
            for (let i in this.activityLogsData) {
                this.typesArray.push(this.activityLogsData[i].type);
            }

            // We are adding some new keys to the activity history to ease our work
            if (this.activityLogsData) {
                this.newParsedArr = this.activityLogsData.map((item) => {
                    let copyItem = cloneDeep(item);
                    // copyItem['message'] = JSON.parse(item.message);
                    copyItem['message'] = item.display_message;
                    copyItem['meta'] = item.meta
                    copyItem['dateInMilli'] = Date.parse(
                        this.sendTrimValue(item.createdat)
                    );
                    copyItem['properDate'] = moment(
                        Date.parse(this.sendTrimValue(item.createdat))
                    ).format('DD MMMM, YYYY');
                    copyItem['createdat'] = this.sendTrimValue(item.createdat);
                    return copyItem;
                });
                this.toggle('activity_status');
            }
        },

        // the below function is used to get the length of a particular type of checkbox value
        getLength(value) {
            let total = 0;
            let numberOF = [];
            for(let item in value) {
                numberOF = this.typesArray.filter((x) => x == value[item]);
                total = total + numberOF.length;
            }
            return total;
        },

        // the below function is used to get the time in the required format
        showTime(date) {
            return moment(date).format('LT');
            // return date.substring(date.indexOf(',')+1).trim();
            //return moment(date).fromNow()
        },

        // the below function is used to convert the date to a paritcular format so that we can compare it
        showDate(date) {
            let pDate = moment(date).format('D MMM YYYY');
            return this.calenderFormat(pDate);
        },

        // this function is used to push and pop the value from an array
        pushAndPop(filterName, value) {
            if (filterName == true) {
                value.forEach((item) => {
                    this.checkBoxSelectedValue.push(item)
                })
                
            } else if (filterName == false) {
                for(let item in value) {
                    this.checkBoxSelectedValue = this.checkBoxSelectedValue.filter(
                    (v) => v !== value[item]
                );
                }
            }
        },

        toggle(value) {
            if (value == 'activity_status') {
                this.isStatus = !this.isStatus;
                let newValues = [];
                newValues.push(value);
                newValues.push('activity_escalation');
                newValues.push('activity_comment');
                this.pushAndPop(this.isStatus, newValues);
            }

            if (value == 'outbound_notification') {
                this.isEmailSms = !this.isEmailSms;
                let newValues = [];
                newValues.push(value);
                this.pushAndPop(this.isEmailSms, newValues);
            }
            if (value == 'outbound_voice') {
                this.isCall = !this.isCall;
                let newValues = [];
                newValues.push(value);
                this.pushAndPop(this.isCall, newValues);
            }
            this.sortByCheckBox(this.newParsedArr);
        },

        // in this function we put the values in the array of the selected checkboxes
        sortByCheckBox(newArray) {
            let sortedCheckBoxArray = newArray.filter((item) => {
                return this.checkBoxSelectedValue.includes(item.type);
            });
            this.sortByDateTime(sortedCheckBoxArray);
        },
        sendTrimValue(string) {
            let a = string.slice(0, -3);
            return a;
        },

        // this function sorts the array with respect to time
        sortByDateTime(newArr) {
            this.sortedHistory = newArr.sort((a, b) => {
                return moment(a.dateInMilli).diff(b.dateInMilli);
            });
            this.sortedHistory.reverse();
            this.divideByDate();
        },

        divideByDate() {
            // the below map returns us trimed version of date after the comma
            const properDate = this.sortedHistory.map((item) =>
                // item.createdat
                //     .trim()
                //     .substring(0, item.createdat.trim().indexOf(','))
                moment(item.dateInMilli).format('D MMM YYYY')
            );

            // this removes the duplicate values in the array
            this.arrr = properDate.filter(
                (item, index) => properDate.indexOf(item) === index
            );
        },

        // this is speicifically used for the format of date shown in the UI
        calenderFormat(value) {
            let today = new moment().format('D MMM YYYY');
            let yesterday = new moment()
                .subtract(1, 'day')
                .format('D MMM YYYY');

            if (value == today) {
                return "Today"// moment(value).format('[Today]');
            } else if (value == yesterday) {
                 return "Yesterday"//moment(value).format('[Yesterday]');
            } else {
                return value //moment(value).format('Do MMMM, YYYY');
            }
        },
    },
};
</script>

<style lang="less" scoped>
.activity-logs-container {
    .check-box {
        display: flex;
        flex-direction: row;
        gap: 20px;
        padding-bottom: 32px;
        height: 20px;
    }

    .all-logs {
        .all-day {
            font-weight: 400;
            font-size: 16px;
            line-height: 19px;
            color: #41434c;
            margin-bottom: 16px;
        }

        .style-margin {
            margin-bottom: 24px;
        }

        .all-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            border-radius: 4px;
            background: #f7f7f7;
            padding: 16px;
            width: 100%;
            margin-bottom: 16px;
            font-size: 12px;

            .date {
                width: fit-content;
                font-weight: 400;
                padding-right: 40px;
            }
            .message {
                flex: 1;
                font-weight: 500;
                line-height: 18px;

                .message-info{
                    padding-top: 8px;
                }
                .message-label{
                    font-weight: 600;
                }
            }
            .user{
                font-weight: 300;
                text-align: end;
                padding-left: 15px;
            }
        }
    }
}
</style>
