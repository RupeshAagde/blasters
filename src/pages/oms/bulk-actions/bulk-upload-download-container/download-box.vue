<template>
     <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">1. Use</span> the given filters below and click the download button to get a CSV/Excel file containing all the orders
            </p>
        </template>
        <template #content>
            <div class="dropdowns-container">
                <nitrozen-dropdown
                    class="dropdown"
                    :searchable="true"
                    :items="companiesList"
                    :label="'Company'"
                    @change="onCompanyChange"
                    @searchInputChange="searchCompany($event.text)"
                    v-model="selectedCompany"
                />
                <nitrozen-dropdown
                    class="dropdown"
                    :searchable="true"
                    :items="filteredStores"
                    :label="'Fulfilment Location'"
                    @searchInputChange="searchStore($event.text)"
                    v-model="selectedFulfillmentCentre"
                    :disabled="selectedCompany.length === 0"
                />
                <nitrozen-dropdown
                    :class="selectedStatus ? 'dropdown' : 'dropdown-first'"
                    :items="statuses"
                    :searchable="false"
                    :label="'Status'"
                    v-model="selectedStatus"
                    placeholder="`Choose status`"
                />
                <nitrozen-dropdown
                    :class="selectedFileType ? 'dropdown' : 'dropdown-first'"
                    :items="fileTypes"
                    :searchable="false"
                    :label="'File Type'"
                    v-model="selectedFileType"
                    :placeholder="`Choose file type`"
                />
            </div>
            <div class="advanced-filters-btn-container">
                <span class="advanced-filters-btn" @click="onAdvFiltersClick">Advanced Filters</span>
            </div>
        </template>
        <template #footer>
            <div class="download-btn-container">
                <nitrozen-button
                    theme="secondary"
                    v-stroke-btn
                    @click="onDownloadBtnClick"
                    :disabled="disableDownload">
                    Download
                </nitrozen-button>
            </div>
        </template>
    </bulk-action-box>
</template>

