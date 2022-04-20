'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import ShipmentTracking from '@/pages/orders/shipment-tracking.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';

let wrapper, router, localVue
describe('Fullfilment Store', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: ShipmentTracking }
            ]
        })
        router.push(`/orders/list/`);
        const tracking = ORDER_LIST_DATA.items[0].shipments[0].tracking_details;
        const shipment_id = ORDER_LIST_DATA.items[0].shipments[0].id;
        wrapper = shallowMount(ShipmentTracking, {
            localVue,
            router,
            propsData: { tracking, shipment_id },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});