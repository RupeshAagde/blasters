<template>
    <div class="jumbotron-container">
        <div class="txt-box">
            <div class="jumbotron-title">{{ title }}</div>
            <nitrozen-tooltip v-if="desc" class="cst-space-left">
                <div class="custom-tooltip-txt">{{ desc }}</div>
            </nitrozen-tooltip>
        </div>
        <div>
            <nitrozen-button
                v-if="btnLabel"
                :theme="'secondary'"
                v-flatBtn
                @click="btnClick"
                >{{ btnLabel }}</nitrozen-button
            >
            <slot />
        </div>
    </div>
</template>

<script>
import { NitrozenButton, NitrozenTooltip, flatBtn } from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';

export default {
    name: 'jumbotron',
    components: {
        NitrozenTooltip,
        'nitrozen-button': NitrozenButton
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
        illustration: {
            type: String,
            default: 'illustration'
        }
    },
    directives: {
        flatBtn
    },
    watch: {},
    data: function() {
        return {};
    },
    mounted() {},
    methods: {
        btnClick() {
            this.$emit('btnClick');
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
    font-family: Poppins;
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
    font-family: Poppins;
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
    font-weight: bold;
    font-size: 24px;
    line-height: 40px;
    text-align: left;
}
.jumbotron-description {
    font-size: 16px;
    line-height: 26px;
    color: @Mako;
}
::v-deep .nitrozen-tooltip {
    svg {
        height: 20px;
        width: 20px;
    }
}
</style>
