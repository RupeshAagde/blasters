<template>
    <div class="login-body-container">
        <div class="login">
            <nitrozen-input
                class="inputs"
                :autofocus="true"
                :label="'Mobile Number'"
                @keyup.enter="sendOtp"
                v-model="mobileno"
                placeholder='9987123456'
                required
                :maxlength="10"
            ></nitrozen-input>
            <nitrozen-error
                class="error"
                :style="{
                    visibility:
                        mobileno && !isPhoneNoValid(mobileno)
                            ? 'visible'
                            : 'hidden',
                }"
            >
                {{ 'Please enter a valid 10 digit phone number' }}
            </nitrozen-error>

            <auth-otp-input
                class="otp-inputs"
                @onComplete="onComplete"
                @onChange="onChange"
                @onEnter="verifyMobileOtp"
                :focus="invalid"
                :length="4"
            >
            </auth-otp-input>
            <div class="invalid-otp" v-if="invalid">
                <img
                    class="alert-icon"
                    src="/public/admin/assets/pngs/alert.png"
                />
                <span>Invalid OTP</span>
            </div>
            <div
                class="item resend-otp"
                @click="sendOtp"
                v-if="(resendTime.mobile || invalid || displayResendOtpText) && !mobileVerified"
                :class="{'disable-color': (otpRequestInfoMobile && resendTime.mobile) || onceClicked}" >
                <div class="resend-otp-text" :class="{'disable': onceClicked}">
                    Resend OTP&nbsp;
                    <span
                        class="disable"
                        v-if="resendTime.mobile"
                        style="width: 45px; min-width: 45px"
                    >
                        in {{ resendTime.mobile }}s
                    </span>
                </div>
            </div>
            <div class="otp-verified" v-if="mobileVerified">
                <adm-inline-svg
                    src="checkmark-green-round"
                    class="check-icon"
                ></adm-inline-svg>
                <span>OTP verified</span>
            </div>
            <nitrozen-button
                class="verify-btn"
                :theme="'secondary'"
                v-flatBtn
                @click="sendOtp"
                :disabled="!isFormValid() || isMobile() || onceClicked"
                v-if="!showOTPBox"
            >
                Send OTP
            </nitrozen-button>
            <nitrozen-button
                v-if="showOTPBox && !mobileVerified"
                class="verify-btn"
                :theme="'secondary'"
                v-flatBtn
                :disabled="!isOtpValid(mobileOtp, 4)"
                @click="verifyMobileOtp"
            >
                Verify OTP
            </nitrozen-button>
        </div>

        <div class="sepration"></div>

        <div class="user-detail">
            <nitrozen-input
                class="inputs"
                :label="'First Name'"
                v-model="firstName"
                @input="getFirstName($event)"
                required
            ></nitrozen-input>
            <nitrozen-error
                class="error first-name-error"
                :style="{
                    visibility:
                        (firstName && !isNameValid(firstName)) || errorMsg
                            ? 'visible'
                            : 'hidden',
                }">
                {{ 'Please enter a valid first name' }}
            </nitrozen-error>
            <nitrozen-input
                class="inputs last-name"
                :label="'Last Name'"
                v-model="lastName"
                @input="getLastName"
            ></nitrozen-input>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenBadge,
    NitrozenError,
    NitrozenCode,
    flatBtn,
} from '@gofynd/nitrozen-vue';

/* Component imports */
import admininlinesvg from '@/components/common/adm-inline-svg.vue';
import authOtpInput from './otp-input.vue';

/* Service imports */
import OrderService from '@/services/orders.service';

/* Helper imports */
import { validatePhone, validateOtp, validateName } from '@/helper/utils';

