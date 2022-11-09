<template>
    <div
        v-if="tags.length > 0 || Object.keys(tags).length > 0"
        :class="{'dont-wrap': !shouldWrap}" class="applied-filters-wrapper"
        ref="tagsWrapper"
    >
      <div
          v-for="(t, i) in tagsToDisplay"
          :key="i"
          class="applied-filters-container"
      >
        <span v-if="!isArray" class="tag-key">{{ t.name }} </span>
        <i v-if="!isArray" class="separator">:</i>
        <span :class="{ 'limit-chars max-width': limitChars }">{{
            tagContent(
                isArray ? t : t.values,
                moreThanThreshold(isArray ? t : t.values)
            )
          }}</span>
        <i v-if="!isArray && moreThanThreshold(t.values)" class="remaining"
        >...+{{ t.values.length - tagsLimit }}</i
        >
        <div
            v-if="isArray || !t.default"
                class="remove-icon-wrapper"
                @click="removeFilter(i)"
            >
                <uktinlinesvg :src="'remove-icon'"></uktinlinesvg>
            </div>
        </div>
        <div
            v-if="moreThanThreshold(tags)"
            class="applied-filters-container tag-remain-number"
        >
          +{{ remainingTags }}
        </div>
        <clear-filters
            v-if="showClearAll"
            class="clear-all"
            @clear-all="$emit('clear-all')"
        ></clear-filters>
    </div>
</template>
<script>
import Uktinlinesvg from '../../../common/ukt-inline-svg';
import ClearFilters from '../../../../pages/admin/reports/report-filters/clear-filters';

export default {
    name: 'applied-filters',
    components: {
        ClearFilters,
        Uktinlinesvg,
    },
    data() {
        return {
            isArray: true,
            tagsLimit: null,
            notMutated: true,
        };
    },
    props: {
        tags: {
            type: [Array, Object],
            default() {
                return [];
            },
            required: true,
        },
        showClearAll: {
            type: Boolean,
            default: false,
        },
        TAGS_THRESHOLD: {
            type: Number,
            default: 3,
        },
        limitChars: {
            type: Boolean,
            default: false,
        },
      shouldWrap: {type: Boolean, default: false}
    },
    mounted() {
        this.tagsLimit = this.TAGS_THRESHOLD;
        if (!Array.isArray(this.tags)) {
            this.isArray = false;
        }
    },
    updated() {
      if (this.tags.length > 0 && this.notMutated && this.checkScroll) {
        this.tagsLimit = this.tags.length - 1;
        this.notMutated = false;
      }

      //Reset when tags are deselected
      if (this.tags.length < this.tagsLimit) {
        this.notMutated = true;
        this.tagsLimit = this.TAGS_THRESHOLD;
      }
    },
    methods: {
        removeFilter(removeIndex) {
            this.$emit('remove-filter', removeIndex);
        },
        tagContent(item, shouldSlice = false) {
            if (Array.isArray(item)) {
                if (shouldSlice) {
                    item = item.slice(0, this.tagsLimit);
                }
                return item + '';
            } else return item;
        },
        checkArray(item) {
            return Array.isArray(item);
        },
        moreThanThreshold(val) {
            if (typeof val === 'string' || val instanceof String) {
                return false;
            } else {
                return val.length > this.tagsLimit ? true : false;
            }
        },
    },
    computed: {
      tagsToDisplay: function () {
        return Array.isArray(this.tags)
            ? this.tags.slice(0, this.tagsLimit)
            : this.tags;
      },
      remainingTags: function () {
        if (this.tags.length < this.tagsLimit) return 0;
        else return this.tags.length - this.tagsLimit;
      },
      checkScroll() {
        // const wrapper = this.$refs['tagsWrapper'];
        return (
            this.$refs['tagsWrapper'].scrollWidth >
            this.$refs['tagsWrapper'].clientWidth
        );
      },
    },
};
</script>

<style scoped lang="less">
.max-width {
  max-width: 10rem;
}

.dont-wrap {
  flex-wrap: nowrap !important;
}

.applied-filters-wrapper {
  display: flex;
  justify-content: flex-start;
  gap: 0.6rem;
  flex-wrap: wrap;
  width: 100%;
  overflow: scroll;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .clear-all {
    justify-self: flex-end;
    align-self: flex-start;
  }

  .applied-filters-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    color: #41434c;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    padding: 0.7em;
    white-space: nowrap;

    .tag-key,
    .separator {
      color: #828282;
    }

    .separator {
      margin: 0 -5px;
    }

    .remaining {
      color: #2e31be;
      margin-left: -7px;
    }

    .remove-icon-wrapper {
      padding-top: 0.09rem;
      display: grid;
      place-items: center;
    }
  }

    .tag-remain-number {
        border-color: #2e31be;
        color: #2e31be;
        box-shadow: -28px 0 22px 8px #fff;
        position: absolute;
        right: 24px;
    }
    span {
        cursor: pointer;
    }
}
</style>
