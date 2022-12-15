<template>
    <div class="comp-container" v-if="config && options">
        <div class="form-row" v-if="verified || disabled">
            <span
                v-if="verified"
                style="font-style: italic; color: #ee485d;"
                class="cl-Required regular-xxxs"
                >Verified Rule cannot be updated*</span
            >
            <span
                v-else
                style="font-style: italic; color: #ee485d;"
                class="cl-Required regular-xxxs"
                >Rule of subscribed plan cannot be updated*</span
            >
        </div>
        <div class="form-row no-pad">
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    :label="'Rule Name*'"
                    v-model="formData.name"
                ></nitrozen-input>
                <nitrozen-error :class="{ visible: errors['name'] }">
                    {{ errors['name'] || '-' }}
                </nitrozen-error>
            </div>
            <div class="form-item"></div>
        </div>
        <div
            class="form-row"
            v-if="cbs_opts.locations.length || cbs_opts.brands.length"
        >
            <div class="form-item">
                <nitrozen-dropdown
                    :disabled="disabled"
                    v-if="cbs_opts.locations.length"
                    :label="'Locations'"
                    :items="cbs_opts.locations"
                    :multiple="true"
                    :value="
                        formData.slug_values.location.map((item) => item.id)
                    "
                    @input="updateLocations"
                ></nitrozen-dropdown>
                <nitrozen-error>-</nitrozen-error>
            </div>
            <div class="form-item">
                <nitrozen-dropdown
                    :disabled="disabled"
                    v-if="cbs_opts.brands.length"
                    :label="'Brands'"
                    :items="brands"
                    :multiple="true"
                    :searchable="true"
                    :value="formData.slug_values.brand.map((item) => item.id)"
                    @input="updateBrands"
                    @searchInputChange="searchBrands"
                ></nitrozen-dropdown>
                <nitrozen-chips
                    style="margin-top: 8px;"
                    v-for="(brand, index) in formData.slug_values.brand || []"
                    :key="index"
                    >{{ brand.name }}
                    <nitrozen-inline
                        :icon="'cross'"
                        class="nitrozen-icon"
                        v-on:click="removeBrand(index)"
                    ></nitrozen-inline>
                </nitrozen-chips>
            </div>
        </div>

        <div class="form-row no-pad">
            <div class="bold-sm top-headers">
                Change Settlement Status
            </div>
        </div>
        <div class="form-row no-pad">
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    :label="'High Street'"
                    v-model="formData.settle_cycle_period.high_street"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    :label="'Mall'"
                    v-model="formData.settle_cycle_period.mall"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
            <div class="form-item">
                <nitrozen-input
                    :disabled="disabled"
                    :label="'Warehouse'"
                    v-model="formData.settle_cycle_period.warehouse"
                    :type="'number'"
                >
                </nitrozen-input>
            </div>
        </div>

        <div class="form-row form-compact-items no-pad">
            <div class="form-item">
                <nitrozen-dropdown
                    :disabled="disabled"
                    :label="'Settlement Type'"
                    :items="[
                        {
                            value: 'weekly',
                            text: 'Weekly'
                        },
                        {
                            value: 'monthly',
                            text: 'Monthly'
                        }
                    ]"
                    v-model="formData.settlement_type"
                ></nitrozen-dropdown>
                <nitrozen-error>-</nitrozen-error>
            </div>
            <div class="form-item" v-if="!plan_type_rule">
                <date-picker
                    style="width: 300px;"
                    :disabled="disabled"
                    :label="'Date From and To'"
                    :useNitrozenTheme="true"
                    :range="true"
                    :date_format="'DD/MM/YYYY'"
                    :value="date_range"
                    @input="
                        (dates) => {
                            formData.rule_start_date = dates[0];
                            formData.rule_end_date = dates[1];
                        }
                    "
                ></date-picker>
            </div>
        </div>

        <div class="form-row no-pad">
            <div class="bold-sm top-headers">
                Select a Formula/Condition
            </div>
        </div>
        <div
            v-for="comp_key in Object.keys(options)"
            :key="comp_key"
            class="form-row rule-row-cont"
        >
            <div class="form-item">
                <div class="form-row">
                    <nitrozen-checkbox
                        :disabled="disabled"
                        :value="tran_comp[comp_key] !== undefined"
                        @input="
                            (value) => {
                                updateComponent(
                                    value ? options[comp_key][0].id : null,
                                    comp_key,
                                    'transaction'
                                );
                            }
                        "
                    >
                        <span
                            class="bold-xs"
                            :class="{ 'disabled-ctrl': disabled }"
                            >{{ getCamelCase(comp_key) }}</span
                        >
                    </nitrozen-checkbox>
                </div>
                <div
                    class="form-row full-row"
                    v-show="tran_comp[comp_key] !== undefined"
                    v-for="opt_obj in options[comp_key]"
                    :key="opt_obj.id"
                >
                    <nitrozen-radio
                        :disabled="disabled"
                        :name="`${comp_key}_main_${component_id}`"
                        :radioValue="opt_obj.id"
                        v-model="tran_comp[comp_key]"
                    >
                        <span class="regular-xs">{{
                            opt_obj.description
                        }}</span>
                        <span
                            ><nitrozen-tooltip
                                :tooltipText="opt_obj.formula"
                            ></nitrozen-tooltip
                        ></span>
                    </nitrozen-radio>
                </div>
                <div
                    v-if="
                        tran_comp[comp_key] &&
                            options[comp_key].find(
                                (opt) => opt.id === tran_comp[comp_key]
                            ).user_input_fields.length
                    "
                >
                    <div
                        class="form-row"
                        v-for="user_input in options[comp_key].find(
                            (opt) => opt.id === tran_comp[comp_key]
                        ).user_input_fields"
                        :key="user_input.id"
                    >
                        <div class="form-item">
                            <div class="form-row">
                                <span
                                    class="bold-xs"
                                    :class="{ 'disabled-ctrl': disabled }"
                                    >{{ getCamelCase(user_input) }}</span
                                >
                            </div>
                            <div class="form-row">
                                <div class="form-item">
                                    <nitrozen-dropdown
                                        :disabled="disabled"
                                        :label="'   '"
                                        :items="input_types"
                                        :value="
                                            cond_data[user_input]
                                                ? 'conditional'
                                                : 'fixed'
                                        "
                                        @input="
                                            (value) => {
                                                updateComponent(
                                                    value === 'fixed'
                                                        ? 0
                                                        : null,
                                                    user_input,
                                                    'default'
                                                );
                                                updateComponent(
                                                    value === 'conditional'
                                                        ? {
                                                              on:
                                                                  conditional_types[0]
                                                                      .value,
                                                              condition: '0'
                                                          }
                                                        : null,
                                                    user_input,
                                                    'conditional'
                                                );
                                            }
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                                <div class="form-item">
                                    <nitrozen-dropdown
                                        :disabled="disabled"
                                        class="no-label"
                                        :label="'Condition Applicable On'"
                                        v-if="cond_data[user_input]"
                                        :items="conditional_types"
                                        :value="cond_data[user_input]['on']"
                                        @input="
                                            (value) =>
                                                updateComponent(
                                                    value,
                                                    user_input,
                                                    'conditional_value'
                                                )
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                            </div>
                            <div class="form-row form-compact-items no-pad">
                                <div class="form-item">
                                    <nitrozen-input
                                        :disabled="disabled"
                                        v-if="
                                            default_data[user_input] !==
                                                undefined
                                        "
                                        :label="'Value'"
                                        :type="'number'"
                                        v-model="default_data[user_input]"
                                    ></nitrozen-input>
                                    <nitrozen-input
                                        :disabled="disabled"
                                        v-else-if="cond_data[user_input]"
                                        :label="'Value'"
                                        v-model="
                                            cond_data[user_input]['condition']
                                        "
                                        :placeholder="
                                            '10 if shipment_value > 500 else 50'
                                        "
                                    ></nitrozen-input>
                                    <nitrozen-error
                                        :class="{ visible: errors[user_input] }"
                                    >
                                        {{ errors[user_input] || '-' }}
                                    </nitrozen-error>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
