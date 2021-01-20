<template>
    <div class="panel">
        <page-error
            v-if="pageError && !inProgress"
            @tryAgain="fetchMarketplaceWorkers"
        ></page-error>
        <div v-else-if="!isEmpty(marketplaceWorkers)">
            <div v-for="(wrkrConf, mkp) in marketplaceWorkers" :key="mkp" class="mkp-wrkr-cont">
                <div class="mkp-name"> {{wrkrConf.disaplay || wrkrConf.display}} </div>
                <nitrozen-dropdown
                    class="wrkr-dropdown"
                    placeholder="Select Workers"
                    :items="wrkrConf.available_workers"
                    v-model="wrkrConf.current_worker"
                    @change="updateWorker(mkp, $event)"
                ></nitrozen-dropdown>
            </div>
        </div>
        <page-empty v-else :text="'No Marketplace Channels Found'"></page-empty>
    </div>
</template>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.mkp-wrkr-cont {
    display: flex;
    margin: 20px 0px;
}
.mkp-name {
    flex: 0.4;
    align-items: center;
    display: flex;
    text-transform: capitalize;
}
.wrkr-dropdown {
    flex: 0.6;
    width: 200px;
}
</style>

<script>
import PageHeader from '@/components/common/layout/page-header';
import CompanyService from '@/services/company-admin.service';
import Shimmer from '@/components/common/shimmer';
import { NitrozenDropdown } from '@gofynd/nitrozen-vue';
import MarketplacesService from '@/services/marketplaces.service';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';

import root from 'window-or-global';
const env = root.env || {};
import { isEmpty, cloneDeep  } from 'lodash';

export default {
    name: 'adm-company-mkp-channels',
    components: {
        Shimmer,
        PageHeader,
        NitrozenDropdown,
        PageEmpty,
        PageError
    },
    data() {
        return {
            companyId: this.$route.params.companyId,
            marketplaceWorkers: {},
            inProgress: false,
            pageError: false,
            originalWrkrConfig: {}
        };
    },
    mounted() {
        this.fetchMarketplaceWorkers();
    },
    methods: {
        isEmpty,
        fetchMarketplaceWorkers: function() {
           this.inProgress = true;
            MarketplacesService.getMarketplaceWorkers(this.companyId)
                .then(({ data }) => {
                    this.inProgress = false;
                    for (let mkp in data) {
                        data[mkp].current_worker = data[mkp].current_worker.toString();
                        data[mkp].available_workers.forEach((doc) => {
                            doc.value = doc.value.toString();
                        });
                    }
                    this.marketplaceWorkers = data;
                    this.originalWrkrConfig = cloneDeep(data);
                })
                .catch((err) => {
                    this.inProgress = false;
                    this.pageError = true;
                });
        },
        updateWorker(mkp, worker) {
            if (this.originalWrkrConfig[mkp].current_worker === worker) {
                return;
            }
            let payload = {
                worker
            };

            MarketplacesService.updateMarketplaceWorker(this.companyId, mkp, payload)
                .then(({ data }) => {
                    this.inProgress = false;
                    this.originalWrkrConfig[mkp].current_worker = worker;
                    this.$snackbar.global.showSuccess('Worker updated successfully');
                })
                .catch(() => {
                    this.$snackbar.global.showError('Failed to update worker');
                });
        }
    }
};
</script>
