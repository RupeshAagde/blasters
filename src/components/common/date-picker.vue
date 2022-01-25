<template>
    <div class="vue-date-picker">
        <label :class="{ 'n-input-label': useNitrozenTheme }">
            <span
                :class="{
                    'dark-xs': !useNitrozenTheme,
                    'cl-DustyGray2': !useNitrozenTheme
                }"
                >{{ label }}</span
            >
        </label>

        <no-ssr>
            <vue-date-picker
                :input-class="
                    useNitrozenTheme ? 'n-input input-text' : 'mx-input'
                "
                lang="en"
                :placeholder="placeholder"
                :type="picker_type"
                :format="date_format"
                class="global-font-family form-date-picker"
                :value="value"
                :value-type="value_type"
                @input="$emit('input', getUTCDate($event))"
                :minute-step="5"
                :not-after="not_after"
                :not-before="not_before"
                :disabled="disabled"
                :show-time-header="show_time_header"
                :clearable="clearable"
                :range="range"
                :shortcuts="shortcuts"
                confirm
            />
        </no-ssr>
    </div>
</template>

<style lang="less" scoped>
@import './../../pages/less/page-header.less';
@import './../../pages/less/page-ui.less';
@import './../../pages/less/form.less';

.form .vue-date-picker > label {
    display: block;
}

::v-deep .mx-datepicker.global-font-family,
::v-deep .mx-calendar.mx-calendar-panel-date {
    font-family: 'Inter';
}
::v-deep.mx-input {
    box-shadow: none !important;
    border: 1px solid #e4e5e6;
}

.form-date-picker.mx-datepicker {
    width: 100%;
}
</style>

<script>
const VueDatePicker = () =>
    import(/*webpackChunkName:"vue2-datepicker" */ 'vue2-datepicker');

import NoSSR from 'vue-no-ssr';

export default {
    name: 'adm-date-picker',
    components: {
        VueDatePicker,
        'no-ssr': NoSSR
    },
    props: {
        clearable: {
            type: Boolean,
            default: true
        },
        range: {
            type: Boolean,
            default: false
        },
        shortcuts: {
            type: Array,
            default: () => {
                return [];
            }
        },
        placeholder: {
            type: String,
            default: 'Select Date'
        },
        label: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Array],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        picker_type: {
            type: String,
            default: 'date'
        },
        date_format: {
            type: String,
            default: 'DD-MM-YYYY'
        },
        not_after: {
            type: String,
            default: ''
        },
        not_before: {
            type: String,
            default: new Date().toISOString()
        },
        show_time_header: {
            type: Boolean,
            default: true
        },
        useNitrozenTheme: {
            type: Boolean,
            default: false
        },
        value_type: {
            type: String,
            default: 'date'
        }
    },
    methods: {
        // by default will return ISO date string to v-model variable
        // pass property and disable behavior if required.
        getUTCDate(date) {
            if (date instanceof Date) {
                return date.toISOString();
            } else if (date instanceof Array) {
                return date.map(d => {
                    return d instanceof Date ? d.toISOString() : '';
                });
            }
        }
    }
};
</script>
