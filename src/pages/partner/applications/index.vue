<template>
  <div class="panel">
    <div class="page-container">
      <jumbotron
        v-if="jumbotronData && jumbotronData.jumbotronTitle"
        :title="`${jumbotronData.jumbotronTitle} (${applications.length})`"
        :desc="jumbotronData.jumbotronBody"
        btnLabel="Create"
        @btnClick="$router.push({ name: 'application-create' })"
      ></jumbotron>
      <!--Search Bar-->
      <div class="search-filter">
        <nitrozen-input
          :showSearchIcon="true"
          class="search-box"
          type="search"
          placeholder="Search by name"
          v-model="searchText"
          @input="setRouteQuery({ search: searchText })"
        ></nitrozen-input>

        <!-- <div class="filter">
          <label class="label">Filter</label>
          <nitrozen-dropdown
            class="filter-dropdown"
            :items="roleFilter"
            v-model="selectedRoleFilter"
            @change="setRouteQuery({ roleFilter: selectedRoleFilter })"
          ></nitrozen-dropdown>
        </div> -->
      </div>

      <!--applications List-->
      <div class="applications-list">
        <list-shimmer
          v-if="pageLoading && !pageError"
          :count="2"
        ></list-shimmer>
        <page-error
          v-else-if="pageError && !pageLoading"
          @retry="fetchApplications"
        ></page-error>
        <!-- new cards -->
        <application-list-item
          v-else
          v-for="app in applications"
          :data="app"
          :key="app._id"
        ></application-list-item>
      </div>
      <page-empty
        v-if="applications.length == 0"
        text="No application found"
      ></page-empty>
      <div v-if="applications.length > 0 && !pageLoading" class="pagination">
        <nitrozen-pagination
          name="Applications"
          v-model="pagination"
          @change="setPagination"
          :pageSizeOptions="[5, 10, 20, 50]"
        ></nitrozen-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { NitrozenInput, NitrozenPagination } from '@gofynd/nitrozen-vue'
import jumbotronVue from '@/components/common/jumbotron.vue'
import applicationlistitem from '@/components/partner/applications/list-item.vue'
import pageEmpty from '@/components/common/page-empty.vue'
import pageError from '@/components/common/page-error.vue'
import listShimmer from '@/components/common/layout/list-shimmer.vue'
import AppService from '@/services/app.service'
import { HelpSection } from '@/pages/partner/quick-help'

import { GET_ORGANIZATION_DETAILS } from '@/store/getters.type'

const PAGINATION = {
  page: 1,
  limit: 10
}
export default {
  components: {
    jumbotron: jumbotronVue,
    'nitrozen-input': NitrozenInput,
    'nitrozen-pagination': NitrozenPagination,
    'application-list-item': applicationlistitem,
    'page-empty': pageEmpty,
    'page-error': pageError,
    'list-shimmer': listShimmer
  },
  data() {
    return {
      pageError: false,
      pageLoading: false,
      searchText: '',
      pagination: { ...PAGINATION },
      applications: []
    }
  },
  computed: {
    ...mapGetters({
      organization: GET_ORGANIZATION_DETAILS
    }),
    jumbotronData() {
      if (HelpSection.length) {
        return HelpSection.find((it) => {
          return it.key === 'applications'
        })
      }
    }
  },
  mounted() {
    this.populateFromURL()
    this.fetchApplications()
  },
  methods: {
    fetchApplications() {
      this.pageLoading = true
      AppService.listApplications(this.organization._id, this.pagination)
        .then(({ data }) => {
          this.applications = data.docs
          this.pagination.total = data.total
          this.pagination.current = data.page
          this.pagination.limit = data.limit
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    populateFromURL() {
      const { page, limit } = this.$route.query
      this.pagination.current = +page || this.pagination.current
      this.pagination.limit = +limit || this.pagination.limit
    },
    setPagination(filter) {
      const { current, limit } = filter
      filter = { page: current, limit }
      this.pagination = Object.assign({}, this.pagination, filter)
      this.setRouteQuery(filter)
    },
    setRouteQuery(query) {
      if (query.search || query.roleFilter) {
        // clear pagination if search or filter applied
        this.pagination = { ...PAGINATION }
        query.page = undefined
        query.limit = undefined
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...query
        }
      })
      this.fetchApplications()
    }
  }
}
</script>

<style lang="less" scoped>
.search-filter {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  align-items: center;
  width: 100%;
  .search-box {
    min-width: 400px;
  }
  .filter-dropdown {
    width: 150px;
  }
  .label {
    font-family: Poppins;
    color: @Mako;
    font-size: 14px;
    line-height: 20px;
    width: 44px;
    margin: auto 0;
    font-weight: 500;
  }

  .filter {
    display: flex;
    flex-direction: row;
    .filter-text {
      color: @Mako;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
    }
    select {
      background-color: @White;
      border: 1px solid @Iron;
      border-radius: 3px;
      height: 40px;
      color: @Mako;
      font-size: 14px;
      padding: 5px 10px;
    }
  }
}

.applications-list {
  width: 100%;
}

.pagination {
  width: 100%;
}
</style>
