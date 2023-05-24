<template>
    <div class="comp-container" v-if="config && options">
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
                    class="form-adv"
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
                            <div class="form-row form-adv-cn">
                                <div class="form-item">
                                    <nitrozen-dropdown
                                        :disabled="disabled"
                                        :label="'   '"
                                        :items="(comp_key == 'commission') ? input_types_comission : input_types"
                                        :value="
                                        ((comp_key == 'commission') && (selectedVariable == true)) ?
                                            'variable' :
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
                                                variableComponent(
                                                    value === 'variable'
                                                        ? 0
                                                        : null,
                                                    user_input,
                                                    'variable'
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

                            <div class="variable-container"  v-if="variable_data[user_input]">
                                <div class="slab-wrap">
                                    <nitrozen-checkbox  v-model="selectedSlab"> Slab </nitrozen-checkbox>
                                    <div class="slab-dropdown">
                                        <nitrozen-dropdown
                                        class="slab-dp-item"
                                        id="slab-cycle-name"
                                        :items="cycleItems"
                                        v-model="slab.cycle"
                                        label = "Cycle"
                                        placeholder="Select Cycle"
                                        ></nitrozen-dropdown>
                                        <nitrozen-dropdown
                                        class="slab-dp-item"
                                            v-model="slab.expression_variable_used"
                                            placeholder="Net Sales"
                                            label="Variable Name"
                                            :disabled="true"
                                        ></nitrozen-dropdown>
                                    </div>
                                    <div class="expression-wrap">
                                        <nitrozen-dropdown
                                            v-model="slab.expression"
                                            :items="expressionItems"
                                            placeholder="No condition, only digits : 0"
                                            label="Expression Template"
                                        ></nitrozen-dropdown>
                                        <nitrozen-input
                                            class="expression-input"
                                            v-model="slab.expression"
                                            placeholder="Enter Here"
                                            >
                                        </nitrozen-input>
                                    </div>
                                </div>
                                <div class="flat-wrap">
                                    <nitrozen-checkbox  
                                    v-model="selectedFlat" 
                                    @change="changeFlatValue"> Flat </nitrozen-checkbox>
                                    <div class="flat-optns-wrap" v-if="selectedFlat">
                                        <div class="flat-dropdown">
                                        <nitrozen-dropdown
                                        class="flat-dp-item"
                                        id="flat-cycle-name"
                                        :items="cycleItems"
                                        v-model="flat.cycle"
                                        label = "Cycle"
                                        placeholder="Select Cycle"
                                        ></nitrozen-dropdown>
                                        </div>
                                        <div class="expression-wrap">
                                            <nitrozen-input
                                                class="expression-input"
                                                v-model="flat.value"
                                                placeholder="Enter Here"
                                                >
                                            </nitrozen-input>
                                        </div>
                                        <div class="priority-wrap">
                                            <nitrozen-dropdown
                                                :items="priorityItems"
                                                v-model="selectedPriority"
                                                label = "Set Priority"
                                                placeholder="Select Priority"
                                            ></nitrozen-dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btns-wrap">
            <nitrozen-button
                v-strokeBtn
                :theme="'secondary'"
                class="more-filters"
                @click="saveRuleForm"
                >Save
            </nitrozen-button>
            <nitrozen-button
                v-flatBtn
                :theme="'secondary'"
                class="more-filters"
                @click="cancelRuleForm"
                >Cancel
            </nitrozen-button>
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
}
::v-deep .nitrozen-checkbox-container{
    line-height: 19px;

}
.plan-component {
    .form-row.rule-row-cont {
        border: 1px solid #9B9B9B;
        border-radius:3px;
        padding: 16px 12px;
        box-sizing: border-box;
        + .rule-row-cont {
            margin: 12px 0;
        }
    }

    .form-row.full-row {
        padding-top: 15px;
    }

    .form-adv{
        padding-top: 10px;
    }

    .form-adv-cn{
        .form-item{
            padding-top: 15px;
        }
    }

    .form-compact-items{
        padding-top: 15px;
    }

}
.top-headers{
        color: #41434c;
        font-size: 18px;
        font-weight: 700;
        line-height: 23px;
        padding: 30px 0 20px;
    }
    .slab-wrap{
        padding: 20px 0;

        .slab-dropdown{
            padding: 20px 0;
            display: flex;
            box-sizing: border-box;
            margin: 0 -10px;

            .slab-dp-item{
                width: 50%;
                max-width: 50%;
                box-sizing: border-box;
                padding: 0 10px;
            }
        }
    }

    .expression-input{
        padding-top: 20px;
    }
    .flat-dropdown{
        padding-top: 15px;
    }
    .priority-wrap{
        padding-top: 20px;
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
    NitrozenInline,
    NitrozenButton,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

import { DatePicker } from '@/components/common/date-picker.vue';

import _ from 'lodash';

export default {
    name: 'daytrader-component',
    props: {
        config: {
            type: Object
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
        component_type: {
            type: String
        },
        form_data: {
            type: Object
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
        'date-picker': DatePicker,
        'nitrozen-button':NitrozenButton
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mounted() {
        
        this.formData.transactional_components = this.form_data; //add condition here for edit
    },
    data() {
        return {
            errors: {},
            searchBrand: '',
            auto_verify: false,
            selectedSlab: true,
            selectedFlat: false,
            selectedPriority: 'high',
            priorityItems:[
                {
                    text: 'Whichever is higher',
                    value: 'high'
                },
                {
                    text: 'Whichever is lower',
                    value: 'low'
                },
            ],
            cycleItems: [
                {
                    text: 'Monthly',
                    value: 'monthly'
                },
                {
                    text: 'Weekly',
                    value: 'weekly'
                },
                {
                    text: 'Yearly',
                    value: 'yearly'
                },
                {
                    text: 'Fiscal Year',
                    value: 'fiscal year'
                }

            ],
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
            input_types_comission: [
                {
                    text: 'Fixed',
                    value: 'fixed'
                },
                {
                    text: 'Conditional',
                    value: 'conditional'
                },
                {
                    text: 'Variable',
                    value: 'variable'
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
            expressionItems:[
                {
                    text: 'No condition, only digits : 0',
                    value: 'No condition, only digits : 0'
                },
                {
                    text: 'One Condition : 2.5 if net_sales <= 5000000 else 2',
                    value: 'One Condition : 2.5 if net_sales <= 5000000 else 2'
                },
                {
                    text: 'Two Condition : 5 if net_sales <= 5000000 else 3 if net_sales <= 10000000 else 2.5',
                    value: 'Two Condition : 5 if net_sales <= 5000000 else 3 if net_sales <= 10000000 else 2.5'
                },

            ],
            slab: 
            {
                "cycle": "weekly",
                "expression": "No condition, only digits : 0",
                "expression_variable_used": [
                    "net_sales"
                ]
            },
            flat: {
                "cycle": "weekly",
                "value": "1000"
            },
            selectedVariable: false,
            variableObj: {},
            formData: {
                name: '',
                slug_fields: [],
                slug_values: {
                    channel: [],
                    company: [],
                    brand: [],
                    location: [],
                    affiliate:[]
                },
                type_of_request:"create_entity",
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
                    variable_conditional:{
                        
                    },
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
        variable_data(){
            return this.main_config.variable_conditional;
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
        saveRuleForm(){
            this.$emit("passData", { form:this.formData, compType:this.component_type}  );

        },
        cancelRuleForm(){

        },
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
        changeFlatValue(){
            if(this.selectedFlat == false){
                this.formData.transactional_components.variable_conditional.commission["flat"] = this.flat;
            }
            else if((this.selectedFlat == true) && (this.formData.transactional_components.variable_conditional.commission["flat"])){
                delete this.formData.transactional_components.variable_conditional.commission["flat"]
            }

        },
        variableComponent(value, key, type) {
            let obj = this.formData.transactional_components.variable_conditional;
            if(value == 0){
                obj[key] = {};
                this.selectedVariable = true;
                this.createVariablePayload();
            }
            else{
                this.selectedVariable = false;
                this.$delete(obj, key);
            }
        },
        createVariablePayload(){

           this.variableObj = {
                slab: this.slab,
                condition: {
                    "whichever_is_higher": (this.selectedPriority == "high") ? true : false,
                    "whichever_is_lower": (this.selectedPriority == "low") ? true : false
                },
            };

            this.formData.transactional_components.variable_conditional.commission = this.variableObj;

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
            }
            else {
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
