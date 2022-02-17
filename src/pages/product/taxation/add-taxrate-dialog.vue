<template>
    <nitrozen-dialog ref="dialog" title="Add Tax Rate/GST">
        <template slot="body">
            <div class="dialog-container">
                <div class="row">
                    <div class="input-box">
                        <adm-date-picker
                            label="Effective date *"
                            required
                            date_format="YYYY-MM-DD"
                            :picker_type="'date'"
                            class="st-date"
                            v-model="effective_date.value"
                            :not_before="new Date().toISOString()"
                            :useNitrozenTheme="true"
                        />
                        <nitrozen-error v-if="effective_date.showerror">
                            {{ effective_date.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="input-box">
                        <nitrozen-input
                            label="Cess"
                            type="number"
                            placeholder="cess value (optional)"
                            v-model="cess.value"
                            @input=""
                            :custom="true"
                            :showPrefix="true"
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
                            v-model="threshold.value"
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
                        <nitrozen-error v-if="threshold.showerror">
                            {{ threshold.errortext }}
                        </nitrozen-error>
                    </div>
                    <div class="input-box left-space-txb">
                        <nitrozen-dropdown
                            label="Tax Rate (In percentage)"
                            required
                            placeholder="Choose Rate"
                            :items="predefinedRateList"
                            v-model="rate.value"
                        ></nitrozen-dropdown>
                        <nitrozen-error v-if="rate.showerror">
                            {{ rate.errortext }}
                        </nitrozen-error>
                    </div>
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
                <!--above we have to send empty object and below button will be disabled if form isnt valid-->
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
        AdmDatePicker
    },
    props: {
        description: {
            type: String,
            default: 'Add Tax Rate/GST'
        },
        taxes: Array,
        selectedRate: Object
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
            },
        };
    },
    mounted() {
    },
    methods: {
        validate(data) {
            let isValid = true;
            return isValid;
        },
        open(data) {
            this.$refs.dialog.open({
                showCloseButton: true,
                width: '600px',
                height: '80%'
            });
        },
        validateEffectiveDate() {},
        validateRate() {
            let isValid = true;
            if (this.rate.value !== 0) {
                this.rate.showerror = false;
            } else {
                this.rate.showerror = true;
                isValid = false;
            }
            return isValid;
        },
        validateThreshold() {},
        close(action) {
            if (action === 'Saved') {
                let newRate = {};
                newRate.cess = this.cess.value;

                if (this.effective_date.value !== '') {
                    this.effective_date.showerror = false;
                    newRate.effective_date = this.effective_date.value;
                } else this.effective_date.showerror = true;

                if (this.validateRate()) {
                    newRate.rate = this.rate.value;
                }

                if (this.threshold.value !== '') {
                    this.threshold.showerror = false;
                    newRate.threshold = this.threshold.value;
                } else this.threshold.showerror = true;

                if (
                    !this.effective_date.showerror &&
                    !this.rate.showerror &&
                    !this.threshold.showerror &&
                    this.validate(newRate)
                ) {
                this.cess.value = 0;
                this.effective_date.value = '';
                this.effective_date.showerror = false;
                this.rate.value = 0;
                this.rate.showerror = false;
                this.threshold.value = 0;
                this.threshold.showerror = false;
                    this.$refs['dialog'].close();
                    this.$emit('close', action, newRate);
                } else
                    this.$snackbar.global.showError(
                        `Fill in the required fields`
                    );
            } else {
                this.cess.value = 0;
                this.effective_date.value = '';
                this.effective_date.showerror = false;
                this.rate.value = 0;
                this.rate.showerror = false;
                this.threshold.value = 0;
                this.threshold.showerror = false;
                this.$refs['dialog'].close();
                this.$emit('close', action);
            }
        }
    }
};
</script>
