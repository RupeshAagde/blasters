<template>
    <div>
        <bulk-details-status :bulkData="bulkData" />
        <failed-records v-if="showFailedRecords" :allData="allData"/>
    </div>
</template>

<script>
/* Package imports */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import BulkDetailsStatus from '@/pages/oms/bulk-actions/bulk-details/status.vue';
import FailedRecords from '@/pages/oms/bulk-actions/bulk-details/failed-records.vue';

export default {
    name: 'bulk-details',
    components: {
        BulkDetailsStatus,
        'failed-records': FailedRecords
    },
    props: {
        details: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            bulkData: cloneDeep(this.details),
            allData: {},
            showFailedRecords: false,
            batchID: ""
        }
    },
    mounted() {
        if(!isEmpty(this.bulkData) && this.bulkData.status !== 'COMPLETED') {
            this.showFailedRecords = true;
            this.allData = cloneDeep(this.bulkData);
        } else {
            this.showFailedRecords = false;
            this.allData = {};
        }
    }
}
</script>

<style lang="less" scoped>

</style>
