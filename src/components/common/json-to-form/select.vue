<template>
    <div>
        <nitrozen-dropdown
            :items="items"
            :disabled="disabled"
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
        <nitrozen-error v-if="errorMessage">{{ errorMessage }}</nitrozen-error>
    </div>
</template>

<script>
import { NitrozenDropdown, NitrozenError } from '@gofynd/nitrozen-vue';
export default {
    name: 'JsonToFormSelect',
    components: {
        NitrozenDropdown,
        NitrozenError
    },
    props: {
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
