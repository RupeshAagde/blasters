<template>
  <div class="main-wrapper">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Settlement Rule'"
                :desc="'Settlement Rule'"
            ></jumbotron>
        </div>
        <div class="wrapper">
            <div class="rule-title">Create Rule</div>
            <div class="filters-wrap">
                <div class="company-filter filter-item">
                    <nitrozen-dropdown
                        id="company-name"
                        :items="companyNames"
                        v-model="selectedCompany"
                        label = "Company"
                        placeholder="Select Company"
                        :searchable="true"
                        @change="filterByCompany"
                        @searchInputChange="searchCompany"
                    ></nitrozen-dropdown>
                </div>
                <div class="brand-filter filter-item">
                    <nitrozen-dropdown
                        id="brand-name"
                        :items="brandNames"
                        v-model="selectedBrand"
                        label = "Brand"
                        placeholder="Select Brand"
                        :multiple="true"
                        :searchable="true"
                    ></nitrozen-dropdown>
                </div>
                <div class="location-filter filter-item">
                    <nitrozen-dropdown
                        id="location-name"
                        :items="filterLists.location_type"
                        v-model="selectedLocation"
                        label = "Location"
                        placeholder="Select Location"
                        :multiple="true"
                    ></nitrozen-dropdown>
                </div>
                <div class="channel-filter filter-item">
                    <nitrozen-dropdown
                        id="channel-name"
                        :items="filterLists.channel"
                        v-model="selectedChannel"
                        label = "Channel"
                        placeholder="Select Channel"
                        :multiple="true"
                        @change="filterByChannel"
                    ></nitrozen-dropdown>
                </div>
                <div class="affiliate-filter filter-item">
                    <nitrozen-dropdown
                        id="affiliate-name"
                        :items="affiliateNames"
                        v-model="selectedAffiliate"
                        label = "Affiliate"
                        placeholder="Select Affiliate"
                        :multiple="true"
                    ></nitrozen-dropdown>
                </div>
            </div>
            <div class="tp-wrap">
                <nitrozen-checkbox v-model="formData.transactional_components.is_tp">
                    <div class="checkbox-val">is_tp</div>
                </nitrozen-checkbox>
            </div>
            <div class="settlement-status-wrap">
                <div class="settle-item">
                    <nitrozen-input
                        :label="'High Street'"
                        v-model="formData.settle_cycle_period.high_street"
                        :type="'number'"
                    >
                    </nitrozen-input>
                </div>
                <div class="settle-item">
                    <nitrozen-input
                        :label="'Mall'"
                        v-model="formData.settle_cycle_period.mall"
                        :type="'number'"
                    >
                    </nitrozen-input>
                </div>
                <div class="settle-item">
                    <nitrozen-input
                        :label="'Warehouse'"
                        v-model="formData.settle_cycle_period.warehouse"
                        :type="'number'"
                    >
                    </nitrozen-input>
                </div>
            </div>
            <div class="dates-main-wrap">
                <div class="content-title">Select Dates</div>
                <div class="date-settlement-wrap">
                    <div class="date-picker-wrap ds-item">
                        <date-picker
                            class="date-picker filter-input-dr"
                            picker_type="date"
                            date_format="MMM Do, YY"
                            v-model="ruleDaterange"
                            :clearable="false"
                            :range="true"
                            :shortcuts="dateRangeShortcuts"
                            :useNitrozenTheme="true"
                            @input="onDateChange"
                        /> 
                    </div>
                    <div class="settletype-filter ds-item">
                        <nitrozen-dropdown
                            id="settle-type"
                            :items="filterLists.settlement_type"
                            v-model="selectedSettlementType"
                            label = "Settlement Type"
                            placeholder="Select Settlement Type"
                            :multiple="true"
                        ></nitrozen-dropdown>
                </div>
                </div>
            </div>
            <div class="rule-wrap" :key="unique">
                <!-- <div class="content-title">Select a Formula/Condition</div> -->
                <daytrader-component
                    v-if="dtOptions"
                    :disabled="false"
                    :options="dtOptions"
                    :ref="'daytrader'"
                    class="plan-component"
                    :config="dtOptions"
                    :cbs_opts="cbs_opts"
                    :component_id="''"
                >
                </daytrader-component>
            </div>
        </div>
    </div>
</template>
<script>

