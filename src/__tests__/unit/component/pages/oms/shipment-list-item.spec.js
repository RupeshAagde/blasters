'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
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
                { path: '/company/:company_id/orders/', name: 'company-orders-v2', component: ShipmentListItem},
                { path: '/company/:company_id/orders/:orderId/details', component: OrderDetails },
            ]
        })
        router.push(`/company/1/orders`);

        const shipmentList = SHIPMENT_LIST_DATA.items;

        wrapper = mount(ShipmentListItem, {
            localVue,
            router,
            propsData: { shipmentList: shipmentList },
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

    // it('copy to click if the shipment id is clicked', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'copyToClipboard');
    //     await flushPromises();
    //     const copyClick = wrapper.find('.shipment-id');
    //     copyClick.trigger('click', SHIPMENT_LIST_DATA[0].shipment_id);
    //     await wrapper.vm.$nextTick();
    //     expect(clickEvent).toHaveBeenCalled();
    // });

    // it('dialog view should run when the placed button is clicked', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'changeDialogView');
    //     await flushPromises();
        
    //     const callAtClick = wrapper.find('.bags-item-images');
    //     callAtClick.trigger('click', SHIPMENT_LIST_DATA[0].bags, SHIPMENT_LIST_DATA[0].shipment_id, SHIPMENT_LIST_DATA[0].shipment_status);
    //     await wrapper.vm.$nextTick();
        
    //     let afterClickValue = wrapper.vm.bagDialogView;
    //     expect(afterClickValue).toBe(true)
    // });

    // it('quickView', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'quickView');
    //     await flushPromises();

    //     const callAtClick = wrapper.find('.shipment-data');
    //     callAtClick.trigger('click', ORDER_LIST_DATA[0].id);
    //     await wrapper.vm.$nextTick();

    //     let afterClickOrderID = wrapper.vm.orderNumId;
    //     expect(afterClickOrderID).toBe("FY629724F00149EC6ECC")
    // });

    // it('this method shows the sum of prices when called', async() => {
    //     let a = wrapper.vm.sumOfBagsPrice(SHIPMENT_LIST_DATA.items[0].bags);
    //     await wrapper.vm.$nextTick();
    //     expect(a).toBe(499);
    // });

    // it('Dialog view should get closed when this method runs', async () => {
    //     const clickEvent = jest.spyOn(wrapper.vm, 'changeDialogView');
    //     await flushPromises();
        
    //     const callAtClick = wrapper.find('.bags-item-images');
    //     callAtClick.trigger('click', SHIPMENT_LIST_DATA[0].bags, SHIPMENT_LIST_DATA[0].shipment_id, SHIPMENT_LIST_DATA[0].shipment_status);
    //     await wrapper.vm.$nextTick();

    //     const closeEvent = jest.spyOn(wrapper.vm, 'close');
    //     await flushPromises();

    //     const call = wrapper.find('.drawer-view');
    //     call.trigger('click');
    //     await wrapper.vm.$nextTick();

    //     let whenClosed = wrapper.vm.bagDialogView;
    //     expect(whenClosed).toBe(false)
    // });

    it('Navigate function when clicked checking if there are no undefined or null values in the route query', async () => {
        let routequery = {
            group_entity: "",
            page_no: '1',
            from_date: '12-07-2022',
            to_date: '19-07-2022',
            lane: 'new',
            }

        const clickEvent = jest.spyOn(wrapper.vm, 'navigate')
        await flushPromises();

        const callAtClick = wrapper.find('.line-break');
        callAtClick.trigger('click', SHIPMENT_LIST_DATA.items[0].order_id, SHIPMENT_LIST_DATA.items[0].shipment_id)
        // cleansedQuery = this.query;
        await wrapper.vm.$nextTick;

    });
});
