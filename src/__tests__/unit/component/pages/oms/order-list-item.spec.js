'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import OrderListItem from '@/pages/oms/order-list-item.vue';
import OrderDetails from '@/pages/oms/order-details/index.vue';

/* Mock imports */
import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';
import MARKETPLACE_DATA from './fixtures/marketplace-data.json';
import ORDER_LIST_DATA from './fixtures/order-list.json';

let wrapper, router, localVue;
describe('OrderListItem', () => {
    beforeEach(async() => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/', name: 'company-orders-v2', component: OrderListItem},
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: OrderDetails},
            ]
        })
        router.push(`/company/1/orders`);

        const orderList = ORDER_LIST_DATA.ordersResponseData.items;

        wrapper = mount(OrderListItem, {
            localVue,
            router,
            propsData: { data: orderList },
            // data() {
            //     query = wrapper.vm.$route.query
            // },
            computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
                registeredMarketplaces: () => MARKETPLACE_DATA,
            },
            mocks: {
                $basePath: '/company/1'
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async() => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('triggers a click', async () => {
        wrapper.trigger('click');
        await wrapper.vm.$nextTick();
    })

    it('copy to click if the order id is clicked', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'copyToClipboard');
        await flushPromises();
        const copyClick = wrapper.find('.order-id');
        copyClick.trigger('click', ORDER_LIST_DATA.ordersResponseData.items.order_id);
        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalled();
    });

    it('Navigate function when clicked checking if there are no undefined or null values in the route query', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'navigate')
        await flushPromises();

        const callAtClick = wrapper.find('.line-break');
        callAtClick.trigger('click', ORDER_LIST_DATA.ordersResponseData.items.order_id, '0', ORDER_LIST_DATA.ordersResponseData.items[0].shipments[0].shipment_id)
        await wrapper.vm.$nextTick;
        expect(clickEvent).toHaveBeenCalled();
    });
});
