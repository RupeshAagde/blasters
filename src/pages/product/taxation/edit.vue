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
            <div class="cl-Mako bold-md form-head">Basic Details</div>
            <div class="row">
                <div class="input-box">
                    <nitrozen-input
                        label="HSN Code"
                        :disabled="editMode"
                        required
                        :type="'text'"
                        :maxlength="8"
                        placeholder="For eg. 61152010"
                        :value="hsn_code.value"
                        v-model="hsn_code.value"
                        @keyup="validateNumber(hsn_code.value)"
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
                    ></nitrozen-input>
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
                <div class="input-box left-space-txb" @click="setSearchable">
                    <nitrozen-dropdown
                        label="Country"
                        required
                        placeholder="Choose Country"
                        :items="filteredCountries"
                        v-model="country_code.value"
                        :searchable="isSearchable"
                        @searchInputChange="$countrySearchInputChange"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="country_code.showerror">
                        {{ country_code.errortext }}
                    </nitrozen-error>
                </div>
            </div>
            <div class="row">
                <div class="input-area">
                    <span class="char-count">{{
                        `${description.value.length} / 500 Characters`
                    }}</span>
                    <nitrozen-input
                        label="Description"
                        type="textarea"
                        required
                        placeholder="Description of product"
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
                    GST Rate Configuration
                </div>
                <nitrozen-button
                    v-strokeBtn
                    theme="secondary"
                    class="ml-sm"
                    @click="$openAddTaxrateDialog"
                    >Add GST
                </nitrozen-button>
            </div>
            <div v-if="!!Object.keys(datedTax).length">
                <div
                    class="datedtax-body"
                    v-for="(tax, index) in datedTax"
                    :key="index"
                >
                    <div class="datedtax-div" :key="index">
                        <div class="datedtax-row">
                            <div class="datedtax-row-item">
                                <label class="label-msg n-input-label"
                                    >Effective Date:
                                </label>
                                <span>{{
                                    format_date(tax[0].effective_date)
                                }}</span>
                            </div>
                            <div class="datedtax-row-item">
                                <nitrozen-badge
                                    :state="isRateActive(tax[0].state)"
                                    >{{ tax[0].state }}</nitrozen-badge
                                >
                            </div>
                        </div>
                        <div class="datedtax-row">
                            <div class="sub-row">
                                <div class="slab-1">
                                    <label class="n-input-label"
                                        >Slab #1
                                    </label>
                                    <div>
                                        <label
                                            class="label-msg n-input-label"
                                            >{{ `Threshold>` }}</label
                                        >
                                        {{ tax[0].threshold }}
                                    </div>
                                    <div>
                                        <label class="label-msg n-input-label"
                                            >GST</label
                                        >
                                        {{ `: ${tax[0].rate}%` }}
                                    </div>
                                </div>
                                <div class="slab-2" v-if="!!tax[1]">
                                    <label class="n-input-label"
                                        >Slab #2
                                    </label>
                                    <div>
                                        <label
                                            class="label-msg n-input-label"
                                            >{{ `Threshold>` }}</label
                                        >
                                        {{ tax[1].threshold }}
                                    </div>
                                    <div>
                                        <label class="label-msg n-input-label"
                                            >GST</label
                                        >
                                        {{ `: ${tax[1].rate}%` }}
                                    </div>
                                </div>
                            </div>
                            <div class="sub-row">
                                <ukt-inline-svg
                                    class="edit-btn"
                                    title="edit rate"
                                    src="edit-blue"
                                    @click.stop.native="
                                        $openEditTaxrateDialog(tax)
                                    "
                                ></ukt-inline-svg>
                                <ukt-inline-svg
                                    v-if="tax[0].state != 'Active'"
                                    class="dlt-btn"
                                    title="delete rate"
                                    src="delete-red"
                                    @click.stop.native="
                                        openConfirmationDialog(tax)
                                    "
                                ></ukt-inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!editMode && !taxes.value.length">
                <adm-no-content :helperText="''"></adm-no-content>
            </div>
        </div>

        <add-taxrate-dailog
            ref="addTaxrateDialog"
            :taxes="datedTax"
            :selectedDates="selectedDates"
            @close="$closeAddTaxRateDialog"
        >
        </add-taxrate-dailog>
        <edit-taxrate-dailog
            ref="editTaxrateDialog"
            :taxes="datedTax"
            :selectedRate="selectedRate"
            :selectedDates="selectedDates"
            @close="$closeEditTaxrateDialog"
        >
        </edit-taxrate-dailog>
        <!--Confirmation dailog -->
        <nitrozen-dialog ref="confirm-dialog" title="Confirmation">
            <template slot="body">
                <p>Are you sure you want to delete rate?</p>
            </template>
            <template slot="footer">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        theme="secondary"
                        @click="closeConfirmationDialog"
                        v-strokeBtn
                        >Cancel
                    </nitrozen-button>
                    <nitrozen-button
                        theme="secondary"
                        class="mr-24"
                        @click="removeGst()"
                        v-flatBtn
                        ref="delete-btn"
                        >Delete
                    </nitrozen-button>
                </div>
            </template>
        </nitrozen-dialog>

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
import cloneDeep from 'lodash/cloneDeep';
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
    strokeBtn,
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
        EditTaxrateDailog,
        NitrozenDialog,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            countryCodeList: [],
            filteredCountries: [],
            countrySearchInputText: '',
            isSearchable: false,
            pageLoading: true,
            inProgress: false,
            pageError: false,
            editMode: false,
            soloHsn: {},
            reporting_hsn: '',
            saveText: '',
            formSaved: false,
            hsn_code: {
                value: '',
                showerror: false,
                errortext: 'HSN code is required',
            },
            type: {
                value: '',
                showerror: false,
                errortext: 'Type is required',
            },
            country_code: {
                value: '',
                showerror: false,
                errortext: 'Country is required',
            },
            description: {
                value: '',
                showerror: false,
                errortext:
                    "Description is required and it's length should be between 4 to 500 chars",
            },
            taxes: {
                value: [],
                showerror: false,
                errortext: 'Tax rate is required',
            },
            datedTax: {},
            // selectedRate: {
            //     cess: 0,
            //     effective_date: '',
            //     rate: 0,
            //     threshold: 0
            // },
            selectedRate: [],
            newRate: {
                cess: 0,
                effective_date: '',
                rate: 0,
                threshold: 0,
            },
            newRates: [
                {
                    cess: 0,
                    effective_date: '',
                    rate: 0,
                    threshold: 0,
                },
            ],
            markedForDelete: [],
            errors: {},
            selectedDates:[],
        };
    },
    mounted() {
        if (this.$route.params.reporting_hsn) {
            this.pageLoading = true;
            this.reporting_hsn = this.$route.params.reporting_hsn;
            this.saveText = 'Tax Rate updated successfully';
            this.editMode = this.$route.params.reporting_hsn ? true : false;
        } else {
            this.pageLoading = false;
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
                    value: type.toLowerCase(),
                };
            });
        },
    },
    watch: {
        value() {
            if (this.value) {
                if (this.value.country) {
                    if (this.filteredCountries.length) {
                        let data = this.filteredCountries.filter((ele) => {
                            return this.value.country
                                .toLowerCase()
                                .includes(ele.name.toLowerCase());
                        })[0];
                        this.country.value = data.uid || '';
                        this.$countryChange(this.country.value);
                    }
                }
            }
        },
    },
    methods: {
        pageTitle() {
            // console.log(this.editMode);
            if (!this.editMode) {
                return 'Add Tax Rate';
            } else {
                return `Edit Tax Rate`;
            }
        },
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
                    this.countryCodeList = data.items;
                    this.filteredCountries = data.items.map((country) => {
                        return {
                            text: country.name,
                            value: country.iso2,
                        };
                    });
                    this.filteredCountries.sort((a, b) =>
                        a.text.localeCompare(b.text)
                    );
                })
                .catch((err) => {});
        },
        setSearchable() {
            this.isSearchable = true;
        },
        $countrySearchInputChange(e) {
            this.countrySearchInputText = e.text;
            this.filteredCountries = [];
            for (let i = 0; i < this.countryCodeList.length; i++) {
                if (
                    this.countryCodeList[i].name
                        .toLowerCase()
                        .includes(this.countrySearchInputText.toLowerCase())
                ) {
                    this.countryCodeList[i].text = this.countryCodeList[i].name;
                    this.countryCodeList[i].value =
                        this.countryCodeList[i].iso2;
                    this.filteredCountries.push(this.countryCodeList[i]);
                }
            }
        },
        getHSN() {
            const reporting_hsn = this.reporting_hsn;

            return new Promise((resolve, reject) => {
                AdminService.getSingleHsnCode(reporting_hsn)
                    .then(({ data }) => {
                        this.soloHsn = data;
                        this.hsn_code.value = this.soloHsn.hsn_code;
                        this.type.value = this.soloHsn.type;
                        this.country_code.value = this.soloHsn.country_code;
                        this.description.value = this.soloHsn.description;
                        this.soloHsn.taxes.forEach((tax) => {
                            this.taxes.value.push(tax);
                        });
                        this.taxes.value.sort(
                            (current, next) => current.rate - next.rate
                        );
                        this.getDatedTax();
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        getDatedTax() {
            //flatting array of taxes into object, where key will be dates and values will be array of object
            let datedTax = {};
            let activeDate = 0;
            this.datedTax = {};

            for (let item of this.taxes.value) {
                const a = item.effective_date;
                let date_key = item.effective_date;
                date_key = date_key.split('T')[0];
                if (date_key in datedTax) {
                    datedTax[date_key].push({ ...item });
                } else {
                    datedTax[date_key] = [{ ...item }];
                }
            }
            //to get latest active date
            let currentDate = new Date().setHours(1);
            currentDate = new Date(currentDate).toISOString().split('T')[0];
            currentDate = Number(currentDate.replaceAll('-', ''));
            let allDates = Object.keys(datedTax);

            allDates = allDates.map((item) => {
                item = new Date(item).toISOString().split('T')[0];
                item = Number(item.replaceAll('-', ''));
                return item;
            });
            allDates = allDates.filter((item) => item <= currentDate);
            activeDate = allDates.sort().reverse()[0];
            //Setting state for each tax rate
            for (let key in datedTax) {
                let tempDate = String(key).split('T')[0];
                tempDate = Number(tempDate.replaceAll('-', ''));
                if (tempDate == activeDate) {
                    for (let tax of datedTax[key]) {
                        tax['state'] = 'Active';
                    }
                } else if (tempDate > activeDate) {
                    for (let tax of datedTax[key]) {
                        tax['state'] = 'Upcoming';
                    }
                } else if (activeDate == undefined) {
                    for (let tax of datedTax[key]) {
                        tax['state'] = 'Upcoming';
                    }
                } else {
                    for (let tax of datedTax[key]) {
                        tax['state'] = 'Expired';
                    }
                }
            }
            //assigning the newUpdated object to global variable
            this.selectedDates = Object.keys(datedTax).map(date=> datedTax[date][0].effective_date);
            this.datedTax = datedTax;
        },
        isRateActive(state) {
            if (state == 'Active') {
                return 'success';
            } else {
                return 'warn';
            }
        },
        saveForm() {
            let postData = {};
            if (
                this.hsn_code.value.toString() !== '' &&
                this.hsn_code.value.toString().length == 8
            ) {
                this.hsn_code.showerror = false;
                postData.hsn_code = this.hsn_code.value.toString();
            } else if (
                this.hsn_code.value.toString() !== '' &&
                this.hsn_code.value.toString().length != 8
            ) {
                this.hsn_code.showerror = true;
                this.hsn_code.errortext = 'HSN code must be of 8 digits';
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
            if (
                this.description.value.trim() !== '' &&
                this.description.value.trim().length > 3 &&
                this.description.value.trim().length <= 500
            ) {
                this.description.showerror = false;
                postData.description = this.description.value.trim();
            } else {
                this.description.showerror = true;
            }
            if (this.taxes.value.length > 0) {
                postData.taxes = this.taxes.value;
                this.taxes.showerror = false;
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
                call.then((res) => {
                    this.inProgress = false;
                    if (this.editMode) {
                        this.$snackbar.global.showSuccess(
                            'Tax Rate Updated successfully'
                        );
                    } else {
                        this.$snackbar.global.showSuccess('Saved successfully');
                    }
                    this.clearSelectedRate();
                    if (this.markedForDelete.length <= 0) {
                        !this.editMode && this.redirectBack();
                        this.markedForDelete = [];
                    }
                }).catch((err) => {
                    this.inProgress = false;
                    if (
                        err &&
                        err.response &&
                        err.response.data &&
                        err.response.data.message.includes(
                            'duplicate key error'
                        )
                    ) {
                        this.$snackbar.global.showError(
                            `HSN code ${postData.hsn_code} with GST configuration already exist`
                        );
                    } else {
                        this.$snackbar.global.showError('Failed to save');
                    }
                    this.clearUnsavedRates();
                    this.clearSelectedRate();
                });
                return;
            } else if (
                this.hsn_code.showerror ||
                this.type.showerror ||
                this.country_code.showerror ||
                this.description.showerror
            ) {
                this.$snackbar.global.showError(
                    `Form validation failed. Please correct the form according to the error messages displayed in red`
                );
            } else if (
                !this.hsn_code.showerror &&
                !this.type.showerror &&
                !this.country_code.showerror &&
                !this.description.showerror &&
                this.taxes.showerror
            ) {
                this.$snackbar.global.showError(this.taxes.errortext);
            } else {
                this.$snackbar.global.showError(
                    `Form validation failed. Please correct the form according to the error messages displayed in red`
                );
            }
        },
        validateNumber(input) {
            if (!Number(parseInt(input)) && Number(parseInt(input)) !== 0) {
                this.hsn_code.value = '';
                this.hsn_code.showerror = true;
                this.hsn_code.errortext = 'HSN code must be of positive number';
                return;
            } else {
                this.hsn_code.showerror = false;
                this.hsn_code.errortext = '';
            }
        },
        // validateHSNCode() {
        //     let isValid = true;
        //     this.hsn_code.showerror = false;
        //     this.$set(this.errors, 'hsn_code', '');

        //     if (this.hsn_code.value.toString().length !== 8) {
        //         isValid = false;
        //         this.errors.hsn_code = 'HSN code must be of 8 digits';
        //     }
        //     return isValid;
        // },
        validateDescription() {
            let isValid = true;
            this.description.showerror = false;
            this.$set(this.errors, 'description', '');
            if (
                this.description.value.toString().length >= 501 ||
                this.description.value.toString().length < 4
            ) {
                isValid = false;
                this.errors.description =
                    "Description is required and it's length should be between 4 to 500 chars";
            }
            return isValid;
        },
        redirectBack() {
            this.$goBack('/administrator/product/taxation');
            //console.log("Path",path.join(this.$route.path, '/list'),this.$route.path)
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
                if (!value.includes('.000Z')) {
                    value = new Date(value + '.000Z')
                        .toLocaleString('sv')
                        .replace(' ', 'T');
                }
                return moment(value).format('D MMM, YYYY');
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
                    threshold: 0,
                },
            ];
        },
        clearSelectedRate() {
            // this.selectedRate = {
            //     cess: 0,
            //     effective_date: '',
            //     rate: 0,
            //     threshold: 0
            // };
            this.selectedRate = [];
        },
        $openAddTaxrateDialog() {
            this.$refs.addTaxrateDialog.open();
        },
        $closeAddTaxRateDialog(action, object) {
            if (action === 'Saved') {
                this.taxes.value = [...object, ...this.taxes.value];
            } else if (action === 'Cancelled') {
            }
            this.getDatedTax();
        },

        $openEditTaxrateDialog(code) {
            this.selectedRate = [];

            for (let c of code) {
                let item = { ...c };
                delete item.state;
                this.selectedRate.push({ ...item });
            }
            this.$refs.editTaxrateDialog.open();
        },
        $closeEditTaxrateDialog(action, object) {
            if (!!object) {
                for (let c = 0; c < this.selectedRate.length; c++) {
                    for (let i of this.taxes.value) {
                        let tempdate = this.selectedRate[0].effective_date;
                        if (
                            tempdate.split('T')[0] ==
                            i.effective_date.split('T')[0]
                        ) {
                            const index = this.taxes.value.indexOf(i);
                            this.taxes.value.splice(index, 1);
                        }
                    }
                }
                this.taxes.value = [...this.taxes.value];
                for (let i = object.length - 1; i >= 0; i--) {
                    this.taxes.value.unshift({ ...object[i] });
                }
            } else {
                this.clearSelectedRate();
            }
            this.getDatedTax();
        },
        //

        //Need to set marked for deletion and proceed further
        //
        removeGst() {
            let rateList = [];
            for (let temp of this.markedForDelete) {
                delete temp.state;
                rateList.push(temp);
            }
            if (this.taxes.value.length == 1) {
                this.$snackbar.global.showError(
                    'HSN has only one tax slab, it should not be deleted'
                );
            } else if (
                this.taxes.value.length == 2 &&
                this.taxes.value[0].effective_date ==
                    this.taxes.value[1].effective_date
            ) {
                this.$snackbar.global.showError(
                    'HSN has only one tax slab, it should not be deleted'
                );
            } else {
                let tempdate =
                    this.markedForDelete[0].effective_date.split('T')[0];
                this.taxes.value = this.taxes.value.filter((rate) => {
                    let efdate = rate.effective_date.split('T')[0];
                    if (efdate == tempdate) {
                        return false;
                    } else return true;
                });
                this.saveForm();
                this.getDatedTax();
            }

            this.$refs['confirm-dialog'].close();
        },
        //confirm dialog
        openConfirmationDialog(data) {
            this.markedForDelete = cloneDeep(data);
            this.$refs['confirm-dialog'].open({
                width: '400px',
                height: '215px',
                showCloseButton: true,
            });
        },
        closeConfirmationDialog() {
            this.markedForDelete = [];
            this.$refs['confirm-dialog'].close();
        },
    },
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
.char-count {
    float: right;
    color: #9b9b9b;
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.rate-container {
    background-color: #fff;
    border-radius: 4px;
    margin: 24px 24px 24px 24px !important;
    padding: 24px 24px 4px 24px;
    font-family: Inter;

    .datedtax-div {
        box-sizing: border-box;
        border: 1px solid @Iron;
        border-radius: 4px;
        background-color: @White;
        padding: 12px 12px 12px 12px;
        margin-bottom: 10px;
        .datedtax-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .datedtax-row-item {
                color: @Mako;
                font-size: 12px;
                margin-bottom: 12px;
            }
            .sub-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .slab-1 {
                    color: @Mako;
                    font-size: 12px;
                }
                .slab-2 {
                    color: @Mako;
                    font-size: 12px;
                    margin-left: 24px;
                }
            }
            .label-msg {
                display: inline !important;
            }
            .edit-btn {
                margin-right: 4px;
                cursor: pointer;
            }
            .dlt-btn {
                cursor: pointer;
            }
        }
    }
}

.left-space-txb {
    margin-left: 12px;
}
::v-deep .n-input-maxlength {
    display: none;
}
</style>
