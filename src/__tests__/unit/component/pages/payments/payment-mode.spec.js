import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import PaymentModeUpdate from "@/pages/payments/payment-mode.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "@/services/domain.service"
import { getPaymentGatewayDetails, getDeviceBusinessUnitList, paymentMode, updateGatewayStatus, allPaymentMode, copyConfig, emptyUpdateGatewayStatus } from "./fixtures/payment-mode";
import admpageheader from '@/components/common/layout/adm-page-header.vue';
import flushPromises from "flush-promises";
const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router
const gatewayDetailsParams =  {business_unit: "storefront", device: "android"}

describe('Mounted Payment Mode With Aggregator Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(200, getPaymentGatewayDetails);
        mock.onGet(URLS.FETCH_BUSINESS_UNIT_DEVICE_LIST()).reply(200, getDeviceBusinessUnitList);
        mock.onPatch(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(200, updateGatewayStatus);
        mock.onPatch(URLS.COPY_CONFIGURATION_AGGREGATOR()).reply(200, copyConfig);
        router = new VueRouter({
            routes: [{
                path: '/administrator/payments/gateways/edit/:id',
                component: PaymentModeUpdate
            }]
        })
        router.push('/administrator/payments/gateways/edit/1');
        wrapper = mount(PaymentModeUpdate, {
            localVue,
            router,
        })
        wrapper.vm.isEditMode = true;
        await flushPromises();
    });
    it('Exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot()
    });

    it('List business unit and devices', async () => {
        expect(wrapper.vm.businessUnitList.length).toBe(3)
        expect(wrapper.vm.deviceList.length).toBe(3)
    });

    it('Error case for get device and business unit list', async () => {
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(500, {error: true});
        mock.onGet(URLS.FETCH_BUSINESS_UNIT_DEVICE_LIST()).reply(500, {error: true});
        wrapper = mount(PaymentModeUpdate, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true)
    });

    it('Error case for get payment gateway details', async () => {
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(500, {error: true});
        wrapper = mount(PaymentModeUpdate, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true)
    });

    it('On back click it will route back to the payment gateway page', async() => {
        let pageHeader = wrapper.findComponent(admpageheader)
        pageHeader.vm.$emit('backClick');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.$router.currentRoute.fullPath).toBe(`/administrator/payments/gateways/edit/1`);
    });

    it('Change business unit', async () => {
        wrapper.vm.isEditMode = true;
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1'), { params: gatewayDetailsParams }).reply(200, getPaymentGatewayDetails);
        let businessUnitDropdown = wrapper.findComponent({ ref: 'business-unit' });
        businessUnitDropdown.vm.$emit("change", "storefront");
        expect(wrapper.vm.businessUnit).toBe("storefront");
    });

    it('Change device', async () => {
        wrapper.vm.isEditMode = true;
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1'), { params: gatewayDetailsParams }).reply(200, getPaymentGatewayDetails);
        let deviceDropdown = wrapper.findComponent({ ref: 'device' });
        deviceDropdown.vm.$emit("change", "android");
        expect(wrapper.vm.device).toBe("android");
    });

    it('Copy configuration', async () => {
        wrapper.vm.businessUnit = "storefront";
        wrapper.vm.gatewayDetailsParams = { ...gatewayDetailsParams };
        wrapper.vm.selectedDeviceListToCopy = ['ios']
        let copyConfigPanel = wrapper.findComponent({ ref: 'copy-config-panel' })
        copyConfigPanel.vm.$emit('click');
        let sidePanel = wrapper.findComponent({ ref: 'sidePanel' });
        sidePanel.vm.$emit("copyConfiguration");
        expect(wrapper.vm.errors).toMatchObject({});
        wrapper.vm.$refs["confirm"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Update payment gateway status', async () => {
        wrapper.vm.isEditMode = true;
        let gatewayStatusToggle = wrapper.findComponent({ ref: 'update-gateway-status' });
        wrapper.vm.agregatorDetails.is_active = true
        gatewayStatusToggle.vm.$emit("change");
        // expect(wrapper.vm.agregatorDetails.is_active).toBe(false);
        wrapper.vm.$refs["confirm-gateway-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);

    });

    it('Error while update payment gateway status', async () => {
        mock.onPatch(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(500, { error: true });
        wrapper.vm.isEditMode = true;
        await flushPromises();
        let gatewayStatusToggle = wrapper.findComponent({ ref: 'update-gateway-status' });
        wrapper.vm.agregatorDetails.is_active = true
        gatewayStatusToggle.vm.$emit("change");
        wrapper.vm.$refs["confirm-gateway-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Empty response for update payment gateway status', async () => {
        mock.onPatch(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(200, emptyUpdateGatewayStatus);
        wrapper.vm.isEditMode = true;
        await flushPromises();
        let gatewayStatusToggle = wrapper.findComponent({ ref: 'update-gateway-status' });
        wrapper.vm.agregatorDetails.is_active = true
        gatewayStatusToggle.vm.$emit("change");
        wrapper.vm.$refs["confirm-gateway-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Update payment mode status', async () => {
        wrapper.vm.isEditMode = true;
        let mopSaveButton = wrapper.findComponent({ ref: 'update-mop-status' });
        wrapper.vm.agregatorDetails.is_active = true
        mopSaveButton.vm.$emit("click");
        wrapper.vm.$refs["confirm-mop-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Error while update payment mode status', async () => {
        mock.onPatch(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(500, { error: true });
        wrapper.vm.isEditMode = true;
        await flushPromises();
        let mopSaveButton = wrapper.findComponent({ ref: 'update-mop-status' });
        wrapper.vm.agregatorDetails.is_active = true
        mopSaveButton.vm.$emit("click");
        wrapper.vm.$refs["confirm-mop-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    // it('Highlight payment option to show sub payment mode', async () => {
    //     wrapper.vm.isEditMode = true;
    //     await flushPromises();
    //     console.log('page loading ==> ',wrapper.vm.paymentModes);
    //     let highlightPaymentOption = wrapper.findComponent({ ref: 'mop-container-item-1' });
    //     console.log('highlightPaymentOption ==> ',highlightPaymentOption)
    //     highlightPaymentOption.vm.$emit("click", paymentMode);
    //     expect(wrapper.vm.subPaymentModes.length).toBe(1);
    // });
})

describe('Mounted Payment Mode Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.FETCH_BUSINESS_UNIT_DEVICE_LIST()).reply(200, getDeviceBusinessUnitList);
        mock.onGet(URLS.CRUD_PAYMENT_MODE(), { params: {...gatewayDetailsParams} }).reply(200, allPaymentMode);
        mock.onPatch(URLS.COPY_CONFIGURATION()).reply(200, copyConfig);
        mock.onPatch(URLS.CRUD_PAYMENT_MODE()).reply(200, allPaymentMode);

        router = new VueRouter({
            routes: [{
                path: '/administrator/payments/mop',
                component: PaymentModeUpdate
            }]
        })
        router.push('/administrator/payments/mop');
        wrapper = mount(PaymentModeUpdate, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('Exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot()
    });

    it('List business unit and devices', async () => {
        expect(wrapper.vm.businessUnitList.length).toBe(3)
        expect(wrapper.vm.deviceList.length).toBe(3)
    });
    
    it('Error case for get all payment modes', async () => {
        mock.onGet(URLS.CRUD_PAYMENT_MODE(), { params: { ...gatewayDetailsParams } }).reply(500, {error: true});
        wrapper = mount(PaymentModeUpdate, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true)
    });

    it('Change business unit', async () => {
        let businessUnitDropdown = wrapper.findComponent({ ref: 'business-unit' });
        businessUnitDropdown.vm.$emit("change", "storefront");
        expect(wrapper.vm.businessUnit).toBe("storefront");
    });

    it('Change device', async () => {
        let deviceDropdown = wrapper.findComponent({ ref: 'device' });
        deviceDropdown.vm.$emit("change", "android");
        expect(wrapper.vm.device).toBe("android");
    });

    it('Copy configuration', async () => {
        wrapper.vm.businessUnit = "storefront";
        wrapper.vm.gatewayDetailsParams = { ...gatewayDetailsParams };
        wrapper.vm.selectedDeviceListToCopy = ['ios']
        let sidePanel = wrapper.findComponent({ ref: 'sidePanel' });
        sidePanel.vm.$emit("copyConfiguration");
        expect(wrapper.vm.errors).toMatchObject({});
        wrapper.vm.$refs["confirm"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Error Copy configuration', async () => {
        mock.onPatch(URLS.COPY_CONFIGURATION()).reply(500, { error: true });
        wrapper.vm.businessUnit = "storefront";
        wrapper.vm.gatewayDetailsParams = { ...gatewayDetailsParams };
        wrapper.vm.selectedDeviceListToCopy = ['ios']
        let sidePanel = wrapper.findComponent({ ref: 'sidePanel' });
        sidePanel.vm.$emit("copyConfiguration");
        expect(wrapper.vm.errors).toMatchObject({});
        wrapper.vm.$refs["confirm"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

    it('Validate copy configuration', async () => {
        let sidePanel = wrapper.findComponent({ ref: 'sidePanel' });
        sidePanel.vm.$emit("copyConfiguration");
        expect(wrapper.vm.errors).toMatchObject({'to': 'Required field'});
    });

    it('Update payment mode status', async () => {
        let mopSaveButton = wrapper.findComponent({ ref: 'update-mop-status' });
        wrapper.vm.agregatorDetails.is_active = true
        mopSaveButton.vm.$emit("click");
        wrapper.vm.$refs["confirm-mop-status-update"].$emit("save");
        await flushPromises();
        expect(wrapper.vm.pageLoading).toBe(false);
    });

})