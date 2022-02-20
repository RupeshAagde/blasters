<template>
    <div class="panel">
        <div class="header-position">
            <adm-page-header :title="pageTitle" @backClick="redirectBack">
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
            <div class="cl-Mako bold-md form-head">Basic Details</div>
            <div class="row">
                <div class="input-box">
                    <nitrozen-input
                        label="HSN Code"
                        required
                        type="text"
                        placeholder="For eg. 61152010"
                        v-model="hsn_code.value"
                        @input="validateHSNCode"
                    ></nitrozen-input>
                    <nitrozen-error v-if="hsn_code.showerror">
                        {{ hsn_code.errortext }}
                    </nitrozen-error>
                    <nitrozen-error v-else-if="errors.hsn_code">
                        {{ errors.hsn_code }}
                    </nitrozen-error>
                </div>
                <div class="input-box left-space-txb" v-if="editMode">
                    <nitrozen-input
                        label="Reporting HSN Code"
                        type="text"
                        placeholder="For eg. 61152010"
                        v-model="reporting_hsn"
                        :disabled="true"
                        @input="validateReportingHSNCode"
                    ></nitrozen-input>
                    <nitrozen-error v-if="errors.reporting_hsn_code">
                        {{ errors.reporting_hsn_code }}
                    </nitrozen-error>
                </div>
            </div>

            <div class="row">
                <div class="input-box">
                    <nitrozen-dropdown
                        label="Type"
                        required
                        placeholder="Choose Type"
                        :items="getHSNType"
                        v-model="type.value"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="type.showerror">
                        {{ type.errortext }}
                    </nitrozen-error>
                </div>
                <div class="input-box left-space-txb">
                    <nitrozen-dropdown
                        label="Country"
                        required
                        placeholder="Choose Country"
                        :items="countryCodeList"
                        v-model="country_code.value"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="country_code.showerror">
                        {{ country_code.errortext }}
                    </nitrozen-error>
                </div>
            </div>
            <div class="row">
                <div class="input-area">
                    <nitrozen-input
                        label="Description"
                        type="textarea"
                        required
                        placeholder="some description"
                        v-model="description.value"
                        @input="validateDescription"
                    ></nitrozen-input>
                    <nitrozen-error v-if="description.showerror">
                        {{ description.errortext }}
                    </nitrozen-error>
                    <nitrozen-error v-else-if="errors.description">
                        {{ errors.description }}
                    </nitrozen-error>
                </div>
            </div>
        </div>

        <div class="rate-container">
            <div class="row">
                <div class="cl-Mako bold-md form-head">
                    Tax/GST Rate Configuration
                </div>
                <nitrozen-button
                    v-strokeBtn
                    theme="secondary"
                    class="ml-sm"
                    @click="$openAddTaxrateDialog"
                    >Add Rate/GST
                </nitrozen-button>
            </div>
            <div v-if="!!taxes.value.length">
                <div
                    class="tax-list-body"
                    v-for="(tax, index) in taxes.value"
                    :key="'tax-' + index"
                >
                    <div class="tax-list-div" :key="index">
                        <div class="tax-list-item">
                            <div class="tax-list-name">
                                <label class="n-input-label">Threshold</label>
                                {{ tax.threshold }}
                            </div>
                            <div class="tax-list-name">
                                <label class="n-input-label">Rate</label>
                                {{ tax.rate }}%
                            </div>

                            <div class="tax-list-name">
                                <label class="n-input-label"
                                    >Effective Date</label
                                >
                                {{ format_date(tax.effective_date) }}
                            </div>
                            <nitrozen-badge
                                :state="
                                    isRateActive(tax.effective_date)
                                        ? 'success'
                                        : 'warn'
                                "
                                >{{
                                    isRateActive(tax.effective_date)
                                        ? 'Active'
                                        : 'incoming'
                                }}</nitrozen-badge
                            >
                        </div>
                        <div class="tax-list-item">
                            <div class="tax-list-name"></div>
                            <div>
                                <!--<button
                                    class="editButton"
                                    @click="$openEditTaxrateDialog(tax)"
                                >
                                    <inline-svg
                                        class="nitrozen-icon"
                                        src="edit"
                                        title="edit rate"
                                    ></inline-svg>
                                </button> -->
                                <ukt-inline-svg
                                    class="edit-btn"
                                    title="edit rate"
                                    src="image-edit"
                                    @click.stop.native="
                                        $openEditTaxrateDialog(tax)
                                    "
                                ></ukt-inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!taxes.value.length">
            <adm-no-content :helperText="'no rate available'"></adm-no-content>
        </div>
        <add-taxrate-dailog
            ref="addTaxrateDialog"
            :taxes="taxes.value"
            @close="$closeAddTaxRateDialog"
        >
        </add-taxrate-dailog>
        <edit-taxrate-dailog
            ref="editTaxrateDialog"
            :taxes="taxes.value"
            :selectedRate="selectedRate"
            @close="$closeEditTaxrateDialog"
        >
        </edit-taxrate-dailog>

        <loader v-if="inProgress" class="loading"></loader>
    </div>
