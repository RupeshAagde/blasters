'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import PriceDetail from '@/pages/orders/prices-detail.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';

let wrapper, router, localVue;
describe('PriceDetail', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list', component: PriceDetail }
            ]
        });
        router.push(`/orders/list`);
        const shipment = ORDER_LIST_DATA.items[0].shipments[0];
        wrapper = shallowMount(PriceDetail, {
            localVue,
            router,
            propsData: { shipment },
            computed: {
                isloggedIn: () => true
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('Price list item renders', async() => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    });
});