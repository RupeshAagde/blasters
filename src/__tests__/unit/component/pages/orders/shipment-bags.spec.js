'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentBags from '@/pages/orders/shipment-bags.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import ACTIVITY_HISTORY from './fixtures/activity-history.json';
import VueRouter from 'vue-router';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import flushPromises from "flush-promises";

let wrapper, router, localVue;
const mock = new MockAdapter(axios);
describe('ShipmentBags', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentBags }
            ]
        });
        mock.reset();
        mock.onGet(URLS.BAG_ACTIVITY_STATUS()).reply(200, ACTIVITY_HISTORY)
        router.push(`/orders/list/`);
        const bags = ORDER_LIST_DATA.items[0].shipments[0].bags;
        const orderDomain = 'https://fynd.hostx0.de/';
        const isNew = true;
        wrapper = shallowMount(ShipmentBags, {
            localVue,
            router,
            propsData: { bags, orderDomain, isNew },
            computed: {
                productLink: () => 'https://fynd.hostx0.de/product/tv-set'
            }
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
        expect(wrapper.emitted().input).toBeTruthy()
    });

    it('selectionChange', async() => {
        wrapper.vm.selectionChange()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().selectionChange).toBeTruthy()
    });

    it('should return the correct time', async() => {
        expect(wrapper.vm.toDateTimeString('4/12/2022')).toBe('16 days ago');
    })
});
