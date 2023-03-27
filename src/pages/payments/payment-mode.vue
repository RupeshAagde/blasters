<template>
    <div class="mode-of-payment main">
        <div class="page-header-position">
            <adm-page-header
                class="adm-page-header"
                :title="isEditMode ? agregatorDetails.name : 'Mode of Payments'"
                :showBackButton="isEditMode ? true : false"
                @backClick="backRedirect"
            >
                <div class="button-box">
                    <span :class="agregatorDetails.is_active ? 'active-toggle' : 'inactive-toggle'">
                       Payment Gateway Status
                    </span>
                    <nitrozen-toggle
                        class="mr-md"
                        v-model="agregatorDetails.is_active"
                        v-if="isEditMode"
                        @change="updateGatewayStatus(agregatorDetails)"
                    ></nitrozen-toggle>
                </div>
            </adm-page-header>
        </div>
        <div class="main-body payment-mode-options" v-if="!optionLoading">
            <nitrozen-dropdown
                class="dropdown-width"
                id="bussiness-unit"
                :label="'Business Unit'"
                :tooltip="'Choose the Business unit you want to group together'"
                :items="businessUnitList"
                @change="(val) => handleBusinessUnitChange(val)"
                :value="businessUnit"
            />
            <nitrozen-dropdown
                class="dropdown-width"
                id="device"
                :label="'Device'"
                :tooltip="'Choose the Device you want to group together'"
                :items="deviceList"
                @change="(val) => handleDeviceChange(val)"
                :value="device"
            />
            <nitrozen-button
                v-strokeBtn
                :theme="'secondary'"
                @click="copyConfigPanel"
                :disabled="pageError || pageLoading"
                >Copy Config</nitrozen-button
            >
        </div>
        <loader v-if="pageLoading"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="isEditMode ? getPaymentGatewayDetails : getAllPaymentModes"
        ></page-error>
        <div class="main-body payment-mode-details" v-if="!pageLoading">
            <div class="title">Available MOP/Sub MOP Options</div>
            <div class="content">
                <div class="mop-options">
                    <span
                        class="mop-list"
                        v-for="(item, index) in paymentModes"
                        :key="index"
                    >
                        <div
                            v-bind:class="[
                                'mop-container',
                                {
                                    'highlight-selected-mop':
                                        item.id == currentMopDetails.id,
                                },
                            ]"
                            @click="showSubModes(item)"
                        >
                            <div class="card-avatar">
                                <img :src="item.logo.small" alt="Logo" />
                            </div>
                            <div class="card-content-section">
                                <div class="card-content-line-1 full-name">
                                    {{ item.name }}
                                </div>
                                <div class="cust-toggle">
                                    <nitrozen-badge v-if="item.is_active" state="success">
                                        Active
                                    </nitrozen-badge>
                                    <nitrozen-badge v-else>
                                        Inactive
                                    </nitrozen-badge>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
                <div class="sub-mop-options" v-if="subPaymentModes.length">
                    <div class="sub-mop-header"> 
                        <div class="cust-toggle button-box" @click.stop="">
                            <span :class="currentMopDetails.is_active ? 'active-toggle' : 'inactive-toggle'">
                                MOP Status
                            </span>
                            <nitrozen-toggle v-model="currentMopDetails.is_active">
                            </nitrozen-toggle>
                        </div>
                        <nitrozen-button
                            :theme="'secondary'"
                            @click="updateMopDetails"
                            v-flatBtn
                            :disabled="pageError || pageLoading"
                            >Save</nitrozen-button
                        >
                    </div>
                    <span
                        class="sub-mop-list"
                        v-for="(item, index) in subPaymentModes"
                        :key="index"
                    >
                        <div class="sub-mop-container">
                            <div class="card-avatar">
                                <img :src="item.logo" alt="Logo" />
                            </div>
                            <div class="card-content-section">
                                <div class="card-content-line-1 full-name">
                                    {{ item.name }}
                                </div>
                                <div class="cust-toggle" @click.stop="">
                                    <nitrozen-checkbox
                                        v-model="item.is_active"
                                    ></nitrozen-checkbox>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
                <page-empty
                    v-else
                    class="sub-mop-options"
                    :text="'No sub payment modes found'"
                ></page-empty>
            </div>
        </div>
        <div class="side-bar">
            <side-panel
                ref="sidePanel"
                :title="'Copy Configuration'"
                @copyConfiguration="copyConfiguration"
            >
                <template slot="body">
                    <div class="item-form">
                        <div class="form-item">
                            <div class="form-title">Business Unit</div>
                            <nitrozen-dropdown
                                :disabled="true"
                                :items="businessUnitList"
                                v-model="businessUnit"
                            ></nitrozen-dropdown>
                        </div>
                        <div class="form-item">
                            <div class="form-title">Copy Config from</div>
                            <nitrozen-dropdown
                                :disabled="true"
                                :items="deviceList"
                                v-model="device"
                            ></nitrozen-dropdown>
                        </div>

                        <div class="form-item">
                            <div class="form-title">Paste Config in *</div>
                            <nitrozen-dropdown
                                :items="deviceListToCopyConfig"
                                v-model="selectedDeviceListToCopy"
                                :multiple="true"
                                :label="' '"
                                :placeholder="'Select Devices'"
                            ></nitrozen-dropdown>
                            <nitrozen-error
                                v-bind:class="{ visible: errors['to'] }"
                            >
                                {{ errors['to'] }}
                            </nitrozen-error>
                        </div>
                    </div>
                </template>
            </side-panel>
        </div>
        <confirmation-dialog-box
            ref="confirm"
            cancelBtnTitle="No"
            saveBtnTitle="Yes"
            @save="saveCopiedConfiguration()"
        />
    </div>
