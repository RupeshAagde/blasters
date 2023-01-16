<template>
  
  <div class="panel">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Upload Data Portal'"
                :desc="'Upload Data Portal'"
            ></jumbotron>
        </div>
        <div class="main-file-container">
          <div class="header">
            <div class="header_content">
              <div class="title">Upload Data Portal</div>
              <div class="desc">Need help in importing? <span class="desc-link" @click="handleOpenDrawer">Learn Here</span></div>
            </div>
            <div class="header-btns">
              <nitrozen-dropdown
                  id="file-type"
                  v-if="this.toggleUpload"
                  :searchable="true"
                  :items="fileType"
                  v-model="selectedFileType"
                  placeholder="Select CSV File"
                  :required="true"
              ></nitrozen-dropdown>
              <nitrozen-button
              v-if="this.toggleUpload"
              class="download-fbtn"
              id="download-fbtn"
              :theme="'secondary'"
              v-strokeBtn
              :disabled="!selectedFileType"
              @click="downloadFormat"
              >Download Sample</nitrozen-button>
            </div>
            <div class="arrow-wrap" @click="toggleUploadSection">
              <div class="open-arrow" v-if="this.toggleUpload">
                <inline-svg :src="'upward-arrow-finance'"></inline-svg>
          </div>
              <div class="close-arrow" v-else>
                  <inline-svg :src="'downward-arrow-finance'"></inline-svg>
              </div>
            </div>
          </div>
          <div class="learn-drawer-container" v-if="drawerOpen">
                <learn-drawer @closeDrawer="handleCloseDrawer"></learn-drawer>
            </div>
          <div class="upload-container" v-if="this.toggleUpload">
            <div class="upload-header">
              <div class="title">Upload File</div>
              <div 
                class="upload-history-btn"
                @click="openHistory"
              >
                <span class="icon"><inline-svg :src="'upload-history-finance'"></inline-svg></span>
                <span class="txt">Upload History</span>
              </div>
            </div>
            <div class="upload-file" @drop.prevent="onFileUpload" @dragover.prevent>
              <div id="select-file" class="select-file" @click="onUploadClick">
                <input type="file" accept=".csv" ref="fileUpload" @change="onFileUpload" class="fileUploadInput"  />
                <div class="plus-sign">
                  <inline-svg :src="'plus-sign-finance'"></inline-svg>
                </div>
                <div class="upload-file-title">Choose File</div>
              </div>
              <div class="desc">Drag and drop a file here</div>
              <div class="condition">Accepted File Type:  .csv</div>
            </div>
            <div class="file-loading-container"  v-if="this.fileSelected">
              <div class="icon"><inline-svg :src="'file-upload-finance'"></inline-svg></div>
              <div class="file-loading">
                <div class="file-top-section">
                  <div class="file-name"> {{ fileDetails.fileName }}</div>
                  <div class="progress-close-btn" @click="fileSelected = false">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.66659 1.27398L8.72659 0.333984L4.99992 4.06065L1.27325 0.333984L0.333252 1.27398L4.05992 5.00065L0.333252 8.72732L1.27325 9.66732L4.99992 5.94065L8.72659 9.66732L9.66659 8.72732L5.93992 5.00065L9.66659 1.27398Z" fill="#8F8F8F"/>
                    </svg>
                  </div>
                </div>
              <div class="progress-bar" v-if="this.fileUploading">
                <div ref="progressbar" class="progress-speed" v-bind:style="{ 'width': width+'%'}"></div>
              </div>
              <div class="progress-info">
                <div class="filesize" v-if="this.fileUploading">
                  <span class="initial">{{ this.fileDetails.fileMbSize }}</span><span class="final">/ {{this.fileDetails.fileMbSize}} MB</span>
                </div>

                <div class="progress-percent" :class="[isUploaded ? 'uploaded' : '']">
                  <span class="progress-percent-value" v-if="this.fileUploading">{{ this.width }} %</span>
                  <span v-else>
                    <inline-svg :src="'success-icon-finance'"></inline-svg>
                    Import
                  </span>
                  <span> Complete</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div class="main-validation-container">
          <div class="data-container">
            <div class="left-content">
            <div class="title">Validation Summary</div>
              <div class="status">
                <div class="record">
                  <span class="txt">Total Record : </span>
                  <span class="val">{{this.parsedData.totalRecords}}</span>
                </div>
                <div class="record-success hide" v-if="validationCompleted">
                  <inline-svg :src="'success-icon-finance'"></inline-svg>
                  <span class="txt">Success: </span>
                  <span class="val">{{this.parsedData.success}}</span>
                </div>
                <div class="record-error hide" v-if="validationCompleted">
                  <inline-svg :src="'error-icon-finance'"></inline-svg>
                  <span class="txt">Errors: </span>
                  <span class="val">{{this.parsedData.errors}}</span>
                </div>
              </div>
              <div class="payout-sum" ref="payouts" v-if="validationCompleted && payoutsExists">
                <inline-svg :src="'payout-icon-finance'"></inline-svg>
                  <span class="txt">Payout Amount Sum: </span>
                  <span class="val">{{ this.parsedData.payout_amount}}</span>
              </div>
          </div>
          <div class="right-content" v-if="validationCompleted">
            <nitrozen-button
              id="cancel-btn"
              class="cancel-btn"
              :theme="'secondary'"
              v-strokeBtn
              @click="cancelValidation"
              >Cancel</nitrozen-button>
              <nitrozen-button
              class="confirm-btn"
              :theme="'secondary'"
              v-flatBtn
              @click="confirmValidation"
              >Confirm</nitrozen-button>
          </div>
          </div>
          <mirage-alert
                    :dismissible="true"
                    ref="intro"
                    v-if="validationCompleted"
                    class="info"
                    type="info"
                    v-show="true"
                >
                    <div class="alert-content">
                        <span>
                          Validate and confirm to save your import progress
                        </span>
                    </div>
          </mirage-alert>
          <div class="snapshot-table-conatiner" v-if="validationCompleted">
            <table
                class="snapshot-table"
                v-if="tableData">
                <tr>
                    <th
                        v-for="(col, index) in tableData.headers"
                        :key="'col-' + index"
                    >
                        {{ col }}
                    </th>
                </tr>
                <tr v-for="(tab, index) in tableData.items"
                    :key="'tab-' + index"> 
                    <td v-for="(tabItem,index) in tab" :key="index">
                        {{ tabItem }}
                    </td>
                </tr>
            </table>
          </div>
          <div class="validate-loader" v-if="startLoader">
            <no-content
                :icon="'/public/assets/pngs/upload-loader-finance.gif'"
                :helperText="''"
            />
            <div class="txt">Please hold on while the records are being fetched...</div>
          </div>
          <div class="validate-img-wrap" ref="validateImg"> 
            <no-content
                :icon="'/public/assets/pngs/validate-bulk-upload-finance.png'"
                :helperText="''"
            />
            <div class="txt">No departmental data uploaded,</div>
            <div class="txt">Upload departmental data</div>
          </div>

        </div>
    </div>
