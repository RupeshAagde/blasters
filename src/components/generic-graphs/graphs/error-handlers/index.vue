<template>
  <div class="error-handler-wrapper">
    <adm-no-content v-if="errorCode === ERROR_CODES.NO_CONTENT"
                    class="max-height"
                    :class="{'show-try-again': showTryAgain}"
                    :helper-text="errorText" @tryAgain="tryAgain"></adm-no-content>
    <adm-page-error v-else-if="errorCode === ERROR_CODES.SERVER_ERROR" :error-text="errorText" class="max-height"
                    @tryAgain="tryAgain"></adm-page-error>
    <div v-else></div>
  </div>
</template>

<script>
import AdmNoContent from "@/components/common/adm-no-content";
import AdmPageError from "@/components/common/page-error";
import {ERROR_MESSAGES, HTTP_STATUS_CODES} from "../../data/constants";

export default {
  name: "error-handlers",
  components: {
    AdmNoContent,
    AdmPageError
  },
  data: () => ({
    ERROR_CODES: HTTP_STATUS_CODES
  }),
  props: {
    error: {type: String, default: null},
    graphType: {type: String},
    errorCode: {type: Number, required: true},
    showTryAgain: {type: Boolean, default: false}
  },
  computed: {
    errorText() {
      if (this.error) {
        return this.error;
      }
      return ERROR_MESSAGES[this.errorCode];
    }
  },
  methods: {
    tryAgain() {
      location.reload();
    }
  },
  mounted() {
    // console.log('graph type: ', this.graphType, this.errorCode);
  }
}
</script>

<style scoped lang="less">
.error-handler-wrapper {
  display: flex;
  place-items: center;
  padding: 1rem;
}

.show-try-again {
  ::v-deep .page-error button[type='button'] {
    //max-height: 20 rem;
    display: none;
  }
}


.max-height {
  height: 100%;
  width: 100%;
  margin-inline: 0;
  padding: 0;

  ::v-deep img {
    display: block;
    aspect-ratio: 3;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}
</style>