</template>
<style lang="less" scoped>
.main {
    .button-box {
        display: flex;
        align-items: center;
        .active-toggle {
            color: #2e31be;
            cursor: pointer;
            // display: flex;
            // justify-content: flex-start;
            font-size: 14px;
            font-weight: 600;
        }

        .inactive-toggle {
            color: #9b9b9b;
            cursor: pointer;
            // display: flex;
            // justify-content: flex-start;
            font-size: 14px;
            font-weight: 600;
        }
    }
    .main-body {
        margin: 24px;
        padding: 24px;
        background-color: #ffffff;
    }
    .payment-mode-options {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .dropdown-width {
            width: 40%;
        }
    }
    .title {
        font-size: 20px;
        line-height: 24px;
        font-weight: 600;
        color: @Mako;
        padding-bottom: 24px;
    }
    .content {
        display: flex;
        width: 100%;
        border: 0.5px solid @Mercury;
        .mop-options {
            width: 30%;
            border-right: 0.5px solid @Mercury;
        }
        .sub-mop-options {
            width: 70%;
            padding: 24px;
            .sub-mop-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-bottom: 24px;
            }
            .sub-mop-container {
                border: 0.5px solid @Mercury;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                @media @mobile {
                    display: block;
                }
                .card-avatar {
                    margin: 14px;
                    img {
                        align-items: center;
                        max-height: 40px;
                        max-width: 40px;
                        border-radius: 50%;
                        padding: 4px;
                        background: #e7eeff;
                    }
                }
            }
        }
    }
    .mop-container {
        display: flex;
        align-items: center;
        cursor: pointer;
        @media @mobile {
            display: block;
        }
        .card-avatar {
            margin: 14px;
            img {
                align-items: center;
                max-height: 30px;
                max-width: 30px;
                border-radius: 50%;
                padding: 4px;
                background: #e7eeff;
            }
        }
    }
    .card-content-section {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .cust-toggle {
            margin-right: 14px;
        }
    }
    .highlight-selected-mop {
        background-color: #e7eeff;
    }
}
.mr-md {
    margin-right: 24px;
}
.item-form {
    margin-top: 100px;
    .form-item {
        margin-top: 16px;
    }
    .form-title {
        margin-top: 10px;
        font-weight: 400;
        font-size: 12px;
        margin-bottom: 10px;
    }
}
::v-deep .nitrozen-dialog-backdrop .nitrozen-dialog {
    height: auto;
}
</style>

