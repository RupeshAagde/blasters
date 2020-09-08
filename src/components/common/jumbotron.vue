<template>
    <div class="jumbotron-container">
        <div class="txt-box">
            <h1 class="jumbotron-title">{{ title }}</h1>
            <nitrozen-tooltip
                class="cst-space-left"
                v-if="desc"
                :tooltipText="desc"
            ></nitrozen-tooltip>
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
    font-size: 28px;
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
        height: 15px;
        width: 15px;
    }
}
::v-deep .nitrozen-tooltiptext {
    line-height: 14px;
    font-family: Poppins;
    font-size: 10px;
    // text-align: left !important;
}
</style>
