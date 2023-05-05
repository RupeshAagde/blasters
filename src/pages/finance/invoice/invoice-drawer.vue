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
                                        v-model="paymentSelection"
                                        radioValue="cash"
                                        @change="paymentOptnChange"
                                        >
                                        Cash
                                    </nitrozen-radio>
                                    <nitrozen-radio
                                        name="payment"
                                        v-model="paymentSelection"
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
                                type="number"
                                required
                                placeholder="Enter amount in INR"
                                :showPrefix="true"
                                :prefix="currency"
                                v-model="offlineData.cashAmount"
                            ></nitrozen-input>
                        </div>
                        <div class="amount-wrap" v-if="paymentMode.cheque">
                            <nitrozen-input
                            label="UTR Number"
                            placeholder="6677367789918"
                            required
                            v-model="offlineData.utrNum"
                            ></nitrozen-input>
                            <nitrozen-input
                            class="cheque-input"
                            label="Cheque Number"
                            placeholder="IC4788782"
                            required
                            v-model="offlineData.chequeNum"
                            ></nitrozen-input>
                        </div>
                        <div class="remarks-wrap">
                            <nitrozen-input
                                type="textarea"
                                label="Remark"
                                :maxlength="100"
                                v-model="offlineData.remarks"
                                placeholder="Please enter some remarks regarding the offline transaction"
                            ></nitrozen-input>
                        </div>
                        <div class="upload-wrap">
                            <div class="upload-title">Proof</div>
                            <div class="upload-file" @drop.prevent="onFileUpload" @dragover.prevent>
                                <div id="select-file" class="select-file" @click="onUploadClick">
                                    <input type="file" ref="fileUpload" @change="onFileUpload" class="fileUploadInput"  />
                                    <div class="plus-sign">
                                    <inline-svg :src="'plus-sign-finance'"></inline-svg>
                                    </div>
                                    <div v-if="paymentMode.cash" class="upload-file-title">Upload Receipt</div>
                                    <div v-if="paymentMode.cheque" class="upload-file-title">Upload Cheque Image</div>
                                </div>
                            </div>
                            <div class="file-name"> {{ fileDetails.fileName }}</div>
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
                        :disabled="enableTranSave"
                        @click="saveOfflineData"
                        >Save</nitrozen-button>
                    </div>
            </div>
            </div>   
        </div>
    </div>
</template>

<script>
import pako from "pako";
import FinanceService from '@/services/finance.service.js';
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
props: {
    invoice: {
        type:  Object,
    },
},
data() {
    return this.initialData();
},
watch: {
    'offlineData': {
      handler: function(updatedData) {
        if(this.paymentSelection === "cash" && updatedData.cashAmount != ''){
            this.enableTranSave = false;
        }
        else if(updatedData.cashAmount != '' && updatedData.utrNum != '' && updatedData.chequeNum != ''){
            this.enableTranSave = false;
        }
        else{
            this.enableTranSave = true;
        }
      },
      deep:true,
    }
},
mounted() {
},
methods: {
        initialData(){
            return {
                offlineData: {
                    cashAmount: '',
                    chequeNum: '',
                    utrNum: '',
                    remarks: '',
                },
                paymentSelection: 'cash',
                enableTranSave:true,
                paymentMode: {
                    cash: true,
                    cheque: false,
                },
                fileDetails: {
                    fileName: '',
                    fileMbSize: ''
                },
                presignedUrl: '',
                intervalId:'',
                currency: '₹',
                file: new Blob(),
            }
        },
        closeDrawer(){
            this.initialData();
            this.$emit('closeDrawer')
        },
        saveOfflineData(){
            let params = {
                "data": {
                    "seller_id": this.invoice.company.match(/\(([^)]+)\)/)[1],
                    "transaction_type": "admin_offline",
                    "currency": "INR",
                    "invoice_number": this.invoice.invoice_number,
                    "mode_of_payment": this.paymentSelection,
                    "amount": parseInt(this.offlineData.cashAmount).toFixed(2),
                    "total_amount": parseInt(this.invoice.amount.slice(1)).toFixed(2),
                    "payment_reference_number": this.offlineData.utrNum,
                    "payment_reference_type": "utr_number",
                    "platform": "website",
                    "source_reference": "invoice",
                    "meta": {
                        "remarks": this.offlineData.remarks,
                        "cheque_number": this.offlineData.chequeNum
                    }
                }
            }
            switch(this.paymentSelection) {
                case "cash":
                        params.data.meta["cash_image_url"] = this.presignedUrl;
                    break;
                case "cheque":
                    params.data.meta["cheque_image_url"] = this.presignedUrl;
                    break;
            }
            const caller = FinanceService.updatePaymentInfo(params);
            caller
                .then((res) => {
                    this.$snackbar.global.showSuccess(
                        `Offline Transaction Recored`
                    );
                    this.closeDrawer();
                    /* this.getCreditLineDetails();
                    this.loadData(); */
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed`
                    );
                })
                .finally(() => {
                    this.offlineData = {
                        utrNum:'',
                        chequeNum:'',
                        cashAmount:'',
                        remarks: ''
                    }
                });
        },
        paymentOptnChange(){
            for (const key in this.offlineData) {
                this.offlineData[key] = '';
            }
            Object.keys(this.paymentMode).forEach(key => {
                this.paymentMode[key] = false;
            });
            this.paymentMode[this.paymentSelection] = true;
        },
        frame(){
            clearInterval(this.intervalId);            
            setTimeout(() => {
              this.getPreSignedUrl();
            }, 1000);
        },
        getPreSignedUrl(){
            const params = {
                "data": {
                    "s3_key": `invoice/${this.invoice.invoice_number}/${this.paymentSelection}/${Math.floor(Date.now() / 1000)}_${this.fileDetails.fileName}`,
                    //"file_name": this.fileDetails.fileName + '.gz',
                }
            }
            const caller = FinanceService.getPreSignedUrl(params);
            caller
                .then(( res ) => {
                    let data = new FormData;
                    let url = res.data.data.url;
                    this.presignedUrl = res.data.data.presigned_url;
                    for (let prop in res.data.data.fields) {
                      data.append(prop, res.data.data.fields[prop]);
                    }
                    const file = this.file;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const fileAsArray = new Uint8Array(reader.result);
                        const compressedFileArray = pako.gzip(fileAsArray);
                        const compressedFile = compressedFileArray.buffer;
                        const dataToUpload = new Blob([compressedFile], { type: file.type });
                        const fileToUpload = new Blob([dataToUpload], { type: "application/gzip"});
                        data.append('file', fileToUpload);
                        this.uploadToS3(url,data);
                    };

                    reader.readAsArrayBuffer(file);
                    
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed`
                    );
                })
        },
        uploadToS3(url,data){
            const caller = FinanceService.uploadToS3(url, data);
            caller
                .then((res) => {
                })
                .catch((err) => {
                  
                })
                .finally(() => {});  
                
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
            else if(file.size > 0 && file.size < 5000000){
                this.fileDetails.fileName = file.name.split(' ').join('_');
                this.fileDetails.fileMbSize = (file.size / 1000000).toFixed(2);
                this.intervalId = setInterval(this.frame, 10);
            }
            else {
                this.$snackbar.global.showError(
                    `You have cancelled the file upload`
                );
            }
        },
        onUploadClick() {
            this.$refs.fileUpload.click();
        },
        
    },
}

</script>
<style lang="less" scoped>

.invoice-overlay{
    position: absolute;
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

.file-name{
    color: #41434C;
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
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

        .cheque-input{
            padding-top: 24px;
        }
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