export default {
    name: 'return-side-panel',
    components: {
        NitrozenButton,
        NitrozenBadge,
        NitrozenCode,
        'adm-inline-svg': admininlinesvg,
        'nitrozen-input': NitrozenInput,
        'auth-otp-input': authOtpInput,
        'nitrozen-error': NitrozenError,
    },
    directives: {
        flatBtn,
    },
    props:{
        errorMsg:{
            type: Boolean,
        }
    },
    data() {
        return {
            mobileno: '',
            firstName:'',
            lastName:'',
            mobileOtp: '',
            showOTPBox:false,
            otpRequestInfo: null,
            resendTimer: {
                mobile: null,
            },
            otpRequestInfoMobile: null,
            invalid: false,
            mobileVerified:false,
            resendTime: {
                mobile: 0,
            },
            customerData:{},
            displayResendOtpText:false,
            onceClicked:false
        };
    },
    computed: {
        validateUsername() {
            if (validatePhone(this.mobile)) {
                return true;
            }
            return false;
        },
    },
    mounted(){
        this.isMobile();
    },
    methods: {
        isPhoneNoValid: validatePhone,
        isOtpValid: validateOtp,
        isNameValid: validateName,
        getFirstName(name){
            if(validateName(name)){
                this.$emit('getFirstName',this.firstName);
            }
        },
        getLastName(){
            this.$emit('getLastName',this.lastName);
        },
        isMobile(){
            if(this.mobileno==''){
                return true
            }
            else{
                return false
            }
        },
        isFormValid() {
            return (this.mobileno && this.mobileno!==''?validatePhone(this.mobileno):true);
        },
        onChange(data) {
            this.mobileOtp = data.value;
        },
        onComplete(value) {
            this.mobileOtp = value;
        },
        resetResendTimer(type = 'mobile') {
            if (this.resendTimer[type]) {
                this.displayResendOtpText=true;
                clearInterval(this.resendTimer[type]);
            }
            this.resendTime[type] = 0;
        },
        sendOtp() {
            if(this.resendTime.mobile || this.onceClicked){
               return; 
            }
            if (this.isFormValid()) {
                this.onceClicked=true;
                const userData = {
                    mobile: parseInt(this.mobileno),
                };
                OrderService.sendOtp(userData)
                    .then(({ data }) => {
                        this.onceClicked=false;
                        this.otpRequestInfo = data.data;
                        if (data.success) {
                            this.showOTPBox=true;
                            this.otpRequestInfoMobile = data.data || null;
                            this.startResendTimer(
                                this.otpRequestInfoMobile.resend_timer,
                                'mobile'
                            );
                        }
                        this.$snackbar.global.showSuccess(
                            `OTP has been sent to your contact details for verification`,
                            3000
                        );
                    })
                    .catch((err) => {
                        console.error("Error in sending the OTP:  ", err);
                        this.showError(err);
                    });
            }
        },
        showError(err) {
            const { message } = err;
            if (this.$snackbar)
                this.$snackbar.global.showError(
                    message || 'Something went wrong',
                    3000
                );
        },
        startResendTimer(time, type = 'mobile') {
            this.displayResendOtpText=false;
            if (this.resendTimer[type]) {
                this.resetResendTimer(type)
            }
            this.resendTimer[type] = setInterval(() => {
                time--;
                this.resendTime[type] = time;
                if (time <= 0) {
                    this.displayResendOtpText=true;
                    return clearInterval(this.resendTimer[type]);
                }
            }, 1000);
        },
        verifyMobileOtp() {
            const data = {
                otp_data:{
                    otp_code: parseInt(this.mobileOtp),
                    request_id: this.otpRequestInfo.request_id,
                    mobile: parseInt(this.mobileno)
                }
            };
            OrderService.verifyOtp(data)
                .then(({ data }) => {
                    this.invalid=false;
                    this.mobileVerified = true;
                    this.customerData=data.data;
                    this.customerData.request_id=this.otpRequestInfo.request_id;
                    this.customerData.verified=true;
                    this.$emit('getCustomerData',this.customerData);
                    this.$snackbar.global.showSuccess('Mobile OTP verified successfully');
                })
                .catch((err) => {
                    this.invalid = true;
                    console.error("Error in verifying the OTP:  ", err);
                    this.showError("OTP Verification failed");
                });
        },
    }

}
</script>

<style scoped lang="less">

 .login-body-container{
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    margin-top: 24px;
    padding: 24px;
    display: flex;
    justify-content: space-between;

    ::v-deep .n-input{
        border-radius: 12px;
    }
    ::v-deep .otp-inputs{
        margin-top: 10px;

        .otp-input{
            justify-content: space-between;
            margin-top: 4px;
            max-width: none;

            div{
                flex: 0;
            }
        }

        input{
            border-radius: 12px;
            padding: 14px 16px;
        }
    }
    .otp-verified{
        font-size: 12px;
        color: #0A5F23;
        display: flex;
        align-items: center;
        margin-top: 12px;

        .check-icon{
            width: 14px;
            height: 14px;
            margin-right: 4px;
        }
    }
    .verify-btn{
        margin-top: 32px;
        width: 100%;
    }
    .invalid-otp{
        font-weight: 400;
        font-size: 12px;
        color: #CD0909;
        margin-top: 5px;
        display: flex;
        align-items: center;
        .alert-icon{
            width: 14px;
            height: 14px;
            margin-right: 3px;

        }
    }
    .login{
        width: 100%;
    }
    .resend-otp{
        margin-top: 10px;
    }

    .disable-color{
        .resend-otp-text{
        color: #9B9B9B;
        }
    }    
    .resend-otp-text{
            font-weight: 700;
            color: #2E31BE;
        }
    .disable {
        pointer-events: none;
        color: #9B9B9B;
    }
    .user-detail{
        width: 100%;
    }
}
.sepration{
    border: 1px solid #E0E0E0;
    margin-right: 15px;
    margin-left: 15px;
}

.last-name{
    margin-top: 9px;
}
@media @mobile{
.login-body-container{
        display: block;
    }
    .sepration{
        margin-top: 15px;
        margin-bottom: 15px;
        margin-right: 0;
        margin-left: 0;
    }
}
</style>
