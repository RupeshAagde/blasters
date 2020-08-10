<template>
    <div class="form-row">
        <label class="label dark-xxxs cl-DustyGray2" v-if="label"
            >{{ label }}<span v-if="required">&nbsp;*</span></label
        >
        <span class="nitrozen-tooltip-icon" v-if="showTooltip">
            <nitrozen-tooltip
                :position="'top'"
                :tooltipText="tooltipText"
            ></nitrozen-tooltip>
        </span>
        <input
            v-if="!custom"
            :type="type"
            :placeholder="placeholder"
            :disabled="inputInfo.disabled"
            class="common-input input-text"
            v-model="inputInfo.value"
            @keydown.enter="keydownEnter"
            @keydown.tab="keydownTab"
        />
        <template v-if="custom">
            <slot />
        </template>
        <div
            v-bind:class="[{ visible: inputInfo.showerror }, 'form-error']"
            class="light-xxxxs"
        >
            {{ inputInfo.errortext }}
        </div>
    </div>
</template>

<style lang="less" scoped>
.label {
    line-height: 20px;
}
</style>

<script>
import { NitrozenTooltip } from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';

export default {
    name: 'adm-form-input',
    components: {
        NitrozenTooltip
    },
    props: {
        item: {
            type: Object,
            default: function() {
                return {};
            }
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: ''
        },
        custom: {
            type: Boolean,
            default: false
        },
        /** new nitrozen (Supports only text) */
        showTooltip: {
            type: Boolean,
            default: false
        },
        tooltipText: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputInfo: this.item
        };
    },
    methods: {
        getText() {
            return this.inputInfo.value;
        },
        isEmpty(obj) {
            return _.isEmpty(obj);
        },
        keydownEnter(event) {
            this.$emit('keydownEnter', event);
        },
        keydownTab(event) {
            this.$emit('keydownTab', event);
        }
    }
};
</script>
