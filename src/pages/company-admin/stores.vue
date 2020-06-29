<template>
  <div class="stores">
    <div class="stores-header">
      <label class="bold-xs cl-Mako"
        >Selling Locations ({{ paginationConfig.total }})</label
      >
    </div>
    <div class="search-store">
      <nitrozen-input
        placeholder="Search Stores"
        @input="searchStores"
        v-model="searchText"
        :showSearchIcon="true"
        type="search"
      ></nitrozen-input>
    </div>
    <div v-if="inProgress" class="shimmer"></div>

    <div
      class="stores-body"
      v-if="!inProgress && storesData && storesData.length"
    >
      <div
        @click="editStore(item)"
        class="stores-div"
        v-for="(item, index) in storesData"
        :key="index"
        :title="item.name"
      >
        <div class="store-header">
          <div class="store-name">{{ item.name }}</div>
          <nitrozen-badge
            :state="item.stage == 'verified' ? 'success' : 'warn'"
          >
            {{ item.stage == 'verified' ? 'verified' : 'unverified' }}
          </nitrozen-badge>
        </div>
        <div class="store-address">{{ item.address.address1 }}</div>
        <div class="store-address-detail">
          <div class="store-city" v-if="item.address.city">
            <label class="n-input-label">City</label>
            <div class="store-address-name">{{ item.address.city }}</div>
          </div>
          <div class="store-pincode" v-if="item.address.pincode">
            <label class="n-input-label">Pincode</label>
            <div class="store-address-name">{{ item.address.pincode }}</div>
          </div>
          <div class="store-state" v-if="item.address.state">
            <label class="n-input-label">State</label>
            <div class="store-address-name">{{ item.address.state }}</div>
          </div>
          <div class="store-country" v-if="item.address.country">
            <label class="n-input-label">Country</label>
            <div class="store-address-name">{{ item.address.country }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="pagination-div"
      v-if="paginationConfig.limit < paginationConfig.total"
    >
      <nitrozen-pagination
        name="Stores"
        v-model="paginationConfig"
        @change="paginationChange"
        :pageSizeOptions="[5, 10, 20, 50]"
      ></nitrozen-pagination>
    </div>
    <page-error v-if="pageError" @tryAgain="getStores"></page-error>
    <adm-no-content
      v-if="!pageError && !inProgress && !storesData.length"
      :helperText="'No Stores Found'"
    ></adm-no-content>
  </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
  .search-box {
    margin: 24px 0px 24px;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    .search {
      min-width: 400px;
    }

    .filter {
      display: flex;
      width: 250px;
      .filter-dropdown {
        margin-right: 24px;
      }
    }
    .label {
      font-family: Poppins;
      color: @Mako;
      font-size: 14px;
      line-height: 20px;
      margin: 12px;
      font-weight: 500;
    }
  }
}
.icon-placeholder {
  height: 60px;
  width: 60px;
  background-color: #d8d8d8;
  border-radius: 50%;
}
.input-shimmer {
  height: 40px;
  width: 400px;
}
.card-avatar {
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
::v-deep .nitrozen-dropdown-label {
  display: none;
}

.stores {
  .stores-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    .bold-xs {
      font-size: 18px;
    }
  }
  .search-store {
    width: 400px;
    margin-bottom: 24px;
  }
  .stores-body {
    .stores-div {
      box-sizing: border-box;
      border: 1px solid @Iron;
      border-radius: 4px;
      background-color: @White;
      padding: 24px;
      margin-bottom: 24px;
      cursor: pointer;
      .store-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .store-name {
          color: @Mako;
          font-size: 14px;
        }
      }
      .store-address {
        color: @Mako;
        font-size: 14px;
        margin-top: 12px;
        line-height: 20px;
      }
      .store-address-detail {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        .store-address-name {
          color: @Mako;
          font-size: 14px;
          margin-top: 12px;
        }
      }
    }
  }
  .pagination-div {
    margin-bottom: 24px;
  }
}
.shimmer {
  display: block;
  width: 100%;
  height: 120px;
  margin-bottom: 24px;
}
</style>

<script>
import CompanyService from '@/services/company-admin.service';
import loader from '@/components/common/adm-loader';
import dateFormat from 'dateformat';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import { getRoute } from '@/helper/get-route';

