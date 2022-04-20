'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import OrderListItem from '@/pages/orders/order-list-item.vue';
import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';
import MARKETPLACE_DATA from './fixtures/marketplace-data.json';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import VueRouter from 'vue-router';

let wrapper, router, localVue;
describe('OrderListItem', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: OrderListItem }
            ]
        });
        router.push(`/orders/list`);
        const data = ORDER_LIST_DATA.items[0];
        wrapper = shallowMount(OrderListItem, {
            localVue,
            router,
            propsData: { data },
            computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
                registeredMarketplaces: () => MARKETPLACE_DATA
            },
            mocks: {
                $basePath: ''
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

    it('getErrorImage', async() => {
        wrapper.vm.getErrorImage(ORDER_LIST_DATA.items[0].shipments[0])
        await wrapper.vm.$nextTick()
    });

    it('naivgateToOrder', async() => {
        wrapper.vm.naivgateToOrder({preventDefault:()=>{},stopPropagation:()=>{}},ORDER_LIST_DATA.items[0].shipments[0].id)
        await wrapper.vm.$nextTick();
        expect(router.currentRoute.path).toBe('/order/FY60364D0D01DC690BD6/shipments');
    });
});