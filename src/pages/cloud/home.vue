<template>
  <div>
    <page-empty
      text="Dummy Page"
      buttonText="Dummy Button"
      @refresh="$router.replace({ path: '/cloud/home' })"
    ></page-empty>
  </div>
</template>

<style lang="less" scoped></style>
<script>
import pageEmpty from '@/components/common/page-empty.vue'
export default {
  name: 'page-not-found',
  components: {
    'page-empty': pageEmpty
  },
  data() {
    return {}
  },
  computed: {}
}
</script>
