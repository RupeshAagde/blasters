<template>
    <div v-if="creditTransaction" class="container">
        <div class="inside-container">
            <div class="left-container">
                <div class="line-1">{{ getType }}
                </div>
                <div class="line-2 display-block">
                    <span>{{creditTransaction.description | capitalize}}</span>
                    <span v-if="creditTransaction.invoice"> | <a class="view-invoice" :href="openInvoicePage()" v-if="creditTransaction.invoice">View invoice</a></span>
                </div>
                <div class="line-2 transaction-id-line">
                    <span>Transaction ID: {{creditTransaction._id}}</span>
                    <adm-inline-svg
                        class="copy-icon"
                        :src="'copy'"
                        title="Click to copy"
                        @click.stop.native="
                            copyContactClipboard(creditTransaction._id)
                        "
                    ></adm-inline-svg>
                </div>
                <div class="line-2 modified-by-line">
                    <span v-if="creditTransaction.payment && creditTransaction.payment.receipt_date">Payment receipt on: {{toDateString(creditTransaction.payment.receipt_date)}}</span>
                    <span v-if="creditTransaction.payment && creditTransaction.payment.unique_transaction_reference">Unique Transaction Reference(UTR): {{creditTransaction.payment.unique_transaction_reference}}</span>
                </div>
                <div class="line-2 modified-by-line">
                    <span>{{ getModifiedBy }}</span>
                    <span>On: {{toDateTimeString(creditTransaction.created_at)}}</span>
                </div>
            </div>
            <div class="right-container">{{amountFormat(creditTransaction.currency,creditTransaction.amount)}}</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import admInlineSVG from '@/components/common/adm-inline-svg';
import { copyToClipboard } from '@/helper/utils.js';

export default {
    name: 'credit-transaction-card',
    props: {
        creditTransaction: { type: Object, required: true, default: null }
    },
    components:{
        'adm-inline-svg':admInlineSVG
    },
    filters:{
        capitalize: capitalize
    },
    computed:{
        getType(){
            return this.creditTransaction.type.split("_").join(" ").toUpperCase()
        },
        getModifiedBy(){
            if(get(this.creditTransaction,"author.modified_by")){
                return `Modified by ${get(this.creditTransaction,"author.modified_by_details.first_name")} ${get(this.creditTransaction,"author.modified_by_details.last_name")}`
            }
            return `Modified by System`
        }
    },
    data(){
        return {
            companyId: this.$route.params.companyId,
        }
    },
    methods:{
        copyContactClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        amountFormat(currency,amount) {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: currency
            }).format(amount);
        },
        toDateString(date) {
            return moment(date).format('MMMM Do YYYY');
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
        openInvoicePage() {
            if (this.companyId) {
                return `/administrator/company-details/${this.companyId}/billing-details/${this.creditTransaction.invoice}`
            }
        },
    }
}
</script>

<style lang="less" scoped>
    .width-50{
        width: 50%;
    }
    .container {
        box-sizing: border-box;
        border: 1px solid @Iron;
        border-radius: 4px;
        background-color: @White;
        // padding: 24px 12px 24px 12px;
        padding: 12px;
        margin-bottom: 24px;

        &:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .inside-container{
            display: flex;
            .left-container{
                flex:3;
            }
            .right-container{
                flex:1;
                text-align: right;
            }
        }
        .line-1 {
            display: flex;
            align-items: center;
            padding-bottom: 12px;
        }
        .line-2 {
            display: flex;
            gap: 24px;
            font-size: 12px;
            line-height: 22px;
            color: #9b9b9b;
            font-weight: 400;
            justify-content: space-between;

        }
        .line-2.display-block{
            display: block;
        }
        .line-2.modified-by-line{
            gap: 16px;
            justify-content: flex-start;
        }
        .transaction-id-line{
            gap: 0px!important;
            width: 292px;
            align-items: center;
            .copy-icon{
                position: relative;
                top: -5px;
                cursor: pointer;
            }
        }
        .line-4 {
            display: flex;
            justify-content: flex-end;
        }
        .view-invoice{
            cursor: pointer;
            color: #2e31be;
        }
    }
</style>