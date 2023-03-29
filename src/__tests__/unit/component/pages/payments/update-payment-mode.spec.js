import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import PaymentModeUpdate from "@/pages/payments/payment-mode.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "@/services/domain.service"
import { getPaymentGatewayDetails, getDeviceBusinessUnitList } from "./fixtures/payment-mode";
import admpageheader from '@/components/common/layout/adm-page-header.vue';
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router


describe('Mounted Payment Mode With Aggregator Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.CRUD_PAYMENT_GATEWAY_DETAILS('1')).reply(200, getPaymentGatewayDetails);
        mock.onGet(URLS.FETCH_BUSINESS_UNIT_DEVICE_LIST()).reply(200, getDeviceBusinessUnitList);
        
        // mock.onPut(URLS.SAVE_INTEGRATION('5e5608bf4265cf7198d1e58f')).reply(200, MOCK_DATA.items[1]);
        // mock.onPost(URLS.ADD_INTEGRATION()).reply(200, MOCK_DATA.items[1]);
        // mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, COMPANY_MOCK_DATA);
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

    // it('save form', async () => {
    //     wrapper.vm.saveForm();
    //     await flushPromises();
    //     expect(wrapper.vm.inProgress).toBe(false);
    // })
})