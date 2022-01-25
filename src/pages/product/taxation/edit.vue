<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header :title="pageTitle()" @backClick="redirectBack">
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        @click="saveForm"
                        v-flatBtn
                        >Save</nitrozen-button
                    >
                    <template slot="page-slot-mobile-footer">
                        <nitrozen-button
                            :theme="'secondary'"
                            @click="saveForm"
                            class="footer-actions"
                            v-flatBtn
                            >Save</nitrozen-button
                        >
                    </template>
                </div>
            </adm-page-header>
        </div>
        <loader v-if="pageLoading" class="loading"></loader>
        <div v-else class="page-container">
            <div class="form-container cl-Mako">
                <div class="disclaimer-container">
                    <div class="warning-icon">
                        <inline-svg src="warning"></inline-svg>
                    </div>
                    <div class="text">
                        <div class="title">Disclaimer of Liability</div>
                        {{ disclaimerText }}
                    </div>
                </div>
                <nitrozen-input
                    class="input md mt-md"
                    label="HSN Code"
                    type="text"
                    placeholder="For eg. 61152010"
                    :disabled="editMode"
                    v-model="hsn.hsn_code"
                    @input="validateHSNCode"
                ></nitrozen-input>
                <nitrozen-error v-if="errors.hsn_code">
                    {{ errors.hsn_code }}
                </nitrozen-error>
                <nitrozen-input
                    class="input mh mt-md"
                    label="Description"
                    type="text"
                    placeholder="For eg.description about products"
                    :disabled="false"
                    v-model="hsn.description"
                ></nitrozen-input>
                <div class="mt-md">
                    <div class="darker-md">Slab #1</div>
                    <div class="inline align-bottom mt-sm">
                        <nitrozen-input
                            class="input md mr-sm"
                            label="Threshold *"
                            :disabled="!showSlab2"
                            :showTooltip="!showSlab2"
                            tooltipText="Threshold of Slab #1 is ₹9,99,999 and has a flat tax rate which you can choose from the drop-down"
                            type="number"
                            placeholder="For eg. 1000"
                            v-model="hsn.threshold1"
                            :custom="true"
                            :showPrefix="true"
                            @input="validateThreshold1"
                        >
                            <div class="custom-label">INR</div>
                        </nitrozen-input>
                        <nitrozen-dropdown
                            class="input sm mr-sm"
                            label="GST Rate"
                            placeholder="None"
                            :items="gstRatesListSlab1"
                            v-model="hsn.tax1"
                        ></nitrozen-dropdown>
                        <div class="header mt-sm" >
                            <div class="title bold">Effective Date</div>
                            <div class="btn-container">
                                <div class="date">
                                    <adm-form-input
                                        :custom="true"
                                    >
                                        <adm-date-picker
                                            class="st-date"
                                            :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                            :picker_type="'datetime'"
                                            v-model="hsn.effective_date1"
                                            :not_before="
                                                new Date().toISOString()
                                            "
                                        />
                                    </adm-form-input>
                                </div>
                            </div>
                            <nitrozen-error >
                                {{  }}
                            </nitrozen-error>
                        </div>
                        <!-- Add Button -->
                        <ukt-inline-svg
                            v-if="!showSlab2"
                            title="add another slab"
                            src="plus-black"
                            class="add-icon"
                            :class="{ disabled: hsn.tax1 == 28 }"
                            @click.stop.native="enableSlab2"
                        ></ukt-inline-svg>
                    </div>
                    <nitrozen-error v-if="errors.threshold1">
                        {{ errors.threshold1 }}
                    </nitrozen-error>
                </div>
                <div class="mt-md" v-if="showSlab2">
                    <div class="darker-md">Slab #2</div>
                    <div class="inline align-bottom mt-sm">
                        <nitrozen-input
                            class="input md mr-sm"
                            label="Threshold *"
                            type="number"
                            :showTooltip="true"
                            tooltipText="Threshold of Slab #2 is ₹9,99,999 for accommodating any amount above the Slab #1 threshold, and it incurs a tax rate selected from the drop-down"
                            :disabled="true"
                            placeholder="For eg. 10000"
                            v-model="hsn.threshold2"
                            :custom="true"
                            :showPrefix="true"
                        >
                            <div class="custom-label">INR</div>
                        </nitrozen-input>
                        <nitrozen-dropdown
                            class="input sm mr-sm"
                            label="GST Rate"
                            placeholder="None"
                            :items="gstRatesListSlab2"
                            v-model="hsn.tax2"
                        ></nitrozen-dropdown>
                        <div class="header mt-sm" >
                            <div class="title bold">Effective Date</div>
                            <div class="btn-container">
                                <div class="date">
                                    <adm-form-input
                                        :custom="true"
                                    >
                                        <adm-date-picker
                                            class="st-date"
                                            :date_format="'YYYY-MM-DD hh:mm:ss a'"
                                            :picker_type="'datetime'"
                                            v-model="hsn.effective_date2"
                                            :not_before="
                                                new Date().toISOString()
                                            "
                                        />
                                    </adm-form-input>
                                </div>
                            </div>
                            <nitrozen-error >
                                {{  }}
                            </nitrozen-error>
                        </div>
                        <!-- Delete Button -->
                        <ukt-inline-svg
                            src="delete"
                            title="remove slab"
                            class="remove-icon"
                            @click.stop.native="removeSlab2"
                        ></ukt-inline-svg>
                    </div>
                </div>
            </div>
        </div>
        <loader v-if="inProgress" class="loading"></loader>
    </div>
