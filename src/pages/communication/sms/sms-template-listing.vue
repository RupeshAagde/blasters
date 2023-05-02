<template>
    <div class="sms-templates-container">
        <!-- <loader v-if="pageLoading" class="loading"></loader> -->
        <div
            class="search-box"
            v-if="
                pageLoading ||
                    (searchText !== '' ||
                        selectedFilter !== 'all' ||
                        smsTemplates.length != 0)
            "
        >
            <div
                v-if="pageLoading && isInitialLoad"
                class="input-shimmer shimmer"
            ></div>
            <template v-else>
                <nitrozen-input
                    class="search-input"
                    :showSearchIcon="true"
                    type="search"
                    placeholder="Search template by name or tags"
                    v-model="searchText"
                    @keyup.enter="searchTemplate()"
                    @input="debounceInput"
                ></nitrozen-input>

                <div class="filter">
                    <nitrozen-dropdown
                        :label="'Filter'"
                        class="filter-dropdown"
                        :items="filterList"
                        v-model="selectedFilter"
                    ></nitrozen-dropdown>
                </div>
            </template>
        </div>
        <adm-shimmer
            v-if="pageLoading"
            class="sms-shimmer"
            :count="5"
        ></adm-shimmer>
        <page-error
            v-else-if="!pageLoading && pageError"
            @tryAgain="fetchSmsTemplates"
        ></page-error>
        <ul
            class="sms-templates-lists-container"
            v-else-if="smsTemplates && smsTemplates.length > 0"
        >
            <li v-for="(smsTemplate, index) in smsTemplates" :key="index">
                <sms-template-listing-card
                    v-bind:sms-template="smsTemplate"
                    @editSmsTemplate="editSmsTemplate"
                    @deleteSmsTemplate="deleteSmsTemplate"
                    @previewSmsTemplate="previewSmsTemplate"
                ></sms-template-listing-card>
            </li>
        </ul>
        <ukt-not-found v-else :title="'No results found'"></ukt-not-found>
        <div
            v-if="pagination.total>0"
            class="pagination"
        >
            <nitrozen-pagination
                name="SMS templates"
                ref="sms-templates-pagination"
                v-model="pagination"
                @change="changePage"
                :pageSizeOptions="[5, 10, 20, 50]"
            >
            </nitrozen-pagination>
        </div>
    </div>
</template>
<style lang="less" scoped>
.sms-shimmer {
    width: 100%;
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.sms-templates-container {
    margin-top: 20px;
    .select-wrapper {
        margin-top: 5px;
        width: 50%;
    }
    .search-box {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 12px;
        @media @mobile {
            margin-top: 24px;
            height: initial;
            display: block;
        }
        .search-input {
            width: 400px;
            @media @mobile {
                width: 100%;
            }
        }
        .filter {
            display: flex;
        }
        .label {
            font-family: Inter;
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            width: 44px;
            margin: auto 0;
            font-weight: 500;
        }
        .filter-dropdown {
            width: 130px;
            @media @mobile {
                width: 100%;
                margin-top: 12px;
            }
        }
    }
    .generic-button-container {
        margin-top: 15px;
    }
    .sms-templates-lists-container {
        width: 100%;
    }
    .no-results {
        margin-top: 24px;
    }
    /deep/.pagination {
        margin-top: 40px;
        .pagination-container {
            .regular-xxs {
                font-size: 15px;
            }
            .items-select {
                font-size: 15px;
            }
        }
    }
}
</style>
<script>
//import adminCommsService from './../../../../services/admin/admin-comms.service';
import FormInput from '@/components/common/form-input.vue';
import smsTemplateListingCard from './sms-template-listing-card.vue';
import loader from '@/components/common/loader';
// import {
//     ADMIN_COMMS_FETCH_SMS_TEMPLATE,
//     ADMIN_COMMS_FETCH_SMS_TEMPLATES,
//     ADMIN_COMMS_FETCH_SYSTEM_SMS_TEMPLATES,
//     ADMIN_COMMS_SET_SMS_TEMPLATES,
//     ADMIN_COMMS_FETCH_SUBSCRIBED_SMS_TEMPLATES
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_SMS_TEMPLATES,
//     ADMIN_COMMS_GET_SYSTEM_SMS_TEMPLATES
// } from '../../../../store/admin/getters.type';
// import {
//     ADMIN_COMMS_SET_SMS_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_RESET_SMS_TEMPLATE
// } from '../../../../store/admin/mutation.type';
import CommunicationServices from '../../../services/pointblank.service';
import { mapGetters } from 'vuex';
import { debounce} from '@/helper/utils';
import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput
} from '@gofynd/nitrozen-vue';
import uktNotFound from '@/components/common/ukt-not-found.vue';
import Shimmer from '@/components/common/shimmer';
import pageerror from '@/components/common/page-error';


