<template>
  <div class="list-packaging-container">
      <div class="list-packaging-container-header">
          Packaging Item List
          <div class="add-packaging-btn-container">
               <nitrozen-button
                class="add-packaging-btn"
                :rounded="true"
                theme="secondary"
                title="Add Packaging"
                >Add Packaging</nitrozen-button
            >
          </div>
      </div>
      <div class="list-container">
          <no-content
          :helperText="'No packaging list have been created yet.'"
          :btnText="'Add Packaging'"
          @tryAgain="handleAddPackaging"
          />
      </div>
  </div>
</template>

<script>
import NoContent from '../../components/common/adm-no-content.vue'
import { NitrozenButton, strokeBtn } from '@gofynd/nitrozen-vue';
export default {
name:'list-packaging',
components:{
    NoContent,
    NitrozenButton
},
methods:{
    /**
     * @author Rohan Shah
     * @description On click for add packaging button click
     */
    handleAddPackaging(){
        this.$router.push('/administrator/packaging/create')
    }
}
}
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>