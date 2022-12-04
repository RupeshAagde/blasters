<template>
    <div class="filters-section" @click="stopClick($event)">
         <div class="header-box">
                 <div class="filters-title">
                     <span>{{ status }}</span>
                 </div>
         </div>
         <div class="request-card">
             <div class="request-details">
                 <div class="left flex-col">
                     <span>Seller Name: {{ sellerName }}</span>
                     <!-- <span>Seller Name: {{ sellerName }}</span> -->
                     <span>Request {{ requestNo }}</span>
                     <!-- <span>Request {{ requestNo }}</span> -->
                 </div>
                 <div class="right flex-col">
                     <span>Gross Amount</span>
                     <span>₹ {{ grossAmount }}</span>
                     <!-- <span>{{ grossAmount }}</span> -->
                 </div>
             </div>
             <div class="request-comments">
                 <span v-if="status==='Approve'">Comment *</span>
                 <span v-else>Rejection Reason *</span>
                 <nitrozen-input
                     class="comment filter-input-lg"
                     type="search"
                     :placeholder="`Write your comment here...`"
                     v-model="comment"
                     @input="validateForm"
                     @click="validateForm"
                 ></nitrozen-input>
                 <nitrozen-error v-if="errorMessage"> {{ errorMessage }}</nitrozen-error>
             </div>
         </div>
         <div class="footer-box">
             
             <nitrozen-button 
                 class="clear-button" 
                 v-strokeBtn 
                 :theme="'secondary'"
                 @click="close($event)"
             >
                 Cancel
             </nitrozen-button>
         
             <nitrozen-button 
                 class="apply-filter-button" 
                 v-flatBtn 
                 :theme="'secondary'"
                 @click="getApprove"
                 :disabled="disableSave()"
             >Save</nitrozen-button>
             
        </div>
    </div>
 </template>
 <style lang="less" scoped>
 .filters-section {
     height: 100%;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     .header-box{
         box-sizing: border-box;
         height: 55px;
         border-bottom: 1px solid #E0E0E0;
         .filters-title {
             margin-top: 24px;
             margin-left: 24px;
             font-family: 'Inter';
             font-style: normal;
             font-weight: 600;
             font-size: 20px;
             line-height: 31px;
             color: #41434C;
         }
     }
     .request-card{
         width: 80%;
         margin: auto;
         margin-top: 16px;
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
 
         .request-comments{
             padding-top: 14px;
             display: flex;
             flex-direction: column;
             gap: 5px;
             span {
                 color: #9B9B9B;
                 font-size: 12px;
                 margin-bottom: 8px;
             }
         }
     }
     .footer-box {
         display: flex;
         justify-content: flex-end;
         align-items: center;
         gap: 24px;
         margin-top: 72px;
         box-sizing: border-box;
         border-top: 1px solid #E0E0E0;
         height: 72px;
         background: #FFFFFF;
         box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
         .apply-filter-button{
             margin-right: 16px;
         }
     }
 }
 </style>
 <script>
 import { 
     NitrozenButton,
     NitrozenInput,
     flatBtn,
     strokeBtn,
     NitrozenError
 } from '@gofynd/nitrozen-vue';
 import CreditDebitNoteServices from '@/services/cn-dn.service';
 
 export default {
     name: 'approver-drawer',
     components: {
       //'nitrozen-tab': NitrozenTab,
       NitrozenButton,
       NitrozenInput,
       NitrozenError
     },
     directives: {
       flatBtn,
       strokeBtn
     },
     props: {
         noteId: {
             type:  String,
         },
         sellerName: {
             type:  String,
         },
         requestNo: {
             type: String,
         },
         status: {
             type: String,
         },
         grossAmount: {
             type: Number,
         }
     },
     data(){
         return{
             comment: '',
             errorMessage: '',
             isValid: false
         };
     },
     mounted(){
     },
     methods: {
         stopClick(event){
             event.stopPropagation();
         },
         getApprove(){
             let params = {
                 data: {
                     note_id: this.noteId, // note id prop this.title wala this.moteId
                     status: this.status === 'Approve' ? 'approved' : 'rejected', //status (rejected or approved) prop on click of button this.status
                     remark: this.comment,
                 }
             };
             const caller = CreditDebitNoteServices.updateNoteStatus(params); //api integretion
             caller
                 .then((res) => {
                     this.close(res);
                     this.$snackbar.global.showSuccess('Note status successfully changed');
                 })
                 .catch(err => {
                     console.log(err);
                     this.close(err);
                     this.$snackbar.global.showError('Error in updating status of note', err); 
                 })
                 .finally(() => {
                     //console.log('router', this.$route.path)
                     if (this.$route.path === '/administrator/finance/credit-debit-note') {
                         // console.log('stay')
                     }
                     else this.$router.back();
                 });
 
         },
         close: function (e) {
             //e.stopPropagation();
             this.$emit('drawerClose')
             //this.quickApproveView = false;
         },
         validateForm () {
             // if (this.status === 'Approve') {
             //     this.errorMessage = '';
             //     return;
             // }
             if (this.comment.trim() === '') {
                 this.errorMessage = 'Comment required'
                 this.isValid = false
             } else {
                 this.errorMessage = ''
                 this.isValid = true
             }
         },
         disableSave () {
             // if (this.status === 'Approve' || (this.status === 'Reject' && this.isValid === true)) {
             //     return false;
             // }
             // return true;
             if (this.isValid === true) {
                 return false;
             }
             return true;
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
 