</template>

<script>
import path from 'path';
import moment from 'moment';
import pageerror from '@/components/common/page-error';
import loader from '@/components/common/loader';
import admpageheader from '@/components/common/layout/page-header';
import admnocontent from '@/components/common/adm-no-content.vue';
import AdminService from '@/services/company-admin.service';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/adm-inline-svg';
import datePicker from '@/components/common/date-picker.vue';
import LocationService from '@/services/location.service';
import admforminput from '@/components/common/form-input.vue';
import AddTaxrateDailog from './add-taxrate-dialog';
import EditTaxrateDailog from './edit-taxrate-dialog';
// import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import {
    NitrozenToggleBtn,
    NitrozenButton,
    NitrozenBadge,
    NitrozenCheckBox,
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenError,
    NitrozenDialog,
    NitrozenTooltip,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

const GST_RATES = [0, 3, 5, 10, 12, 18, 28];
const HSN_TYPE = ['Goods', 'Services'];

export default {
    name: 'ProductTaxationEdit',
    components: {
        'page-error': pageerror,
        'adm-page-header': admpageheader,
        'adm-no-content': admnocontent,
        'ukt-inline-svg': UktInlineSvg,
        'inline-svg': InlineSvg,
        'adm-date-picker': datePicker,
        'adm-form-input': admforminput,
        NitrozenInput,
        NitrozenCheckBox,
        NitrozenButton,
        NitrozenBadge,
        NitrozenToggleBtn,
        NitrozenDropdown,
        NitrozenError,
        NitrozenTooltip,
        loader,
        AddTaxrateDailog,
        EditTaxrateDailog
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            countryCodeList: [],
            pageLoading: false,
            inProgress: false,
            pageError: false,
            editMode: false,
            reporting_hsn: '',
            pageTitle: '',
            saveText: '',
            formSaved: false,
            hsn_code: {
                value: '',
                showerror: false,
                errortext: 'HSN code is required'
            },
            type: {
                value: '',
                showerror: false,
                errortext: 'Type is required'
            },
            country_code: {
                value: '',
                showerror: false,
                errortext: 'Country is required'
            },
            description: {
                value: '',
                showerror: false,
                errortext: 'Description is required'
            },
            taxes: {
                value: [],
                showerror: false,
                errortext: 'Tax rate is required'
            },
            selectedRate: {
                cess: 0,
                effective_date: '',
                rate: 0,
                threshold: 0
            },
            newRate: {
                cess: 0,
                effective_date: '',
                rate: 0,
                threshold: 0
            },
            newRates: [
                {
                    cess: 0,
                    effective_date: '',
                    rate: 0,
                    threshold: 0
                }
            ],
            errors: {}
        };
    },
    mounted() {
        if (this.$route.params.reporting_hsn) {
            this.pageLoading = true;
            this.reporting_hsn = this.$route.params.reporting_hsn;
            this.pageTitle = 'Edit HSN Code';
            this.saveText = 'HSN updated successfully';
            this.editMode = this.$route.params.reporting_hsn ? true : false;
        } else {
            this.pageTitle = 'Add HSN Code';
        }
        // console.log(this.$route.params)
        this.getCountryList();
        this.init();
    },
    computed: {
        getHSNType() {
            return HSN_TYPE.map((type) => {
                return {
                    text: type,
                    value: type.toLowerCase()
                };
            });
        }
    },
    methods: {
        isEmpty: isEmpty,
        init() {
            if (!this.editMode) {
                return;
            }
            this.pageLoading = true;
            this.getHSN()
                .then(() => {
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        getCountryList() {
            LocationService.getCountries()
                .then(({ data }) => {
                    this.countryCodeList = data.items.map((country) => {
                        return {
                            text: country.name,
                            value: country.iso2
                        };
                    });
                    this.countryCodeList.sort((a, b) =>
                        a.text.localeCompare(b.text)
                    );
                })
                .catch((err) => {});
        },
        getHSN() {
            const params = {
                reporting_hsn: this.reporting_hsn
            };
            // BY passing uid we will get only one hsn code related data
            return new Promise((resolve, reject) => {
                AdminService.getAllHsnCodes(params)
                    .then(({ data }) => {
                        let hsn = data.items[0];
                        this.hsn_code.value = hsn.hsn_code;
                        this.type.value = hsn.type;
                        this.country_code.value = hsn.country_code;
                        this.description.value = hsn.description;
                        hsn.taxes.forEach((tax) => {
                            this.taxes.value.push(tax);
                        });
                        this.taxes.value.sort(
                            (current, next) => current.rate - next.rate
                        );
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        saveForm() {
            let postData = {};
            if (this.hsn_code.value !== '') {
                this.hsn_code.showerror = false;
                postData.hsn_code = this.hsn_code.value;
            } else {
                this.hsn_code.showerror = true;
            }
            if (this.type.value !== '') {
                this.type.showerror = false;
                postData.type = this.type.value;
            } else {
                this.type.showerror = true;
            }
            if (this.country_code.value !== '') {
                this.country_code.showerror = false;
                postData.country_code = this.country_code.value;
            } else {
                this.country_code.showerror = true;
            }
            if (this.description.value !== '') {
                this.description.showerror = false;
                postData.description = this.description.value;
            } else {
                this.description.showerror = true;
            }
            if (this.taxes.value.length > 0) {
                postData.taxes = this.taxes.value;
            } else {
                this.taxes.showerror = true;
            }
            if (
                !this.hsn_code.showerror &&
                !this.type.showerror &&
                !this.country_code.showerror &&
                !this.description.showerror &&
                !this.taxes.showerror
            ) {
                let call;
                if (this.editMode) {
                    call = AdminService.updateHsnCode(
                        this.reporting_hsn,
                        postData
                    );
                } else {
                    call = call = AdminService.createHsnCode(postData);
                }
                return call
                    .then(() => {
                        this.inProgress = false;
                        this.$snackbar.global.showSuccess('Saved successfully');
                        this.clearSelectedRate();
                        this.redirectBack();
                    })
                    .catch((err) => {
                        this.inProgress = false;
                        this.$snackbar.global.showError('Failed to save');
                        this.clearUnsavedRates();
                        this.clearSelectedRate();
                    });
            } else if (this.taxes.showerror) {
                this.$snackbar.global.showError(this.taxes.errortext);
            } else {
                this.$snackbar.global.showError(`Fill in the required fields`);
            }
        },
        validateHSNCode() {
            let isValid = true;
            this.hsn_code.showerror = false;
            this.$set(this.errors, 'hsn_code', '');

            if (this.hsn_code.value.toString().length !== 8) {
                isValid = false;
                this.errors.hsn_code = 'must be of 8 digits';
            }
            return isValid;
        },
        validateReportingHSNCode() {
            let isValid = true;
            this.$set(this.errors, 'reporting_hsn_code', '');
            if (this.reporting_hsn_code.value.toString().length !== 8) {
                isValid = false;
                this.errors.reporting_hsn_code = 'must be of 8 digits';
            }
            return isValid;
        },
        validateDescription() {
            let isValid = true;
            this.description.showerror = false;
            this.$set(this.errors, 'description', '');
            if (
                this.description.value.toString().length >= 101 ||
                this.description.value.toString().length < 10
            ) {
                isValid = false;
                this.errors.description =
                    'Description length must be between 10 to 100 chars ';
            }
            return isValid;
        },
        redirectBack() {
            this.$goBack('/administrator/product/taxation');
            //console.log("Path",path.join(this.$route.path, '/list'),this.$route.path)
        },
        isRateActive(effectivedate) {
            effectivedate = moment(String(effectivedate));
            return effectivedate <= moment() ? true : false;
        },
        isFormDirty() {
            if (this.formSaved) {
                return false;
            }

            let isClean = true;

            return !isClean;
        },
        format_date(value) {
            if (value) {
                return moment(value).format('ll');
            }
        },
        clearUnsavedRates() {
            for (let rate of this.newRates) {
                if (rate.effective_date != '') {
                    const index = this.taxes.value.indexOf(rate);
                    if (index > -1) {
                        this.taxes.value.splice(index, 1);
                    }
                }
            }
            this.newRates = [
                {
                    cess: 0,
                    effective_date: '',
                    rate: 0,
                    threshold: 0
                }
            ];
        },
        clearSelectedRate() {
            this.selectedRate = {
                cess: 0,
                effective_date: '',
                rate: 0,
                threshold: 0
            };
        },
        $openAddTaxrateDialog() {
            this.clearUnsavedRates();
            this.$refs.addTaxrateDialog.open();
        },
        $closeAddTaxRateDialog(action, object) {
            if (action === 'Saved') {
                this.newRates = [...object];
                this.taxes.value = [...this.newRates, ...this.taxes.value];
            } else if (action === 'Cancelled') {
            }
        },

        $openEditTaxrateDialog(code) {
            const index = this.taxes.value.indexOf(code);
            if (index > -1) {
                this.selectedRate = code;
                this.taxes.value.splice(index, 1);
            this.clearUnsavedRates();
            }
            this.$refs.editTaxrateDialog.open();
        },
        $closeEditTaxrateDialog(action, object) {
            if (!!object) {
                this.taxes.value = [object, ...this.taxes.value];
            } else {
                this.taxes.value.push(this.selectedRate);
                this.clearSelectedRate();
            }
        }
    }
};
</script>

<style lang="less" scoped>
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
    background-color: #fff;
    border-radius: 4px;
    margin: 30px 24px 24px 24px !important;
    padding: 24px 24px 0px 24px;
    font-family: Inter;
}
.form-head {
    margin-bottom: 15px;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 19px;
}
.row {
    width: 100%;
    margin: 0 0 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    .input-box {
        width: 48%;
    }
    .input-area {
        width: 100%;
    }
}
.rate-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 24px 24px 24px 24px !important;
    padding: 24px 24px 4px 24px;
    font-family: Inter;
    .tax-list-body {
        .tax-list-div {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid @Iron;
            border-radius: 4px;
            background-color: @White;
            padding: 12px 12px 12px 12px;
            margin-bottom: 10px;
            .tax-list-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                // .editButton {
                //     border: 1px solid #2e31be;
                //     border-radius: 4px;
                //     background-color: white;
                // }
                .edit-btn {
                    margin-top: 4px;
                    color: @RoyalBlue;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                }
            }
            .tax-list-name {
                color: @Mako;
                font-size: 14px;
                margin-bottom: 12px;
            }
        }
    }
}

.left-space-txb {
    margin-left: 12px;
}
</style>
