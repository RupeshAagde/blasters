<template>
    <div class="container">
        <nitrozen-checkbox
            :value="verified"
            :checkboxValue="checked"
            class="nt-checkbox"
            @change="$emit('change', {key: name, value})"
        ></nitrozen-checkbox>
        <div class="block">
            <nitrozen-dropdown
                :items="items"
                disabled
                :label="label"
                :multiple="multiple"
                :placeholder="placeholder"
                :required="required"
                :searchable="searchable"
                :tooltip="tooltip"
                :value="value"
                @input="$emit('input', $event)"
                @change="$emit('change', $event)"
                @scroll="$emit('scroll', $event)"
            ></nitrozen-dropdown>
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
.hidden {
    visibility: hidden;
}
</style>
<script>
import { NitrozenDropdown, NitrozenError, NitrozenCheckBox } from '@gofynd/nitrozen-vue';
export default {
    name: 'JsonToFormSelect',
    components: {
        NitrozenDropdown,
        NitrozenError,
        'nitrozen-checkbox': NitrozenCheckBox,
    },
    props: {
        name: {
            type: String,
        },
        verified: {
            type: Boolean,
        },
        required: {
            type: Boolean,
        },
         checked: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            default: () => {
                return [];
            }
        },
        /**
         * disabled dropdown
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * dropdown label
         */
        label: {
            type: String
        },
        /**
         * multiselect value
         */
        multiple: {
            default: false
        },
        placeholder: {
            type: String
        },
        /**
         * dropdown selection required
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * searchable value
         */
        searchable: {
            default: false
        },
        tooltip: {
            type: String,
            default: ''
        },
        /**
         * selected value
         */
        value: {
            required: true
        },

        // error props
        errorMessage: {
            type: String,
            default: ''
        }
    }
};
</script>
