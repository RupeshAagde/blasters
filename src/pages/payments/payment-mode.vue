<template>
    <div class="mode-of-payment main">
        <div class="page-header-position">
            <confirmation-dialog-box
                ref="confirm-gateway-status-update"
                cancelBtnTitle="No"
                saveBtnTitle="Yes"
                @save="updateGatewayStatus(agregatorDetails)"
                @cancel="cancelUpdateGatewayStatus"
            />
            <adm-page-header
                class="adm-page-header"
                :title="isEditMode ? agregatorDetails.name : 'Mode of Payments'"
                :showBackButton="isEditMode ? true : false"
                @backClick="backRedirect"
            >
                <div class="button-box" v-if="isEditMode" v-bind:class="!paymentModes.length ? 'disabled-section':'' ">
                    <span
                        :class="
                            agregatorDetails.is_active
                                ? 'active-toggle'
                                : 'inactive-toggle'
                        "
                    >
                        Payment Gateway Status
                    </span>
                    <nitrozen-toggle
                        class="mr-md"
                        :ref="'update-gateway-status'"
                        v-model="agregatorDetails.is_active"
                        @change="confirmUpdateGatewayStatus"
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
                :ref="'business-unit'"
            />
            <nitrozen-dropdown
                class="dropdown-width"
                id="device"
                :label="'Device'"
                :tooltip="'Choose the Device you want to group together'"
                :items="deviceList"
                @change="(val) => handleDeviceChange(val)"
                :value="device"
                :ref="'device'"
            />
            <nitrozen-button
                v-strokeBtn
                :theme="'secondary'"
                :ref="'copy-config-panel'"
                @click="copyConfigPanel"
                :disabled="pageError || pageLoading || (isEditMode && !agregatorDetails.is_active)"
                >Duplicate Config</nitrozen-button
            >
        </div>
        <loader v-if="pageLoading"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="isEditMode ? getPaymentGatewayDetails() : getAllPaymentModes()"
        ></page-error>
        <div
            class="main-body payment-mode-details"
            v-if="!pageLoading && !pageError"
        >
        <loader v-if="inProgress" class="loading"></loader>
            <div class="title">Available MOP/Sub MOP Options</div>
            <page-empty
                v-if="!paymentModes.length"
                class="sub-mop-options"
                :text="'No payment modes found'"
            ></page-empty>
            <div class="content" v-else v-bind:class="isEditMode && !agregatorDetails.is_active ? 'disabled-section':'' ">
                <div class="mop-options">
                    <div
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
                            :ref="`mop-container-item-${index}`"
                            @click="showSubModes(item)"
                        >
                            <div class="card-avatar">
                                <img :src="item.logos.small" alt="Logo" />
                            </div>
                            <div class="card-content-section">
                                <div class="card-content-line-1 full-name">
                                    {{ item.name }}
                                </div>
                                <div class="cust-toggle">
                                    <nitrozen-badge
                                        v-if="item.is_active"
                                        state="success"
                                    >
                                        Active
                                    </nitrozen-badge>
                                    <nitrozen-badge v-else>
                                        Inactive
                                    </nitrozen-badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sub-mop-options">
                    <div class="sub-mop-header">
                        <div class="sub-mop-header-title">
                            {{currentMopDetails.name}}
                        </div>
                        <div class="sub-mop-header-options">
                        <div class="button-box" @click.stop="">
                            <nitrozen-toggle
                                v-model="currentMopDetails.is_active"
                            >
                            </nitrozen-toggle>
                        </div>
                        <nitrozen-button
                            class="mr-16"
                            :theme="'secondary'"
                            :ref="'update-mop-status'"
                            @click="confirmUpdateMopDetails"
                            v-flatBtn
                            :disabled="pageError || pageLoading"
                            >Save</nitrozen-button
                        >
                        <confirmation-dialog-box
                            ref="confirm-mop-status-update"
                            cancelBtnTitle="No"
                            saveBtnTitle="Yes"
                            @save="updateMopDetails"
                        />
                        </div>
                    </div>
                    <div v-if="subPaymentModes.length" v-bind:class="!currentMopDetails.is_active ? 'disabled-section':'' ">
                        <div
                            class="sub-mop-container"
                            v-for="(item, index) in subPaymentModes"
                            :key="index"
                        >
                            <div class="card-avatar">
                                <img :src="item.logo" alt="Logo" />
                            </div>
                            <div class="card-content-section">
                                <div class="card-content-line-1 full-name">
                                    {{ item.name }}
                                </div>
                                <div class="custom-checkbox" @click.stop="">
                                    <nitrozen-checkbox
                                        v-model="item.is_active"
                                    ></nitrozen-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <page-empty
                    v-bind:class="!currentMopDetails.is_active ? 'disabled-section':'' "
                        v-else
                        class="sub-mop-options"
                        :text="'No sub payment modes found'"
                    ></page-empty>
                </div>
            </div>
        </div>
        <div class="side-bar">
            <side-panel
                ref="sidePanel"
                :title="'Duplicate Configuration'"
                @copyConfiguration="copyConfiguration"
                @clearSelectedDeviceList="cancelCopyConfiguration"
            >
                <template slot="body">
                    <div class="item-form">
                        <div class="form-item">
                            <div class="form-title">Business Unit</div>
                            <nitrozen-input
                                :disabled="true"
                                :value="getSelectedBusinessUnit()"
                            ></nitrozen-input>
                        </div>
                        <div class="form-item">
                            <div class="form-title">Duplicate Config from</div>
                            <nitrozen-input
                                :disabled="true"
                                :value="getSelectedDevice()"
                            ></nitrozen-input>
                        </div>

                        <div class="form-item">
                            <div class="form-title">Duplicate Config in</div>
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
            @save="saveCopiedConfiguration"
            @cancel="cancelCopyConfiguration"
        />
    </div>
