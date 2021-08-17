<template>
    <div>
        <div class="custom base">
            <div class="header">
                <div class="cl-Mako bold-md mb-sm">
                    Customs Information
                </div>
            </div>

            <!-- Country of origin -->
            <div class="verify-block">
                <nitrozen-checkbox
                    :value="rejectedFields.country_of_origin ? false :  true"
                    :checkboxValue="rejectedFields.country_of_origin"
                    id="rejectedFields.country_of_origin"
                    class="nt-checkbox, checkbox-align"
                    @change="$emit('trigger-verify', {'key': 'country_of_origin', value: country_of_origin.value})"
                 >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        disabled
                        label="Country of Origin *"
                        placeholder="Choose Country"
                        :showTooltip="true"
                        tooltipText="Country of Origin"
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
                    :value="rejectedFields.hsn_code ? false :  true"
                    :checkboxValue="rejectedFields.hsn_code"
                    id="rejectedFields.hsn_code"
                    class="nt-checkbox, checkbox-align"
                    @change="$emit('trigger-verify', {'key': 'hsn_code', value: hsn_code.value})"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        disabled
                        label="HS/HSN Code *"
                        placeholder="Choose HSN code"
                        :showTooltip="true"
                        tooltipText="HS/HSN Code"
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
.hidden {
    visibility: hidden;
}
.checkbox-align {
    margin-top: 30px;
}
.mb-sm {
    margin-bottom: 12px;
}

</style>


<script>

import {
    NitrozenDropdown,
    NitrozenError,
    NitrozenInput,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';



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
    mounted() {
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
        errMsgRequired: {
            type: String,
            default: () => {
                return "This field is required to verify the product"
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
        populateForm() {
            try {
                this.country_of_origin.value = this.product.country_of_origin
                this.hsn_code.value = this.product.hsn_code;
            } catch (err) {
                this.$snackbar.global.showError('Something not right here');
            }
        }
    }
};
</script>