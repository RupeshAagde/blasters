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
            <div class="list-wrap">
                    <div class="filters-wrap">
                        <div class="search-filter filter-item">
                            <nitrozen-input
                                id="searchbox"
                                ref="searchbox"
                                placeholder="Search Rule"
                                v-model="searchText"
                                label = "Search"
                                type="search"
                                :showSearchIcon="true"
                                @input="onFilterChange" 
                            />
                        </div>
                        <div class="company-filter filter-item">
                            <nitrozen-dropdown
                                id="company-name"
                                :items="companyNames"
                                v-model="selectedCompany"
                                label = "Company"
                                placeholder="Select Company"
                                :searchable="true"
                                :multiple="true"
                                @change="updateFilter"
                                @searchInputChange="searchCompany"
                            ></nitrozen-dropdown>
                        </div>
                        <div class="status-filter filter-item">
                            <nitrozen-dropdown
                                id="status-name"
                                :items="statusNames"
                                v-model="selectedStatus"
                                label = "Status"
                                placeholder="Select Status"
                                @change="updateFilter"
                            ></nitrozen-dropdown>
                        </div>
                </div>
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
                            <td class="rule_slug" @click="openVerifyRulePage(item.id)">{{ item.rule_slug }}</td>
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
                            <td>
                                <div class="brand-wrap">
                                    <div v-if="item.slug_values.brand">
                                        {{ item.slug_values.brand.name }}
                                    </div>
                                    <div v-else>
                                        NA
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="channel-wrap">
                                    <div v-if="item.slug_values.channel">
                                        {{ item.slug_values.channel.name }}
                                    </div>
                                    <div v-else>
                                        NA
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="date">{{ item.rule_start_date }} - {{ item.rule_end_date }}</div>
                            </td>
                            <td>
                                <div class="edit-btn" @click="editRule(item.id)">Edit</div>
                                <div class="delete-btn" @click="openDeletePopup(item.id)">Delete</div>
                            </td>
                        </tr>
                    </template>
                </table>
                <nitrozen-pagination
                    class="pagination-main"
                    v-model="paginationObj"
                    @change="onPaginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                />
            </div>
        </div>
        <div class="rule-main-wrap" v-else>
            <create-rule></create-rule>
        </div>
        <pop-up
            v-if="warningPopUp"
            :infoText="popupData.desc"
            :textHeading="popupData.heading"
            :cancel="popupData.cancel"
            :confirm="popupData.confirm"
            @cancel="cancelPopup"
            @confirm="confirmPopup"
            :type="popupData.type"
        />
       </div>
    </div>
</template>
<script>

