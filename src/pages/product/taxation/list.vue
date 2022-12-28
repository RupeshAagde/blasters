<template>
    <div>
        <div class="panel">
            <div class="header-cls">
                <div>
                    <div class="main-hdr">
                        Government Authorised HSN & GST Schedule
                    </div>
                    <div class="hdr-desc">
                        Government authorised HSN codes and gst rates are
                        defined as per product category.
                    </div>
                </div>
                <nitrozen-button
                    :theme="'secondary'"
                    class="rdr-btn"
                    v-flatBtn
                    @click="debounceredirectEdit"
                >
                    Add Tax Rate
                </nitrozen-button>
            </div>
            <div class="search-filter">
                <div class="search-box">
                    <div class="search">
                        <nitrozen-input
                            :showSearchIcon="true"
                            type="search"
                            :placeholder="'Search by HSN, Reporting HSN, Description'"
                            v-model="searchText"
                            @input="searchHSN"
                        ></nitrozen-input>
                    </div>
                    <div class="filter-dropdown">
                        <nitrozen-dropdown
                            placeholder="Choose Type"
                            v-model="selectedType"
                            :items="getHSNType"
                            @change="applyFilter(selectedType)"
                        ></nitrozen-dropdown>
                    </div>
                </div>
                <!--<nitrozen-button
                    theme="secondary"
                    class="ml-sm"
                    v-strokeBtn
                    @click=""
                    >Bulk Action</nitrozen-button
                > -->
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
                        :countryList="countryList"
                    >
                    </list-element>
                </div>
                <div v-else>
                    <adm-no-content
                        :helperText="'No data found'"
                    ></adm-no-content>
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
import { debounce } from '@/helper/utils.js';
import { LocalStorageService } from '@/services/localstorage.service';
import LocationService from '@/services/location.service';
// import { toCurrencyString } from '@/helper/currency.utils.js';
import path from 'path';
import {
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDropdown,
    NitrozenButton,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
// import _ from 'lodash';
import moment from 'moment';
const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1,
};
const TYPE = [
    { value: 'all', text: 'All' },
    { value: 'goods', text: 'Goods' },
    { value: 'services', text: 'Services' },
];
const SPECIAL_CHARS = [
    '+',
    '&&',
    '|',
    '!',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '^',
    '~',
    '*',
    '?',
    ':',
    '/',
    '\\'
];
export default {
    name: 'Taxation',
    props: {
        msg: String,
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
        NitrozenDropdown,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {
        ...mapGetters({
            helpData: GET_HELP_SECTION_DATA,
        }),
        jumbotronData() {
            if (this.helpData && this.helpData.length) {
                return this.helpData.find((it) => {
                    return this.$route.path.includes(it.path);
                });
            }
        },
        getHSNType() {
            return TYPE;
        },
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            isInitialLoad: true,
            pagination: { ...PAGINATION },
            searchText: '',
            selectedType: 'all',
            hsnCodes: [],
            column: [
                'Reporting HSN',
                'HSN',
                'Type',
                'Effective From',
                'Slab #1',
                'Slab #2',
                'Country',
                'Action',
            ],
            countryList: [],
        };
    },
    mounted() {
        this.init();
        this.getCountryList();
    },
    methods: {
        init() {
            this.getHSNCodes();
        },
        frameString(inputStr) {
            const str = inputStr.split('');
            let newStr = '';
            str.forEach((char) => {
                if (SPECIAL_CHARS.includes(char)) {
                    newStr += `\\${char}`;
                } else {
                    newStr += `${char}`;
                }
            });
            return newStr;
        },
        getHSNCodes() {
            const params = {
                page_no: this.pagination.current,
                page_size: this.pagination.limit,
            };
            if (this.searchText) {
                if (/[^a-zA-Z0-9\-\/]/.test(this.searchText)) {
                    const str = this.frameString(this.searchText);
                    params.q = str;
                } else {
                    params.q = this.searchText;
                }
            }
            if (this.selectedType && this.selectedType !== 'all') {
                params.type = this.selectedType;
            }
            this.pageLoading = true;
            return new Promise((resolve, reject) => {
                AdminService.getAllHsnCodes(params)
                    .then(({ data }) => {
                        this.pageError = false;
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
                path: path.join(this.$route.path, redirectPath),
            });
        },
        debounceredirectEdit: debounce(function (e) {
            this.redirectEdit();
        }, 800),
        paginationChange(filter, action) {
            const { current, limit } = filter;

            this.pagination = Object.assign({}, this.pagination, filter);
            let pageQuery = { pageId: current, limit };
            this.setRouteQuery(pageQuery);
            this.getHSNCodes();
        },
        applyFilter(type) {
            this.pagination = { ...PAGINATION };
            if (type == 'all') {
                this.setRouteQuery({ type: undefined });
            } else {
                this.setRouteQuery({ type: type });
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
                    ...query,
                },
            });
        },
        searchHSN: debounce(function () {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ search: this.searchText });
            }
            this.getHSNCodes();
        }, 200),
        getCountryList() {
            LocationService.getCountries()
                .then(({ data }) => {
                    this.countryList = data.items.map((country) => {
                        return {
                            text: country.name,
                            value: country.iso2,
                        };
                    });
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less" scoped>
// @import './../less/page-header.less';
// @import './../less/page-ui.less';
.panel {
    font-family: Inter, sans-serif;
    background: #ffffff;
    min-height: 733px;
    left: 271px;
    border-radius: 6px;
    margin: 20px;
    padding: 20px;
}
.header-cls {
    display: flex;
    justify-content: space-between;
    border: 1px solid #e4e5e6;
    border-radius: 6px;
    padding: 30px 24px 30px 24px;
    font-family: Inter, sans-serif;
    color: #41434c;
    .main-hdr {
        font-size: 24px;
        font-style: normal;
        font-weight: bold;
        line-height: 40px;
        letter-spacing: 0em;
        text-align: left;
    }
    .hdr-desc {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
    }
    .rdr-btn {
    }
}

.search-filter {
    // display: flex;
    // justify-content: space-between;
    // width: 100%;
    margin-top: 24px;
    align-items: center;

    .search-box {
        display: flex;
        justify-content: space-between;
        // width: 80%;
        background: #f8f8f8;
        padding: 12px;
        border-radius: 4px;

        @media @mobile {
            min-width: 100%;
        }
        .search {
            width: 73%;
        }
        .filter-dropdown {
            width: 25%;
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
