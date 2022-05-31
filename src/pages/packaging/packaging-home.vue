<template>
  <div>
    <page-header :title="'Packaging'"/>
    <div class="packaging-home-container">
      <!-- Call the add package and list package components here -->
      Packaging home
    </div>
    </div>
</template>

<script>
import PageHeader from "../../components/common/layout/page-header.vue"
export default {
name: 'packaging-home',
components:{
 PageHeader
}
}
</script>
<style lang="less">
@import '../../less/packaging/packaging-home.less';
</style>