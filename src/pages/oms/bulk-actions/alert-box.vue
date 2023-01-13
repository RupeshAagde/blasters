<template>
    <div class="alert-box-container">
        <inline-svg class="loading-icon" src="oms-alerts-blue-icon" />
        <p class="alert-text">{{ text }}</p>
    </div>
</template>

<script>
/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'bulk-alert-box',
    props: {
        text: String
    },
    components: {
        InlineSvg
    }
}
</script>

<style lang="less" scoped>
@import '../../../less/common.less';
@import '../../../less/theme.less';

.alert-box-container {
    display: flex;
    // width: 100%;
    align-items: center;
    background: #E7EEFF;
    border: 1px solid #2E31BE;
    border-radius: 4px;
    padding: 12px;
    color: @Mako;
    font-size: 13px;
    line-height: 21px;
    font-family: 'Inter', sans-serif;
    margin-bottom: 1rem;

    .loading-icon {
        margin-right: 8px;
    }
}
</style>
