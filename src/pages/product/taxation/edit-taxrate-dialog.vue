<template>
    <nitrozen-dialog ref="dialog" title="Edit Tax Rate/GST">
        <template slot="body">
            <div>
                <div class="dialog-container">
                    <div class="row">
                        <div class="input-box">
                            <adm-date-picker
                                label="Effective date *"
                                required
                                date_format="YYYY-MM-DD"
                                :picker_type="'date'"
                                class="st-date"
                                v-model="editedRate.effective_date"
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
                                v-model="editedRate.cess"
                                @input=""
                            ></nitrozen-input>
                                                        <nitrozen-error v-if="cess.showerror">
                                {{ cess.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-box">
                            <nitrozen-input
                                label="Thershold value"
                                required
                                type="number"
                                placeholder="eg. 99999rs"
                                v-model="editedRate.threshold"
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
                        <div class="input-box">
                            <nitrozen-dropdown
                                label="Tax Rate (In percentage)"
                                required
                                placeholder="Choose Rate"
                                :items="predefinedRateList"
                                v-model="editedRate.rate"
                            ></nitrozen-dropdown>
                            <nitrozen-error v-if="rate.showerror">
                                {{ rate.errortext }}
                            </nitrozen-error>
                        </div>
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
            editedRate: {}
        };
    },
    mounted() {},
    watch: {
        selectedRate: {
            immediate: true,
            handler(newVal, oldVal) {
                this.editedRate = { ...newVal };
            }
        }
    },
    methods: {
        open(data) {
            this.$refs.dialog.open({
                width: '600px',
                height: '80%'
            });
        },
        validateThreshold() {
            let isValid = true;
            if (this.editedRate.threshold > 0) {
                this.threshold.showerror = false;
            } else {
                this.threshold.showerror = true;
                this.threshold.errortext = 'threshold is required';
                isValid = false;
            }
            return isValid;
        },
        validateRate() {
            let isValid = true;
            if (this.editedRate.rate > 0) {
                this.rate.showerror = false;
            } else {
                this.rate.showerror = true;
                this.rate.errortext = 'rate is required';
                isValid = false;
            }
            return isValid;
        },
        validateEffectiveDate() {
            let isValid = true;
            if (this.editedRate.effective_date !== '') {
                this.effective_date.showerror = false;
            } else {
                this.effective_date.showerror = true;
                this.effective_date.errortext = 'Date is required';
                isValid = false;
            }
            return isValid;
        },
        validateCess() {
            let isValid = true;
            if (this.editedRate.cess >= 0) {
                this.cess.showerror = false;
            } else {
                this.cess.showerror = true;
                this.cess.errortext = 'Cess can not be lessser than 0';
                isValid = false;
            }
            return isValid;
        },
        clearForm() {
            this.threshold.showerror = false;
            this.threshold.errortext = '';
            this.rate.showerror = false;
            this.rate.errortext = '';
            this.effective_date.value = '';
            this.effective_date.showerror = false;
            this.effective_date.errortext = '';
            this.cess.showerror = false;
            this.cess.errortext = '';
            this.editedRate = {};
        },
        validateEditedRate() {
            if (
                this.validateThreshold() &&
                this.validateRate() &&
                this.validateEffectiveDate() &&
                this.validateCess()
            ) {
                return true;
            } else {
                return false;
            }
        },
        close(action) {
            if (action === 'Saved') {
                if (this.validateEditedRate()) {
                    let objectData = this.editedRate;
                    this.clearForm();
                    this.$refs['dialog'].close();
                    this.$emit('close', action, objectData);
                } else
                    this.$snackbar.global.showError(
                        `Fill in the required fields`
                    );
            } else {
                this.clearForm();
                this.$refs['dialog'].close();
                this.$emit('close', action);
            }
        }
    }
};
</script>
