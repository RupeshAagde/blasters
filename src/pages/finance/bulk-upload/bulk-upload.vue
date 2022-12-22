<template>
  
  <div class="panel">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Upload Data Portal'"
                :desc="'Upload Data Portal'"
            ></jumbotron>
        </div>
        <div class="main_container">
          <div class="header">
            <div class="header_content">
              <div class="title">Upload Data Portal</div>
              <div class="desc">Need help in importing? <span class="desc-link">Learn Here</span></div>
            </div>
            <div class="header-btns">
              <nitrozen-dropdown
                  id="file-type"
                  :searchable="true"
                  :items="fileType"
                  v-model="selectedFileType"
                  placeholder="Select CSV File"
                  :required="true"
              ></nitrozen-dropdown>
              <nitrozen-button
              class="download-fbtn"
              :theme="'secondary'"
              v-strokeBtn
              :disabled="!selectedFileType"
              @click="downloadFormat"
              >Download Sample</nitrozen-button>
            </div>
          </div>
          <div class="upload-container">
            <div class="upload-header">
              <div class="title">Upload File</div>
              <div class="upload-history-btn">
                <span class="icon"><svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0.5C4.68667 0.5 2 3.18667 2 6.5H0L2.59333 9.09333L2.64 9.18667L5.33333 6.5H3.33333C3.33333 3.92 5.42 1.83333 8 1.83333C10.58 1.83333 12.6667 3.92 12.6667 6.5C12.6667 9.08 10.58 11.1667 8 11.1667C6.71333 11.1667 5.54667 10.64 4.70667 9.79333L3.76 10.74C4.84667 11.8267 6.34 12.5 8 12.5C11.3133 12.5 14 9.81333 14 6.5C14 3.18667 11.3133 0.5 8 0.5ZM7.33333 3.83333V7.16667L10.1667 8.84667L10.68 7.99333L8.33333 6.6V3.83333H7.33333Z" fill="#2E31BE"/>
                </svg></span>
                <span class="txt">Upload History</span>
              </div>
            </div>
            <div class="upload-file">
              <div class="select-file" @click="onUploadClick">
                <input type="file" accept=".csv" ref="fileUpload" @change="onFileUpload" class="fileUploadInput"  />
                <div class="plus-sign">
                  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.8337 11.3327H10.8337V19.3327H8.16699V11.3327H0.166992V8.66602H8.16699V0.666016H10.8337V8.66602H18.8337V11.3327Z" fill="#2E31BE"/>
                  </svg>
                </div>
                <div class="upload-file-title">Choose File</div>
              </div>
              <div class="desc">Drag and drop a file here(max. file size: 5MB)</div>
              <div class="condition">Accepted File Type:  .csv</div>
            </div>
          </div>

        </div>
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
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
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
    return {
      selectedFileType: '',
      fileType: [],
      uploadedFileName: '',
    }
  },
  mounted(){
    this.getFileType();

  },
  methods: {
      downloadFormat(){

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
            console.log(caller);
            caller
                .then(( res ) => {
                  console.log(res);
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
                  console.log("in finally")
                    
                });
        },

        onFileUpload(event) {
            let file = event.target.files[0];
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
                this.uploadedFileName = file.name;
                // this.$emit('upload', event.target.files[0]);
            }
            else {
                this.uploadedFileName = null;
                this.$snackbar.global.showError(
                    `You have cancelled the file upload`
                );
            }
        },

        /**
         * Function to call file upload method when user clicks on the button.
         * 
         * @author: Rushabh Mulraj Shah
         */
        onUploadClick() {
            this.$refs.fileUpload.click();
        }
     
    }

}
</script>

<style lang="less" scoped>

.main_container{
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
}
.header_content{

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
  width: 50%;
  max-width: 50%;

  .download-fbtn{
    margin-left: 40px;
    max-width: 222px;
    width: 100%;
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

</style>