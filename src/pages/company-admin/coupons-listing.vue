<template>
    <div class="coupon-list-container">
        <div class="coupon-filters">
            <nitrozen-input
                :value="
                    filter_data.query.title.trim() ||
                        filter_data.query.code.trim()
                "
                :showSearchIcon="true"
                class="search"
                :placeholder="'Search Code or Title'"
                v-model="searchText"
                @input="debounceInput"
            />
            <div class="dropdown-filters">
                <nitrozen-dropdown
                    :searchable="true"
                    class="type-filter"
                    :label="'Type'"
                    v-model="filter_data.query.type_slug"
                    :items="typeSlugItems"
                    @change="get_coupons_list"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="applicable-on-filter"
                    :label="'Applicable On'"
                    v-model="filter_data.query.scope"
                    :items="scopeItems"
                    @change="get_coupons_list"
                ></nitrozen-dropdown>

                <nitrozen-dropdown
                    class="archived-filter"
                    :label="'Status'"
                    v-model="filter_data.query.is_archived"
                    :items="
                        getDropdownValues({ true: 'Inactive', false: 'Active' })
                    "
                    @change="get_coupons_list"
                ></nitrozen-dropdown>
            </div>
        </div>
        <adm-shimmer v-if="loading" :count="4"></adm-shimmer>
        <div v-else-if="initial_data.length" class="coupon-card-list">
            <div
        class="blaster-list-card-container coupon-card-container"
        
    >
        <!-- <div class="card-avatar banner-image">
            <img :src="'/public/admin/assets/pngs/default_icon_listing.png'" />
        </div> -->
        <div class="card-content-section left-container">
            <div class="card-content-line-1">
                {{ coupon.title }}
            </div>
            <div class="darker-xs card-content-line-2 coupon-code">
                {{ coupon.code.toUpperCase() }}
                <span @click="onCopyCode">
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
                        coupon.created_on
                    ).toDateString()}`
                }}
                <!-- <span v-if="showNextSchedule()">
                    |
                    <span class="show-next-schedule">
                        {{ showNextSchedule() }}
                    </span>
                </span> -->
            </div>
        </div>
        <div class="card-badge-section right-container">
            <div class="states">
                <nitrozen-badge v-if="coupon.live" state="success"
                    >Live</nitrozen-badge
                >
                <nitrozen-badge v-else>Not Live</nitrozen-badge>
                <nitrozen-badge v-if="true" state="success"
                    >Active</nitrozen-badge
                >
                <nitrozen-badge v-else>Inactive</nitrozen-badge>
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
            v-model="filter_data.pagination"
            :pageSizeOptions="perPageValues"
            
        ></nitrozen-pagination>
    </div>

</template>
<script>
import {
    debounce, copyToClipboard
} from '@/helper/utils';

import PageEmpty from '@/components/common/page-empty.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';
import {TYPE_DATA} from '@/helper/coupon-helper'
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
    },
    data() {
        return {
            query_string: '',
            initial_data: [1],
            loading: false,
            show_schedule_modal: false,
            showSelectModal: false,
            filter_data: {
                query: {
                    title: ' ',
                    code: ' ',
                    type_slug: ' ',
                    scope: ' ',
                    is_archived: '',
                    is_display: ''
                },
                pagination: {
                    limit:  10,
                    current: 1,
                    total: 100
                }
            },
            perPageValues: [1, 2, 5, 10, 25, 50, 100, 200],
            searchText: '',
            coupon: {
                title: 'Testing UI',
                code: 'test22',
                created_on : "2019-11-06T16:16:53.982Z",
                live: true
            }

        }
    },
    methods: {
        onSearch() {
            this.filter_data.query.title = this.searchText;
            this.filter_data.query.code = this.searchText;
            this.get_coupons_list();
        },
        debounceInput: debounce(function(e) {
            this.onSearch();
        }, 200),
        getDropdownValues(option_dict) {
            option_dict[' '] = 'All';
            return Object.keys(option_dict).map(key => {
                return {
                    text: option_dict[key],
                    value: key
                };
            });
        },
        get_coupons_list(){
        },
        onCopyCode(event) {
            copyToClipboard(this.coupon.code.toUpperCase());
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
            event.stopPropagation();
            event.preventDefault();
        },
       
        
    },
    computed: {
         typeSlugItems() {
            return this.getDropdownValues(
                Object.keys(TYPE_DATA).reduce(
                    (obj, type) => {
                        obj[type] = TYPE_DATA[type].title;
                        return obj;
                    },
                    { ' ': 'All' }
                )
            );
        },
         scopeItems() {
            return this.getDropdownValues({
                all: 'All Products',
                
            });
        }

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
                width: 350px;
                @media @mobile {
                    width: auto;
                    padding-left: 0;
                }
            }
            .applicable-on-filter {
                width: 130px;
            }
            .archived-filter {
                width: 100px;
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