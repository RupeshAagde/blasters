<template>
    <nitrozen-dialog ref="dialog"  title="Edit Title">
        <template slot="body">
            <nitrozen-input type="text" label="Title *" v-model="header"></nitrozen-input>
            <nitrozen-error v-if="!header">
                Title is required
             </nitrozen-error>
        </template>
        <template slot="footer">
            <div class="footer">
                <nitrozen-button
                    class="footer-btn"
                    :theme="'secondary'"
                    @click="save"
                    > Save </nitrozen-button
                >
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>


import {
    NitrozenDialog,
    NitrozenInput,
    NitrozenButton,
    NitrozenError
} from '@gofynd/nitrozen-vue';

export default {
    name: 'edit-header',
    components: {
        NitrozenButton,
        NitrozenDialog,
        "nitrozen-input": NitrozenInput,
        'nitrozen-error': NitrozenError,
    },
    mounted() {
        
    },
    data() {
        return {
            header: ''
        }
    },
    methods: {
        open(title) {
            this.header = title
            this.$refs["dialog"].open({
                width: "600px",
                showCloseButton: true,
            });
        },
        save() {
            if (this.header) {
                this.$emit('saveTitle', this.header)
                this.$refs['dialog'].close();
            }
        }
    }
};
</script>

<style lang="less" scoped>
</style>
