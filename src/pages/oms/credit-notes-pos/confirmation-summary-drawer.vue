<template>
  <div class="confirm-summary-main">
      <div v-if="!confirmSummaryRequiredData.expiry == '' || loadConfirmPage">
          <div class="confirm-summary-header">
            <adm-inline-svg class="confirm-green-tick" src="confirm-green-tick"></adm-inline-svg>
            <span class="header-text">Return & Refund Completed</span>
        </div>
        <div class="refund-amount" v-if="confirmSummaryRequiredData.selectedMode == 'credit_note'">
            Refund Amount: ₹{{ confirmSummaryRequiredData.amountRefund.toFixed(2) }}
        </div>
        <div class="refund-amount change-background" v-else>
            Amount to be Refunded: ₹{{ confirmSummaryRequiredData.amountRefund?confirmSummaryRequiredData.amountRefund.toFixed(2):'' }}
        </div>
        <div :class="confirmSummaryRequiredData.selectedMode == 'credit_note' ? 'confirm-summary-box' : 'confirm-summary-box-others'">
            <div class="confrim-summary-data">
                <div class="confirm-summary-credit-note" v-if="confirmSummaryRequiredData.selectedMode == 'credit_note'">
                    <span>Refunded As</span>
                    <div class="credit-note-number-logo-telephone">
                        <div class="credit-note-number-logo">
                            <span class="credit-number">Credit Note: {{ confirmSummaryRequiredData.credit_note }}</span>  
                            <div v-if="confirmSummaryRequiredData.credit_note_pdf" @click="getPublicUrl(confirmSummaryRequiredData.credit_note_pdf)">
                                <adm-inline-svg 
                                    class="download-blue-dash" 
                                    src="download-blue-dash">
                                </adm-inline-svg> 
                            </div> 
                        </div>
                        <div class="confirm-summary-right">
                            <adm-inline-svg 
                                class="telephone" 
                                src="telephone">
                            </adm-inline-svg>
                            <span class="telephone-number">{{ confirmSummaryRequiredData.number }}</span>
                        </div>
                    </div>
                    <span>Issuance: {{ todaysDate() }}</span>
                    <span>Valid till: {{ confirmSummaryRequiredData.expiry }}</span>
                </div>
                <div class="confirm-summary-source" v-if="confirmSummaryRequiredData.selectedMode == 'source'">
                    <span>Refund has been initiated for your request</span>
                </div>
                <div class="confirm-summary-bank-transfer" v-if="confirmSummaryRequiredData.selectedMode == 'bank_transfer'">
                    <span>A link to fill up the bank details has been sent to {{ confirmSummaryRequiredData.number }}</span>
                </div>
            </div>
        </div>
      </div>
      <div v-else>
          <div class="confirm-summary-header">
            <img class="confirm-green-tick loader" src="/public/assets/pngs/upload-loader-finance.gif" alt="Loader"/>
            <span class="header-text">Return & Refund Processing</span>
            <span class="body-text">Wait! We are processing your request</span>
        </div>
      </div>
  </div>
</template>

<script>
/* Components import */
import { NitrozenRadio } from '@gofynd/nitrozen-vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';

/* Package imports */
import moment from 'moment';

/* Services imports */
import GrindorService from '@/services/grindor.service';

export default {
    name: "confirmation-summary-drawer",
    props: {
        confirmSummaryRequiredData: {
            type: Object
        },
        shipment: {
            type: Object
        },
        loadConfirmPage: {
            type: Boolean
        }
    },
    components: {
        NitrozenRadio,
        AdmInlineSvg
    },
    methods: {
        todaysDate() {
            return moment().format('lll');
        },
        getPublicUrl(url){
            return GrindorService.getPublicUrl('', {
                expiry: 300,
                urls: [url]
            })
            .then((res) => {
                if(res && res.status == 200 && res.data && res.data.urls[0] && res.data.urls[0].signed_url) {
                    this.downloadSourceFile(res.data.urls[0].signed_url);
                }
            })
            .catch((error) => {
                this.$snackbar.global.showError(`Unable to Download`);
                console.error("Error in downloading the file:   ", error);
            })
        },
        downloadSourceFile(signedUrl) {
            try {
                this.$snackbar.global.showInfo(`Your download will begin shortly`);
                const url = signedUrl;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('click', '_blank');
                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    this.$snackbar.global.showSuccess(`Your has been successfully downloaded`, 3000); 
                }, 1000);
            }
            catch(error) {
                console.error(`Error in downloading the file:   `, error);
                this.$snackbar.global.showError(
                    `Unable to download the file. Please try again after some time.`,
                    3000
                )
            }
        },
    }
}
</script>

<style scoped lang="less">
.confirm-summary-main {
    display: flex;
    justify-content: center;
    
    .confirm-summary-header {
        display: flex;
        flex-direction: column;
        gap: 24px;
        .confirm-green-tick {
            margin-top: 24px;
        }
        .loader{
            width: 100px;
            height: 80px;
        }
        .header-text {
            font-weight: 700;
            font-size: 32px;
            line-height: 120%;
            text-align: center;
            color: #41434C;
        }
        .body-text {
            font-weight: 400;
            font-size: 16px;
            line-height: 140%;
            color: #41434C;
            text-align: center;
        }
    }
    .refund-amount{
        position: relative;
        box-sizing: border-box;
        background: #E3F2E9;
        border: 2px solid #FFFFFF;
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        min-width: 20%;
        max-width: 221px;
        // height: 30%;
        top: 68px;
        z-index: 1;
        left: 39%;
    }
    .change-background{
        background-color: #FFF5D6;
        max-width: 268px;
        left: 35%;
    }
    .confirm-summary-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 32px 24px 24px;
        min-width: 700px;
        min-height: 161px;      
        gap: 8px;
        background: #FFFFFF;
        border: 2px solid #E0E0E0;
        border-radius: 12px;
        margin: 48px 82px 0px 82px;

        .confrim-summary-data {
            width: 100%;
            .confirm-summary-credit-note {
                display: flex;
                flex-direction: column;
                gap: 8px;
                .credit-note-number-logo-telephone {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    .confirm-summary-right {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: 8px;
                        .telephone-number {
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 130%;
                            color: #41434C;
                        }
                    }
                    .credit-note-number-logo {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        .credit-number {
                            font-weight: 600;
                            font-size: 16px;
                            line-height: 130%;
                            color: #41434C;
                        }
                    }
                }
            }
        }
    }
    .confirm-summary-box-others {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 32px 24px 24px;
        min-width: 700px;
        min-height: 82px;      
        gap: 8px;
        background: #FFFFFF;
        border: 2px solid #E0E0E0;
        border-radius: 12px;
        margin: 48px 82px 0px 82px;

        .confrim-summary-data {
            width: 100%;

            .confirm-summary-source {
                display: flex;
                justify-content: center;
            }
            .confirm-summary-bank-transfer {
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>