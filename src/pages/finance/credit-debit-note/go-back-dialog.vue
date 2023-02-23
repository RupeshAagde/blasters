<template>
    <nitrozen-dialog
      class="goBackDialog"
      ref="goBackDialog"
    >
  
        <template slot="body">
            <inline-svg :src="'warning'" class="warning"></inline-svg>
            
            <div class="dialog-text-heading">Are you sure you want to back?</div>
            <div class="dialog-text-body">If you go back the data you have added will not be saved as there is no draft mode</div>
        </template>
  
        <template slot="footer">
          <div class="footer-actions-buttons">
              <nitrozen-button
                  theme="secondary"
                  @click="fillForm"
                  v-strokeBtn
                  >No, Cancel
              </nitrozen-button>
              <nitrozen-button
                  theme="secondary"
                  class="go-back"
                  @click="goBackConfirm"
                  v-flatBtn
                  >Yes, Go Back
              </nitrozen-button>
          </div>
        </template>
    </nitrozen-dialog>
  </template>
  
  <script>
  import InlineSvg from '@/components/common/inline-svg.vue';
  
  import {
      NitrozenDialog,
      NitrozenButton,
      flatBtn,
      strokeBtn
  } from '@gofynd/nitrozen-vue';
  
  export default {
      name: 'goBackDialog',
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
        data:{
          type: Object,
          // default: ()=>{}
        }
      },
      data() {
        return {
          payload:{}
        }
      },
      methods: {
          open({}){
          this.$refs.goBackDialog.open({
            showCloseButton: true,
            height: '303px',
            width: '386px'
          })
        },
        fillForm() {
          this.$refs.goBackDialog.close({});
          // this.$emit('close');
        },
        goBackConfirm() {
          //this.getPayload();
          // this.$emit('close');
          this.$refs.goBackDialog.close({});
          this.$router.back();
        }
      }
  }
  </script>
  
  <style lang="less" scoped>
    .goBackDialog {
      
      .warning {
        margin-top: 40px;
        margin-bottom: 25px;
        ::v-deep svg {
          width: 60px;
          height: 60px;
        }
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
      }
  
      ::v-deep .nitrozen-dialog {
        border-radius: 10px;
      }
  
    }
  
  
  </style>
  