<template>
    <div class="wrapper">
        <collapse
            v-if="showTags"
            @collapse-state="toggleState"
            :selected="!seedData.closed"
            :ref="seedData.name"
        >
            <div slot="collapse-header">
              <h3 class="header-name">{{ seedData.name }}</h3>
              <span
                  v-if="shouldShowClearOption"
                  class="clear"
                  @click.stop="clear(-1)"
              >Clear</span
              >
              <uktInlineSvg
                  :class="['arrow', collapse_state ? 'rotate' : '']"
                  :src="'arrow-collapse'"
              ></uktInlineSvg>
            </div>
          <div slot="collapse-body" class="drop-down">
            <nitrozen-dropdown
                v-model="value"
                :items="getVals"
                :label="seedData.name"
                :multiple="isMultiSelect"
                :placeholder="
                        value && value.length > 0
                            ? formatPlaceholder(seedData.name)
                            : 'Select '+seedData.name
                    "
                :searchable="isMultiSelect"
                class="width"
                @searchInputChange="searchFilter($event)"
            ></nitrozen-dropdown>
          </div>
        </collapse>
        <nitrozen-dropdown
            v-else
            v-model="value"
            :items="getVals"
            :label="seedData.name"
            :placeholder="
                value && value.length > 0
                    ? formatPlaceholder(seedData.name)
                    : seedData.name
            "
            :multiple="isMultiSelect"
            :searchable="isMultiSelect"
            @searchInputChange="searchFilter($event)"
            class="width"
        ></nitrozen-dropdown>
        <applied-filter
            class="dropdown-tags"
            v-if="shouldShowTags"
            :tags="value ? value : []"
            :showClearAll="false"
            :TAGS_THRESHOLD="3"
            @remove-filter="clear"
            :limit-chars="true"
        >
        </applied-filter>
    </div>
</template>

<script>
import {NitrozenDropdown} from '@gofynd/nitrozen-vue';
import collapse from '@/components/common/collapse.vue';
import uktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import {ADMIN_CLEAR_FILTERS,} from '@/store/action.type';
import {filterComponentSharedProps, filterMixin, filtersSharedValueMixins,} from '../../mixins/filter.mixin';
import {ANALYTICS_FILTER_TYPES} from '../../constants/constants';
import AppliedFilter from '@/components/common/tags/applied-filter.vue';
import {loadingMixins} from "../../../generic-graphs/graphs/mixins/loading.mixins";
import {ADMIN_LOAD_FILTER_DROPDOWN_VALUES} from "../../../../store/action.type";

export default {
  name: 'filter-dropdown-component',
  components: {NitrozenDropdown, AppliedFilter, collapse, uktInlineSvg},
  mixins: [filterMixin, filterComponentSharedProps, filtersSharedValueMixins, loadingMixins],
  data: () => ({val: '', collapse_state: null, getVals: []}),
  beforeMount() {
    this.collapse_state = !this.seedData.closed;
  },
  methods: {
    clearSearchSlugs() {
      if (this.collapse_state) {
        let dropdown = this.$refs[this.seedData.name].$children[1];  //Accessing the second child of collapse
        dropdown.searchInput = '';  //Clearing the search input text
        this.getVals = this.getValues; //Resetting the options list to Default
      }
    },
    toggleState(state) {
      this.collapse_state = state;
    },
    clear(index) {
      const payload = {
        page: this.pageName,
        filterNames: [this.seedData.id],
        makeChangesLive: false,
      };
      if (index > -1) {
        payload.indices = [index];
      }
      this.$store.dispatch(ADMIN_CLEAR_FILTERS, payload);
    },
    searchFilter(event) {
      this.getVals = this.getValues.filter((item) => {
        return item.text
            .toLowerCase()
            .includes(event.text.toLowerCase());
      });
    },
    formatPlaceholder(name) {
      return `${this.value.length} ${name}(s) selected`;
    },
    loadingCondition() {
      return !this.seedData.values;
    },
    setPageName() {
      this._pageName = this.pageName;
    },
    loadData() {
      this.$store.dispatch(ADMIN_LOAD_FILTER_DROPDOWN_VALUES, {
        url: this.seedData.dataSource,
        pageName: this.pageName,
        chartId: this.chartId,
        panelIndex: 1,
        cardIndex: 0,
        filterIndex: 1
      });
    }
  },
  computed: {
    getValues() {
      return this.seedData.values ? this.seedData.values.map((x) => ({
        text: x,
        value: x,
      })) : [];
    },
    isMultiSelect() {
      return (
          this.seedData.filterType ===
          ANALYTICS_FILTER_TYPES.MULTI_SELECT_DROPDOWN
      );
    },
    shouldShowTags() {
      return this.showTags && typeof this.value !== 'string';
    },
    shouldShowClearOption() {
      if (!this.value || !this.seedData) {
        return false;
      }
      return this.value.length > 0 && this.seedData.hasClearOption
    }
  },
    mounted() {
        if (this.seedData.defaultValue) {
            this.value = this.seedData.defaultValue;
        }
        this.getVals = this.getValues;
    },
};
</script>

<style lang="less" scoped>
@import '../../../../less/common';
.width {
    min-width: 9rem;
}
@media only screen and (min-width: 481px) and (max-width: 768px) {
  .width{
    min-width: 13rem;
  }
}

::v-deep .nitrozen-dropdown-label {
    display: none;
}

::v-deep .nitrozen-dropdown-container .nitrozen-select__trigger {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 23px;
    /* identical to box height, or 192% */

    /* Text Color */

    color: #41434c;

    opacity: 0.8;
}

::v-deep .nitrozen-select__trigger span {
    .limit-chars();
    max-width: 100%;
}

::v-deep .nitrozen-searchable-input-container input::placeholder {
    color: #41434c;
}
.arrow {
    transition: all 300ms ease-in-out;
    transform: rotate(180deg);
}

.rotate {
    transform: rotate(0deg);
    transition: all 300ms ease-in-out;
}

.dropdown-tags {
    margin-bottom: 26px;
}
.header-name {
  margin-right: auto;
}

.clear {
  color: #2e31be;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  margin-right: 8px;
}

.drop-down {
  ::v-deep .nitrozen-option-image {
    .limit-chars();
    max-width: 90%;
    display: block !important;
  }
}
</style>
