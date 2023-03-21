<template>
    <div class="manifest-panel">
        <div class="page-container">
            <div
                class="manifest-container"
                v-if="totalShipments > 0 && !manifestFetchInProgress"
            >
                <div class="manifest-main-div">
                    <div class="manifest-mid-wrapper">
                        <!-- Commented as of January 11, 2023 as per Ninja design for OMS v2.0 -->
                        <!-- <div class="manifest-search">
                            <mirage-alert
                                :dismissible="false"
                                ref="intro"
                                class="plain"
                                type="plain"
                                v-if="
                                    showCheckboxAlert &&
                                    selectedShipmentCount > 0 && manifestStatus !== 'complete'
                                "
                            >
                                <div class="alert-content">
                                    <span class="text-icon">
                                        <span class="space">
                                            <ukt-inline-svg src="blue-info" />
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
                                            pagination.limit
                                                ? 'from this page'
                                                : ''
                                        }}
                                    </span>
                                    <span
                                        class="blue-button"
                                        @click="selectAllFromResponse"
                                        ref="checkbox-intro"
                                        v-if="showSelectAllResponse && selectedShipmentCount !== totalShipments"
                                    >
                                        Select all
                                        {{ totalShipments }} Shipments</span
                                    >
                                </div>
                            </mirage-alert>
                        </div> -->

                        <div
                            class="manifest-list-wrapper"
                            v-if="hasManifestFetched"
                        >
                            <!-- && filterDelivery -->
                            <div
                                class="manifest-list"
                                v-for="(colName, index) in columns"
                                :key="`${colName}-${index}`"
                            >
                                <!-- <span
                                    v-if="index == 0 && manifestStatus !== 'complete'"
                                    class="checkbox"
                                    @click="selectUnSelectAllItem"
                                >
                                    <nitrozen-checkbox :value="isAllSelected">
                                    </nitrozen-checkbox>
                                </span> -->
                                <div class="manifest-list-heading">
                                    {{ colName }}
                                </div>
                            </div>
                        </div>

                        <div
                            class="manifest-list-wrapper-content"
                            v-if="hasManifestFetched"
                        >
                            <div
                                class="shipment-list-wrapper"
                                v-for="(manifest, index) in shipmentsList"
                                :key="index"
                            >
                                <div class="manifest-list">
                                    <!-- <span
                                    v-if="manifestStatus !== 'complete'"
                                        class="checkbox boxcheck"
                                        @click="selectItem(index)"
                                    >
                                        <nitrozen-checkbox
                                            :value="manifest.isSelected"
                                        >
                                        </nitrozen-checkbox>
                                    </span> -->
                                    <div class="manifest-list-heading">
                                        <p>{{ manifest.shipment_id }}</p>
                                        <p class="manifest-list-heading-date">
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
                            v-if="shipmentsList && shipmentsList.length"
                        >
                            <nitrozen-pagination
                                class="page"
                                @change="onPaginationChange"
                                v-model="pagination"
                                :pageSizeOptions="pageSizeOptions"
                                name="Shipments"
                            >
                            </nitrozen-pagination>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loader-container">
                <shimmer v-if="manifestFetchInProgress" :count="4"></shimmer>
            </div>
            <adm-no-content
                v-if="
                    !manifestFetchInProgress &&
                    totalShipments == 0 &&
                    !isIntialState
                "
                helperText="No shipments found"
            ></adm-no-content>
            <div class="empty-screen" v-if="isIntialState">
                <inline-svg :src="'empty-orders'" />
                <p>To add shipments, select channel, DP & slot form dropdown</p>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenPagination, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
import debounce from 'lodash/debounce';
/* Components imports */
import AdmInlineSVG from '@/components/common/inline-svg';
import Shimmer from '@/components/common/shimmer';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import MirageAlert from '@/components/alert/index.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

