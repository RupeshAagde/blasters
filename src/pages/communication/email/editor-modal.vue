<template>
    <transition name="modal" v-if="isOpen">
        <div
            class="modal"
            ref="modal"
            tabindex="0"
            @keydown.esc="closeDialog"
            v-bind:class="modalClass"
        >
            <div class="modal-container" v-click-outside="closeDialog">
                <div class="modal-header">
                    <div class="cross" @click="closeDialog" v-if="isCancelable">
                        <ukt-inline-svg
                            class="cross-icon"
                            :src="'cross-black'"
                        ></ukt-inline-svg
                        ><span class="cross-text">Close</span>
                        <slot name="header"></slot>
                    </div>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="less" scoped>
.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba(82, 78, 78, 0.52);
    transition: opacity 0.25s ease;

    .flex-center();
    @media @mobile {
        background-color: @White;
        height: 100%;
    }
    .modal-body{
        height: 100%;
    }
    .modal-container {
        background: #f9f9f9;

        min-width: 300px;
        min-height: 100px;
        max-width: 720px;
        max-height: 720px;
        overflow: auto;
        .modal-header {
            background: @White;
            height: 64px;

            .flex-center();
            justify-content: space-between;
        }
        .cross {
            display: flex;
            width: 100%;
            margin-right: 24px;
            align-items: center;
            .cross-icon {
                margin-left: 24px;
                cursor: pointer;
                /deep/#prefix__Imported-Layers-Copy-6 {
                    stroke: #2E31BE;
                }
            }
            .cross-text {
                margin-left: 12px;
                color: #2E31BE;
                font-family: Inter;
                font-size: 16px;
                font-weight: 500;
                letter-spacing: 0;
                line-height: 25px;
                cursor: pointer;
            }
        }
        .modal-title {
            margin-left: 0;
            text-align: center;
            color: @Mako;
        }
    }
}
.width-100 {
    .modal-container {
        width: 100%;
        padding-bottom: 50px;
    }
}
@media @mobile {
    .modal {
        .modal-container {
            height: 98vh;
            width: 100%;
        }
    }
}
.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}
</style>

<script>
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';

export default {
    name: 'editor-modal',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        modalClass: {
            type: String,
            default: null,
            required: false
        },
        isCancelable: {
            type: Boolean,
            default: true
        },
        childHandleFocus: {
            type: Boolean,
            default: false
        }
    },
    updated() {
        if (this.isOpen && !this.childHandleFocus) {
            if (this.$refs.modal) {
                this.$refs.modal.focus();
            }
        }
    },
    methods: {
        closeDialog() {
            if (this.isCancelable) {
                this.$emit('closedialog');
            }
            document.body.style.overflowY = 'scroll';
        }
    },
    components: {
        'ukt-inline-svg': uktinlinesvg
    },
    mounted() {
        this.$root.$el.append(this.$el);
    },

    destroyed() {
        if (
            this.$el &&
            this.$el.parentNode &&
            this.$el.nodeName !== '#comment'
        ) {
            this.$el.parentNode.removeChild(this.$el);
        }
        document.body.style.overflowY = 'scroll';
    }
};
</script>
