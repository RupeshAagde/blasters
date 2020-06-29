<template>
    <div class="panel">
        <div class="top-container">
            <adm-page-header
                :title="'Company Details'"
                @backClick="redirectToListing"
            ></adm-page-header>
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

.top-container {
    width: 100%;
    margin: 0 0 84px 0;
    position: relative;
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
</style>

<script>
import admbrands from './brands.vue';
import admstores from './stores.vue';
import admpageheader from '@/components/common/adm-page-header';
import admcompanydetails from './profile-details.vue';

export default {
    name: 'adm-company-profile',
    components: {
        'adm-brands': admbrands,
        'adm-page-header': admpageheader,
        'adm-stores': admstores,
        'adm-company-details': admcompanydetails
    },
    computed: {},
    data() {
        return {
            companyId: null
        };
    },
    mounted() {
        this.populateFromURL();
    },
    methods: {
        populateFromURL() {
            const { companyId } = this.$route.params.companyId;
            if (companyId) this.companyId = companyId;
        },
        redirectToListing() {
            this.$router.push({ path: '/administrator/company-list' });
        }
    }
};
</script>
