<template>
    <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">2. Open</span> and follow these steps.
            </p>
        </template>
        <template #content>
            <ol start="1" class="instructions-list">
                <li>Keep the row(s) of the items you wish to process</li>
                <li>Remove the row(s) of the items if you wish to cancel them</li>
                <li>Delete the entire row of shipment(s) you do not intend to process</li>
            </ol>
        </template>
    </bulk-action-box>
</template>

<script>
/* Component imports */
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';

export default {
    name: 'instructions-action-box',
    components: {
        BulkActionBox
    }
}
</script>

<style lang="less" scoped>
.bold-text {
    font-weight: 700;
}

.instructions-list {
    list-style-type: decimal;
    padding: 16px;
    color: #666666;

    li {
        margin-bottom: 1.5rem;
    }
}
</style>