import {
  NitrozenButton,
  NitrozenPagination,
  NitrozenDropdown,
  NitrozenBadge,
  NitrozenInput,
  flatBtn,
  strokeBtn
} from '@gofynd/nitrozen-vue';

export default {
  name: 'adm-company-stores',
  components: {
    'adm-shimmer': admshimmer,
    'adm-no-content': admnocontent,
    'page-error': pageerror,
    loader,
    'nitrozen-button': NitrozenButton,
    'nitrozen-pagination': NitrozenPagination,
    'nitrozen-dropdown': NitrozenDropdown,
    'nitrozen-badge': NitrozenBadge,
    'nitrozen-input': NitrozenInput
  },
  directives: {
    flatBtn,
    strokeBtn
  },
  data() {
    return {
      inProgress: false,
      pageError: false,
      pageLoading: false,
      isInitialLoad: true,
      paginationConfig: {
        current: 1,
        total: 0,
        limit: 10
      },
      selectedChoice: '',
      selectedStoreType: '',
      searchText: '',
      storesData: [],
      choiceType: [],
      storeType: [],
      companyId: this.$route.params.companyId
    };
  },
  filters: {
    dateFormatter: function(value) {
      if (!value) return '';
      return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
    }
  },
  mounted() {
    this.getStores();
    this.getChoiceType({ choice_type: 'stage' });
    this.getChoiceType({ choice_type: 'store_type' });
  },
  methods: {
    getParams: function() {
      const params = {
        page_size: this.$route.query.limit || this.paginationConfig.limit,
        page_no: this.$route.query.current || this.paginationConfig.current,
        name: this.searchText
      };
      if (this.$route.query.stage) {
        this.selectedChoice = this.$route.query.stage;
        params.stage = this.selectedChoice;
      }

      if (this.$route.query.store) {
        this.selectedStoreType = this.$route.query.store;
        params.store = this.selectedStoreType;
      }

      if (this.$route.query.search) {
        this.$route.query.search = this.searchText;
        params.name = this.searchText;
      }
      return params;
    },
    getStores() {
      this.inProgress = true;
      this.pageError = false;
      let params = this.getParams();
      params.company = this.companyId;
      CompanyService.fetchStores(params)
        .then((res) => {
          this.inProgress = false;
          this.pageError = false;
          this.storesData = res.data.data;
          this.paginationConfig.total = res.data.total_count;
        })
        .catch((err) => {
          this.pageLoading = false;
          this.pageError = true;
          this.inProgress = false;
          console.log(err, 'error');
        })
        .finally(() => {
          this.isInitialLoad && (this.isInitialLoad = false);
        });
    },
    getChoiceType(params = {}) {
      CompanyService.fetchChoiceType(params)
        .then((res) => {
          if (params.choice_type == 'stage') {
            this.choiceType = res.data.data;
            this.choiceType.map((ele) => {
              ele.text = ele.value;
              ele.value = ele.key;
            });
          } else if (params.choice_type == 'store_type') {
            this.storeType = res.data.data;
            this.storeType.map((ele) => {
              ele.text = ele.value;
              ele.value = ele.key;
            });
          }
        })
        .catch((err) => {
          console.log(err, 'error');
        });
    },
    searchStores: function() {
      let vm = this;
      let params = {
        page_no: 1,
        page_size: this.paginationConfig.limit,
        name: this.searchText
      };
      _.debounce(function() {
        vm.getStores(params);
      }, 1000)();
    },
    changeStage: function() {
      let params = {
        page_no: 1,
        page_size: this.paginationConfig.limit,
        name: this.searchText,
        stage: this.selectedChoice
      };
      this.getStores(params);
    },
    paginationChange(e) {
      this.paginationConfig = e;
      this.setPage(this.paginationConfig);
    },
    setPage(filter) {
      const { current, limit } = filter;
      this.paginationConfig = {
        ...this.paginationConfig,
        current,
        limit
      };
      this.getStores();
      // this.setRouteQuery({ current, limit });
    },
    setRouteQuery(query) {
      if (query.search || query.stage) {
        // clear pagination if search or filter applied
        this.paginationConfig.current = 1;
        this.paginationConfig.limit = 100;
        query.current = 1;
        query.limit = 100;
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...query
        }
      });
      this.getStores();
    }
  }
};
</script>
