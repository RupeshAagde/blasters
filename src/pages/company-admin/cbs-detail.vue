<template>
    <div class="panel">
        <div v-if="inProgress" class="shimmer"></div>
        <div v-if="!inProgress" class="cust-panel">
            <div class="top-container" v-if="profileDetails">
                <page-header
                    :title="profileDetails.name"
                    @backClick="redirectToListing"
                >
                    <div class="top-badge">
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'verified'"
                            state="success"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'complete'"
                            state="warn"
                            >Verification Pending</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'rejected'"
                            state="error"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                        <nitrozen-badge
                            v-if="profileDetails.stage == 'incomplete'"
                            state="error"
                            >{{ profileDetails.stage }}</nitrozen-badge
                        >
                    </div>
                </page-header>
            </div>
        </div>
        <div class="main-container profile-container">
            <div class="full-width">
                <div class="feature-container">
                    <!-- Brands Section -->
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-brands></adm-brands>
                        </div>
                    </div>
                    <!-- Stores Section -->
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-stores></adm-stores>
                        </div>
                    </div>
                </div>

                <!-- Profile Section -->
                <div class="profile-container">
                    <div class="page-container common-container">
                        <div class="left-container">
                            <adm-company-details></adm-company-details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.top-badge {
    display: flex;
    justify-content: flex-start;
    margin-left: 24px;
}

::v-deep .page-slot {
    display: flex;
    flex: 1;
    justify-content: flex-start !important;
}
.top-container {
    width: 100%;
    margin: 0 0 0 0;
    position: relative;
}
.cust-panel {
    margin-bottom: 84px;
}
.profile-container {
    margin-right: 0;
}
.main-container {
    // margin-right: 0;
    .full-width {
        width: 100%;
        display: flex;
        .feature-container {
            width: 60%;
        }
        .profile-container {
            width: 40%;
        }
        .common-container {
            width: auto;
            margin: 0 24px 24px 0;
            padding: 12px 24px 0 24px;
        }
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 48px;
    margin-bottom: 24px;
}
</style>

<script>
import admbrands from './brands.vue';
import admstores from './stores.vue';
import PageHeader from '@/components/common/layout/page-header';
import admcompanydetails from './profile-details.vue';
import CompanyService from '@/services/company-admin.service';
import Shimmer from '@/components/common/shimmer';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-company-profile',
    components: {
        'adm-brands': admbrands,
        PageHeader,
        'adm-stores': admstores,
        'adm-company-details': admcompanydetails,
        Shimmer,
        'nitrozen-badge': NitrozenBadge
    },
    computed: {},
    data() {
        return {
            companyId: this.$route.params.companyId,
            profileDetails: {},
            inProgress: false
        };
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
                    this.profileDetails = res.data.data;
                })
                .catch((err) => {
                    this.inProgress = false;
                    console.error(err);
                });
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/company-list' });
        }
    }
};
</script>
