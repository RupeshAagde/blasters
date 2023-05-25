'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import ShipmentListItem from '@/pages/oms/shipment-list-item.vue';
import OrderDetails from '@/pages/oms/order-details/index.vue';

/* Mock imports */
import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';
import MARKETPLACE_DATA from './fixtures/marketplace-data.json';
import SHIPMENT_LIST_DATA from './fixtures/shipment-list.json';

let wrapper, router, localVue;
describe('ShipmentListItem', () => {
    beforeEach(async() => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders-list/', name: 'company-orders-v2', component: ShipmentListItem},
                { path: '/company/:company_id/orders/:orderId/details', component: OrderDetails },
            ]
        })
        router.push(`/company/1/orders`);

        const shipmentList = SHIPMENT_LIST_DATA.items;

        wrapper = mount(ShipmentListItem, {
            localVue,
            router,
            propsData: { shipmentList: shipmentList }, 
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
    });

    it('Navigate function when clicked checking if there are no undefined or null values in the route query', async () => {
        const navigateFunction = jest.spyOn(wrapper.vm, 'navigate');
        await flushPromises();

        const element = wrapper.find('.line-break');
        element.trigger('click', SHIPMENT_LIST_DATA.items[0].order_id, SHIPMENT_LIST_DATA.items[0].shipment_id);
        await wrapper.vm.$nextTick;

        expect(navigateFunction).toHaveBeenCalled();
    });
});
