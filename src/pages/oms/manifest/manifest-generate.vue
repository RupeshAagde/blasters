<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="true"
            @backClick="onAppBack"
            :title="'Generate Manifest'"
            :noContextMenu="true"
        >
            <div
                class="button-box"
                v-if="
                    manifestGenerated &&
                    totalShipments > 0 &&
                    shipmentList.length > 0
                "
            >
                <nitrozen-button
                    ref="save-btn"
                    v-strokeBtn
                    :theme="'secondary'"
                    class="more-filters"
                    :disabled="disableManifestGeneration"
                    @click="processSaveManifest('save')"
                    >Save
                </nitrozen-button>
                <nitrozen-button
                    ref="process-btn"
                    v-flatBtn
                    :theme="'secondary'"
                    class="more-filters"
                    :disabled="disableManifestGeneration"
                    @click="processSaveManifest('process')"
                    >Process
                </nitrozen-button>
            </div>
        </adm-page-header>

        <div class="main-container">
            <div class="page-container">
                <mirage-alert
                    :dismissible="false"
                    class="plain"
                    type="plain"
                    v-show="showAlert"
                >
                    <div class="alert-content">
                        <span class="text-icon">
                            <span class="space">
                                <ukt-inline-svg src="blue-info" />
                            </span>
                            Select a delivery partner (DP) from the dropdown below to generate manifest
                        </span>
                        <span
                            class="blue-button"
                            ref="generic-intro"
                            @click="hideAlert"
                        >
                            Okay, got it</span
                        >
                    </div>
                </mirage-alert>

                <div class="search-box">
                    <template>
                        <div class="filter-row search-div">
                            <nitrozen-dropdown
                                ref="delivery-partner-change"
                                label="Delivery Partner"
                                class="filter-dropdown filter-input-sm"
                                :searchable="true"
                                :items="dpOptions"
                                v-model="selectedDeliveryPartner"
                                @change="deliveryPartnerChange"
                                @searchInputChange="
                                    searchDeliveryPartners($event.text)
                                "
                            />

                            <nitrozen-dropdown
                                label="Fullfilment Location"
                                class="filter-dropdown filter-input-sm stores-dropdown"
                                :searchable="true"
                                :items="filteredStores"
                                v-model="selectedStore"
                                @change="fulfillmentStoreChange"
                                @searchInputChange="searchStore($event.text)"
                            />

                            <nitrozen-dropdown
                                label="Channels (Optional)"
                                class="filter-dropdown filter-input-sm"
                                :searchable="true"
                                :items="channelOptions"
                                v-model="selectedChannel"
                                @change="channelChange($event)"
                                @searchInputChange="searchChannels($event.text)"
                            />

                            <nitrozen-dropdown
                               v-if="pickupSlotOptions.length > 0"
                                label="Pickup slot (Optional)"
                                :placeholder="'Pickup slot'"
                                class="filter-dropdown filter-input-sm"
                                :searchable="true"
                                :items="pickupSlotOptions"
                                v-model="selectedPickupSlot"
                                @change="pickupSlotChange"
                            />
                        </div>
                    </template>
                </div>

                <div
                    class="manifest-container"
                    v-if="totalShipments > 0 && !inProgress"
                >
                    <div class="manifest-main-div">
                        <div class="manifest-mid-wrapper">
                            <div class="manifest-search">
                                <!-- && filterDelivery -->
                                <p class="manifest-search-heading">
                                    Select shipments to add to manifest
                                </p>

                                <mirage-alert
                                    :dismissible="false"
                                    ref="intro"
                                    class="plain"
                                    type="plain"
                                    v-if="
                                        showCheckboxAlert &&
                                        selectedShipmentCount > 0 && !isManifestGenerated
                                    "
                                >
                                    <div class="alert-content">
                                        <span class="text-icon">
                                            <span class="space">
                                                <ukt-inline-svg
                                                    src="blue-info"
                                                />
                                            </span>
                                            {{
                                                selectedShipmentCount ==
                                                totalShipments
                                                    ? 'All'
                                                    : ''
                                            }}
                                            {{ selectedShipmentCount }}
                                            {{
                                                selectedShipmentCount > 1
                                                    ? 'shipments'
                                                    : 'shipment'
                                            }}
                                            selected
                                            {{
                                                selectedShipmentCount ==
                                                paginationConfig.limit
                                                    ? 'from this page'
                                                    : ''
                                            }}
                                        </span>
                                        <span
                                            class="blue-button"
                                            @click="selectAllFromResponse"
                                            ref="checkbox-intro"
                                            v-if="showSelectAllResponse"
                                        >
                                            Select all
                                            {{ totalShipments }} Shipments</span
                                        >
                                    </div>
                                </mirage-alert>
                            </div>

                            <div
                                class="manifest-list-wrapper"
                                v-if="manifestGenerated"
                            >
                                <!-- && filterDelivery -->
                                <div
                                    class="manifest-list"
                                    v-for="(colName, index) in columns"
                                    :key="`${colName}-${index}`"
                                >
                                    <span
                                        v-if="index == 0"
                                        class="checkbox"
                                        @click="selectUnSelectAllItem"
                                    >
                                        <nitrozen-checkbox
                                            :value="isAllSelected"
                                            :disabled="isManifestGenerated"
                                        >
                                        </nitrozen-checkbox>
                                    </span>
                                    <div class="manifest-list-heading">
                                        {{ colName }}
                                    </div>
                                </div>
                            </div>

                            <div
                                class="manifest-list-wrapper-content"
                                v-if="manifestGenerated"
                            >
                                <!-- && filterDelivery -->
                                <div
                                    class="shipment-list-wrapper"
                                    v-for="(manifest, index) in shipmentList"
                                    :key="index"
                                >
                                    <div class="manifest-list">
                                        <span
                                            class="checkbox boxcheck"
                                            @click="selectItem(index)"
                                        >
                                            <nitrozen-checkbox
                                                :value="manifest.isSelected"
                                                :disabled="isManifestGenerated"
                                            >
                                            </nitrozen-checkbox>
                                        </span>
                                        <div class="manifest-list-heading">
                                            <p>{{ manifest.shipment_id }}</p>
                                            <p
                                                class="manifest-list-heading-date"
                                            >
                                                {{
                                                    convertToOMSDate(
                                                        manifest.shipment_created_time
                                                    )
                                                }}
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
                                            {{ manifest.items }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="pagination"
                                v-if="shipmentList && shipmentList.length"
                            >
                                <nitrozen-pagination
                                    class="page"
                                    @change="paginationChange"
                                    v-model="paginationConfig"
                                    :pageSizeOptions="pageSizeOptions"
                                    name="Shipments"
                                >
                                </nitrozen-pagination>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loader-container">
                    <shimmer v-if="inProgress" :count="4"></shimmer>
                </div>
                <adm-no-content
                    v-if="
                        !inProgress &&
                        totalShipments == 0 &&
                        shipmentList.length == 0 &&
                        !isIntialState
                    "
                    helperText="No shipments found"
                ></adm-no-content>
                <div class="empty-screen" v-if="isIntialState">
                    <inline-svg :src="'empty-orders'" />
                    <p>
                        To add shipment, select delivery partner, channels, and pickup slot
                    </p>
                </div>
                <transition name="slide">
                    <template v-if="uploadConsentView">
                        <div
                            class="slide-fade-upload"
                            ref="slide-fade-upload-consent"
                            @click="close($event)"
                        >
                            <div class="container">
                                <upload-consent-drawer
                                    :entryPoint="'generate'"
                                    :manifestId="manifestId"
                                    :manifestInfo="manifestInfo"
                                ></upload-consent-drawer>
                                <a class="cancel-btn" @click="close($event)">
                                    <ukt-inline-svg
                                        :src="'cross-black'"
                                    ></ukt-inline-svg>
                                </a>
                            </div>
                        </div>
                    </template>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import AdmInlineSVG from '@/components/common/inline-svg';
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import MirageAlert from '@/components/alert/index.vue';
import debounce from 'lodash/debounce';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import UploadConsentDrawer from './upload-consent-drawer.vue';
import OrderService from '@/services/orders.service';
import moment from 'moment';
import { convertToOMSDate } from '@/helper/utils.js';
import isEmpty from 'lodash/isEmpty';
import Shimmer from '@/components/common/shimmer';
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline,
    NitrozenPagination,
    strokeBtn,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
export default {
    name: 'generate-manifest-page',
    components: {
        'inline-svg': AdmInlineSVG,
        AdmPageHeader,
        NitrozenInput,
        flatBtn,
        NitrozenRadio,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenButton,
        NitrozenPagination,
        AdmNoContent,
        MirageAlert,
        'nitrozen-checkbox': NitrozenCheckBox,
        UktInlineSvg,
        'upload-consent-drawer': UploadConsentDrawer,
        Shimmer,
    },
    directives: { flatBtn, strokeBtn },
    computed: {
        isAllSelected() {
            return this.shipmentList.every((v) => v.isSelected);
        },
        isApplicationLevel() {
            return this.applicationId ? true : false;
        },
        ...mapGetters({
            // accessDetail: GET_EMPLOYEE_ACCESS_DETAIL,
            accessDetail: {},
        }),
        isAnySelected(){
            return this.shipmentList.some((v) => v.isSelected)
        },
    },
    mounted() {
        this.fetchFilters();
        this.getFulfillmentCenter();
    },
    data() {
        return {
            applicationId: this.$route.params.applicationId,
            columns: ['Shipment ID', 'Order ID', 'Invoice Id', 'AWB', 'Items'], // remove
            channelOptions: [],
            dpOptions: [],
            filteredStores: [],
            fulfillingStoreFilter: [],
            inProgress: false,
            isHeaderChecked: true, // remove
            isIntialState: true,
            keepRowsAllChecked: true,
            manifestGenerated: false,
            orignalDpOptions: [], //storing options here for looping filter of delivery partners
            orignalChannelOptions: [], //storing options here for looping filter of channels
            orderDateRange: [
                moment().subtract(13, 'weeks').toISOString(),
                moment().toISOString(),
            ],
            pickupSlotOptions: [],
            paginationConfig: {
                limit: 10,
                total: 1,
                current: 1,
            }, // remove
            pageSizeOptions: [10, 20, 50, 100, 200], // remove
            param: {},
            showSelectAllResponse: false, // remove
            selectedShipmentCount: 0,
            selectedShipment: [], // remove
            selectedDeliveryPartner: '',
            selectedChannel: '',
            selectedPickupSlot: '',
            selectedStore: '',
            showCheckboxAlert: false, // remove it
            shipmentList: [], // props
            showAlert: true,
            totalShipments: 0, // props
            unSelectedShipments: [], // remove
            uploadConsentView: false,
            manifestId: '',
            manifestInfo: [],
            isManifestGenerated: false,
            disableManifestGeneration: false
        };
    },
    methods: {
        convertToOMSDate,
        isEmpty,

        onAppBack() {
            this.$router.push({ name: 'company-order-manifest' });
        },

        /**
         * This funcion hold all the logic for payload creation of
         * save process manifest api call
         * @author Sameer Shaikh
         */
        processManifestParamBuilder(action) {
            /**
             * Cases that are handled in this function:
             * a) If the total shipment count == selectedShipment count then we will only send the filters.
             * b) If the total shipment count < slectedshipment count then we send either the selected shipments
             *  or unselected shipments whichever is lower.
             * c) The selected shipments count should always be > 0, otherwise throw an error.
             */

            let param = {
                action: action,
                unique_id: new Date().getTime().toString(),
                filters: {
                    lane: 'ready_for_dispatch',
                    date_range: {
                        from_date: moment(this.orderDateRange[0]).format(
                            'DD-MM-YYYY'
                        ),
                        to_date: moment(this.orderDateRange[1]).format(
                            'DD-MM-YYYY'
                        ),
                    },
                },
            };

            let globalParamClone = {
                dp_ids: () => {
                    if (this.param.dp_ids) {
                        param.filters['dp_ids'] = this.param.dp_ids;

                        let selectedOption = this.dpOptions.filter(
                            (i) => i.value == this.param.dp_ids
                        );
                        if(selectedOption && selectedOption[0] && selectedOption[0].name) {
                            param.filters['dp_name'] = selectedOption[0].name;
                        }
                    }
                },
                stores: () => {
                    if (this.param.stores) {
                        param.filters['stores'] = this.param.stores;
                        let selectedOption = this.filteredStores.filter(
                            (i) => i.value == this.param.stores
                        );

                        if(selectedOption && selectedOption[0] && selectedOption[0].name) {
                            param.filters['store_name'] = selectedOption[0].name;
                        }
                    }
                },
                sales_channels: () => {
                    if (this.param.sales_channels) {
                        param.filters[
                            'sales_channels'
                        ] = this.param.sales_channels;

                        let selectedOption = this.channelOptions.filter(
                            (i) => i.value == this.param.sales_channels
                        );

                        if(selectedOption && selectedOption[0] && selectedOption[0].name) {
                            param.filters['sales_channels_name'] = selectedOption[0].name;
                        }
                    }
                },
                pickup_slot: ()=> {
                    if(!isEmpty(this.selectedPickupSlot)){
                     param.filters['pickup_slot_start_time'] = this.selectedPickupSlot.start_time
                     param.filters['pickup_slot_end_time'] = this.selectedPickupSlot.end_time
                    }
                }
            };
            Object.keys(globalParamClone).forEach((item) => {
                globalParamClone[item]();
            });

            switch (this.payloadFinder()) {
                case 'deselected_shipments':
                    param.filters[
                        'deselected_shipments'
                    ] = this.unSelectedShipments.toString();
                    break;
                case 'selected_shipments':
                    param.filters[
                        'selected_shipments'
                    ] = this.selectedShipment.toString();
                    break;
                case 'validation_error':
                    this.$snackbar.global.showError(
                        'Please select shipment through the checkboxes'
                    );
            }

            return param;
        },

        /**
         * A method to create the payload and then hit the API for saving/processing a manifest.
         *
         * @author: Sameer Shaikh
         */
        processSaveManifest(action) {   
            if(this.isManifestGenerated){
                if(action == 'save'){
                    this.$router.push({ name: 'company-order-manifest' });
                } else if (action == 'process'){
                    this.uploadConsentView = true;
                }
            }else {
                const save_process_promise = OrderService.saveProcessManifest(this.companyId,this.processManifestParamBuilder(action));
                return save_process_promise
                .then((res) => {
                    if(res.data && res.data.items && res.data.items.manifest_id) {
                        this.manifestId = res.data.items.manifest_id;
                    }
                    /** 
                     * If the response shows the Manifest ID, it's a clear confirmation that 
                     * manifest has been generated.
                     */
                    if(res.data && res.data && res.data.items && res.data.items.manifest_id) {
                        this.isManifestGenerated = true;
                    }
                    if (action == 'save') {
                        this.$router.push({ name: 'company-order-manifest' });
                        this.$snackbar.global.showSuccess(`Manifest generated successfully`);
                    } else if (action == 'process') {
                        OrderService.fetchManifestDetails({manifest_id:this.manifestId}).then((res)=> {
                            if(res && res.data && res.data.manifest_details && res.data.manifest_details[0]) {
                                this.manifestInfo = res.data.manifest_details[0];
                            }
                        }).catch((err)=> {
                            console.error('Error in fetching manifest details', err);
                        }).finally(()=>{
                            this.uploadConsentView = true;
                        })
                        // reset the data here
                    }
                })
                .catch((error) => {
                    console.error(
                        'Error received in saving/processing manifests:   ',
                        error
                    );
                    this.$snackbar.global.showError(
                        `Unable to save/process your manifest`,
                        3000
                    );
                });

            }
   
        },

        deliveryPartnerChange() {
            this.param['dp_ids'] = parseInt(this.selectedDeliveryPartner);
            this.fetchShipments('filterChange');
            this.fetchPickupSlot()

        },

        channelChange(e) {
            this.param['sales_channels'] = this.selectedChannel;
            this.fetchShipments('filterChange');
            this.fetchPickupSlot()
        },

        pickupSlotChange() {
          if(!isEmpty(this.selectedPickupSlot)){
            this.param['pickup_slot_start_time'] = this.selectedPickupSlot.start_time
            this.param['pickup_slot_end_time'] = this.selectedPickupSlot.end_time
            this.fetchShipments('filterChange');
          }

        },

        paginationChange(e) {
            this.param['page_no'] = this.paginationConfig.current;
            this.param['page_size'] = this.paginationConfig.limit;
            this.fetchShipments('paginationChange');
        },

        hideAlert() {
            this.showAlert = false;
        },

        selectAllFromResponse() {
            this.selectedShipmentCounter(this.totalShipments);
            this.dispalyButtonSelectAllFromResponse(false);
            this.keepRowsAllChecked = true;
            this.$snackbar.global.showSuccess(
                `All ${this.selectedShipmentCount} shipments selected`
            );
            this.shipmentList.map((v) => this.$set(v, 'isSelected', true));
            this.resetShipmentArray();
        },

        dispalyButtonSelectAllFromResponse(bolleanVlaue) {
            this.showSelectAllResponse = bolleanVlaue;
        },

        selectItem: debounce(function (index) {
            this.dispalyButtonSelectAllFromResponse(false);
            this.$set(
                this.shipmentList[index],
                'isSelected',
                !this.shipmentList[index].isSelected
            );
            if (this.shipmentList[index].isSelected) {
                this.addRemoveFromArray(
                    'addOne',
                    this.shipmentList[index].shipment_id
                );
            } else {
                this.addRemoveFromArray(
                    'removeOne',
                    this.shipmentList[index].shipment_id
                );
            }
            this.enableDisableConfirm()
        }, 150),

        selectUnSelectAllItem: debounce(function () {
            this.keepRowsAllChecked = false;
            this.isHeaderChecked = false; // keep it true in selelct all from response
            this.resetShipmentArray();

            if (!this.isAllSelected) {
                // this.isHeaderChecked = true;
                // select all
                this.dispalyButtonSelectAllFromResponse(true);
                this.shipmentList.map((v) => this.$set(v, 'isSelected', true));
                this.addRemoveFromArray('addAll');
                if (this.selectedShipmentCount == this.totalShipments) {
                    this.dispalyButtonSelectAllFromResponse(false);
                }
            } else {
                // this.isHeaderChecked = false;
                this.dispalyButtonSelectAllFromResponse(false);
                this.shipmentList.map((v) => this.$set(v, 'isSelected', false));
                // removing from unselected items selected array
                this.addRemoveFromArray('removeAll');
                this.showCheckboxAlert = true;
            }
            this.enableDisableConfirm()
        }, 150),

        resetShipmentArray() {
            this.selectedShipment = [];
            this.unSelectedShipments = [];
        },

        resetCache() {
            this.keepRowsAllChecked = true;
            this.totalShipments = 0;
        },

        /**
         * A method to create mapped values that will conditionally define what should be
         * added to the payload for processing/saving manifest.
         *
         * @author: Sameer Shaikh
         * @return A value that will conditionally define what needs to be sent in payload
         * @see processSaveManifest()
         */
        payloadFinder() {
            if (
                this.keepRowsAllChecked &&
                this.unSelectedShipments.length == 0 &&
                this.selectedShipment.length == 0
            ) {
                /**
                 * This applies to the scenario when all the rows are checked,
                 * and no shipments are manually selected/deselected by the user,
                 * or if the selections are brought back to the default state.
                 */
                return 'filters_only';
            } else if (
                this.keepRowsAllChecked &&
                this.unSelectedShipments.length > 0
            ) {
                /**
                 * This applies to the scenario when all the rows are checked,
                 * but the user has deselected some rows
                 */
                return 'deselected_shipments';
            } else if (
                this.isHeaderChecked &&
                this.selectedShipment.length > 0
            ) {
                /**
                 * This applies to the scenario when all the rows are checked,
                 * but the user has selected some values
                 */
                return 'selected_shipments';
            } else if(!this.isHeaderChecked && this.selectedShipment.length > 0){
                return 'selected_shipments';
            }
            else if (
                !this.isHeaderChecked &&
                !this.keepRowsAllChecked &&
                this.unSelectedShipments.length == 0 &&
                this.selectedShipment.length == 0
            ) {
                /**
                 * This applies to the scenario when all the rows are not checked,
                 *
                 */
                return 'validation_error';
            }
        },

        addRemoveFromArray(action, shipment) {
            if (action == 'addAll') {
                this.shipmentList.forEach((row) => {
                    if (
                        row.isSelected &&
                        !this.selectedShipment.includes(row.shipment_id)
                    ) {
                        this.selectedShipment.push(row.shipment_id);
                    }
                });

                this.selectedShipmentCounter(this.selectedShipment.length);
                this.isHeaderChecked = true;
            } else if (action == 'removeAll') {
                this.selectedShipmentCounter(0);
            } else if (action == 'addOne') {
                if (!this.keepRowsAllChecked) {
                    /* If all of the rows are not selected */
                    this.selectedShipment.push(shipment);
                    this.selectedShipmentCounter(this.selectedShipment.length);
                } else if (this.isHeaderChecked) {
                    /* If table header is checked */
                    let index = this.unSelectedShipments.indexOf(shipment);
                    this.unSelectedShipments.splice(index, 1);
                    this.selectedShipmentCounter(
                        this.totalShipments - this.unSelectedShipments.length
                    );
                }
            } else if (action == 'removeOne') {
                /* This block code  runs only when user unchecks a row in a table */
                let index = this.selectedShipment.indexOf(shipment);
                this.selectedShipment.splice(index, 1);
                this.unSelectedShipments.push(shipment);

                if (this.keepRowsAllChecked) {
                    /* If all rows are checked then we will show the count after subtracting unselected rows */
                    this.selectedShipmentCounter(
                        this.totalShipments - this.unSelectedShipments.length
                    );
                } else {
                    this.selectedShipmentCounter(this.selectedShipment.length);
                }
            }
        },

        close: function (e) {
            e.stopPropagation();
            this.uploadConsentView = false;
        },

        /**
         * Method to handle events where the user attempts to search for a store.
         * We use debounce to handle the speed which which the text is receieved &
         * sent forward for the API request.
         *
         * @author: Sameer Shaikh, Rushabh Mulraj Shah
         * @param {String} text The text entered by the user.
         */
        searchStore: debounce(function (text) {
            if (!text) {
                if (this.param.stores) {
                    delete this.param.stores; // deleting stores from global param and then making an api call
                }

                this.fetchShipments('filterChange');
            }

            text = text ? text.toLowerCase() : text;
            if (text) {
                this.getFulfillmentCenter({ q: text });
            } else {
                this.getFulfillmentCenter();
                this.selectedStore = '';
                // this.filteredStores = this.fulfillingStoreFilter;
            }
        }, 500),

        searchChannels(text) {
            let data = [];
            if (isEmpty(text)) {
                this.channelOptions = this.orignalChannelOptions;
                if (this.param.sales_channels) {
                    delete this.param.sales_channels; // deleting sales_chanel from global param and then making an api call
                }
                this.fetchShipments('filterChange');
            } else {
                data = this.orignalChannelOptions.filter((item) => {
                    return item.text.toLowerCase().includes(text.toLowerCase());
                });
                if (!isEmpty(data)) {
                    this.channelOptions = data;
                } else {
                    this.channelOptions = this.orignalChannelOptions;
                }
            }
        },

        searchDeliveryPartners(text) {
            let data = [];
            if (isEmpty(text)) {
                this.dpOptions = this.orignalDpOptions;
                if (this.param.dp_ids) {
                    delete this.param.dp_ids; // deleting dp_id from global param and then making an api call
                    this.selectedDeliveryPartner = '';
                }
                this.fetchShipments('filterChange');
            } else {
                data = this.orignalDpOptions.filter((item) => {
                    return item.text.toLowerCase().includes(text.toLowerCase());
                });
                if (!isEmpty(data)) {
                    this.dpOptions = data;
                } else {
                    this.dpOptions = this.orignalDpOptions;
                }
            }
        },
        fulfillmentStoreChange() {
            this.param['stores'] = this.selectedStore;
            this.fetchShipments('filterChange');
        },

        selectedShipmentCounter(count) {
            this.selectedShipmentCount = count;
        },

        defaultPayloadCreation() {
            this.param['group_entity'] = 'shipments';
            this.param['page_no'] = this.paginationConfig.current;
            this.param['page_size'] = this.paginationConfig.limit;
            this.param['from_date'] = moment(this.orderDateRange[0]).format(
                'DD-MM-YYYY'
            );
            this.param['to_date'] = moment(this.orderDateRange[1]).format(
                'DD-MM-YYYY'
            );
            this.param['lane'] = 'ready_for_dispatch';
            this.param['exclude_manifest_id'] = true;
            this.param['exclude_locked_shipments'] = true;
        },

        fetchShipments(changeType) {
            let canMakeReq =
                this.param.dp_ids !== '' &&
                this.param.dp_ids !== undefined &&
                this.param.stores !== '' &&
                this.param.stores !== undefined; //&&
            // this.param.sales_channels !== '' &&  uncomment this part of code when we get sales channle in options neha has context about it
            // this.param.sales_channels !== undefined;

            if (changeType === 'filterChange') {
                this.resetShipmentArray();
                this.resetCache();
            }

            this.defaultPayloadCreation();

            if (canMakeReq) {
                this.isIntialState = false;
                this.inProgress = true;
                const get_shipment_promise = this.isApplicationLevel
                    ? OrderService.fetchApplicationShipmentV2List(
                          this.companyId,
                          this.applicationId,
                          this.param
                      )
                    : OrderService.fetchShipmentV2List(
                          this.companyId,
                          null,
                          this.param
                      );

                return get_shipment_promise
                    .then(({ data }) => {
                        this.pageError = false;
                        this.shipmentList = data.items.map((row) => {
                            let data = {
                                shipment_id: row.shipment_id,
                                shipment_created_time: row.shipment_created_at,
                                order_id: row.order_id,
                                invoice_id: row.invoice_id,
                                awb: '',
                                items: row.total_bags,
                            };

                            if(row.dp_details && row.dp_details.awb_no) {
                                data['awb'] = row.dp_details.awb_no;
                            }

                            if (
                                this.selectedShipment.length > 0 &&
                                this.selectedShipment.includes(row.shipment_id)
                            ) {
                                data['isSelected'] = true;
                            } else if (
                                this.unSelectedShipments.length > 0 &&
                                this.unSelectedShipments.includes(
                                    row.shipment_id
                                )
                            ) {
                                data['isSelected'] = false;
                            } else {
                                data['isSelected'] = this.keepRowsAllChecked;
                            }
                            return data;
                        });
                        this.manifestGenerated = true;
                        this.totalShipments = data.total_count;
                        if (
                            this.paginationConfig.current == 1 &&
                            this.selectedShipment.length == 0 &&
                            this.unSelectedShipments.length == 0 // if any issues come remove
                        ) {
                            this.selectedShipmentCounter(this.totalShipments);
                        }
                        this.showAlert = false;
                        this.showCheckboxAlert = true;
                        this.paginationConfig = {
                            limit: data.page ? data.page.size : 10,
                            current: data.page ? data.page.current : 1,
                            total: data.page.total,
                        };
                    })
                    .catch((error) => {
                        this.$snackbar.global.showError(
                            'Unable to fetch shipment listing'
                        );
                        this.pageError = true;
                        this.errorText = 'Unable to fetch shipment listing';
                        console.error(
                            'Error in fetching the list of shipments:   ',
                            error
                        );
                    })
                    .finally(() => {
                        this.isInitialLoad && (this.isInitialLoad = false);
                        this.inProgress = false;
                    });
            } else {
                // this.$snackbar.global.showError(
                //     'To fetch manifests, you need to select both the delivery partner and the fulfillment store and sales channel',
                //     1000
                // );
            }
        },

        getFulfillmentCenter(params = {}) {
            let centerOfFulfillment = [];
            params = {
                page_no: 1,
                page_size: 500,
                ...params
            };
            OrderService.getFulfillmentCenterV2(params)
                .then(({ data }) => {
                    centerOfFulfillment = data.items.map((center) => ({
                        value: center.uid,
                        name: center.display_name,
                        code: center.code,
                        text: center.display_name.concat(
                            ' (',
                            center.code,
                            ')'
                        ),
                    }));
                    if(
                        this.accessDetail && 
                        this.accessDetail.store_access &&
                        this.accessDetail.store_access.values &&
                        this.accessDetail.store_access.values.length > 0) {
                        centerOfFulfillment = centerOfFulfillment.filter((item)=>  this.accessDetail.store_access.values.includes(item.value))
                    }
                    this.filteredStores = centerOfFulfillment;
                    this.fulfillingStoreFilter = centerOfFulfillment;
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Unable to fetch fulfilment locations'
                    );
                    console.error(
                        `Error in fetching the list of fulfillment locations:   ${err}`
                    );
                });
        },
        fetchPickupSlot(){
            let canMakeReq =
                this.param.dp_ids !== '' &&
                this.param.dp_ids !== undefined &&
                 this.param.sales_channels !== '' &&
                 this.param.sales_channels !== undefined;
                 let param = {
                    dp_id: this.param.dp_ids,
                    sales_channel: this.param.sales_channels

                 }
            if(canMakeReq){
            OrderService.fetchPickupSlot(param).then(res=> {
                if(res.data.pickup_slots){
                    this.pickupSlotOptions = res.data.pickup_slots.map(item => {
                        return {text: item.value, value:{'start_time': item.start_time, 'end_time': item.end_time}}
                    }
                   )
                }
            }).catch(err =>{
                console.error("Error in fetching pickup slot:    ", err);
            })

            }

        },

        fetchFilters() {
            const params = {
                view: 'manifest',
            };

            const get_filters_promise = this.isApplicationLevel
                ? OrderService.fetchApplicationV2Filters(
                      this.companyId,
                      this.applicationId,
                      params
                  )
                : OrderService.fetchV2Filters(this.companyId, null, params);
            return get_filters_promise
                .then(({ data }) => {
                    let advFilters = data.advance;
                    this.channelOptions = advFilters[0].options;
                    this.orignalChannelOptions = advFilters[0].options;
                    this.dpOptions = advFilters[1].options;
                    this.orignalDpOptions = advFilters[1].options;
                })
                .catch((error) => {
                    this.$snackbar.global.showError('Unable to fetch filters');
                    console.error('Error in fetching the filters:   ', error);
                });
        },
        enableDisableConfirm(){
            if(this.isAnySelected){
                this.disableManifestGeneration = false;
            }else{
               this.disableManifestGeneration = true;
            }
        }
    },
};
</script>

