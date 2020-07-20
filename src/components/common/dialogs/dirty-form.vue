<template>
    <transition name="modal">
        <nitrozen-dialog ref="dialog" :title="title" @close="close">
            <template slot="body">
                <div>{{ message }}</div>
            </template>
        </nitrozen-dialog>
    </transition>
</template>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
export default {
    name: 'dirty-form-dialog',
    components: {
        'nitrozen-dialog': NitrozenDialog
    },
    props: {
        title: {
            type: String,
            default: 'Do you want to leave this page?'
        },
        message: {
            type: String,
            default:
                "Your unsaved changes will be lost! Click 'Stay' if you wish to return to the page and save your existing changes."
        },
        leftButton: {
            type: String,
            default: 'Leave'
        },
        rightButton: {
            type: String,
            default: 'Stay'
        }
    },
    methods: {
        open() {
            this.$refs['dialog'].open({
                width: '400px',
                showCloseButton: true,
                dismissible: false,
                neutralButtonLabel: this.leftButton,
                positiveButtonLabel: this.rightButton
            });
        },
        close(e) {
            this.$emit('close', e);
        }
    }
};
</script>

<style lang="less" scoped></style>
