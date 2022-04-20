'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentDpTracking from '@/pages/orders/shipment-dp-tracking-dialog.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import TRACKING_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';
import flushPromises from "flush-promises";
const mock = new MockAdapter(axios);
let wrapper, router, localVue
describe('ShipmentDpTracking', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentDpTracking }
            ]
        })
        router.push(`/orders/list/`);
        // mock.onGet(URLS.SHIPMENT_DP_TRACKING()).reply(200, TRACKING_DATA)
        const shipment_id = ORDER_LIST_DATA.items[0].shipments[0].id;
        wrapper = shallowMount(ShipmentDpTracking, {
            localVue,
            router,
            propsData: { shipment_id },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('ShipmentDpTracking renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    // it('ShipmentDpTracking api', async() => {
    //     wrapper.vm.shipmentDPTracking();
    //     await flushPromises();
    //     expect(wrapper.vm.isLoading).toBe(false)
    // });
});