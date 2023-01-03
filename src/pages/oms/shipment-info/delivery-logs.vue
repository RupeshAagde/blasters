<template>
    <div class="activity-logs-wrapper">
        <shimmer v-if="loading" :count="4" />
        <div class="activity-logs-container" v-if="!loading && dpActivity.length > 0">
            <div class="all-logs" v-if="datesArr">
                <div v-for="(types, index) in datesArr" :key="index">
                    <div class="all-day">{{ calenderFormat(types) }}</div>

                    <div class="style-margin">
                        <div
                            v-for="(status, index) in sortedHistory"
                            :key="index"
                        >
                            <div
                                class="all-status"
                                v-if="calenderFormat(types) == showDate(status.dateInMilli) && status.reason"
                            >
                                <div class="child">
                                    <div class="date-message">
                                        <span>{{
                                            showTime(status.dateInMilli)
                                        }}</span>
                                    </div>

                                    <div class="location">
                                        <span>{{ status.reason }}</span>
                                        <span>
                                            <span class="key"> Location: </span>
                                            {{
                                                status.last_location_recieved_at
                                            }}</span
                                        >
                                        <span>
                                            <span class="key"> Status: </span>
                                            {{ status.status }}</span
                                        >
                                        <span
                                            ><span class="key">Raw status: </span
                                            >{{ status.raw_status }}</span
                                        >
                                           <span>
                                            <span class="key">Meta: </span>
                                           <pre class="json">{{jsonString(status.meta) }}</pre>
                                           </span>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <adm-no-content
            v-if="noData || fetchError"
            :helperText="'No delivery logs found'"
        ></adm-no-content>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/* Components import */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import AdmShimmer from '@/components/common/shimmer.vue';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';

/* service imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'delivery-logs',
    props: {
        shipmentId: String
    },

    data() {
        return {
            datesArr: [],
            dpActivity: [],
            fetchError: false,
            loading: false,
            newParsedArr: [],
            noData: false,
            sortedHistory: [],
            typesArray: []
        };
    },

    components: {
        'adm-no-content': AdmNoContent,
        'nitrozen-checkbox': NitrozenCheckBox,
        NitrozenDropdown,
        'shimmer': AdmShimmer
    },

    mounted() {
        this.fetchDeliveryLogs();
    },

    methods: {
        convertToOMSDate,
        isEmpty,

        /**
         * This method checks if the date string from the parameter
         * matches today's or yesterday's date.
         * If yes, it will return the desired text format (Today/Yesterday).
         * If not, it will return the date string as it.
         *
         * @author: Sameer Shaikh
         * @param {String} value Date in the string format of D0 MMMM, YYYY (2nd November, 2022)
         * @returns Date string as Today/Yesterday/{Date String in the above format}
         */
        calenderFormat(value) {
            let today = moment().format('Do MMMM, YYYY');
            let yesterday = moment().subtract(1, 'day').format('Do MMMM, YYYY');
            if (value == today) {
                return 'Today' //moment(value).format('[Today]');
            } else if (value == yesterday) {
                return 'Yesterday' //moment(value).format('[Yesterday]');
            } else {
                return value;
            }
        },

        /**
         * In this method, we are modifying the date to the required format
         * and removing the duplicate values.
         *
         * @author: Sameer Shaikh
         */
        divideByDate() {
            /*
                In the below function, we change the date format to Do MMM, YYYY
                e.g. 2nd November, 2022.
            */
            const properDate = this.sortedHistory.map((item) => {
                return moment(item.updated_time).format('Do MMMM, YYYY');
            });

            /* This removes the duplicate values in the array */
            this.datesArr = properDate.filter(
                (item, index) => properDate.indexOf(item) === index
            );
        },

        /**
         * Method to fetch the delivery logs
         *
         * @author: Rushabh Mulraj Shah, Sameer Shaikh
         */
        fetchDeliveryLogs() {
            this.loading = true;

            let params = {
                shipment_id: this.shipmentId
            };

            let request = OrderService.fetchDpActivityLogs(params);

            return request
            .then((response) => {
                let data = response.data?.results;
                if(data && !isEmpty(data)) {
                    this.dpActivity = cloneDeep(data);
                    this.noData = false;

                    this.newParsedArr = data.map((item) => {
                        item['dateInMilli'] = Date.parse(item.updated_time);
                        if (item.meta && item.meta.pod) {
                            delete item.meta.pod;
                        }
                        return item;
                    });

                    this.sortByDateTime(data);
                } else {
                    this.dpActivity = [];
                    this.noData = true;
                }
            })
            .catch((error) => {
                this.fetchError = true;
                this.$snackbar.global.showError(
                    'Unable to fetch the activity logs for delivery status. Kindly try again after some time.',
                    3500
                );
                console.error(
                    'Error in fetching the delivery activity logs:   ',
                    error
                );
            })
            .finally(() => {
                this.loading = false;
            })
        },

        /**
         * This function just task meta json and returns stingifed and butified json to diplay
         * it in the pre html tag
         * @author: Sameer Shaikh
         * @param {json}
         * @return: stringified json
         */
        jsonString(json){
            // return JSON.stringify(json, null, `\t`)
             return JSON.stringify(json, null, 2)
        },


        /**
         * This method will sort the array according to date-time,
         * and then reverse it.
         * Finally, the reversed sorted data is sent forward for grouping
         * to divideByDate
         *
         * @see divideByDate()
         * @author: Sameer Shaikh
         * @param {Array} newArr Formatted data received in props
         */
        sortByDateTime(newArr) {
            this.sortedHistory = newArr.sort((a, b) => {
                return moment(a.dateInMilli).diff(b.dateInMilli);
            });
            this.sortedHistory.reverse();
            this.divideByDate();
        },

        /**
         * This method converts date to the time format required
         * as per the design
         *
         * @author: Sameer Shaikh
         * @param {String} date The date in string format
         * @returns The time format of the date
         */
        showTime(date) {
            return moment(date).format('LT');
        },


        showDate(date) {
            let pDate = moment(date).format('Do MMMM, YYYY');
            return this.calenderFormat(pDate.trim());
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
            justify-content: flex-start;
            box-sizing: border-box;
            border-radius: 4px;
            background: #f7f7f7;
            color: #41434c;
            padding: 16px;
            width: 100%;
            margin-bottom: 16px;
            .child {
                position: relative;
                display: flex;
                gap: 30px;
                .date-message {
                    display: flex;
                    gap: 40px;
                    align-items: center;
                    width: 70px;
                }
                .location {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    gap: 15px;
                    .key {
                        color: #41434c;
                        font-weight: 600;
                    }
                    .json{
                        font-family: Menlo, Monaco, Consolas, monospace;
                        color: #41434c;
                        font-weight: 400;
                        font-size: small;
                    }
                }
            }
        }
    }
}
</style>