</template>

<script>
import path from 'path';
import pageerror from '@/components/common/adm-page-error';
import loader from '@/components/common/adm-loader';
import admpageheader from '@/components/common/layout/adm-page-header';
import admNoContent from '@/components/common/adm-no-content.vue';
import AdminService from '@/services/company-admin.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/adm-inline-svg';
import datePicker from '@/components/common/date-picker.vue';
import admforminput from '@/components/common/form-input.vue';
// import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import {
    NitrozenToggleBtn,
    NitrozenButton,
    NitrozenCheckBox,
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenError,
    NitrozenDialog,
    NitrozenTooltip,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

const GST_RATES = [0, 3, 5, 10, 12, 18, 28];

const EMPTY_HSN = {
    description: '',
    hsn_code: '',
    effective_date1:'',
    effective_date2:'',
    hs2_code: '',
    tax1: 0,
    threshold1: 0,
    tax2: 0,
    threshold2: 0,
    is_active: true,
    tax_on_mrp: false,
};

export default {
    name: 'ProductTaxationEdit',
    components: {
        'page-error': pageerror,
        'adm-page-header': admpageheader,
        'adm-no-content': admNoContent,
        'ukt-inline-svg': UktInlineSvg,
        'inline-svg': InlineSvg,
        'adm-date-picker': datePicker,
        'adm-form-input':admforminput,
        NitrozenInput,
        NitrozenCheckBox,
        NitrozenButton,
        NitrozenToggleBtn,
        NitrozenDropdown,
        NitrozenError,
        NitrozenTooltip,
        loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            pageLoading: false,
            inProgress: false,
            pageError: false,
            editMode: !!this.$route.params.uid,
            uid: this.$route.params.uid,
            formSaved: false,
            showSlab2: false,
            hsn: { threshold1: 999999, tax1: 0, tax2: 0 },
            errors: {},
        };
    },
    computed: {
        disclaimerText() {
            return `You are hereby requested to ensure the correctness of the HSN code and corresponding tax percentage for your products. This data will be utilized while generating the tax invoice for your customers. Fynd will not be held liable for any discrepancy in the HSN code and the tax rate applicable for the slab defined by you. You realize that is fully responsible for paying the GST and settling any dues incurred in the form of interest or penalty.`;
        },
        gstRatesListSlab1() {
            return GST_RATES.map((rate) => {
                if (rate === 0) {
                    return {
                        text: 'None',
                        value: 0,
                    };
                }
                return {
                    text: rate + '%',
                    value: rate,
                };
            });
        },
        gstRatesListSlab2() {
            const rates = [];
            GST_RATES.forEach((rate) => {
                if (rate <= this.hsn.tax1) {
                    return;
                }
                rates.push({
                    text: rate + '%',
                    value: rate,
                });
            });
            return rates;
        },
    },
    mounted() {
        // console.log("I am inedit page")
        this.init();
    },
    methods: {
        pageTitle() {
            console.log(this.editMode);
            if (!this.editMode) {
                return 'Add HSN Code';
            } else if (!this.hsn.hsn_code) {
                return `Edit HSN Code`;
            } else {
                return `Edit HSN Code ${this.hsn.hsn_code}`;
            }
        },
        isEmpty: isEmpty,
        init() {
            console.log('Checking edit mode', this.editMode, this.hsn);
            if (!this.editMode) {
                return;
            }
            this.pageLoading = true;
            console.log('I am here');
            this.getHSN()
                // Promise.all([this.getHSN()])
                .then(() => {
                    this.pageLoading = false;
                    if (this.hsn.slabs.length > 1) {
                        this.showSlab2 = true;
                    }
                })
                .catch((err) => {
                    console.log('I am in error page', this.hsn);
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        getHSN() {
            const params = {
                uid: this.uid,
            };
            // console.log("Params",params)
            // BY passing uid we will get only one hsn code related data
            return new Promise((resolve, reject) => {
                AdminService.getAllHsnCodes(params)
                    .then(({ data }) => {
                        console.log('Finally reached here', data);
                        this.hsn = data.items[0];
                        console.log('HSN', this.hsn.slabs.length);
                        this.hsn.threshold1 = this.hsn.slabs[0].threshold;
                        if (this.hsn.slabs.length > 1) {
                            this.showSlab2 = true;
                            this.hsn.threshold2 = this.hsn.slabs[1].threshold;
                        }
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        getFormData() {
            const hsn_code = this.hsn.hsn_code.toString();
            const description = this.hsn.description;
            const slabs = [
                {
                    tax: this.hsn.tax1,
                    threshold: this.hsn.threshold1,
                    effective_date: this.hsn.effective_date1,
                },
            ];
            console.log('Slabs', this.hsn.slabs);
            if (this.hsn.threshold2) {
                slabs.push({
                    tax: this.hsn.tax2,
                    threshold: this.hsn.threshold2,
                    effective_date: this.hsn.effective_date2,
                });
            }
            const hsn = {
                ...EMPTY_HSN,
                ...this.hsn,
                ...{
                    slabs,
                    hsn_code,
                    description,
                    hs2_code: hsn_code.substring(0, 2),
                },
            };
            return hsn;
        },
        saveForm() {
            if (!this.validateForm()) {
                this.$snackbar.global.showError(
                    'Form validation failed. Please correct the form according to the error messages displayed in red'
                );
                return;
            }
            this.inProgress = true;

            let call;
            const uid = this.$route.params.uid;
            let payload = { ...this.getFormData(), uid };
            console.log('Form Data', payload);
            if (this.editMode) {
                call = AdminService.updateHsnCode(payload);
            } else {
                call = AdminService.createHsnCode(payload);
            }

            return call
                .then(() => {
                    this.inProgress = false;
                    this.formSaved = true;
                    this.$snackbar.global.showSuccess('Saved successfully');
                    this.redirectBack();
                })
                .catch((err) => {
                    this.inProgress = false;
                    this.$snackbar.global.showError('Failed to save');
                });
        },
        validateRequired(prop) {
            let isValid = true;

            if (!this.hsn[prop]) {
                isValid = false;
                this.errors[prop] = 'field is required';
            }
            return isValid;
        },
        validateHSNCode() {
            let isValid = true;
            this.$set(this.errors, 'hsn_code', '');

            isValid = this.validateRequired('hsn_code');
            if (!isValid) {
                return isValid;
            }
            
            if (this.hsn.hsn_code.toString().length !== 8) {
                isValid = false;
                this.errors.hsn_code = 'must be of 8 digits';
            }
            return isValid;
        },
        validateThreshold1() {
            let isValid = true;
            this.$set(this.errors, 'threshold1', '');

            isValid = this.validateRequired('threshold1');
            if (!isValid) {
                return isValid;
            }

            if (this.showSlab2) {
                if (this.hsn.threshold1 >= 999999) {
                    isValid = false;
                    this.errors.threshold1 = 'must be less than ₹9,99,999';
                }
            }

            return isValid;
        },
        validateForm() {
            let isValid = true;
            isValid = this.validateHSNCode() && isValid;
            isValid = this.validateThreshold1() && isValid;
            return isValid;
        },
        redirectBack() {
            this.$goBack(path.join(this.$route.path, '/list'));
        },
        enableSlab2() {
            this.showSlab2 = true;
            this.hsn.threshold1 = undefined;
            this.hsn.threshold2 = 999999;
            // asign tax2 with a value greater than tax1 by default
            this.hsn.tax2 = GST_RATES[GST_RATES.indexOf(this.hsn.tax1) + 1];
        },
        removeSlab2() {
            this.showSlab2 = false;
            this.hsn.threshold1 = 999999;
            this.hsn.threshold2 = 0;
            this.hsn.tax2 = 0;
        },
        isFormDirty() {
            if (this.formSaved) {
                return false;
            }

            let isClean = true;

            return !isClean;
        },
    },
};
</script>


<style lang="less" scoped>
// @import '../less/page-header.less';
// @import '../less/page-ui.less';

.header-position {
    height: 58.5px;
    .button-box {
        display: flex;
        align-items: center;
        .pad-left {
            margin-left: 12px;
        }
    }
}

.page-container {
    flex-direction: row-reverse;
    width: auto;
    background-color: @Alabaster2;
    @media @mobile {
        width: 100%;
        padding: 0;
    }
}
.form-container {
    width: 840px;
    margin: 0 auto 24px;
    padding: 24px;
    border: 1px solid @WhiteSmoke;
    border-radius: 8px;
    background-color: @White;
    .disclaimer-container {
        display: flex;
        height: fit-content;
        background-color: #fffaf0;
        // border: 1px solid @Supernova;
        color: #f5a300;
        opacity: 0.9;
        border-radius: 4px;
        padding: 16px;
        .warning-icon {
            margin-right: 16px;
        }
        .title {
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
        }
        .text {
            font-size: 13px;
            line-height: 18px;
            text-align: justify;
        }
    }
}
.input-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    color: @DustyGray2;
    padding-right: 4px;
}
.input-value {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: @Mako;
}
.input {
    &.md {
        width: 200px;
    }
    &.mh {
        width: 800px;
    }
    &.sm {
        width: 100px;
    }
    &.mr-sm {
        margin-right: 12px;
    }
    .custom-label {
        padding: 12px;
    }
}
.left-margin {
    margin-left: 24px;
}
.line-height-sm {
    line-height: 28px;
}
.inline {
    display: flex;
    &.align-bottom {
        align-items: flex-end;
    }
}
.mt-sm {
    margin-top: 12px;
}
.mt-md {
    margin-top: 24px;
}
.add-icon {
    cursor: pointer;
    &.disabled {
        opacity: 0.3;
        pointer-events: none;
    }
    ::v-deep {
        svg {
            width: 38px;
            height: 38px;
            border: 1px solid @Iron;
            border-radius: 3px;
            #prefix__Group {
                stroke: @RoyalBlue;
            }
        }
    }
}
::v-deep.remove-icon svg {
    width: 32px;
    height: 32px;
    cursor: pointer;
    padding: 3px;
    border: 1px solid @Iron;
    border-radius: 3px;
}
</style>