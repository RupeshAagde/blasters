<template>
    <div class="panel">
        <div class="page-container">
            <div class="logs-container">
                <jumbotron
                    :title="'Audit Trail'"
                    :desc="'Get a chronological overview of activities performed by the users of Fynd Platform. View all the actions such as creation, updation, and deletion carried out in the Platform Panel. Moreover, you can track the timelines of modifications made within the company, brand, store, sales channels, payment and subscription details.'"
                    class="jumbotron-h"
                ></jumbotron>
                <div class="main-container">
                    <div>
                        <div class="block width-100">
                            <div class="flex flex-start width-100 options-row">
                                <div class="flex-1 date-container m-r-24">
                                    <div class="nitrozen-label">Start date</div>
                                    <date-picker
                                    id="start-date"
                                    v-on:input="
                                            (e) => dateChanged(e, 'sdate')
                                        "
                                        :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                        :picker_type="'datetime'"
                                        v-model="filters.start.value"
                                        :not_before="new Date(0).toISOString()"
                                        :placeholder="'Start date'"
                                    />
                                </div>
                                <div class="flex-1 inner-container">
                                    <div class="nitrozen-label">End date</div>
                                    <date-picker
                                    id="end-date"
                                        :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                        v-on:input="
                                            (e) => dateChanged(e, 'edate')
                                        "
                                        :picker_type="'datetime'"
                                        v-model="filters.end.value"
                                        :not_before="new Date(0).toISOString()"
                                        :placeholder="'End date'"
                                    />
                                </div>
                                <div class="flex-1 m-l-24">
                                    <nitrozen-input
                                    id="email-phone"
                                        label="Email or phone"
                                        class="search-input"
                                        :showSearchIcon="true"
                                        type="search"
                                        placeholder="Email or phone"
                                        
                                        
                                    ></nitrozen-input>
                                    <!-- <nitrozen-error
                                        v-if="filters.emailOrPhone.showerror"
                                    >
                                        {{ filters.emailOrPhone.errortext }}
                                    </nitrozen-error> -->
                                </div>
                            </div>
                            <div class="flex flex-start width-100 options-row">
                                <div class="flex-1">
                                    <nitrozen-dropdown
                                    id="sales-channel"
                                        label="Sales channel"
                                        :searchable="true"
                                        
                                        :items="salesChannelsFiltered"
                                        
                                        placeholder="Sales channel"
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="flex-1 m-l-24">
                                    <nitrozen-dropdown
                                    id="entity-types"
                                        label="Entity types"
                                        :searchable="true"
                                        v-model="filters.entityType"
                                        :items="entityTypes"
                                        @change="entityTypeSelect"
                                        placeholder="Entity types"
                                    ></nitrozen-dropdown>
                                </div>
                               
                            </div>
                        </div>
                    </div>

                    <shimmer v-if="pageLoading" :count="4"></shimmer>
                    <div v-else-if="logs && logs.length > 0">
                        <div :key="index" v-for="(log, index) in logs">
                            <logs-listing-card
                                :log="log"
                                @openLog="onLogCardClicked(log)"
                            ></logs-listing-card>
                        </div>
                    </div>
                    <adm-no-content
                        v-else
                        :helperText="'No results found'"
                    ></adm-no-content>
                    <div
                        class="pagination"
                        v-if="!pageLoading && logs && logs.length"
                    >
                        <nitrozen-pagination
                            name="Logs"
                            mode="cursor"
                          
                            v-model="pagination"
                            :pageSizeOptions="[5, 10, 20, 50]"
                        >
                        </nitrozen-pagination>
                    </div>
                </div>
              
            </div>
        </div>
    </div>
   
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';



import logsListingCard from './logs-listing-card.vue';
import DatePicker from '../../components/common/date-picker.vue';

//import { debounce } from '../../../helper/utils';
import { mapGetters } from 'vuex';
import Shimmer from '@/components/common/shimmer';
import AuditTrailServices from '../../services/pinpointer.service'

