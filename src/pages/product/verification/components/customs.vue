<template>
    <div>
        <div class="custom base">
            <div class="header">
                <div class="cl-Mako bold-md">
                    Customs Information
                </div>
            </div>

            <!-- Country of origin -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :disabled="displayCheck('country_of_origin')"
                    :value="rejectedFields.country_of_origin ? false :  true"
                    :checkboxValue="rejectedFields.country_of_origin"
                    id="rejectedFields.country_of_origin"
                    class="nt-checkbox"
                    @change="$emit('trigger-verify', {'key': 'country_of_origin', value: country_of_origin.value})"
                 >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        disabled
                        label="Country of Origin *"
                        placeholder="Choose Country"
                        v-model="country_of_origin.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="rejectedFields.country_of_origin">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
                
            </div>
            <!-- HSN Code -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :disabled="displayCheck('hsn_code')"
                    :value="rejectedFields.hsn_code ? false :  true"
                    :checkboxValue="rejectedFields.hsn_code"
                    id="rejectedFields.hsn_code"
                    class="nt-checkbox"
                    @change="$emit('trigger-verify', {'key': 'hsn_code', value: hsn_code.value})"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        disabled
                        label="HS/HSN Code *"
                        placeholder="Choose HSN code"
                        v-model="hsn_code.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="rejectedFields.hsn_code">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
                
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>

.add-hsn {
    display: flex;
    justify-content: flex-end;
    line-height: 22px;
}

.mt-sm {
    margin-top: 20px;

    .nitrozen-form-input {
        width: 100%;
    }
}

.verify-block {
    display: flex;

    .block {
        display: block;
        width: 100%;
    }
}

</style>


<script>

// import SellerService from '@/services/admin-seller.service';
import path from 'path';
import { fieldSchemaValidation } from './util';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

import {
    NitrozenDropdown,
    NitrozenError,
    NitrozenInput,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';

const VALIDATE_FIELDS = [
    'hsn_code',
    'country_of_origin'
];


export default {
    name: 'CustomsSpecifications',
    components: {
        NitrozenError,
        NitrozenDropdown,
        NitrozenInput,
        'nitrozen-checkbox': NitrozenCheckBox,
    },

    data() {
        return {
            hsn_code: this.getInitialValue(),
            country_of_origin: this.getInitialValue(),
            countries: [],
            hsnCodes: [],
            countryList: [],
            hsnCodesList: [],
        };
    },

    watch: {

    },

    computed: {

    },
    mounted() {
        // this.fetchHSNAndCountry();
        this.populateForm();
    },
    props: {
        rejectedFields: {
            type: Object,
            default: () => {return {}}
        },
        product: {
            type: Object,
            default: () => {
                return {};
            }
        },
        globalSchema: {
            type: Object,
            default: () => {
                return {};
            }
        },
        companyId: {
            default: () => {
                return 0;
            }
        },
        errMsgRequired: {
            type: String,
            default: () => {
                return "This field is required to verify the product"
            }
        },
        all_required_fields: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    methods: {
        getInitialValue() {
            return {
                value: '',
                error: ''
            };
        },
        loadCountries() {
            if (isEmpty(this.countryList)) {
                return;
            }
            const INDIA = 'India';
            this.countries = this.countryList;
            const indiaIndex = this.countries.indexOf(INDIA);
            this.countries.splice(indiaIndex, 1);
            this.countries.unshift(INDIA);
        },
        displayCheck(fieldName){
            return !(this.all_required_fields.includes(fieldName))
        },
        setCountryList(e = {}) {
            this.countryList = [];
            this.countries.forEach(c => {
                if (
                    !e ||
                    !e.text ||
                    c.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.countryList.push({
                        text: c,
                        value: c
                    });
                }
            });
        },
        setHSNCodesList(e = {}) {
            this.hsnCodesList = [];
            this.hsnCodes.forEach(code => {
                if (
                    !e ||
                    !e.text ||
                    code.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.hsnCodesList.push({
                        text: code,
                        value: code
                    });
                }
            });
        },
        validateForm() {
            let isValid = true;
            VALIDATE_FIELDS.forEach(prop => {
                isValid = !this[prop].error && isValid;
                isValid = this.validateField(prop) && isValid;
            });

            return isValid;
        },
        validateField(prop) {
            this[prop].error = '';
            this[prop].error = fieldSchemaValidation(
                this.globalSchema,
                prop,
                this[prop].value
            );
            return !this[prop].error;
        },
        populateForm() {
            try {
                // this.setCountryList();
                // this.setHSNCodesList();

                this.country_of_origin.value =
                    this.product.country_of_origin ||
                    (this.countries.length && this.countries[0]);
                this.$emit(
                    'change-origin-country',
                    this.country_of_origin.value
                );

                this.hsn_code.value =
                    this.product.hsn_code ||
                    (this.hsnCodes.length && this.hsnCodes[0]);
                this.$emit('change-hsn-code', this.hsn_code.value);
            } catch (err) {
                this.$snackbar.global.showError('Something not right here');
                console.error(err);
            }
        },
        getFormData() {
            let value = {
                hsn_code: this.hsn_code.value,
                country_of_origin: this.country_of_origin.value,
            };
            return pickBy(value, identity);
        },
        redirectAddHSN() {
            return path.join(this.$basePath, '/product-taxation/add');
        }
    }
};
</script>