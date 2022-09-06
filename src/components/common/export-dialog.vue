<template>
    <nitrozen-dialog
        ref="export-dialog"
        class="export-dialog"
        @close="onCloseAction"
    >
        <template slot="body">
            <div class="content">
                <h4 class="dialog-title">{{title}}</h4>
                <p class="dialog-para">
                    {{body}}
                </p>
            </div>
        </template>
        <template slot="footer"> </template>
    </nitrozen-dialog>
</template>

<script>
import {flatBtn, NitrozenButton, NitrozenDialog, strokeBtn,} from '@gofynd/nitrozen-vue';
import {DEFAULT_TITLE, DEFAULT_BODY} from "@/components/common/export/exportDialog-constant.js";
export default {
    name: 'export-dialog',
    components: { NitrozenDialog, flatBtn, NitrozenButton, strokeBtn },
    directives: { strokeBtn, flatBtn },
    data: () => ({
        negativeButtonLabel: 'No',
        positiveButtonLabel: 'Yes',
        
    }),
    props:{
        title: {
            type: String,
            required: true,
            default: DEFAULT_TITLE
        },
        body:{
            type:String,
            required: true,
            default: DEFAULT_BODY
        }
    },
    methods: {
        open() {
            const config = {
                width: '383px',
                negativeButtonLabel: this.negativeButtonLabel,
                positiveButtonLabel: this.positiveButtonLabel,
                showCloseButton: false,
                neutralButtonLabel: false,
                height: '223px',
                dismissible: true,
            };
            this.$refs['export-dialog'].open(config);
        },
        onCloseAction(actionName) {
          this.$emit(actionName);
            if (actionName === this.negativeButtonLabel) {
                return;
            }
            if (actionName === this.positiveButtonLabel) {
                return;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.export-dialog {
    background: #ffffff;
    border-radius: 12px;
}
::v-deep .nitrozen-dialog-backdrop {
    justify-content: center;

    .nitrozen-dialog-body {
        height: 60%;
    }

    .nitrozen-dialog {
        min-height: fit-content;
        border-radius: 12px;
    }

    .nitrozen-dialog-footer {
        display: flex !important;
        justify-content: space-between;
        flex-direction: row-reverse;
        margin: 0;
        margin-bottom: 40px;
        padding: 0 40px;
        gap: 20px;
        button {
            width: 100%;
            margin: 0;
        }
    }
}
.content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 40px;
    padding-bottom: 0px;
    align-items: center;
    justify-content: flex-start;

    .dialog-title {
        font-size: 18px;
        font-weight: 700;
        color: #333333;
        text-align: center;
    }
    .dialog-para {
        font-weight: 400;
        font-size: 12px;
        text-align: center;
        padding: 12px 16px;
    }
}
</style>
