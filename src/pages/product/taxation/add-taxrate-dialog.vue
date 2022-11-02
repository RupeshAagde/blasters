<template>
    <nitrozen-dialog ref="dialog" title="Add GST">
        <template slot="body">
            <div>
                <div class="dialog-container firstSlab">
                    <div class="row">
                        <div class="input-box">
                            <adm-date-picker
                                label="Effective date *"
                                required
                                date_format="YYYY-MM-DD"
                                :picker_type="'date'"
                                class="st-date"
                                v-model="slab1.effective_date.value"
                                :useNitrozenTheme="true"
                                @input="checkExistigDate($event)"
                            />
                            <nitrozen-error
                                v-if="slab1.effective_date.showerror"
                            >
                                {{ slab1.effective_date.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-input
                                label="Cess"
                                type="number"
                                placeholder="cess value (optional)"
                                v-model="slab1.cess.value"
                            ></nitrozen-input>
                            <nitrozen-error v-if="slab1.cess.showerror">
                                {{ slab1.cess.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-box">
                            <nitrozen-input
                                label="Threshold value"
                                :required="true"
                                disabled
                                type="number"
                                placeholder="eg. 99999"
                                v-model="slab1.threshold.value"
                                :custom="true"
                                :showPrefix="true"
                            >
                                <div class=". custom-label">&#62;</div>
                            </nitrozen-input>
                            <nitrozen-error v-if="slab1.threshold.showerror">
                                {{ slab1.threshold.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-dropdown
                                label="Tax Rate (In percentage)"
                                required
                                placeholder="Choose Rate"
                                :items="rateList1"
                                @change="getRateList2(slab1.rate.value)"
                                v-model="slab1.rate.value"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="slab1.rate.showerror">
                                {{ slab1.rate.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                </div>
                <div v-if="isSlab2" class="dialog-container secondSlab">
                    <hr />
                    <ukt-inline-svg
                        class="edit-btn"
                        title="delete gst"
                        src="delete-red"
                        @click.stop.native="removeRate()"
                    ></ukt-inline-svg>
                    <div class="row">
                        <div class="input-box2">
                            <nitrozen-input
                                label="Cess"
                                type="number"
                                placeholder="cess value (optional)"
                                v-model="slab2.cess.value"
                            ></nitrozen-input>
                            <nitrozen-error v-if="slab2.cess.showerror">
                                {{ slab2.cess.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-box">
                            <nitrozen-input
                                label="Threshold value"
                                required
                                type="number"
                                placeholder="eg. 99999rs"
                                v-model="slab2.threshold.value"
                                :custom="true"
                                :showPrefix="true"
                            >
                                <div class=". custom-label">&#62;</div>
                            </nitrozen-input>
                            <nitrozen-error v-if="slab2.threshold.showerror">
                                {{ slab2.threshold.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-dropdown
                                label="Tax Rate (In percentage)"
                                required
                                placeholder="Choose Rate"
                                :items="rateList2"
                                v-model="slab2.rate.value"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="slab2.rate.showerror">
                                {{ slab2.rate.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                </div>
                <div v-if="!isSlab2">
                    <nitrozen-button
                        title="add new rate"
                        :theme="'secondary'"
                        class="meta-btn"
                        :disabled="checkHighestValue(slab1.rate.value)"
                        @click.stop="addRate()"
                    >
                        + Add Slab
                    </nitrozen-button>
                </div>
            </div>
        </template>

        <template slot="footer">
            <div class="footer">
                <nitrozen-button
                    class="footer-btn"
                    v-strokeBtn
                    :theme="'secondary'"
                    @click.stop="close('Cancelled')"
                    >Cancel</nitrozen-button
                >
                <nitrozen-button
                    class="footer-btn"
                    v-flatBtn
                    :theme="'secondary'"
                    @click="close('Saved')"
                    >Save</nitrozen-button
                >
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
const RATE_LIST = [
    { text: '0%', value: '0' },
    { text: '3%', value: 3 },
    { text: '5%', value: 5 },
    { text: '10%', value: 10 },
    { text: '12%', value: 12 },
    { text: '18%', value: 18 },
    { text: '28%', value: 28 },
];
import { debounce } from '@/helper/utils';
import cloneDeep from 'lodash/cloneDeep';
import AdmDatePicker from '@/components/common/date-picker.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';
import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenButton,
    NitrozenError,
    NitrozenDialog,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'AddTaxrateDailog',
    components: {
        NitrozenInput,
        NitrozenDropdown,
        NitrozenButton,
        NitrozenError,
        NitrozenDialog,
        AdmDatePicker,
        UktInlineSvg,
    },
    props: {
        description: {
            type: String,
            default: 'Add GST',
        },
        taxes: Object,
        selectedDates: {
            type: Array,
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    computed: {},
    watch: {
        taxes: {
            immediate: true,
            handler(newVal, oldVal) {
                this.datedTax = cloneDeep(newVal);
                if (this.datedTax) {
                    for (let tax in this.datedTax) {
                        for (let temp of this.datedTax[tax]) {
                            if (!temp.effective_date.includes('.000Z')) {
                                temp.effective_date = new Date(
                                    temp.effective_date + '.000Z'
                                )
                                    .toLocaleString('sv')
                                    .replace(' ', 'T');
                            }
                        }
                    }
                }
            },
        },
    },
    data: function () {
        return {
            datedTax: {},
            rateList1: [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 },
            ],
            rateList2: [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 },
            ],
            slab1: {
                cess: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
                effective_date: {
                    value: '',
                    showerror: false,
                    errortext: '',
                },
                rate: {
                    value: '0',
                    showerror: false,
                    errortext: '',
                },
                threshold: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
            },
            slab2: {
                cess: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
                effective_date: {
                    value: '',
                    showerror: false,
                    errortext: '',
                },
                rate: {
                    value: '0',
                    showerror: false,
                    errortext: '',
                },
                threshold: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
            },
            isSlab2: false,
        };
    },
    mounted() {},
    methods: {
        checkExistigDate(selectedDate) {
            const date1 = new Date(selectedDate);
            this.selectedDates.forEach((eachDate) => {
                const date2 = new Date(eachDate);
                const date1WithoutTime = new Date(date1.getTime());
                const date2WithoutTime = new Date(date2.getTime());
                date1WithoutTime.setUTCHours(0, 0, 0, 0);
                date2WithoutTime.setUTCHours(0, 0, 0, 0);
                if (date1WithoutTime.getTime() === date2WithoutTime.getTime()) {
                    this.$snackbar.global.showError('Slab already exist for selected effective date');
                    this.slab1.effective_date.value = ""
                    return;
                }
            });
        },
        checkHighestValue(value) {
            const rateList = cloneDeep(RATE_LIST);
            const highest = rateList
                .sort((a, b) => a.value - b.value)
                .pop().value;
            return highest === value;
        },
        open(data) {
            this.$refs.dialog.open({
                width: '600px',
                height: '80%',
            });
        },
        validate(data) {
            let isValid = true;
            return isValid;
        },
        removeRate() {
            this.isSlab2 = false;
            this.resetSlab2();
        },
        addRate() {
            let isValid = this.checkFirstSlab(this.slab1);
            if (isValid) {
                this.getRateList2(this.slab1.rate.value);
                this.isSlab2 = true;
            } else {
            }
        },
        getRateList2(data) {
            let tempList = [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 },
            ];
            this.rateList2 = tempList.filter((rate) => rate.value > data);
            if(data == 28){
                this.removeRate()
            }
        },
        getFormValues() {
            let objData = [];
            objData.push({
                threshold: this.slab1.threshold.value,
                rate: this.slab1.rate.value,
                effective_date: this.slab1.effective_date.value,
                cess: this.slab1.cess.value,
            });
            if (this.isSlab2) {
                objData.push({
                    threshold: this.slab2.threshold.value,
                    rate: this.slab2.rate.value,
                    effective_date: this.slab2.effective_date.value,
                    cess: this.slab2.cess.value,
                });
            }
            return objData;
        },
        close(action) {
            if (action === 'Saved') {
                let isValid = this.validateBothSlab();
                if (isValid) {
                    let objectData = this.getFormValues();
                    this.resetSlab2();
                    this.resetSlab1();
                    this.datedTax = {};
                    this.isSlab2 = false;
                    this.$refs['dialog'].close();
                    this.$emit('close', action, objectData);
                }
            } else if (action === 'Cancelled') {
                let objectData = [];
                this.resetSlab2();
                this.resetSlab1();
                this.datedTax = {};
                this.isSlab2 = false;

                this.$refs['dialog'].close();
                this.$emit('close', action, objectData);
            }
        },
        checkFirstSlab(data) {
            if (this.checkSlab1Required(data)) {
                let date_dict = this.getDateDict();
                let newdate = new Date(data.effective_date.value).setHours(
                    1,
                    35,
                    0,
                    0
                );
                newdate = new Date(newdate).toISOString();
                let selectedDate = newdate.split('T')[0];

                if (selectedDate in date_dict) {
                    //get the tax array for selected date
                    let rates = this.datedTax[date_dict[selectedDate]];
                    let rateCount = rates.length;
                    if (rateCount >= 2) {
                        this.slab1.effective_date.showerror = true;
                        this.slab1.effective_date.errortext =
                            'Select another date, two GST rate for selected dates already exist';
                        return false;
                    } else if (rateCount == 1) {
                        this.$snackbar.global.showError(
                            `One GST rate already exist, only two GST rates can be added for one date`
                        );
                        return false;
                    }
                } else return true;
            }
        },
        checkSlab1Required(data) {
            let isValid = true;
            if (data.threshold.value >= 0 && data.threshold.value <= 999999) {
                this.slab1.threshold.showerror = false;
            } else if (data.threshold.value > 999999) {
                this.slab1.threshold.showerror = true;
                this.slab1.threshold.errortext =
                    'Threshold should be lesser than 999999';
                isValid = false;
            } else {
                this.slab1.threshold.showerror = true;
                this.slab1.threshold.errortext = 'Threshold should be a number';
                isValid = false;
            }
            if (data.rate.value >= 0) {
                this.slab1.rate.showerror = false;
            } else {
                this.slab1.rate.showerror = true;
                this.slab1.rate.errortext = 'Rate is required';
                isValid = false;
            }
            if (
                data.effective_date.value !== '' &&
                data.effective_date.value !== undefined
            ) {
                this.slab1.effective_date.showerror = false;
            } else {
                this.slab1.effective_date.showerror = true;
                this.slab1.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            if (data.cess.value >= 0) {
                this.slab1.cess.showerror = false;
            } else {
                this.slab1.cess.showerror = true;
                this.slab1.cess.errortext = 'Cess can not be lessser than 0';
                isValid = false;
            }
            return isValid;
        },
        checkSlab2Required(slab2, slab1) {
            let isValid = true;
            if (
                slab2.threshold.value > slab1.threshold.value &&
                slab2.threshold.value <= 999999
            ) {
                this.slab2.threshold.showerror = false;
            } else if (slab2.threshold.value > 999999) {
                this.slab2.threshold.showerror = true;
                this.slab2.threshold.errortext =
                    'Threshold should be lesser than 99999';
                isValid = false;
            } else {
                this.slab2.threshold.showerror = true;
                this.slab2.threshold.errortext =
                    'Threshold should be greater than first threshold';
                isValid = false;
            }
            if (slab2.rate.value > slab1.rate.value) {
                this.slab2.rate.showerror = false;
            } else {
                this.slab2.rate.showerror = true;
                this.slab2.rate.errortext = 'Rate is required';
                isValid = false;
            }
            if (
                slab1.effective_date.value !== '' &&
                slab1.effective_date.value !== undefined
            ) {
                this.slab2.effective_date.showerror = false;
            } else {
                this.slab2.effective_date.showerror = true;
                this.slab2.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            if (slab2.cess.value >= 0) {
                this.slab2.cess.showerror = false;
            } else {
                this.slab2.cess.showerror = true;
                this.slab2.cess.errortext = 'Cess should be a number';
                isValid = false;
            }
            return isValid;
        },
        validateBothSlab() {
            let isValid1 = this.checkSlab1Required(this.slab1);
            let isValid2 = true;
            if (this.isSlab2) {
                isValid2 = this.checkSlab2Required(this.slab2, this.slab1);
            }
            //checking if both slabs has required field
            if (isValid1 && isValid2) {
                let date_dict = this.getDateDict();

                let newdate = new Date(
                    this.slab1.effective_date.value
                ).setHours(0, 35, 0, 0);
                this.slab1.effective_date.value = new Date(
                    newdate
                ).toISOString();
                newdate = new Date(newdate).toISOString();
                let selectedDate = newdate.split('T')[0];

                //To ensure more than two tax rate isnt added for a single date
                if (selectedDate in date_dict) {
                    //got the tax array for selected date
                    let rates = this.datedTax[date_dict[selectedDate]];
                    let rateCount = rates.length;
                    if (rateCount >= 2) {
                        this.slab1.effective_date.showerror = true;
                        this.slab1.effective_date.errortext =
                            'Select another date, two GST rate for selected dates already exist';
                        return false;
                    } else if (rateCount == 1) {
                        let isValid = true;
                        //checking if new slab is greater than previous, compare to old slab
                        if (this.slab1.threshold.value > rates[0].threshold) {
                            this.slab1.threshold.showerror = false;
                        } else {
                            this.slab1.threshold.showerror = true;
                            this.slab1.threshold.errortext =
                                'Threshold should be greater than first threshold';
                            isValid = false;
                        }
                        if (this.slab1.rate.value > rates[0].rate) {
                            this.slab1.rate.showerror = false;
                        } else {
                            this.slab1.rate.showerror = true;
                            this.slab1.rate.errortext =
                                'Rate should be greater than previous one';
                            isValid = false;
                        }
                        return isValid;
                    }
                } else {
                    if (this.isSlab2) {
                        this.slab2.effective_date.value =
                            this.slab1.effective_date.value;
                    }
                    return true;
                }
            } else return false;
        },
        getDateDict() {
            let keys = Object.keys(this.datedTax);
            //getting comparable dates objects array
            let date_dict = {};
            for (let item of keys) {
                let key = String(item).split('T')[0];
                date_dict[key] = item;
            }
            return date_dict;
        },
        resetSlab1() {
            this.slab1 = {
                cess: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
                effective_date: {
                    value: '',
                    showerror: false,
                    errortext: '',
                },
                rate: {
                    value: '0',
                    showerror: false,
                    errortext: '',
                },
                threshold: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
            };
        },
        resetSlab2() {
            this.slab2 = {
                cess: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
                effective_date: {
                    value: '',
                    showerror: false,
                    errortext: '',
                },
                rate: {
                    value: '0',
                    showerror: false,
                    errortext: '',
                },
                threshold: {
                    value: 0,
                    showerror: false,
                    errortext: '',
                },
            };
        },
    },
};
</script>

<style lang="less" scoped>
.dialog-container {
    .row {
        width: 100%;
        margin: 0 0 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .input-box {
            width: 48%;
        }
        .input-box2 {
            width: 100%;
        }
        .input-date {
            width: 100%;
        }
    }
    .custom-label {
        padding: 12px;
    }
    .div-center {
        height: 60%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .edit-btn {
        float: right;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
    @media screen and (max-height: 600px) {
        ::v-deep.not-found {
            width: auto;
            padding: unset;
            img {
                width: 250px;
                height: 150px;
            }
        }
    }
    ::v-deep.not-found {
        width: auto;
    }
    ::v-deep img {
        width: 100%;
        height: 200px;
        object-fit: contain;
    }
}
.rate-list-div {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid @Iron;
    border-radius: 4px;
    background-color: @White;
    padding: 12px 24px;
    margin-bottom: 10px;
    .rate-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .rate-list-name {
        color: @Mako;
        font-size: 12px;
    }
}
.footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    .footer-btn {
        margin-left: 12px;
    }
}
::v-deep .n-button:disabled {
    opacity: 0.5;
}
</style>
