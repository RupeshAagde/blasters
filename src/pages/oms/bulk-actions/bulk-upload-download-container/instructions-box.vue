<template>
    <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">2. Open</span> and follow these steps.
            </p>
        </template>
        <template #content>
            <ol start="1" class="instructions-list">
                <li>Keep the shipment(s) in the file you want to process.</li>
                <li>Delete the complete shipment(s) that you do not intend to process right away.</li>
                <li>Remove an item(s) from the file if you want to cancel a specific item(s) for a specific shipment.</li>
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
