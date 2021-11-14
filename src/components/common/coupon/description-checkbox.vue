<template>
    <div
        class="box-container"
        @click="
            () => {
                this.checkboxValue = !this.checkboxValue;
                this.$emit('input', this.checkboxValue);
            }
        "
    >
        <nitrozen-checkbox :value="checkboxValue">
            <div class="cl-Mako dark-xs">{{ label }}</div>
        </nitrozen-checkbox>
        <div class="description-text cl-Mako regular-xxxs">
            {{ description }}
        </div>
    </div>
</template>

<style lang="less" scoped>
.box-container {
    cursor: pointer;
    padding: 16px;
    border: 1px solid @Iron;
    border-radius: 4px;
    ::v-deep .nitrozen-checkbox-container {
        pointer-events: none;
        line-height: 22px;
        .nitrozen-checkbox {
            margin-top: 2px;
        }
    }
    .description-text {
        pointer-events: none;
        line-height: 18px;
        margin-left: 30px;
    }
}
</style>

<script>
import { NitrozenCheckBox } from '@gofynd/nitrozen-vue';
export default {
    name: 'description-checkbox',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox
    },
    props: {
        value: {
            type: Boolean,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            checkboxValue: this.value
        };
    }
};
</script>
