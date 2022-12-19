<template>
  <div>
    <p :class="{'hidden':!hasOtherRidersInfo(row, column.type)}"
       class="view-more-text cp"
       @click="toggleRow(row.id)">
      View {{ !rowMap[row.id] ? 'More' : 'Less' }}
    </p>
  </div>
</template>

<script>
import {TABLE_COLUMN_TYPES} from "../../data/constants";

export default {
  name: "other-riders",
  data: () => ({TABLE_COLUMN_TYPES: TABLE_COLUMN_TYPES}),
  props: {
    column: {type: Object, required: true},
    row: {type: Object, required: true},
    rowMap: {type: Object, required: true},
  },
  methods: {
    hasOtherRidersInfo(row, columnType) {
      return columnType === TABLE_COLUMN_TYPES.COLLAPSE && (row.collapseModel && row.collapseModel.fields.some(f => f.name === 'Other Rider Details'));
    },
    toggleRow(id) {
      this.$emit('toggleRow', id);
    }
  }
}
</script>

<style lang="less" scoped>
.hidden {
  display: none;
}

.cp {
  cursor: pointer;
}

.view-more-text {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 130%;
  /* identical to box height, or 16px */


  /* Brand Color/Accent or Primary */

  color: #2E31BE;
}
</style>