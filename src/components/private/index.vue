<template>
  <div class="action-container card-container">
    <div>
      <transition name="fade" mode="out-in">
        <no-ssr>
          <router-view
            :inviteId="$route.query.inviteId"
            class="view"
          ></router-view>
        </no-ssr>
      </transition>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
export default {
  name: 'private',
  components: {
    'no-ssr': NoSSR
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {}
}
</script>

<style lang="less" scoped>
.action-container {
  background-color: @White;
  padding: 20px;
  min-height: 700px;
  margin-top: 24px;
}
</style>
