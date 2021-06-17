<template>
    <nitrozen-dialog
        ref="feedback-details-dailog"
        title="Feedback"
        class="feedback-details-dailog"
    >
        <template slot="body">
            <div
                class="response-list"
                v-for="(response, index) in responses"
                v-bind:key="'response-item-'+index"
            >
                <div class="feedback">
                        <span>{{response.display}} :</span>
                        <span class="feedback-value">&nbsp;{{response.value}}</span>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<style lang="less" scoped>
.feedback-value {
    color: rgb(61, 61, 61);
    font-size: 14px;
    font-weight: bold;
    max-width: 60%;
}
.feedback {
    padding-top: 6px;
    padding-bottom: 6px;
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
                height: '400px',
                showCloseButton: true,
                dismissible: true
            });
        }
    }
}
</script>