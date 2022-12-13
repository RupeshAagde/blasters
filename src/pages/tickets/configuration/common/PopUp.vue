<template>
    <div>
        <div class="popup">
            <div class="close_btn" @click="cancelHelper">
                <inline-svg class="close-btn-svg" :src="'close'"> </inline-svg>
            </div>

            <div class="popup-container">
                <div class="contant">
                    <div class="warning-svg">
                        <inline-svg :src="'yellow-warning-icon'"></inline-svg>
                    </div>
                    <div class="text-heading">
                        {{ textHeading }}
                    </div>
                    <div class="text-decs">
                        {{ infoText }}
                    </div>

                    <div class="buttons">
                        <nitrozen-button
                            class="no_btn"
                            v-stroke-btn
                            :rounded="false"
                            :theme="'secondary'"
                            @click="cancelHelper"
                        >
                            No
                        </nitrozen-button>

                        <nitrozen-button
                            class="yes_btn"
                            v-flat-btn
                            :rounded="false"
                            :theme="'secondary'"
                            @click="confirmHelper"
                        >
                            Yes
                        </nitrozen-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import inlineSvg from '@/components/common/inline-svg.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

export default {
    name: 'popup',
    props: ['confirm,', 'cancel', 'infoText', 'textHeading'],
    components: {
        'inline-svg': inlineSvg,
        'nitrozen-button': NitrozenButton
    },
    methods: {
        confirmHelper() {
            this.$emit('confirm');
        },
        cancelHelper() {
            this.$emit('cancel');
        }
    }
};
</script>

<style scoped>
.popup {
    top: 0;
    left: 0;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    position: fixed;
}
.close_btn {
    cursor: pointer;
    position: absolute;
    right: 0px;
    height: 100%;
    width: 100%;
    padding: 20px;
    justify-content: flex-end;
    display: flex;
}

.close-btn-svg {
    align-items: flex-start;
}

.popup-container {
    width: 270px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    padding: 40px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
    border-radius: 12px;
    text-align: center;
    line-height: 140%;
}

.warning-svg {
    width: 50px;
    display: contents;
}

.text-heading {
    margin: 16px 0px 12px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
    color: #333333;
}

.text-decs {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    text-align: center;
    color: #666666;
}
.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    
}
::v-deep .ripple {
  width: 47%;
}
</style>
