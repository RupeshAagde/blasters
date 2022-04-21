<template>
    <div class="coupon-list-container">
        <div class="coupon-filters">
            <nitrozen-input
                id="search"
                :showSearchIcon="true"
                class="search"
                :placeholder="'Search by Code '"
                v-model="searchText"
                @input="debounceInput"
            />
            <div class="dropdown-filters">
                <nitrozen-dropdown
                    class="type-filter"
                    :label="'Type'"
                    v-model="query.type"
                    :items="typeSlugItems"
                    @change="setRouteQuery({type : query.type})"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="archived-filter"
                    :label="'Status'"
                    v-model="query.is_active"
                    :items="pageFilters"
                    @change="setRouteQuery({published: query.is_active})"
                ></nitrozen-dropdown>
            </div>
        </div>
        <shimmer v-if="loading" :count="4"></shimmer>
        <div v-if="couponList.length > 0">
        <div  v-for="coupon in couponList" :key="coupon._id" class="coupon-card-list">
            <div @click="onUpdate(coupon.type,coupon._id)" class="blaster-list-card-container coupon-card-container">
        <div class="card-content-section left-container">
            <div class="card-content-line-1">
                {{ coupon.display_meta.title }}
            </div>
            <div class="darker-xs card-content-line-2 coupon-code">
                {{ coupon.code.toUpperCase() }}
                <span id="copycode" @click.stop="onCopyCode($event,coupon.code)">
                    <inline-svg
                        title="Click to copy"
                        :src="'copy'"
                        class="copy-code"
                    ></inline-svg>
                </span>
            </div>
            <div class="card-content-line-3">
                {{
                    `Created on ${new Date(
                        coupon.created_at
                    ).toDateString()}`
                }}
            </div>
            <div class="card-content-line-3">
                {{
                    `Modified on ${new Date(
                        coupon.modified_at
                    ).toDateString()} by ${coupon.author.modified_by_details.first_name} ${coupon.author.modified_by_details.last_name}`
                }}
            </div>
        </div>
        <div class="card-badge-section right-container">
            <div class="states">
                <!-- <nitrozen-badge v-if="coupon.state.is_archived" state="success"
                    >Live</nitrozen-badge
                >
                <nitrozen-badge v-else>Not Live</nitrozen-badge> -->
                <nitrozen-badge v-if="coupon._schedule.published" state="success"
                    >Active</nitrozen-badge
                >
                <nitrozen-badge v-else>Inactive</nitrozen-badge>
            </div>
        </div>
    </div>
        </div>
        </div>
        <div v-else>
            <no-content :helperText="'No coupons found'"></no-content>
        </div>
        <nitrozen-pagination
            v-if="initial_data.length"
            name="coupons"
            v-model="pagination"
            @change="setPagination"
            :pageSizeOptions="perPageValues"
            id="pagination"

            
        ></nitrozen-pagination>
    </div>

</template>
<script>
import {
    debounce, copyToClipboard
} from '@/helper/utils';