import Jumbotron from '@/components/common/jumbotron';
import FinanceService from '@/services/finance.service.js';
import EditComponent from './create-rule/daytrader-component.vue';
import debounce from 'lodash/debounce';
import delPopup from './create-rule/popup.vue';
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenPagination,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
export default {
    name:'settlement-rule',
    components: {
      'jumbotron': Jumbotron,
      'nitrozen-button': NitrozenButton,
      'nitrozen-dropdown':  NitrozenDropdown,
      'edit-rule': EditComponent,
      'nitrozen-input' : NitrozenInput,
      'pop-up': delPopup,
      NitrozenPagination
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            openCreationPage:true,
            ruleDataList: [],
            searchText: '',
            companyNames: [],
            selectedCompany: [],
            statusNames: [
                {
                    text: "None",
                    value: "none"
                },
                {
                    text: "Unverified",
                    value: "unverified"
                },
                {
                    text: "Verified",
                    value: "verified"
                }

            ],
            selectedStatus: 'unverified',
            searchObj: {},
            filtersValues:{},
            paginationObj: {
                total: 0,
                current: 1,
                limit: 10,
            },
            editRuleData:{},
            warningPopUp: false,
            popupData:{
                heading:"Are you sure you want to delete this rule?",
                desc:'',
                confirm:"Continue",
                cancel:"Cancel",
                type:"warning"
            },
            tempForm: {},
            verifyRuleData: {}
        }
    },
    mounted(){
        this.fetchRulesList();
        this.fetchCompany();
    },
    methods: {
        openCreateRulePage(){
            // this.openCreationPage = false;
            this.$router.push({ name: 'create-rule' });
            // this.$router.push({ name: 'create-rule', params: { type:"edit" }});
        },
        onPaginationChange(event) {
            this.paginationObj = event
            this.fetchRulesList();
        },
        fetchRulesList() {
        if(this.selectedCompany.length > 0){
            this.selectedCompany = this.selectedCompany.map((item) => parseInt(item))

            this.filtersValues = {
                "company" : this.selectedCompany,
                "status": this.selectedStatus
            }
        }
        else{
            this.filtersValues = {
                "status": this.selectedStatus,
            }
        }   
        let params = {
            data : {
                "table_name": "settlement_rule",
                "filters": this.filtersValues,
                "search": this.searchObj,
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
                page:this.paginationObj.current,
                pageSize:this.paginationObj.limit,
                "order_by": "created_at DESC"
            }

        }
        const caller = FinanceService.getRulesList(params);
        caller
            .then((res) => {
                this.ruleDataList = res.data.items;
                this.paginationObj.total = res.data.page.item_count;
                
            })
            .catch((err) => { 
                this.$snackbar.global.showError('Failed to load '+ val);
            });

        },
        editRule(id){
            this.$router.push({ name: 'create-rule', params: { ruleId:id, preview:"edit" }});
        },
        fetchCompany(query='') {
            let params = {
                    search: query
            };
            return FinanceService.getCompanyList(params)
                .then((res) => {
                    this.companyNames = res.data.company_list;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to load companies');
                })
        },
        updateFilter(){
            console.log()
            if(this.selectedStatus == "verified"){

            }
            this.fetchRulesList();
        },
        searchCompany(e) {
            debounce((text) => {
                this.fetchCompany(text);
            }, 1000)(e.text);
        },
        onFilterChange: debounce(function(input) {
            if(this.searchText != ''){
                this.searchObj = {
                    rule_slug: this.searchText
                }
            }
            else{
                this.searchObj = {}
            }
            this.fetchRulesList();
            
        }, 500),

        openDeletePopup(id) {
            this.id = id
            this.warningPopUp = true;
            this.popupHeading = `Are you sure you want to delete this rule?`;
        },
        cancelPopup(){
            this.warningPopUp = false;
        },
        confirmPopup() {
            let params = {
            data : {
                "id": this.id,
                "type_of_request": "delete_entity"
            }
        }
        const caller = FinanceService.deleteRule(params);
        caller
            .then((res) => {
                this.$snackbar.global.showSuccess('Rule Deleted Successfully');
                this.warningPopUp = false;
                this.fetchRulesList();
            })
            .catch((err) => {
                this.$snackbar.global.showError('Failed to delete rule '+ err);
            });
        },
        openVerifyRulePage(id){
            this.$router.push({ name: 'create-rule', params: { ruleId:id, preview:"verify" }});
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

.list-wrap{
    box-sizing: border-box;
    padding: 24px;
}

.mirage-table {
    width: 100%;
    margin-bottom: 24px;
    font-size: 14px;
    overflow-x: auto;

    tr:first-child {
        border: 1px solid #E0E0E0;
        background: #f8f8f8;
        color: #000;
    }
    tr:not(:first-child) {
        border-bottom: 1px solid #e4e5e6;
        background: #fff;
    }
    td {
        text-align: center;
        padding: 16px 6px;
        vertical-align: middle;
        white-space: nowrap;
        max-width:100%;
    }
}

.filters-wrap{
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px 30px;
    box-sizing: border-box;

    .filter-item{
        width: 33.33%;
        max-width: 33.33%;
        padding: 0 10px;
        box-sizing: border-box;

    }
    
}

.edit-btn{
    cursor: pointer;
    font-weight: bold;
 }

.delete-btn{
    cursor: pointer;
    font-weight: bold;
 }

.rule_slug {
    cursor: pointer;
    font-weight: bolder;
    color: #5c6bdd;
    margin: 0;
    font-family: Poppins;
    letter-spacing: .05em;
}

</style>