<template>
    <div class="filters-section" @click="stopClick($event)">
         <div v-if="inProgress">
             <loader class="loading"></loader>
         </div>
         <div v-if="!inProgress" class="header-box">
                 <div class="filters-title">
                     <span>{{ displayStatus }}</span>
                 </div>
                 <div v-if="enableNTab" class="group-name-container">
                             <nitrozen-tab
                                 class="group-tab"
                                 :activeIndex="currentIdx"
                                 :tabItem="getTabs()"
                                 :label="'name'"
                                 @tab-change="changeGroupIndex"
                 ></nitrozen-tab>
                 </div>
         </div>
          <div class="request-cards">
                 <div class="request-card" v-for="(tab, index) in notesSet[tabs[currentIdx]]" :key="'col-' + index">
                     <div class="request-details">
                         <div class="left flex-col">
                             <span>Seller Name: {{ tab.sellerName }}</span>
                             <span>Request {{ tab.requestNo }}</span>
                         </div>
                         <div class="right flex-col">
                             <span>Gross Amount</span>
                             <span>₹ {{ tab.grossAmount }}</span>
                         </div>
                     </div>
                     <div v-if="index!=0" class="request-comment-copy">
                         <div class="icon-eye">
                                 <nitrozen-checkbox
                                     v-model="tab.is_checked"
                                     @change="select(index,tab)"
                                     :disabled="tab.is_checked"
                                 >
                                 </nitrozen-checkbox>
                         </div>
                         <span>Same reason as above request</span>
                     </div>
                     <div class="request-comments">
                         <span v-if="status==='Approve'">Comment *</span>
                         <span v-else>Rejection Reason *</span>
                         <nitrozen-input
                             class="comment filter-input-lg"
                             type="search"
                             :placeholder="`Write your comment here...`"
                             v-model="tab.comment"
                             @input="validateForm(index,tab)"
                         ></nitrozen-input>
                         <nitrozen-error v-if="tab.errorMessage"> {{ tab.errorMessage }}</nitrozen-error>
                     </div>
                 </div>
         </div>
          <div v-if="!inProgress" class="footer-box">
             
             <nitrozen-button 
                 class="clear-button" 
                 v-strokeBtn 
                 :theme="'secondary'"
                 @click="close(false)"
             >
                 Cancel
             </nitrozen-button>
         
             <nitrozen-button 
                 class="apply-filter-button" 
                 v-flatBtn 
                 :theme="'secondary'"
                 @click="getApproveAll()"
                 :disabled="disableSave()"
             >Save</nitrozen-button>
             
        </div>
        
    </div>
 </template>
 <style lang="less" scoped>
 
 .group-name-container {
     margin-bottom: 24px;
     .group-tab {
         width: 100%;
         margin: auto;
         margin-top: 16px;
         padding: 2% 7% 0px;
         border-bottom: 1px solid #E0E0E0;
         /deep/.nitrozen-tab {
             padding: 0px;
         }
     }
 }
 
 .filters-section {
     height: 100%;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     .loading{
         position: unset;
         background: transparent;
     }
     .header-box{
         box-sizing: border-box;
         /*height: 55px;*/
         /*border-bottom: 1px solid #E0E0E0;*/
         .filters-title {
             margin-top: 24px;
             padding-left: 24px;
             font-family: 'Inter';
             font-style: normal;
             font-weight: 600;
             font-size: 20px;
             line-height: 31px;
             color: #41434C;
             border-bottom: 1px solid #E0E0E0;
         }
     }
   
 }
 .request-cards{
     display: flex;
     overflow-y: auto;
     flex-direction: column;
     padding-bottom: 20px;
     height: inherit;
 }
   .request-card{
     width: 80%;
     margin: 6% 6% 0% 6%;
     margin-top: 20px;
     border: 1px solid #E0E0E0;
     border-radius: 5px;
     padding: 16px;
         .request-details {
             display: flex;
             justify-content: space-between;
             .left{
                 width: 65%;
                 span:nth-of-type(1){
                     font-size: 12px;
                 }
                 span:nth-of-type(2){
                     font-size: 18px;
                     font-weight: 600;
                 }
             }
             .right{
                 span{
                     font-size: 12px;
                 }
                 span:nth-of-type(2){
                     text-align: right;
                     font-weight: 600;
                 }
             }
             .flex-col{
                 display: flex;
                 flex-direction: column;
                 gap: 7px;
                 span {
                     color:#41434C;
 ;
                 }
             }
         }
 
         .request-comment-copy{
             padding-top: 14px;
             display: flex;
             flex-direction: row;
             gap: 0px;
             span {
                 color: #9B9B9B;
                 font-size: 12px;
                 margin-bottom: 8px;
                 padding-top: 3px;
             }
         }
 
         .icon-eye{
             ::v-deep svg {
                 width: 16px;
                 height: 16px;
                 #prefix__Eye_Open {
                     stroke: @RoyalBlue;
                     stroke-width: 2;
                 }
             }
         }
 
         .request-comments{
             padding-top: 14px;
             display: flex;
             flex-direction: column;
             gap: 0px;
             span {
                 color: #9B9B9B;
                 font-size: 12px;
                 margin-bottom: 8px;
                 padding-top: 3px;
             }
         }
     }
     .footer-box {
         display: flex;
         justify-content: flex-end;
         align-items: center;
         gap: 24px;
         /*margin-top: 25px;*/
         box-sizing: border-box;
         border-top: 1px solid #E0E0E0;
         height: 72px;
         padding: 10px;
         background: #FFFFFF;
         box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
         .apply-filter-button{
             margin-right: 16px;
         }
     }
 </style>
 <script>
 import { 
     NitrozenButton,
     NitrozenInput,
     flatBtn,
     strokeBtn,
     NitrozenCheckBox,
     NitrozenError,
     NitrozenTab
 } from '@gofynd/nitrozen-vue';
 import CreditDebitNoteServices from '@/services/cn-dn.service';
 import {
     convertSnakeCaseToString
 } from '../../../helper/utils';
 import { isEmpty } from 'lodash';
 
 export default {
     name: 'approver-drawer',
     components: {
       //'nitrozen-tab': NitrozenTab,
       'nitrozen-checkbox':NitrozenCheckBox,
       NitrozenButton,
       NitrozenInput,
       NitrozenError,
       NitrozenTab
     },
     directives: {
       flatBtn,
       strokeBtn
     },
     props: {
         notesSet: {
             type: Object,
             default: () => {}
         },
         status: {
             type: String
         }
     },
     data(){
         return{
             comment: {},
             errorMessage: '',
             isValid: false,
             currentIdx : 0,
             tabs: [],
             commentsSet:{},
             enableNTab : false,
             totalCount : 0,
             displayStatus : '',
             inProgress : false
         };
     },
     mounted(){
         this.setTabs();
     },
     methods: {
          setTabs(){
             this.totalCount= 0;
             for(const [key] of Object.entries(this.notesSet)){
                 this.tabs.push(key)
                 this.commentsSet[key] = [];
                 this.totalCount += Object.keys(this.notesSet[key]).length;
             }
             this.enableNTab =  this.notesSet && Object.keys(this.notesSet).length > 1
             if(this.totalCount > 1){
                 this.displayStatus = 'Bulk ' + this.status +` (${this.totalCount})`
             } else{
                 this.displayStatus = this.status;
             }
             //console.log("comment set",this.commentsSet,Object.keys(this.notesSet).length)
          },
          getTabs(){
            let noteCategoryTabs=[];
            this.tabs.map(tab => {
              noteCategoryTabs.push(convertSnakeCaseToString(tab)+` (${this.commentsSet[tab].length}/${this.notesSet[tab].length})`);
              //console.log("tabs",convertSnakeCaseToString(tab)+`(${this.commentsSet[tab].length}/${this.notesSet[tab].length})`)
             });
             return noteCategoryTabs;
         },
          changeGroupIndex(item) {
             //console.log("change",this.tabs[this.currentIdx],this.notesSet[this.tabs[this.currentIdx]])
             this.currentIdx = item.index;
             //console.log(this.tabs[this.currentIdx])
             //console.log(this.notesSet[this.tabs[this.currentIdx]])
          },
 
         stopClick(event){
             event.stopPropagation();
         },
 
         unSelect(tab) {
             tab.comment = '';
             tab.errorMessage = '';
             tab.isValid = '';
             this.commentsSet[this.tabs[this.currentIdx]] = this.commentsSet[this.tabs[this.currentIdx]].filter((x) =>
                x != tab.noteId
             );
             //console.log("after unselect comment....comment set",this.commentsSet)
         },
 
         select(index, tab) {
             //console.log("checkbox index is",index,tab,this.notesSet[this.tabs[this.currentIdx]][index-1])
             var tabItem = this.tabs[this.currentIdx];
             tab.comment = this.notesSet[tabItem][index-1].comment;
             tab.errorMessage = this.notesSet[tabItem][index-1].errorMessage;
             tab.isValid = this.notesSet[tabItem][index-1].isValid;
             tab.is_checked = !tab.is_checked 
             if(tab.isValid == false){
                 this.unSelect(tab);
             } else if(tab.is_checked == true && tab.isValid == true){
                 let commentsIndex = this.commentsSet[tabItem].indexOf(tab.noteId)
                 if(commentsIndex == -1){
                     this.commentsSet[tabItem].push(tab.noteId)
                 }
                 //console.log("after select above comment.... comment set",this.commentsSet)
             }
             this.$forceUpdate();
         },
 
         getApprove(tab){
             let params = {
                 data: {
                     note_id: [tab.noteId],
                     status: this.status === 'Approve' ? 'approved' : 'rejected', //status (rejected or approved) prop on click of button this.status
                     remark: tab.comment,
                 }
             };
             const caller = CreditDebitNoteServices.updateNoteStatus(params); //api integretion
             caller
                 .then((res) => {
                     this.$snackbar.global.showSuccess('Note status successfully changed');
                 })
                 .catch(err => {
                     this.$snackbar.global.showError('Error in updating status of note', err); 
                 })
                 .finally(() => {
                     // return false;
                     //console.log('router', this.$route.path)
                     // if (this.$route.path === '/administrator/finance/credit-debit-note') {
                     //     // console.log('stay')
                     // }
                     // else this.$router.back();
                 });
         },
 
         getApproveAll()
         {
             this.inProgress = true;
             for (const [key,value] of Object.entries(this.notesSet)) {
                 for(let i=0; i<value.length; i++)
                 {
                     this.getApprove(value[i]);
                 }
             }
             this.inProgress = false;
             this.close(true);
         },
 
         close: function (e) {
             //e.stopPropagation();
             this.$emit('drawerClose', e)
             //this.quickApproveView = false;
         },
 
         validateForm(index,tab) {
             var tabItem = this.tabs[this.currentIdx];
 
             if (isEmpty(tab.comment) || tab.comment.trim() === '') {
                 tab.errorMessage = 'Comment required'
                 tab.isValid = false
                 this.commentsSet[tabItem] = this.commentsSet[tabItem].filter((x) =>
                     x != tab.noteId
                 );
                // console.log("after wrong comment.... comment set",this.commentsSet)
             } else {
                 tab.errorMessage = ''
                 tab.isValid = true
                 let commentsIndex = this.commentsSet[tabItem].indexOf(tab.noteId)
                 if(commentsIndex == -1){
                     this.commentsSet[tabItem].push(tab.noteId)
                 }
                 //console.log("after correct comment.... comment set",this.commentsSet)
             }
             if(tab.is_checked == true){
                tab.is_checked = false;
             }
            // console.log("########## inde xis",index,Object.keys(this.notesSet[this.tabs[this.currentIdx]]).length)
             if(index < Object.keys(this.notesSet[tabItem]).length-1){
               this.notesSet[tabItem][index+1].is_checked = false;
             }
             this.$forceUpdate();
         },
 
         disableSave () {
              for (const [key,value] of Object.entries(this.commentsSet)) {
                 if(value.length != this.notesSet[key].length){
                     return true;
                 }
             }
             return false;
         },
         // getListData(){
         //     //this.inProgress = true;
         //     const caller = CreditDebitNoteServices.getListData(this.initialPayload); //api integretion
         //     caller
         //         .then((res) => {
         //             this.tableDataItems = res.data.items;
         //             this.pageObject.total = res.data.page.item_count;
         //         })
         //         .catch((err) => {
         //             /* this.$snackbar.global.showError(
         //                 `Failed due to ${err?.message}`
         //             ); */
         //         })
         //         .finally(() => {
         //             this.inProgress = false;
         //         });
         // },
     }
 }
 </script>
 