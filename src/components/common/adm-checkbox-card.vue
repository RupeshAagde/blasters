<template>
    <div>
        <div
            class="main-div"
            :class="{ 'cursor-pointer': !disabled }"
            @click="select"
        >
            <nitrozen-checkbox
                :value="cardStatus"
                v-if="inputType == 'checkbox'"
                :disabled="disabled"
                @click.native.prevent=""
            >
            </nitrozen-checkbox>
            <nitrozen-radio
                v-if="inputType == 'radio'"
                class="cl-Mako regular-xs"
                :radioValue="radioValue"
                v-model="cardStatus"
                :disabled="disabled"
            >
            </nitrozen-radio>
            <label>
                <div class="access" :class="{ 'cursor-pointer': !disabled }">
                    <span v-if="text1" class="text1">{{ text1 }}</span>
                    <span
                        v-if="text2"
                        class="desc"
                        :class="{ 'cursor-pointer': !disabled }"
                        >{{ text2 }}</span
                    >
                    <slot name="text1"></slot>
                    <slot name="text2"></slot>
                </div>
                <slot></slot>
            </label>
        </div>
    </div>
</template>

<style lang="less" scoped>
.cursor-pointer {
    cursor: pointer;
}
.main-div {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    box-sizing: border-box;
    border: 1px solid #e4e5e6;
    border-radius: 4px;
    padding: 16px;
    .access {
        color: #41434c;
        font-weight: bold;
        line-height: 25px;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .text1 {
            font-size: 14px;
        }
        .desc {
            margin-top: 5px;
            font-size: 12px;
            line-height: 19px;
            font-weight: 400;
        }
    }
}
</style>

<script>
import { NitrozenRadio, NitrozenCheckBox } from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-checkbox-card',
    components: {
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    watch: {
        status(value) {
            this.cardStatus = value;
        }
    },
    props: {
        inputType: {
            type: String,
            default: 'checkbox'
        },
        radioValue: {
            type: String
        },
        text1: {
            type: String,
            default: ''
        },
        text2: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            cardStatus: this.status || false
        };
    },
    methods: {
        select() {
            if (!this.disabled) {
                this.cardStatus = !this.cardStatus;
                this.$emit('changeStatus');
            }
        }
    }
};
</script>