import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import { debounce } from '@/helper/utils';
import { dateRangeShortcuts } from '@/helper/datetime.util';
import DatePicker from '@/components/common/date-picker.vue';
import moment from "moment";
import cloneDeep from 'lodash/cloneDeep';
import DaytraderComponent from './daytrader-component.vue';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenCheckBox,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name:'settlement-rule',
    components: {
      'jumbotron': Jumbotron,
      'nitrozen-button': NitrozenButton,
      'nitrozen-dropdown':  NitrozenDropdown,
      'date-picker':DatePicker,
      'daytrader-component': DaytraderComponent,
      'nitrozen-input': NitrozenInput,
      "nitrozen-checkbox": NitrozenCheckBox,

    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            dateRangeShortcuts: cloneDeep(dateRangeShortcuts),
            selectedCompany: [],
            companyNames: [],
            selectedBrand: [],
            brandNames: [],
            selectedLocation: [],
            selectedChannel: [],
            selectedAffiliate: [],
            affiliateNames: [],
            unique:0,
            ruleDaterange: [
                moment().subtract(1, 'week').toISOString(),
                moment().toISOString(),
            ],
            filterLists: {
                channel: [],
                location_type: [],
                settlement_type: [],
            },
            selectedSettlementType : [],
            dtOptions:{},
            cbs_opts:{},
            formData: {
                name: '',
                slug_fields: ['channel'],
                slug_values: {
                    channel: {},
                    company: [],
                    brand: [],
                    location: []
                },
                rule_start_date: null,
                rule_end_date: null,
                settle_cycle_period: {
                    mall: 5,
                    warehouse: 5,
                    high_street: 5
                },
                settlement_type: '',
                transactional_components: {
                    is_tp: false,
                    defaults: {},
                    conditional: {},
                    transaction_component: {}
                }
            }
            
        }
  },
  watch: {
    dtOptions() {
        this.$forceUpdate();
        this.unique++;
    }
  },
  mounted(){
    this.fetchCompany();
    this.fetchFilterData("channel");
    this.fetchFilterData("location_type");
    this.fetchFilterData("settlement_type");
    this.fetchRuleData();
  },
  methods: {
    filterByCompany(){
        this.fetchRuleData();
    },
    filterByChannel(){
        this.fetchRuleData();
    },
    searchCompany(e) {
        debounce((text) => {
            this.fetchCompany(text);
        }, 1000)(e.text);
    },
    fetchCompany(query='') {
        let params = {
            data:{
                search: query
            }
        };
        return FinanceService.getCompanyList(params)
            .then((res) => {
                this.companyNames = res.data.company_list;
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load companies');
            });
    },
    fetchFilterData(val) {
        let params = {
            data:{
                "table_name": "config_fields_values",
                "filters": {
                    "config_field": val
                },
                "project": [
                    "id",
                    "name",
                    "display_name"
                ]
            }
        };
        const caller = FinanceService.getDataFin(params);
        caller
            .then((res) => {
                this.filterLists[val] = res.data.items.map((item) => {
                        return {
                            text: item.display_name,
                            value: item.name,
                            id: item.id
                        };
                    })
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load '+ val);
            });

    },
    fetchRuleData() {
        this.getCompanyInfoObj();
        console.log(this.selectedChannel);
        let params = {
            data: {
                "table_name":"settlement_rule",
                "channels":this.selectedChannel
            }
        };
        return FinanceService.getRuleData(params)
            .then((res) => {
                this.dtOptions = res.data.items;
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load Rule Data');
            });
    },
    onDateChange(){

    },
    getCompanyInfoObj() {
            let opts = {
                brands: this.selectedBrand,
                locations: this.selectedLocation,
                company: this.selectedCompany
            };
            this.cbs_opts = opts;
        }
    }

}
</script>

<style lang="less" scoped>
.wrapper{
    background: #FFFFFF;
    border-radius: 4px;
    margin: 24px 24px 0;
    padding: 24px;

    .rule-title{
        color: #41434c;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 25px;
        margin: 0 auto 40px;
    }
}

.filters-wrap{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 -10px;
    .filter-item{
        width: 20%;
        max-width: 20%;
        flex: 1 1 20%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    
}
.date-settlement-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 -10px;
    .ds-item{
        width: 20%;
        max-width: 20%;
        flex: 1 1 20%;
        padding: 0 10px;
        box-sizing: border-box;
    }
}
.content-title{
    color: #41434c;
    font-size: 18px;
    font-weight: 700;
    line-height: 23px;
    padding: 30px 0 20px;
}
.settlement-status-wrap{

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 -10px;
    margin-top: 30px;
    .settle-item{
        width: 33.33%;
        max-width: 33.33%;
        flex: 1 1 33.33%;
        padding: 0 10px;
        box-sizing: border-box;

    }

}

.tp-wrap{
    border: 1px solid #dedede;;
    border-radius: 3px;
    padding: 16px 12px;
    box-sizing: border-box;
    margin-top: 30px;
}




</style>