import PageEmpty from '@/components/common/page-empty.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import {TYPE_DATA} from '@/helper/coupon-helper'
import BillingService from '@/services/billing.service.js'
import Shimmer from '@/components/common/shimmer';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
    NitrozenBadge,
    

} from '@gofynd/nitrozen-vue';
const PAGE_FILTERS = [
    {
        text: 'All',
        value: { key: 'all', value: '' },
    },
    {
        text: 'Active',
        value: { key: 'published', value: 'true' },
    },
    {
        text: 'Inactive',
        value: { key: 'published', value: 'false' },
    },
];
export default {
    name: 'coupon-listing' ,
    components: {
         'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-badge': NitrozenBadge,
        'inline-svg' : inlinesvg,
    'no-content': PageEmpty,
    Shimmer
    },
    data() {
        return {
            query_string: '',
            initial_data: [1],
            loading: false,
            show_schedule_modal: false,
            showSelectModal: false,
    
                query: {
                    code: '',
                    is_active: '',
                    type: ''
                },
                pagination: {
                    limit:  10,
                    current: 1,
                    total: 100
                }
            ,
            perPageValues: [1, 2, 5, 10, 25, 50, 100, 200],
            searchText: '',
            coupon: {
            },
            scopeItems: [{ text: 'All Product', value: 'all' }],
            typeSlugItems: [{ text: 'All', value: '' }, { text: 'X Percentage Value', value: 'percentage_off' },{ text: 'X Amount Value', value: 'amount_off' }],
            pageFilters: [...PAGE_FILTERS],
            couponList: []

        }
    },
    methods: {
        
        debounceInput: debounce(function(e) {
            if (e.length === 0) {
                this.setRouteQuery({ code: undefined });
            }
            this.setRouteQuery({code: e});
        }, 200),
        
        get_coupons_list(){
            this.loading= true;
             BillingService.getCouponList( Object.assign({
                    page_no: this.pagination.current,
                    page_size: this.pagination.limit,
                    "_schedule.published" : this.query.is_active.value,
                    type: this.query.type,
                    code: this.searchText,
                    sort : JSON.stringify({"created_at":-1})
                }))
        .then(res=>{
            this.coupon = res.data;
            this.pagination = {
                limit : res.data.page.size,
                total : res.data.page.item_total,
                current : res.data.page.current,
                
            }
            this.couponList = res.data.items;
            this.loading = false;
            })
        },
        onCopyCode(event,code) {
            copyToClipboard(code);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
            event.stopPropagation();
            event.preventDefault();
        },
        onUpdate(type,id){
             this.$router.push({
                        path: `/administrator/subscription/coupons/edit/${type}/${id}`
                        }).catch(()=>{})
        
        },
        setPagination(){
        const filter = { page : this.pagination.current, limit: this.pagination.limit }
        this.setRouteQuery(filter);
        },
        setRouteQuery(query) {
            if (query.code || query.published) {
                // clear pagination if search or filter applied
                this.pagination.current = 1;
                this.pagination = { ...this.pagination };
                query.page = this.pagination.current;
                query.limit = undefined;
                query.published = this.query.is_active.value;
            }
            if(query.type){
            this.pagination.current = 1;
            query.page = this.pagination.current;
            query.type = this.query.type
            }
                this.$router
                .push({
                    path: this.$route.path,
                    query: {
                        ...this.$route.query,
                        ...query,
                    },
                })
                .catch(() => {});
            this.get_coupons_list();
        },
        populateFromURL(){
        const { code, all, published, page, limit } = this.$route.query;
        this.searchText = code || this.searchText;
        this.pagination.current = +page || this.pagination.current;
        this.pagination.limit = +limit || this.pagination.limit;
        }
    },
    mounted(){
        this.populateFromURL()
       this.get_coupons_list()

    }
    
}
</script>
<style lang="less" scoped>

.coupon-list-container {
    width: 100%;
    word-break: break-all;
    position: relative;
    .coupon-filters {
        display: flex;
        align-items: flex-end;
        @media @mobile {
            display: block;
        }
        .search {
            flex: 1;
            max-width: 400px;
        }
        .dropdown-filters {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            @media @mobile {
                margin-top: 12px;
            }
            > div {
                padding-left: 10px;
            }
            .type-filter {
                width: 250px;
                @media @mobile {
                    width: auto;
                    padding-left: 0;
                }
            }
            .applicable-on-filter {
                width: 130px;
            }
            .archived-filter {
                width: 150px;
            }
        }
    }


    .nitrozen-pagination-container,
    .coupon-card-list {
        margin-top: 24px;
    }
    .coupon-card-container {
    .banner-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        @media @mobile {
            width: 15%;
            height: 75%;
        }
        img {
            width: auto;
            height: 100%;
        }
    }
    .left-container {
        .coupon-code {
            display: flex;
            position: relative;
            align-items: center;
            .copy-code {
                width: 14px;
                padding-left: 5px;
                /deep/ svg {
                    pointer-events: none;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .show-next-schedule {
            color: #00c853;
        }
    }
    .right-container {
        flex: 0.5;
        position: relative;
        @media @mobile {
            flex: none;
        }
        ::v-deep .nitrozen-badge {
            pointer-events: none;
        }
    }
}
}
</style>