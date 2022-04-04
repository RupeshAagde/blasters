<template>
    <nitrozen-dialog class="bank-details" ref="bankDetails" :title="title">
        <template slot="body">
            <div class="bank-form">
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="accountNumber.value"
                        placeholder="Enter Account Number"
                        label="Account Number*"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!accountNumber.value && accountNumber.showerror"
                        >{{ accountNumber.errortext }}</nitrozen-error
                    >
                </div>
                <div class="bank-form-field">
                    <div class="ifsc-code">
                        <nitrozen-input
                            class="ifsc-input"
                            v-model="ifscCode.value"
                            placeholder="Enter IFSC Code"
                            label="IFSC Code *"
                        ></nitrozen-input>
                        <nitrozen-button
                            class="ifsc-btn"
                            theme="secondary"
                            :disabled="ifscCode.value.length != 11"
                            :showProgress="ifscLoader"
                            v-flatBtn
                            @click="validateIFSC"
                            >Validate</nitrozen-button
                        >
                    </div>
                    <nitrozen-error v-if="ifscCode.showerror">{{
                        ifscCode.errortext
                    }}</nitrozen-error>
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="bankName.value"
                        placeholder="Enter Bank Name"
                        label="Bank Name*"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!bankName.value && bankName.showerror"
                        >{{ bankName.errortext }}</nitrozen-error
                    >
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="branchName.value"
                        placeholder="Enter Branch Name"
                        label="Branch Name*"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!branchName.value && branchName.showerror"
                        >{{ branchName.errortext }}</nitrozen-error
                    >
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="name.value"
                        placeholder="Enter Name"
                        label="Name*"
                    ></nitrozen-input>
                    <nitrozen-error v-if="!name.value && name.showerror">{{
                        name.errortext
                    }}</nitrozen-error>
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="email.value"
                        placeholder="Enter Email"
                        label="Email*"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!validateEmail(email.value) && email.showerror"
                        >{{ email.errortext }}</nitrozen-error
                    >
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        v-model="mobile.value"
                        placeholder="Enter Mobile"
                        label="Mobile*"
                    ></nitrozen-input>
                    <nitrozen-error v-if="!mobile.value && mobile.showerror">{{
                        mobile.errortext
                    }}</nitrozen-error>
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        type="textarea"
                        placeholder="Enter Address"
                        label="Address*"
                        v-model="address.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!address.value && address.showerror"
                    ></nitrozen-error>
                </div>
                <div class="bank-form-field">
                    <nitrozen-input
                        type="textarea"
                        placeholder="Enter Comment"
                        label="Comment"
                        v-model="comment.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!comment.value && comment.showerror"
                    ></nitrozen-error>
                </div>
            </div>
        </template>
        <template slot="footer">
            <nitrozen-button
                theme="secondary"
                :showProgress="inProgress"
                v-flat-btn
                @click="saveBank"
                :disabled="shipmentData && shipmentData.status.status == 'refund_completed'"
            >
                Save
            </nitrozen-button>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenInput,
    NitrozenError,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader.vue';
