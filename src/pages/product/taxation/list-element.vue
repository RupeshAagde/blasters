<template>
    <div>
        <table class="mirage-table" v-if="tableData && tableData.length">
            <tr>
                <td v-for="(col, index) in tableColumns" :key="'col-' + index">
                    {{ col }}
                </td>
            </tr>
            <template>
                <tr v-for="(tab, index) in hsnWithActivetaxes" :key="index">
                    <td class="first-col">{{ tab.reporting_hsn }}</td>
                    <td>{{ tab.hsn_code }}</td>
                    <td>{{ formatString(tab.type) }}</td>

                    <td>
                        {{
                            tab.taxes.length
                                ? format_date(tab.taxes[0].effective_date)
                                : `No effective date`
                        }}
                    </td>
                    <td>
                        {{
                            tab.taxes.length
                                ? `>\u20B9${tab.taxes[0].threshold}  @ ${tab.taxes[0].rate}%`
                                : `No active rate available`
                        }}
                    </td>
                    <td>
                        {{
                            tab.taxes.length>1
                                ? `>\u20B9${tab.taxes[1].threshold} @ ${tab.taxes[1].rate}%`
                                : '—'
                        }}
                    </td>

                    <td>{{ format_country(tab.country_code) }}</td>
                    <td>
                        <inline-svg
                            class="edit-btn"
                            title="edit hsn"
                            src="edit-blue"
                            @click.stop.native="redirectEdit(tab.reporting_hsn)"
                        ></inline-svg>
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import debounce from 'lodash/debounce';
import path from 'path';
import moment from 'moment';
import { NitrozenButton, strokeBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'list-element',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        InlineSvg,
        NitrozenButton
    },
    directives: {
        strokeBtn
    },
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        tableColumns: {
            type: Array,
            default: () => []
        },
        countryList:{
            type: Array,
            default: () => []
        },
        selectedIds: {
            type: Array,
            default: () => []
        },
        entityType: {
            type: String
        },
        activeTab: {
            type: Number
        }
    },
    computed: {
    },
    mounted() {
        this.hsnWithActivetaxes = this.getHsnWithActiveTax();
    },
    data() {
        return {
            selectAll: false,
            hsnWithActivetaxes: []
        };
    },
    methods: {
        formatString(str) {
            if (str.length > 0) {
                let tempStr = str;
                return tempStr[0].toUpperCase() + tempStr.slice(1);
            }
            return 'type not found';
        },
        format_date(value) {
            if (value) {
                return moment(value).format('D MMM, YYYY');
            }
        },
        format_country(value){
            for (let country of this.countryList){
                if(country.value==value){
                    return country.text
                }
            }
            return value
        },
        redirectEdit(code) {
            let redirectPath = `${code}/edit`;
            this.$router.push({
                path: path.join(this.$route.path, redirectPath)
            });
        },
        getHsnWithActiveTax() {
            let currentDate = new Date().setHours(23);
            currentDate = new Date(currentDate).toISOString();
            currentDate = this.dateToComparableNumber(currentDate);
            let hsnCodes = [];

            for (let data of this.tableData) {
                let activeDate = 0;
                let hsn = { ...data };
                let taxes = [];
                let hsnWithActivetax = {};

                let taxdict = {};
                let dateArr = [];

                for (let tax of data.taxes) {
                    let tempdate = this.dateToComparableNumber(
                        tax.effective_date
                    );
                    dateArr.push(tempdate);
                }
                let dateArrSet = new Set(dateArr);
                dateArr = [...dateArrSet];
                dateArr = dateArr.filter((item) => item <= currentDate);
                activeDate = dateArr.sort().reverse()[0];
                for (let tax of data.taxes) {
                    let tax_date = this.dateToComparableNumber(
                        tax.effective_date
                    );
                    if (tax_date == activeDate) {
                        taxes.push(tax);
                    }
                }
                taxes.sort(function(a, b) {
                    return a.thresohld - b.threshold;
                });
                hsn.taxes = taxes;
                hsnCodes.push(hsn);
            }
            return hsnCodes;
        },
        dateToComparableNumber(data) {
            let temp = data.split('T')[0];
            temp = Number(temp.replaceAll('-', ''));
            return temp;
        }
    }
};
</script>

<style lang="less" scoped>
.mirage-table {
    width: 100%;
    font-family: Inter;
    font-size: 12px;
    border: 1px solid @Iron;
    border-radius: 4px;

    tr:first-child {
        background: #f6f6f6;
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        border-radius: 4px;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: #41434c;
    }
    tr:not(:first-child) {
        border-bottom: 1px solid @Iron;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        // opacity: 0.5;
        color: grey;
    }
    td {
        vertical-align: middle;
        text-align: left;
        padding: 16px 16px;
        .edit-btn {
            float:left;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }
    }
    .first-col {
        font-weight: 500;
    }
}
</style>
