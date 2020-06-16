<template>
  <div>
    <page-empty
      text="404 | Page Not Found"
      buttonText="Go to Home"
      @refresh="$router.replace({ path: '/' })"
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
