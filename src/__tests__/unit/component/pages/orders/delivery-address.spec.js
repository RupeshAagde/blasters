'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import DeliveryAddress from '@/pages/orders/delivery-address.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import ACCESS_MOCK_DATA from './fixtures/access-data.json';

let wrapper, router, localVue
describe('OrderListItem', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: DeliveryAddress }
            ]
        })
        router.push(`/orders/list/`);
        const address = ORDER_LIST_DATA.items[0].delivery_address;
        wrapper = shallowMount(DeliveryAddress, {
            localVue,
            router,
            propsData: { address },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
            }
        });
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Order list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});