import PageEmpty from '@/components/common/page-empty.vue';

import {
    NitrozenPagination,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenError,
    NitrozenBadge,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'audit-logs',
    components: {
        'jumbotron': Jumbotron,
        'date-picker': DatePicker,
        'logs-listing-card': logsListingCard,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-no-content': PageEmpty,
        'shimmer': Shimmer,
    },
    //  watch: {
    //     $route() {
    //         this.mapQueryParams();
    //     },
    // },
    computed: {
     
    },
    data() {
        return {

            pagination: {
                limit: 10,
                nextPage: false,
                prevPage: false,
            },

            pageLoading: false,
            logs: [],
            showPreviewModal: false,
            salesChannels: [],
            salesChannelsFiltered: [],
            entityTypes: [{ text: 'Charge-Invoice', value: 'charge-invoice' },
            { text: 'Invoices-Bulk-Update', value: 'invoices-bulk-update' },
            { text: 'Offline-paid', value: 'offline-paid' },
            { text: 'Subscription', value: 'subscription' },
            
            ],
            previewData: {},
            filters: {
                salesChannel: this.getInitialValue(''),
                entityType: this.getInitialValue(''),
                entityId: this.getInitialValue(''),
                emailOrPhone: this.getInitialValue(''),
                start: this.getInitialValue(''),
                end: this.getInitialValue(''),
            },

            entityTypeDrillCases: ['Brand', 'Store'],
            selectedEntityData: {
                items: [],
                page: {},
                keyword: '',
            },
        };
    },
    mounted() {
        this.mapQueryParams()
    },
    methods: {
        getLogs(params = {}) {
            this.pageLoading = true;
            params.limit = params.limit + 1;
            return AuditTrailServices.getLogs(params)
                .then((res) => res.data)
                .then((data) => {
                    return data && data.docs && data.docs.length
                        ? data.docs
                        : [];
                })
                .catch(console.log)
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        onLogCardClicked(val) {
            this.$router
                .push(
                    `audit-trail/logs/${
                        val._id
                    }`
                )
                .catch(() => {});
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                text: '',
                errortext: '',
            };
        },
         dateChanged(e, type) {
            if (this.filters.start.value && this.filters.end.value) {
                if (
                    new Date(this.filters.start.value) >
                    new Date(this.filters.end.value)
                ) {
                    if (type == 'sdate') {
                        this.filters.start.value = '';
                        this.$snackbar.global.showWarning(
                            `Start Date should be less than End Date`
                        );
                    } else {
                        this.filters.end.value = '';
                        this.$snackbar.global.showWarning(
                            `End Date should be greater than Start Date`
                        );
                    }
                    return;
                }
            }
            this.updateQueryParams({ [type]: e });
        },
        updateQueryParams(queryObj, resetPage = true) {
            let query = { ...this.$route.query };
            if (resetPage) {
                query.nxt = undefined;
                query.prev = undefined;
            }
            for (let type of Object.keys(queryObj)) {
                query[type] = queryObj[type] ? queryObj[type] : undefined;
            }
            console.log(query);
            this.setUrlQueryParams(query);
        },
         setUrlQueryParams(query) {
            this.$router
                .push({ name: 'audit-trail', query: query })
                .catch((rr) => {
                    console.log('ERROR', rr);
                });
                this.mapQueryParams()

        },
         mapQueryParams() {
            let query = { ...this.$route.query };
            let db_query = {};
            let direction = null;

            if (query.enttyp) {
                this.filters.entityType = query.enttyp;
                db_query['entity.type'] = query.enttyp;
                // const type = this.entityTypes.filter(
                //     (e) => e.value == query.enttyp
                // );
                // if (type.length) {
                //     this.filters.entityType.text = type[0].text;
                // }

                // this.handleEntityDataFetch();
            }

            if (query.entid) {
                this.filters.entityId.value = Number(query.entid);
                db_query['entity.id'] = query.entid;
            }

            if (query.appid) {
                this.filters.salesChannel.value = query.appid;
                db_query['application'] = query.appid;
            }

            if (query.usrid && query.usrval) {
                this.filters.emailOrPhone.id = query.usrid;
                this.filters.emailOrPhone.value = query.usrval;
                db_query['modifier.user_id'] = query.usrid;
            }

            if (query.sdate) {
                this.filters.start.value = query.sdate;
                db_query.date = db_query.date || {};
                db_query.date['$gte'] = query.sdate;
            }

            if (query.edate) {
                this.filters.end.value = query.edate;
                db_query.date = db_query.date || {};
                db_query.date['$lte'] = query.edate;
            }

            if (query.nxt) {
                db_query._id = { $lt: query.nxt };
                direction = 'forward';
            }

            if (query.prev) {
                db_query._id = { $gt: query.prev };
                direction = 'backward';
                query.sort = JSON.stringify({ _id: 1 });
            }

            query.limit =
                query.limit && !isNaN(query.limit) ? Number(query.limit) : 10;

            let _params = {
                qs: JSON.stringify(db_query),
                limit: query.limit,
                sort: query.sort || JSON.stringify({ _id: -1 }),
            };
            const org_limit = _params.limit;
            this.getLogs(_params).then((logs) => {
                const lastLog = logs.splice(org_limit, 1);
                const hasLast = lastLog.length ? true : false;

                if (direction == 'forward') {
                    this.pagination.nextPage = hasLast ? true : false;
                    this.pagination.prevPage = true;
                    this.logs = logs;
                } else if (direction == 'backward') {
                    logs = logs.reverse();
                    this.pagination.nextPage = true;
                    this.pagination.prevPage = hasLast ? true : false;
                    let new_logs = [...logs, ...this.logs];
                    if (new_logs.length > org_limit) {
                        new_logs.length = org_limit;
                    }
                    this.logs = new_logs;
                } else {
                    this.pagination.nextPage = hasLast ? true : false;
                    this.pagination.prevPage = false;
                    this.logs = logs;
                }
                
            });
        },
         entityTypeSelect(value) {
             console.log(value);
            this.updateQueryParams({ enttyp: value, entid: null });
        }
    }
    // methods: {
    //     getInitialValue(val = '') {
    //         return {
    //             showerror: false,
    //             value: val,
    //             text: '',
    //             errortext: '',
    //         };
    //     },
    //     setUrlQueryParams(query) {
    //         this.$router
    //             .push({ name: 'audit-trail', query: query })
    //             .catch((rr) => {
    //                 console.log('ERROR', rr);
    //             });
    //     },
    //     updateQueryParams(queryObj, resetPage = true) {
    //         let query = { ...this.$route.query };
    //         if (resetPage) {
    //             query.nxt = undefined;
    //             query.prev = undefined;
    //         }
    //         for (let type of Object.keys(queryObj)) {
    //             query[type] = queryObj[type] ? queryObj[type] : undefined;
    //         }
    //         this.setUrlQueryParams(query);
    //     },
    //     mapQueryParams() {
    //         let query = { ...this.$route.query };
    //         let db_query = {};
    //         let direction = null;

    //         if (query.enttyp) {
    //             this.filters.entityType.value = query.enttyp;
    //             db_query['entity.type'] = query.enttyp;
    //             const type = this.entityTypes.filter(
    //                 (e) => e.value == query.enttyp
    //             );
    //             if (type.length) {
    //                 this.filters.entityType.text = type[0].text;
    //             }

    //             this.handleEntityDataFetch();
    //         }

    //         if (query.entid) {
    //             this.filters.entityId.value = Number(query.entid);
    //             db_query['entity.id'] = query.entid;
    //         }

    //         if (query.appid) {
    //             this.filters.salesChannel.value = query.appid;
    //             db_query['application'] = query.appid;
    //         }

    //         if (query.usrid && query.usrval) {
    //             this.filters.emailOrPhone.id = query.usrid;
    //             this.filters.emailOrPhone.value = query.usrval;
    //             db_query['modifier.user_id'] = query.usrid;
    //         }

    //         if (query.sdate) {
    //             this.filters.start.value = query.sdate;
    //             db_query.date = db_query.date || {};
    //             db_query.date['$gte'] = query.sdate;
    //         }

    //         if (query.edate) {
    //             this.filters.end.value = query.edate;
    //             db_query.date = db_query.date || {};
    //             db_query.date['$lte'] = query.edate;
    //         }

    //         if (query.nxt) {
    //             db_query._id = { $lt: query.nxt };
    //             direction = 'forward';
    //         }

    //         if (query.prev) {
    //             db_query._id = { $gt: query.prev };
    //             direction = 'backward';
    //             query.sort = JSON.stringify({ _id: 1 });
    //         }

    //         query.limit =
    //             query.limit && !isNaN(query.limit) ? Number(query.limit) : 10;

    //         let _params = {
    //             qs: JSON.stringify(db_query),
    //             limit: query.limit,
    //             company: this.$route.params.company_id,
    //             sort: query.sort || JSON.stringify({ _id: -1 }),
    //         };
    //         const org_limit = _params.limit;
    //         this.getLogs(_params).then((logs) => {
    //             const lastLog = logs.splice(org_limit, 1);
    //             const hasLast = lastLog.length ? true : false;

    //             if (direction == 'forward') {
    //                 this.pagination.nextPage = hasLast ? true : false;
    //                 this.pagination.prevPage = true;
    //                 this.logs = logs;
    //             } else if (direction == 'backward') {
    //                 logs = logs.reverse();
    //                 this.pagination.nextPage = true;
    //                 this.pagination.prevPage = hasLast ? true : false;
    //                 let new_logs = [...logs, ...this.logs];
    //                 if (new_logs.length > org_limit) {
    //                     new_logs.length = org_limit;
    //                 }
    //                 this.logs = new_logs;
    //             } else {
    //                 this.pagination.nextPage = hasLast ? true : false;
    //                 this.pagination.prevPage = false;
    //                 this.logs = logs;
    //             }
    //         });
    //     },
    //     filterSalesChannel(e) {
    //         if (!e.text) {
    //             this.salesChannelsFiltered = Object.assign(
    //                 [],
    //                 this.salesChannels
    //             );
    //             this.updateQueryParams({ appid: null });
    //             return;
    //         }
    //         this.salesChannelsFiltered = this.salesChannels.filter(
    //             (channel) => channel.text.indexOf(e.text) > -1
    //         );
    //         return;
    //     },
    //     filterEntityTypes(e) {
    //         if (!e.text) {
    //             this.entityTypesFiltered = Object.assign([], this.entityTypes);
    //             this.updateQueryParams({ enttyp: null, entid: null });
    //             return;
    //         }
    //         this.entityTypesFiltered = this.entityTypes.filter(
    //             (entity) =>
    //                 entity.text.toLowerCase().indexOf(e.text.toLowerCase()) > -1
    //         );
    //         return;
    //     },
    //     changeUserInfo: debounce(function (e) {
    //         if (e) {
    //             this.getUserIdByEmailPhone();
    //         } else {
    //             this.updateQueryParams({ usrval: null, usrid: null });
    //         }
    //     }, 500),
    //     getUserIdByEmailPhone() {
    //         return new Promise((resolve, reject) => {
    //             this.filters.emailOrPhone.id = '';
    //             const param = this.filters.emailOrPhone.value;
    //             if (param) {
    //                 this.getUserFromEmailOrPhone(param)
    //                     .then((user) => {
    //                         if (user) {
    //                             this.filters.emailOrPhone.showerror = false;
    //                             this.filters.emailOrPhone.id = user._id;
    //                             this.updateQueryParams({
    //                                 usrid: user._id,
    //                                 usrval: param,
    //                             });
    //                             resolve(user._id);
    //                         } else {
    //                             this.filters.emailOrPhone.errortext =
    //                                 'User not found';
    //                             this.filters.emailOrPhone.showerror = true;
    //                             reject(null);
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         console.log('Error in getUserIdByEmailPhone', err);
    //                         reject(null);
    //                     });
    //             } else {
    //                 reject(null);
    //             }
    //         });
    //     },
    //     getUserFromEmailOrPhone(emailOrPhone) {
    //         return this.$store
    //             .dispatch(PLATFORM_SEARCH_USER, {
    //                 query: emailOrPhone,
    //             })
    //             .then((data) => {
    //                 if (data.users && data.users.length > 0) {
    //                     return data.users[0];
    //                 } else {
    //                     return null;
    //                 }
    //             });
    //     },
    //     onLogCardClicked(val) {
    //         this.$router
    //             .push(
    //                 `${getCompanyBasePath(this.$route)}/audit-trail/logs/${
    //                     val._id
    //                 }`
    //             )
    //             .catch(() => {});
    //     },
    //     dateChanged(e, type) {
    //         if (this.filters.start.value && this.filters.end.value) {
    //             if (
    //                 new Date(this.filters.start.value) >
    //                 new Date(this.filters.end.value)
    //             ) {
    //                 if (type == 'sdate') {
    //                     this.filters.start.value = '';
    //                     this.$snackbar.global.showWarning(
    //                         `Start Date should be less than End Date`
    //                     );
    //                 } else {
    //                     this.filters.end.value = '';
    //                     this.$snackbar.global.showWarning(
    //                         `End Date should be greater than Start Date`
    //                     );
    //                 }
    //                 return;
    //             }
    //         }
    //         this.updateQueryParams({ [type]: e });
    //     },
    //     changeSalesChannel(value) {
    //         this.updateQueryParams({ appid: value });
    //     },
    //     entityTypeSelect(value) {
    //         this.updateQueryParams({ enttyp: value, entid: null });
    //     },
    //     entityItemSelect(value) {
    //         this.updateQueryParams({ entid: value });
    //     },
    //     paginationClick(type) {
    //         if (type == 'next') {
    //             const index_id = this.logs[this.logs.length - 1]._id;
    //             this.updateQueryParams({ nxt: index_id, prev: null });
    //         } else if (type == 'prev') {
    //             const index_id = this.logs[0]._id;
    //             this.updateQueryParams({ nxt: null, prev: index_id });
    //         }
    //     },
    //     getLogs(params = {}) {
    //         this.pageLoading = true;
    //         params.limit = params.limit + 1;
    //         return AuditTrailService.getLogs(params)
    //             .then((res) => res.data)
    //             .then((data) => {
    //                 return data && data.docs && data.docs.length
    //                     ? data.docs
    //                     : [];
    //             })
    //             .catch(console.log)
    //             .finally(() => {
    //                 this.pageLoading = false;
    //             });
    //     },
    //     getStores(e = {}) {
    //         const params = {
    //             company: this.$route.params.company_id,
    //             page_no: e.page_no || 1,
    //             page_size: e.page_no || 50,
    //         };
    //         if (this.selectedEntityData.keyword) {
    //             params.q = this.selectedEntityData.keyword;
    //         }
    //         return AdminSellerService.fetchStores(params)
    //             .then(({ data }) => {
    //                 const _data = data;
    //                 if (params.page_no === 1) {
    //                     this.selectedEntityData.items = _data.items.map(
    //                         (e) => ({
    //                             text: `${e.name} (${e.code})`,
    //                             value: e.uid,
    //                             ...e,
    //                         })
    //                     );
    //                 } else {
    //                     this.selectedEntityData.items = [
    //                         ...this.selectedEntityData.items,
    //                         ..._data.items.map((e) => ({
    //                             text: `${e.name} (${e.code})`,
    //                             value: e.uid,
    //                             ...e,
    //                         })),
    //                     ];
    //                 }
    //                 this.selectedEntityData.page = _data.page;
    //             })
    //             .catch((err) => {
    //                 console.log(err, 'error');
    //             });
    //     },
    //     getBrands(e = {}) {
    //         const params = {
    //             page_no: e.page_no || 1,
    //             page_size: e.page_size || 500,
    //         };
    //         if (this.selectedEntityData.keyword) {
    //             // @TODO Check if q is added to API
    //             params.q = this.selectedEntityData.keyword;
    //         }
    //         return AdminSellerService.fetchBrands(params)
    //             .then(({ data }) => {
    //                 const _data = data;
    //                 if (params.page_no === 1) {
    //                     this.selectedEntityData.items = _data.items.map(
    //                         (e) => ({
    //                             text: `${e.brand.name}`,
    //                             value: e.brand.uid,
    //                             ...e,
    //                         })
    //                     );
    //                 } else {
    //                     this.selectedEntityData.items = [
    //                         ...this.selectedEntityData.items,
    //                         ..._data.items.map((e) => ({
    //                             text: `${e.brand.name}`,
    //                             value: e.brand.uid,
    //                             ...e,
    //                         })),
    //                     ];
    //                 }
    //                 this.selectedEntityData.page = _data.page;
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     },
    //     entityItemSearchChange: debounce(function (event) {
    //         if (!event.text) {
    //             this.updateQueryParams({ entid: null });
    //         } else {
    //             this.selectedEntityData.keyword = event.text;
    //             this.handleEntityDataFetch();
    //         }
    //     }, 200),
    //     entityItemsScroll(event) {
    //         if (
    //             this.selectedEntityData.page.has_next &&
    //             event.scrollHeight - event.scrollTop <= 200
    //         ) {
    //             let params = {
    //                 page_no: this.selectedEntityData.page.current + 1,
    //             };
    //             this.handleEntityDataFetch(params);
    //         }
    //     },
    //     handleEntityDataFetch(params) {
    //         const type =
    //             this.filters.entityType && this.filters.entityType.value
    //                 ? this.filters.entityType.value
    //                 : null;
    //         switch (type) {
    //             case 'Brand':
    //                 return this.getBrands(params);
    //             case 'Store':
    //                 return this.getStores(params);
    //             default:
    //                 return;
    //         }
    //     },
    //     showEntityItems() {
    //         return Boolean(
    //             this.filters.entityType &&
    //                 this.filters.entityType.value &&
    //                 this.entityTypeDrillCases.includes(
    //                     this.filters.entityType.value
    //                 ) &&
    //                 this.selectedEntityData.items
    //         );
    //     },
    // },
};
</script>

<style lang="less" scoped>
// @import '../less/page-ui.less';
// @import '../less/page-header.less';
// @import '../less/form.less';
/deep/.nitrozen-pagination__left {
    visibility: hidden;
}
.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.width-100 {
    width: 100%;
}
.flex {
    display: flex;
    .flex-1 {
        flex: 1;
    }
    .flex-2 {
        flex: 2;
    }
}
.flex-end {
    align-items: end;
}
.flex-center {
    align-items: center;
}

.m-b-24 {
    margin-bottom: 24px;
}
.m-r-24 {
    margin-right: 24px;
}
.m-l-24 {
    margin-left: 24px;
}
.vue-date-picker {
    display: flex;
    align-items: center;
    /deep/.mx-input {
        height: 40px;
        box-sizing: border-box;
    }
}
.json-container {
    margin: 24px;
}
.options-row {
    margin-bottom: 10px;
}
.page-container {
    margin: 24px;
    width: auto;
    .logs-container {
        width: 100%;
        .main-container {
            background-color: @White;
            display: block;
            margin: 24px 0px;
        }
    }
}
</style>
