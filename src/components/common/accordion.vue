<template>
    <div>
        <div
            class="bold-sm cl-Mako label outer-container"
            @click="isOpen = !isOpen"
            :class="titleClass"
        >
            <span v-if="title" class="title">{{ title }}</span>
            <span class="title">
                <slot name="header"></slot>
            </span>
            <span
                class="filter"
                v-bind:class="{
                    'filter-arrow-down': !isOpen,
                    'filter-arrow-up': isOpen
                }"
            >
                <ukt-inline-svg :src="'arrow-dropdown-black'"></ukt-inline-svg>
            </span>
        </div>
        <div :class="{ hide: !isOpen }">
            <slot />
        </div>
    </div>
</template>

<style lang="less" scoped>
.hide {
    display: none;
}
.filter {
    position: absolute;
    right: 20px;
}
.filter-arrow-up {
    margin-left: auto;
    transform: rotate(180deg);
}
.filter-arrow-down {
    margin-left: auto;
}
.label {
    cursor: pointer;
}
.outer-container {
    display: flex;
    align-items: center;
    .title {
        width: 100%;
    }
}
</style>

<script>
import uktinlinesvg from './ukt-inline-svg.vue';

export default {
    name: 'fy-accordion',
    components: {
        'ukt-inline-svg': uktinlinesvg
    },
    props: {
        initialState: {
            type: Boolean,
            default: true
        },
        title: {},
        titleClass: {}
    },
    data() {
        return { isOpen: this.initialState };
    }
};
</script>
