<template>
  <div id="dialogBox" :class="[visible ? 'dialogBox' : 'alertBox']">
    <img v-show="visible" class="icon" src="/public/assets/sales-dump-loader.gif">
    <div class="icon" v-show="!visible"><span>!</span></div>
    <div class="text" :id="[visible ? 'text' : 'alertText']">
      {{ bodyText }}
    </div>
    <div class="cancel" :id="[visible ? 'cancel' : 'retry']">
      <a
          @click="$emit(buttonText, buttonText)"
      >{{ buttonText }}</a
      >
    </div>
  </div>
</template>

<script>
import {CANCEL_TEXT, EXPORT_SALESDUMP_TEXT, FAILED_SALESDUMP_TEXT, RETRY_TEXT} from "./exportDialog-constant"

export default {
  name: "exportDialog",
  props: {
    visible: {type: Boolean, required: true, default: true}
  },
  data() {
    return {
      exportText: EXPORT_SALESDUMP_TEXT,
      failedText: FAILED_SALESDUMP_TEXT,
      cancelText: CANCEL_TEXT,
      retryText: RETRY_TEXT
    };
  },
  computed: {
    buttonText() {
      return this.visible ? this.cancelText : this.retryText
    },
    bodyText() {
      return this.visible
          ? this.exportText
          : this.failedText
    }
  }
}
</script>

<style scoped>
.icon {
  height: 24px;
  width: 24px;
  margin: 12px;
  background-color: #eb5757;
  border-radius: 50%;
  text-align: center;
  color: #ffffff;
  font-size: 10px;
}
span {
  text-align: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 10px;
  position: relative;
  width: 1.75px;
  height: 7px;
  left: 0px;
  top: 7px;
}

#dialogBox {
  height: 48px;
  width: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-family: "Inter";
  font-style: normal;
  font-size: 12px;
  margin-top: 24px;
  margin-bottom:12px;
}
.dialogBox {
  background: #f5f8ff;
  border: 1px solid #2e31be;
}
.alertBox {
  background: #ffe7e7;
  border: 1px#FFE7E7;
}

.text {
  flex-grow: 1;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}

.cancel {
  font-weight: 700;
  line-height: 22px;
  text-align: right;
  padding-right: 26px;
}
#cancel {
  color: #2e31be;
}

#alertText {
  padding-left: 0px;
}
#retry {
  color: #eb5757;
}
a:link,a:visited,a:hover,a:active  {
  text-decoration: none;
  cursor: pointer;
}
</style>
