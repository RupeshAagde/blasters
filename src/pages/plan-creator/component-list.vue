<template>
  <div class="component-list main-container">
    <div class="page-container">
      <div class="component-list-container">
        <div class="component-filters">
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
              @change="fetchComponents"
            ></nitrozen-dropdown>
          </div>
        </div>
        <shimmer v-if="loading" :count="4"></shimmer>
        <page-error
          v-else-if="pageError && !loading"
          @tryAgain="onSearch"
        ></page-error>
        <div v-if="componentList.length" class="component-card-list">
          <list-card
            v-for="component in componentList"
            :key="component._id"
            :component="component"
            @click="editplan(component._id, $event)"
          ></list-card>
        </div>
        <page-empty v-else :helpText="'No Components found'"></page-empty>
        <nitrozen-pagination
          v-if="componentList.length"
          name="component"
          v-model="filter_data.pagination"
          :pageSizeOptions="perPageValues"
          @change="pageOptionChange"
        ></nitrozen-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component-list-container {
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

  .component-filters {
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
  .component-card-list {
    margin-top: 24px;
  }
}
</style>

<script>
import BillingcomponentService from '@/services/billing.service';
import listCard from '@/components/plan-creator/component-list-card.vue';
import { debounce } from '@/helper/utils';
import { getFilterToQuery } from '@/helper/plan-creator-helper';
import {
  NitrozenInput,
  NitrozenButton,
  NitrozenDropdown,
  NitrozenPagination,
  flatBtn
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import { PageEmpty, PageError, Shimmer } from '../../components/common/';

export default {
  name: 'component-list',
  components: {
    'page-empty': PageEmpty,
    'nitrozen-input': NitrozenInput,
    'nitrozen-dropdown': NitrozenDropdown,
    'nitrozen-pagination': NitrozenPagination,
    'list-card': listCard,
    shimmer: Shimmer,
    'page-error': PageError
  },
  props: {
    initial_count: {
      type: Number,
      default: 0
    },
    component_options: {
      type: Object
    }
  },
  data() {
    return {
      componentList: [],
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
      current_component_id: '-1',
      searchText: '',
      pageError: false
    };
  },
  created() {
    let queryObj = this.$route.query;
    if (queryObj.query) {
      _.merge(this.filter_data.query, JSON.parse(queryObj.query));
    }
    if (this.filter_data.query.name) {
      this.searchText = this.filter_data.query.name.trim();
    }
    if (queryObj.limit) {
      this.filter_data.pagination.limit = queryObj.limit;
    }
    if (queryObj.offset > 0) {
      this.filter_data.pagination.current = parseInt(
        queryObj.offset / queryObj.limit
      );
    }
    this.fetchComponents();
  },
  methods: {
    fetchComponents() {
      let query = getFilterToQuery(this.filter_data);
      if (query) {
        this.$router
          .replace({
            query: query
          })
          .catch((err) => {});
      }
      this.loading = true;
      return BillingcomponentService.getPlanComponents(query, '')
        .then(({ data }) => {
          this.loading = false;
          this.filter_data.pagination.total = data.total;
          this.componentList = data.docs;
        })
        .catch((err) => {
          this.pageError = true;
        });
    },
    onSearch() {
      this.filter_data.query.name = this.searchText;
      this.fetchComponents();
    },
    debounceInput: debounce(function(e) {
      this.onSearch();
    }, 500),
    get_option_values(options) {
      let option_map = [];
      Object.keys(options).forEach((key) => {
        option_map
          .push({
            id: key,
            text: options[key]
          })
          .catch((err) => {});
      });
      return option_map;
    },
    editComponent(id, event) {
      this.$router.replace({
        path: `/component/edit/${id}`
      });
    },
    cloneComponent(id, event) {
      this.$router.replace({
        path: `/component/edit/${id}/`,
        query: { clone: true }
      });
    },
    pageOptionChange(pageOptions) {
      this.fetchComponents();
    },
    getDropdownValues(option_dict) {
      option_dict[' '] = 'All';
      return Object.keys(option_dict).map((key) => {
        return {
          text: option_dict[key],
          value: key
        };
      });
    }
  }
};
</script>
