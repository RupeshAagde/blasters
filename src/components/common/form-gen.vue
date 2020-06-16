<template>
  <form>
    <template v-for="(obj, key) in formjson">
      <template v-if="!obj.type">
        <form-gen
          :formjson="obj"
          :key="key"
          :errors="errors[key] || {}"
        ></form-gen>
      </template>
      <template v-else-if="!obj.hidden">
        <template v-if="obj.type === CONTROL_TYPES.STRING">
          <form-gen-input
            :key="key"
            class="item"
            type="text"
            :item="obj"
            :error="errors[key]"
          ></form-gen-input>
        </template>
        <template v-else-if="obj.type === CONTROL_TYPES.NUMBER">
          <form-gen-input
            :key="key"
            class="item"
            type="number"
            :item="obj"
            :error="errors[key]"
          ></form-gen-input>
        </template>
        <template v-else-if="obj.type === CONTROL_TYPES.URL">
          <form-gen-input
            :key="key"
            class="item"
            type="text"
            :item="obj"
            :error="errors[key]"
          ></form-gen-input>
        </template>
        <template v-else-if="obj.type === CONTROL_TYPES.EMAIL">
          <form-gen-input
            :key="key"
            class="item"
            type="email"
            :item="obj"
            :error="errors[key]"
          ></form-gen-input>
        </template>
        <template v-else-if="obj.type === CONTROL_TYPES.OPTIONS">
          <form-gen-checkbox
            :key="key"
            :item="obj"
            :error="errors[key]"
          ></form-gen-checkbox>
        </template>
      </template>
    </template>
  </form>
</template>

<style lang="less" scoped>
.item {
  margin: 10px 0px;
}
</style>

<script>
import {
  NitrozenButton,
  NitrozenDropdown,
  NitrozenCheckBox,
  NitrozenInput,
  strokeBtn,
  flatBtn
} from '@gofynd/nitrozen-vue'
import { mapGetters } from 'vuex'
import formGenInputVue from './form/input.vue'
import formGenCheckboxVue from './form/checkbox.vue'

const CONTROLS = {
  STRING: 'string',
  EMAIL: 'email',
  NUMBER: 'number',
  URL: 'url',
  OPTIONS: 'options'
}

export default {
  name: 'form-gen',
  components: {
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput,
    'nitrozen-checkbox': NitrozenCheckBox,
    'nitrozen-dropdown': NitrozenDropdown,
    'form-gen-input': formGenInputVue,
    'form-gen-checkbox': formGenCheckboxVue
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  props: {
    formjson: {},
    errors: {}
  },
  computed: {
    CONTROL_TYPES() {
      return CONTROLS
    },
    ...mapGetters({})
  },
  methods: {
    validateForm() {
      console.log(this.formjson)
    }
  }
}
</script>
