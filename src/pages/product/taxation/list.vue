<template>
    <div>
        <div class="panel">
            <jumbotron
                class="jumbotron-h"
                :title="'Government Authorised HSN & GST Schedule'"
                :desc="'HSN list'"
                btnLabel="Add Tax Rate"
                @btnClick="redirectEdit"
            ></jumbotron>
            <div class="search-filter">
                <div class="search-box">
                    <div>
                        <nitrozen-input
                            :showSearchIcon="true"
                            class="search"
                            type="search"
                            :placeholder="'Search by HSN, Reporting HSN'"
                            v-model="searchText"
                            @input="searchHSN"
                        ></nitrozen-input>
                    </div>
                    <div>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            placeholder="Choose Type"
                            v-model="selectedType"
                            searchable="true"
                            :items="typeList"
                            @change="applyFilter(selectedType)"
                        ></nitrozen-dropdown>
                    </div>
                </div>
                <nitrozen-button
                    theme="secondary"
                    class="ml-sm"
                    v-strokeBtn
                    @click=""
                    >Bulk Action</nitrozen-button
                >
            </div>
            <div class="hsn-list-div">
                <shimmer v-if="pageLoading && !pageError" :count="4"></shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="init"
                ></page-error>
                <div v-else-if="hsnCodes && hsnCodes.length">
                    <list-element
                        class="mirage-table"
                        :tableColumns="column"
                        :tableData="hsnCodes"
                    >
                    </list-element>
                </div>
                <div v-else>
                    <adm-no-content :helperText="''"></adm-no-content>
                </div>
                <div class="pagination" v-if="hsnCodes.length > 0">
                    <nitrozen-pagination
                        name="HSN codes"
                        v-model="pagination"
                        @change="paginationChange"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AdminService from '@/services/company-admin.service';
import { GET_HELP_SECTION_DATA } from '@/store/getters.type';
import Loader from '@/components/common/loader';
import Shimmer from '@/components/common/shimmer';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import ListElement from './list-element';
import PageError from '@/components/common/page-error';
import Jumbotron from '@/components/common/jumbotron';
import { copyToClipboard, debounce, titleCase } from '@/helper/utils.js';
import { LocalStorageService } from '@/services/localstorage.service';
// import { toCurrencyString } from '@/helper/currency.utils.js';
import path from 'path';
import {
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown,
    NitrozenButton
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
// import _ from 'lodash';
import moment from 'moment';
const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};
export default {
    name: 'Taxation',
    props: {
        msg: String
    },
    components: {
        PageError,
        AdmNoContent,
        ListElement,
        Shimmer,
        Jumbotron,
        Loader,

        NitrozenButton,
        NitrozenInput,
        NitrozenPagination,
        NitrozenBadge,
        NitrozenDropdown
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        ...mapGetters({
            helpData: GET_HELP_SECTION_DATA
        }),
        jumbotronData() {
            if (this.helpData && this.helpData.length) {
                return this.helpData.find((it) => {
                    return this.$route.path.includes(it.path);
                });
            }
        }
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            isInitialLoad: true,
            pagination: { ...PAGINATION },
            searchText: '',
            selectedType: '',
            typeList: [
                { value: '', text: 'All' },
                { value: 'goods', text: 'Goods' },
                { value: 'services', text: 'Services' }
            ],
            hsnCodes: [],
            column: [
                'Reporting HSN',
                'HSN',
                'Type',
                'Effective From',
                'Slab #1',
                'Slab #2',
                'Country',
                'Action'
            ]
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getHSNCodes();
        },

        getHSNCodes() {
            const params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit
            };
            if (this.searchText) {
                params.q = this.searchText;
            }
            if (this.selectedType) {
                params.type = this.selectedType;
            }
            this.pageLoading = true;
            return new Promise((resolve, reject) => {
                AdminService.getAllHsnCodes(params)
                    .then(({ data }) => {
                        this.pageLoading = false;
                        this.pagination.total = data.page.item_total;
                        this.hsnCodes = data.items;
                        return resolve();
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.pageError = true;
                        console.error(err);
                        return reject(err);
                    });
            });
        },
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ search: undefined });
        },
        redirectEdit() {
            // LocalStorageService.addOrUpdateItem('uid',code)
            let redirectPath = '/add';
            this.$router.push({
                path: path.join(this.$route.path, redirectPath)
            });
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;

            this.pagination = Object.assign({}, this.pagination, filter);
            let pageQuery = { pageId: current, limit };
            this.setRouteQuery(pageQuery);
            this.getHSNCodes();
        },
        applyFilter(type) {
            if (type==''){
                this.setRouteQuery({type:undefined});
            } else {
            this.setRouteQuery({type:type});
            }
            this.getHSNCodes();
        },
        setRouteQuery(query) {
            if (query.search) {
                // clear pagination if search or filter applied
                this.pagination = { ...PAGINATION };
                query.pageId = undefined;
                query.limit = PAGINATION.limit;
            }
            this.$router.push({
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
        },
        searchHSN: debounce(function() {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ search: this.searchText });
            }
            this.getHSNCodes();
        }, 200)
    }
};
</script>

<style lang="less" scoped>
// @import './../less/page-header.less';
// @import './../less/page-ui.less';
.panel {
    font-family: Inter;
    background: #ffffff;
    min-height: 733px;
    left: 271px;
    border-radius: 6px;
    margin: 20px;
    padding: 20px;
}
.jumbotron-h {
    top: 1;
    box-sizing: border-box;
    min-height: 100px;
    .jumbotron-title ::v-deep {
        margin-left: 15px;
    }
}

.search-filter {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 24px;
    align-items: center;

    .search-box {
        display: flex;
        justify-content: space-between;
        width: 80%;
        background: #f8f8f8;
        padding: 12px;
        border-radius: 4px;

        @media @mobile {
            min-width: 100%;
        }
        .search {
            width: 500px;
        }
        .filter-dropdown {
            width: 200px;
        }
    }
}
// .hsn-code-list {
//     width: auto;
//     background-color: @White;
//     .mirage-list-card-container {
//         border: 1px solid #e4e5e6;
//         cursor: pointer;
//         min-height: 120px;
//         padding: px 24px;
//         border-radius: 3px;
//         margin-bottom: 16px;
//         display: flex;
//         align-items: center;
//     }
// }
.hsn-list-div {
    margin-top: 24px;
}

.pagination {
    margin-top: 24px;
    margin-bottom: 24px;
}
</style>
