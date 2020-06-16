<template>
  <div>
    <div
      class="main-div"
      :class="{ 'disable-div': currentRole != 'custom' }"
      v-for="(item, index) in permissionData.permissions"
      :key="index"
    >
      <nitrozen-checkbox
        :checkboxValue="item.key"
        v-model="checkedPermissions"
        :disabled="currentRole != 'custom'"
        @change="selectPermission(item.key)"
      >
        <div class="access">
          <span class="title">{{ item.title }}</span>
          <span class="desc">{{ item.description }}</span>
        </div>
      </nitrozen-checkbox>
    </div>
  </div>
</template>

<style lang="less" scoped>
.disable-div {
  background: #f3f3f3;
}
.main-div {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  border: 1px solid @Iron;
  border-radius: 4px;
  margin-top: 12px;
  width: 100%;
  ::v-deep .nitrozen-container {
    padding: 16px;
    padding-left: 30px;
    margin-bottom: 0;
  }
  ::v-deep .nitrozen-checkbox {
    top: 14px;
    left: 14px;
  }
  .access {
    color: @Mako;
    font-size: 16px;
    font-weight: bold;
    line-height: 25px;
    display: flex;
    flex-direction: column;
    padding: 14px;
    .desc {
      margin-top: 5px;
      font-size: 14px;
      line-height: 19px;
      font-weight: 400;
    }
    .title {
      margin-top: -5px;
    }
  }
}
</style>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue'
export default {
  name: 'permissions',
  components: {
    'nitrozen-checkbox': NitrozenCheckBox
  },
  data() {
    return {
      checkedPermissions: this.currentPermissions
    }
  },
  props: {
    permissionData: {
      type: Object,
      required: true
    },
    permissionChecked: {
      type: Boolean,
      default: false
    },
    currentRole: {
      type: String
    },
    currentPermissions: {
      type: Array
    }
  },

  watch: {
    currentRole() {
      this.setPermissionData()
    }
  },
  methods: {
    selectPermission(key) {
      this.$emit('permission-data', this.checkedPermissions)
    },
    setPermissionData() {
      if (this.currentRole != 'custom') {
        let data = this.permissionData.roles.filter((ele) => {
          return ele.key == this.currentRole
        })

        this.checkedPermissions = data[0].permissions
      } else {
        this.checkedPermissions = []
      }
      this.$emit('permission-data', this.checkedPermissions)
    }
  }
}
</script>
