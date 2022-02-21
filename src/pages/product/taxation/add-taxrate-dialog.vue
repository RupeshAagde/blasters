<template>
    <nitrozen-dialog ref="dialog" title="Add Tax Rate/GST">
        <template slot="body">
            <div>
                <div v-if="newRates.length > 0">
                    <div
                        class="dialog-container"
                        v-for="(form, i) in newRates"
                        :key="i"
                    >
                        <div v-if="i != 0"><hr /></div>
                        <ukt-inline-svg
                            v-if="i != 0"
                            class="edit-btn"
                            title="delete rate"
                            src="delete"
                            @click.stop.native="removeRate(i)"
                        ></ukt-inline-svg>
                        <div class="row">
                            <div class="input-box">
                                <adm-date-picker
                                    label="Effective date *"
                                    required
                                    date_format="YYYY-MM-DD"
                                    :picker_type="'date'"
                                    class="st-date"
                                    v-model="form.effective_date.value"
                                    :not_before="new Date().toISOString()"
                                    :useNitrozenTheme="true"
                                />
                                <nitrozen-error
                                    v-if="form.effective_date.showerror"
                                >
                                    {{ form.effective_date.errortext }}
                                </nitrozen-error>
                            </div>
                            <div class="input-box">
                                <nitrozen-input
                                    label="Cess"
                                    type="number"
                                    placeholder="cess value (optional)"
                                    v-model="form.cess.value"
                                    @input=""
                                ></nitrozen-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-box">
                                <nitrozen-input
                                    label="Thershold value"
                                    required
                                    type="number"
                                    placeholder="eg. 99999rs"
                                    v-model="form.threshold.value"
                                    @input=""
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
                                <nitrozen-error v-if="form.threshold.showerror">
                                    {{ form.threshold.errortext }}
                                </nitrozen-error>
                            </div>
                            <div class="input-box">
                                <nitrozen-dropdown
                                    label="Tax Rate (In percentage)"
                                    required
                                    placeholder="Choose Rate"
                                    :items="predefinedRateList"
                                    v-model="form.rate.value"
                                ></nitrozen-dropdown>
                                <nitrozen-error v-if="form.rate.showerror">
                                    {{ form.rate.errortext }}
                                </nitrozen-error>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <NitrozenButton
                        title="add new rate"
                        theme="secondary"
                        class="ml-sm"
                        @click="addRate"
                    >
                        + add rate
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
        float:right;
        color: @RoyalBlue;
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
</style>

<script>
const RATE_LIST = [
    { text: '3%', value: 3 },
    { text: '5%', value: 5 },
    { text: '10%', value: 10 },
    { text: '12%', value: 12 },
    { text: '18%', value: 18 },
    { text: '28%', value: 28 }
];
import { debounce } from '@/helper/utils';
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
        description: {
            type: String,
            default: 'Add Tax Rate/GST'
        },
        taxes: Array
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
            newRates: [
                {
                    cess: {
                        value: 0,
                        showerror: false,
                        errortext: ''
                    },
                    effective_date: {
                        value: '',
                        showerror: false,
                        errortext: 'Effective date is mandatory'
                    },
                    rate: {
                        value: 0,
                        showerror: false,
                        errortext: 'Rate is required'
                    },
                    threshold: {
                        value: 0,
                        showerror: false,
                        errortext: 'threshold is required'
                    }
                }
            ]
        };
    },
    mounted() {},
    methods: {
        open(data) {
            this.$refs.dialog.open({
                width: '600px',
                height: '80%'
            });
        },
        //Here new code
        validate(data) {
            let isValid = true;
            return isValid;
        },
        removeRate(i) {
            this.newRates.splice(i, 1);
            this.$snackbar.global.showSuccess(`Rate removed`);
        },
        addRate() {
            if (this.validateNewRates(this.newRates)) {
                let emptyRate = {
                    cess: {
                        value: 0,
                        showerror: false,
                        errortext: ''
                    },
                    effective_date: {
                        value: '',
                        showerror: false,
                        errortext: 'Effective date is mandatory'
                    },
                    rate: {
                        value: 0,
                        showerror: false,
                        errortext: 'Rate is required'
                    },
                    threshold: {
                        value: 0,
                        showerror: false,
                        errortext: 'threshold is required'
                    }
                };
                this.newRates.push(emptyRate);
            } else {
            }
        },
        validateNewRates(data) {
            let isValid = true;
            for (let item of data) {
                let isTValid = this.validateThreshold(item);
                let isRValid = this.validateRate(item);
                let isEDValid = this.validateEffectiveDate(item);
                let isCValid = this.validateCess(item);
                if (!isTValid || !isRValid || !isEDValid || !isCValid) {
                    isValid = false;
                }
            }
            return isValid;
        },
        validateThreshold(data) {
            let isValid = true;
            if (data.threshold.value > 0) {
                data.threshold.showerror = false;
            } else {
                data.threshold.showerror = true;
                data.threshold.errortext = 'threshold is required';
                isValid = false;
            }
            return isValid;
        },
        validateRate(data) {
            let isValid = true;
            if (data.rate.value > 0) {
                data.rate.showerror = false;
            } else {
                data.rate.showerror = true;
                data.rate.errortext = 'rate is required';
                isValid = false;
            }
            return isValid;
        },
        validateEffectiveDate(data) {
            let isValid = true;
            if (data.effective_date.value !== '') {
                let modifiedDate=new Date(data.effective_date.value)
                modifiedDate.setMinutes(modifiedDate.getMinutes() + 331)
                data.effective_date.value = new Date(modifiedDate).toISOString();
                data.effective_date.showerror = false;
            } else {
                data.effective_date.showerror = true;
                data.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            return isValid;
        },
        validateCess(data) {
            let isValid = true;
            if (data.cess.value >= 0) {
                data.cess.showerror = false;
            } else {
                data.cess.showerror = true;
                data.cess.errortext = 'Cess can not be lessser than 0';
                isValid = false;
            }
            return isValid;
        },
        getFormValues() {
            if (this.validateNewRates(this.newRates)) {
                let objData = [];
                for (let item of this.newRates) {
                    let obj = {};
                    obj.threshold = item.threshold.value;
                    obj.rate = item.rate.value;
                    obj.effective_date = item.effective_date.value;
                    obj.cess = item.cess.value;
                    objData.push(obj);
                }
                return objData;
            } else {
                this.$snackbar.global.showError(`Fill in the required fields`);
                return false;
            }
        },
        resetValues() {
            this.newRates = [
                {
                    cess: {
                        value: 0,
                        showerror: false,
                        errortext: ''
                    },
                    effective_date: {
                        value: '',
                        showerror: false,
                        errortext: 'Effective date is mandatory'
                    },
                    rate: {
                        value: 0,
                        showerror: false,
                        errortext: 'Rate is required'
                    },
                    threshold: {
                        value: 0,
                        showerror: false,
                        errortext: 'threshold is required'
                    }
                }
            ];
        },
        close(action) {
            if (action === 'Saved') {
                let objectData = this.getFormValues();
                if (objectData !== false) {
                    this.resetValues();
                    this.$refs['dialog'].close();
                    this.$emit('close', action, objectData);
                }
            } else if (action === 'Cancelled') {
                let objectData = [];
                this.resetValues();
                this.$refs['dialog'].close();
                this.$emit('close', action, objectData);
            }
        }
    }
};
</script>
