<template>
    <div class="header">
        <inline-svg src="yellow-exclamatory-mark"></inline-svg>
        <div class="question">Are you sure?</div>
        <div class="question-main">
            <p>Have you checked the customer note at the </p>
            <p> product level? If not, double-check before </p>
            <p> confirming this order </p>
        </div>
        <div class="buttons">
            <nitrozen-button class="button-submit" theme="secondary" v-strokeBtn @click="clicked(false)">Stay Here</nitrozen-button>
            <nitrozen-button class="button-submit" theme="secondary" v-flatBtn @click="clicked(true)">Yes, Continue</nitrozen-button>
        </div>
    </div>
</template>

<script>
/* Component imports */
import { NitrozenBadge, NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'order-confirm-popup',
    components: {
        InlineSvg,
        NitrozenBadge,
        NitrozenButton,
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    methods: {
        clicked(value) {
            this.$emit("buttonCliked", value)
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    .question {
        font-weight: 700;
        font-size: 18px;
        line-height: 25px;
        color: #333333;
        margin-top: 16px;
    }
    .question-main {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 400;
        font-size: 12px;
        line-height: 17px;
        color: #666666;
    }
    .buttons {
        margin-top: 32px;
        display: flex;
        flex-direction: row;
        gap: 20px;
    }
}
</style>