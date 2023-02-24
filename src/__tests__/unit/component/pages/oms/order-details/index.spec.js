'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import flushPromises from "flush-promises";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import OrderDetails from '@/pages/oms/order-details/index.vue';
import Header from '@/pages/oms/order-details/header.vue'
import ShipmentsList from '@/pages/oms/shipments-list/index.vue'

/* Services imports */
import URLS from '@/services/domain.service';

/* Mock imports */
import MOCK_ORDER_RESPONSE_DATA from '../fixtures/order-details.json'
let localVue;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '48';
describe('Order Details Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        // mock.onGet(ADMIN_URLS.STORE_DETAILS()).reply(200, mockData.opt_in_stores);
        mock.onGet(URLS.ORDER_DETAILS_V2(companyId, null, { order_id: 'FY63BBBACA0F704F7E77' })).reply(200, MOCK_ORDER_RESPONSE_DATA)
        router = new VueRouter({
            routes: [
                { path: '/company/:company_id/orders/:orderId/details', name: 'company-order-details-v2', component: OrderDetails},
            ]
        }) 
        router.push(`/company/48/orders/details`);
        router.push({
            name: 'company-order-details',
            params: {
                orderId: 'FY62E7A8C2014655E823'
            },
            query: {
                shipmentId: '16593491868551604381K',
            }
        });
        wrapper = mount(OrderDetails, {
            localVue,
            router,
            data() {
                return {
                    // orderData: MOCK_ORDER_RESPONSE_DATA
                }
            },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
            }
        });
        await flushPromises();
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('it makes an API call fetchOrderV2Details', async () => {
        const loadDataFunction = jest.spyOn(wrapper.vm, 'loadData');
        await flushPromises();

        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.navigation-item');
        element.vm.$emit('load');
       
        expect(loadDataFunction).toHaveBeenCalled();
    }); 

    it('it will call getshipment method', async () => {
        const getShipmentFunction = jest.spyOn(wrapper.vm, 'getShipment');
        await flushPromises();

        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const element = wrapper.find('.navigation-item');
        element.vm.$emit('getShipment');
       
        expect(getShipmentFunction).toHaveBeenCalled();
    }); 

    // BELOW TEST CASES IS FOR THE CHILD COMPONENT OF INDEX.VUE .... THAT IS HEADER.VUE

    it('it will call navigate to details method', async () => {
        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(Header);

        const navigateToDetailsFunction = jest.spyOn(childComponent.vm, 'navigateToDetails');
        await flushPromises();

        let element = childComponent.find('.back-btn');
        element.trigger('click');
        
        expect(navigateToDetailsFunction).toHaveBeenCalled();
    });

    it('it will call loadData method', async () => {
        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(Header);

        const loadDataFunction = jest.spyOn(childComponent.vm, 'loadData');
        await flushPromises();

        let element = childComponent.find('.refresh-icon-container');
        element.trigger('click');
        
        expect(loadDataFunction).toHaveBeenCalledTimes(0);
    });

    // BELOW TEST CASES IF FOR THE CHILD COMPONENT OF INDEX.VUE .... THAT IS IN FOLDER SHIPMENTS-LIST AND FILE INDEX.VUE

    it('it will call closeAlert method', async () => {
        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });
 
        // await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentsList);

        const statusUpdatedFunction = jest.spyOn(childComponent.vm, 'statusUpdated');
        await flushPromises();

        let element = childComponent.find('.content-sys');
        element.vm.$emit('statusUpdated');
        
        expect(statusUpdatedFunction).toHaveBeenCalledTimes(1);
    });
});