<template>
  <div class="main-wrapper">
        <div class="wrapper">
            <div class="rule-title">Create Rule</div>
            <div class="filters-wrap">
                <div class="company-filter filter-item">
                    <nitrozen-dropdown
                        id="company-name"
                        :items="filterLists.company"
                        v-model="formData.slug_values.company"
                        label = "Company"
                        placeholder="Select Company"
                        :searchable="true"
                        @change="filterByCompany"
                        @searchInputChange="searchCompany"
                        :required="true"
                    ></nitrozen-dropdown>
                </div>
                <div class="brand-filter filter-item">
                    <nitrozen-dropdown
                        id="brand-name"
                        :items="filterLists.brand"
                        v-model="formData.slug_values.brand"
                        label = "Brand"
                        :placeholder="formData.slug_values.brand.length+ ' Selected'"
                        :multiple="true"
                        :searchable="true"
                        @searchInputChange="searchBrand"
                    ></nitrozen-dropdown>
                </div>
                <div class="location-filter filter-item">
                    <nitrozen-dropdown
                        id="location-name"
                        :items="filterLists.location_type"
                        v-model="formData.slug_values.location_type"
                        label = "Location"
                        placeholder="Select Location"
                        :multiple="true"
                        @change="showLocationValue"
                    ></nitrozen-dropdown>
                </div>
                <div class="channel-filter filter-item">
                    <nitrozen-dropdown
                        id="channel-name"
                        :items="filterLists.channel"
                        v-model="formData.slug_values.channel"
                        label = "Channel"
                        placeholder="Select Channel"
                        :multiple="true"
                        @change="filterByChannel"
                    ></nitrozen-dropdown>
                </div>
                <div class="affiliate-filter filter-item">
                    <nitrozen-dropdown
                        id="affiliate-name"
                        :items="filterLists.affiliate"
                        v-model="formData.slug_values.affiliate"
                        label = "Affiliate"
                        :placeholder="formData.slug_values.affiliate.length+ ' Selected'"
                        :multiple="true"
                        :searchable="true"
                    ></nitrozen-dropdown>
                </div>
            </div>
            <div class="tp-wrap" v-if="tpExists">
                <nitrozen-checkbox v-model="formData.transactional_components.is_tp">
                    <div class="checkbox-val">is_tp</div>
                </nitrozen-checkbox>
            </div>
            <div class="settlement-status-wrap">
                <div class="settle-item" v-if="locationStatus.high_street">
                    <nitrozen-input
                        :label="'High Street'"
                        v-model="formData.settle_cycle_period.high_street"
                        :type="'number'"
                    >
                    </nitrozen-input>
                </div>
                <div class="settle-item" v-if="locationStatus.mall">
                    <nitrozen-input
                        :label="'Mall'"
                        v-model="formData.settle_cycle_period.mall"
                        :type="'number'"
                    >
                    </nitrozen-input>
                </div>
                <div class="settle-item" v-if="locationStatus.warehouse">
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
                            v-model="formData.settlement_type"
                            label = "Settlement Type"
                            placeholder="Select Settlement Type"
                            :required="true"
                        ></nitrozen-dropdown>
                </div>
                </div>
            </div>
            <div class="rule-wrap" :key="unique" v-if="companySelected">
                <daytrader-component
                    v-if="dtOptions"
                    :disabled="false"
                    :options="dtOptions"
                    :ref="'daytrader'"
                    class="plan-component"
                    :config="dtOptions"
                    :cbs_opts="cbs_opts"
                    :component_id="''"
                    :component_type="paramType"
                    :form_data="formData.transactional_components"
                    @passData="createPayload($event)"
                >
                </daytrader-component>
            </div>
            <nitrozen-error v-if="validationFailed">
                {{ validationMsg }}
            </nitrozen-error>
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
import isEmpty from 'lodash/isEmpty';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenCheckBox,
    NitrozenError,
    flatBtn,
    strokeBtn,
    
} from '@gofynd/nitrozen-vue';
export default {
    name:'create-rule',
    components: {
      'jumbotron': Jumbotron,
      'nitrozen-button': NitrozenButton,
      'nitrozen-dropdown':  NitrozenDropdown,
      'date-picker':DatePicker,
      'daytrader-component': DaytraderComponent,
      'nitrozen-input': NitrozenInput,
      "nitrozen-checkbox": NitrozenCheckBox,
      'nitrozen-error':NitrozenError,

    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            dateRangeShortcuts: cloneDeep(dateRangeShortcuts),
            companyNames: [],
            brandNames: [],
            affiliateNames: [],
            unique:0,
            ruleDaterange: [
                moment().subtract(1, 'week').toISOString(),
                moment().toISOString(),
            ],
            validationFailed: false,
            validationMsg: "Please select Settlement Type from Dropdown above",
            companySelected: false,
            filterLists: {
                channel: [],
                location_type: [],
                settlement_type: [],
                company: [],
                brand: [],
                affiliate: []
            },
            locationStatus:{
                high_street: false,
                mall: false,
                warehouse: false
            },
            tpExists: false,
            dtOptions:{},
            cbs_opts:{},
            payload: {},
            slugFields: ["company", "brand", "channel", "location_type", "affiliate"],
            formData: {
                slug_fields: [],
                slug_values: {
                    company: '',
                    brand: [],
                    channel: [],
                    location_type: [],
                    affiliate: []
                },
                type_of_request:"create_entity",
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
                    variable_conditional:{},
                    transaction_component: {}
                },
            },
            curParams: {},
            paramType: 'create'
            
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
    let params = this.$route.params;
    this.curParams = this.$route.params;
    if (params.preview != undefined){
        switch(params.preview) {
            case 'edit':
            this.paramType = params.preview;
            this.editRule(params.ruleId);
            break;
            case 'clone':
            // code block
            break;
            case 'verify':
            this.paramType = params.preview;
            this.editRule(params.ruleId);
            break;
        }
    }

  },
  methods: {
    editRule(id){
             let params = {
            data : {
                "table_name": "settlement_rule",
                "filters": {
                    "id": id
                },
                "project": [
                    "id",
                    "rule_slug",
                    "status",
                    "created_by",
                    "slug_values",
                    "transactional_components",
                    "settle_cycle_period",
                    "settlement_type",
                    "rule_start_date",
                    "rule_end_date"
                ]
            }

        }
        const caller = FinanceService.getDataFin(params);
        caller
            .then((res) => {
                let data = res.data.items[0];

                console.log(res);

                this.companySelected = true;

                for(let val in data.slug_values){
                    this.formData.slug_values[val] = [data.slug_values[val].id]
                }
                this.formData.slug_values.company = data.slug_values.company.id;
                this.formData.settlement_type = data.settlement_type;
                this.editSlugValues = data.slug_values;
                this.fetchRuleData();
                this.formData.transactional_components = data.transactional_components;
                
            })
            .catch((err) => { 
                this.$snackbar.global.showError('Failed to load '+ val);
            });

    },
    filterByCompany(){
        this.fetchRuleData();
        this.fetchBrands();
        this.fetchAffiliate();
        this.companySelected = true;
    },
    showLocationValue(){
        for (const key in this.locationStatus) {
            this.locationStatus[key] = false;
        }
        this.formData.slug_values.location_type.forEach((item) => {
            this.locationStatus[item] = true;
            
        });

    },
    filterByChannel(){
        this.fetchRuleData();

        for(let i = 0; i <=this.formData.slug_values.channel.length; i++){
            if((this.formData.slug_values.channel[i] == 'fynd') || (this.formData.slug_values.channel[i] == 'uniket')){
                this.tpExists = true;
                break;
            }
            else{
                this.tpExists = false
            }
        }

    },
    searchCompany(e) {
        debounce((text) => {
            this.fetchCompany(text);
        }, 1000)(e.text);
    },
    fetchCompany(query='') {
        let params = {
                search: query
        };
        return FinanceService.getCompanyList(params)
            .then((res) => {
                this.filterLists.company = res.data.company_list;
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load companies');
            })
            .finally(() => {
                if(this.formData.slug_values.company){
                    console.log("In fetch company");
                    console.log(this.formData.slug_values.company);
                    this.fetchBrands();
                    this.fetchAffiliate();
                }
                
            })
    },
    searchBrand(e) {
        debounce((text) => {
            this.fetchBrands(text);
        }, 1000)(e.text);
    },
    fetchBrands(query='') {
        console.log(this.formData);
        return FinanceService.getBrandList(this.formData.slug_values.company,query)
            .then((res) => {
                this.filterLists.brand = res.data.brand_list;
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load Brands');
            });
    },
    fetchAffiliate() {
        var companyId = this.formData.slug_values['company'];
        let params = {
            data:{
                "company_id" : companyId
            }
        };
        const caller = FinanceService.getAffiliateFin(params);
        caller
            .then((res) => {
                this.filterLists.affiliate = res.data.data.docs.map((item) => {
                        return {
                            text: item.name,
                            value: item.id,
                            id: item.id
                        };
                    })
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to load '+ err);
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
        let params = {
            data: {
                "table_name":"settlement_rule",
                "channels":this.formData.slug_values.channel
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
    createPayload(compData) {


        console.log("compdata");
        console.log(compData);

        if(!this.formData.settlement_type){
            this.validationFailed = true;
        }
        else{
            this.validationFailed = false;
            this.generatePayload(compData);
        }

    },
    generatePayload(compData){
        let data = compData.form;
        let type = compData.compType;
        if(type === 'edit'){
            this.payload = this.formData;
            this.payload.slug_values = this.editSlugValues;
            let slugFields = Object.keys(this.payload.slug_values);
            this.payload.slug_fields = slugFields;
        }
        else{
            var companyId = this.formData.slug_values['company'];
            this.formData.slug_values['company'] = [companyId]
            this.payload = this.formData;
            this.populateSlugs();
        }
        

        this.payload.rule_start_date = moment(this.ruleDaterange[0]).format('DD-MM-YYYY');
        this.payload.rule_end_date = moment(this.ruleDaterange[1]).format('DD-MM-YYYY');

        let temp_tp = this.formData.transactional_components.is_tp;

        this.payload.transactional_components = data.transactional_components;
        this.payload.transactional_components.is_tp = temp_tp;

        this.actionOnRule(type);

    },
    populateSlugs(){
        let slugValues = this.payload.slug_values; 
        let slugFieldData = [];

        for(let val in slugValues){
            if(slugValues[val].length <= 0){
                delete this.payload.slug_values[val]
            }
            else{
                slugFieldData.push(val);
            }
        }
        this.payload.slug_fields = slugFieldData;

        slugFieldData.forEach((item) => {
            this.populateData(item, this.payload.slug_values[item],this.filterLists[item]);
        });

    },
    populateData(item, array, list){
        let tempObj = array.map(item => list.find(obj => obj.value === item));
        this.payload.slug_values[item] = tempObj.map((item) => {
            let id = parseInt(item.value);
            id = (isNaN(id)) ? item.value : id;
            return {
                id: id,
                name: item.text
            };
        })
    },
    sendObj(val, arrItem) {
        return val.value === arrItem;
    },
    actionOnRule(type){
        if(type === 'edit'){
            this.editRuleData();
        }
        else{
            this.createRule();
        }
        this.$router.replace({
            name: 'settlement-rule',
        });

    },
    editRuleData(){
        let payload = this.payload;
        payload['id'] = this.curParams.ruleId;
        payload.type_of_request = 'edit_entity';
        let params = {
            data: payload
        };
        const caller = FinanceService.editRules(params);
        caller
            .then((res) => {
                this.$snackbar.global.showSuccess('Rule Updated Successfully');
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to save rule '+ err);
            });

    },
    createRule(){

        let params = {
            data: this.payload
        };
        const caller = FinanceService.generateRules(params);
        caller
            .then((res) => {
                this.$snackbar.global.showSuccess('Rule Saved Successfully');
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to save rule '+ err);
            });


    },
    getCompanyInfoObj() {
            let opts = {
                brands: this.formData.slug_values.brand,
                locations: this.formData.slug_values.location_type,
                company: this.formData.slug_values.company
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