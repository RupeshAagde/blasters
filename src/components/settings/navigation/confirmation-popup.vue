<template>
    <div>
        <div class="main">
            <nitrozen-dialog ref="dialog">
                <template slot="body">
                    <div class="title-container">
                        <div class="header-svg">
                            <inline-svg :src="'warning-yallow'"> </inline-svg>
                            <div class="title"> {{ header }}</div>
                        </div>

                        <p class="info"> {{ info }}</p>
                    </div>
                </template>
                <template slot="footer">
                    <div class="footer">
                        <nitrozen-button class="footer-btn" style="margin-right: 32px; width: 133px;" :theme="'secondary'" @click="save(false)" v-strokeBtn> {{
                            cancleButtonName
                        }} </nitrozen-button>

                        <nitrozen-button class="footer-btn" style="width: 133px;" :theme="'secondary'" @click="save(true)" v-flatBtn> {{
                            confirmButtonName
                        }} </nitrozen-button>
                    </div>
                </template>
            </nitrozen-dialog>
        </div>

        <div class="panel" v-if="isPopUpOpen && type === 'panel'">
            <div class="popupBackGround">
                <div v-click-outside="popupToggle" class="popup-container position">
                    <div class="title titleContainer">
                        <div class="header-svg header">
                            <inline-svg :src="'panel-warning'"> </inline-svg>
                            <div class="title"> {{ header }}</div>
                        </div>
                        <div>
                            <div class="info"> {{ info }}</div>
                        </div>
                    </div>
                    <div class="footer footerBtn">
                        <div style="margin-right: 20px;">
                            <nitrozen-button class="footer-btn button" :theme="'secondary'" @click.stop="save(false)"
                                v-strokeBtn> {{ cancleButtonName }} </nitrozen-button>
                        </div>

                        <div>
                            <nitrozen-button class="footer-btn button" :theme="'secondary'" @click.stop="save(true)"
                                v-flatBtn> {{ confirmButtonName }} </nitrozen-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


import {
    NitrozenDialog,
    NitrozenInput,
    NitrozenButton,
    NitrozenError,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { InlineSvg } from '@/components/common/';
export default {
    name: 'confirmation-popup',
    components: {
        NitrozenButton,
        NitrozenDialog,
        "nitrozen-input": NitrozenInput,
        'nitrozen-error': NitrozenError,
        'inline-svg': InlineSvg,
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            header: '',
            info: '',
            confirmButtonName: '',
            cancleButtonName: '',
            isPopUpOpen: false,
            type: ''
        }
    },
    methods: {
        popupToggle() {
            this.isPopUpOpen = !this.isPopUpOpen
            this.$emit('onUpdate', false)
        },
        open(popupInfo) {
            this.isPopUpOpen = !this.isPopUpOpen
            this.header = popupInfo.header
            this.info = popupInfo.info
            this.confirmButtonName = popupInfo.confirmButtonName
            this.cancleButtonName = popupInfo.cancleButtonName
            this.type = popupInfo.type
            if (this.type === 'main') {
                this.$refs["dialog"].open({
                    showCloseButton: false,
                    width: "368px",
                    height: "255px"
                });
            }
        },
        save(isSave) {
            this.$emit('onUpdate', isSave)
            this.isPopUpOpen = !this.isPopUpOpen
            if (this.type === 'main') {
                this.$refs['dialog'].close();
            }
        }
    }
};
</script>

<style lang="less" scoped>
.panel {
    .position {
        width: 428px;
        height: 145px;
        top: 96px;
        right: 23px;
        padding: 16px;
        position: fixed;
    }

    .title {
        font-weight: 600;
        font-size: 14px;
        margin-left: 10px;
        margin-top: 3px;
    }

    .header {
        display: flex;
    }

    .footerBtn {
        display: flex;
        justify-content: end;
        margin-top: 14px;
        margin-right: 14px;
    }

    .buttonMargin {
        margin-right: 10px;
    }

}

.main {
    .title-container {
        padding-top: 24px;

        .header-svg {
            display: flex;
            flex-direction: column;
            align-items: center;

            .title {
                text-align: center;
                font-weight: 600;
                font-size: 18px;
                margin-top: 14px;
                display: flex;
                color: @Mako;
            }
        }

        .info {
            font-weight: 400;
            font-size: 12px;
            margin-top: 14px;
            color: @DoveGray;
            text-align: center;
        }
    }

    .footer {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}


//common
.popup-container {
    z-index: @menu;
    background: @White;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    .header {
        color: @Mako;
    }

    .info {
        font-weight: 400;
        font-size: 12px;
        margin-top: 14px;
        color: @DoveGray;
        line-height: 160%;
    }
}
</style>
