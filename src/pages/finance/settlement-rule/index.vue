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
        }
  },
  mounted(){
  
  },
  methods: {
    openCreateRulePage(){
        this.openCreationPage = false;
    }
   
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

</style>