<style lang="less" scoped>
@import '../../less/page-header.less';
@import '../../less/page-ui.less';

.button-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 14rem;

    @media @mobile {
        margin-left: 24px;
    }
}

.slide-fade-upload {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @shipmentDrawer;

    .container {
        position: absolute;
        right: 0px;
        width: auto;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        overflow-x: hidden;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

        &::-webkit-scrollbar {
            display: none;
        }

        @media @mobile {
            position: fixed;
            width: 100%;
        }

        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            margin: 13px 10px 0px 0px;
            cursor: pointer;
        }
    }
}

::v-deep .cl-DustyGray2 {
    color: #41434c;
    font-size: 16px;
    font-family: 'Inter';
}

::v-deep .dark-sm {
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
}

::v-deep .mirage-alert-plain {
    background-color: #f5f8ff;
    font-weight: 400;
    font-family: Inter;
    font-size: 13px;
}

.plain {
    width: 100%;
    background-color: #f5f8ff;
    color: #666666;
    margin-bottom: 24px;

    .alert-content {
        width: 100%; //will be removed after removing close icon
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #41434c;
        font-size: 13px;
        font-family: 'Inter';
        line-height: 21px;

        .text-icon {
            display: flex;
            align-items: center;

            .space {
                margin-right: 10px;
            }
        }

        .blue-button {
            font-family: Inter;
            font-weight: 700;
            font-size: 13px;
            color: #2e31be;
            cursor: pointer;
        }
    }
}

