<template>
    <div>
        <label
            v-for="(item, index) in options"
            :key="index"
            v-bind:class="[
                { 'radio-item': 1 },
                { horizontal: align == ALIGN.HORIZONTAL }
            ]"
        >
            <!-- <nitrozen-radio
                name="reason"
                v-model="selectedOption"
                @change="optionChanged"
                :radioValue="item.value"
            >
                {{ item.display }}
            </nitrozen-radio> -->
            <input
                type="radio"
                name="reason"
                :value="item"
                @change="optionChanged"
                v-model="selectedOption"
            />
            <div class="radio-content">
                <ukt-inline-svg
                    v-if="
                        !selectedOption || selectedOption.value !== item.value
                    "
                    :src="'regular'"
                ></ukt-inline-svg>
                <ukt-inline-svg
                    class="radio-selected"
                    v-if="selectedOption && selectedOption.value === item.value"
                    :src="'radio-selected'"
                ></ukt-inline-svg>
                <div>
                    <span class="text light-xs">{{ item.display }}</span>
                </div>
            </div>
        </label>
    </div>
</template>

<style lang="less" scoped>
// .radio-selected {
//     ::v-deep svg {
//         path {
//             fill: @DarkGray;
//         }
//         circle {
//             // stroke-width: 0px;
//             stroke: @DarkGray !important;
//         }
//     }
// }
.radio-item {
    input {
        display: none;
    }
    &.horizontal .radio-content {
        display: inline-flex;
    }
    .radio-content {
        display: flex;
        align-items: center;
        padding: 5px;
        cursor: pointer;
        .text {
            margin-left: 10px;
        }
    }
}
</style>

<script>
import { NitrozenRadio } from '@gofynd/nitrozen-vue';

import uktinlinesvg from './ukt-inline-svg.vue';
export const ALIGN = {
    VERTICLE: 1,
    HORIZONTAL: 2
};

export default {
    name: 'adm-radio-group',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-radio': NitrozenRadio
    },
    props: {
        options: {},
        selectedOpt: {},
        align: {
            type: Number,
            default: ALIGN.VERTICLE
        }
    },
    watch: {
        selectedOpt(val) {
            this.selectedOption = val || {};
        }
    },
    data() {
        return {
            selectedOption: this.selectedOpt
        };
    },
    computed: {
        ALIGN() {
            return ALIGN;
        }
    },
    methods: {
        getSelectedOption() {
            return this.selectedOption;
        },
        optionChanged(event) {
            this.$emit('on-change', this.selectedOption);
        }
    }
};
</script>
