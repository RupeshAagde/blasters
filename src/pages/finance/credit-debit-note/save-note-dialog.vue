<template>
    <nitrozen-dialog
      class="saveNoteDialog"
      ref="saveNoteDialog"
    >
  
        <template slot="body">
            <inline-svg :src="'warning'" class="warning"></inline-svg>
            
            <div class="dialog-text-heading">Are you sure you want to save?</div>
            <div class="dialog-text-body">By saving are confirming that the data you entered is correct. This action cannot be undone.</div>
        </template>
  
        <template slot="footer">
          <div class="footer-actions-buttons">
              <nitrozen-button
                  class="stay-button"
                  theme="secondary"
                  @click="close"
                  v-strokeBtn
                  >No
              </nitrozen-button>
              <nitrozen-button
                  class="save-button"
                  theme="secondary"
                  @click="saveDetails"
                  v-flatBtn
                  >Yes, Save
              </nitrozen-button>
          </div>
        </template>
    </nitrozen-dialog>
  </template>
  
  <script>
  import InlineSvg from '@/components/common/inline-svg.vue'; 
  import CreditDebitNoteServices from '@/services/cn-dn.service';
  
  import {
      NitrozenDialog,
      NitrozenButton,
      flatBtn,
      strokeBtn
  } from '@gofynd/nitrozen-vue';
  
  export default {
      name: 'saveNoteDialog',
      components: {
          NitrozenDialog,
          NitrozenButton,
          InlineSvg
      },
      directives: {
        flatBtn,
        strokeBtn
      },
      props: {
          title: {
            type: String
          },
          data: {
            type: Object
          }
      },
      data() {
        return {
          payload: {}
        }
      },
      methods: {
        close() {
              this.$refs.saveNoteDialog.close();
              this.$emit('close');
        },
        async save() {
          let res;
          try {
            res = await CreditDebitNoteServices.saveNote(this.payload);
            this.$snackbar.global.showSuccess('Note successfully created');
          } catch (error) {
            this.$snackbar.global.showError('Error in creating note');
          } finally {
            this.$router.back()
          }
        },
        saveDetails(){
          this.$refs.saveNoteDialog.close();
          this.save();
        },
        open({ data }){
          this.payload = data
          this.$emit('open');
          this.$refs.saveNoteDialog.open({
            height: '303px',
            width: '386px'
          })
        },
      }
  }
  </script>
  
  <style lang="less" scoped>
    .saveNoteDialog {
      
      .warning {
        height: 60px;
        width: 60px;
        margin-left: 140px;
        margin-top: 40px;
        margin-bottom: 25px;
      }
  
      .dialog-text-heading {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
      }
  
      .dialog-text-body {
        text-align: center;
        font-size: smaller;
        color: #666666;
      }
  
      .footer-actions-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        height: 100%;
        width: 100%;
        font-size: smaller;
        .stay-button {
          width: 100px;
        }
      }
  
      ::v-deep .nitrozen-dialog {
        border-radius: 10px;
      }
  
    }
  
  
  </style>
  