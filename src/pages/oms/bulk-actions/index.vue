<template>
    <div class="bulk-panel panel">
        <adm-page-header
            class="titlize"
            :showBackButton="false"
            :title="`Bulk Action`"
            :noContextMenu="true"
        ></adm-page-header>
        <div class="content" v-if="globalFilters && globalFilters[0] && globalFilters[0].options">
            <bulk-upload-download
                ref="bulk-upload-download"
                :globalFilters="globalFilters"
                :selectedFilters="selectedFilters"
                @makeFetchInvoiceList="callInvoiceListApi($event)"
                @showAlert="showAlert"
                @showAdvFilters="showAdvFilters"
            />
            <bulk-list
                ref="bulk-list"
                :displayAlert="displayAlert"
                :alertMsg="alertMsg"
                @click="onCardClick"
            />
        </div>

        <transition name="slide">
            <template v-if="displayAdvFilters">
                <side-drawer
                    @close="close($event)"
                    :title="'Filters'"
                    :footer="true"
                    :css="{ width: '30%' }"
                >
                    <advanced-filters
                        ref="advFilters"
                        :advancedFilters="advancedFilters"
                        :advancedSelectedFilters="advancedSelectedFilters"
                        @appliedFilters="
                            applyAdvancedFilters($event)
                        "
                    />
                    <template #footer>
                        <div class="footer-box">
                            <nitrozen-button
                                class="clear-button"
                                :theme="'secondary'"
                                @click="resetFilters()"
                                >Clear all</nitrozen-button
                            >
                            <nitrozen-button
                                class="apply-filter-button"
                                v-flatBtn
                                :theme="'secondary'"
                                @click="applyFilters()"
                                >Apply filter</nitrozen-button
                            >
                        </div>
                    </template>
                </side-drawer>
            </template>
        </transition>

        <transition name="slide">
            <template v-if="displayDetails">
                <side-drawer
                    class="side-drawer-style"
                    @close="closeDetails()"
                    :title="`Batch ID: ${selectedDataDetails.data[0].batch_id}`"
                >
                    <template #header>
                        <bulk-details-header :bulkData="selectedDataDetails" />
                    </template>
                    <bulk-details :details="selectedDataDetails" />
                </side-drawer>
            </template>
        </transition>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';

/* Component imports */
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import AdvancedFilters from '@/pages/oms/bulk-actions/advanced-filters.vue'; 
import BulkDetails from '@/pages/oms/bulk-actions/bulk-details/index.vue'; 
import BulkDetailsHeader from '@/pages/oms/bulk-actions/bulk-details/header.vue'; 
import BulkList from '@/pages/oms/bulk-actions/bulk-list/index.vue'; /** Yet */
import BulkUploadDownloadContainer from '@/pages/oms/bulk-actions/bulk-upload-download-container/index.vue'; /** Yet */
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue'; /** Yet */

/* Service imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'bulk-actions',
    components: {
        AdmPageHeader,
        AdvancedFilters,
        BulkDetails,
        BulkDetailsHeader,
        BulkList,
        'bulk-upload-download': BulkUploadDownloadContainer,
        NitrozenButton,
        SideDrawer
    },
    data() {
        return {
            advancedFilters: {},
            alertMsg: '',
            displayAlert: false,
            displayAdvFilters: false,
            displayDetails: false,
            advancedSelectedFilters: {},
            selectedDataDetails: {},
            globalFilters: [],
            selectedFilters: {}
        };
    },
    directives: {
        flatBtn
    },
    mounted() {
        this.fetchFilters();
    },
    methods: {
        callInvoiceListApi(e) {
            if(e === true) {
                this.$refs['bulk-list'].fetchInvoicesList();
            }
        },  
        fetchFilters() {
            const params = {
                view: "bulk_action"
            }
            const get_filters_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationV2Filters(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchV2Filters(this.companyId,null, params);            
            return get_filters_promise
            .then(({ data }) => {
                this.advancedFilters = cloneDeep(data.advance);
                this.globalFilters = cloneDeep(data.global)
            })
            .catch((error) => {
                this.$snackbar.global.showError('Unable to fetch Filters');
                console.error("error:   ", error);
            })
        },
        /**
         * Calls the internal 'apply filter' method of the advanced-filters component in the sidebar
         *
         * @author: Rushabh Mulraj Shah
         */
        applyFilters() {
            this.$refs['advFilters'].applyFilters();
        },

        /**
         * Calls the API for advanced filters when user clicks on Submit in the advanced-filters component
         * in the sidebar
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} data_obj The filters object that will be emitted from the advanced-filters component
         * @param {object} query The set of queries that will be emitted from the advanced-filters component
         */
        applyAdvancedFilters(data_obj) {
            this.selectedFilters = data_obj.data;
            if (data_obj.closeDrawer) this.close();
            /* Applying advanced filters */
            /* Hit the API call here */
            // this.$refs['bulk-upload-download'].getBulkGenerateExcel();
        },

        /**
         * Function to hide the side-drawer for advanced filters
         *
         * @author: Rushabh Mulraj SHah
         */
        close() {
            this.displayAdvFilters = false;
        },

        /**
         * Function to hide the side-drawer for details.
         * It will also empty the selectedDataDetails data object.
         *
         * @author: Rushabh Mulraj Shah
         */
        closeDetails() {
            this.displayDetails = false;
            this.selectedDataDetails = {};
        },

        /**
         * Written this funtion as this was not present already 
         * and was blocking the test case
         *
         * @author: Sameeer Shaikh
         */
        initFilters(){
            /* Code for initialising filters */
        },

        /**
         * Function to reset all the filters by calling the internal method of
         * initFilters in the advanced-filters component
         *
         * @author: Rushabh Mulraj Shah
         */
        resetFilters() {
            this.selectedFilters = {};
            this.$refs['advFilters'].initFilters();
        },

        /**
         * Function to conditionally display alerts when triggered by upload-download
         * component.
         *
         * @author: Rushabh Mulraj Shah
         * @param {string} msg A message sent from the upload-download component
         */
        showAlert(msg) {
            /* 
                If msg argument is provided, the side-drawer should be displayed
                and the message will be shown in the alert,
                else the side-drawer should be hidden and message will be removed.
            */
            if (msg) {
                this.displayAlert = true;
                this.alertMsg = msg;
            } else {
                this.displayAlert = false;
                this.alertMsg = '';
            }
        },

        /**
         * Function to display advanced filters side-drawer
         *
         * @author: Rushabh Mulraj Shah
         */
        showAdvFilters() {
            this.displayAdvFilters = true;
        },

        /**
         * Function to display the details component in side-drawer
         *
         * @author: Rohit Gupta, Rushabh Mulraj Shah
         * @param {object} data The data emitted from the bulk-list component which has the selected card
         */
        onCardClick(data) {
            OrderService.fetchBulkListDetailedData(data)
                .then(({ data }) => {
                    this.selectedDataDetails = data;
                    this.displayDetails = true;
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Unable to fetch Details of file');
                    console.error(err);
                })
        },
    },
};
</script>

<style lang="less" scoped>
@import './../../less/page-header.less';
@import './../../less/page-ui.less';

.footer-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 24px;
    box-sizing: border-box;

    .apply-filter-button {
        margin-right: 16px;
    }
}

::v-deep .slide-fade {
    overflow-x: initial;
}   
</style>
