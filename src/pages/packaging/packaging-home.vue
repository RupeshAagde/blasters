<template>
  <div>
    <page-header :title="'Packaging'"/>
    <div class="packaging-home-container">
      <div class="packaging-home-list">
        <list-packaging/>
      </div>
    </div>
    </div>
</template>

<script>
import PageHeader from "../../components/common/layout/page-header.vue"
import AddPackaging from '../../components/packaging/add-packaging.vue'
import ListPackaging from '../../components/packaging/list-packaging.vue'
export default {
name: 'packaging-home',
components:{
 PageHeader,
 AddPackaging,
ListPackaging
}
}
</script>
<style lang="less">
@import '../../less/packaging/packaging-home.less';
</style>