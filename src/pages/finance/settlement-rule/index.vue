<template>
  <div class="main-wrapper">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Settlement Rule'"
                :desc="'Settlement Rule'"
            ></jumbotron>
        </div>
       <div class="wrapper">
        <div class="rule-creation-wrap" v-if="openCreationPage">
            <div class="create-rule-cta">
                <div class="title">Create Rule</div>
                <div class="desc"> Create and View Settlement Rules for Companies here. These rules will be applied to new bag status events to calculate payouts and receivables for sellers. </div>
                <nitrozen-button
                    v-flatBtn
                    :theme="'secondary'"
                    class="more-filters"
                    @click="openCreateRulePage"
                    >Create Rule
                </nitrozen-button>
            </div>

            <div class="filters-wrap"></div>
            <div class="list-wrap">
                <table class="mirage-table additional-table">
                    <tr>
                        <td>Rule</td>
                        <td>Company</td>
                        <td>Brand</td>
                        <td>Channel</td>
                        <td>Start Date - End Date</td>
                        <td></td>
                    </tr>
                    <template>
                        <tr v-for="(item, index) in this.ruleDataList"
                                :key="'item-' + index">
                            <td>{{ item.rule_slug }}</td>
                            <td>
                                <div class="comapny-wrap">
                                    <div v-if="item.slug_values.company">
                                        {{ item.slug_values.company.name }}
                                    </div>
                                    <div v-else>
                                        NA
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </div>
        <div class="rule-main-wrap" v-else>
            <create-rule></create-rule>
        </div>
       </div>
    </div>
</template>
<script>

import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import CreateRulePage from './create-rule/index.vue';
import {
    NitrozenButton,
    NitrozenDropdown,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name:'settlement-rule',
    components: {
      'jumbotron': Jumbotron,
      'nitrozen-button': NitrozenButton,
      'nitrozen-dropdown':  NitrozenDropdown,
      'create-rule': CreateRulePage
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            openCreationPage:true,
            ruleDataList: []
        }
    },
    mounted(){
        this.fetchRulesList();
    },
    methods: {
        openCreateRulePage(){
            this.openCreationPage = false;
        },
        fetchRulesList(val) {
        let params = {
            data : {
                "table_name": "settlement_rule",
                "filters": {
                    "status": "unverified"
                },
                "search": {},
                "project": [
                    "id",
                    "created_at",
                    "created_by",
                    "updated_at",
                    "status",
                    "rule_slug",
                    "slug_values",
                    "rule_start_date",
                    "rule_end_date"
                ],
                "pageSize": 10,
                "page": 1,
                "order_by": "created_at DESC"
            }

        }
        const caller = FinanceService.getRulesList(params);
        caller
            .then((res) => {
                console.log(res);
                this.ruleDataList = res.data.items;
                
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load '+ val);
            });

    },
    
    }
   

}
</script>

<style lang="less" scoped>

.create-rule-cta{
    padding: 20px 30px;
    border: 1px solid #e4e5e6;
    color: #41434c;
    margin: 24px 24px 0;
    background: #fff;
    .title{
        font-size: 25px;
        line-height: 30px;
        font-weight: bold;
    }
    .desc{
        font-size: 16px;
        line-height: 21px;
        margin: 12px 0;
    }
}

.mirage-table {
    width: 100%;
    margin-bottom: 24px;
    font-size: 14px;
    overflow-x: auto;

    tr:first-child {
        border: 1px solid #E0E0E0;
        background: #f8f8f8;
        color: @Black;
    }
    tr:not(:first-child) {
        border-bottom: 1px solid @Iron;
    }
    td {
        text-align: center;
        padding: 16px 6px;
        vertical-align: middle;
        max-width: 120px;
    }
}

</style>