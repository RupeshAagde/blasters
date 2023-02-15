<template>
    <div class="inline info-badge">
        <nitrozen-inline icon="info" />
        <div class="text">{{ lineItem.text }}</div>
    </div>
</template>

<script>
import { NitrozenInline } from '@gofynd/nitrozen-vue';

export default {
    name: 'badge-component',
    components: {
        NitrozenInline
    },
    props: ['lineItem'],
    methods: {
        saveForm() {
            return undefined;
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';
.inline {
    display: flex;
}
.info-badge {
    background: #f5f8ff;
    border-radius: 4px;
    font-size: 13px;
    padding: 13px;
    margin: 16px 24px;
}
.text {
    padding-left: 10px;
    font-weight: 400;
    font-size: 12px;
    color: @Mako;
}
</style>