/* Helper imports */
import { copyToClipboard } from '@/helper/utils.js';
import { convertToOMSDate } from '@/helper/utils.js';
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'manifest-details-shipments',
    components: {
        NitrozenPagination,
        'nitrozen-checkbox': NitrozenCheckBox,
        'inline-svg': AdmInlineSVG,
        Shimmer,
        AdmNoContent,
        MirageAlert,
        UktInlineSvg,
    },
    computed: {
        isAllSelected() {
            return this.shipmentsList.every((v) => v.isSelected);
        },
    },
    props: {
        manifestFetchInProgress: {
            type: Boolean,
        },
        pagination: {
            type: Object,
            default: () => {
                return {
                    limit: 10,
                    total: 1,
                    current: 1,
                };
            },
        },
        shipmentsList: {
            type: Array,
        },
        totalShipments: {
            type: Number,
        },
        hasManifestFetched: {
            type: Boolean,
        },
        isIntialState: {
            type: Boolean,
        },
        keepRowsAllChecked: {
            type: Boolean,
        },
        selectedShipmentCount: {
            type: Number,
        },
        isHeaderChecked:{
            type: Boolean
        },
        checkboxShipmentData:{
            type:Object
        },
        manifestStatus:{
            type: String
        }
    },
    data() {
        return {
            columns: ['Shipment ID', 'Order ID', 'Invoice Id', 'AWB', 'Items'], // remove from parent
            showCheckboxAlert: true,
            showSelectAllResponse: false,
            pageSizeOptions: [10, 20, 50, 100, 200],
            unSelectedShipments: [],
            selectedShipment: [],
            checkboxShipment: cloneDeep(this.checkboxShipmentData)
        };
    },
    mounted() {

    },
    methods: {
        addRemoveFromArray(action, shipment) {
            if (action == 'addAll') {
                this.shipmentsList.forEach((row) => {
                    this.checkboxShipment[row.shipment_id] = 'selected'
                });
                this.$emit('headerCheckEvent', true)
                this.$emit('updateCheckBoxValue',{selectedUnselectedObject:this.checkboxShipment, action})
                this.$emit('checkBoxEvent', this.checkboxShipment)

            } else if (action == 'removeAll') {
                this.$emit('headerCheckEvent', false)
                this.checkboxShipment = {}
                this.$emit('updateCheckBoxValue',{selectedUnselectedObject:this.checkboxShipment, action})
                this.$emit('checkBoxEvent', this.checkboxShipment)
            } else if (action == 'addOne') {
                this.checkboxShipment[shipment] = 'selected'
                 this.$emit('updateCheckBoxValue',{selectedUnselectedObject:this.checkboxShipment, action})
                 this.$emit('checkBoxEvent', this.checkboxShipment)
            } else if (action == 'removeOne') {
                this.checkboxShipment[shipment] = 'unSelected'
                this.$emit('updateCheckBoxValue',{selectedUnselectedObject:this.checkboxShipment, action})
                this.$emit('checkBoxEvent', this.checkboxShipment)
            }

        },
        convertToOMSDate,

        /**
         * Method to copy the shipment ID to the clipboard
         *
         * @author: Rushabh Shah
         * @param {Object} e The event object
         * @param {String} text The text that needs to be copied
         */
        copyToClipboard(e, text) {
            e.stopPropagation();
            copyToClipboard(text);
            this.$snackbar.global.showInfo(
                'Shipment ID copied to clipboard',
                1000
            );

        },

        /**
         * Method to emit pagination change to the parent
         *
         * @author: Rushabh Mulraj Shah
         * @param {object} obj Pagiantion object emitted by nitrozen-pagination
         */
        onPaginationChange(obj) {
            this.$emit('paginationChange', obj);
        },
        selectAllFromResponse() {
            // this.$emit('updateSelectedShipmentCount', this.totalShipments)
            this.dispalyButtonSelectAllFromResponse(false);
            this.$emit('keepAllRowsCheckedEvent', true);
            this.$snackbar.global.showSuccess(
                `All shipments are selected`
            );
            this.shipmentsList.map((v) => this.$set(v, 'isSelected', true));
            this.resetShipmentArray();
        },

        dispalyButtonSelectAllFromResponse(bolleanVlaue) {
            this.showSelectAllResponse = bolleanVlaue;
            this.$emit('showSelectAllResponseEvent',bolleanVlaue )
        },
        selectItem: debounce(function (index) {
            this.dispalyButtonSelectAllFromResponse(false);
            this.$set(
                this.shipmentsList[index],
                'isSelected',
                !this.shipmentsList[index].isSelected
            );
            if (this.shipmentsList[index].isSelected) {
                this.addRemoveFromArray(
                    'addOne',
                    this.shipmentsList[index].shipment_id
                );
            } else {
                this.addRemoveFromArray(
                    'removeOne',
                    this.shipmentsList[index].shipment_id
                );
            }
        }, 150),
        selectUnSelectAllItem: debounce(function () {
            this.$emit('keepAllRowsCheckedEvent', false);
            this.resetShipmentArray();

            if (!this.isAllSelected) {
                this.dispalyButtonSelectAllFromResponse(true);
                this.shipmentsList.map((v) => this.$set(v, 'isSelected', true));
                this.addRemoveFromArray('addAll');
                if (this.selectedShipmentCount == this.totalShipments) {
                    this.dispalyButtonSelectAllFromResponse(false);
                }
            } else {

                this.dispalyButtonSelectAllFromResponse(false);
                this.shipmentsList.map((v) =>
                    this.$set(v, 'isSelected', false)
                );
                // removing from unselected items selected array
                this.addRemoveFromArray('removeAll');
                this.showCheckboxAlert = true;
            }
        }, 150),
        resetShipmentArray() {
            this.checkboxShipment = {}
            this.$emit('updateCheckBoxValue',{selectedUnselectedObject:this.checkboxShipment,  action: 'reset'}, )

        },

        resetCache() {
            this.$emit('keepAllRowsCheckedEvent', true);
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
            } else if (
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


        selectedShipmentCounter(count) {
            this.selectedShipmentCount = count;
        },
    },
};
</script>

<style lang="less" scoped>
@import '../../../less/page-header.less';
@import '../../../less/page-ui.less';
.manifest-panel {
    width: 100%;
    .page-container {
        box-sizing: border-box;
        height: 100%;
        margin: 0;
        margin-top: 24px;
        padding: 0px;

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
                        width: auto;
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
    }
}

.shipment-id-container {
    padding-left: 16px;

    .shipment-id {
        box-shadow: inset 0 0 0 0 @RoyalBlue;
        margin: 0 -0.25rem;
        padding: 0.5px 0.25rem;
        font-weight: 300;
    }

    .placed-on {
        color: @DustyGray2;
        margin-top: 6px;
    }
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
</style>
