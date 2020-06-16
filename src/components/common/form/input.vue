<template>
  <div>
    <nitrozen-input
      :type="type"
      :label="getLabel"
      v-model="item.value"
      :maxlength="item.maxLength"
    ></nitrozen-input>
    <nitrozen-error v-if="error">
      {{ error }}
    </nitrozen-error>
  </div>
</template>
<script>
import {
  NitrozenCheckBox,
  NitrozenInput,
  NitrozenError,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'

export default {
  name: 'gen-input',
  components: {
    'nitrozen-input': NitrozenInput,
    'nitrozen-error': NitrozenError
  },
  props: {
    type: {},
    item: {},
    error: {}
  },
  computed: {
    getLabel() {
      if (this.item.required) {
        return this.item.label + ' * '
      }
      return this.item.label + ' (Optional) '
    }
  }
}
</script>

<style lang="less" scoped></style>
