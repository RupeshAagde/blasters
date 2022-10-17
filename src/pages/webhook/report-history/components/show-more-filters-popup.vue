<template>
  <nitrozen-dialog
      ref="show-more-filters-popup"
      :title="title"
      class="show-more-filters-popup"
  >
    <template slot="body">
      <div v-for="(item, key) in filtersToShow" :key="key" class="grid">
        <div class="filter-key"><p>{{ key }}:</p></div>
        <div class="filter-value"><p>{{ item | displayValues }}</p></div>
      </div>
    </template>
    <template slot="footer">
      <div></div>
    </template>
  </nitrozen-dialog>
</template>

<script>
import {NitrozenDialog} from "@gofynd/nitrozen-vue";

export default {
  name: "show-more-filters-popup",
  components: {
    'nitrozen-dialog': NitrozenDialog
  },
  props: {
    filtersToShow: {type: Object, required: true},
    title: {type: String, required: true},
  },
  filters: {
    displayValues(value) {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value;
    }
  },
  methods: {
    open() {
      this.$refs['show-more-filters-popup'].open({
        width: '60%',
        showCloseButton: true,
        dismissible: true,
      });
    },
    close() {
      this.$refs['show-more-filters-popup'].close();
    }
  }
}
</script>

<style lang="less" scoped>
.event-type-content {
  border-collapse: separate;
  border-spacing: 0 1em;
}

.filter-key {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #41434C;
}

.filter-value {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #41434C;
  max-height: 10rem;
  overflow-y: auto;
}

.grid {
  display: grid;
  grid-template-columns: 20% 80%;
  gap: 0.5rem;

  .filter-key, .filter-value {
    padding: 0.5rem;
  }
}
</style>