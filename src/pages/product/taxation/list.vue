<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <div class="full-width">
                    <jumbotron
                        class="jumbotron-h"
                        :title="'Government Authorised HSN & GST Schedule'"
                        :desc="'HSN list'"
                        btnLabel="Add HSN"
                        @btnClick="redirectEdit"
                    ></jumbotron>
                    <div class="search-filter">
                        <div class="search-box">
                            <nitrozen-input
                                :showSearchIcon="true"
                                class="search"
                                type="search"
                                :placeholder="'Search by HSN or Description'"
                                v-model="searchText"
                                @input="searchHSN"
                            ></nitrozen-input>
                        </div>
                        <nitrozen-button
                            theme="secondary"
                            class="ml-sm"
                            v-strokeBtn
                            @click=""
                            >Bulk Action</nitrozen-button
                        >
                    </div>
                    <div class="hsn-code-list">
                        <shimmer
                            v-if="pageLoading && !pageError"
                            :count="4"
                        ></shimmer>
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
                        <no-content
                            v-else
                            helperText="No HSN code available"
                        ></no-content>
                        <div class="pagination" v-if="hsnCodes.length > 0">
                            <nitrozen-pagination
                                name="HSN codes"
                                v-model="pagination"
                                @change="paginationChange"
                                :pageSizeOptions="[5,10,20,50]"
                            ></nitrozen-pagination>
                        </div>
                    </div>
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
import NoContent from '@/components/common/page-error';
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
        NoContent,
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
            hsnCodes: [],
            hsnCodeTest: [],
            column: [
                'Uid',
                'HSN',
                'Type',
                'Effective_from',
                'rate',
                'Country',
                'Action'
            ],
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
            this.pageLoading = true;
            return new Promise((resolve, reject) => {
                AdminService.getAllHsnCodes(params)
                    .then(({ data }) => {
                        this.pageLoading = false;
                        this.pagination.total = data.page.item_total;
                        this.hsnCodes = data.items;
                        console.log(this.hsnCodes)
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
            console.log('Current', pageQuery);
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
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query
                }
            });
        },
        readableDate(date) {
            return moment(date).format('MMM Do YYYY, h:mm a');
        },
        description() {},
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
// @import './../less/page-header.less';
// @import './../less/page-ui.less';
body .panel {
    font-family: Inter;
}
.jumbotron-h {
    margin-top: 0;
    box-sizing: border-box;
    min-height: 100px;
    @media @mobile {
        min-height: unset;
    }
    .jumbotron-title ::v-deep {
        margin-left: 15px;
    }
}
.main-container {
    height: 100%;
    .page-container {
        padding-bottom: 0px;
        @media @mobile {
            width: calc(100% - 48px);
        }
    }
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.search-filter {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    align-items: center;

    .search-box {
        margin-top: 0px;
        margin-bottom: 15px;
        min-width: 400px;
        @media @mobile {
            min-width: 100%;
        }
    }
    .filter-dropdown {
        width: 100px;
        margin-left: 12px;
    }
    .label {
        font-family: Inter;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        margin-top: 30px;
        font-weight: 500;
    }

    .filter {
        display: flex;
        flex-direction: row;
        .filter-text {
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
        }
        select {
            background-color: @White;
            border: 1px solid @Iron;
            border-radius: 3px;
            height: 40px;
            color: @Mako;
            font-size: 14px;
            padding: 5px 10px;
        }
    }
}
.hsn-code-list {
    width: auto;
    background-color: @White;
    .mirage-list-card-container {
        border: 1px solid #e4e5e6;
        cursor: pointer;
        min-height: 120px;
        padding: px 24px;
        border-radius: 3px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }
}
.inline {
    display: flex;
}
.slab {
    margin-left: 12px;
    width: 180px;
    &.border-right {
        border-right: 1px solid @Iron;
    }

    &.mr-md {
        margin-right: 24px;
    }
    .input-label {
        font-size: 12px;
        font-weight: 500;
        line-height: 21px;
        color: @DustyGray2;
        padding-right: 20px;
    }
    .input-value {
        font-size: 14px;
        font-weight: 500;
        line-height: 21px;
        color: @Mako;
    }
}

.card-content-line-3 {
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    max-width: 600px;
    color: @DustyGray2;
    padding-right: 4px;
}
.card-badge-section {
    margin-left: 500px;
    margin-right: 24px;
    display: flex;
    align-items: center;
    @media @mobile {
        min-height: unset;
    }
}
.full-width {
    width: 100%;
}
.pagination {
    margin-bottom: 24px;
}
.card-avatar {
    margin-left: 24px;
    margin-right: 12px;
    min-height: 60px;
    min-width: 60px;
    max-height: 60px;
    max-width: 60px;
    display: flex;
    align-items: center;
}
</style>
