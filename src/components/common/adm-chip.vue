<template>
    <span class="chip regular-xs">
        <span v-if="!custom" class="disp cl-Mako">{{ item.display }}</span>
        <slot v-else />
        <span class="cross" @click="removeChip">
            <ukt-inline-svg :src="'cross-black'"></ukt-inline-svg>
        </span>
    </span>
</template>

<style lang="less" scoped>
.chip {
    display: inline-flex;
    align-items: center;
    border: 1px solid @Iron;
    padding: 7px 10px;
    margin: 0px 10px 5px 0px;
    border-radius: @BorderRadius;

    .disp {
        padding-right: 15px;
    }
    .cross {
        display: inline-flex;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
}
</style>

<script>
import uktinlinesvg from './ukt-inline-svg.vue';

export default {
    name: 'adm-chip',
    components: {
        'ukt-inline-svg': uktinlinesvg
    },
    props: {
        custom: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object
        }
    },
    methods: {
        removeChip(item) {
            this.$emit('remove-chip', this.item);
        }
    }
};
</script>
