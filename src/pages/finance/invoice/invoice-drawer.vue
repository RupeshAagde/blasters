<template>
    <div class="invoice-overlay">
        <div class="invoice-drawer-wrap">
            <div class="drawer-inner-wrap">
                <div class="offline-main-container">
                    <div class="header">
                        <div class="header-title">Offline Payment</div>
                        <div class="cross-btn" @click="closeDrawer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#8F8F8F"/>
                            </svg></div>
                    </div>
                    <div class="offline-options-container">
                        <div class="payment-wrap">
                        <div class="payment-title">Mode of Payment</div>
                            <div class="payment-optns" ref="paymentradio">
                                <nitrozen-radio
                                    class="payment-optn"
                                    name="payment"
                                    v-model="offlineData.paymentSelection"
                                    radioValue="cash"
                                    @change="paymentOptnChange"
                                    >
                                    Cash
                                </nitrozen-radio>
                                <nitrozen-radio
                                    name="payment"
                                    v-model="offlineData.paymentSelection"
                                    radioValue="cheque"
                                    @change="paymentOptnChange"
                                    >
                                    Cheque
                                </nitrozen-radio>
                            </div>
                        </div>
                        <div class="amount-wrap">
                        <nitrozen-input
                            label="Amount"
                            placeholder="Enter amount in INR"
                            :showPrefix="true"
                            :prefix="currency"
                            v-model="offlineData.cashAmount"
                        ></nitrozen-input>
                        </div>
                        <div class="remarks-wrap">
                            <nitrozen-input
                                type="textarea"
                                label="Remarks"
                                :maxlength="100"
                                v-model="offlineData.remarks"
                            placeholder="Some remarks regarding the offline transaction"
                            ></nitrozen-input>
                        </div>
                        <div class="upload-wrap">
                            <div class="upload-title">Proof</div>
                            <div class="upload-file" @drop.prevent="onFileUpload" @dragover.prevent>
                                <div id="select-file" class="select-file" @click="onUploadClick">
                                    <input type="file" accept=".csv" ref="fileUpload" @change="onFileUpload" class="fileUploadInput"  />
                                    <div class="plus-sign">
                                    <inline-svg :src="'plus-sign-finance'"></inline-svg>
                                    </div>
                                    <div class="upload-file-title">Upload Receipt</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pay-btns">
                    <div class="cancel-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-strokeBtn
                        @click="closeDrawer"
                        >Cancel</nitrozen-button>
                    </div>
                    <div class="save-btn">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-flatBtn
                        @click="saveOfflineData"
                        >Save</nitrozen-button>
                    </div>
            </div>
            </div>   
        </div>
    </div>
</template>

<script>
// import FinanceService from '@/services/billing-subscription.service';

import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenRadio,
    flatBtn,
    strokeBtn,

} from '@gofynd/nitrozen-vue';


export default {
name: 'invoice-drawer',
components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-radio': NitrozenRadio,
        'inline-svg': inlineSvgVue,
},
directives: {
        flatBtn,
        strokeBtn,
},
data() {
    return {
        offlineData: {
            cashAmount: 0,
            paymentSelection: '',
            remarks: '',
        },
        currency: '₹',
        file: new Blob(),
        

    }
},
mounted() {
       
},
methods: {
        closeDrawer(){
            this.$emit('closeDrawer')
        },
        saveOfflineData(){

        },
        paymentOptnChange(){

        },
        saveOfflineData(){
            console.log(this.offlineData);
            this.closeDrawer();

        },
        onFileUpload(event) {
          let file = (event.dataTransfer) ?  event.dataTransfer.files[0] : event.target.files[0];

            if(file.size == 0) {
                this.$snackbar.global.showError(
                    `File is empty, please check the file`
                );
            }
            else if(file.size > 5000000){
                this.$snackbar.global.showError(
                    `File size exceeds 5MB, please check the file`
                );
            }
            else if(file.name.slice(-4) == ".csv") {
              this.file = file;
            }
            else {
                this.$snackbar.global.showError(
                    `You have cancelled the file upload`
                );
            }
        },
        onUploadClick() {
          if(this.selectedFileType){
            this.$refs.fileUpload.click();
        }
          else{
            this.$snackbar.global.showError(
                  `Please Select value from dropdown`
              );
          }
        },
        
    },
}

</script>
<style lang="less" scoped>

.invoice-overlay{position: absolute;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    background: rgba(51, 51, 51, 0.7);
    z-index: 100;

.invoice-drawer-wrap{

position: absolute;
height: 100%;
background:#fff;
top: 0;
right: 0;
max-width: 384px;
width: 100%;

.drawer-inner-wrap{ 
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    box-sizing: border-box;
}
}
}

.header{
    padding:24px;
    border-bottom: 1px solid #E0E0E0;
    display: flex; align-items: center;
    justify-content: space-between;

    .header-title{
    color: #41434C;
    font-size: 20px;
    line-height: 25px;
    font-weight: 700; 
}
    .cross-btn{
        cursor: pointer;
    }

}
.pay-btns{
    background: #fff;
    box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.06);
    display: flex;
    padding: 16px 0px;
    width: 100%;
    justify-content: flex-end;

    .cancel-btn{
        margin-right: 16px;
    }
    .cancel-btn{
        margin-right: 16px;
    }
    .save-btn{
        margin-right: 16px;
    }
}

.payment-optns{
    display: flex;

    .nitrozen-radio-group{padding-right: 45px;}
  }

  .payment-title{
    color: #9B9B9B;
    font-weight: 400;
    font-size: 12px;
    margin-bottom: 15px;
  }

  .offline-options-container{
    padding: 24px;
    .amount-wrap{
        padding-top: 24px;
    }
    .remarks-wrap{
        padding-top: 24px;
    }

  }

  .fileUploadInput{
    position: absolute;
    width: 100%;
    visibility: hidden;
  }

  .upload-title{
    color: #9b9b9b;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    padding: 24px 0 2px;
  }
  .upload-file{
    padding: 50px;
    background: rgba(240, 244, 255, 0.5);
    border: 1px dashed rgba(46, 49, 190, 0.5);
    border-radius: 4px;
    text-align: center;


    .upload-file-title{
      color: #2E31BE;
      font-weight: 700;
      font-size: 12px;
      line-height: 17px;
      margin-top: 5px;
      cursor: pointer;
    }

    .plus-sign{
      cursor: pointer;
    }
    .desc{
      color: #41434C;
      font-weight: 400;
      font-size: 12px;
      line-height: 17px;
      margin-top: 4px;

    }

    .condition{
      color: #9B9B9B;
      font-size: 12px;
      line-height: 17px;
      margin-top: 8px;
    }
  }

</style>