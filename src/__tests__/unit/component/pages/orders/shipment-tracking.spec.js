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
            propsData: { tracking, shipment_id, awb: '5046512003245'},
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    it('will alert the user if AWB is copied', async() => {
        let showInfoMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showInfo');

        let element = wrapper.find('.awb-text');
        element.trigger('click');

        expect(showInfoMethod).toHaveBeenCalled();
    });

    it('should open the shipment tracking', async() => {
        window.open = jest.fn();

        let element = wrapper.find('.dp-tracking');
        element.trigger('click');

        expect(window.open).toHaveBeenCalled();
    })
});