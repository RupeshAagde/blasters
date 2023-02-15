<template>
    <div :id="id">
        <transition name="slide-fade" @before-enter="onBeforeEnter">
            <div
                class="slide-backdrop"
                @click="backdropClick($event)"
                v-show="isModalVisible"
            >
                <div class="container" ref="slide-backdrop" role="dialog">
                    <header
                        class="nitrozen-dialog-header"
                        v-show="title"
                        :id="id + '_title'"
                    >
                        <slot name="header">
                            {{ title }}
                        </slot>
                        <div
                            @click="close($event, 'close')"
                            v-if="showCloseButton"
                        >
                            <inline-svg title="close" src="cross-black" />
                        </div>
                    </header>

                    <section class="nitrozen-dialog-body" :id="id + '_desc'">
                        <slot name="body"></slot>
                    </section>

                    <footer class="nitrozen-dialog-footer">
                        <slot name="footer">
                            <nitrozen-button
                                v-if="negativeButtonLabel"
                                :theme="`${theme || 'secondary'}`"
                                v-strokeBtn
                                class="nitrozen-dialog-footer-button-margin"
                                @click="close($event, negativeButtonLabel)"
                                >{{ negativeButtonLabel }}</nitrozen-button
                            >
                            <nitrozen-button
                                v-if="neutralButtonLabel"
                                :theme="`${theme || 'secondary'}`"
                                class="nitrozen-dialog-footer-button-margin"
                                @click="close($event, neutralButtonLabel)"
                                >{{ neutralButtonLabel }}</nitrozen-button
                            >
                            <nitrozen-button
                                :disabled="positiveButtonDisabled"
                                v-if="positiveButtonLabel"
                                :theme="`${theme || 'secondary'}`"
                                v-flatBtn
                                @click="close($event, positiveButtonLabel)"
                                >{{ positiveButtonLabel }}</nitrozen-button
                            >
                        </slot>
                    </footer>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
export default {
    name: 'nitrozen-slide-dialog',
    components: {
        NitrozenButton,

        InlineSvg
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        /**
         * Unique identifier
         */
        id: {
            type: [Number, String]
        },
        /**
         * title of dialog
         */
        title: {
            type: String
        },
        /**
         * theme of button
         */
        theme: {
            type: String
        }
    },
    data: () => {
        return {
            height: '100%',
            width: '70%',
            data: null,
            dismissible: true,
            isModalVisible: false,
            negativeButtonLabel: false,
            neutralButtonLabel: 'Ok',
            positiveButtonLabel: false,
            showCloseButton: false,
            positiveButtonDisabled: false
        };
    },
    created() {
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', this.handleESCKey);
        }
    },
    destroyed() {
        document.removeEventListener('keydown', this.handleESCKey);
    },
    methods: {
        onBeforeEnter(el) {
            if (this.height != undefined)
                this.$refs['slide-backdrop'].style.height = this.height;
            if (this.width != undefined)
                this.$refs['slide-backdrop'].style.width = this.width;
        },
        open(config = {}) {
            // background scroll disabled on nitrozen dialog open
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.position = 'fixed';

            this.isModalVisible = true;
            if (config.height != undefined) this.height = config.height;
            if (config.width != undefined) this.width = config.width;
            if (config.positiveButtonLabel != undefined) {
                this.positiveButtonLabel = config.positiveButtonLabel;
            }
            if (config.negativeButtonLabel != undefined) {
                this.negativeButtonLabel = config.negativeButtonLabel;
            }
            if (config.neutralButtonLabel != undefined) {
                this.neutralButtonLabel = config.neutralButtonLabel;
            }
            if (config.dismissible != undefined) {
                this.dismissible = config.dismissible;
            }
            if (config.showCloseButton != undefined) {
                this.showCloseButton = config.showCloseButton;
            }
            if (config.data != undefined) {
                this.data = config.data;
            }
            if ('positiveButtonDisabled' in config) {
                this.positiveButtonDisabled = config.positiveButtonDisabled;
            }
            this.$emit('open');
            return this;
        },
        close(event, data) {
            // background scroll enable on nitrozen dialog close
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            event.preventDefault();
            event.stopPropagation();
            this.isModalVisible = false;
            this.$emit('close', data);
            return this;
        },
        isOpen() {
            return this.isModalVisible;
        },
        backdropClick(e) {
            // close dialog on outside click
            const dialog = this.$refs['slide-backdrop'];
            if (this.dismissible && !dialog.contains(e.target)) {
                this.close(e);
            }
        },
        handleESCKey: function(event) {
            // ESC key detection
            if (event.keyCode == 27 && this.dismissible && this.isOpen()) {
                event.preventDefault();
                event.stopPropagation();
                this.close(event, 'close');
            }
        },
        updateConfig(config = {}) {
            if ('positiveButtonDisabled' in config) {
                this.positiveButtonDisabled = config.positiveButtonDisabled;
            }
        }
    }
};
</script>

<style lang="less">
.slide-fade-leave-active .slide-fade-enter-active {
    transition: all 0.5s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.slide-backdrop {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: 999;
    .container {
        position: absolute;
        right: 0px;
        width: 70%;
        height: 100%;
        background: @White;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
        .cancel-btn {
            position: absolute;
            top: 15px;
            right: 20px;
            cursor: pointer;
        }
    }

    .nitrozen-dialog-header,
    .nitrozen-dialog-footer {
        display: flex;
    }

    .nitrozen-dialog-header {
        align-items: center;
        padding: 0 24px;
        line-height: 24px;
        min-height: 80px;
        font-size: 16px;
        font-weight: bold;
        color: @Black;
        justify-content: space-between;
        border-bottom: 1px solid #e0e0e0;
        .nitrozen-inline-svg {
            width: 14px;
            height: 14px;
            cursor: pointer;
            /deep/svg {
                width: 14px;
                height: 14px;
            }
        }
    }

    .nitrozen-dialog-footer {
        padding: 16px 24px;
        height: 36px;
        justify-content: flex-end;
        box-shadow: 0px -1px 12px rgba(0, 0, 0, 0.05);
        .nitrozen-dialog-negative-button {
            color: #fa3f4d;
        }
        .nitrozen-dialog-footer-button-margin {
            margin-right: 16px;
        }
    }

    .nitrozen-dialog-body {
        flex: 1;
        padding: 24px 24px;
        position: relative;
        line-height: 19px;
        font-size: 14px;
        color: @Black;
        overflow: auto;
        height: calc(100% - 200px);
    }
}
.cross-icon {
    ::v-deep svg {
        -ms-transform: rotate(20deg); /* IE 9 */
        transform: rotate(45deg);
        width: 28px;
        height: 28px;
    }
}
</style>
