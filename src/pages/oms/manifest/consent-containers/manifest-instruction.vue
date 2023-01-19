<template>
    <bulk-action-box>
        <template #header>
            <p>
                <span class="bold-text">2. Open</span> PDF files and follow these steps.
            </p>
        </template>
        <template #content>
            <ol start="1" class="instructions-list">
                <li>Take signature of delivery person on manifest</li>
                <li>Get the manifest cross-signed by store manager</li>
            </ol>
        </template>
    </bulk-action-box>
</template>

<script>
/* Component imports */
import BulkActionBox from '@/pages/oms/bulk-actions/bulk-action-box/index.vue';

export default {
    name: 'manifest-instruction-box',
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
    font-family: Inter;
    list-style-type: decimal;
    color: #666666;
    line-height: 30px;
    margin-left: 1rem;

    // li {
    //     margin-bottom: 1.5rem;
    // }
}
</style>
