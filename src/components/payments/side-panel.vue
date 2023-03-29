<template>
    <div v-if="showSidePanel">
        <transition name="slide">
            <template>
                <div class="slide-fade" ref="slide-fade">
                    <div class="container">
                        <div class="header">
                            <div class="title">
                                {{ title }}
                            </div>
                            <div class="cancel-btn" @click="showSidePanelSection">
                                <inline-svg :src="'cross-side-panel'" class="icon"></inline-svg>
                            </div>
                                                    
                        </div>
                        <div class="forms" :style="formOpacity" :class="formOpacity.opacity === 0.5 ? 'avoid-clicks' : ''">
                            <slot name="body"></slot>
                        </div>
                        <div class="add-cancel-btn" >
                                <div class="cancle-btn">
                                    <nitrozen-button :theme="'secondary'" :disabled="formOpacity.opacity == 0.5" v-strokeBtn size:='small' @click.stop="showSidePanelSection"> Cancel </nitrozen-button>          
                                </div>
                                <div class="add-btn">
                                    <nitrozen-button :theme="'secondary'" :disabled="formOpacity.opacity == 0.5" @click.stop="saveConfigurations"  v-flatBtn> Proceed </nitrozen-button>
                                </div>
                        </div>
                    </div>
                </div>
                
            </template>
        </transition>
    </div>
</template>

<script>
const REQUIRED_FIELDS = [ 'to'];
import {
    NitrozenDropdown,
    NitrozenButton,
    strokeBtn,
    flatBtn,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
import ConfirmationPopup from '../settings/navigation/confirmation-popup.vue';
import { cloneDeep } from 'lodash';
import { InlineSvg } from '@/components/common/';
export default {
    name: 'side-panel',
    components: {
        'inline-svg': InlineSvg,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-button': NitrozenButton,
        'nitrozen-error': NitrozenError,
        'confirmation-popup': ConfirmationPopup,
    },
    directives: {
        strokeBtn,
        flatBtn,
    },
    data() {
        return {
            showSidePanel: false,
            deviceTo: [],
            errors: {},
            formOpacity: {
                opacity: 1,
            }
        };
    },
    props: {
        title: ''
    },
    methods: {
        showSidePanelSection() {
            this.clearError();
            this.showSidePanel = !this.showSidePanel;
            this.formOpacity.opacity = 1;
        },
        clearError() {
            this.errors = {};
        },
        close() {
            this.showSidePanel = false;
        },
        saveConfigurations() {
            this.$emit('copyConfiguration')
        },
        openSidePanel() {
            this.showSidePanelSection();
        }
    }
};
</script>

<style lang="less" scoped>
.slide-fade {
    height: 100%;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100%;
    background-color: rgba(82, 78, 78, 0.52);
    z-index: @dialog;
    .container {
        position: absolute;
        right: 0px;
        width: 506px;
        height: 100%;
        background: @White;
        overflow-y: scroll;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
        &::-webkit-scrollbar {
            display: none;
        }
        @media @mobile {
            position: fixed;
            width: 100%;
        }
    }
    .header {
        position: fixed;
        display: flex;
        justify-content: space-between;
        height: 72px;
        align-items: center;
        z-index: @gotop;
        background: @White;
        width: 506px;
        box-sizing: border-box;
        border-bottom: 0.5px solid @LightGray;
        .line {
            border: 0.5px solid @LightGray;
            margin: 0px;
        }

        .title {
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            margin-left: 24px;
            color: @Mako;
        }

        .cancel-btn {
            cursor: pointer;
            margin-right: 25px;
        }
    }
    .avoid-clicks {
        pointer-events: none;
    }
    .forms {
        margin: 80px 24px 80px 24px;
    }

    .add-cancel-btn {
        display: flex;
        position: fixed;
        width: 506px;
        bottom: 0;
        align-items: center;
        height: 72px;
        justify-content: right;
        background-color: @White;
        box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.06);

        .cancle-btn {
            margin-right: 15px;
        }

        .add-btn {
            margin-right: 24px;
        }
    }
}
</style>
