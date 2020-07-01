<template>
  <div class="main-container">
    <div class="jumbotron-container">
      <adm-jumbotron
        :title="'Company'"
        :desc="
          'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
        "
      ></adm-jumbotron>
    </div>
    <div class="second-container">
      <div
        class="search-box"
        v-if="
          pageLoading ||
            (searchText !== '' ||
              selectedFilter !== 'all' ||
              companyList.length > 0)
        "
      >
        <div v-if="isInitialLoad" class="input-shimmer shimmer"></div>
        <template v-else>
          <nitrozen-input
            :showSearchIcon="true"
            class="search"
            type="search"
            placeholder="Search by name..."
            v-model="searchText"
            @input="debounceInput({ name: searchText })"
          ></nitrozen-input>
          <div class="filter">
            <label class="label">Filter</label>
            <nitrozen-dropdown
              class="filter-dropdown"
              :items="filters"
              v-model="selectedFilter"
              @change="fetchCompany(), setRouteQuery({ stage: selectedFilter })"
            ></nitrozen-dropdown>
          </div>
        </template>
      </div>
      <div class="product-list">
        <adm-shimmer v-if="pageLoading && !pageError" :count="4"></adm-shimmer>
        <page-error
          v-else-if="pageError && !pageLoading"
          @tryAgain="fetchCompany"
        ></page-error>
        <div v-else-if="companyList && companyList.length">
          <!-- new cards -->
          <div
            v-for="(product, index) in companyList"
            :key="index"
            class="container"
          >
            <div class="card-top">
              <div class="left-container">
                <div>
                  <div class="badge-class">
                    <div class="txt-company-heading hlp-badge">
                      {{ product.name }}
                    </div>
                    <nitrozen-badge
                      v-if="product.stage == 'verified'"
                      state="success"
                      >{{ product.stage }}</nitrozen-badge
                    >
                    <nitrozen-badge
                      v-if="product.stage == 'complete'"
                      state="warn"
                      >{{ product.stage }}</nitrozen-badge
                    >
                    <nitrozen-badge
                      v-if="product.stage == 'rejected'"
                      state="error"
                      >{{ product.stage }}</nitrozen-badge
                    >
                    <nitrozen-badge
                      v-if="product.stage == 'incomplete'"
                      state="error"
                      >{{ product.stage }}</nitrozen-badge
                    >
                  </div>
                  <div class="txt-arrange">
                    <div class="txt-description-heading">Created By :</div>
                    <div class="txt-details-by">
                      {{ product.created_by.username }}
                    </div>
                  </div>
                  <div class="txt-arrange">
                    <div class="txt-description-heading">Created On :</div>
                    <div class="txt-details-on">
                      {{ new Date(product.created_on).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="right-container">
                <nitrozen-button
                  theme="secondary"
                  class="export-catalog"
                  v-if="product.stage != 'verified'"
                  v-strokeBtn
                  @click="openApproveDialog(product)"
                  >Approve</nitrozen-button
                >
                <nitrozen-button
                  theme="secondary"
                  class="export-catalog"
                  v-if="product.stage != 'rejected'"
                  v-strokeBtn
                  @click="openRejectDialog(product)"
                  >Reject</nitrozen-button
                >
                <nitrozen-button
                  theme="secondary"
                  class="export-catalog"
                  v-strokeBtn
                  @click="companyView(product)"
                  >View</nitrozen-button
                >
              </div>
            </div>
          </div>
        </div>
        <adm-no-content
          v-else
          :helperText="'No company found'"
        ></adm-no-content>
        <div class="pagination" v-if="companyList.length > 0">
          <nitrozen-pagination
            name="Companies"
            v-model="pagination"
            @change="paginationChange"
            :pageSizeOptions="[5, 10, 20, 50]"
          ></nitrozen-pagination>
        </div>
      </div>
      <nitrozen-dialog
        class="remove_staff_dialog"
        ref="company_approve_dialog"
        title="Approve Company"
      >
        <template slot="header" v-if="activeCompany">
          {{ activeCompany.name }}
        </template>
        <template slot="body"
          >Are you sure you want to approve this company?</template
        >
        <template slot="footer">
          <div>
            <nitrozen-button
              class="mr24"
              @click="approveCompany"
              v-flatBtn
              :theme="'secondary'"
              >Approve</nitrozen-button
            >
            <nitrozen-button
              @click="closeApproveDialog"
              v-strokeBtn
              :theme="'secondary'"
              >Cancel</nitrozen-button
            >
          </div>
        </template>
      </nitrozen-dialog>
      <nitrozen-dialog
        class="remove_staff_dialog"
        ref="company_reject_dialog"
        title="Reject Company"
      >
        <template slot="header" v-if="activeCompany">
          {{ activeCompany.name }}
        </template>
        <template slot="body" class="desc-dialog">
          <div>
            <nitrozen-input
              class="cust-inp"
              type="textarea"
              label="Rejection Reason*"
              placeholder="Explain rejection reason properly..."
              v-model="rejection_info.value"
            ></nitrozen-input>
            <nitrozen-error class="cust-inp" v-if="rejection_info.showError">
              {{ rejection_info.errortext }}
            </nitrozen-error>
          </div>
          <div>Are you sure you want to reject this company?</div>
        </template>
        <template slot="footer">
          <div>
            <nitrozen-button
              class="mr24"
              @click="rejectCompany"
              v-flatBtn
              :theme="'secondary'"
              >Reject</nitrozen-button
            >
            <nitrozen-button
              @click="closeRejectDialog"
              v-strokeBtn
              :theme="'secondary'"
              >Cancel</nitrozen-button
            >
          </div>
        </template>
      </nitrozen-dialog>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-container {
  width: 100%;
  background-color: white;
  margin: 24px;
  padding: 24px;
  padding-bottom: 0;
}
.second-container {
  margin: 24px 0px;
}
::v-deep .nitrozen-dialog-body {
  margin-bottom: 24px;
}
.cust-inp {
  margin-bottom: 24px;
}
.badge-class {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;

  .hlp-badge {
    margin-right: 24px;
  }
}
.search-filter-container {
  margin: 24px 0;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .search-box {
    min-width: 400px;
  }

  .filter-dropdown {
    width: 200px;
  }

  .filter {
    display: flex;
    align-items: center;

    .label {
      margin-right: 24px;
    }
  }
}
.search-box {
  margin: 24px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .search {
    min-width: 400px;
  }

  .filter {
    display: flex;
    align-items: center;
  }
  .label {
    font-family: Poppins;
    color: @Mako;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
  }
  .filter-dropdown {
    width: 200px;
    margin-left: 12px;
  }
}

.container {
  border: 1px solid #e4e5e6;
  cursor: pointer;
  min-height: 120px;
  padding: 0px 24px;
  border-radius: 3px;
  margin-bottom: 16px;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
  }
  .disabled {
    background: @WhiteSmoke;
    opacity: 0.5;
    pointer-events: none;
  }
  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-top {
    display: flex;
    height: 60px;
    margin-top: 24px;
    .left-container {
      display: flex;
      flex: 2;
      position: relative;
      width: calc(100% - 60px);

      .txt-arrange {
        display: flex;
        justify-content: flex-start;
        text-align: center;
        margin-bottom: 12px;
      }

      .txt-company-heading {
        font-weight: bold;
        font-size: 16px;
        color: #5c6bdd;
        margin-bottom: 12px;
      }
      .txt-description-heading {
        font-weight: bold;
        color: #41434c;
        font-size: 14px;
        margin-right: 24px;
      }
      .txt-details-by {
        margin-left: 4px;
        font-size: 14px;
        color: #41434c;
        font-weight: 300;
      }
      .txt-details-on {
        font-size: 14px;
        color: #41434c;
        font-weight: 300;
      }

      .card-avatar {
        min-height: 60px;
        min-width: 60px;
        max-height: 60px;
        max-width: 60px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          height: 60px;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .offer-details {
        padding: 0px 24px;
        line-height: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: calc(100% - 100px);
      }
    }
    .right-container {
      flex: 1;
      display: flex;
      flex: 1;
      flex-direction: row;
      position: relative;
      align-items: center;

      ::v-deep.continue-arrow svg {
        width: 40px;
        height: 40px;
      }
      ::v-deep.status-container {
        display: flex;

        padding: 0px 12px;
      }
    }
  }
  .card-bottom {
    line-height: 19px;
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    .size {
      width: auto;
      height: 40px;
      padding: 0 12px;
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      transition: background-color 0.3s;
      &:hover {
        background-color: @WhiteSmoke;
      }
      .line-1 {
        color: @Mako;
        font-weight: 500;
      }
    }
  }
}
.export-catalog {
  margin-left: 20px;
}
</style>
<script>
import path from 'path';
import CompanyService from '@/services/company-admin.service';
import admjumbotron from '@/components/common/adm-jumbotron';
import { titleCase, debounce } from '@/helper/utils';
// import loader from '@/components/common/adm-loader';
import admshimmer from '@/components/common/shimmer';
import admnocontent from '@/components/common/page-empty';
import pageerror from '@/components/common/page-error';
import fynotfound from '@/components/common/ukt-not-found';
// import { toListingThumbnail } from '@/helper/image.utils';
import {
  NitrozenInput,
  NitrozenError,
  NitrozenButton,
  NitrozenDropdown,
  NitrozenPagination,
  strokeBtn,
  flatBtn,
  NitrozenBadge,
  NitrozenDialog
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
  limit: 10,
  total: 0,
  current: 1
};

const ROLE_FILTER = [
  { value: 'all', text: 'All' },
  { value: 'incomplete', text: 'Incomplete' },
  { value: 'verified', text: 'Verified' },
  { value: 'complete', text: 'Verification Pending' },
  { value: 'rejected', text: 'Rejected' }
];

export default {
  name: 'adm-company-list',
  components: {
    'adm-jumbotron': admjumbotron,
    'adm-no-content': admnocontent,
    'adm-shimmer': admshimmer,
    'page-error': pageerror,
    'nitrozen-input': NitrozenInput,
    'nitrozen-pagination': NitrozenPagination,
    'nitrozen-badge': NitrozenBadge,
    'nitrozen-dialog': NitrozenDialog,
    'nitrozen-error': NitrozenError,
    NitrozenDropdown,
    NitrozenButton
  },
  directives: {
    strokeBtn,
    flatBtn
  },
  computed: {},
  data() {
    return {
      companyList: [],
      pageLoading: false,
      isInitialLoad: false,
      templatesLoading: false,
      pageError: false,
      activeCompany: null,
      categories: [],
      categoryValuesList: [],
      filters: [...ROLE_FILTER],
      searchText: '',
      selectedFilter: 'all',
      pagination: { ...PAGINATION },
      pageId: '',
      showSelectModal: false,
      departments: [],
      templates: [],
      selectedDepartment: '',
      selectedTemplate: {},
      resData: null,
      rejection_info: {
        showError: false,
        errortext: 'Please explain rejection reason properly.',
        value: ''
      }
    };
  },
  mounted() {
    this.pageLoading = true;
    this.populateFromURL();
    this.fetchCompany();
  },
  methods: {
    titleCase,
    populateFromURL() {
      const { name, pageId } = this.$route.query;
      if (name) this.searchText = name;
      if (pageId) this.pageId = pageId;
    },
    companyView(company) {
      let companyId = company.uid;
      if (companyId) {
        this.$router.push({
          path: `/administrator/company-details/${companyId}`
        });
      }
    },
    requestQuery() {
      const query = {
        page_no: this.pagination.current,
        page_size: this.pagination.limit
      };

      if (this.searchText) {
        query.name = this.searchText;
      }

      if (this.selectedFilter !== 'all') {
        query.stage = [this.selectedFilter];
      }

      return query;
    },
    fetchCompany() {
      this.pageLoading = true;
      return CompanyService.getCompanyList(this.requestQuery())
        .then(({ data }) => {
          this.companyList = data.data;
          // this.pagination.current = this.pagination.current + 1;=
          this.pagination.total = data.total_count;
          this.pageLoading = false;
        })
        .catch((err) => {
          this.pageLoading = false;
          this.pageError = true;
          console.log(err);
        });
    },
    getErrorImage() {
      return '/public/admin/assets/pngs/default_icon_listing.png';
    },
    paginationChange(filter, action) {
      const { current, limit } = filter;
      console.log(current, 'current', limit, 'limit');
      this.pagination.current = current;
      this.pagination = Object.assign({}, this.pagination, filter);
      console.log(this.pagination, 'pagination');
      // let pageQuery = { pageId: current, limit };
      // this.setRouteQuery(pageQuery);

      this.fetchCompany();
    },
    debounceInput: debounce(function(e) {
      if (this.searchText.length === 0) {
        this.clearSearchFilter();
      } else {
        this.setRouteQuery({ name: this.searchText });
      }
      this.fetchCompany();
    }, 200),
    clearSearchFilter() {
      this.searchText = '';
      this.setRouteQuery({ name: undefined });
    },
    openApproveDialog: function(company) {
      this.activeCompany = company;
      this.$refs.company_approve_dialog.data = company;
      this.$refs['company_approve_dialog'].open({
        width: '500px',
        showCloseButton: true,
        dismissible: true
      });
    },
    closeApproveDialog: function() {
      this.$refs['company_approve_dialog'].close();
    },
    openRejectDialog: function(company) {
      this.rejection_info.showError = false;
      this.activeCompany = company;
      this.$refs.company_reject_dialog.data = company;
      this.$refs['company_reject_dialog'].open({
        width: '500px',
        showCloseButton: true,
        dismissible: true
      });
    },
    closeRejectDialog: function() {
      this.$refs['company_reject_dialog'].close();
      this.rejection_info.showError = false;
      this.rejection_info.value = '';
    },
    approveCompany() {
      const obj = {
        uid: this.activeCompany.uid,
        stage: 'verified'
      };
      CompanyService.adminActionCompany(obj)
        .then((res) => {
          this.closeApproveDialog();
          this.fetchCompany();
          this.resData = JSON.parse(JSON.stringify(this.getFormData()));
          this.$snackbar.global.showSuccess('Company Approved Successfully', {
            duration: 2000
          });
          setTimeout(() => {
            this.onCancel();
          }, 2000);
        })
        .catch((err) => {
          console.error(err.response);
          this.$snackbar.global.showError(
            `${err.response.data ? err.response.data.errors.error : ''}`,
            {
              duration: 2000
            }
          );
        })
        .finally(() => {
          this.inProgress = false;
        });
    },
    rejectCompany() {
      if (this.rejection_info.value.length > 0) {
        const obj = {
          uid: this.activeCompany.uid,
          reject_reason: this.rejection_info.value,
          stage: 'rejected'
        };
        CompanyService.adminActionCompany(obj)
          .then((res) => {
            this.closeRejectDialog();
            this.rejection_info.value = '';
            this.fetchCompany();
            this.resData = JSON.parse(JSON.stringify(this.getFormData()));
            this.$snackbar.global.showSuccess('Company Rejected Successfully', {
              duration: 2000
            });
            setTimeout(() => {
              this.onCancel();
            }, 2000);
          })
          .catch((err) => {
            console.error(err.response);
            this.$snackbar.global.showError(
              `${err.response.data ? err.response.data.errors.error : ''}`,
              {
                duration: 2000
              }
            );
          })
          .finally(() => {
            this.inProgress = false;
          });
      } else {
        this.rejection_info.showError = true;
      }
    },
    setRouteQuery(query) {
      console.log(query, 'query');
      if (query.name || query.stage !== 'all') {
        // clear pagination if search or filter applied
        this.pagination = { ...PAGINATION };
        query.pageId = undefined;
        query.limit = PAGINATION.limit;
      }
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          ...query
        }
      });
    }
  }
};
</script>
