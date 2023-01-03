<template>
    <div class="bulk-list-container">
        <alert-box v-if="displayAlert" :text="alertMsg" />
        <bulk-actions-filters @filterChange="onFilterChange" />
        <div class="wrapper" v-if="!isEmpty(invoicesList) && !invoicesLoading">
            <div v-for="data in invoicesList" :key="data._id" class="invoices-list-container">
                <list-card 
                    :data="data"
                    :isProcessing="checkIfProcessing(data.invoice_status || '')" 
                    :isProcessed="checkIfProcessed(data)"
                    @refreshBulkListPage="refreshListPage($event)" 
                    @click="onCardClick" 

                />
            </div>
        </div>
        <adm-shimmer v-else-if="invoicesLoading" :count="4" />
        <div v-else>
            <adm-no-content
                helperText="No invoices list found"
                class="no-content" />
        </div>
        <nitrozen-pagination
            v-if="!isEmpty(invoicesList)"
            v-model="paginationObj"
            @change="onPaginationChange"
            :pageSizeOptions="[5, 10, 20, 50]"
        />
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { NitrozenPagination } from '@gofynd/nitrozen-vue';

/* Component imports */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import AlertBox from '@/pages/oms/bulk-actions/alert-box.vue'; 
import BulkActionsFilters from '@/pages/oms/bulk-actions/bulk-list/filters.vue';
import ListCard from '@/pages/oms/bulk-actions/list-card/index.vue'; 
import Loader from '@/components/common/loader.vue';

/* Services imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'bulk-list',
    components: {
        AdmNoContent,
        AdmShimmer,
        AlertBox,
        BulkActionsFilters,
        ListCard,
        Loader,
        NitrozenPagination
    },
    props: {
        displayAlert: Boolean,
        alertMsg: String
    },
    data() {
        return {
            invoicesLoading: false,
            invoicesList: [],
            paginationObj: {
                total: 0,
                current: 1,
                limit: 10,
            },
            params: {}
        }
    },
    mounted() {
        this.fetchInvoicesList();
    },
    methods: {
        checkIfProcessing(data) {
            if(data == "initiated") {
                return true;
            }
        },
        checkIfProcessed(data) {
            if(['success', 'failed', 'initated_but_failed'].includes(data.invoice_status || '') || data.do_invoice_label_generated == true) {
                return true;
            }
        },
        /**
         * Function to fetch the list of invoices by hitting the API with a set of params
         * 
         * @author: Rohit Gupta, Rushabh Mulraj Shah
         */
        fetchInvoicesList() {
            let newParams = this.params;
            this.invoicesLoading = true;

            /* params will be used in the actual API request */
            let finalParams = {
                page_size: this.paginationObj.limit,
                page_no: this.paginationObj.current,
                store_id: 357,
                ...newParams
            };
            let bulkActionListing = OrderService.fetchBulkActionList(finalParams)
            bulkActionListing
            .then(({data}) => {
                this.invoicesLoading = false;
                this.invoicesList = data.data;
                this.paginationObj = {
                    ...data.page,
                    limit: data.page.size
                };
            })
            .catch(error => {
                console.error("Error in fetching invoices list:  ", error);
                this.$snackbar.global.showError(
                    'We are facing some issues in fetching your invoices',
                    2000
                );
            })
        },

        /**
         * A reference function for lodash's isEmpty method
         */
        isEmpty,

        /**
         * Function to be called when the values of filters are changed.
         * The function will make some initial changes and hit the fetchInvoicesList
         * method.
         * 
         * @author: Rohit Gupta
         * 
         * @param {object} filtered_obj The object containing the selected filters
         */
        onFilterChange(filtered_obj) {
            this.params = filtered_obj;
            this.fetchInvoicesList();
            
            //this.fetchInvoicesList(filtered_obj);
        },

        /**
         * Function to be called when the values of pagination footer changes.
         * The function will make some initial changes and hit the fetchInvoicesList
         * method.
         * 
         * @author: Rohit Gupta
         * @param {object} event The native event object
         */
        onPaginationChange(event) {
            this.paginationObj = event
            this.fetchInvoicesList();
        },

        /**
         * Function to emit when the user has clicked on the card.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {object} data The data of the selected card to be sent to the parent
         */
        onCardClick(data) {
            this.$emit('click', data);
        },

        refreshListPage(e) {
            if(e == true) {
                this.fetchInvoicesList();
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.bulk-list-container {
    margin: 24px;
    padding: 24px;
    background: @White;
    font-family: 'Inter', sans-serif;
}

.invoices-list-container {
    width: 100%;
    margin-bottom: 1rem;
}
</style>
