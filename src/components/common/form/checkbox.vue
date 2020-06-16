<template>
  <div>
    <label class="checkbox-label dark-xxs">
      {{ item.label }}
      <template v-if="item.required"
        >*</template
      >
      <template v-else
        >(Optional)</template
      >
    </label>
    <nitrozen-checkbox
      class="checkbox-item"
      v-for="(chk, chkid) in item.enums"
      :checkboxValue="chk.value"
      v-model="item.value"
      @input="changed"
      :key="item.label + chkid"
      >{{ chk.display }}</nitrozen-checkbox
    >
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
  name: 'gen-checkbox',
  components: {
    'nitrozen-checkbox': NitrozenCheckBox,
    'nitrozen-error': NitrozenError
  },
  props: {
    item: {},
    error: {}
  },
  data() {
    this.item.value = []
    return {
      checkboxModel: []
    }
  },
  methods: {
    changed(val) {
      let index = Array.from(this.checkboxModel).indexOf(val[0])
      if (index === -1) {
        this.checkboxModel.push(val[0])
      } else {
        this.checkboxModel.splice(index, 1)
      }

      this.item.value = this.checkboxModel
    }
  }
}
</script>

<style lang="less" scoped>
.checkbox-item {
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 10px 0px;
}
.checkbox-label {
  color: @DustyGray2;
  line-height: 21px;
}
</style>
