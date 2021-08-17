<template>
    <transition name="modal">
        <nitrozen-dialog ref="remark-dialog" :title="title" @close="close">
            <template slot="body">
                <nitrozen-input
                    type="textarea"
                    :placeholder="'Enter reason for rejection'"
                    v-model="remark"
                ></nitrozen-input>
            </template>
            <template slot="footer">
                <nitrozen-button
                    theme="secondary"
                    :disabled="remark===''"
                    @click="close('Continue')"
                    v-flatBtn
                >
                Reject
            </nitrozen-button>
            </template>
        </nitrozen-dialog>
    </transition>
</template>

<script>
import { NitrozenDialog, NitrozenInput, NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
export default {
    name: 'remark-msg-dialog',
    components: {
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
    },
    directives: {
        flatBtn
    },
    props: {
        title: {
            type: String,
            default: 'Reason for Rejection',
        },
    },
    data() {
        return {
            remark: '',
        };
    },
    methods: {
        open() {
            this.$refs['remark-dialog'].open({
                width: '600px',
                height: '300px',
                showCloseButton: true,
                dismissible: false,
                // neutralButtonLabel: false,
            });
        },
        continueBack(e) {
            this.close();
            this.$emit('continue', 'Reject', this.remark);
            this.remark = '';
        }, 
        close(e) {
            if(e === 'Continue') {
                this.$refs['remark-dialog'].close();
                this.$emit('continue', this.message);
                this.message = '';
            }
        }
    },
};
</script>

<style lang="less" scoped></style>
