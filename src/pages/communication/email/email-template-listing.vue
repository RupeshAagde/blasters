<template>
    <div class="email-templates-container">
        <!-- <loader v-if="pageLoading" class="loading"></loader> -->
        <div
            class="search-box"
            v-if="
                pageLoading ||
                    (searchText !== '' ||
                        selectedFilter !== 'all' ||
                        (emailTemplates && emailTemplates.length != 0))
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
            v-if="pageLoading && !pageError"
            class="email-shimmer"
            :count="5"
        ></adm-shimmer>
        <page-error
            v-else-if="!pageLoading && pageError"
            @tryAgain="getTemplatesBasedOnFilter"
        ></page-error>
        <ul
            class="email-templates-lists-container"
            v-else-if="emailTemplates && emailTemplates.length != 0"
        >
            <li v-for="(emailTemplate, index) in emailTemplates" :key="index">
                <email-template-listing-card
                    v-bind:email-template="emailTemplate"
                    @editEmailTemplate="editEmailTemplate"
                    @deleteEmailTemplate="deleteEmailTemplate"
                    @previewEmailTemplate="previewEmailTemplate"
                ></email-template-listing-card>
            </li>
        </ul>
        <ukt-not-found v-else :title="'No results found'"></ukt-not-found>
        <div class="pagination">
            <nitrozen-pagination
                name="Email templates"
                ref="email-templates-pagination"
                v-model="pagination"
                @change="changePage"
                :pageSizeOptions="[5, 10, 20, 50]"
            >
            </nitrozen-pagination>
        </div>
    </div>
