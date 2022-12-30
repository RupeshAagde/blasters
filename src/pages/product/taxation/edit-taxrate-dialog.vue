<template>
    <nitrozen-dialog ref="dialog" title="Edit GST" @close="resetOnDismiss">
        <template slot="body">
            <div>
                <div
                    v-if="editableRate.length > 0"
                    class="dialog-container firstSlab"
                >
                    <div class="row">
                        <div class="input-box">
                            <adm-date-picker
                                label="Effective date *"
                                required
                                date_format="YYYY-MM-DD"
                                :picker_type="'date'"
                                class="st-date"
                                v-model="editableRate[0].effective_date"
                                :useNitrozenTheme="true"
                                @input="checkExistigDate($event)"
                            />
                            <nitrozen-error
                                v-if="slabOneErr.effective_date.showerror"
                            >
                                {{ slabOneErr.effective_date.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-input
                                label="Cess"
                                type="number"
                                placeholder="cess value (optional)"
                                v-model="editableRate[0].cess"
                            ></nitrozen-input>
                            <nitrozen-error v-if="slabOneErr.cess.showerror">
                                {{ slabOneErr.cess.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-box">
                            <nitrozen-input
                                label="Threshold value"
                                required
                                disabled
                                type="number"
                                placeholder="eg. 99999"
                                v-model="editableRate[0].threshold"
                                :custom="true"
                                :showPrefix="true"
                            >
                                <div
                                    class=".
                            custom-label"
                                >
                                    &#62;
                                </div>
                            </nitrozen-input>
                            <nitrozen-error
                                v-if="slabOneErr.threshold.showerror"
                            >
                                {{ slabOneErr.threshold.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-dropdown
                                label="Tax Rate (In percentage)"
                                required
                                placeholder="Choose Rate"
                                :items="rateList1"
                                @change="getRateList2(editableRate[0].rate)"
                                v-model="editableRate[0].rate"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="slabOneErr.rate.showerror">
                                {{ slabOneErr.rate.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                </div>
                <div
                    v-if="editableRate.length == 2"
                    class="dialog-container secondSlab"
                >
                    <hr />
                    <ukt-inline-svg
                        class="edit-btn"
                        title="delete gst"
                        src="delete-red"
                        @click.stop.native="removeRate()"
                    ></ukt-inline-svg>
                    <div class="row">
                        <!--<div class="input-box">
                            <adm-date-picker
                                label="Effective date *"
                                required
                                date_format="YYYY-MM-DD"
                                :picker_type="'date'"
                                class="st-date"
                                v-model="editableRate[0].effective_date"
                                :useNitrozenTheme="true"
                            />
                            <nitrozen-error
                                v-if="slabTwoErr.effective_date.showerror"
                            >
                                {{ slabTwoErr.effective_date.errortext }}
                            </nitrozen-error>
                        </div> -->
                        <div class="input-box2">
                            <nitrozen-input
                                label="Cess"
                                type="number"
                                placeholder="cess value (optional)"
                                v-model="editableRate[1].cess"
                            ></nitrozen-input>
                            <nitrozen-error v-if="slabTwoErr.cess.showerror">
                                {{ slabTwoErr.cess.errortext }}
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
                                v-model="editableRate[1].threshold"
                                :custom="true"
                                :showPrefix="true"
                            >
                                <div
                                    class=".
                            custom-label"
                                >
                                    &#62;
                                </div>
                            </nitrozen-input>
                            <nitrozen-error
                                v-if="slabTwoErr.threshold.showerror"
                            >
                                {{ slabTwoErr.threshold.errortext }}
                            </nitrozen-error>
                        </div>
                        <div class="input-box">
                            <nitrozen-dropdown
                                label="Tax Rate (In percentage)"
                                required
                                placeholder="Choose Rate"
                                :items="rateList2"
                                v-model="editableRate[1].rate"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="slabTwoErr.rate.showerror">
                                {{ slabTwoErr.rate.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                </div>
                <div v-if="editableRate.length < 2">
                    <NitrozenButton
                        title="add new rate"
                        theme="secondary"
                        class="ml-sm"
                        :disabled="checkHighestValue()"
                        @click.stop="addRate()"
                    >
                        + Add Slab
                    </NitrozenButton>
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
    @media screen and (max-height: 600px) {
        ::v-deep .not-found {
            width: auto;
            padding: unset;
            img {
                width: 250px;
                height: 150px;
            }
        }
    }
    ::v-deep .not-found {
        width: auto;
    }
    ::v-deep img {
        width: 100%;
        height: 200px;
        object-fit: contain;
    }
}
.edit-btn {
    float: right;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
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
<script>
const RATE_LIST = [
    { text: '0%', value: '0' },
    { text: '3%', value: 3 },
    { text: '5%', value: 5 },
    { text: '10%', value: 10 },
    { text: '12%', value: 12 },
    { text: '18%', value: 18 },
    { text: '28%', value: 28 }
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
    strokeBtn
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
        UktInlineSvg
    },
    props: {
        taxes: Object,
        selectedRate: Array,
        selectedDates: Array
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        predefinedRateList() {
            return RATE_LIST;
        }
    },
    data: function() {
        return {
            cess: {
                showerror: false,
                errortext: ''
            },
            effective_date: {
                value: '',
                showerror: false,
                errortext: ''
            },
            rate: {
                showerror: false,
                errortext: ''
            },
            threshold: {
                showerror: false,
                errortext: ''
            },
            // writing new code here
            rateList1: [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 }
            ],
            rateList2: [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 }
            ],
            datedTax: {},
            editableRate: [],
            slabOneErr: {
                threshold: {
                    showerror: false,
                    errortext: ''
                },
                rate: {
                    showerror: false,
                    errortext: ''
                },
                effective_date: {
                    showerror: false,
                    errortext: ''
                },
                cess: {
                    showerror: false,
                    errortext: ''
                }
            },
            slabTwoErr: {
                threshold: {
                    showerror: false,
                    errortext: ''
                },
                rate: {
                    showerror: false,
                    errortext: ''
                },
                effective_date: {
                    showerror: false,
                    errortext: ''
                },
                cess: {
                    showerror: false,
                    errortext: ''
                }
            },

            slabError: [
                {
                    threshold: {
                        showerror: false,
                        errortext: ''
                    },
                    rate: {
                        showerror: false,
                        errortext: ''
                    },
                    effective_date: {
                        showerror: false,
                        errortext: ''
                    },
                    cess: {
                        showerror: false,
                        errortext: ''
                    }
                },
                {
                    threshold: {
                        showerror: false,
                        errortext: ''
                    },
                    rate: {
                        showerror: false,
                        errortext: ''
                    },
                    effective_date: {
                        showerror: false,
                        errortext: ''
                    },
                    cess: {
                        showerror: false,
                        errortext: ''
                    }
                }
            ],
            editableRateszCopy: []
        };
    },
    mounted() {},
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
            }
        },
        selectedRate: {
            immediate: true,
            handler(newVal, oldVal) {
                this.editableRate = newVal.map((a) => {
                    return { ...a };
                });
                for (let tax of this.editableRate) {
                    if (tax.rate === 0) {
                        tax.rate = '0';
                    }
                    if (!tax.effective_date.includes('.000Z')) {
                        tax.effective_date = new Date(
                            tax.effective_date + '.000Z'
                        )
                            .toLocaleString('sv')
                            .replace(' ', 'T');
                    }
                }
                this.editableRateszCopy = cloneDeep(this.editableRate);
            }
        }
    },
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
                    this.$snackbar.global.showError(
                        'Slab already exist for selected effective date'
                    );
                    this.editableRate[0].effective_date = this.editableRateszCopy[0].effective_date;
                    return;
                }
            });
        },
        checkHighestValue() {
            let value = '';
            if (this.editableRate[0] && this.editableRate[0].rate) {
                value = this.editableRate[0].rate;
            }
            const rateList = cloneDeep(RATE_LIST);
            const highest = rateList.sort((a, b) => a.value - b.value).pop()
                .value;
            return highest === value;
        },
        open(data) {
            this.$refs.dialog.open({
                width: '600px',
                height: '80%',
                showCloseButton: true
            });
        },
        close(action) {
            if (action === 'Saved') {
                let isValid = this.validateBothSlab();
                if (isValid) {
                    for (let rate of this.editableRate) {
                    }
                    let objectData = cloneDeep(this.editableRate);
                    this.clearFieldOnCancelOrSave();
                    this.$refs['dialog'].close();
                    this.$emit('close', action, objectData);
                } else
                    this.$snackbar.global.showError(
                        'Please fill in the required fields'
                    );
            } else {
                this.clearFieldOnCancelOrSave();
                this.$refs['dialog'].close();
                this.$emit('close', action);
            }
        },
        resetOnDismiss($event) {
            if ($event === 'close') {
                this.clearFieldOnCancelOrSave();
                this.$emit('close', 'Cancelled');
            }
        },
        addRate() {
            let data = this.editableRate[0];
            let isValid = this.checkFirstSlab(data);
            if (isValid) {
                let emptyRate = {
                    effective_date: '',
                    cess: 0,
                    rate: 0,
                    threshold: 0
                };
                this.getRateList2(data.rate);
                this.editableRate.push(emptyRate);
            } else {
                this.$snackbar.global.showError(
                    `Two tax rate already exist for selected date`
                );
            }
        },
        removeRate() {
            this.editableRate.splice(1, 1);
            this.$snackbar.global.showSuccess(`Rate removed`);
        },
        getRateList2(data) {
            let tempList = [
                { text: '0%', value: '0' },
                { text: '3%', value: 3 },
                { text: '5%', value: 5 },
                { text: '10%', value: 10 },
                { text: '12%', value: 12 },
                { text: '18%', value: 18 },
                { text: '28%', value: 28 }
            ];
            this.rateList2 = tempList.filter((rate) => rate.value > data);
            if (data == 28) {
                this.removeRate();
            }
        },
        checkFirstSlab(data) {
            if (this.checkSlab1Required(data)) {
                let date_dict = this.getDateDict();
                let initialdate = this.selectedRate[0].effective_date;
                initialdate = initialdate.split('T')[0];
                let newdate = new Date(data.effective_date).setHours(
                    1,
                    35,
                    0,
                    0
                );

                newdate = new Date(newdate).toISOString();
                let selectedDate = newdate.split('T')[0];

                if (selectedDate in date_dict && selectedDate != initialdate) {
                    //got the tax array for selected date
                    let rates = this.datedTax[date_dict[selectedDate]];
                    let rateCount = rates.length;
                    if (rateCount >= 2) {
                        this.slabError[0].effective_date.showerror = true;
                        this.slabError[0].effective_date.errortext =
                            'Select another date, two GST rate for selected date already exist';
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
            if (data.threshold >= 0 && data.threshold <= 999999) {
                this.slabOneErr.threshold.showerror = false;
            } else if (data.threshold > 999999) {
                this.slabOneErr.threshold.showerror = true;
                this.slabOneErr.threshold.errortext =
                    'Threshold should be lesser than 999999';
                isValid = false;
            } else {
                this.slabOneErr.threshold.showerror = true;
                this.slabOneErr.threshold.errortext =
                    'Threshold should be a number';
                isValid = false;
            }
            if (data.rate >= 0) {
                this.slabOneErr.rate.showerror = false;
            } else {
                this.slabOneErr.rate.showerror = true;
                this.slabOneErr.rate.errortext = 'Rate is required';
                isValid = false;
            }
            if (
                data.effective_date !== '' &&
                data.effective_date !== undefined
            ) {
                this.slabOneErr.effective_date.showerror = false;
            } else {
                this.slabOneErr.effective_date.showerror = true;
                this.slabOneErr.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            if (data.cess >= 0) {
                this.slabOneErr.cess.showerror = false;
            } else {
                this.slabOneErr.cess.showerror = true;
                this.slabOneErr.cess.errortext = 'Cess should be a number';
                isValid = false;
            }
            return isValid;
        },
        checkSlab2Required(slab2, slab1) {
            let isValid = true;
            if (
                slab2.threshold > slab1.threshold &&
                slab2.threshold <= 999999
            ) {
                this.slabTwoErr.threshold.showerror = false;
            } else if (slab2.threshold > 999999) {
                this.slabTwoErr.threshold.showerror = true;
                this.slabTwoErr.threshold.errortext =
                    'Threshold should be lesser than 999999';
                isValid = false;
            } else {
                this.slabTwoErr.threshold.showerror = true;
                this.slabTwoErr.threshold.errortext =
                    'Threshold should be greater than first threshold';
                isValid = false;
            }
            if (slab2.rate > slab1.rate) {
                this.slabTwoErr.rate.showerror = false;
            } else {
                this.slabTwoErr.rate.showerror = true;
                this.slabTwoErr.rate.errortext = 'Rate is required';
                isValid = false;
            }
            if (
                slab1.effective_date !== '' &&
                slab1.effective_date !== undefined
            ) {
                this.slabTwoErr.effective_date.showerror = false;
            } else {
                this.slabTwoErr.effective_date.showerror = true;
                this.slabTwoErr.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            if (slab2.cess >= 0) {
                this.slabTwoErr.cess.showerror = false;
            } else {
                this.slabTwoErr.cess.showerror = true;
                this.slabTwoErr.cess.errortext = 'Cess should be a number';
                isValid = false;
            }
            return isValid;
        },
        validateBothSlab() {
            let isValid1 = this.checkSlab1Required(this.editableRate[0]);
            let isValid2 = true;
            if (this.editableRate.length > 1) {
                isValid2 = this.checkSlab2Required(
                    this.editableRate[1],
                    this.editableRate[0]
                );
            }
            //checking if both slabs has required field
            if (isValid1 && isValid2) {
                let date_dict = this.getDateDict();
                let initialdate = this.selectedRate[0].effective_date;
                initialdate = initialdate.split('T')[0];
                let newdate = new Date(
                    this.editableRate[0].effective_date
                ).setHours(0, 35, 0, 0);
                this.editableRate[0].effective_date = new Date(
                    newdate
                ).toISOString();
                newdate = new Date(newdate).toISOString();
                let selectedDate = newdate.split('T')[0];

                //To ensure more than two tax rate isnt added for a single date
                if (selectedDate in date_dict && selectedDate != initialdate) {
                    //got the tax array for selected date
                    let rates = this.datedTax[date_dict[selectedDate]];
                    let rateCount = rates.length;
                    if (rateCount >= 2) {
                        this.slabOneErr.effective_date.showerror = true;
                        this.slabOneErr.effective_date.errortext =
                            'Select another date, two GST rate for selected dates already exist';
                        return false;
                    } else if (rateCount == 1) {
                        let isValid = true;
                        //checking if new slab is greater than previous, compare to old slab
                        if (
                            this.editableRate[0].threshold > rates[0].threshold
                        ) {
                            this.slabOneErr.threshold.showerror = false;
                        } else {
                            this.slabOneErr.threshold.showerror = true;
                            this.slabOneErr.threshold.errortext =
                                'threshold can not be lesser than first threshold';
                            isValid = false;
                        }
                        if (this.editableRate[0].rate > rates[0].rate) {
                            this.slabOneErr.rate.showerror = false;
                        } else {
                            this.slabOneErr.rate.showerror = true;
                            this.slabOneErr.rate.errortext =
                                'rate should be greater than previous one';
                            isValid = false;
                        }
                        return isValid;
                    }
                } else {
                    if (this.editableRate.length > 1) {
                        this.editableRate[1].effective_date = this.editableRate[0].effective_date;
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
        clearFieldOnCancelOrSave() {
            this.editableRate = [];
            this.slabOneErr = {
                threshold: {
                    showerror: false,
                    errortext: ''
                },
                rate: {
                    showerror: false,
                    errortext: ''
                },
                effective_date: {
                    showerror: false,
                    errortext: ''
                },
                cess: {
                    showerror: false,
                    errortext: ''
                }
            };
            this.slabTwoErr = {
                threshold: {
                    showerror: false,
                    errortext: ''
                },
                rate: {
                    showerror: false,
                    errortext: ''
                },
                effective_date: {
                    showerror: false,
                    errortext: ''
                },
                cess: {
                    showerror: false,
                    errortext: ''
                }
            };
        }
    }
};
</script>
