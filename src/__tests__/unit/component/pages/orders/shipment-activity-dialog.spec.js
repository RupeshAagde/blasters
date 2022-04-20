'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentActivityDialog from '@/pages/orders/shipment-activity-dialog.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import ACTIVITY_HISTORY from './fixtures/activity-history.json';
import VueRouter from 'vue-router';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flushPromises from "flush-promises";

let wrapper, router, localVue
const mock = new MockAdapter(axios);
describe('Shipment Activity Dialog', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentActivityDialog }
            ]
        })
        mock.reset();
        mock.onGet(URLS.BAG_ACTIVITY_STATUS()).reply(200, ACTIVITY_HISTORY)
        router.push(`/orders/list/`);
        const shipment_id = ORDER_LIST_DATA.items[0].shipments[0].id;
        const bag_id = ORDER_LIST_DATA.items[0].shipments[0].bags[0].id.toString();
        wrapper = shallowMount(ShipmentActivityDialog, {
            localVue,
            router,
            propsData: { shipment_id, bag_id },
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
        
    });
    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    it('set data', async() => {
        expect(wrapper.vm.activity_history.length).toBe(2)
    });

});