<template>
    <div class="cl-RoyalBlue bold-xs toggle-btn-cont">
        <span
            class="bold-xs clickable-label"
            :class="{
                'cl-DustyGray2': !value,
                'cl-RoyalBlue': value
            }"
            @click="$emit('input', !value)"
            >{{ value ? text[0] : text[1] }}</span
        >
        <nitrozen-toggle
            class="pad-right"
            :value="value"
            @input="$emit('input', !value)"
        ></nitrozen-toggle>
    </div>
</template>

<style lang="less" scoped>
.toggle-btn-cont {
    display: flex;
    justify-content: flex-end;
    flex: 1;
}
.clickable-label {
    cursor: pointer;
}
</style>

<script>
import { NitrozenToggleBtn } from '@gofynd/nitrozen-vue';
export default {
    name: 'toggle-switch',
    props: {
        value: {
            type: Boolean
        },
        text: {
            type: Array,
            default: function() {
                return ['Active', 'Inactive'];
            }
        }
    },
    components: {
        'nitrozen-toggle': NitrozenToggleBtn
    }
};
</script>