.empty-screen {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 1rem;
    min-height: 50vh;
}

.page-container {
    box-sizing: border-box;
    height: 100%;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }
    .loader-container {
        width: 100%;
    }
    .manifest-container {
        width: 100%;

        .manifest-main-div {
            width: 100%;

            .manifest-mid-wrapper {
                .plain {
                    width: 98%;
                    margin-top: 24px;
                    background-color: #f5f8ff;
                    color: #666666;
                }

                .manifest-search {
                    .manifest-search-heading {
                        margin-bottom: 16px;
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
                    display: flex;
                    justify-content: space-between;
                    background-color: #f6f6f6;
                    border: 1px solid #e5e5e5;
                    border-radius: 4px 4px 0px 0px;

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
                        display: flex;
                        justify-content: space-between;
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
                .pagination {
                    margin-top: 20px;
                }
            }
        }
    }

    .pagination-div {
        width: 100%;

        .pagination-main {
            margin-top: 40px;
            width: 100%;
        }
    }

    .alert-content {
        width: 100%; //will be removed after removing close icon
        display: flex;
        justify-content: space-between;
        align-items: center;

        .retry-button {
            background-color: red;
            margin-right: 8px;
        }
    }

    .right-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        min-height: 50px;
        padding-top: 10px;

        .advanced-filter {
            position: relative;
            padding-left: 20px;
            cursor: pointer;

            .filter-applied-indicator {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 100%;
                background: #e9783d;
                top: -2px;
                right: -3px;
            }
        }
    }

    .content-container {
        width: 100%;
        margin-top: 12px;

        // @TODO Remove CSS above this line if not used
        .slide-fade {
            height: 100%;
            position: fixed;
            top: 0px;
            right: 0px;
            width: 100%;
            background-color: rgba(82, 78, 78, 0.52);
            z-index: @shipmentDrawer;

            .container {
                position: absolute;
                right: 0px;
                width: 30%;
                height: 100%;
                background: @White;
                overflow-y: scroll;
                overflow-x: hidden;
                box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);

                &::-webkit-scrollbar {
                    display: none;
                }

                @media @mobile {
                    position: fixed;
                    width: 100%;
                }

                .cancel-btn {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    margin: 13px 10px 0px 0px;
                    cursor: pointer;
                }
            }
        }

        .drawer-view {
            height: 100%;
            position: fixed;
            // top: 64px; // To expose header
            top: 0px;
            right: 0px;
            width: 100%;
            background-color: rgba(82, 78, 78, 0.52);
            z-index: @shipmentDrawer;

            .drawer-container {
                background-color: #ffffff;
                position: absolute;
                right: 0px;
                width: calc(100% - 600px);
                height: 100%;
                overflow-y: scroll;
                box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
                &::-webkit-scrollbar {
                    display: none !important;
                }
                @media @mobile {
                    position: fixed;
                    width: 100%;
                }
            }

            .cancel-btn {
                position: absolute;
                top: 24px;
                right: 20px;
                cursor: pointer;
            }
        }
    }

    .search-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 24px;

        ::v-deep .nitrozen-select,
        ::v-deep .n-input,
        ::v-deep .nitrozen-select__trigger {
            border-radius: 4px;
        }

        .search {
            min-width: 400px;
            width: 40%;

            @media @mobile {
                min-width: 100%;
            }
        }

        .filter-group {
            .more-filters-button {
                margin: 20px 0 0 12px;
            }

            .more-filters {
                position: absolute;
                right: 48px;
                top: 230px;
                border: 1px solid @Iron;
                border-radius: 4px;
                padding: 12px;
                background: @White;
                box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
                z-index: 1;

                .more-filter-item {
                    margin-bottom: 10px;
                }
            }

            .more-filter-item {
                width: 250px;

                @media @mobile {
                    width: 100%;
                    margin-left: 0px;
                }
            }
        }

        .filter-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            width: 100%;
            font-size: 14px;
            margin-top: 8px;

            @media @mobile {
                flex-direction: column;
            }

            .filter-input-sm {
                min-width: 120px;
                width: 20%;

                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-lg {
                min-width: 250px;
                width: 55%;

                @media @mobile {
                    width: 100%;
                }
            }

            .filter-input-dr {
                min-width: 120px;
                width: 20%;

                @media @mobile {
                    width: 100%;
                }
            }

            .filter-dropdown {
                min-width: 10vw;
                width: 26vw;

                ::v-deep .nitrozen-select-wrapper {
                    height: 40px;

                    .nitrozen-select {
                        height: 40px;

                        .nitrozen-select__trigger {
                            .nitrozen-searchable-input-container {
                                ::-webkit-search-cancel-button {
                                    margin-right: -8px;
                                    margin-left: 20px;
                                }
                            }
                        }
                    }
                }

                ::v-deep .nitrozen-checkbox-container {
                    height: 30px !important;
                }

                ::v-deep .nitrozen-option-image {
                    height: 20px;
                }

                &.channel-dropdown {
                    width: 120px;
                }
            }
        }
    }
}

.stores-dropdown {
    ::v-deep .nitrozen-option-container {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}
</style>