</template>
<style lang="less" scoped>
.email-shimmer {
    width: 100%;
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.email-templates-container {
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
        margin-top: 48px;
        @media @mobile {
            display: block;
            height: initial;
            margin-top: 24px;
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
    .email-templates-lists-container {
        width: 100%;
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
import admforminput from '@/components/common/form-input.vue';
import emailTemplateListingCard from './email-template-listing-card.vue';
import loader from '@/components/common/loader';
// import {
//     ADMIN_COMMS_UPDATE_EMAIL_TEMPLATE_TO_EDIT,
//     ADMIN_COMMS_FETCH_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_SYSTEM_EMAIL_TEMPLATES,
//     ADMIN_COMMS_FETCH_SUBSCRIBED_EMAIL_TEMPLATES
// } from '../../../../store/admin/action.type';
// import {
//     ADMIN_COMMS_GET_EMAIL_TEMPLATES,
//     ADMIN_COMMS_GET_SYSTEM_EMAIL_TEMPLATES
// } from '../../../../store/admin/getters.type';
// // import { ADMIN_COMMS_SET_EMAIL_TEMPLATES } from '../../../../store/admin/mutation.type';
import { mapGetters } from 'vuex';
// // import * as _ from 'lodash';
// import {
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE,
//     ADMIN_COMMS_SET_EMAIL_TEMPLATE
// } from '../../../../store/admin/mutation.type';
import { debounce } from '@/helper/utils';
import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput
} from '@gofynd/nitrozen-vue';
import uktNotFound from '@/components/common/ukt-not-found.vue';
import Shimmer from '@/components/common/shimmer';
import pageerror from '@/components/common/page-error.vue';
import CommunicationServices from '../../../services/pointblank.service';
import { getRoute } from '@/helper/get-route';

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
    name: 'email-template-listing',
    components: {
        loader,
        'adm-shimmer': Shimmer,
        'adm-form-input': admforminput,
        'email-template-listing-card': emailTemplateListingCard,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'ukt-not-found': uktNotFound,
        'page-error': pageerror
    },
    watch: {
        selectedFilter: function() {
            this.$router.replace({
                name: 'emailtemplateMain',
                query: {
                    ...this.$route.query,
                    selectedFilter: this.selectedFilter
                }
            }).catch(() => {});
            this.resetPagination();
            this.getTemplatesBasedOnFilter();
        }
    },
    data() {
        return {
            pagination: {
                limit: 10,
                current: 1,
                total: 0
            },
            emailTemplates: [],
            selectedFilter: PAGE_FILTERS[0].value,
            filterList: PAGE_FILTERS,
            searchText: '',
            htmlTemplateOptions: [],
            selectedEmailTemplate: '',
            selectedEmailTemplateData: '',
            emailTemplatesStore: {},
            editUrlPath: '',
            pageLoading: true,
            isInitialLoad: true,
            pageError: false,
            smsTemplatesStore: {},
        };
    },
    mounted() {
        // this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE, {});
        // this.$store.commit(ADMIN_COMMS_SET_EMAIL_TEMPLATE_TO_CLONE, {});
        // this.resetPagination();
        // if (this.$route.query.searchText) {
        //     this.searchText = this.$route.query.searchText;
        //     this.selectedFilter = this.$route.query.selectedFilter
        //         ? this.$route.query.selectedFilter
        //         : 'all';
        // }

        // if (this.$route.query.limit && this.$route.query.current) {
        //     this.pagination.limit = this.$route.query.limit;
        //     this.pagination.current = this.$route.query.current;
        //     if (this.$refs['email-templates-pagination']) {
        //         this.$refs[
        //             'email-templates-pagination'
        //         ].selectedPageSize = this.pagination.limit;
        //     }
        // }
        this.getTemplatesBasedOnFilter();
    },
    computed: {
    },
    methods: {
        resetPagination() {
            this.pagination = {
                limit: 10,
                current: 1,
                total: 0
            };
        },
        getTemplatesBasedOnFilter() {
            if (this.selectedFilter == 'all') {
                this.fetchEmailTemplates().then(() => {
                    this.setPagination();
                    this.mapEmailTemplates();
                    return this.emailTemplates;
                });
            } 
            else if (this.selectedFilter == 'subscribed') {
                this.fetchSubscribedEmailTemplates().then(() => {
                    this.setPagination();
                    this.mapEmailTemplates();
                    return this.emailTemplates;
                });
            }
        },
        mapEmailTemplates() {
            if(this.emailTemplatesStore.items){
                this.emailTemplates = this.emailTemplatesStore.items.map(it => {
                it.display = it.name;
                it.value = it._id;
                it.data = it;
                return it;
            });
            }
            else if(this.emailTemplatesStore.docs){
                this.emailTemplates = this.emailTemplatesStore.docs.map(it => {
                it.display = it.name;
                it.value = it._id;
                it.data = it;
                return it;
            });
            }
        },
        setPagination() {
            this.selectedFilter == 'all' ? this.pagination = {
                 limit: this.emailTemplatesStore.page.size,
                 total: this.emailTemplatesStore.page.item_total,
                 current: this.emailTemplatesStore.page.current
            }
            :
            this.pagination = {
                limit: this.emailTemplatesStore.limit,
                total: this.emailTemplatesStore.total,
                current: this.emailTemplatesStore.page
            }
            // this.$router.replace({
            //     name: 'email-listing',
            //     query: {
            //         ...this.$route.query,
            //         limit: this.pagination.limit,
            //         current: this.pagination.current
            //     }
            // }).catch(() => {});
        },
        fetchSubscribedEmailTemplates() {
            let paginate = this.pagination;
            this.pageLoading = true;
            return CommunicationServices.getSubscribedEmailTemplates(
            {
                        page_size: this.pagination.limit,
                        page_no: this.pagination.current,
                        ...(this.searchText
                            ? {
                                  query: JSON.stringify({
                                      searchText: this.searchText
                                  })
                              }
                            : {})
                    })
                .then(data => {
                    this.emailTemplatesStore = data.data
                    this.pageLoading = false;
                    return this.emailTemplatesStore
                })
                .catch(err => {
                    this.pageLoading = false;
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        fetchEmailTemplates() {
            let paginate = this.pagination;
            this.pageLoading = true;
                return CommunicationServices.getEmailTemplates({
                    params: {
                        page_size: this.pagination.limit,
                        page_no: this.pagination.current,
                        sort: JSON.stringify({ created_at: "-1" }),
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
                    }
                })
                .then(data => {
                    this.emailTemplatesStore = data.data
                    this.pageLoading = false;
                    this.pageError = false;
                    //return data;
                })
                .catch(err => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
            //this.pageLoading = true;
            // return this.$store
            //     .dispatch(ADMIN_COMMS_FETCH_EMAIL_TEMPLATES, {
            //         params: {
            //             page_size: this.pagination.limit,
            //             page_no: this.pagination.current,
            //             sort: JSON.stringify({ created_at: -1 }),
            //             ...(this.searchText
            //                 ? {
            //                       query: JSON.stringify({
            //                           $or: [
            //                               {
            //                                   name: {
            //                                       $regex: this.searchText,
            //                                       $options: 'ig'
            //                                   }
            //                               },
            //                               {
            //                                   tags: {
            //                                       $regex: this.searchText,
            //                                       $options: 'ig'
            //                                   }
            //                               }
            //                           ]
            //                       })
            //                   }
            //                 : {})
            //         }
            //     })
            //     .then(data => {
            //         this.pageLoading = false;
            //         this.pageError = false;
            //         return data;
            //     })
            //     .catch(err => {
            //         this.pageLoading = false;
            //         this.pageError = true;
            //     });
        },
        searchTemplate() {
            this.$router.replace({
                name: 'emailtemplateMain',
                query: { ...this.$route.query, searchText: this.searchText }
            }).catch(() => {});
            this.resetPagination();
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
        editEmailTemplate(item) {
            this.$router.push({path:`templates/edit/${item._id}`})
        },
        previewEmailTemplate(item) {
            // this.$router.push({path:`/admin/email/templates/edit/${item._id}`,data:{route:"variables"}});
            if (item.published) {
                this.$router.push({
                    name: 'preview-email-template',
                    params: {
                        id: item._id,
                        emailTemplate: item
                    }
                });
            }
        },
        deleteEmailTemplate(item) {
            // adminCommsService
            //     .deleteEmailTemplateById(item._id)
            //     .then(response => {
            //         return this.fetchEmailTemplates();
            //     })
            //     .catch(err => {
            //         console.log('Error', err);
            //     });
        }
    }
};
</script>
