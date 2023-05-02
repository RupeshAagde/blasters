<template>
    <div class="hidden-section">
  
      <table class="mirage-table">
        <tr>
          <td v-for="(col, index) in tableColumns" :key="'col-' + index">
            {{ col }}
          </td>
        </tr>
        <template>
          <tr v-for="(index) in tableSize" :key="'col-' + index">
            <td>
              <nitrozen-dropdown
                id="component-filter"
                class="filter-type filter-input-sm"
                :items="componentDataList"
                :searchable="true"
                :required="true"
                :disabled="readOnly"
                v-model="componentSelected.value[index]"
                @searchInputChange="changesInDD($event,componentSelected.type,index)"
                @change="checkIsEmpty($event,componentSelected.type, componentSelected.value[index], index), changesInDD($event,componentSelected.type,index), checkRequiredFields(index)"
                placeholder="Component"
              >
              <!-- @change="checkIsEmpty($event,componentSelected.type, componentSelected.value[index], index)" might come in use -->
              </nitrozen-dropdown>
              <!-- <span>{{ componentDataList[index-1].amount }}</span> -->
              <nitrozen-error v-if="componentSelected.errorMsg[index]">Field is Required</nitrozen-error>
            </td>
            <td>
              <nitrozen-dropdown
                class="filter-type filter-input-sm"
                id="component-purpose"
                :items="purpose"
                :searchable="true"
                :required="true"
                :disabled="readOnly"
                v-model="purposeSelected.value[index]"
                @searchInputChange="changesInDD($event,purposeSelected.type,index)"
                @change="checkRequiredFields(index),checkIsEmpty($event,purposeSelected.type,purposeSelected.value[index],index)"
                placeholder="Purpose"
              >
              <!-- @change="checkIsEmpty($event,purposeSelected.type, purposeSelected.value[index], index)" might come in use -->
              </nitrozen-dropdown>
              <nitrozen-error v-if="purposeSelected.errorMsg[index]">Field is Required</nitrozen-error>
            </td>
            <td>
              <nitrozen-input
                :showSearchIcon="false"
                id="component-amount"
                class="search filter-input-lg"
                type="text"
                :required="true"
                :placeholder="`1234`"
                :disabled="readOnly"
                v-model="amount.value[index]"
                @keypress="omit_special_char($event)"
                @input="checkIsEmpty($event,amount.type, amount.value[index], index),checkRequiredFields(index)"
                @blur="checkRequiredFields(index)">
                <!-- @blur="checkIsEmpty($event,amount.type, amount.value[index], index)"  -->
              </nitrozen-input>
              <nitrozen-error v-if="amount.errorMsg[index]">Field is Required</nitrozen-error>
              <nitrozen-error v-if="amount.validationError && validateErrIndex == index">{{ amount.validationError }}
              </nitrozen-error>
            </td>
            <td>
              <nitrozen-input :disabled="true" :showSearchIcon="false" class="search filter-input-lg" type="text"
                :placeholder="`SAC`" v-model="sacCode[index]">
              </nitrozen-input>
            </td>
            <td>
              <nitrozen-input :disabled="true" :showSearchIcon="false" class="search filter-input-lg" type="text"
                :placeholder="`SGST`" v-model="sgst[index]">
              </nitrozen-input>
            </td>
            <td>
              <nitrozen-input :disabled="true" :showSearchIcon="false" class="search filter-input-lg" type="text"
                :placeholder="`CGST`" v-model="cgst[index]">
              </nitrozen-input>
            </td>
            <td>
              <nitrozen-input :disabled="true" :showSearchIcon="false" class="search filter-input-lg" type="text"
                :placeholder="`IGST`" v-model="igst[index]">
              </nitrozen-input>
            </td>
            <td>
              <nitrozen-input :disabled="true" class="search filter-input-lg total-amt" type="number" :placeholder="`Amount`"
                v-model="totalAmount[index]">
              </nitrozen-input>
              <!--v-model="grossAmount" <span>{{ componentDataList[index].amount}}</span> -->
            </td>
            <td>
              <nitrozen-input :showSearchIcon="false" :required="true" id="component-remark" class="search filter-input-lg" type="text"
                :placeholder="`Remarks`" :disabled="readOnly" v-model="remark.value[index]"
                @blur="checkRequiredFields(index)"
                @input="checkIsEmpty($event,remark.type, remark.value[index], index),checkRequiredFields(index)">
              </nitrozen-input>
              <!-- @blur="checkIsEmpty($event,remark.type, remark.value[index], index)" -->
              <nitrozen-error v-if="remark.errorMsg[index]">Field is Required</nitrozen-error>
            </td>
            <td>
              <nitrozen-input :showSearchIcon="false" class="search filter-input-lg" type="text" :placeholder="`1234`"
                :disabled="readOnly" v-model="kaptureId[index]" @blur="checkRequiredFields(index)">
              </nitrozen-input>
            </td>
            <td v-if="!preview">
              <span class="cursor-pointer icon-delete" id="icon-delete" @click="deleteRow(index,$event)" v-show="!readOnly">
                <!-- v-if="tab.status === 'Init' || tab.status === 'Pending'"
                @click="deleteNote(tab)" -->
                <ukt-inline-svg src="delete-red"></ukt-inline-svg>
              </span>
            </td>
          </tr>
        </template>
        <!-- <template v-if="!readOnly">
          <td colspan="11" class="add-line">
            <span class="clickable" :class="{ 'cursor-pointer': !disableAddLine }" @click="addLine()"
              :disabled="disableAddLine">
              Add Another Line
            </span>
          </td>
        </template> -->
      </table>
    </div>
  </template>
  
  <script>
  import accordion from '@/components/common/accordion.vue';
  import {
      NitrozenDropdown,
      NitrozenInput,
      NitrozenError
  } from '@gofynd/nitrozen-vue';
  import admInlineSVG from '@/components/common/adm-inline-svg';
  import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
  import InlineSvg from '@/components/common/inline-svg.vue'; 
  
  export default {
    name: 'expandable-table',
    components: {
      accordion,
      NitrozenDropdown,
      NitrozenInput,
      NitrozenError,
      UktInlineSvg,
      InlineSvg,
      'adm-inline-svg': admInlineSVG,
    },
  
    props: {
      purpose: {
        type: Array,
          default: () => {
            return [];
          }
      },
      bagData: {
        type: Object
      },
      readOnly: {
        type: Boolean
      },
      preview: {
        type: Boolean
      }
    },
  
    data (){
      return {
        tableColumns: ['Component*','Purpose*','Value*','SAC Code','SGST%','CGST%','IGST%','Total Amount','Remarks*','Kapture ID',''],
        componentSelected: {
          value: [],
          errorMsg: [],
          type: 'component'
        },
        purposeSelected: {
          value: [],
          errorMsg: [],
          type: 'purpose'
        },
        amount: {
          value: [],
          errorMsg: [],
          type: 'amount',
          validationError: ''
        },
        remark: {
          value: [],
          errorMsg: [],
          type: 'remark'
        },
        kaptureId: [],
        count: [],
        sacCode: [],
        sgst: [],
        cgst: [],
        igst: [],
        componentDataList: [],
        grossAmount: [],
        totalAmount: [],
        tableSize: 1,
        disableAddLine: false,
        validateErrIndex: null,
        chargeComponents: {},
        component: ''
      };
    },
  
    watch:{
      bagData : {
        handler() {
          this.populateFromProp();
        }
      }
    },
  
    mounted() {
      console.log(this.bagData);

      if(this.bagData && this.readOnly) {
        this.populateFromProp();
      } 
      
     else {
        if (this.bagData.charge_components) {
            let data = this.bagData.charge_components.map( i =>  {
            return   {
              text: i.display_name,
              value: i.type,
              amount: i.amount,
              sacCode: i.sac_code,
              sgst: i.sgst_tax_rate ? i.sgst_tax_rate : 0,
              cgst: i.cgst_tax_rate ? i.cgst_tax_rate : 0,
              igst: i.igst_tax_rate ? i.igst_tax_rate : 0
              }
          })
          this.componentDataList = data;
          this.componentDataList.map(item => {
            this.grossAmount.push(item.amount);
            this.sacCode.push(item.sacCode);
            this.igst.push(item.igst);
            this.cgst.push(item.cgst);
            this.sgst.push(item.sgst);
          })
          
          this.makeChargeComponents();
        }
      }; 
    },
  
    methods: {
      omit_special_char(e) {
          let keyCode = e.keyCode ? e.keyCode : e.which;
          if (
              (keyCode < 48 || keyCode > 57) && keyCode !== 46
          ) {
              // 46 is dot
              e.preventDefault();
          }
      },
  
      checkRequiredFields(index) {
        if(this.componentSelected.value[index] && this.purposeSelected.value[index] && this.amount.value[index] && this.remark.value[index]){
          let id;
          if(!this.bagData.row) {
            id = this.bagData.id
          }
          if (this.bagData.row && index <= this.bagData.row.length) {
            id = this.bagData.row[index-1].id ;
          }
          this.$emit('row-data', {
            index: index,
            fee_type: this.componentSelected.value[index],
            purpose_id: this.purposeSelected.value[index],
            gross_amount: this.amount.value[index] * 1,
            is_active: true,
            sac_code: this.sacCode[index] ? this.sacCode[index] : '',
            sgst_tax_rate: this.sgst[index] ? this.sgst[index] : 0,
            cgst_tax_rate: this.cgst[index] ? this.cgst[index] : 0,
            igst_tax_rate: this.igst[index] ? this.igst[index] : 0,
            total_amount: this.totalAmount[index],
            remark: this.remark.value[index],
            kapture_sr_id: this.kaptureId[index] ? this.kaptureId[index] : null,
            bag_id: this.bagData.bag_id, 
            shipment_id: this.bagData.shipment_id,
            seller_id: this.bagData.seller_id,
            seller_name: this.bagData.seller_name,
            // check_amount: this.componentDataList[index-1].amount,
            id: id,
            order_id: this.bagData.order_id,
            ordering_channel: this.bagData.ordering_channel
          })
        } else {
          this.$emit('disable-save', false);
        }
      },
  
      populateFromProp() {
        if (!this.bagData.row) {
          // console.log('in fee type bag', this.bagData.fee_type, this.tableSize)
          this.componentDataList.push({
            text: this.bagData.fee_type_display_name,
            value: this.bagData.fee_type,
            amount: this.bagData.charge_components && this.bagData.charge_components[this.tableSize-1].amount,
            sgst: this.bagData.charge_components && this.bagData.charge_components[this.tableSize-1].sgst_tax_rate ? this.bagData.charge_components[this.tableSize-1].sgst_tax_rate: 0,
            cgst: this.bagData.charge_components && this.bagData.charge_components[this.tableSize-1].cgst_tax_rate ? this.bagData.charge_components[this.tableSize-1].cgst_tax_rate: 0,
            igst: this.bagData.charge_components && this.bagData.charge_components[this.tableSize-1].igst_tax_rate ? this.bagData.charge_components[this.tableSize-1].igst_tax_rate: 0 
          })
          this.componentDataList.map(item => {
            this.grossAmount.push(item.amount);
            this.sacCode.push(item.sacCode);
            this.igst.push(item.igst);
            this.cgst.push(item.cgst);
            this.sgst.push(item.sgst);
          })
          this.makeChargeComponents();
          this.componentSelected.value[this.tableSize] = this.bagData.fee_type;
          this.purposeSelected.value[this.tableSize] = this.bagData.purpose_id;
          this.amount.value[this.tableSize] = this.bagData.gross_amount;
          this.sacCode[this.tableSize] = this.bagData.sac_code;
          this.sgst[this.tableSize] = this.bagData.sgst_tax_rate;
          this.igst[this.tableSize] = this.bagData.igst_tax_rate;
          this.cgst[this.tableSize] = this.bagData.cgst_tax_rate;
          this.remark.value[this.tableSize] = this.bagData.remark;
          this.kaptureId[this.tableSize] = this.bagData.kapture_sr_id;
          this.totalAmount[this.tableSize] = this.bagData.total_amount;
        }  else {
          this.tableSize = this.bagData.row.length;
          // to populate the component dd with charge comp related to the bag id
            this.bagData.charge_components.map(cc => {
            this.componentDataList.push({
              text: cc.display_name,
              value: cc.type,
              amount: cc.amount,
              sgst: cc.sgst_tax_rate ? cc.sgst_tax_rate: 0,
              cgst: cc.cgst_tax_rate ? cc.cgst_tax_rate: 0,
              igst: cc.igst_tax_rate ? cc.igst_tax_rate: 0,
              sacCode: cc.sac_code
            })
  
          })
          this.componentDataList.map(item => {
            this.grossAmount.push(item.amount);
            this.sacCode.push(item.sacCode);
            this.igst.push(item.igst);
            this.cgst.push(item.cgst);
            this.sgst.push(item.sgst);
          })
          this.makeChargeComponents();
  
          let index = 0;
          this.bagData.row.map(r => {
            this.componentSelected.value[index+1] = r.fee_type;
            this.purposeSelected.value[index+1] = r.purpose_id;
            this.amount.value[index+1] = r.gross_amount;
            this.sacCode[index+1] = r.sac_code;
            this.sgst[index+1] = r.sgst_tax_rate;
            this.igst[index+1] = r.igst_tax_rate;
            this.cgst[index+1] = r.cgst_tax_rate;
            this.remark.value[index+1] = r.remark;
            this.kaptureId[index+1] = r.kapture_sr_id;
            this.totalAmount[index+1] = r.total_amount;
            index++;
          })
        } 
      },
  
      spliceAllFields(index) {  
        this.componentSelected.value.splice(index, 1);
        this.componentSelected.errorMsg.splice(index, 1);
        this.purposeSelected.value.splice(index, 1);
        this.purposeSelected.errorMsg.splice(index, 1);
        this.amount.value.splice(index, 1);
        this.amount.errorMsg.splice(index, 1);
        this.sacCode.splice(index, 1);
        this.sgst.splice(index, 1);
        this.igst.splice(index, 1);
        this.cgst.splice(index, 1);
        this.totalAmount.splice(index, 1);
        this.remark.value.splice(index, 1);
        this.remark.errorMsg.splice(index, 1);
        this.kaptureId.splice(index, 1);
      },
  
      checkIsEmpty(e,type, value, index) {
        console.log(this.bagData);
        if(e){ //&& value.length > 0   might come in handy
          switch (type) {
            case 'component':
              this.$set(this.componentSelected.errorMsg,index,false);
              this.$emit('selected-component',this.componentSelected);
              break;
            case 'purpose':
              if (this.purposeSelected.value[index-1] === '') {
                this.$set(this.purposeSelected.errorMsg,index,true);
              } else {
                this.$set(this.purposeSelected.errorMsg,index,false);
              }
              break;
            case 'amount':
              this.$set(this.amount.errorMsg,index,false);

              console.log(this.chargeComponents)
              
              if(this.$route.params.noteType == 'credit'){
                this.validateAmount(index);
              }else{
                this.totalAmount[index] = this.setTotalAmount(index);
              }
              break;
            case 'remark':
              this.$set(this.remark.errorMsg,index,false);
              this.validationRemark(index);
              break;
            default:
              break;
          }
        } else {
          switch (type) {
            case 'component':
              this.$set(this.componentSelected.errorMsg,index,true);
              break;
            case 'purpose':
              this.$set(this.purposeSelected.errorMsg,index,true);
              break;
            case 'amount':
              this.$set(this.amount.errorMsg,index,true);
              break;
            case 'remark':
              this.$set(this.remark.errorMsg,index,true);
              break;
            default:
              break;
          }
        }
      },
  
      validationRemark(index) {
        if(this.remark.value.length < 1 ){ // || this.remark.value[index].length < 1  BUG with this line of code need to resolve ASAP
          this.$set(this.remark.errorMsg,index,true);
        }
      },
  
      validateAmount(index) {
        console.log(this.chargeComponents)
        let key = this.component === '' ? this.componentDataList[index-1].value : this.component;
        if(this.amount.value.length < 1 ){
          this.$set(this.amount.errorMsg,index,true);
        }
        
        else if(Number(this.amount.value[index]) <= this.chargeComponents[key]['amount']){
          if (this.amount.value[index]*1 <= 0) {
            this.validateErrIndex = index;
            this.amount.validationError = 'Amount should be greater than 0';
          }
          else if (!this.roundToTwo(this.amount.value[index])) {
            this.validateErrIndex = index;
            this.amount.validationError = 'Only 2 digits allowed after decimal';
          } else {
            this.amount.validationError = '';
            this.totalAmount[index] = this.setTotalAmount(index);
          }
        } else {
          this.validateErrIndex = index;
          this.amount.validationError = `Amount should be less than or equal the gross amount: ${this.chargeComponents[key]['amount']}`;
        }
      },
  
      setTotalAmount(index) {
        let igst = (this.igst[index] * this.amount.value[index]) / 100
        let cgst = (this.cgst[index] * this.amount.value[index]) / 100
        let sgst = (this.sgst[index] * this.amount.value[index]) / 100
  
        return (this.amount.value[index]*1 + igst*1 + cgst*1 + sgst*1);
      },
  
      changesInDD(e,type,index) {
        switch (type) {
          case 'component':
            this.component = e;
            if (this.componentSelected.value[index] === '' || e.text === '') {
              this.$set(this.componentSelected.errorMsg,index,true);
            } else {
                  this.sgst[index] = this.chargeComponents[e]['sgst']
                  this.cgst[index] = this.chargeComponents[e]['cgst']
                  this.igst[index] = this.chargeComponents[e]['igst']
                    this.sacCode[index] = this.chargeComponents[e]['sacCode']
                    this.amount[index] = this.chargeComponents[e]['amount']
                    
             }
            break;
  
          case 'purpose':
            this.$set(this.purposeSelected.value,index,e.text);
            this.$set(this.purposeSelected.errorMsg,index,true);
            break;
  
          default:
            break;
        }
      },
  
      roundToTwo(num) {
        num = num+''
        let length = num.length;
        let index = num.indexOf('.');
        if(index === -1) return true;
        if (length - index - 1 > 2) {
            return false;
        }
        return true;
      },
  
      // addLine() {
      //  if(this.tableSize < this.componentDataList.length){
      //    this.tableSize += 1;
      //  }
      //  else{
      //    this.disableAddLine = true;
      //    this.makePayload();
      //  }
      //}, 
  
      deleteRow(index, e) {
        if(this.tableSize === 1) {
          this.$snackbar.global.showError(
              `Can't be deleted. Minimum 1 row required`
            );
        } else {
          this.componentDataList.splice(index-1, 1);
          this.tableSize--;
          let id;
          
          if(!this.bagData.bag_id) {
            id = this.bagData.id
          }
          if (this.bagData.row && index <= this.bagData.row.length) {
            id = this.bagData.row[index-1].id ;
          }
          this.$emit('row-data', {
            index: index,
            fee_type: this.componentSelected.value[index],
            purpose_id: this.purposeSelected.value[index],
            gross_amount: this.amount.value[index] * 1,
            sac_code: this.sacCode[index] ? this.sacCode[index] : '',
            sgst_tax_rate: this.sgst[index] ? this.sgst[index] : 0,
            cgst_tax_rate: this.cgst[index] ? this.cgst[index] : 0,
            igst_tax_rate: this.igst[index] ? this.igst[index] : 0,
            total_amount: this.totalAmount[index],
            remark: this.remark.value[index],
            kapture_sr_id: this.kaptureId[index] ? this.kaptureId[index] : null,
            bag_id: this.bagData.bag_id, 
            shipment_id: this.bagData.shipment_id,
            seller_id: this.bagData.seller_id,
            seller_name: this.bagData.seller_name,
            id: id,
            order_id: this.bagData.order_id,
            ordering_channel: this.bagData.ordering_channel,
            is_active: false
          })
           this.spliceAllFields(index);
        }
      },
  
      makePayload() {
      },
  
      makeChargeComponents() {
        this.componentDataList.map(item => {
            let key = item.value;
            let value = {
              'sacCode': item.sacCode,
              'igst': item.igst,
              'cgst': item.cgst,
              'sgst':item.sgst,
              'amount': item.amount
            }
            Object.assign(this.chargeComponents,{[key]: value});
          })
      }
    }
  }
  </script>
  
  <style lang="less" scoped>
    
    .hidden-section {
      padding-top: 15px;
    }
  
    .mirage-table {
      border: 1px solid #E0E0E0;
      width: 100%;
      margin-bottom: 24px;
      font-family: Inter, sans-serif;
      font-size: 14px;

      .total-amt{
        width: 90px;
      }
      
      tr:first-child {
        background: @Alabaster2;
        color: @Black;
      }
  
      tr:not(:first-child) {
        border-bottom: 1px solid @Iron;
      }
  
      td {
        text-align: center;
        padding: 16px 6px;
        border-right: 1px solid @Iron;
      }
  
      .add-line{
        padding-left: 20px;
        text-align: start;
      }
    }
  
    .cursor-pointer{
      cursor: pointer;
    }
  
    .clickable {
      color: @RoyalBlue;
    }
    .clickable:disabled { 
      opacity: 0.5;
    }
  
    .icon-delete {
      ::v-deep svg {
        rect {
          display: none;
        }
      }
    }
  
    .icon-ok {
      .inline-svg {
        ::v-deep svg {
          position: absolute;
          right: 80px;
          top: 550px;
        }
      }
    }
  
  </style>
  