<template>
    <div class="return-summary-container">
        <nitrozen-input
            type="text"
            placeholder="Search by Seller Identifier, Item Code, Name"
            v-model="searchText"
            :showSearchIcon="true"
            class="search-bar"
        />

        <div class="return-summary">
            <div class="return-summary-header">
                <p class="shipment-id">
                    Shipment ID: {{ shipmentData.shipment_id }}
                </p>
                <div class="return-summary-title">
                    Please Check QC
                </div>
            </div>
            <div class="return-summary-content">
                <div class="bag-item" v-for="(item) in shipmentData.bags" :key="item.bag_id">
                    <bag-item-details :item="item" />

                    <div class="right-section">
                        <p class="info">
                            By default, the items are marked as received in good condition. Enter the reasons of the poor quality items.
                        </p>

                        <div class="qc-tags-container" v-if="item.qc">
                            <div class="qc-tag good-qc-tag" v-if="item.qc.good && item.qc.good.quantity > 0">
                                {{ item.qc.good.quantity }} Good QC{{ item.qc.good.quantity > 1 ? 's' : '' }}
                            </div>
                            <div class="qc-tag bad-qc-tag" v-if="item.qc.bad && item.qc.bad.quantity > 0">
                                {{ item.entity_type == 'set' ? item.article.set.quantity - item.qc.good.quantity : item.quantity - item.qc.good.quantity }} 
                                Bad QC{{ (item.entity_type == 'set' ? item.article.set.quantity - item.qc.good.quantity : item.quantity - item.qc.good.quantity) > 1 ? 's' : '' }}
                            </div>
                        </div>
                        <nitrozen-button 
                            theme="secondary" 
                            v-if="item.entity_type == 'set' && item.qc && item.qc.bad.quantity === 0"
                            @click="onClickingAddBadQC($event, item.products[0].bag_id, true)"
                        >+ Add Bad QC</nitrozen-button>
                        <nitrozen-button 
                            theme="secondary" 
                            v-if="item.entity_type != 'set' && item.qc && item.qc.bad.quantity === 0"
                            @click="onClickingAddBadQC($event, item.bag_id, false)"
                        >+ Add Bad QC</nitrozen-button>

                        <return-reasons 
                            :item="item" 
                            :shipment="shipmentData"
                            @update="updateShipmentData" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenButton, NitrozenInput
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import BagItemDetails from '@/pages/oms/return-summary/bag-item-details.vue';
import ReturnReasons from '@/pages/oms/return-summary/return-reasons.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg';

export default {
    name: 'return-summary',
    components: {
        'bag-item-details': BagItemDetails,
        NitrozenButton,
        NitrozenInput,
        ReturnReasons,
        UktInlineSvg
    },
    props: {
        shipment: {
            type: Object
        }
    },
    data() {
        return {
            searchText: '',
            shipmentData: {}
        }
    },
    mounted() {
        if(!isEmpty(this.shipment)) {
            let data = cloneDeep(this.shipment);
            /* Adding data for QC */
            let updatedBags = data.bags.map(bag => {
                let qc = {
                    good: {
                        quantity: bag.entity_type == 'set' ? bag.article.set.quantity : bag.quantity
                    },
                    bad: {
                        quantity: 0,
                        reasons: []
                    }
                };

                return {
                    ...bag,
                    qc: qc
                }
            });
            data.bags = cloneDeep(updatedBags);
            this.shipmentData = cloneDeep(data);
        }
    },
    methods: {
        /**
         * This method handles adding bad QCs.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} event The native event
         * @param {String} item_id The bag ID
         */
        onClickingAddBadQC(event, item_id, isSet) {
            event.stopPropagation();
            let shipDataBags = cloneDeep(this.shipmentData.bags);
            let selectedBag = isSet ? shipDataBags.find(bag => bag.products[0].bag_id == item_id) : shipDataBags.find(bag => bag.bag_id === item_id);
            /* 
                This button will be clicked when there are no bad QCs and all items have a good QC.
                We will first increase the bad QC and reduce the good QC by 1. 
                By increasing the bad QC, the code will automatically hide the "+ Add Bad QC" button. 
                Instead, it will show the "+ Add Quantity" button, now.
                It will also add an entry with default quantity 1 in the reasons.
            */
            if(isSet) selectedBag.qc.bad.quantity += selectedBag.article.set.quantity;
            else selectedBag.qc.bad.quantity += 1
            if(isSet) selectedBag.qc.good.quantity -= selectedBag.article.set.quantity;
            else selectedBag.qc.good.quantity -= 1;
            selectedBag.qc.bad.reasons.push(
                {
                    quantity: isSet ? selectedBag.article.set.quantity : 1,
                    quality: ''
                }
            );
            this.$set(this.shipmentData, 'bags', shipDataBags);
            this.shipmentData.bags = cloneDeep(shipDataBags);
        },

        /**
         * The method to update the shipment data.
         * 
         * @author: Rushabh Mulraj Shah
         * @param {Object} data The updated shipment data
         */
        updateShipmentData(data) {
            this.shipmentData = cloneDeep(data);
        }
    }
}
</script>

<style lang="less" scoped>
.return-summary-container {
    cursor: default;
}

.search-bar {
    margin-bottom: 24px;

    ::v-deep .n-input {
        border-radius: 4px;
    }
}

.return-summary-header {
    border-bottom: 1px solid #E0E0E0;
}

.shipment-id {
    font-size: 14px;
    line-height: 17px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #4D4D4E;
}

.return-summary-title {
    font-size: 16px;
    font-weight: 400;
    line-height: 17px;
    color: #4D4D4E;
    margin-bottom: 1rem;
}

.bag-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 8px;
    padding: 1rem 0;
    // border-bottom: 1px solid #E0E0E0;
}

.right-section {
    .info {
        font-size: 12px;
        line-height: 17px;
        font-weight: 500;
        color: #41343C;
        margin-bottom: 1rem;
    }
}

.qc-tags-container {
    display: flex;
    column-gap: 1rem;
    margin-bottom: 1rem;

    .qc-tag {
        border-radius: 4px;
        padding: 4px 16px;
        font-size: 12px;
        line-height: 21px;
        font-weight: 400;
        color: #41343C;

        &.good-qc-tag {
            background: #F2FFF7;
        }

        &.bad-qc-tag {
            background: #FFE7E7;
        }
    }
}

.add-bad-qc-btn {
    span {
        color: #2E31BE;
        font-size: 12px;
        font-weight: 600;
        line-height: 140%;
        cursor: pointer;
    }
}
</style>
