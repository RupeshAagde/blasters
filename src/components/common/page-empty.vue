<template>
  <div class="page-error">
    <img :src="icon" />
    <div class="page-error-text" alt="No content">
      <span class="dark-sm cl-DustyGray2">{{ text }}</span>
    </div>
    <div v-if="buttonText">
      <nitrozen-button theme="secondary" v-flatBtn @click="onRefresh()">
        {{ buttonText }}
      </nitrozen-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-error {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 5%;
  img {
    width: 400px;
    height: 300px;
  }
  .page-error-text {
    color: @Mako;
    span {
      display: block;
      margin: 24px;
    }
  }
}
</style>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue'

export default {
  name: 'page-empty',
  components: {
    'nitrozen-button': NitrozenButton
  },
  directives: {
    flatBtn
  },
  props: {
    text: {
      type: String,
      default: 'No content present'
    },
    icon: {
      type: String,
      default: '/public/assets/pngs/page-empty.png'
    },
    buttonText: {
      type: String,
      default: ''
    }
  },
  methods: {
    onRefresh() {
      this.$emit('refresh')
    }
  }
}
</script>
