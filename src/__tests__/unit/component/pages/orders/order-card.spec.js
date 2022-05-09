'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import OrderCard from '@/pages/orders/order-card.vue';
import DeliveryAddress from '@/pages/orders/delivery-address.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';

let wrapper, router, localVue;

describe('Order Card', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: OrderCard }
            ]
        });
        router.push(`/orders/list/`);
        const order = ORDER_LIST_DATA.items[0];
        const isDrawerView = false;
        const orderDomain = 'https://fynd.hostx0.de/';
        wrapper = shallowMount(OrderCard, {
            localVue,
            router,
            propsData: { order, orderDomain, isDrawerView},
            computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items
            },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });

    it('will alert the user if text is copied', async() => {
        let showInfoMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showInfo');

        let element = wrapper.find('.title');
        element.trigger('click');

        expect(showInfoMethod).toHaveBeenCalled();
    });

    it('should emit the call event if user clicks on call', async() => {
        let element = wrapper.findComponent(DeliveryAddress);
        element.vm.$emit('call');

        expect(wrapper.emitted).toHaveProperty('call');
    })
});