</template>
<script>
import NoContent from '../../../components/common/adm-no-content.vue';
import pako from "pako";
import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import MirageAlert from '@/components/orders/alert.vue';
import learnDrawer from './learn-drawer.vue';
import inlineSvgVue from '../../../components/common/adm-inline-svg.vue';
import {
    NitrozenButton,
    NitrozenRadio,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name:'bulk-upload',
    components: {
      'jumbotron': Jumbotron,
      'nitrozen-button': NitrozenButton,
      'nitrozen-radio' : NitrozenRadio,
      'nitrozen-dropdown':  NitrozenDropdown,
      'no-content' : NoContent,
      'mirage-alert' : MirageAlert,
      'learn-drawer' : learnDrawer,
      'inline-svg': inlineSvgVue
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
    return {
      selectedFileType: '',
      fileDetails: {
        fileName: 'cod_payouts_2.csv',
        fileInitialSize:0,
        fileMbSize:0,
      },
      fileType: [],
      startLoader:false,
      drawerOpen:false,
      toggleUpload: true,
      fileSelected:false,
      fileUploading:true,
      intervalId:'',
      width:0,
      isUploaded:false,
      presignedUrl: '',
      validationCompleted: false,
      payoutsExists:true,
      file: new Blob(),
      parsedData:{
        totalRecords: 0,
        success:0,
        errors:0,
        payout_amount:0,
      },
      tableData:{
        headers:[],
        items:[],

      },
      validatedData: {
          "success": true,
          "data": {
              "report_upload_id": 'ad6dd60d-110a-4a53-904c-b9196b4a7008',
              "status": "PreProcess",
              "json":{"headers": ["column1", "column1"],
                          
                      "rows": {"1": ["cell(1,1)", "cell(2,1)"],
                              "2": ["cell(1,2)", "cell(2,1)"],   
                              "3": ["cell(1,3)", "cell(2,3)"]
                              } 
                      },
              "total": 2,
              "summary":[
                  {
                    "payoutsum": 456.6
                    }
                ]
          }
      }
    }
  },
  mounted(){
    this.getFileType();

  },
  methods: {
    handleOpenDrawer(){
        this.drawerOpen = true;
    },
    handleCloseDrawer(){
        this.drawerOpen = false;
    },
    openHistory(){
      this.$router.push({ name: 'upload-history-fin', params: {status: 'preprocess'}});
    },
      downloadFormat(){

        console.log(this.selectedFileType);

      if(!this.selectedFileType){
        this.$snackbar.global.showError(
            `Please select option from dropdown`
        );
      }   
      
      const params = {   
        "data": {
            "report_id": this.selectedFileType 
        }
      }

      const caller = FinanceService.getDownloadFormat(params);
            caller
                .then(( res ) => {
                    const url = res.data.data.url;
                    const link = document.createElement('a');
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed`
                    );
                })
                .finally(() => {
                    
       });
      },
      getFileType() {
        const params = {
                        "data": {
                            "table_name": "report_upload_config",
                            "filters": {
                            "listing_enabled": true
                            },
                            "project": [
                                "id",
                                "display_name",
                                "preprocess",
                                "is_gzip",
                                "description"
                                ]
                            }
                        }
            
            const caller = FinanceService.getFileType(params);
            caller
                .then(( res ) => {
                    this.fileType = res.data.items.map((item) => {
                        return {
                            text: item.display_name,
                            value: item.id,
                        };
                    });
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed`
                    );
                })
                .finally(() => {
                    
                });
        },

        frame() {
          this.fileDetails.fileInitialSize = this.fileDetails.fileMbSize / 100;
          if (this.width >= 100) {
            clearInterval(this.intervalId);            
            setTimeout(() => {
              this.showValidateScreen();
            }, 1000);

          } else {
            this.width++;
            this.fileDetails.fileInitialSize++;
          }
        },

        onFileUpload(event) {
          this.fileUploading = true;
          this.fileSelected = true;
          let file = (event.dataTransfer) ?  event.dataTransfer.files[0] : event.target.files[0];
          this.file = file;

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
              this.fileDetails.fileName = file.name;
              this.fileDetails.fileMbSize = (file.size / 1000000).toFixed(2);
              this.width = 0;
              this.intervalId = setInterval(this.frame, 10);
            }
            else {
                this.fileDetails.fileName = null;
                this.$snackbar.global.showError(
                    `You have cancelled the file upload`
                );
            }
        },
        toggleUploadSection(){
          this.toggleUpload = !this.toggleUpload;
        },

        showValidateScreen(){
          this.fileUploading = false;
          this.isUploaded = true; 
          this.validationCompleted = false;
          this.$refs.validateImg.style.display = "none";
          this.startLoader = true;
          this.getPreSignedUrl();
        },

        getPreSignedUrl(){
          const params = {
              "data": {
                  "report_id": this.selectedFileType ,
                  "file_name": this.fileDetails.fileName + '.gz',
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
                .finally(() => {

                  setTimeout(() => {
                      this.getValidatedFileInfo();
                  }, 500)

                    
                });  
                
        },
        getValidatedFileInfo(){  
          const params = {
                "data": {
                    "report_id": this.selectedFileType,
                    "url": this.presignedUrl,
                    "is_gzip": "true",
                    "action": "preprocess",
                    "source":"s3"
                }
            }
          const caller = FinanceService.uploadUrl(params);
            caller
                .then(( res ) => {   
                  this.showValidatedScreen(res);
                  console.log("in");
                  
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Validation Failed`
                    );
                    this.cancelValidation();
                }) 
                           
        },
        showValidatedScreen(res){

          const dataVal = res.data.data;

          this.validationCompleted = true;
          this.toggleUpload = false;
          this.startLoader = false;

          this.parsedData.totalRecords = dataVal.total;
          this.parsedData.success = dataVal.total;

          if(dataVal.summary.length > 0){
            const payoutAmt = dataVal.summary[0];
            this.parsedData.payout_amount = Object.values(payoutAmt)[0];
            this.payoutsExists = true;
          }
          else{
            this.payoutsExists = false;
          }


          this.tableData.headers = dataVal.json.headers;
          this.tableData.items = dataVal.json.rows;

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
        cancelValidation(){
          this.validationCompleted = false;
          this.toggleUpload = true;
          this.parsedData.totalRecords = 0;
          this.$refs.validateImg.style.display = "block";
          this.fileSelected = false;
          this.file = new Blob(); 

        },
        confirmValidation(){
          const params = {
                "data": {
                    "report_id": this.selectedFileType,
                    "url": this.presignedUrl,
                    "is_gzip": "true",
                    "action": "process",
                    "source":"s3"
                }
            }
          const caller = FinanceService.uploadUrl(params);
            caller
                .then(( res ) => {
                  console.log(res);
                    
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `Failed`
                    );
                })
                .finally(() => {
                  this.file = new Blob(); 
                  this.openHistory();
                });
        },
     
    }

}
</script>

<style lang="less" scoped>

@keyframes load {
  0% { width: 0; }
  100% { width: 100%; }
}

.panel{overflow-x: hidden;}
.hide{display: none;}

.main-file-container{
  background: #FFFFFF;
border-radius: 4px;
margin: 24px 24px 0;
padding: 24px ;

}

.header{
  padding-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .desc-link{
    cursor: pointer;
  }
}
.header_content{
  flex: 1;

  .title{
    font-size: 18px;
    color: #1F1F1F;
    line-height: 22px;
    font-weight: 600;
  }
  .desc{
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: #757575;
    margin-top:7px;

    span{
      color: #2E31BE;
      font-weight: 700;
    }
  }

}

.header-btns{
  display: flex;
  width: 46%;
  max-width: 46%;
  margin-right: 20px;

  .download-fbtn{
    margin-left: 20px;
    max-width: 222px;
    width: 100%;
  }

  .nitrozen-dropdown-container{
  ::v-deep .nitrozen-option-container{
      text-transform: capitalize;
  }

  ::v-deep .nitrozen-searchable-input-container{
    input{
      text-transform: capitalize;
    }
  }

}

}

.upload-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 16px;

  .title{
    font-weight: 600;
    font-size: 18px;
    line-height: 23px;
    color: #1F1F1F;

  }

  .upload-history-btn{
    cursor: pointer;
    .txt{
      color: #2E31BE;
      font-weight: 700;
      font-size: 12px;
      line-height: 17px;
    }
    svg{
      vertical-align: middle;
    }
  }
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
      font-size: 16px;
      line-height: 21px;
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

  .select-file{
    position: relative;
    
  }
  .fileUploadInput{
    position: absolute;
    width: 100%;
    visibility: hidden;
  }

.file-loading-container{
  display: flex;
  align-items: center;
  margin-top: 16px;

  .file-loading{
    flex: 1;
  }

  .icon{
    padding-right: 10px;
  }

  .file-name{
    color: #41434C;
    font-size: 12px;
    line-height: 17px;
    font-weight: 600;
  }
  .progress-bar{
    height: 6px;
    width: 100%;
    background: #F2F2F2;
  border-radius: 37px;
  overflow: hidden;
  margin: 4px 0;
  

  .progress-speed{
    background: #2E31BE;
    height: 6px;
  }
  }

.progress-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filesize{
font-weight: 400;
font-size: 12px;
color: #9B9B9B;
line-height: 17px;
}

.progress-percent{
font-weight: 600;
font-size: 12px;
line-height: 17px;
color: #2E31BE;

.inline-svg{
  display: inline-block;
    vertical-align: middle;
}

svg{
  vertical-align: middle;
}
}

.file-top-section{
  display: flex;
  justify-content: space-between;
  align-items: center;
}


}

.main-validation-container{
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 24px 0;

  .data-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E0E0E0;
  padding-bottom: 16px;
.left-content{
  .inline-svg{
    display: inline-block;
    vertical-align: middle;
  }
}
.right-content{
  button{
    margin-left: 20px;
  }
}
}

.title{
  font-size: 18px;
  line-height: 22px;
  color: #41434C;
  font-weight: 600;
  margin-bottom: 8px;
}

.txt{
  font-size: 14px;
  color: #9B9B9B;
  font-weight: 400;
}

.val{
  color: #41434C;
  font-size: 14px;
  line-height: 19px;
  margin-right: 16px;
}

.status{
  display: flex;
  align-items: center;
}

svg{ 
  vertical-align: middle;
}

.payout-sum{
  padding-top: 16px;
}

}

.arrow-wrap{
  cursor: pointer;
}

.progress-close-btn{
  cursor: pointer;
}

.progress-percent.uploaded{
  .progress-percent{
    color: #0A5F23;
  }
  span{
    color: #0A5F23;
    line-height: 17px;
  }
}

.validate-img-wrap, .validate-loader{
  .txt{
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: #9B9B9B;
    text-align: center;
  }
  .page-error {
  padding: 2% 0 0%;
}

}

.snapshot-table-conatiner{
  overflow-x: auto;
}

.snapshot-table {
        width: 100%;
        margin-bottom: 24px;
        font-family: Inter, sans-serif;
        font-size: 14px;
        overflow-x: auto;
        margin-top: 24px;
        border: 1px solid #E0E0E0;
        text-align: center;

        tr:first-child {
            border-bottom: 1px solid @Iron;
            background: @Alabaster2;
            color: @Black;
        }
        tr:not(:first-child) {
            border-bottom: 1px solid @Iron;
        }
        th{
            padding: 16px 24px;
            text-align: center;
        }
        td {
            text-align: center;
            padding: 16px 24px;
            vertical-align: middle;
            max-width: 120px;
        }
    }

.upload-history-btn{
  display: flex;
  align-items: center;

  .icon{
    margin-right: 3px;
  }
}

th,tr{
  font-size: 14px;
  line-height: 19px;
}



</style>