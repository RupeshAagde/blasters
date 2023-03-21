<template>
    <div class="alert-container" v-if="display">
        <div class="main-content">
            <adm-inline-svg class="warn-icon" src="warn-icon"></adm-inline-svg>
            <slot name="text" class=""></slot>
        </div>
        <slot name="action-btn">
        </slot>
    </div>
</template>

<script>
/* Package imports */

/* Component imports */
import AdmInlineSvg from '@/components/common/inline-svg.vue';
import Inlinesvg from '@/components/common/ukt-inline-svg.vue';

export default {
    name: 'warn-alert',
    props: {
        display: Boolean
    },
    components: {
        Inlinesvg,
        AdmInlineSvg
    },
    methods: {
        closeAlert() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="less" scoped>
@import './../../../less/theme.less';

.alert-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FDEDED;
    border: 1px solid #CD0909;
    border-radius: 4px;
    min-height: 46px;
    padding: 0 8px;
    margin-bottom: 1rem;

    .main-content {
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 400;

        .warn-icon {
            margin-right: 8px;
        }
    }

    .close-text {
        color: @RoyalBlue;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
    }
}
</style>
