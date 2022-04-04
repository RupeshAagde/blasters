<template>
    <nitrozen-dialog
        ref="products-data"
        class="item-collection-dialog"
        :title="title"
    >
        <template slot="body">
            <slot />
        </template>
        <template slot="footer">
            <div>
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    type="button"
                    @click="onSubmit"
                >
                    {{ footerTitle }}
                </nitrozen-button>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenInline,
    NitrozenButton,
    NitrozenDialog,
    flatBtn
} from '@gofynd/nitrozen-vue';
export default {
    name: 'item-dialog',
    components: {
        'nitrozen-button': NitrozenButton,
        'inline-svg': NitrozenInline,
        'nitrozen-dialog': NitrozenDialog
    },
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
        },
        footerTitle: {
            type: String
        }
    },
    directives: {
        flatBtn
    },
    updated() {
        if (this.isOpen) {
            this.$refs['products-data'].open({
                width: '80%',
                height: '89%',
                showCloseButton: true,
                dismissible: false,
                neutralButtonLabel: ''
            });
        }
    },
    methods: {
        onSubmit() {
            const modal = this.$refs['products-data'];
            modal && modal.close();
            this.$emit('onSubmit');
            document.body.style.position = 'relative';
        }
    },
    mounted() {
        this.$root.$el.append(this.$el);
        this.$emit('modalRef', this.$refs['products-data']);
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

<style lang="less" scoped>
.item-collection-dialog {
    ::v-deep .nitrozen-dialog-body {
        border-bottom: 1px solid #e1e1e1;
    }
}

.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: @dialog * 3;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba(82, 78, 78, 0.52);
    transition: opacity 0.25s ease;
    font-family: Inter;
    .blaster-scrollbar;
    .flex-center();
    @media @mobile {
        background-color: @White;
        height: 100%;
    }

    .modal-container {
        background-color: @White;
        min-width: 300px;
        border: 1px solid @White;
        border-radius: @BorderRadius;
        min-height: 100px;
        max-width: 720px;
        max-height: 720px;
        overflow: auto;
        .modal-header {
            padding: 10px 24px;
            border-bottom: 1px solid #d0d0d0;
            .flex-center();
            justify-content: space-between;
        }
        .modal-body {
            overflow: auto;
            box-sizing: border-box;
            padding: 24px;
            height: calc(100% - 45px);
        }
        .cross {
            span {
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
.modal-enter,
.modal-leave-to {
    transform: unset;
}
</style>
