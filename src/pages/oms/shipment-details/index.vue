<template>
    <div class="shipment-details-container">
        <shipment-info
            :shipment="data"
            @updateOrderDetails="() => $emit('updateOrderDetails')"
        ></shipment-info>

        <bags-list
            :shipment="data"
            :status="data.status.status"
            @reject="$emit('reject')"
            :readOnlyMode="readOnlyMode"
        ></bags-list>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';

/* Component imports */
import ShipmentInfo from '@/pages/oms/shipment-info/index.vue'; /** Yet */
import BagsList from '@/pages/oms/bags-list/index.vue'; /** Yet */

/* Mock imports */
import { orderDetailsMock } from '@/pages/oms/mocks/order-details.js';

export default {
    name: 'shipment-details',
    props: {
        data: {
            type: Object
        },
        readOnlyMode: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if(this.data) {
            this.data['tracking_details'] = cloneDeep(orderDetailsMock.order.shipments[0].shipment_tracker);
        }
    },
    components: {
        BagsList,
        ShipmentInfo
    }
}
</script>

<style lang="less" scoped>

</style>
