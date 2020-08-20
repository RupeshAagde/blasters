<template>
    <div class="main-container">
        <div class="jumbotron-container">
            <jumbotron
                :title="'Attributes'"
                :desc="
                    'Use this section to create attributes that assist a user in knowing the characteristics of a product. Further, it serves as a standard for effectively describing an item and comparing them. Moreover, you can also create a variety of department-wise attributes.'
                "
                btnLabel="Create"
                @btnClick="redirectEdit"
            >
                <nitrozen-button
                    theme="secondary"
                    class="ml-sm"
                    v-strokeBtn
                    @click="$openGroupDialog"
                    >Group & Sequence</nitrozen-button
                >
            </jumbotron>
        </div>
        <div class="second-container">
            <div
                class="search-box"
                v-if="
                    !pageLoading || (searchText !== '' || attributes.length > 0)
                "
            >
                <div v-if="isInitialLoad" class="input-shimmer shimmer"></div>
                <template v-else>
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search"
                        type="search"
                        placeholder="Search by name"
                        v-model="searchText"
                        @input="
                            (selectedDepartment != '' &&
                                attributes.length > 0) ||
                            (selectedDepartment == '' &&
                                attributes.length > 0) ||
                            searchText == '' ||
                            (selectedDepartment == '' && attributes.length > 0)
                                ? debounceInput({ search: searchText })
                                : ''
                        "
                    ></nitrozen-input>
                    <div class="filter">
                        <label class="label">Filter</label>
                        <nitrozen-dropdown
                            class="filter-dropdown"
                            placeholder="Choose Department"
                            v-model="selectedDepartment"
                            :items="departmentsList"
                            :searchable="true"
                            @searchInputChange="setDepartmentsList"
                            @change="
                                fetchAttributes(),
                                    setRouteQuery({
                                        department: selectedDepartment
                                    })
                            "
                        ></nitrozen-dropdown>
                    </div>
                </template>
            </div>
            <div class="product-list">
                <shimmer v-if="pageLoading && !pageError" :count="4"></shimmer>
                <page-error
                    v-else-if="pageError && !pageLoading"
                    @tryAgain="init"
                ></page-error>
                <div v-else-if="attributes && attributes.length">
                    <!-- new cards -->
                    <div
                        v-for="(attribute, index) in attributes"
                        :key="index"
                        class="container"
                        @click="redirectEdit(attribute.slug)"
                    >
                        <div class="left-container">
                            <div class="card-avatar banner-image">
                                <img
                                    :src="
                                        attribute.logo ||
                                            '/public/assets/pngs/default_icon_listing.png'
                                    "
                                />
                            </div>
                            <div class="card-details">
                                <div
                                    class="card-content-line-1 txt-company-heading"
                                >
                                    {{ attribute.name }}
                                </div>
                                <div class="txt-arrange">
                                    <div class="txt-description-heading">
                                        {{ getLine2Txt(attribute) }}
                                    </div>
                                </div>
                                <div class="cb-box" v-if="attribute.created_by">
                                    <div
                                        class="cb-box"
                                        v-if="
                                            attribute.created_by &&
                                                attribute.created_by.username
                                        "
                                    >
                                        <span>Created By :</span>
                                        <span class="cb-lm">
                                            <user-info-tooltip
                                                :userId="
                                                    attribute.created_by.user_id
                                                "
                                            ></user-info-tooltip>
                                        </span>
                                        <span
                                            class="cb-lm"
                                            v-if="attribute.created_on"
                                            >On</span
                                        >
                                        <span
                                            class="cb-lm"
                                            v-if="attribute.created_on"
                                        >
                                            {{
                                                new Date(
                                                    attribute.created_on
                                                ).toLocaleString()
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-badge-section">
                            <nitrozen-badge
                                v-if="attribute.schema.mandatory"
                                state="error"
                                >REQUIRED</nitrozen-badge
                            >
                            <nitrozen-badge
                                v-if="attribute.enabled_for_end_consumer"
                                state="info"
                                >PUBLICLY DISPLAYED</nitrozen-badge
                            >
                            <nitrozen-badge
                                v-if="
                                    attribute.filters &&
                                        attribute.filters.indexing
                                "
                                state="info"
                                >FILTER PERMISSABLE</nitrozen-badge
                            >
                        </div>
                    </div>
                </div>
                <page-empty
                    v-else
                    :helperText="'No attributes available'"
                ></page-empty>
                <div class="pagination" v-if="attributes.length > 0">
                    <nitrozen-pagination
                        name="Attributes"
                        v-model="pagination"
                        @change="paginationChange"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
                </div>
            </div>
        </div>
        <!-- bulk-import-selection-dialog -->
        <group-and-order-dialog
            ref="groupAndOrderDialog"
            @close="$closeGroupDialog"
        ></group-and-order-dialog>
    </div>
</template>

<style lang="less" scoped>
.cb-lm {
    margin-left: 6px;
}
.main-container {
    width: 100%;
    background-color: white;
    margin: 24px;
    padding: 24px;
    padding-bottom: 0;
}
.second-container {
    margin: 24px 0px;
}
.ml-sm {
    margin-left: 12px;
}

.search-box {
    margin: 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .search {
        min-width: 400px;
    }

    .filter {
        display: flex;
        align-items: center;
    }
    .label {
        font-family: Poppins;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .filter-dropdown {
        width: 200px;
        margin-left: 12px;
    }
}

.container {
    border: 1px solid #e4e5e6;
    cursor: pointer;
    min-height: 120px;
    padding: 0px 24px;
    border-radius: 3px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    transition: box-shadow 0.3s;
    &:hover {
        box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
    }
    .disabled {
        background: @WhiteSmoke;
        opacity: 0.5;
        pointer-events: none;
    }
    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .left-container {
        display: flex;
        align-items: center;
        flex: 2;
        position: relative;
        width: calc(100% - 60px);

        .txt-arrange {
            display: flex;
            justify-content: flex-start;
            text-align: center;
        }

        .txt-company-heading {
            color: #5c6bdd;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
            margin-bottom: 6px;
        }
        .txt-description-heading {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
        }
        .cb-box {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 12px;
            display: flex;
        }

        .card-avatar {
            min-height: 60px;
            min-width: 60px;
            max-height: 60px;
            max-width: 60px;
            display: flex;
            align-items: center;
            img {
                width: 100%;
                height: 60px;
                object-fit: cover;
                border-radius: 50%;
            }
        }
        .card-details {
            padding: 0px 24px;
            line-height: 24px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: calc(100% - 100px);
        }
    }
    .card-badge-section {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .nitrozen-badge {
            margin: 0 0 0 8px;
        }
    }
}
.export-catalog {
    margin-left: 20px;
}
</style>
<script>
import path from 'path';
import CompanyService from '@/services/company-admin.service';
import Jumbotron from '@/components/common/jumbotron';
import { titleCase, debounce } from '@/helper/utils';
import Shimmer from '@/components/common/shimmer';
import PageEmpty from '@/components/common/page-empty';
import PageError from '@/components/common/page-error';
import fynotfound from '@/components/common/ukt-not-found';
import GroupAndOrderDialog from './group-and-order-dialog';
import userInfoTooltip from '@/components/common/feedback/userInfo-tooltip.vue';
// import { toListingThumbnail } from '@/helper/image.utils';
import {
    NitrozenInput,
    NitrozenError,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenPagination,
    NitrozenBadge,
    NitrozenDialog,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};

const PROPERTY_TYPES = {
    str: 'Text',
    int: 'Number',
    float: 'Decimal Number',
    boolean: 'Yes or No',
    list: 'List',
    html: 'HTML',
    details: 'Details'
};

export default {
    name: 'AttributeList',
    components: {
        Jumbotron,
        PageEmpty,
        Shimmer,
        PageError,
        userInfoTooltip,
        GroupAndOrderDialog,

        NitrozenInput,
        NitrozenPagination,
        NitrozenBadge,
        NitrozenDialog,
        NitrozenError,
        NitrozenDropdown,
        NitrozenButton
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    computed: {},
    data() {
        return {
            pageLoading: false,
            isInitialLoad: false,
            pageError: false,
            searchText: '',
            pagination: { ...PAGINATION },
            pageId: '',

            attributes: [],

            departmentsList: [],
            departments: [],
            selectedDepartment: ''
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        titleCase,
        init() {
            this.populateFromURL();
            Promise.all([this.fetchAttributes(), this.fetchDepartments()])
                .then(() => {
                    this.setDepartmentsList();
                })
                .catch((err) => {});
        },
        populateFromURL() {
            const { name, pageId } = this.$route.query;
            if (name) this.searchText = name;
            if (pageId) this.pageId = pageId;
        },
        companyView(company) {
            let companyId = company.uid;
            if (companyId) {
                this.$router.push({
                    path: `/administrator/company-details/${companyId}`
                });
            }
        },
        requestQuery() {
            const query = {
                page: this.pagination.current,
                limit: this.pagination.limit,
                sort: 'created_desc'
            };

            if (this.searchText) {
                query.q = this.searchText;
            }

            if (this.selectedDepartment) {
                query.department = this.selectedDepartment;
            }

            return query;
        },
        fetchAttributes() {
            this.pageLoading = true;
            return CompanyService.fetchAttributes(this.requestQuery())
                .then(({ data }) => {
                    this.attributes = data.data;

                    this.pagination.total = data.page.total_count;
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.log(err);
                });
        },
        fetchDepartments() {
            return new Promise((resolve, reject) => {
                CompanyService.fetchDepartments()
                    .then(({ data }) => {
                        this.departments = data.data;
                        return resolve();
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        setDepartmentsList(e = {}) {
            this.departmentsList = [];

            if (!e.text) {
                this.selectedDepartment = '';
                this.fetchAttributes();
            }

            this.departments.forEach((d) => {
                if (
                    !e.text ||
                    d.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.departmentsList.push({
                        text: d.name,
                        value: d.slug
                    });
                }
            });
        },

        getErrorImage() {
            return '/public/admin/assets/pngs/default_icon_listing.png';
        },
        getLine2Txt(attribute = {}) {
            if (_.isEmpty(attribute)) return '';

            let txt = 'Type: ';

            if (attribute.details.displayType === 'text') {
                this.attrType = attribute.schema.type;
                txt += PROPERTY_TYPES[attribute.schema.type];
            } else {
                this.attrType = attribute.details.displayType;
                txt += PROPERTY_TYPES[attribute.details.displayType];
            }

            return txt;
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            // let pageQuery = { pageId: current, limit };
            // this.setRouteQuery(pageQuery);

            this.fetchAttributes();
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.clearSearchFilter();
            } else {
                this.setRouteQuery({ search: this.searchText });
            }
            this.fetchAttributes();
        }, 200),
        clearSearchFilter() {
            this.searchText = '';
            this.setRouteQuery({ name: undefined });
        },
        setRouteQuery(query) {
            if (query.name || query.stage !== 'all') {
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
        $openGroupDialog() {
            this.$refs.groupAndOrderDialog.open();
        },
        redirectEdit(slug = '') {
            let url = path.join(this.$route.path, 'create');
            if (slug) {
                url = path.join(this.$route.path, 'edit', slug);
            }
            this.$router.push({ path: url });
        },
        $closeGroupDialog(entity) {
            let action = 'group';
            if (entity === 'filters') action = 'sequence';
            this.$router.push({
                path: path.join(this.$route.path, action, entity)
            });
        }
    }
};
</script>