import { validateEmail } from '@/helper/utils';
import OrderService from '@/services/orders.service';
export default {
    name: 'bank-details',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenInput,
        NitrozenError,
        loader,
    },
    props: {
        title: {
            type: String,
            default: 'Bank Details',
        },
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            userData: null,
            shipmentData: null,
            deliveryAddress: null,
            orderId: '',
            applicationId: '',
            accountNumber: this.getInitialValue(''),
            bankName: this.getInitialValue(''),
            ifscCode: this.getInitialValue(''),
            branchName: this.getInitialValue(''),
            name: this.getInitialValue(''),
            mobile: this.getInitialValue(''),
            comment: this.getInitialValue(''),
            address: this.getInitialValue(''),
            email: this.getInitialValue(''),
            ifscLoader: false,
            inProgress: false,
            validIfsc: false,
        };
    },
    mounted() {},
    methods: {
        validateEmail,
        open(data) {
            this.shipmentData = data.shipment;
            this.userData = data.user;
            this.orderId = data.order_id;
            this.applicationId = data.application_id;
            this.deliveryAddress = data.delivery_address;
            this.name.value = `${this.userData.first_name} ${this.userData.last_name}`;
            this.email.value = this.userData.email;
            this.mobile.value = this.userData.mobile || '';
            const customer_address = [
                this.deliveryAddress.address1,
                this.deliveryAddress.address2,
                this.deliveryAddress.area,
                this.deliveryAddress.city,
                this.deliveryAddress.state,
                this.deliveryAddress.country,
                this.deliveryAddress.pincode,
            ];
            this.address.value = customer_address.filter((sa) => sa).join(', ');
            this.$refs.bankDetails.open({
                showCloseButton: true,
                width: '600px',
                height: '750px',
            });
            this.getBankDetails();
        },
        close() {
            this.$refs.bankDetails.close();
            this.$emit('close');
        },
        getInitialValue(value = '') {
            return {
                value,
                showerror: false,
                errortext: '',
            };
        },
        validateForm() {
            let formValid = true;
            formValid = this.checkEmpty('accountNumber') && formValid;
            formValid = this.checkEmpty('bankName') && formValid;
            formValid = this.checkEmpty('ifscCode') && formValid;
            formValid = this.checkEmpty('branchName') && formValid;
            formValid = this.checkEmpty('name') && formValid;
            formValid = this.checkEmpty('email') && formValid;
            formValid = this.checkEmpty('mobile') && formValid;
            formValid = this.checkEmpty('address') && formValid;
            if (
                this.ifscCode.value.trim() != '' &&
                this.ifscCode.value.trim().length == 11
            )
                formValid = this.validIfsc && formValid;
            return formValid;
        },
        checkEmpty(key) {
            const emptyErorrs = {
                accountNumber: 'Account number is required',
                bankName: 'Bank Name is required',
                ifscCode: 'IFSC Code is required',
                branchName: 'Branch Name is required',
                name: 'Name is required',
                address: 'Mobile is required',
                mobile: 'Address is required',
                email: 'Email is required',
            };
            if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            } else if (key == 'ifscCode' && this[key].value.trim() != '') {
                if (this[key].value.trim().length != 11) {
                    this[key].showerror = true;
                    this[key].errortext = 'IFSC Code must be of 11 character';
                    return false;
                } else {
                    if (!this.validIfsc) {
                        this[key].showerror = true;
                        this[key].errortext = 'Invalid IFSC Code';
                        return false;
                    }
                }
            } else if (
                key == 'email' &&
                this[key].value.trim() != '' &&
                !validateEmail(this[key].value.trim())
            ) {
                this[key].showerror = true;
                this[key].errortext = 'Email is invalid';
                return false;
            }
            this[key].showerror = false;
            return true;
        },
        saveBank() {
            if (!this.validateForm()) {
                return;
            }
            const obj = this.getFormData();
            this.inProgress = true;
            OrderService.saveBankDetails(obj, this.applicationId)
                .then(({ data }) => {
                    this.inProgress = false;
                    if (data.success) {
                        this.$snackbar.global.showSuccess(
                            data.message || 'Bank Account Added'
                        );
                        this.close();
                    }
                    console.log(data);
                })
                .catch((err) => {
                    this.inProgress = false;
                    this.$snackbar.global.showError(
                        err.response.data.message || 'Something went wrong!'
                    );
                    console.log(err, err.response);
                });
        },
        validateIFSC() {
            const payload = {
                ifsc_code: this.ifscCode.value,
            };
            this.ifscLoader = true;
            OrderService.validateIFSC(payload)
                .then(({ data }) => {
                    this.ifscLoader = false;
                    this.validIfsc = true;
                    this.bankName.value = data.bank_name;
                    this.branchName.value = data.branch_name;
                    this.ifscCode.showerror = false;
                    this.ifscCode.errortext = '';
                })
                .catch((err) => {
                    this.ifscLoader = false;
                    this.validIfsc = false;
                    if (err.response && err.response.status == 400) {
                        this.ifscCode.showerror = true;
                        this.ifscCode.errortext = err.response.data.message;
                    }
                });
        },
        getFormData() {
            const obj = {
                details: {
                    account_no: this.accountNumber.value,
                    bank_name: this.bankName.value,
                    ifsc_code: this.ifscCode.value,
                    branch_name: this.branchName.value,
                    account_holder: this.name.value,
                    mobile: this.mobile.value,
                    comment: this.comment.value,
                    address: this.address.value,
                    email: this.email.value,
                },
                order_id: this.orderId,
                shipment_id: this.shipmentData.id,
                transfer_mode: 'bank',
                delights: false,
            };
            return obj;
        },
        getBankDetails() {
            const payload = {
                order_id: this.orderId,
            };
            OrderService.getBankDetails(payload, this.applicationId)
                .then(({ data }) => {
                    console.log(data, 'dataaaaaaa');
                    if (
                        data &&
                        data.beneficiaries &&
                        data.beneficiaries.length
                    ) {
                        this.name.value = data.beneficiaries[0].account_holder;
                        this.email.value = data.beneficiaries[0].mobile;
                        this.mobile.value = data.beneficiaries[0].email;
                        this.ifscCode.value = data.beneficiaries[0].ifsc_code;
                        this.accountNumber.value = data.beneficiaries[0].account_no;
                        this.bankName.value = data.beneficiaries[0].bank_name;
                        this.branchName.value = data.beneficiaries[0].branch_name;
                        this.comment.value = data.beneficiaries[0].comment;
                        this.address.value = data.beneficiaries[0].address;
                    }
                })
                .catch((err) => {
                    console.log(err.response);
                });
        },
    },
};
</script>

<style lang="less" scoped>
.bank-form {
    .bank-form-field {
        padding-bottom: 12px;
        .ifsc-code {
            display: flex;
            align-items: center;
            .ifsc-input {
                width: calc(80% - 12px);
            }
            .ifsc-btn {
                width: 20%;
                margin: 21px 0px 0px 12px;
            }
        }
    }
}
</style>