const PAGE_FILTERS = [
    {
        text: 'All',
        value: 'all'
    },
    {
        text: 'Subscribed',
        value: 'subscribed'
    }
];
export default {
    name: 'sms-template-listing',
    components: {
        loader,
        'adm-shimmer': Shimmer,
        'ukt-not-found': uktNotFound,
        'adm-form-input': FormInput,
        'sms-template-listing-card': smsTemplateListingCard,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'page-error': pageerror
    },
    data() {
        return {
            pagination: {
                limit: 10,
                current: 1,
                total: 0
            },
            selectedFilter: PAGE_FILTERS[0].value,
            filterList: PAGE_FILTERS,
            searchText: '',
            smsTemplates: [],
            htmlTemplateOptions: [],
            selectedSmsTemplate: '',
            selectedSmsTemplateData: '',
            editUrlPath: '',
            pageLoading: false,
            isInitialLoad: true,
            pageError: false,
            smsTemplatesStore: {}
        };
    },
    watch: {
        selectedFilter: function() {
            this.$router.replace({
                name: 'smstemplateMain',
                query: {
                    ...this.$route.query,
                    selectedFilter: this.selectedFilter
                }
            }).catch(() => {});
            this.resetPagination();
            this.getTemplatesBasedOnFilter();
        }
    },
    mounted() {
         this.resetPagination();
        if (this.$route.query.searchText) {
            this.searchText = this.$route.query.searchText;
            this.selectedFilter = this.$route.query.selectedFilter
                ? this.$route.query.selectedFilter
                : 'all';
        }

        if (this.$route.query.limit && this.$route.query.current) {
            this.pagination.limit = this.$route.query.limit;
            this.pagination.current = this.$route.query.current;
            this.updatePaginationOnUi()
        }
         this.getTemplatesBasedOnFilter();
    },
    computed: {
       
    },
    methods: {
        getUrlFilters() {
            return {
                selectedFilter: this.selectedFilter,
                searchText: this.searchText,
                limit: this.limit,
                total: this.total,
                current: this.current
            };
        },
        updatePaginationOnUi(){
            if (this.$refs['sms-templates-pagination']) {
                this.$refs[
                    'sms-templates-pagination'
                ].selectedPageSize = this.pagination.limit;
            }
        },
        resetPagination() {
            this.pagination = {
                limit: 10,
                current: 1,
                total: 0
            };
        },
        getTemplatesBasedOnFilter() {
            if (this.selectedFilter == 'all') {
                this.fetchSmsTemplates().then(() => {
                    this.setPagination();
                    this.mapSMSTemplates();
                    return this.smsTemplates;
                });
            } 
            else if (this.selectedFilter == 'subscribed') {
                this.fetchSubscribedSmsTemplates().then(() => {
                    this.setPagination();
                    this.mapSMSTemplates()
                    return this.smsTemplates;
                });
            }
        },
        mapSMSTemplates() {
            if(this.smsTemplatesStore.items){
                this.smsTemplates = this.smsTemplatesStore.items.map(it => {
                it.display = it.name;
                it.value = it._id;
                it.data = it;
                return it;
            });
            }
            if(this.smsTemplatesStore.docs){
                this.smsTemplates = this.smsTemplatesStore.docs.map(it => {
                it.display = it.name;
                it.value = it._id;
                it.data = it;
                return it;
            });
            }

            
            
        },
        setPagination() {
            if(this.smsTemplatesStore.items){
                this.pagination = {
                    limit:  this.smsTemplatesStore.page.size,
                    total: this.smsTemplatesStore.page.item_total,
                    current: this.smsTemplatesStore.page.current 
                };
            }
            if(this.smsTemplatesStore.docs){
                this.pagination = {
                    limit:  this.smsTemplatesStore.limit,
                    total: this.smsTemplatesStore.total,
                    current: this.smsTemplatesStore.page
                };
            }
            this.updatePaginationOnUi()
            this.$router.replace({
                name: 'smstemplateMain',
                query: {
                    ...this.$route.query,
                    limit: this.pagination.limit,
                    current: this.pagination.current,
                    selectedFilter: this.selectedFilter
                }
            }).catch(() => {});
        },
        searchTemplate() {
            this.$router.push({
                name: 'smstemplateMain',
                query: { ...this.$route.query, searchText: this.searchText }
            }).catch(() => {});
            //this.resetPagination();
            this.getTemplatesBasedOnFilter();
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.searchTemplate();
            }
        }, 200),
        changePage(e) {
            this.pagination = {
                limit: e.limit,
                total: e.total,
                current: e.current
            };
            this.getTemplatesBasedOnFilter();
        },
        fetchSubscribedSmsTemplates() {
            let paginate = this.pagination;
            this.pageLoading = true;
           return CommunicationServices.getSubscribedSmsTemplates(
            {
                        page_size: this.pagination.limit,
                        page_no: this.pagination.current,
                        limit:this.pagination.limit,
                        page:this.pagination.current,
                        ...(this.searchText
                            ? {
                                  query: JSON.stringify({
                                      searchText: this.searchText
                                  })
                              }
                            : {})
                    })
                .then(data => {
                    this.smsTemplatesStore = data.data
                    this.pageLoading = false;
                    return this.smsTemplatesStore ;
                })
                .catch(err => {
                    this.pageLoading = false;
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        fetchSmsTemplates() {
            let paginate = this.pagination;
            this.pageLoading = true;
                return CommunicationServices.getSmsTemplates({
                        page_size:  this.pagination.limit,
                        page_no: this.pagination.current,
                        sort: JSON.stringify({ created_at: -1 }),
                        ...(this.searchText
                            ? {
                                  query: JSON.stringify({
                                      $or: [
                                          {
                                              name: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          },
                                          {
                                              tags: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          }
                                      ]
                                  })
                              }
                            : {})
                    })
                .then(data => {
                    this.smsTemplatesStore = data.data
                    this.pageLoading = false;
                    this.pageError = false;
                    //return data;
                })
                .catch(err => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        updateSelection(event) {
            //change selection page
            // this.selectedSmsTemplate = event.target.value;
            // this.selectedSmsTemplateData = this.$store.state.admin.communication.smsTemplates.items.find(
            //     doc => {
            //         return doc._id == event.target.value;
            //     }
            // );
        },
        editSmsTemplate(item) {
            // this.$store
            //     .dispatch(ADMIN_COMMS_FETCH_SMS_TEMPLATE, item.id)
            //     .then(() => {
            //CommunicationServices.getSmsTemplatebyId(item._id).then(()=>{
                this.$router.push({path:`templates/edit/${item._id}`})
            //})    
            //         this.$router.push(
            //             `${getRoute(this.$route)}/sms/templates/edit/${
            //                 item._id
            //             }`
            //         );
            //     });
            //this.$router.push({path:`templates/edit/${item._id}`});
        },
        previewSmsTemplate(item) {
             this.$router.push({path:`administrator/communication/sms/templates/edit/${item._id}`});
        },
        deleteSmsTemplate(item) {
            adminCommsService
                .deleteSmsTemplateById(item._id)
                .then(response => {
                    return this.fetchSmsTemplates();
                })
                .catch(err => {
                    console.log('Error', err);
                });
        }
    }
};
</script>
