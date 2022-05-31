<template>
  <div class="list-packaging-container">
      <div class="list-packaging-container-header">
          Packaging List
      </div>
      <div class="list-container">
          <no-content
          :helperText="'No packaging list have been created yet.'"
          :btnText="'Add Packaging'"
          />
      </div>
  </div>
</template>

<script>
import NoContent from '../../components/common/adm-no-content.vue'
export default {
name:'list-packaging',
components:{
    NoContent
},
methods:{
    tryAgain(){
        console.log("Add packaging called")
    }
}
}
</script>

<style lang="less">
@import '../../less/packaging/list-packaging.less';
</style>