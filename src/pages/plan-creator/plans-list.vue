<template>
  <div class="plans-list main-container">
    <div class="page-container">
      <div class="plans-list-container">
        <div class="plans-filters">
          <nitrozen-input
            :showSearchIcon="true"
            :placeholder="'Search Name'"
            @input="debounceInput"
            v-model="searchText"
            class="search"
          />
          <div class="dropdown-filters">
            <nitrozen-dropdown
              class="archived-filter"
              :label="'Status'"
              v-model="filter_data.query['is_active']"
              :items="getDropdownValues({ true: 'Active', false: 'Inactive' })"
              @change="fetchPlans"
            ></nitrozen-dropdown>
          </div>
        </div>
        <shimmer v-if="loading" :count="4"></shimmer>
        <page-error
          v-else-if="pageError && !loading"
          @tryAgain="onSearch"
        ></page-error>
        <div v-if="plansList.length" class="plans-card-list">
          <list-card
            v-for="plan in plansList"
            :key="plan._id"
            :plan="plan"
            @click="editplan(plan._id, $event)"
          ></list-card>
        </div>
        <page-empty v-else :helpText="'No Plans found'"></page-empty>
        <nitrozen-pagination
          v-if="plansList.length"
          name="plans"
          v-model="filter_data.pagination"
          :pageSizeOptions="perPageValues"
          @change="pageOptionChange"
        ></nitrozen-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// @import '../../less/form.less';
// @import '../../less/page-ui.less';
// @import '../../../../less/theme.less';

.plans-list-container {
  width: 100%;
  word-break: break-all;
  position: relative;
  .search {
    width: 400px;
    height: 40px;
    margin-top: 24px;
  }
  .jumbotron-container {
    margin-bottom: 24px;
  }
  .loading {
    position: absolute;
  }

  .plans-filters {
    display: flex;
    .dropdown-filters {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      > div {
        padding-left: 10px;
      }
      .type-filter {
        width: 100px;
      }
      .applicable-on-filter {
        width: 200px;
      }
      .archived-filter {
        width: 100px;
      }
    }
  }

  .nitrozen-pagination-container,
  .plans-card-list {
    margin-top: 24px;
  }
}
</style>

<script>
import BillingPlansService from '@/services/billing-plans.service'
import listCard from '@/components/plan-creator/plan-list-card.vue'
import { debounce } from '@/helper/utils'
import { getFilterToQuery } from '@/helper/plans-helper'
import {
  NitrozenInput,
  NitrozenButton,
  NitrozenDropdown,
  NitrozenPagination,
  flatBtn
} from '@gofynd/nitrozen-vue'
import _ from 'lodash'
import { PageEmpty, PageError, Shimmer } from '../../components/common/'

export default {
  name: 'plans-list',
  components: {
    // 'ukt-inline-svg': uktInlineSvg,
    // 'adm-inline-svg': admInlineSvg,
    'page-empty': PageEmpty,
    'nitrozen-input': NitrozenInput,
    'nitrozen-dropdown': NitrozenDropdown,
    'nitrozen-pagination': NitrozenPagination,
    'list-card': listCard,
    shimmer: Shimmer,
    'page-error': PageError
  },
  props: {
    plans_list: {
      type: Array,
      default: function() {
        return []
      }
    },
    initial_count: {
      type: Number,
      default: 0
    },
    plans_options: {
      type: Object
    }
  },
  data() {
    return {
      plansList: [],
      loading: false,
      show_schedule_modal: false,
      showSelectModal: false,
      filter_data: {
        query: {
          name: ' ',
          is_active: ' '
        },
        pagination: {
          limit: 10,
          current: 1,
          total: this.initial_count
        }
      },
      perPageValues: [10, 25, 50, 100, 200],
      current_schedule: {},
      current_plan_id: '-1',
      searchText: '',
      pageError: false
    }
  },
  created() {
    this.plansList = [...this.plans_list]
    let queryObj = this.$route.query
    if (queryObj.query) {
      _.merge(this.filter_data.query, JSON.parse(queryObj.query))
    }
    if (queryObj.limit) {
      this.filter_data.pagination.limit = queryObj.limit
    }
    if (queryObj.offset > 0) {
      this.filter_data.pagination.current = parseInt(
        queryObj.offset / queryObj.limit
      )
    }
    this.fetchPlans()
  },
  methods: {
    fetchPlans() {
      let query = getFilterToQuery(this.filter_data)
      if (query) {
        this.$router
          .replace({
            query: query
          })
          .catch((err) => {})
      }
      this.loading = true
      return BillingPlansService.getPlans(query, '')
        .then(({ data }) => {
          this.loading = false
          this.filter_data.pagination.total = data.total
          this.plansList = data.docs
        })
        .catch((err) => {
          this.pageError = true
        })
    },
    onSearch() {
      this.filter_data.query.name = this.searchText
      this.fetchPlans()
    },
    debounceInput: debounce(function(e) {
      this.onSearch()
    }, 500),
    get_option_values(options) {
      let option_map = []
      Object.keys(options).forEach((key) => {
        option_map
          .push({
            id: key,
            text: options[key]
          })
          .catch((err) => {})
      })
      return option_map
    },
    editplan(id, event) {
      this.$router.replace({
        path: `/plans/edit/${id}`
      })
    },
    clonePlan(id, event) {
      this.$router.replace({
        path: `/plans/edit/${id}/`,
        query: { clone: true }
      })
    },
    // unPublishPlans(id, event, archive) {
    //     this.loading = true;
    //     let payload = { archive: archive };
    //     let archive_op = archive ? 'archived' : 'unarchived';
    //     CouponPageService.archiveCoupon(payload, id)
    //         .then(res => {
    //             // force update current table with same query string
    //             this.query_string = '';
    //             this.loading = false;
    //             this.$snackbar.global.showSuccess(res.data.message);
    //         })
    //         .catch(err => {
    //             this.loading = false;
    //             this.$snackbar.global.showError(
    //                 `Coupon could not be ${archive_op}. Try again later${
    //                     err && err.message ? ' : ' + err.message : ''
    //                 }`
    //             );
    //         });
    // },
    pageOptionChange(pageOptions) {
      this.fetchPlans()
    },
    getDropdownValues(option_dict) {
      option_dict[' '] = 'All'
      return Object.keys(option_dict).map((key) => {
        return {
          text: option_dict[key],
          value: key
        }
      })
    }
  }
}
</script>
