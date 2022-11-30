<template>
    <div class="jumbotron-container">
        <div class="txt-box">
            <div class="jumbotron-title">{{ title }}</div>
            <nitrozen-tooltip v-if="desc" class="cst-space-left">
                <div class="custom-tooltip-txt">{{ desc }}</div>
            </nitrozen-tooltip>
        </div>
        <div class="jumbotron-btns">
            <!--  Not removing the logic as of now, will remove after x0 testing and demo -->
            <!-- <div>  
                <span class="custom-txt">Custom</span>
                <nitrozen-toggle
                    :value="toggleValue"
                    @change="toggleClick"
                    :disabled="false"
                />
            </div>  -->
            <nitrozen-button
                v-if="btnLabel"
                :theme="'secondary'"
                v-flatBtn
                @click="btnClick"
                >{{ btnLabel }}
            </nitrozen-button>
            <slot />
        </div>
    </div>
</template>

<script>
import { NitrozenButton,
    NitrozenTooltip,
    flatBtn,
    NitrozenToggleBtn
 } from '@gofynd/nitrozen-vue';

export default {
    name: 'custom-rules-channel-header',
    components: {
        NitrozenTooltip,
        'nitrozen-button': NitrozenButton,
        'nitrozen-toggle': NitrozenToggleBtn
    },
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        },
        desc: {
            type: String,
            default: ''
        },
        btnLabel: {
            type: String
        },
        onToggleClick: {
            type: Function
        },
        toggleValue: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        flatBtn
    },
    watch: {},
    mounted() {},
    methods: {
        btnClick() {
            this.$emit('btnClick');
        },
        toggleClick(){
            this.$emit('onToggleClick', !this.toggleValue);
        }
    }
};
</script>

<style lang="less" scoped>
.cst-space-left {
    margin-left: 10px;
}
.custom-tooltip-txt {
    line-height: 20px;
    font-family: Inter;
    font-size: 12px;
    text-align: left;
    min-width: 200px;
    padding: 6px 12px;
}
.txt-box {
    display: flex;
    align-items: center;
}
.jumbotron-container {
    font-family: Inter;
    padding: 20px 24px;
    border: 1px solid @Iron;
    border-radius: 3px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    background-color: @White;
}

.jumbotron-title {
    // padding: 11.25px 0;
    color: @Mako;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    text-align: left;
}
.jumbotron-description {
    font-size: 16px;
    line-height: 26px;
    color: @Mako;
}
.jumbotron-btns{
    display: flex;
    gap: 20px;

    & > div{
        display: flex;
        align-items: center;
    }
    .custom-txt{
        font-weight: 600;
    }
}
::v-deep .nitrozen-tooltip {
    svg {
        height: 20px;
        width: 20px;
    }
}
</style>
