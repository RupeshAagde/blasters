<template>
    <div class="panel">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Reports and Ledger'"
                :desc="'Welcome to JioMarket Reporting and Ledger console. Your latest reports and ledger appear below.'"
            ></jumbotron>
        </div>
        <div class="main-container">
            <div class="page-container">
                <div class="group-name-container">
                    <nitrozen-tab
                        class="group-tab"
                        :activeIndex="activeGroupIndex"
                        @tab-change="changeGroupIndex"
                        :tabItem="tabs"
                        :label="'name'"
                    ></nitrozen-tab>
                </div>
                <div v-if="activeGroupIndex == 0">
                    <finance-report></finance-report>
                </div>
                <div v-else-if="activeGroupIndex == 1">
                    <finance-recon></finance-recon>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';
import financeReport from './finance-report.vue';
import financeRecon from './finance-reconciliation.vue';
import {
    NitrozenTab
} from '@gofynd/nitrozen-vue';

export default {
    name: 'bills-and-payouts',
    components:{
        jumbotron: Jumbotron,
        'nitrozen-tab': NitrozenTab,
        financeReport,
        financeRecon
    },
    computed:{

    },
    data(){
        return {
            activeGroupIndex: Number(this.$route.query.activeTab) ? Number(this.$route.query.activeTab) : 0,
            tabs: [{ name: 'Reports' },{name: 'Account ledger'}],

        }
    },
    mounted(){
        if (this.$route.query.hasOwnProperty('activeTab')) {
            this.changeGroupIndex({
                index: Number(this.$route.query.activeTab)
            });
        }
    },
    methods:{
        changeGroupIndex(item) {
            this.activeGroupIndex = item.index;
            this.$router.replace({
                name: 'bills-and-payouts',
                query: { ...this.$route.query, activeTab: item.index }
            }).catch(()=>{});
        },
    }
}
</script>

<style lang="less" scoped>

.panel{
    display: flex;
    flex-direction: column;

    .main-container {
        margin: 12px;
        //top: 56.5px;
        position: relative;
        .page-container {
            width: 95%;
            margin: 0 auto;
            display: block;
            //background: transparent;
            padding: 24px 16px;
            .group-name-container {
                margin-bottom: 24px;
                .group-tab {
                    border-bottom: 1px solid #e4e5e6;
                    /deep/.nitrozen-tab {
                        padding: 0px;
                    }
                }
            }
        }
    }

}
</style>