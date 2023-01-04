<template>
    <div class="panel">
        <details-header
            :hasAttachment="manifestHasAttachment"
            :manifestId="manifestId"
            :manifestStatus="manifestStatus"
            :showSaveProcessButtons="
                manifestStatus !== 'invalidate' && checkBoxUpdated
            "
            :selectedShipmentCount="selectedShipmentCount"
            @saveProcess="saveProcessManifest($event)"
            @back="onAppBack"
        />

        <div
            class="main-container"
            v-if="!noManifestId && !manifestFetchInProgress"
        >
            <div class="page-container">
                <details-info
                    :data="manifestInfo"
                    :manifestDetailsShipmentCount="manifestDetailsShipmentCount"
                    v-if="!isEmpty(manifestInfo)"
                />

                <div class="list-information-txt">
                    <p class="info-text">
                        {{
                            shipmentsList.length > 0 ? 'List of Shipments' : ''
                        }}
                    </p>
                    <loader class="loading" v-if="consentDownloading"></loader>
                    <nitrozen-button
                        ref="open-edit-manifest-drawer"
                        v-strokeBtn
                        :theme="'secondary'"
                        class="more-filters"
                        @click="openEditManifestDrawer"
                        v-if="
                            additionalShipmentCount > 0 &&
                            manifestStatus !== 'complete'
                        "
                        >Add Shipments ({{ additionalShipmentCount }})
                    </nitrozen-button>

                    <nitrozen-button
                        v-flatBtn
                        :theme="'secondary'"
                        @click="downloadConsent"
                        v-if="
                            manifestStatus == 'complete' &&
                            consentDownloadUrl !== ''
                        "
                    >
                        Download
                    </nitrozen-button>
                    <nitrozen-button
                        v-flatBtn
                        :theme="'secondary'"
                        @click="uploadConsent"
                        v-if="
                            manifestStatus == 'complete' &&
                            consentDownloadUrl == ''
                        "
                    >
                        Upload
                    </nitrozen-button>
                </div>

                <div class="input-container" v-if="shipmentsList.length">
                    <nitrozen-input
                        :showSearchIcon="true"
                        class="search filter-input-lg"
                        type="search"
                        :placeholder="'Search by Shipment ID'"
                        v-model="shipmentSearchText"
                        @blur="onSearch"
                        @keyup.enter="onSearch"
                    ></nitrozen-input>
                </div>
                <details-shipments
                    v-if="shipmentsList.length"
                    :shipmentsList="shipmentsList"
                    :pagination="pagination"
                    :selectedShipmentCount="selectedShipmentCount"
                    :hasManifestFetched="hasManifestFetched"
                    :isIntialState="isIntialState"
                    :checkboxShipmentData="checkboxShipmentData"
                    :manifestFetchInProgress="manifestFetchInProgress"
                    :keepRowsAllChecked="keepRowsAllChecked"
                    :totalShipments="totalShipments"
                    :isHeaderChecked="isHeaderChecked"
                    :manifestStatus="manifestStatus"
                    @paginationChange="paginationChange"
                    @fetchManifest="fetchManifest($event)"
                    @keepAllRowsCheckedEvent="keepAllRowsCheckedEvent($event)"
                    @updateSelectedShipmentCount="
                        updateSelectedShipmentCount($event)
                    "
                    @updateCheckBoxValue="updateCheckBoxValue($event)"
                    @headerCheckEvent="headerCheckEvent"
                    @checkBoxEvent="checkBoxEvent($event)"
                    @showSelectAllResponseEvent="
                        showSelectAllResponseEvent($event)
                    "
                />

                <adm-no-content
                    v-else-if="shipmentsList.length === 0"
                    :helperText="`No shipments found for Manifest ID: ${this.manifestId}`"
                ></adm-no-content>

                <transition name="slide">
                    <template v-if="editShipmentView">
                        <side-drawer
                            :title="'Add Shipments'"
                            @close="close($event)"
                            :footer="true"
                            :css="{ width: '65%' }"
                        >
                            <edit-manifest-drawer
                                ref="add-shipments"
                                :filters="detailsFilters"
                                :manifestId="manifestId"
                                @update="updateCurrentManifest"
                                @disableConfirm="disableShipmentAdditionConfirmation"
                            />

                            <template #footer>
                                <div class="drawer-footer-container">
                                    <nitrozen-button
                                        theme="secondary"
                                        v-flatBtn
                                        @click="onAddShipmentConfirm"
                                        :disabled="disableShipmentAddition"
                                    >
                                        Confirm
                                    </nitrozen-button>
                                </div>
                            </template>
                        </side-drawer>
                    </template>
                </transition>
                <transition name="slide">
                    <template v-if="uploadConsentView">
                        <div
                            class="slide-fade-upload"
                            ref="slide-fade-upload-consent"
                            @click="closeConsent($event)"
                        >
                            <div class="container">
                                <upload-consent-drawer
                                    :entryPoint="'details'"
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

        <div class="shimmer-container">
            <shimmer v-if="manifestFetchInProgress" :count="4" />
            <adm-page-error
                v-else-if="noManifestId && !manifestFetchInProgress"
                @tryAgain="fetchManifestDetails"
            />
        </div>
    </div>
