<template>
  <div>
    <div class="details">
      <div class="details-header">
        <label class="bold-xs cl-Mako">Details</label>
        <div class="img-box">
          <a
            :href="
              `https://platform.${fyndPlatformDomain}/company/${companyId}/profile/edit`
            "
            target="_blank"
            class="menu"
          >
            <img :src="'/public/assets/svgs/edit.svg'" />
          </a>
        </div>
      </div>
      <div v-if="inProgress" class="shimmer"></div>
      <div class="details-body" v-if="!inProgress">
        <div class="detail-row">
          <div class="row-1">
            <label class="dark-xs cl-DustyGray2">Company Name</label>
            <div class="company-detail">{{ profileDetails.name }}</div>
          </div>
          <div class="row-1">
            <label class="dark-xs cl-DustyGray2">Business Type</label>
            <div class="company-detail">{{ profileDetails.business_type }}</div>
          </div>
        </div>

        <div class="detail-row">
          <div class="row-1">
            <label class="dark-xs cl-DustyGray2">Company Type</label>
            <div class="company-detail">{{ profileDetails.company_type }}</div>
          </div>
          <div class="row-1">
            <label class="dark-xs cl-DustyGray2">Business Country</label>
            <div
              class="company-detail"
              v-if="profileDetails.business_country_info"
            >
              {{ profileDetails.business_country_info.country }}
            </div>
          </div>
        </div>

        <div class="detail-row" v-if="profileDetails.business_info">
          <div class="row-1 row-full">
            <label class="dark-xs cl-DustyGray2">Business Description</label>
            <div class="company-detail">{{ profileDetails.business_info }}</div>
          </div>
        </div>

        <div
          class="detail-row"
          v-if="profileDetails.addresses && profileDetails.addresses.length"
        >
          <div class="row-1 row-full">
            <label class="dark-xs cl-DustyGray2">Address</label>
            <div class="company-detail">
              {{ profileDetails.addresses[0].address1 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="documents">
      <div class="documents-header">
        <label class="bold-xs cl-Mako">Legal Documents</label>
        <div class="img-box">
          <a
            :href="
              `https://platform.${fyndPlatformDomain}/company/${companyId}/profile/edit-documents`
            "
            target="_blank"
            class="menu"
          >
            <img :src="'/public/assets/svgs/edit.svg'" />
          </a>
        </div>
      </div>
      <div v-if="inProgress" class="shimmer"></div>
      <div class="documents-body" v-if="!inProgress">
        <div
          class="document-row"
          v-for="(item, index) in profileDetails.documents"
          :key="'docs' + index"
        >
          <div class="document-type dark-xs cl-DustyGray2">{{ item.type }}</div>
          <div class="document-value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.details {
  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    .bold-xs {
      font-size: 18px;
    }
  }
  .details-body {
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .row-1 {
        flex: 0.5;
        .company-detail {
          color: @Mako;
          margin: 12px 0;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 500;
        }
        &.row-full {
          flex: 1;
        }
      }
    }
  }
}
.documents {
  position: absolute;
  width: calc(100% + 24px);
  background: @White;
  padding: 12px;
  padding-top: 24px;
  margin-top: 24px;
  margin-left: -24px;
  border-radius: 3px;
  .documents-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bold-xs {
      font-size: 18px;
    }
  }
  .documents-body {
    margin-top: 4px;
    .document-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 2.5;
      .document-type {
        text-transform: uppercase;
      }
      .document-value {
        color: @Mako;
        font-weight: 500;
      }
    }
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
import path from 'path';
import CompanyService from '@/services/company-admin.service';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

export default {
  name: 'adm-company-details',
  components: {
    'nitrozen-button': NitrozenButton
  },
  data() {
    return {
      inProgress: false,
      pageError: false,
      profileDetails: {},
      companyId: this.$route.params.companyId
    };
  },
  computed: {
    fyndPlatformDomain(type) {
      return env.FYND_PLATFORM_DOMAIN;
    }
  },
  mounted() {
    this.getProfileDetails();
  },
  methods: {
    getProfileDetails: function() {
      let params = {
        uid: this.companyId
        // phase: 'company_detail'
      };
      this.inProgress = true;
      CompanyService.fetchCompanyProfile(params)
        .then((res) => {
          this.inProgress = false;
          this.pageError = false;
          this.profileDetails = res.data.data;
        })
        .catch((err) => {
          this.pageError = true;
          this.inProgress = false;
          console.error(err);
        });
    },
    edit: function(params) {
      this.$router.push({
        path: path.join(this.$basePath, '/profile/edit')
      });
    },
    editDocuments: function() {
      this.$router.push({
        path: path.join(this.$basePath, '/profile/edit-documents')
      });
    }
  }
};
</script>