<script>
/* Package imports */
import {
    NitrozenButton, NitrozenDropdown, strokeBtn
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';

/* Component imports */
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';

/* Service imports */
import OrderService from '@/services/orders.service';
import CompanyAdminService from '@/services/company-admin.service.js';

/* Mock imports */
import { fileTypes } from '@/pages/oms/fixtures/dropdown-items.js';

/* Helper imports */
import { debounce } from '@/helper/utils';

export default {
    name: 'download-action-box',
    components: {
        BulkActionBox,
        NitrozenButton,
        NitrozenDropdown,
        fileTypes
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        globalFilters: {
            type: Array
        }
    },
    data() {
        return {
            companiesError: false,
            companiesList: [],
            disableDownload: false,
            fileTypes: [],
            filteredStores: [],
            fulfillingStoreFilter: [],
            selectedCompany: '',
            selectedFileType: null,
            selectedFulfillmentCentre: null,
            selectedStatus: null,
            statuses: [],
        }
    },
    directives: {
        strokeBtn
    },
    computed: {
        ...mapGetters({
            accessDetail: {},
        }),
    },
    mounted() {
        this.disableDownload = this.disabled;
        this.fetchCompanies();
        this.statuses = this.globalFilters[0].options;
        this.fileTypes = cloneDeep(fileTypes);
    },
    methods: {
        /**
         * Function to fetch the companies.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        fetchCompanies(params = {}) {
            this.companiesListLoading = true;

            return CompanyAdminService.getCompanyList(params)
            .then(response => {
                if(response.data && response.data.items) {
                    this.companiesList = cloneDeep(response.data.items).map(item => {
                        return {
                            ...item,
                            text: item.name,
                            value: item.uid
                        }
                    });
                    this.companiesError = false;
                }
            })
            .catch(error => {
                console.error("Error in fetching list of companies:   ", error);
                this.$snackbar.global.showError(
                    'We are unable to fetch the list of companies',
                    3000
                );
                this.companiesError = true;
            });
        },

        getFulfillmentCenter() {
            let centerOfFulfillment = [];
            let params = {
                page_no: 1,
                page_size: 500
            };
            OrderService.getFulfillmentCenterV2(params, this.selectedCompany)
                .then(({ data }) => {
                    centerOfFulfillment = data.items.map(center => ({ value: center.uid, name: center.display_name, code: center.code, text: center.display_name.concat(" (", center.code, ")") }));
                  if(
                    this.accessDetail && 
                    this.accessDetail.store_access && 
                    this.accessDetail.store_access.values &&
                    this.accessDetail.store_access.values.length > 0){
                    centerOfFulfillment = centerOfFulfillment.filter((item)=>  this.accessDetail.store_access.values.includes(item.value))
                  }
                    this.filteredStores = centerOfFulfillment;
                    this.fulfillingStoreFilter = centerOfFulfillment;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Unable to fetch fulfilment locations');
                    console.error("Error in fetching fulfillment centres:   ", err);
                })
        },
        /**
         * Function to emit showAdvFilters when the advanced filters need to be shown
         *
         * @author: Rushabh Mulraj Shah
         */
        onAdvFiltersClick() {
            this.$emit('showAdvFilters');
        },

        /**
         * Method to handle user selection of company from the companies
         * dropdown. As of January 9, 2023, the selected company will be
         * used for fetching a list of fulfillment centres for that
         * company.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         */
        onCompanyChange() {
            this.getFulfillmentCenter();
        },

        /**
         * Function to emit download when the user clicks on download
         *
         * @author: Rushabh Mulraj Shah
         */
        onDownloadBtnClick() {
            this.$emit('download', [this.selectedFulfillmentCentre, this.selectedStatus, this.selectedFileType]);
        },

        /**
         * Method to handle searching of companies by the user.
         * If the length of the text is 0, selected company will be deleted.
         * Else, the fetchCompanies function will be called with the typed
         * text.
         * This method uses 'debounce' to ensure that the function waits for
         * 300 ms before getting the text and hitting the API.
         * 
         * @author Rushabh Mulraj Shah <rushabhmshah@gofynd.com>
         * @param {String} text The text entered by the user.
         */
        searchCompany: debounce(function(text) {
            if(text.length === 0) {
                this.selectedCompany = '';
                this.selectedFulfillmentCentre = '';
            }
            this.fetchCompanies({q: text});
        }, 300),

        searchStore(text) {
            text = text ? text.toLowerCase() : text;
            if (text) {
                this.filteredStores = this.fulfillingStoreFilter.filter((s) =>
                    s.text.toLowerCase().includes(text) ||
                    s.uid && s.uid.toString().toLowerCase().includes(text) ||
                    s.store_code && s.store_code.toString().toLowerCase().includes(text)
                        ? true
                        : false
                );
            } else {
                this.selectedFulfillmentCentre = '';
                this.filteredStores = this.fulfillingStoreFilter;
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.bold-text {
    font-weight: 500;
}

.dropdown {
    margin-bottom: 1rem;
    font-size: 12px !important;

    ::v-deep .nitrozen-select__trigger {
        font-size: 12px !important;
        border-radius: 4px;
    }

    ::v-deep .nitrozen-options {
        font-size: 12px !important;
    }
}

.advanced-filters-btn-container {
    display: flex;
    justify-content: flex-end;

    .advanced-filters-btn {
        color: @RoyalBlue;
        font-size: 12px;
        cursor: pointer;
    }
}

.download-btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}


.dropdown-first {
    margin-bottom: 1rem;
    font-size: 12px !important;

    ::v-deep .nitrozen-select__trigger {
        font-size: 12px !important;
        border-radius: 4px;
    }

    ::v-deep .nitrozen-options {
        font-size: 12px !important;
    }
    ::v-deep .nitrozen-select-wrapper {
        .nitrozen-select {
            .nitrozen-select__trigger {
                color: #9B9B9B;
            }
        }
    }
}

</style>
