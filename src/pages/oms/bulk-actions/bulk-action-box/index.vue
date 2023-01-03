<template>
    <div class="bulk-action-box">
        <div class="header">
            <slot name="header"></slot>
        </div>

        <div class="content">
            <slot name="content"></slot>
        </div>

        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bulk-action-box'
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.bulk-action-box {
    background: rgba(231, 238, 255, 0.3);
    height: 400px;
    font-family: 'Inter', sans-serif;
    padding: 16px;
    font-size: 12px;
    border: 1px dashed #2E31BE;
    border-radius: 4px;
    position: relative;
    line-height: 19px;

    .header {
        margin-bottom: 24px;
    }

    .footer {
        position: absolute;
        bottom: 16px;
        width: calc(100% - 32px);
    }
}

</style>
