<template>
    <div
        class="check-box"
        v-on="checked === null ? { click: toggleCheckedState } : null"
    >
        <span>
            <ukt-inline-svg
                :src="checked || value ? 'check-box-selected' : 'regular'"
            ></ukt-inline-svg>
        </span>
        <span class="check-box-label light-xs">{{ label }}</span>
    </div>
</template>

<style lang="less" scoped>
.check-box {
    display: flex;
    align-items: center;
    cursor: pointer;
}
</style>

<script>
import uktInlineSvg from './ukt-inline-svg.vue';
export default {
    name: 'ukt-check-box',
    props: {
        checked: {
            type: Boolean,
            default: null
        },
        value: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: ''
        }
    },
    components: {
        'ukt-inline-svg': uktInlineSvg
    },
    methods: {
        toggleCheckedState() {
            this.$emit('input', !this.value);
        }
    }
};
</script>
