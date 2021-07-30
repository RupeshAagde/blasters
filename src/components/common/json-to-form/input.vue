<template>
    <div class="container">
        <nitrozen-checkbox
            :disabled="!required"
            :value="verified"
            :checkboxValue="checked"
            class="nt-checkbox"
            @change="changeCheckboxVal"
        ></nitrozen-checkbox>
        <div class="block">
            <nitrozen-input
                :type="type"
                :label="label"
                :placeholder="placeholder"
                disabled
                :value="value"
                :showError="showError"
                :hint="hint"
                :search="search"
                :showSearchIcon="showSearchIcon"
                :showTooltip="showTooltip"
                :tooltipText="tooltipText"
                :maxlength="maxlength"
                :showPrefix="showPrefix"
                :showSuffix="showSuffix"
                :prefix="prefix"
                :suffix="suffix"
                :custom="custom"
                @input="$emit('input', $event)"
            ></nitrozen-input>
            <nitrozen-error v-if="errorMessage">
                {{ errorMessage }}
            </nitrozen-error>
        </div>
    </div>
</template>
<style lang="less" scoped>
.container {
    display: flex;
    .block {
        width: 100%;
        display: block;

        .nitrozen-form-input {
            width: 100%;
        }
    }
}
</style>
<script>
import { NitrozenInput, NitrozenError, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
// import { EventBus } from '@/event-bus';

export default {
    name: 'JsonToFormInput',
    components: {
        NitrozenInput,
        NitrozenError,

        'nitrozen-checkbox': NitrozenCheckBox,
    },
    props: {
        verified: {
            type: Boolean,
        },
        required: {
            type: Boolean,
        },
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: [Number, String],
            default: ''
        },
        name: {
            type: String,
        },
        showError: {
            type: Boolean,
            default: false
        },
        hint: {
            type: String,
            default: ''
        },
        search: {
            type: Boolean,
            default: false
        },
        showSearchIcon: {
            type: Boolean,
            default: false
        },
        showTooltip: {
            type: Boolean,
            default: false
        },
        tooltipText: {
            type: String,
            default: ''
        },
        maxlength: {
            type: Number
        },
        showPrefix: {
            type: Boolean,
            default: false
        },
        showSuffix: {
            type: Boolean,
            default: false
        },
        prefix: {
            type: String
        },
        suffix: {
            type: String
        },
        custom: {
            type: Boolean,
            default: false
        },
         checked: {
            type: Boolean,
            default: false,
        },
        

        // error props
        errorMessage: {
            type: String,
            default: ''
        }
    },
    methods: {
        changeCheckboxVal(e) {
            this.$emit('change', {key: this.name, value:this.value})
        }
    }
};
</script>