<script>
import PaymentService from '../../services/gringotts.service';
import PageError from '@/components/common/page-error';
import PageEmpty from '@/components/common/page-empty';
import PageHeader from '@/components/common/layout/adm-page-header.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import ConfirmationDialogBox from '@/components/common/confirmation-dialog.vue';
import SidePanelVue from '@/components/payments/side-panel.vue';
import isEmpty from 'lodash/isEmpty';
import loader from '@/components/common/loader.vue';
import {
    NitrozenDropdown,
    NitrozenButton,
    NitrozenToggleBtn,
    flatBtn,
    strokeBtn,
    NitrozenCheckBox,
    NitrozenError,
    NitrozenBadge,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'mode-of-payment',
    components: {
        'side-panel': SidePanelVue,
        'adm-page-header': PageHeader,
        'nitrozen-button': NitrozenButton,
        'nitrozen-toggle': NitrozenToggleBtn,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-error': NitrozenError,
        ConfirmationDialogBox,
        InlineSvg,
        PageEmpty,
        PageError,
        loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            paymentAggregatorId: this.$route.params.id,
            isEditMode: false,
            pageError: false,
            pageLoading: false,
            optionLoading: false,
            businessUnitList: [],
            deviceList: [],
            device: 'android',
            businessUnit: 'storefront',
            subPaymentModes: [],
            paymentModes: [],
            agregatorDetails: {},
            currentMopDetails: {},
            gatewayDetailsParams: {
                business_unit: '',
                device: '',
            },
            selectedDeviceListToCopy: [],
            deviceListToCopyConfig: [],
            errors: {},
        };
    },
    mounted() {
        this.getBusinessUnitDeviceList();
    },
    methods: {
        getPaymentGatewayDetails() {
            this.pageLoading = true;
            this.pageError = false;
            return PaymentService.getPaymentGatewayDetails(
                this.paymentAggregatorId,
                this.gatewayDetailsParams
            )
                .then((res) => {
                    if (res.data.items.length) {
                        this.agregatorDetails = res.data.items[0];
                        this.paymentModes = this.agregatorDetails.payment_mode;
                        if (this.paymentModes.length) {
                            this.currentMopDetails = this.paymentModes[0];
                            this.subPaymentModes =
                                this.paymentModes[0].sub_payment_mode;
                        }
                    }
                    this.pageLoading = false;
                })
                .catch((error) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.error(error);
                });
        },
        backRedirect() {
            this.$router.back();
        },
        getBusinessUnitDeviceList() {
            this.optionLoading = true;
            PaymentService.getDeviceBusinessUnitList()
                .then(async (res) => {
                    if (Object.keys(res.data.items).length) {
                        this.gatewayDetailsParams['business_unit'] =
                            this.businessUnit;
                        this.gatewayDetailsParams['device'] = this.device;
                    }
                    this.formatList(res.data.items);
                    this.optionLoading = false;
                    if (this.paymentAggregatorId) {
                        this.isEditMode = true;
                        await this.getPaymentGatewayDetails();
                    } else {
                        await this.getAllPaymentModes();
                    }
                })
                .catch((err) => {
                    console.error(
                        'Error getting business units and devices ',
                        err
                    );
                    this.pageError = true;
                    this.optionLoading = false;
                });
        },
        formatList(list) {
            let updatedList = [];
            let updatedObj = {};
            Object.keys(list).forEach((key) => {
                list[key].forEach((item) => {
                    updatedList.push({ text: item.name, value: item.slug });
                });
                updatedObj[key] = [...updatedList];
                updatedList = [];
            });
            this.businessUnitList = updatedObj['business_unit'];
            this.deviceList = updatedObj['device'];
        },
        async updateMopDetails() {
            try{
                this.pageLoading = true;
                this.pageError = false;
                console.log('save method called');
                let payload = {
                    business_unit: this.businessUnit,
                    device: this.device,
                    items: [ this.currentMopDetails ]
                }
                if (this.isEditMode) {
                    const updateDetails = await PaymentService.updateAllPaymentGatewayConfig(this.agregatorDetails.id, payload)    
                    console.log('saved successfully', updateDetails)
                } else {
                    const res = await PaymentService.updateMOP(payload)
                    console.log('saved successfully', res)
                }
                this.pageLoading = true;
                this.$snackbar.global.showSuccess('Payment mode details updated successfully');            
            }catch(err) {
                console.log('err -> ', err)
                this.pageLoading = false;
                this.$snackbar.global.showError('Failed to update payment mode details');
            }
        },
        async handleBusinessUnitChange(type) {
            this.businessUnit = type;
            this.gatewayDetailsParams['business_unit'] = type;
            await this.getPaymentGatewayDetails();
        },
        async handleDeviceChange(value) {
            this.device = value;
            this.gatewayDetailsParams['device'] = value;
            await this.getPaymentGatewayDetails();
        },
        showSubModes(item) {
            this.currentMopDetails = item;
            this.subPaymentModes = item.sub_payment_mode;
        },
        getAllPaymentModes() {
            this.pageLoading = true;
            this.pageError = false;
            return PaymentService.getAllPaymentModes(this.gatewayDetailsParams)
                .then((res) => {
                    console.log(res.data.items.length, 'length')
                    if (res.data.items.length) {
                        console.log('res.data.items => ', res.data.items)
                        this.paymentModes = res.data.items;
                            this.currentMopDetails = this.paymentModes[0];
                            this.subPaymentModes =
                                this.paymentModes[0].sub_payment_modes;
                                console.log('this.subPaymentModes => ', this.subPaymentModes)
                    }
                    this.pageLoading = false;
                })
                .catch((error) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.error('Error getting payment modes: ',error);
                });
        },
        copyConfigPanel() {
            this.deviceListToCopyConfig = this.deviceList.filter(
                (item) => item.value !== this.device
            );
            this.$refs['sidePanel'].openSidePanel();
        },
        updateGatewayStatus(item){
            this.pageLoading = true;
            this.pageError = false;
            let payload = {
                is_active: item.is_active,
                ...this.gatewayDetailsParams
            }
            PaymentService.updateAllPaymentGatewayConfig(item.id, payload)
                .then(res => {
                    this.paymentGatewayList = res.data.items || [];
                    this.pageLoading = false;
                    this.$snackbar.global.showSuccess('Payment gateway status updated');
                })
                .catch(error => {
                    this.pageLoading = false;
                    console.error('Error update gateway status: ',error);
                    this.$snackbar.global.showError('Payment gateway status update failed');
                })
        },
        copyConfiguration(){
            const isValid = this.validateRequiredFormFields()
            if (isValid) {
                this.clearError();    
                this.$refs['confirm'].openConfirmation({
                    title: 'Are you sure?',
                    message:
                        'Click Yes to save the changes'
                });
            }
        },
        async saveCopiedConfiguration(){
            try{
            this.pageLoading = true;
            this.pageError = false;
            let payload = {
                from_config: this.gatewayDetailsParams,
                to_config: {
                    business_unit: this.businessUnit,
                    device: this.selectedDeviceListToCopy
                }
            }
            if (this.isEditMode) {
                payload['aggregator_id'] = this.paymentAggregatorId;
                const res = await PaymentService.saveCopiedConfigurationWithAggregator(payload)
                    console.log('res ==> ',res)
            }else {
                const res = await PaymentService.saveCopiedConfiguration(payload)
                    console.log('res ==> ',res)
            }
            this.pageLoading = false;
            this.$snackbar.global.showSuccess("Config Copied Successfully");
            this.$refs['sidePanel'].close();
            }catch (err) {
                console.log(err) 
                this.pageLoading = false;
                this.$snackbar.global.showError("Failed to Copy Config");
                this.$refs['sidePanel'].close();
            }
        },
        validateRequiredFormFields() {
            let isVaild = true;
                if (isEmpty(this.selectedDeviceListToCopy)) {
                    this.$set(this.errors, "to", "Required field")
                    isVaild = false;
                }
            return isVaild;
        },
        clearError() {
            this.errors = {};
        },
    },
};
</script>