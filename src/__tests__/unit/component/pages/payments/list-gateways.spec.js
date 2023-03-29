import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import PaymentGatewayList from "./../../../../../pages/payments/list-gateways.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import { listGateways, emptyListGateways} from "./fixtures/list-mock";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router

describe('Mounted List Gateways Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.FETCH_PAYMENT_GATEWAY_LIST()).reply(200, listGateways);
        router = new VueRouter({
            routes: [{
                path: '/administrator/payments/gateways',
                component: PaymentGatewayList
            }]
        })
        router.push('/administrator/payments/gateways');
        wrapper = mount(PaymentGatewayList, {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('Exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    });

    it('List data', async () => {
        expect(wrapper.vm.paymentGatewayList.length).toBe(5)
    });

    it('Empty list', async () => {
        mock.onGet(URLS.FETCH_PAYMENT_GATEWAY_LIST()).reply(200, emptyListGateways);
        wrapper = mount(PaymentGatewayList, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.paymentGatewayList.length).toBe(0)
    });

    it('List data error', async () => {
        mock.onGet(URLS.FETCH_PAYMENT_GATEWAY_LIST()).reply(500, {error: true});
        wrapper = mount(PaymentGatewayList, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true)
    });

    it('Search payment gateway list by name', async () => {
        let searchTxtBox = wrapper.findComponent({ ref: 'search-payment-gateway' });
        searchTxtBox.vm.$emit("input", "simpl");
        await new Promise(resolve => setTimeout(resolve, 500));
        expect(wrapper.vm.searchText).toBe("simpl");
        expect(wrapper.vm.paymentGatewayList.length).toBe(1);
    });

    it('Search empty payment gateway', async () => {
        let searchTxtBox = wrapper.findComponent({ ref: 'search-payment-gateway' });
        searchTxtBox.vm.$emit("input", "     ");
        expect(wrapper.vm.paymentGatewayList.length).toBe(5);
    });

    it('Navigate to edit payment gateway', async () => {
        wrapper.vm.editPaymentGateway(listGateways.items[0]);
        expect(router.currentRoute.path).toBe(`/administrator/payments/gateways/edit/${listGateways.items[0].id}`);
    });
})