</template>
<style lang="less" scoped>
.main {
    .disabled-section {
        pointer-events: none;
        opacity: 0.4;
    }
    .button-box {
        display: flex;
        align-items: center;
        .active-toggle {
            color: @RoyalBlue;
            cursor: pointer;
            // display: flex;
            // justify-content: flex-start;
            font-size: 14px;
            font-weight: 600;
        }

        .inactive-toggle {
            color: @DustyGray2;
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
        background-color: @White;
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
            color: @Mako;
        }
        .sub-mop-options {
            width: 70%;
            .sub-mop-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding: 16px 24px;
                border-bottom: 0.5px solid @Mercury;
            }
            .sub-mop-header-title {
                font-weight: 500;
            }
            .sub-mop-header-options {
                display: flex;
            }
            .sub-mop-container {
                margin: 24px;
                border: 0.5px solid @Mercury;
                border-radius: 8px;
                display: flex;
                align-items: center;
                color: @Mako;
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
        border-left: 6px solid white;
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
        align-items: center;
        width: 100%;
        .cust-toggle {
            margin-right: 22px;
        }
        .custom-checkbox {
            margin-right: 16px;
            margin-top: -20px;
        }
    }
    .highlight-selected-mop {
        background-color: #e7eeff;
        font-weight: 600;
        border-left: 6px solid @RoyalBlue;
    }
}
.mr-16 {
    margin-left: 16px;
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
    NitrozenInput,
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
        'nitrozen-input': NitrozenInput,
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
    computed: {
        paymentAggregatorId() {
            return this.$route.params.id;
        },
    },
    watch: {
        $route(to, from) {
            if (to.name == 'mode-of-payment-gateway') {
                this.isEditMode = true;
            } else {
                this.isEditMode = false;
            }
            this.getBusinessUnitDeviceList();
        },
    },
    data() {
        return {
            isEditMode: this.$route.meta.action === 'edit',
            pageError: false,
            pageLoading: false,
            inProgress: false,
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
        getSelectedBusinessUnit(){
            const selectedBusinessUnit = this.businessUnitList.filter(item => item.value == this.businessUnit)
            return selectedBusinessUnit.length ? selectedBusinessUnit[0].text : this.businessUnit;
        },
        getSelectedDevice(){
            const selectedDevice = this.deviceList.filter(item => item.value == this.device)
            return selectedDevice.length ? selectedDevice[0].text : this.device;
        },
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
                    this.paymentModes = [];
                    console.error(error);
                });
        },
        backRedirect() {
            this.$router.back();
        },
        getBusinessUnitDeviceList() {
            this.optionLoading = true;
            this.pageError = false;
            this.pageLoading = false;
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
            try {
                this.inProgress = true;
                this.pageError = false;
                let payload = {
                    business_unit: this.businessUnit,
                    device: this.device,
                    items: [this.currentMopDetails],
                };
                const isValid = this.validateSubMop();
                if(!isValid){
                    this.inProgress = false;
                    this.$snackbar.global.showError(
                        'Please select atleast one sub payment mode'
                    );
                } else {
                    if (this.isEditMode) {
                        await PaymentService.updateAllPaymentGatewayConfig(
                            this.agregatorDetails.id,
                            payload
                        );
                    } else {
                        await PaymentService.updateMOP(payload);
                    }
                    this.inProgress = false;
                    this.$snackbar.global.showSuccess(
                        'Payment mode details updated successfully'
                    );
                }
            } catch (err) {
                this.inProgress = false;
                this.$snackbar.global.showError(
                    'Failed to update payment mode details'
                );
            }
        },
        validateSubMop(){
            let isValid = true;
            if(this.currentMopDetails.is_active && this.currentMopDetails.sub_payment_mode.length){
                isValid = this.currentMopDetails.sub_payment_mode.some(subMop => {
                    return subMop.is_active
                });
            }
            return isValid;
        },
        async handleBusinessUnitChange(type) {
            this.businessUnit = type;
            this.gatewayDetailsParams['business_unit'] = type;
            if(this.isEditMode){
                await this.getPaymentGatewayDetails();
            } else {
                await this.getAllPaymentModes();
            }
        },
        async handleDeviceChange(value) {
            this.device = value;
            this.gatewayDetailsParams['device'] = value;
            if(this.isEditMode){
                await this.getPaymentGatewayDetails();
            } else {
                await this.getAllPaymentModes();
            }
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
                    if (res.data.items.length) {
                        this.paymentModes = res.data.items;
                        this.currentMopDetails = this.paymentModes[0];
                        this.subPaymentModes =
                            this.paymentModes[0].sub_payment_mode;
                    }
                    this.pageLoading = false;
                })
                .catch((error) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.error('Error getting payment modes: ', error);
                });
        },
        copyConfigPanel() {
            this.deviceListToCopyConfig = this.deviceList.filter(
                (item) => item.value !== this.device
            );
            this.$refs['sidePanel'].openSidePanel();
        },
        updateGatewayStatus(item) {
            this.inProgress = true;
            this.pageError = false;
            let payload = {
                is_active: item.is_active,
                ...this.gatewayDetailsParams,
            };
            PaymentService.updateAllPaymentGatewayConfig(item.id, payload)
                .then((res) => {
                    this.paymentGatewayList = res.data.items || [];
                    this.inProgress = false;
                    this.$snackbar.global.showSuccess(
                        'Payment gateway status updated'
                    );
                })
                .catch((error) => {
                    this.inProgress = false;
                    console.error('Error update gateway status: ', error);
                    this.$snackbar.global.showError(
                        'Payment gateway status update failed'
                    );
                });
        },
        cancelUpdateGatewayStatus(e){
            this.agregatorDetails.is_active = e.data.is_active || false
        },
        cancelCopyConfiguration(){
            this.selectedDeviceListToCopy = []
        },
        confirmUpdateGatewayStatus() {
            this.$refs['confirm-gateway-status-update'].openConfirmation({
                title: 'Save Changes?',
                message: 'Click Yes to save the changes',
                height: '271px',
                dismissible: false,
                data: {
                    is_active: !this.agregatorDetails.is_active
                }
            });
        },
        confirmUpdateMopDetails() {
            this.$refs['confirm-mop-status-update'].openConfirmation({
                title: 'Save Changes?',
                message: 'Click Yes to save the changes',
                height: '271px',
            });
        },
        copyConfiguration() {
            const isValid = this.validateRequiredFormFields();
            if (isValid) {
                this.clearError();
                this.$refs['confirm'].openConfirmation({
                    title: 'Save Changes?',
                    message: 'Click Yes to save the changes',
                    height: '271px',
                });
            }
        },
        async saveCopiedConfiguration() {
            try {
                this.pageLoading = true;
                this.pageError = false;
                let payload = {
                    from_config: this.gatewayDetailsParams,
                    to_config: {
                        business_unit: this.businessUnit,
                        device: this.selectedDeviceListToCopy,
                    },
                };
                if (this.isEditMode) {
                    payload['aggregator_id'] = this.paymentAggregatorId;
                    await PaymentService.saveCopiedConfigurationWithAggregator(payload);
                } else {
                    await PaymentService.saveCopiedConfiguration(payload);
                }
                this.pageLoading = false;
                this.selectedDeviceListToCopy = [];
                this.$snackbar.global.showSuccess('Config Duplicated Successfully');
                this.$refs['sidePanel'].close();
            } catch (err) {
                this.pageLoading = false;
                this.$snackbar.global.showError('Failed to Duplicate Config');
                this.$refs['sidePanel'].close();
            }
        },
        validateRequiredFormFields() {
            let isVaild = true;
            if (isEmpty(this.selectedDeviceListToCopy)) {
                this.$set(this.errors, 'to', 'Required field');
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