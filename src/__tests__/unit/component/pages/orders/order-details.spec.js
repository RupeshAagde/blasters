'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import OrderDetails from '@/pages/orders/order-details.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import mockData from './fixtures/order-details.json';
import APPLICATION_LIST_MOCK_DATA from './fixtures/application-list.json';
import flushPromises from "flush-promises";
import ACCESS_MOCK_DATA from './fixtures/access-data.json';

let localVue;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '1';
const sampleOrderId = 'FY5FC8CD7B01E8A42B52';

const shipmentActions = {
    render: () => {},
    methods: {
        unselectAllBags: () => {},
        selectAllBags: () => {},
        getShipmentPayload: () => {
            return mockData.order_response.items[0].shipments[0]
        }
    },
    data() {
        return {
            shipment: mockData.order_response.items[0].shipments[0],
            isSelected: true,
            selectedBags: mockData.order_response.items[0].shipments[0].bags
        }
    },
    computed: {
        isNew: () => true
    }
}

describe('Order Details Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [
                { path: '/order/:orderId/shipments', component: OrderDetails }
            ]
        });

        mock.onGet(URLS.ORDER_DETAILS(companyId)).reply(200, ORDER_LIST_DATA);
        mock.onPost(URLS.ORDER_SHIPMENTS_STATUS_UPDATE(companyId)).reply(200, mockData.shipment_status_update_response);
        mock.onPost(URLS.STORE_PROCESS_SHIPMENTS()).reply(200, {});

        router.push(`/order/${sampleOrderId}/shipments`);

        wrapper = shallowMount(OrderDetails, {
            localVue,
            router,
            computed: {
                companyApplications: () => APPLICATION_LIST_MOCK_DATA.items,
                accessDetail: () => ACCESS_MOCK_DATA,
            },
            stubs: {
                'shipment': shipmentActions
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
        expect(wrapper.html()).toContain('Order Details');
    });

    it('Get Order Data', () => {
        wrapper.vm.getInitialValue('');
        wrapper.vm.getOrder();
    });

    it('Set Success Message', () => {
        wrapper.vm.setSuccessAlert();
    });

    it('Detect Keyboard Events', () => {
        wrapper.vm.detectKeyboardNavigation({ keyCode: 39, preventDefault: () => {}, stopPropagation: () => {} });
    });

    it('Detect Keyboard Events', () => {
        wrapper.vm.detectKeyboardNavigation({ keyCode: 37, preventDefault: () => {}, stopPropagation: () => {} });
    });

    it('Load Latest', () => {
        wrapper.vm.loadLatest();
    });

    it('Routing', () => {
        wrapper.vm.setRouteParams({})
    });

    it('Get Shipment Bags', () => {
        wrapper.vm.getShipmentBags('16141714058381943588', ['343784'])
    });
})
