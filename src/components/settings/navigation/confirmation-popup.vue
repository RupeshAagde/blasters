<template>
    <div :class="type" v-if="isPopUpOpen">
        <div class="popupBackGround">
            <div  v-click-outside="popupToggle" class="popup-container position">
            <div class="title titleContainer">
                <div class="header-svg header" > 
                    <inline-svg :src=" type === 'panel' ? 'panel-warning' : 'warning-yallow'"> </inline-svg> 
                    <div class="title"> {{ header }}</div>
                </div>
                <div>
                    <div class="info"> {{ info }}</div>
                </div>
            </div>
            <div class="footer footerBtn">
                <div style="margin-right: 20px;">
                    <nitrozen-button
                    class="footer-btn button"
                    :theme="'secondary'"
                    @click.stop="save(false)"
                    v-strokeBtn
                    > {{ cancleButtonName }} </nitrozen-button>
                </div >
    
                <div>
                    <nitrozen-button
                    class="footer-btn button"
                    :theme="'secondary'"
                    @click.stop="save(true)"
                    v-flatBtn
                    > {{ confirmButtonName }} </nitrozen-button>
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
        },
        save(isSave) {
            this.$emit('onUpdate', isSave)
            this.isPopUpOpen = !this.isPopUpOpen
        }
    }
};
</script>

<style lang="less" scoped>
.main {
    .position {
        width: 368px;
        height: 291px;
        padding: 40px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%; -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box
    }

    .header {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-weight: 600;
        font-size: 18px;
        margin-top: 14px;
    }

    .footerBtn {
        display: flex;
        justify-content: space-evenly;
        margin-top: 32px;
    }

    .button {
        width: 133px;
    }

    .popupBackGround {
        position: fixed;
        background-color: rgba(82, 78, 78, 0.52);
        height: 100vh;
        width: 100vw;
        z-index: 16;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .titleContainer {
        width: 267px;
        // height: 38px;
    }
}

.panel {
    .position {
        width: 428px;
        height: 115px;
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
    }

    .buttonMargin {
        margin-right: 10px;
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
    }
}
</style>
