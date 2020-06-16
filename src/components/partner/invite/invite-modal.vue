<template>
  <transition name="modal">
    <div class="modal">
      <div class="modal-container" v-click-outside="close">
        <div @click="close" class="close-cross">
          <inline-svg src="cross-black"></inline-svg>
        </div>
        <div>
          <label class="dark-xs cl-DustyGray2">Message</label>
          <textarea
            type="text"
            class="common-input input-text"
            v-model="message"
          />
        </div>
        <div class="button-container">
          <button @click="invite" class="invite cl-White dark-xs">
            Invite
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import inlinesvg from '@/components/common/inline-svg.vue'

export default {
  name: 'invite-modal',
  props: {
    config: Object
  },
  components: {
    'inline-svg': inlinesvg
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    close: function(event) {
      this.$emit('close')
      event.stopPropagation()
    },
    invite() {
      this.$emit('invite', this.message)
    }
  }
}
</script>

<style lang="less" scoped>
.modal {
  height: 100%;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: @dialog;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(82, 78, 78, 0.52);
  transition: opacity 0.25s ease;
  right: 0px;
  .flex-center();
  .close-cross {
    display: flex;
    cursor: pointer;
    justify-content: flex-end;
  }
  .modal-container {
    padding: 10px 25px 30px;
    min-width: 60%;

    background-color: @Alabaster;
    border: 2px solid @Gray;
  }
  label {
    margin-bottom: 5px;
    display: inline-block;
  }
  .input-text {
    padding: 8px 0px 5px 10px;
    border: 1px solid @Iron;
    border-radius: @BorderRadius;
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    .invite {
      background-color: @Mako;
      border: 1px solid @Mako;
      padding: 7px 25px;
      border: none;
      border-radius: @BorderRadius;
      cursor: pointer;
      margin-top: 10px;
    }
  }
}
</style>
