<template>
    <nitrozen-dialog ref="n-dialog">
        <section slot="body">
            <slot name="body">
                <div class="confirmation-body">
                    <div class="header">
                        <div class="icon">
                            <adm-inline-svg :src="src" />
                        </div>
                        <div class="title">
                            <span>{{ dialogData.title }}</span>
                        </div>
                    </div>
                    <div class="message">
                        <span>{{ dialogData.message }}</span>
                    </div>
                </div>
            </slot>
        </section>
        <template slot="footer">
            <slot name="footer">
                <div class="confirmation-footer">
                    <nitrozen-button
                        class="cancel-btn"
                        :theme="cancelBtnTheme"
                        v-stroke-btn
                        @click="closeConfirmation('cancel')"
                        >{{ cancelBtnTitle }}</nitrozen-button
                    >
                    <nitrozen-button
                        class="save-btn"
                        :theme="saveBtnTheme"
                        v-flat-btn
                        @click="closeConfirmation('save')"
                        >{{ saveBtnTitle }}</nitrozen-button
                    >
                </div>
            </slot>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import AdmInlineSvg from '@/components/common/adm-inline-svg.vue';
export default {
    name: 'confirmation-dialog-box',
    components: {
        NitrozenButton,
        NitrozenDialog,
        AdmInlineSvg
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        src: {
            type: String,
            default: 'warning'
        },
        cancelBtnTheme: {
            type: String,
            default: 'secondary'
        },
        cancelBtnTitle: {
            type: String,
            default: 'Cancel'
        },
        saveBtnTheme: {
            type: String,
            default: 'secondary'
        },
        saveBtnTitle: {
            type: String,
            default: 'Save'
        }
    },
    data: () => {
        return {
            dialogData: {}
        };
    },
    methods: {
        openConfirmation(config = {}) {
            if (config) {
                this.dialogData = config;
            }
            this.$refs['n-dialog'].open({
                width: config.width ? config.width : '350px',
                height: config.height ? config.height : '300px'
            });
        },
        closeConfirmation(action) {
            this.$emit(action, this.dialogData);
            this.$refs['n-dialog'].close();
        }
    }
};
</script>

<style lang="less" scoped>
.confirmation-body {
    padding: 40px 12px 0px 12px;
    font-family: Inter;
    letter-spacing: 0em;
    text-align: center;
    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        line-height: 23px;
        .title {
            margin-top: 16px;
            color: #41434c;
            font-size: 18px;
            line-height: 130%;
        }
    }
    .message {
        margin: 12px 0px;
        font-size: 12px;
        font-weight: 400;
        line-height: 19px;
        color: #5c5c5c;
    }
}
.confirmation-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0px 12px;
    .cancel-btn {
        width: 130px;
    }
    .save-btn {
        width: 130px;
    }
}
::v-deep .icon {
    svg {
        width: 48px;
        height: 48px;
    }
}
::v-deep .nitrozen-dialog-backdrop .nitrozen-dialog {
    border-radius: 12px;
}
::v-deep .nitrozen-dialog-backdrop .nitrozen-dialog-footer {
    margin-bottom: 40px;
}
</style>
