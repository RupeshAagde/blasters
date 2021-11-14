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
            <!-- <list-card
                v-for="coupon in initial_data"
                :key="coupon._id"
                :coupon="coupon"
                @click="edit_coupon(coupon._id, $event)"
            ></list-card> -->
        </div>
        <div v-else>
            <no-content :helperText="'No coupons found'"></no-content>
        </div>
        <nitrozen-pagination
            v-if="initial_data.length"
            name="coupons"
            v-model="filter_data.pagination"
            :pageSizeOptions="perPageValues"
            @change="pageOptionChange"
        ></nitrozen-pagination>
    </div>

</template>
<script>
import {
    debounce,
} from '@/helper/utils';
import PageEmpty from '@/components/common/page-empty.vue';
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenDropdown,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenPagination,
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
    'no-content': PageEmpty,
    },
    data() {
        return {
            query_string: '',
            initial_data: [],
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
            searchText: ''
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
        console.log('hi');
        }
        
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
}
</style>