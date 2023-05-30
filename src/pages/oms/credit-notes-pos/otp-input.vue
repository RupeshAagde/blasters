<template>
    <div>
        <div :class="labelClasses">Enter OTP</div>
        <div class="otp-input">
            <div v-for="(v, i) in otpLength * 2 - 1" :key="i / 2">
                <input
                    v-if="i % 2 === 0"
                    :ref="'input' + i / 2"
                    type="number"
                    pattern="[0-9]{1}"
                    :disabled="disabled"
                    @keyup="handleInput($event, i / 2)"
                    @paste="onPaste($event, i / 2)"
                    v-model="otp[i / 2]"
                    maxlength="1"
                    :max="9"
                    :min="0"
                    inputmode="numeric"
                    @focus="handleFocus($event, i / 2)"
                />
                <span v-if="i % 2 !== 0">{{ character }}</span>
            </div>
        </div>
    </div>
</template>

<script>
const ON_INPUT_COMPLETE_EVENT = 'onComplete';
const ON_INPUT_CHANGE_EVENT = 'onChange';
const ON_ENTER_EVENT = 'onEnter';
export default {
    name: 'otp-input',
    props: {
        focus: {
            type: Boolean,
            default: false,
        },
        length: {
            type: Number,
            default: 6,
        },
        joinCharacter: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        labelClasses: {
            type: Array,
            default() {
                return ['nitrozen-label'];
            },
        },
    },
    data: function () {
        return {
            otpLength: this.length,
            character: this.joinCharacter,
            otp: [],
            isComplete: false,
            key: 'default',
        };
    },
    methods: {
        handleInput(e, i) {
            this.$nextTick(() => {
                this.isComplete = false;
                if (e.keyCode === 13 && this.otpLength === this.otp.length) {
                    // Enter pressed
                    this.$emit(ON_ENTER_EVENT, this.otp.join(''));
                } else if (e.keyCode === 8) {
                    // Backspace Pressed
                    if (i > 0 && this.$refs['input' + (i - 1)][0]) {
                        this.otp[i] = '';
                        const dataChange = {
                            index: i - 1,
                            value: this.otp[i - 1],
                        };
                        this.$emit(ON_INPUT_CHANGE_EVENT, {
                            change: dataChange,
                            value: this.otp.join(''),
                        });
                        this.$refs['input' + (i - 1)][0].focus();
                    }
                } else {
                    this.otp = this.otp.map((item, idx) => {
                        if (idx === i && typeof e.key === 'number') {
                            item = e.key;
                        }
                        return item;
                    });
                    if (this.otp[i]) {
                        this.otp[i] = this.otp[i][0];
                    }
                    if (
                        i < this.otpLength - 1 &&
                        this.$refs['input' + (i + 1)][0]
                    ) {
                        this.$refs['input' + (i + 1)][0].focus();
                    } else {
                        this.isComplete = this.otp.every(
                            (item) =>
                                !isNaN(parseFloat(item)) &&
                                isFinite(item) &&
                                item.length === 1
                        );
                    }
                }
                if (typeof i === 'number' && i >= 0 && this.otp[i]) {
                    const dataChange = {
                        index: i,
                        value: this.otp[i],
                    };
                    this.$emit(ON_INPUT_CHANGE_EVENT, {
                        change: dataChange,
                        value: this.otp.join(''),
                    });
                }
            });
        },
        handleFocus(e, i) {
            e.target.select();
            if (!this.otp[i]) {
                const c = this.otp.filter((item) => item).length;
                if (c && c < this.otpLength) this.$refs['input' + c][0].focus();
            }
        },
        onPaste(e, current) {
            const clipboardData = e.clipboardData.getData('text/plain');
            this.$nextTick(() => {
                if (/^\d+$/.test(clipboardData)) {
                    const newOtpData = clipboardData.split('');
                    for (let k = 0; k <= current; k++) {
                        if (typeof this.otp[k] !== 'string' || !this.otp[k]) {
                            this.otp[k] = '';
                        }
                    }
                    for (
                        var i = current, j = 0;
                        i <
                        Math.min(this.otpLength, current + newOtpData.length);
                        i++, j++
                    ) {
                        this.$set(this.otp, i, newOtpData[j]);
                    }
                    this.$emit(ON_INPUT_CHANGE_EVENT, {
                        change: this.otp,
                        value: this.otp.join(''),
                    });
                    this.$refs[
                        'input' + Math.min(i, this.otpLength - 1)
                    ][0].focus();
                } else {
                    this.otp[current] = '';
                }
            });
        },
    },
    watch: {
        disabled() {
            if (!this.disabled) {
                this.$nextTick(() => {
                    this.$refs['input' + 0][0].focus();
                });
            }
        },
        isComplete() {
            if (this.isComplete) {
                this.$emit(ON_INPUT_COMPLETE_EVENT, this.otp.join(''));
                this.isComplete = false;
            }
        },
    },
    mounted() {
        this.otp.fill('', 0, this.otpLength);
        if (this.focus && this.otpLength) {
            this.$refs['input0'][0].focus();
        }
    },
};
</script>

<style scoped lang="less">
.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}
.extra-padding {
    padding-bottom: 6px;
}
.otp-input {
    display: flex;
    max-width: 350px;
    div {
        flex: 1;
        display: flex;
        align-items: center;
        input {
            max-width: 30px;
            padding: 10px 8px;
            font-size: 15px;
            border-radius: 3px;
            border: 1px solid #cecece;
            text-align: center;
        }
        span {
            display: block;
            flex: 1;
            text-align: center;
        }
    }
}
</style>