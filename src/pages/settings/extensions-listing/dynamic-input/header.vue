<template>
    <div class="text-container">
        <span class="title">{{ prop_schema.value }}</span>
    </div>
</template>

<script>
import { NitrozenCheckBox, NitrozenTooltip } from '@gofynd/nitrozen-vue';

export default {
    name: 'input-type-header',
    props: ['prop_schema', 'prop', 'name'],
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    mounted() {},
    watch: {},
    data() {
        return {};
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.text-container {
    .title {
        display: inline-block;
    }
}
</style>
