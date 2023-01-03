<template>
     <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">1. Select</span> Filters & <span class="bold-text">Download</span> the file from the Download button.
            </p>
        </template>
        <template #content>
            <div class="dropdowns-container">
                <nitrozen-dropdown
                    class="dropdown"
                    :searchable="true"
                    :items="filteredStores"
                    :label="'Fulfillment Centre'"
                    @searchInputChange="searchStore($event.text)"
                    v-model="selectedFulfillmentCentre"
                />
                <nitrozen-dropdown
                    :class="selectedStatus ? 'dropdown' : 'dropdown-first'"
                    :items="statuses"
                    :searchable="false"
                    :label="'Status'"
                    v-model="selectedStatus"
                />
                <nitrozen-dropdown
                    :class="selectedFileType ? 'dropdown' : 'dropdown-first'"
                    :items="fileTypes"
                    :searchable="false"
                    :label="'File Type'"
                    v-model="selectedFileType"
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

/* Mock imports */
import {
    fulfillmentCentres,
    statuses,
    fileTypes
} from '@/pages/oms/fixtures/dropdown-items.js';

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
            disableDownload: false,
            fileTypes: [],
            filteredStores: [],
            selectedFileType: null,
            selectedFulfillmentCentre: null,
            selectedStatus: null,
            statuses: [],
            fulfillingStoreFilter: [],
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
        this.getFulfillmentCenter();
        this.statuses = this.globalFilters[0].options;
        // this.fulfillmentCentres = cloneDeep(fulfillmentCentres);
        // this.statuses = cloneDeep(statuses);
        this.fileTypes = cloneDeep(fileTypes);
    },
    methods: {
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
        },
        getFulfillmentCenter() {
            let centerOfFulfillment = [];
            let params = {
                page_no: 1,
                page_size: 500
            };
            OrderService.getFulfillmentCenterV2(params)
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
                    this.$snackbar.global.showError('Unable to fetch fulfilment centres');
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
         * Function to emit download when the user clicks on download
         *
         * @author: Rushabh Mulraj Shah
         */
        onDownloadBtnClick() {
            this.$emit('download', [this.selectedFulfillmentCentre, this.selectedStatus, this.selectedFileType]);
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
