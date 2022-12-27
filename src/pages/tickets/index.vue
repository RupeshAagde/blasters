<template>
    <div class="panel">
        <page-header
            title="Ticket Listing"
            :showBackButton="false"
            @backClick="$router.push({ name: 'support' })"
        >
        </page-header>
        <div class="main-container">
            <div v-if="isLoading">
                <loader></loader>
            </div>
            <div v-else-if="enabled" style="width: 100%">
                <ticket-list style="margin-top: 16px"> </ticket-list>
            </div>
            <div v-else class="img-container">
                <img src="/public/assets/pngs/coming-soon.png" class="coming-soon">
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.main-container {
    position: relative;
    margin: 24px;
    padding: 24px;
    border-radius: 12px;
    top: 56.5px;
    background: #ffffff;
    border-radius: 12px;
}
.img-container {
    display: flex;
    width: 100%;
    height: 50vh;
    align-items:center;
}
.coming-soon {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    align-self: center;
    padding: 5%;
    width: 70%;
}
.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}
</style>

<script>
import TicketList from './ticket-list.vue';
import { PageHeader } from '@/components/common';
import Loader from '@/components/common/loader.vue';
import SupportService from '../../services/support.service';

export default {
    name: 'adm-support',
    components: {
        PageHeader,
        'loader': Loader,
        'ticket-list': TicketList,
        Loader
    },
    computed: {
    },
    data() {
        return {
            enabled: true,
            isLoading: false,
            not_found: false,
            isInitialLoad: false,
            initial_count: 0
        };
    },
    mounted() {
        //this.getGeneralConfiguration();
    },
    methods: {
        getGeneralConfiguration() {
            this.isLoading = true;
            SupportService.getGeneralConfig()
                .then((response) => {
                    if (response.data && response.data.integration) {
                        this.enabled = true
                    } else {
                        this.enabled = false
                    }
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to get configuration data');
                })
                .finally(() => (
                    this.isLoading = false
                ));
        }
    }
};
</script>
