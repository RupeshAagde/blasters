<template>
    <div class="collapse collapse-item" :class="{ 'is-active': active }">
        <div class="collapse-header touchable" @click="toggle">
            <slot name="collapse-header"></slot>
        </div>
        <transition name="fade">
            <div class="collapse-content" v-if="active">
                <div class="collapse-content-box">
                    <slot name="collapse-body"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Uktinlinesvg from './ukt-inline-svg';

export default {
    name: 'collapse',
    components: { Uktinlinesvg },
    data() {
        return {
            active: false,
        };
    },
    props: {
        selected: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    created() {
        this.active = this.selected;
    },

    methods: {
        toggle() {
            this.active = !this.active;
            this.$emit('collapse-state', this.active);
        },
    },
};
</script>

<style lang="less" scoped>
* {
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
}
.collapse {
    padding-bottom: 0.5rem;

    .collapse-header {
        cursor: pointer;
        padding: 15px 0;
        background: transparent;
        position: relative;
    }
}
.collapse .collapse-header > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collapse .collapse-header h3 {
    font-size: 16px;
    font-weight: 700;
}

.collapse .collapse-content-box {
    -moz-transition: all 0.2s;
    -o-transition: all 0.2s;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
.collapse-content-box {
    padding-bottom: 10px;
}
.fade-enter-active {
    transform: translate(0);
    transition: 100ms ease-in-out;
}
.fade-leave-active {
    transform: translateY(-20px) scaleY(0.4);
    transition: 100ms ease-in-out;
}
</style>
