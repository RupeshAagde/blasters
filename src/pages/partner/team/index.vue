<template>
  <div class="panel">
    <div class="page-container">
      <jumbotron
        v-if="jumbotronData && jumbotronData.jumbotronTitle"
        :title="`${jumbotronData.jumbotronTitle} (${staffList.length})`"
        :desc="jumbotronData.jumbotronBody"
        btnLabel="Invite"
        @btnClick="invite"
      ></jumbotron>
      <!--Search Baar-->
      <div class="search-filter">
        <nitrozen-input
          :showSearchIcon="true"
          class="search-box"
          type="search"
          placeholder="Search by name, mobile or email"
          v-model="searchText"
          @input="setRouteQuery({ search: searchText })"
        ></nitrozen-input>

        <div class="filter">
          <label class="label">Filter</label>
          <nitrozen-dropdown
            class="filter-dropdown"
            :items="roleFilter"
            v-model="selectedRoleFilter"
            @change="setRouteQuery({ roleFilter: selectedRoleFilter })"
          ></nitrozen-dropdown>
        </div>
      </div>

      <!--Staff List-->
      <div class="staff-list">
        <list-shimmer
          v-if="pageLoading && !pageError"
          :count="4"
        ></list-shimmer>
        <page-error
          v-else-if="pageError && !pageLoading"
          @retry="fetchTeamMembers"
        ></page-error>
        <!-- new cards -->
        <staff-member
          v-for="staff in getStaffList"
          :staff="staff"
          :key="staff._id"
        ></staff-member>
      </div>
      <page-empty
        v-if="getStaffList.length == 0"
        text="No team member found"
      ></page-empty>
      <div v-if="getStaffList.length" class="pagination">
        <nitrozen-pagination
          name="Staff"
          v-model="paginationConfig"
          @change="paginationChange"
          :pageSizeOptions="[5, 10, 20, 50]"
        ></nitrozen-pagination>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .page-container {
    width: 100%;
  }
}
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
.staff-list {
  width: 100%;
  background-color: @White;
}
.pagination {
  width: 100%;
  float: right;
}
</style>

<script>
import jumbotronVue from './../../../components/common/jumbotron.vue'
import { HelpSection } from '@/pages/partner/quick-help'
import {
  NitrozenButton,
  flatBtn,
  NitrozenInput,
  NitrozenPagination,
  NitrozenBadge,
  NitrozenDropdown
} from '@gofynd/nitrozen-vue'

import { mapGetters } from 'vuex'
import staffVue from '../../../components/partner/team/staff-member.vue'
import pageEmpty from '@/components/common/page-empty.vue'
import pageError from '@/components/common/page-error.vue'
import listShimmer from '@/components/common/layout/list-shimmer.vue'
import TeamService from '../../../services/team.service'
import { FETCH_STAFF, FETCH_ACL } from '../../../store/action.type'
import {
  GET_STAFF,
  GET_ORGANIZATION_DETAILS
} from '../../../store/getters.type'

import {
  fullName,
  reduce,
  fullPhNo
} from './../../../components/partner/team/helper'

const PAGINATION = {
  page: 1,
  limit: 10
}

const ROLE_FILTER = [
  {
    text: 'All Roles',
    value: 'all'
  },
  {
    text: 'Admin',
    value: 'admin'
  },
  {
    text: 'Public',
    value: 'public'
  },
  {
    text: 'Marketing Manager',
    value: 'marketing-manager'
  },
  {
    text: 'Catalogue Manager',
    value: 'catalogue-manager'
  },
  {
    text: 'Custom',
    value: 'custom'
  }
]

export default {
  name: 'team',
  components: {
    jumbotron: jumbotronVue,
    'staff-member': staffVue,
    'nitrozen-button': NitrozenButton,
    'nitrozen-input': NitrozenInput,
    'nitrozen-pagination': NitrozenPagination,
    'nitrozen-badge': NitrozenBadge,
    'nitrozen-dropdown': NitrozenDropdown,
    'page-empty': pageEmpty,
    'page-error': pageError,
    'list-shimmer': listShimmer
  },
  directives: {
    flatBtn
  },
  computed: {
    ...mapGetters({
      staffList: GET_STAFF,
      organization: GET_ORGANIZATION_DETAILS
    }),
    getStaffList() {
      let limit = this.pagination.limit
      let skip = this.pagination.limit * (this.pagination.page - 1)
      let d = [...this.staffList]
      if (this.searchText.length !== 0) {
        d = d.filter((staff) => {
          let staffName = this.fullName(staff) || ''
          let email = this.reduce(staff.emails).email || ''
          let phoneNumber = this.reduce(staff.phone_numbers).phone || ''

          // to lower case to make search case insensitive
          staffName = staffName.toLowerCase()
          email = email.toLowerCase()
          phoneNumber = phoneNumber.toLowerCase()
          const searchText = this.searchText.toLowerCase()

          return (
            staffName.includes(searchText) ||
            email.includes(searchText) ||
            phoneNumber.includes(searchText)
          )
        })
      }
      if (this.selectedRoleFilter !== 'all') {
        d = d.filter((staff) => {
          if (staff.roles.length == 0) {
            return false
          }
          return staff.roles[0] === this.selectedRoleFilter
        })
      }
      this.pagination.count = d.length
      return _.compact(d).slice(skip, limit + skip)
    },
    roleFilter() {
      let filter = [
        {
          text: 'All Roles',
          value: 'all'
        }
      ]
      if (Array.isArray(this.aclList.roles)) {
        this.aclList.roles.forEach((role) => {
          filter.push({
            text: role.title,
            value: role.key
          })
        })
      }
      return filter
    },
    jumbotronData() {
      if (HelpSection.length) {
        return HelpSection.find((it) => {
          return it.key === 'team'
        })
      }
    }
  },
  data() {
    return {
      inProgress: false,
      pageError: false,
      pageLoading: false,
      searchText: '',
      roleList: [...ROLE_FILTER],
      selectedRoleFilter: 'all',
      aclList: {},
      paginationConfig: {
        limit: 10,
        current: 1,
        total: 10
      },
      pagination: { ...PAGINATION }
    }
  },
  mounted() {
    this.populateFromURL()
    this.getAcl()
    this.fetchTeamMembers()
  },
  methods: {
    fullName,
    reduce,
    fullPhNo,
    populateFromURL() {
      const { search, roleFilter, page, limit } = this.$route.query
      this.searchText = search || this.searchText
      this.selectedRoleFilter = roleFilter || this.selectedRoleFilter
      this.pagination.page = +page || this.pagination.page
      this.pagination.limit = +limit || this.pagination.limit
    },
    fetchTeamMembers() {
      this.$store
        .dispatch(FETCH_STAFF, { partnerId: this.organization._id })
        .then((data) => {
          this.pageLoading = false
          this.paginationConfig.total = this.getStaffList.length
        })
        .catch(() => {
          this.pageLoading = false
          this.pageError = true
        })
    },
    getAcl() {
      this.$store
        .dispatch(FETCH_ACL)
        .then((data) => {
          this.aclList = data
        })
        .catch(() => {})
    },

    invite() {
      const { params } = this.$route
      this.$router.push('/partner/' + params.partnerId + '/invite')
    },
    paginationChange(e) {
      this.paginationConfig = e
      // this.setTeamPage(this.paginationConfig)
    },
    setTeamPage(filter) {
      const { page, limit } = filter
      this.pagination = Object.assign({}, this.pagination, {
        page,
        limit
      })
      this.setRouteQuery({ page, limit })
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
    }
  }
}
</script>
