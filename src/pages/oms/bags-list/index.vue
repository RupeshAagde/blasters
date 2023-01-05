<template> 
    <bags-list-table
        v-if="bags && bags.length"
        class="list-bags"
        :items="bags"
        :columns="tableColumns"
        :shipment="shipment"
        :readOnlyMode="readOnlyMode"
        @reject="$emit('reject')"
    ></bags-list-table>
</template>

<script>
const BAGS_LIST_COLUMNS = [
    {
        value: 'items_details',
        text: 'Item Details',
        sort: false
    },
    {
        value: 'seller_identifier',
        text: 'Seller Identifiers',
        sort: false
    },
    {
        value: 'total_price',
        text: 'Price',
        sort: false
    }
];

/* Package imports */
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import BagsListTable from './table.vue';

export default {
    name: 'bags-list',
    components: {
        BagsListTable
    },
    props: {
        shipment: {
            type: Object
        },
        status: {
            type: String
        },
        readOnlyMode: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if(this.shipment.bags) {
            this.bags = this.shipment.bags.map(item => {
                if(!item.rejected) {
                    item.rejected = 0;
                    item.reasons = [];
                }
                return item;
            });
        }
    },
    data() {
        return {
            bags: []
        }
    },
    computed: {
        tableColumns() {
            let columns = cloneDeep(BAGS_LIST_COLUMNS);

            if(this.status === 'placed') {
                let columnsToBeAdded = [
                    {
                        value: 'quantity.initial',
                        text: 'Initial Qty',
                        sort: false
                    },
                ];
                if(!this.readOnlyMode && 
                    this.shipment &&
                    this.shipment.transition_config &&
                    this.shipment.transition_config.bag_confirmed &&
                    this.shipment.transition_config.bag_confirmed.can_break_entity &&
                    this.shipment.transition_config.bag_confirmed.can_break_entity == true){
                    columnsToBeAdded.push({
                        value: 'quantity.final',
                        text: 'Final Qty',
                        sort: false
                    },
                    {
                        value: 'cancel_quantity',
                        text: 'Cancel Qty',
                        sort: false
                    })
                }
                columns.splice(2, 0, ...columnsToBeAdded);
            } else {
                let columnsToBeAdded = [
                    {
                        value: 'quantity.confirmed',
                        text: 'Confirmed Quantity',
                        sort: false
                    }
                ];

                columns.splice(2, 0, ...columnsToBeAdded);
            }
            return columns;
        }
    }
}
</script>

<style lang="less" scoped>

</style>