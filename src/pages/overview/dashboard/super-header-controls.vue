<template>
  <div
      class="super-header-wrapper">
    <div class="refresh-wrapper" @click="$emit('refresh')" v-if="card.showRefreshButton">
      <adm-inline-svg src="refresh"></adm-inline-svg>
    </div>
    <div class="close-btn-wrapper" @click="$emit('close')" v-if="card.isClosable">
      <inline-svg src="remove-icon"></inline-svg>
    </div>
  </div>
</template>

<script>
import UktInlineSvg from "../../../../components/common/ukt-inline-svg";
import AdminInlineSvg from "../../../../components/admin/common/adm-inline-svg";

export default {
  name: "super-header-controls",
  components: {
    "inline-svg": UktInlineSvg,
    "adm-inline-svg": AdminInlineSvg,
  },
  props: {
    card: {type: Object, required: true}
  },
}
</script>

<style scoped lang="less">

.super-header-wrapper {
  position: absolute;
  top: -0.5rem;
  right: -0.3rem;
  cursor: pointer;
  display: flex;
  gap: 0.6rem;
}

.super-header-wrapper .refresh-wrapper {
  opacity: 0.2;
  height: 16px;
  width: 16px;
  margin-top: -0.5rem;
}

::v-deep .refresh-wrapper svg > path {
  stroke: #dadada;
}
</style>