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
                    :value="rejectedFields.country_of_origin ? false :  true"
                    :checkboxValue="rejectedFields.country_of_origin"
                    id="rejectedFields.country_of_origin"
                    class="nt-checkbox"
                    @change="$emit('trigger-verify', {'key': 'country_of_origin', value: country_of_origin.value})"
                 >
                </nitrozen-checkbox>
                <nitrozen-input
                    disabled
                    label="Country of Origin *"
                    placeholder="Choose Country"
                    v-model="country_of_origin.value"
                ></nitrozen-input>
            </div>
            <!-- HSN Code -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="rejectedFields.hsn_code ? false :  true"
                    :checkboxValue="rejectedFields.hsn_code"
                    id="rejectedFields.hsn_code"
                    class="nt-checkbox"
                    @change="$emit('trigger-verify', {'key': 'hsn_code', value: hsn_code.value})"
                >
                </nitrozen-checkbox>
                <nitrozen-input
                    disabled
                    label="HS/HSN Code *"
                    placeholder="Choose HSN code"
                    v-model="hsn_code.value"
                ></nitrozen-input>
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
}

.verify-block {
    display: flex;
    align-items: center;
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
        rejectedFields: {
            type: Object,
            default: () => {
                return {};
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
        // fetchHSNAndCountry() {
        //     const params = {
        //         company_id: this.companyId
        //     };
        //     return new Promise((resolve, reject) => {
        //         SellerService.getHSNAnCountryList(params)
        //         .then(( { data }) => {
        //             this.hsnCodes = data.data.hsn_code;
        //             this.countryList = data.data.country_of_origin;
        //             this.loadCountries();
        //             this.populateForm();
        //             return resolve();
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             return reject(err);
        //         })
        //     })
        // },
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