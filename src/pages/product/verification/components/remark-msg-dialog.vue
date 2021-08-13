<template>
    <transition name="modal">
        <nitrozen-dialog ref="dialog" :title="title" @close="close">
            <template slot="body">
                <nitrozen-input
                    type="textarea"
                    :placeholder="'Kindly enter reason for rejecting'"
                    v-model="remark"
                ></nitrozen-input>
            </template>
            <template slot="footer">
                <nitrozen-button
                theme="secondary"
                :disabled="remark===''"
                @click="continueBack"
                v-flatBtn>
                Add remark and reject
            </nitrozen-button>
            </template>
        </nitrozen-dialog>
    </transition>
</template>

<script>
import { NitrozenDialog, NitrozenInput, NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import isEmpty from 'lodash';
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
            default: 'Remark',
        },
    },
    data() {
        return {
            remark: '',
        };
    },
    methods: {
        open() {
            this.$refs['dialog'].open({
                width: '600px',
                height: '300px',
                showCloseButton: true,
                dismissible: false,
                // neutralButtonLabel: false,
            });
        },
        continueBack(e) {
                this.$emit('continue', 'Reject', this.remark);
                this.remark = '';
        }, 
    },
};
</script>

<style lang="less" scoped></style>
