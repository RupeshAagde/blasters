<template class="main">
  <transition name="modal">
    <nitrozen-dialog ref="dialog" title="JSON" @close="close">
      <template slot="body">
        <div class="meta-container">
          <no-ssr>
            <VJsoneditor
              class="vjson-editor-container"
              v-model="json"
              :options="options"
              :plus="false"
              height="400px"
              @error="onError"
            ></VJsoneditor>
          </no-ssr>
        </div>
      </template>
    </nitrozen-dialog>
  </transition>
</template>

<script>
import uktinlinesvg from '@/components/common/ukt-inline-svg';

const VJsoneditor = () => import('v-jsoneditor');
import _ from 'lodash';
import { NitrozenDialog } from '@gofynd/nitrozen-vue';

export default {
  name: 'adm-custom-json-dialog',
  components: {
    VJsoneditor,
    'nitrozen-dialog': NitrozenDialog
  },
  props: {
    customJson: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      json: {},
      options: {
        mode: 'code',
        enableSort: false,
        enableTransform: false
      }
    };
  },
  methods: {
    populateData() {
      this.json = _.cloneDeep(this.customJson);
    },
    open() {
      this.$refs['dialog'].open({
        width: '700px',
        height: '550px',
        showCloseButton: true,
        dismissible: false,
        neutralButtonLabel: 'Cancel',
        positiveButtonLabel: 'Save'
      });
    },
    close(e) {
      if (e === 'Save') {
        this.$emit('save', this.json);
        return;
      }
      this.$emit('close', e);
    },
    onError() {}
  }
};
</script>

<style lang="less" scoped>
.meta-container {
  .inline {
    display: flex;
    margin-top: 12px;
    .cell-key {
      flex: 1;
    }
    .cell-value {
      margin-left: 12px;
      flex: 2;
    }
    ::v-deep.delete-icon svg {
      width: 24px;
      height: 24px;
      cursor: pointer;
      margin: 21px 0px 0px 12px;
    }
  }
  .add-btn {
    float: right;
    margin-top: 16px;
  }
}
</style>