::v-deep .no-label {
    .nitrozen-dropdown-label {
        display: none;
    }
}

.nitrozen-dialog {
    ::v-deep .nitrozen-dialog-body {
        box-sizing: border-box;
    }
    .comp-container {
        &.plan-component {
            .form-row.rule-row-cont {
                border: 1px solid @DustyGray2;
                border-radius: @BorderRadius;
                padding: 8px 12px;
                box-sizing: border-box;
                + .rule-row-cont {
                    margin: 12px 0;
                }
            }
        }
    }
}
</style>

<script>
import {
    NitrozenInput,
    NitrozenRadio,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenTooltip,
    NitrozenError,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

import  DatePicker from '@/components/common/date-picker.vue';

import _ from 'lodash';

export default {
    name: 'daytrader-component',
    props: {
        config: {
            type: Object
        },
        plan_type_rule: {
            type: Boolean,
            default: true
        },
        options: {
            type: Object
        },
        cbs_opts: {
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        },
        component_id: {
            type: String
        },
        verified: {
            type: Boolean
        }
    },
    components: {
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'date-picker': DatePicker
    },
    mounted() {
        _.merge(this.formData, this.config);
    },
    data() {
        return {
            errors: {},
            searchBrand: '',
            auto_verify: false,
            input_types: [
                {
                    text: 'Fixed',
                    value: 'fixed'
                },
                {
                    text: 'Conditional',
                    value: 'conditional'
                }
            ],
            conditional_types: [
                {
                    text: 'Bag',
                    value: 'Bag'
                },
                {
                    text: 'Shipment',
                    value: 'Shipment'
                },
                {
                    text: 'Order',
                    value: 'Order'
                }
            ],
            formData: {
                name: '',
                slug_fields: ['channel'],
                slug_values: {
                    channel: {},
                    company: [],
                    brand: [],
                    location: []
                },
                rule_start_date: null,
                rule_end_date: null,
                settle_cycle_period: {
                    mall: 0,
                    warehouse: 0,
                    high_street: 0
                },
                settlement_type: '',
                transactional_components: {
                    is_tp: false,
                    defaults: {},
                    conditional: {},
                    transaction_component: {}
                }
            }
        };
    },
    computed: {
        main_config() {
            return this.formData.transactional_components;
        },
        tran_comp() {
            return this.main_config.transaction_component;
        },
        cond_data() {
            return this.main_config.conditional;
        },
        default_data() {
            return this.main_config.defaults;
        },
        date_range() {
            return [this.formData.rule_start_date, this.formData.rule_end_date];
        },
        brands() {
            let regexBrand = new RegExp(this.searchBrand, 'gi');
            return this.searchBrand
                ? this.cbs_opts.brands.filter((brand) =>
                      regexBrand.test(brand.text)
                  )
                : this.cbs_opts.brands;
        }
    },
    watch: {
        config() {
            _.merge(this.formData, this.config);
        }
    },
    methods: {
        searchBrands(evt) {
            this.searchBrand = evt.text;
        },
        validData() {
            let data = _.cloneDeep(this.formData);
            for (let key of Object.keys(data.slug_values)) {
                if (!data.slug_fields.includes(key)) {
                    delete data.slug_values[key];
                }
            }
            return data;
        },
        updateBrands(selected_value) {
            if (selected_value.length) {
                if (!this.formData.slug_fields.includes('brand')) {
                    this.formData.slug_fields.push('brand');
                }
            } else {
                let index = this.formData.slug_fields.indexOf('brand');
                this.formData.slug_fields.splice(index, 1);
            }
            this.formData.slug_values.brand.length = 0;
            this.formData.slug_values.brand.push(
                ...this.cbs_opts.brands
                    .filter((item) => selected_value.includes(item.value))
                    .map((item) => {
                        return { id: item.value, name: item.text };
                    })
            );
        },
        removeBrand(index) {
            this.formData.slug_values.brand.splice(index, 1);
        },
        updateLocations(selected_value) {
            if (selected_value.length) {
                if (!this.formData.slug_fields.includes('location')) {
                    this.formData.slug_fields.push('location');
                }
            } else {
                let index = this.formData.slug_fields.indexOf('location');
                this.formData.slug_fields.splice(index, 1);
            }
            this.formData.slug_values.location.length = 0;
            this.formData.slug_values.location.push(
                ...this.cbs_opts.locations
                    .filter((item) => selected_value.includes(item.value))
                    .map((item) => {
                        return { id: item.value, name: item.text };
                    })
            );
        },
        getCamelCase(str) {
            return str
                .split('_')
                .map((txt) => txt.replace(txt[0], txt[0].toUpperCase()))
                .join(' ');
        },
        resetData(data) {
            _.merge(this.formData, data);
        },
        updateComponent(value, key, type) {
            let obj = null;
            if (type === 'transaction') {
                obj = this.tran_comp;
                if (value) {
                    this.$set(this.default_data, key, 0);
                } else {
                    this.$delete(this.default_data, key);
                    this.$delete(this.cond_data, key);
                }
            } else if (type === 'conditional') {
                obj = this.cond_data;
            } else if (type === 'conditional_value') {
                obj = this.cond_data[key];
                key = 'on';
            } else {
                obj = this.default_data;
            }
            if (value !== null) {
                this.$set(obj, key, value);
            } else {
                this.$delete(obj, key);
            }
        },
        validateData() {
            let is_valid = true;
            this.errors = {};
            if (!this.formData.name) {
                this.errors['name'] = 'Required field';
                is_valid = false;
            }
            for (let key of Object.keys(this.tran_comp)) {
                for (let user_input of this.options[key].find(
                    (opt) => opt.id === this.tran_comp[key]
                ).user_input_fields) {
                    if (this.default_data[user_input] !== undefined) {
                        if (
                            this.default_data[user_input] < 1 ||
                            this.default_data[user_input] > 1000
                        ) {
                            this.errors[user_input] =
                                'Value must be between 1 to 1000';
                            is_valid = false;
                        }
                    } else if (this.cond_data[user_input] !== undefined) {
                        if (
                            !this.cond_data[user_input]['condition'] ||
                            !this.cond_data[user_input]['on']
                        ) {
                            this.errors[user_input] = 'Required';
                            is_valid = false;
                        }
                    } else {
                        this.errors[user_input] = 'Required';
                        is_valid = false;
                    }
                }
            }
            return is_valid;
        }
    }
};
</script>