</template>
<script>
/* Package imports */
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenChips,
    NitrozenInline,
    NitrozenBadge,
    NitrozenPagination,
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import AdmNoContent from '@/components/common/adm-no-content.vue';
import AdmPageError from '@/components/common/page-error.vue';
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import EditManifestDrawer from '../edit-manifest-drawer.vue';
import ManifestDetailsHeader from '@/pages/oms/manifest/manifest-details/manifest-details-header.vue';
import ManifestDetailsShipments from '@/pages/oms/manifest/manifest-details/manifest-details-shipments.vue';
import ManifestDetailsInfo from '@/pages/oms/manifest/manifest-details/manifest-details-info.vue';
import SideDrawer from '@/pages/oms/bulk-actions/side-drawer.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import UploadConsentDrawer from '../upload-consent-drawer.vue';
import loader from '@/components/common/loader.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

export default {
    name: 'manifest-detail-page',
    components: {
        AdmNoContent,
        AdmPageHeader,
        AdmPageError,
        'edit-manifest-drawer': EditManifestDrawer,
        'details-header': ManifestDetailsHeader,
        'details-shipments': ManifestDetailsShipments,
        'details-info': ManifestDetailsInfo,
        NitrozenBadge,
        NitrozenButton,
        NitrozenChips,
        NitrozenDropdown,
        NitrozenInline,
        NitrozenInput,
        NitrozenPagination,
        NitrozenRadio,
        shimmer: AdmShimmer,
        SideDrawer,
        UktInlineSvg,
        'upload-consent-drawer': UploadConsentDrawer,
        loader
    },
    directives: { flatBtn, strokeBtn },
    data() {
        return {
            additionalShipmentCount: 0,
            detailsFilters: {},
            disableShipmentAddition: true,
            editShipmentView: false,
            isManifestActive: false,
            manifestHasAttachment: false,
            manifestId: this.$route.params.manifestId,
            manifestInfo: [],
            manifestFetchInProgress: true,
            noManifestId: false,
            pageSizeOptions: [10, 20, 50, 100, 200],
            pagination: {
                limit: 10,
                total: 1,
                current: 1,
            },
            shipmentsFetchError: false,
            shipmentSearchText: '',
            shipmentsList: [],
            totalShipments: 0,
            hasManifestFetched: false,
            selectedShipment: [],
            unSelectedShipments: [],
            keepRowsAllChecked: true,
            isIntialState: true,
            selectedShipmentCount: 0,
            isHeaderChecked: true,
            checkboxShipmentData: {},
            manifestStatus: '',
            checkBoxUpdated: false,
            uploadConsentView: false,
            filtersFromResponse: {},
            showSelectAllResponse: false,
            downloadUrl: '',
            consentDownloadUrl: '',
            consentDownloading: false,
            manifestUid: '0',
            manifestDetailsShipmentCount: 0
        };
    },
    mounted() {
        if (this.$route.params.manifestId) {
            this.noManifestId = false;
            this.fetchManifestDetails(this.$route.params.manifestId);
        } else {
            this.noManifestId = true;
        }
    },
    methods: {
        closeConsent() {
            this.uploadConsentView = false;
        },
        isEmpty,
        showSelectAllResponseEvent(bolleanVlaue) {
            this.showSelectAllResponse = bolleanVlaue;
            //can be used
        },

        disableShipmentAdditionConfirmation(value) {
            this.disableShipmentAddition = value;
        },
        downloadConsent() {
            if (this.consentDownloadUrl !== '') {
                this.consentDownloading = true;
                fetch(
                    this.consentDownloadUrl
                )
                    .then((res) => res.blob())
                    .then((blob) => {
                        let link = document.createElement('a');
                        let url = window.URL.createObjectURL(blob);
                        link.href = url;
                        link.download = `Consent-${this.manifestId}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }).catch((err)=> {
                        this.$snackbar.global.showError('Failed to download consent');
                        console.error('Failed to download consent', err);
                    }).finally(()=> {
                        this.consentDownloading = false;
                    });
            }
        },
        keepAllRowsCheckedEvent(bollean) {
            this.keepRowsAllChecked = bollean;
        },
        headerCheckEvent(boolean) {
            this.isHeaderChecked = boolean;
        },
        checkBoxEvent(object) {
            this.checkboxShipmentData = object;
            if (Object.keys(this.checkboxShipmentData).length > 0) {
                this.checkBoxUpdated = true;
            } else {
                this.checkBoxUpdated = false;
            }
        },
        /**
         * Method to fetch the details for a particular shipment.
         * It accepets params for pagination and search.
         *
         * @author: Rushabh Mulraj Shah
         * @param {String} manifestId The manifest ID for which the detail needs to be fetched
         * @param {Object} params The parameters object which might contain pagination, search, etc.
         */
        fetchManifestDetails(manifestId, params = {}) {
            if (!manifestId) {
                let isManifestIdAvailable = this.$route.params.manifestId;
                if (!isManifestIdAvailable) return;
            }

            this.manifestFetchInProgress = true;

            /* Set up the parameters that need to be sent to the API request */
            let finalParams = {
                page_no: params.current || this.pagination.current,
                page_size: params.size || this.pagination.limit,
                manifest_id: manifestId,
                ...params,
            };

            let queryParams = this.$route.query;
            if (queryParams.lane) finalParams['lane'] = queryParams.lane;
            if (queryParams.dp_ids) finalParams['dp_ids'] = queryParams.dp_ids;
            if (queryParams.from_date)
                finalParams['from_date'] = queryParams.from_date;
            if (queryParams.to_date)
                finalParams['to_date'] = queryParams.to_date;

            OrderService.fetchManifestDetails(finalParams)
                .then((response) => {
                    if (response.data.items && response.data.items.length) {
                        this.shipmentsFetchError = false;
                        this.hasManifestFetched = true;
                        this.shipmentsList = cloneDeep(response.data.items);
                        this.shipmentsList = this.shipmentsList.map((row) => {
                            let data = {
                                shipment_id: row.shipment_id,
                                shipment_created_time:
                                    row.shipment_created_at || '',
                                order_id: row.order_id,
                                invoice_id: row.invoice_id,
                                awb: row.awb || '',
                                items: row.item_qty,
                            };
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
                    }
                    this.isIntialState = false;

                    if (response.data.page && response.data.page) {
                        this.pagination = {
                            ...response.data.page,
                            limit: response.data.page.size,
                        };
                        this.manifestDetailsShipmentCount = response.data.page.total
                    }

                    if (
                        response.data.manifest_details &&
                        response.data.manifest_details === 'Manifest Not found'
                    ) {
                        this.manifestInfo = {};
                        this.shipmentsFetchError = true;
                        this.$snackbar.global.showError(
                            `We are facing some issues in fetching the list of shipments for manifest ID: ${this.manifestId}`,
                            3000
                        );
                        return;
                    }

                    if (
                        response.data.manifest_details &&
                        response.data.manifest_details.length
                    ) {
                        this.manifestInfo = response.data.manifest_details[0];
                        this.isManifestActive =
                            response.data.manifest_details[0].is_active;
                        this.manifestHasAttachment =
                            response.data.manifest_details[0].has_attachment;
                        this.totalShipments = response.data.page.total;
                        if(this.manifestInfo.status) {
                            this.manifestStatus = this.manifestInfo.status;
                        }
                        if(this.manifestInfo.filters) {
                            this.filtersFromResponse = this.manifestInfo.filters;
                        }
                        if(
                            this.manifestInfo &&
                            this.manifestInfo.pdf_meta &&
                            this.manifestInfo.pdf_meta.media_updates
                        ) {
                            this.downloadUrl = this.manifestInfo.pdf_meta.media_updates.slice(-1)[0].link;
                        }
                        this.consentDownloadUrl = '';
                        if(this.manifestInfo && this.manifestInfo.pdf_meta && this.manifestInfo.pdf_meta.consent) {
                            this.consentDownloadUrl = this.manifestInfo.pdf_meta.consent || '';
                        }
                        this.manifestUid = this.manifestInfo.uid

                        if (
                            this.pagination.current == 1 &&
                            this.selectedShipment.length == 0 &&
                            this.unSelectedShipments.length == 0
                        ) {
                            this.selectedShipmentCount = this.totalShipments;
                        }

                        if (
                            response.data.manifest_details[0] &&
                            response.data.manifest_details[0].filters
                        ) {
                            let filters =
                                response.data.manifest_details[0].filters;

                            this.detailsFilters = {
                                from_date: filters.date_range.from_date,
                                to_date: filters.date_range.to_date,
                                dp_ids: filters.dp_ids,
                                dp_name: filters.dp_name,
                                lane: filters.lane,
                                sales_channels: filters.sales_channels,
                                stores: filters.stores,
                                store_name: filters.store_name
                            };
                        }
                    }

                    if(response && response.data && response.data.additional_shipment_count) {
                        this.additionalShipmentCount = response.data.additional_shipment_count;
                    } else this.additionalShipmentCount = 0;
                })
                .catch((error) => {
                    console.error(
                        'Error in fetching the manifest shipments list:   ',
                        error
                    );
                    this.shipmentsFetchError = true;
                    this.$snackbar.global.showError(
                        `We are facing some issues in fetching the list of shipments for manifest ID: ${this.manifestId}`,
                        3000
                    );
                })
                .finally(() => {
                    this.manifestFetchInProgress = false;
                });
        },
        /**
         * Making api call when table checkbox values are changes and userwant to deslecte shipment
         * @author: sameeer shaikh
         */
        fetchManifest(e) {
            console.log(e);
        },

        onAppBack() {
            /*@author Sameer shaikh
             *  routing back to manifest homepage
             */
            this.$router.push({ name: 'company-order-manifest' });
        },
        updateSelectedShipmentCount(action) {
            if (action == 'addAll') {
                this.selectedShipmentCount = this.selectedShipment.length;
            } else if (action == 'removeAll') {
                this.selectedShipmentCount = 0;
            } else if (action == 'addOne') {
                if (!this.keepRowsAllChecked) {
                    this.selectedShipmentCount = this.selectedShipment.length;
                } else if (this.isHeaderChecked) {
                    this.selectedShipmentCount =
                        this.totalShipments - this.unSelectedShipments.length;
                }
            } else if (action == 'removeOne') {
                if (this.keepRowsAllChecked) {
                    this.selectedShipmentCount =
                        this.totalShipments - this.unSelectedShipments.length;
                } else {
                    this.selectedShipmentCount = this.selectedShipment.length;
                }
            } else if (action == 'reset') {
                this.selectedShipmentCount = this.totalShipments;
            }

            //   action == 'addAll' ? this.selectedShipmentCount = this.selectedShipment.length  : ''
            //   action == 'removeAll' ? this.selectedShipmentCount = 0 : ''
            //   action == 'addOne' && !this.keepRowsAllChecked ? this.selectedShipmentCount = this.selectedShipment.length : this.isHeaderChecked ? this.totalShipments - this.unSelectedShipments.length : ''
            //   action == 'removeOne' && this.keepRowsAllChecked ? this.totalShipments - this.unSelectedShipments.length : this.selectedShipment.length
            // console.log('action', action);
        },
        /**
         * @author Sameer Shaikh
         */
        updateCheckBoxValue(event) {
            let selectedUnselectedObject = event.selectedUnselectedObject;
            let action = event.action;
            if (!isEmpty(selectedUnselectedObject)) {
                let keys = Object.keys(selectedUnselectedObject);
                this.selectedShipment = keys.filter(
                    (item) => selectedUnselectedObject[item] == 'selected'
                );
                this.unSelectedShipments = keys.filter(
                    (item) => selectedUnselectedObject[item] == 'unSelected'
                );
            }
            this.updateSelectedShipmentCount(action);
        },
        openEditManifestDrawer() {
            /*@author Sameer shaikh
             *  this will open edit shipment drawer on click of add manifest
             */
            this.editShipmentView = true;
        },

        /**
         * Method to update the add shipments to the current manifest
         *
         * Using setTimeout to wait for 1 sec by that time all the backgroud process would be completed
         *
         * @author: Rushabh Mulraj Shah
         * @param {Object} data The data received of shipments
         */
        updateCurrentManifest(data) {
            OrderService.processManifest(data)
                .then(() => {
                    this.editShipmentView = false;
                    this.$snackbar.global.showSuccess(
                        `Selected shipments are added successfully`,
                        3000
                    );

                    setTimeout(() => {
                        this.fetchManifestDetails(
                            this.$route.params.manifestId
                        );

                    }, 1000);

                })
                .catch((error) => {
                    console.error(
                        'Error in processing the manifest:   ',
                        error
                    );
                    this.$snackbar.global.showError(
                        `Error in creating the manifest`,
                        3000
                    );
                });
        },

        saveManifest() {
            console.log('save');
        },
        processManifest() {},

        /**
         * The method to handle event when the user clicks on confirm after the user
         * has selected additional shipments to be added to the current manifest
         *
         * @author: Rushabh Mulraj Shah
         */
        onAddShipmentConfirm() {
            this.$refs['add-shipments'].addShipments();
        },

        /**
         * Method to handle scenarios where,
         * a) The user has clicked outside the search box, essentially making it lose focus or "blur".
         * b) The user has clicked the enter key.
         * In this case, the search term will be sent across to the fetch request.
         *
         * @author: Rushabh Mulraj Shah
         */
        onSearch() {
            /**
             * If the user has entered text for search, it will send across the relevant parameters,
             * or else it will not send any parameters
             */
            if (this.shipmentSearchText.length > 0) {
                this.fetchManifestDetails(this.manifestId, {
                    search_type: 'shipment_id',
                    search_value: this.shipmentSearchText,
                });
            } else this.fetchManifestDetails(this.manifestId);
        },

        onSearchInput(event) {},

        /**
         * Method to handle pagination changes
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} pageObj The pagination object received from nitrozen-pagination
         */
        paginationChange(pageObj) {
            let finalPaginationObj = {};
            let { current, limit } = cloneDeep(pageObj);

            finalPaginationObj = {
                'page_no': current,
                'page_size': limit,
            };

            this.fetchManifestDetails(this.manifestId, finalPaginationObj);
        },

        close: function () {
            this.editShipmentView = false;
        },
        saveProcessManifest(action) {
            delete this.filtersFromResponse['selected_shipments']
            delete this.filtersFromResponse['deselected_shipments']
            delete this.filtersFromResponse['unmap_old_shipments']
            let param = {
                action,
                manifest_id: this.manifestId,
                filters: this.filtersFromResponse,
                unique_id: this.manifestUid
            };

            if(this.selectedShipment.length  || this.unSelectedShipments.length  ){
                if( this.selectedShipment.length !== this.totalShipments ){
                    if (this.selectedShipment.length == this.unSelectedShipments.length) {
                        param.filters['selected_shipments'] = this.selectedShipment.toString();
                        param.filters['unmap_old_shipments'] = true;
                        param['unique_id']= new Date().getTime().toString(),
                        delete param.filters['deselected_shipments']
                        } else {
                        if ( this.selectedShipment.length > this.unSelectedShipments.length) {
                        param.filters['selected_shipments'] = this.selectedShipment.toString();
                        param.filters['unmap_old_shipments'] = true;
                        delete param.filters['deselected_shipments']
                        param['unique_id']= new Date().getTime().toString();
                        } else {
                        param.filters['deselected_shipments'] = this.unSelectedShipments.toString();
                        delete param.filters['selected_shipments']
                        param['unique_id']= new Date().getTime().toString();
                            }
                    }
                }
            }

            if (this.keepRowsAllChecked) {
                delete param.filters.selected_shipments;
                delete param.filters.unmap_old_shipments;
            }
            OrderService.processManifest(param)
                .then((res) => {
                    this.$snackbar.global.showSuccess(
                        'Manifest is updated successfully'
                    );
                    if (action == 'process') {
                        this.uploadConsentView = true;
                    } else if (action == 'save'){
                        this.$router.push({ name: 'company-order-manifest' });
                    }
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Error while updating manifest',
                        err
                    );
                });
        },
        uploadConsent(){
            this.uploadConsentView = true;
        }
    },
};
</script>

<style lang="less" scoped>
@import '../../../less/page-header.less';
@import '../../../less/page-ui.less';

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
        width: 67%;
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

::v-deep .page-header .page-nav .page-slot {
    display: inline;
}

.header-bar {
    display: flex;
    justify-content: space-between;

    .manifest-status-icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 5rem;
    }

    .button-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 14rem;

        @media @mobile {
            margin-left: 24px;
        }
    }
}

.page-container {
    box-sizing: border-box;
    height: 100%;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }

    .list-information-txt {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .info-text {
            margin-top: 10px;
            font-size: 14px;
            font-family: Inter;
            font-weight: 500;
        }
    }

    .input-container {
        margin-top: 2vh;
        width: 100%;

        ::v-deep .n-input,
        ::v-deep .nitrozen-select__trigger {
            border-radius: 4px;
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

    .tab-row {
        display: flex;
        align-items: baseline;
        width: 100%;
        border-bottom: 1px solid @Iron;

        .tabs {
            flex: 1;
            padding-left: 12px;

            ::v-deep .nitrozen-tab-container {
                border-bottom: 1px solid #e0e0e0;
            }

            ::v-deep .nitrozen-tab-item {
                padding: 12px 36px;
                font-size: 16px;
            }

            @media @mobile {
                padding-left: 0;
            }

            ::v-deep .nitrozen-tab-active {
                font-weight: 500;
            }
        }

        .bulk-actions-button {
            top: -10px;
            margin-right: 12px;
        }

        .refresh-icon {
            cursor: pointer;
            margin: 0px 12px;
            display: flex;
            align-items: center;
            justify-content: center;

            // background-color: red;
            ::v-deep svg {
                fill: @RoyalBlue;
                transition: all 0.6s ease;
            }

            &:hover {
                ::v-deep svg {
                    transform: rotate(120deg);
                }
            }
        }

        .select-view {
            ::v-deep .nitrozen-select-wrapper {
                min-width: 145px;
                width: 145px;
                .nitrozen-select {
                    border-color: @RoyalBlue;
                    .nitrozen-select__trigger {
                        color: @RoyalBlue;
                    }
                }
            }
        }
    }

    .content-container {
        width: 100%;
        margin-top: 12px;
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
                min-width: 200px;
                width: 200px;

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
                // &.store-dropdown {
                //     width: 200px;
                // }
            }
        }
    }
}

.shimmer-container {
    padding: 1rem;
}

.drawer-footer-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
