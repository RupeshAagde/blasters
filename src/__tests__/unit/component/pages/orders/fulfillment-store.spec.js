'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import FullfilmentStore from '@/pages/orders/fullfillment-store.vue';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';
import ACCESS_MOCK_DATA from './fixtures/access-data.json';

let wrapper, router, localVue;
describe('Fullfilment Store', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);

        router = new VueRouter({
            routes: [
                { path: '/orders/list', component: FullfilmentStore }
            ]
        });
        router.push(`/orders/list`);
        const address = ORDER_LIST_DATA.items[0].shipments[0].fulfilling_store;

        wrapper = shallowMount(FullfilmentStore, {
            localVue,
            router,
            propsData: { address },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
            }
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