<template>
    <div
        class="bags-dialog"
        ref="bags-dialog"
        @click="stopClick($event)"
    >
        <div class="header">
            <div class="title">
                <span class="title-text">Shipment ID: {{ shipment_id }}</span>
            </div>
        </div>
        <div class="bag-data">
            <div class="items-status">
                <div class="number-items">
                    <span>{{ bags.length }} item<span v-if="bags.length>1">s</span></span>
                </div>
                <nitrozen-badge
                    v-if="shipment_status"
                    state="success"
                    class="placed-badge">
                    {{ convertSnakeCaseToString(shipment_status.status) }}
                </nitrozen-badge>
            </div>
            <div class="actions-notifications">
                 <div 
                    class="sla-status" 
                    v-if="
                        shipData.shipment_status && 
                        shipData.shipment_status && 
                        shipData.shipment_status.meta && 
                        shipData.shipment_status.meta.estimated_sla_time
                    " 
                    :title="slaTitle">
                    <sla-indicator 
                        :sla_percent="
                            displaySlaPercentage(
                                shipData.shipment_status.status_created_at, 
                                shipData.shipment_status.meta.estimated_sla_time)
                            " 
                        />
                    <span class="sla-time">{{isBreachedOrNot(shipData.shipment_status.meta.estimated_sla_time)}}</span>
                </div>
            </div>
        </div>

        <adm-shimmer
            v-if="inProgress && !pageError"
            :count="4"
        ></adm-shimmer>
        <div v-else-if="!inProgress && pageError">
            <page-error
                v-if="bags.length > 0"
                :errorText="errorText"
            ></page-error>
            <adm-no-content
                v-else
                helperText="Unable to fetch the bags. Kindly try again after some time."
            ></adm-no-content>
        </div>
        <div v-else-if="bags && bags.length">
            <bags-dialog-table
                :columns="tableColumns"
                :items="bags"
            ></bags-dialog-table>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDialog,
    NitrozenBadge,
    NitrozenButton,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import WarnIcon from '@/pages/oms/warn-icon.vue';
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import AdmShimmer from '@/components/common/shimmer.vue';
import PageError from '@/components/common/page-error';
import AdmNoContent from '@/components/common/adm-no-content.vue';
import BagsDialogTable from '@/pages/oms/bags-dialog/table.vue';
import shipmentList from '@/pages/oms/shipment-list-item.vue';
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import SlaIndicator from '@/pages/oms/sla/sla-indicator.vue';

/* Helper imports */
import { convertSnakeCaseToString } from '@/helper/utils';
import { displaySlaPercentage,displaySlaHoursLeft,displaySlaTooltip } from '@/pages/oms/sla/helper.js';



const BAGS_DIALOG_COLUMNS = [
    {
        value: 'items_details',
        text: 'Items Details',
    },
    {
        value: 'variants',
        text: 'Variants',
    },
    {
        value: 'seller_identifier',
        text: 'Seller Identifier',
    },
    {
        value: 'quantity',
        text: 'Quantity',
    },
    {
        value: 'price',
        text: 'Price',
    }
];

export default {
    name: 'bags-dialog',
    components: {
        AdmPageHeader,
        AdmInlineSvg,
        AdmNoContent,
        AdmShimmer,
        NitrozenBadge,
        NitrozenDialog,
        PageError,
        WarnIcon,
        BagsDialogTable,
        shipmentList,
        SlaIndicator,
        NitrozenButton,
    },
    directives: {
        strokeBtn,
    },
    props: {
        shipData: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            bags:this.shipData.bags,
            shipment_status:this.shipData.shipment_status,
            shipment_id:this.shipData.shipment_id,
            placed: false,
            inProgress: false,
            pageError: false,
            tableColumns: cloneDeep(BAGS_DIALOG_COLUMNS)
        }
    },
    computed: {
        slaTitle() {
            if(
                this.shipData &&
                isEmpty(this.shipData) && 
                this.shipData.shipment_status && 
                this.shipData.shipment_status && 
                this.shipData.shipment_status.meta &&
                this.shipData.shipment_status.meta.estimated_sla_time
            ) {
                return this.shipData.shipment_status.meta.estimated_sla_time;
            } else return '';
        },
    },
    methods: {
        displaySlaPercentage,
        displaySlaHoursLeft,
        displaySlaTooltip,
        convertSnakeCaseToString,
        close() {
            this.$emit("closeDialog")
        },
        isBreachedOrNot(estTime) {
            let value = displaySlaHoursLeft(estTime);
            let slicedValue = value.slice(0, 1);
            if(slicedValue == '-') {
                let breachedValue = displaySlaHoursLeft(estTime);
                return `Breached by: ${breachedValue.slice(1)}`;
            }
            else if(["placed", "store_reassigned"].includes(this.shipment_status.status)) {
                return `Confirm by: ${displaySlaHoursLeft(estTime)}`;
            }
            else if(["bag_confirmed", "dp_not_assigned", "ready_for_dp_assignment", "cancelled_at_dp", "dp_assigned"].includes(this.shipment_status.status)) {
                return `Pack by: ${displaySlaHoursLeft(estTime)}`;
            }
        },
        stopClick(event){
            event.stopPropagation();
        },
        // BELOW CODE IS USED FOR SORTING THE LIST ACCORDING TO THE PRICE NAME)
        // open({shipment_id, placed, pack_within}) {
        //     this.shipment_id = shipment_id;
        //     this.placed = placed;
        //     this.pack_within = pack_within;
        //     this.$refs['bags-dialog'].open({
        //         showCloseButton: true,
        //         dismissible: false,
        //         width: '60%'
        //     });
        // },
        // sortBags(column) {
        //     /* Change the value of order so that the icon changes in the table */
        //     let columnToEdit = this.tableColumns.find(col => col.value === column.value);
        //     columnToEdit.asc = !columnToEdit.asc;
        //     /* Call fetch bags to fetch sorted data using API */
        //     // this.fetchBags();
        // }
    }
}
</script>

<style lang="less" scoped>
.bags-dialog {
    .header {
        margin: 24px 0px 24px 0px;
        box-sizing: border-box;
        padding-bottom: 24px;
        border-bottom: 1px solid #E0E0E0;

        .title {
            .title-text {
                margin-left: 24px;
            }
        }
    }
    .bag-data {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 24px;
        .items-status {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .number-items{
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 56px;
            }
            .placed-badge {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 20px;
            }
        }
        .actions-notifications {
            display: flex;
            justify-content: center;
            align-items: center;
            // margin-left: 538px;
            .pack-within {
                font-weight: 400;
                font-size: 12px;
                color: #41343C;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 1.5rem;
            }

            .close {
                cursor: pointer;
            }
        }
    }
    .footer-box {
        position: absolute;
        // width: inherit;
        z-index: 1;
        bottom: 0;
        background: #FFFFFF;
        box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
        padding: 16px 24px;
        min-width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        .apply-filter-button{
            margin-right: 8px;
        }
    }
}
.sla-status{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 20px;
    ::v-deep .indicator-container {
        position: relative;
        width: 25px;
        height: 25px;
        bottom: 1px;
    }
    .sla-time{
        margin-top:2px;
        margin-left: 10px;
        font-weight: 400;
        font-size: 14px;
        white-space: nowrap;
        color: #4d4d4e;
    }
}
</style>
