<template>
<div>
   <page-header :title="'Add New Category'">
     <div :class="{
       'add-category-button':true,
       opaque:isButtonDisabled
       }">
       <nitrozen-button 
       theme="secondary" 
       v-flatBtn 
       title="Save"
       :disabled="isButtonDisabled"
      >
      Save
    </nitrozen-button>
     </div>
   </page-header>
  <div class="create-category-container">
    <create-category/>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/common/layout/page-header.vue"
import CreateCategory from '../../components/packaging/create-category.vue'
import { NitrozenButton } from '@gofynd/nitrozen-vue';
export default {
name: 'create-category-home',
components:{
  CreateCategory,
  PageHeader,
  NitrozenButton
},
data(){
  return {
    isButtonDisabled: true
  }
}
}
</script>
<style lang="less">
@import '../../less/packaging/create-category-home.less';
</style>