'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import OrderDetails from '@/pages/oms/order-details/index.vue';
import Header from '@/pages/oms/order-details/header.vue'
import InfoSection from '@/pages/oms/order-details/info-section.vue'
import ShipmentsList from '@/pages/oms/shipments-list/index.vue'
import AlertBox from '@/pages/oms/common/alert-box.vue'
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';
import MOCK_ORDER_RESPONSE_DATA from '../fixtures/order-details.json'
// import MOCK_INDEX_DATA from './fixtures/mock-index-data.json'
// import mockData from './../marketplaces/marketplaces-mock.json';
// import ACCESS_MOCK_DATA from './../../../../fixtures/access-data.json';
import moment from 'moment';
// import cloneDeep from 'lodash/cloneDeep';

import flushPromises from "flush-promises";
import { wrap } from 'lodash';
import { query } from 'express';
import { child } from 'winston';
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
        // await wrapper.vm.$forceUpdate();
        // await wrapper.vm.$nextTick();
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
        const clickEvent = jest.spyOn(wrapper.vm, 'loadData');
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

        // wrapper.vm.loadData()
        // await flushPromises();
        const copyClick = wrapper.find('.navigation-item');
        copyClick.vm.$emit('load');
       
        expect(clickEvent).toHaveBeenCalled();
    }); 

    it('it will call getshipment method', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'getShipment');
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

        // wrapper.vm.loadData()
        // await flushPromises();
        const copyClick = wrapper.find('.navigation-item');
        copyClick.vm.$emit('getShipment');
       
        expect(clickEvent).toHaveBeenCalled();
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
        
        const childComponent = wrapper.findComponent(Header)

        const clickEvent = jest.spyOn(childComponent.vm, 'navigateToDetails');
        await flushPromises();

        let a = childComponent.find('.back-btn')
        a.trigger('click');
        
        expect(clickEvent).toHaveBeenCalled();
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
        
        const childComponent = wrapper.findComponent(Header)

        const clickEvent = jest.spyOn(childComponent.vm, 'loadData');
        await flushPromises();

        let a = childComponent.find('.refresh-icon-container')
        a.trigger('click');
        
        expect(clickEvent).toHaveBeenCalledTimes(0);
    });

    // BELOW TEST CASES IS FOR THE CHILD COMPONENT OF INDEX.VUE .... THAT IS INFO-SECTION.VUE

    it('it will copy the data on clipboard when the shipment id is clicked upon', async () => {
        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA,
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.navigation-item');
        copyClick.vm.$emit('load');
        
        const childComponent = wrapper.findComponent(InfoSection)
        childComponent.setData({
            orderData: MOCK_ORDER_RESPONSE_DATA,
            // hasData: true
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let a = childComponent.find('.info-section-container')
        // a.trigger('click');
        
        // expect(clickEvent).toHaveBeenCalled();
    });

    // BELOW TEST CASES IF FOR THE CHILD COMPONENT OF INDEX.VUE .... THAT IS IN FOLDER SHIPMENTS-LIST AND FILE INDEX.VUE

    // it('it will call closeAlert method', async () => {
    //     wrapper.setData({
    //         pageLoading: false,
    //         orderId: 'FY62E7A8C2014655E823',
    //         companyId: '48',
    //         noData: false,
    //         orderData: MOCK_ORDER_RESPONSE_DATA
    //     });
 
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     const childComponent = wrapper.findComponent(ShipmentsList)

    //     childComponent.setData({
    //         // showAlert: true,
    //         alertBoxes: {
    //             placed: "Adjust reject quantity to cancelled, please verify items before confirming."
    //         }
    //     });

    //     const clickEvent = jest.spyOn(childComponent.vm, 'closeAlert');
    //     await flushPromises();

    //     let a = childComponent.find('.alert-sys')
    //     a.vm.$emit('close');
        
    //     expect(clickEvent).toHaveBeenCalledTimes(1);
    // });

    it('it will call closeAlert method', async () => {
        wrapper.setData({
            pageLoading: false,
            orderId: 'FY62E7A8C2014655E823',
            companyId: '48',
            noData: false,
            orderData: MOCK_ORDER_RESPONSE_DATA
        });
 
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const childComponent = wrapper.findComponent(ShipmentsList)

        const clickEvent = jest.spyOn(childComponent.vm, 'statusUpdated');
        await flushPromises();

        let a = childComponent.find('.content-sys')
        a.vm.$emit('statusUpdated');
        
        expect(clickEvent).toHaveBeenCalledTimes(1);
    });

    // THIS TEST CASE IS WRITTEN FOR ALERT-BOX.VUE WHICH IS THE CHILD COMPO OF SHIPMENT-LIST (INDEX.VUE) AND GRANDCHILD OF ORDER-DETAILS(INDEX.VUE)

    // it('it will call closeAlert method', async () => {
    //     wrapper.setData({
    //         pageLoading: false,
    //         orderId: 'FY62E7A8C2014655E823',
    //         companyId: '48',
    //         noData: false,
    //         orderData: MOCK_ORDER_RESPONSE_DATA
    //     });
 
    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
        
    //     const childComponent = wrapper.findComponent(ShipmentsList)

    //     childComponent.setData({
    //         // showAlert: true,
    //         alertBoxes: {
    //             placed: "Adjust reject quantity to cancelled, please verify items before confirming."
    //         }
    //     });

    //     const clickEvent = jest.spyOn(childComponent.vm, 'closeAlert');
    //     await flushPromises();

    //     let a = childComponent.find('.alert-sys')
    //     a.vm.$emit('close');

    //     const grandChildComponent = childComponent.findComponent(AlertBox)
    //     grandChildComponent.setData({
    //         display: true,
    //     });

    //     const clickEvent1 = jest.spyOn(grandChildComponent.vm, 'closeAlert');
    //     await flushPromises();

    //     let b = grandChildComponent.find('.close-text')
    //     b.trigger('click');
        
    //     expect(clickEvent1).toHaveBeenCalledTimes(0);
    // });
});