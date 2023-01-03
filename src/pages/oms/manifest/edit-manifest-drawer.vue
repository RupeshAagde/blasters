<template>
    <div class="filters-section" @click="stopClick($event)">
        <div class="alert" v-if="displayAlert">
            <div class="alert-content">
                <ukt-inline-svg src="blue-info" />
                <span class="content-text">
                    Select shipments from the list to add this to the manifest
                </span>
            </div>
            <div class="action-section">
                <span class="action-text" @click="hideAlert">
                    Ok, Got It
                </span>
            </div>
        </div>

        <div class="input-container" v-if="manifestList.length > 0">
            <nitrozen-input
                :showSearchIcon="true"
                class="search filter-input-lg"
                type="search"
                :placeholder="'Search by Shipment ID'"
                v-model="searchText"
                @keyup.enter="onSearchInput"
            ></nitrozen-input>
        </div>

        <div class="manifest-container">
            <shimmer :count="4" v-if="fetchInProgress" />
            <div class="manifest-main-div" v-if="manifestList.length > 0 && !fetchInProgress">
                <div class="manifest-mid-wrapper">
                    <div class="manifest-list-wrapper">
                        <div class="manifest-list">
                            <span class="checkbox" @click="selectUnselectAllItem">
                                <nitrozen-checkbox :value="isAllSelected" />
                            </span>
                            <div class="manifest-list-heading">
                                Shipment ID
                            </div>
                        </div>
                        <div class="manifest-list">
                            <div class="manifest-list-heading">
                                Order ID
                            </div>
                        </div>
                        <div class="manifest-list">
                            <div class="manifest-list-heading">
                                Invoice Id
                            </div>
                        </div>
                        <div class="manifest-list">
                            <div class="manifest-list-heading">AWB</div>
                        </div>
                        <div class="manifest-list">
                            <div class="manifest-list-heading">Items</div>
                        </div>
                    </div>

                    <div class="manifest-list-wrapper-content">
                        <div
                            class="shipment-list-wrapper"
                            v-for="(manifest, index) in manifestList"
                            :key="index"
                        >
                            <div class="manifest-list">
                                <span class="checkbox boxcheck" @click="selectItem(index)">
                                    <nitrozen-checkbox :value="manifest.isSelected" />
                                </span>

                                <div class="manifest-list-heading">
                                    <p>{{ manifest.shipment_id }}</p>
                                    <p class="manifest-list-heading-date">
                                        {{ manifest.shipment_created_time }}
                                    </p>
                                </div>
                            </div>

                            <div class="manifest-list">
                                <div class="manifest-list-heading">
                                    {{ manifest.order_id }}
                                </div>
                            </div>

                            <div class="manifest-list">
                                <div class="manifest-list-heading">
                                    {{ manifest.invoice_id }}
                                </div>
                            </div>

                            <div class="manifest-list">
                                <div class="manifest-list-heading">
                                    {{ manifest.awb }}
                                </div>
                            </div>

                            <div class="manifest-list">
                                <div class="manifest-list-heading">
                                    {{ manifest.total_bags }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <nitrozen-pagination
                    v-model="pagination"
                    @change="onPaginationChange"
                    :pageSizeOptions="pageSizeOptions"
                />
            </div>
            <adm-no-content
                v-if="manifestList.length === 0 && !fetchInProgress"
                :helperText="`No shipments found for this manifest ${manifestId}`"
            />
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton, flatBtn, strokeBtn,
    NitrozenInput, NitrozenChips, NitrozenInline,
    NitrozenBadge, NitrozenCheckBox, NitrozenPagination
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import MirageAlert from '@/components/alert/index.vue';
import Shimmer from '@/components/common/shimmer.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Services imports */
import OrderService from '@/services/orders.service';



export default {
    name: 'edit-manifest-drawer',
    components: {
        NitrozenBadge,
        NitrozenButton,
        'nitrozen-checkbox': NitrozenCheckBox,
        NitrozenChips,
        NitrozenInput,
        NitrozenInline,
        NitrozenPagination,

        AdmNoContent,
        MirageAlert,
        'shimmer': Shimmer,
        UktInlineSvg
    },

    directives: { flatBtn, strokeBtn },

    props: {
        filters: {
            type: Object,
            default: {}
        },
        manifestId: {
            type: String
        }
    },

    computed: {
        isAllSelected() {
            return this.manifestList.every((v) => v.isSelected);
        },
        isAnySelected(){
            return this.manifestList.some((v) => v.isSelected)
        },

        /**
         * Method to check if the component is coming through company-wide
         * or through an application
         *
         * @author: Rushabh Mulraj Shah
         */
        isApplicationLevel() {
            return this.applicationId ? true : false;
        },
    },

    mounted() {
        this.fetchShipments({
            current: 1,
            page_size: 10
        });
    },

    data() {
        return {
            applicationId: this.$route.params.applicationId,
            displayAlert: false,
            fetchInProgress: false,
            fetchError: false,
            manifestList: [],
            pageSizeOptions: [10, 20, 50, 100, 200],
            pagination: {
                limit: 20,
                total: 1,
                current: 1,
            },
            searchText: '',
            totalShipments: 0
        };
    },

    methods: {
        addShipments() {
            let selectedManifests = this.manifestList.filter(item => item.isSelected).map(item => item.shipment_id);

            let data = {
                action: 'process',
                manifest_id: this.manifestId,
                filters: cloneDeep(this.filters),
                unique_id: new Date().getTime().toString()
            };
            if (data.filters.deselected_shipments) delete data.filters.deselected_shipments
            if(selectedManifests.length) data.filters['selected_shipments'] = selectedManifests.toString();
            if(selectedManifests.length == this.totalShipments) delete data.filters.selected_shipments

            this.$emit('update', data);
        },

        /**
         * Method to fetch the shipments that need to be added for a manifest
         *
         * @author: Rushabh Mulraj Shah
         * @param {Object} params The parameters object
         */
        fetchShipments(params = {}) {
            let finalParams = {
                ...params,
                exclude_manifest_id: true,
                group_entity: 'shipments',
                page_no: params.current || this.pagination.current,
                page_size: params.size || this.pagination.limit,
            };

            /* Delete params which are not required in the final request to API */
            if(params.current) delete finalParams.current;
            if(params.size) delete finalParams.size;

            if(!isEmpty(this.filters)) {
                finalParams = {
                    ...finalParams,
                    ...this.filters
                }
            };

            this.fetchInProgress = true;

            let request = this.isApplicationLevel
                ? OrderService.fetchApplicationShipmentV2List(
                      this.companyId,
                      this.applicationId,
                      finalParams
                  )
                : OrderService.fetchShipmentV2List(this.companyId, null, finalParams);

            request
            .then(response => {
                if(response.data && response.data.items && response.data.items.length > 0) {
                    this.displayAlert = true;
                    this.manifestList = cloneDeep(response.data.items).map(item => {
                        return {
                            ...item,
                            isSelected: false
                        };
                    });
                } else if(response.data && response.data.items && response.data.items.length === 0) {
                    this.manifestList = [];
                }

                if(response.data && response.data.page) {
                    this.pagination = {
                        ...response.data.page,
                        limit: response.data.page.size
                    }
                    this.totalShipments = response.data.page.total_count
                }

                if(response.data && response.data.page) {
                    this.pagination = {
                        ...response.data.page,
                        limit: response.data.page.size
                    }
                }
            })
            .catch(error => {
                console.error("Error in fetching shipments for a manifest:   ", error);
                this.$snackbar.global.showError(
                    `Unable to fetch the list of shipments for manifest ID: ${this.manifestId}`,
                    3000
                );
                this.fetchError = true;
            })
            .finally(() => {
                this.fetchInProgress = false;
            })
        },

        /**
         * This method will hide the alert.
         *
         * @author: Rushabh Mulraj Shah
         */
        hideAlert() {
            this.displayAlert = false;
        },

        /**
         * Handling pagination change and forwarding it to fetchManifestList
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} pageObj The event object received from nitrozen-pagination
         */
        onPaginationChange(pageObj) {
            let finalPaginationObj = {};
            let { current, limit } = cloneDeep(pageObj);

            finalPaginationObj = {
                'page_no': current,
                'page_size': limit
            }

            this.fetchShipments(finalPaginationObj);
        },

        /**
         * This method handles the cases when the user presses Enter in
         * the search bar
         *
         * @author: Rushabh Mulraj Shah
         */
        onSearchInput() {
            if(this.searchText.length > 0) {
                this.fetchShipments({
                    search_type: 'shipment_id',
                    search_value: this.searchText
                })
            } else this.fetchShipments();
        },

        selectItem: debounce(function (index) {
            this.$set(
                this.manifestList[index],
                'isSelected',
                !this.manifestList[index].isSelected
            );
            this.enableDisableConfirm()
        }, 150),

        selectUnselectAllItem: debounce(function () {
            /*@author Sameer shaikh
             *  This will selelt and unselect all items in the table
             */
            if (!this.isAllSelected) {
                this.manifestList.map((v) => this.$set(v, 'isSelected', true));
            } else {
                this.manifestList.map((v) => this.$set(v, 'isSelected', false));
            }
            this.enableDisableConfirm()
        }, 150),

        stopClick(event) {
            event.stopPropagation();
        },
        enableDisableConfirm(){
            if(this.isAnySelected){
                this.$emit('disableConfirm', false)
            }else{
                this.$emit('disableConfirm', true)
            }
        }
        
    }
};
</script>

<style lang="less" scoped>
.alert {
    background: #F5F8FF;
    border: 1px solid #2E31BE;
    border-radius: 4px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .alert-content {
        display: flex;
        column-gap: 12px;
        align-items: center;

        .content-text {
            font-size: 12px;
            line-height: 21px;
            font-weight: 400;
            font-family: 'Inter', sans-serif;
            color: #41434C;
        }
    }

    .action-section {
        .action-text {
            font-family: 'Inter';
            font-weight: 700;
            font-size: 12px;
            line-height: 21px;
            color: #2E31BE;
            cursor: pointer;
        }
    }
}

.filters-section {
    padding-bottom: 2rem;

    .input-container {
        margin: 1rem 0;
    }

    .manifest-container {
        width: 100%;

        .manifest-main-div {
            width: 100%;

            .manifest-mid-wrapper {
                margin-bottom: 1rem;

                .manifest-search {
                    padding: 24px 0px 16px 0px;

                    .manifest-search-heading {
                        padding-bottom: 18px;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 14px;
                    }

                    .check {
                        opacity: 0.9;
                    }
                }

                .manifest-list-wrapper {
                    padding: 16px;
                    display: grid;
                    grid-template-columns: 3fr 2fr 2fr 2fr 1fr;
                    background-color: #f6f6f6;
                    border: 1px solid #e5e5e5;
                    border-radius: 4px 4px 0px 0px;

                    .manifest-list {
                        text-align: left;
                        display: flex;

                        .manifest-list-heading {
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            color: #4d4d4e;
                            line-height: 17px;
                        }

                        .checkbox {
                            margin-right: 8px;
                        }
                    }
                }

                .manifest-list-wrapper-content {
                    border-radius: 0px 0px 4px 4px;
                    border-left: 1px solid #e0e0e0;
                    border-right: 1px solid #e0e0e0;
                    border-bottom: 1px solid #e0e0e0;
                    padding: 0px 16px;

                    .shipment-list-wrapper {
                        display: grid;
                        grid-template-columns: 3fr 2fr 2fr 2fr 1fr;
                        column-gap: 1rem;
                        padding: 16px 0px;
                        border-top: 1px solid #e0e0e0;

                        &:nth-child(1) {
                            border-top: none;
                        }

                        .manifest-list {
                            width: 32%;
                            text-align: left;
                            display: flex;

                            .manifest-list-heading {
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                color: #4d4d4e;
                                line-height: 17px;

                                img {
                                    object-fit: contain;
                                    width: 100%;
                                    height: 22px;
                                }

                                .application-name {
                                    text-align: center;
                                }
                            }

                            .manifest-list-heading-date {
                                font-style: normal;
                                font-weight: 400;
                                font-size: 12px;
                                color: #8d8e94;
                            }
                        }

                        .checkbox {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
    }
}

::v-deep .n-input {
    font-size: 12px;
}
</style>
