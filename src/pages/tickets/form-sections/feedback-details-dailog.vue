<template>
    <nitrozen-dialog
        ref="feedback-details-dailog"
        title="Feedback"
        class="feedback-details-dailog"
    >
        <template slot="body">
            <div class="feedback-header">
                <p style="flex:0.5">Parameters</p>
                <p style="flex:0.5">User's response</p>
            </div>
            <div
                class="response-list"
                v-for="(response, index) in responses"
                v-bind:key="'response-item-'+index"
            >
                <div class="feedback">
                        <p style="flex:0.5">{{response.display}}</p>
                        <p style="flex:0.5">{{response.value}}</p>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<style lang="less" scoped>
.feedback-header {
    display: flex;
    height: 40px;
    background-color: whitesmoke
}
.feedback {
    display: flex;
    height: 40px;
    background-color: whitesmoke
}
</style>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';

export default {
name: 'feedback-details-dailog',
    components: {
        NitrozenDialog
    },
    data() {
        return {
            responses:[],
        }
    },
    methods: {
        openFeedback(feedback) {
            console.log(feedback);
            this.responses = feedback.response || [];
            this.$refs['feedback-details-dailog'].open({
                width: '600px',
                showCloseButton: true,
                dismissible: true
            });
        }
    }
}
</script>