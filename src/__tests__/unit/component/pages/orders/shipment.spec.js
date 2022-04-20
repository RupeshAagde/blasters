'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import Shipment from '@/pages/orders/shipment.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import ORDER_LANES_COUNT_DATA from './fixtures/order-lanes-count.json';
import URLS from '@/services/domain.service';
import ADMIN_URLS from '@/services/admin-url.service';
import TICKET_LIST_DATA from './fixtures/ticket-list.json';
import flushPromises from "flush-promises";
import ACCESS_MOCK_DATA from './fixtures/access-data.json';
import VALID_ACTIONS from "./fixtures/can-shipment-break.json";


let localVue;
const mock = new MockAdapter(axios);
let wrapper, router;

describe('Shipment Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        mock.onGet(URLS.ORDERS_LIST()).reply(200, ORDER_LIST_DATA);
        mock.onGet(URLS.ORDER_LANES_COUNT()).reply(200, ORDER_LANES_COUNT_DATA);
        mock.onGet(URLS.FETCH_TICKETS()).reply(200, TICKET_LIST_DATA);

        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: Shipment }
            ]
        });

        const shipment = ORDER_LIST_DATA.items[0].shipments[0];
        const applicationId = '000000000000000000000001';
        const orderId = 'FY60364D0D01DC690BD6';
        const deliveryAddress = {
            "area": "TEST",
            "city": "Mumbai",
            "email": "",
            "phone": "8844884488",
            "state": "Maharashtra",
            "country": "India",
            "pincode": "400093",
            "version": "1.0",
            "address1": "Test",
            "address2": "",
            "landmark": "test",
            "latitude": 19.1151282,
            "longitude": 72.8613275,
            "created_at": "2021-02-24T18:26:45+00:00",
            "updated_at": "2021-02-24T18:26:45+00:00",
            "address_type": "home",
            "contact_person": "Brijesh Mahidhariya",
            "address_category": "delivery",
            "name": "Brijesh Mahidhariya",
            "address": "Test"
        };

        const validActions = VALID_ACTIONS.valid_actions[shipment.id]
        const user = ORDER_LIST_DATA.items[0].user;
        const currentStateShipmentCount = 0;
        const isDrawerView = false;

        router.push(`/orders/list/`);
        wrapper = shallowMount(Shipment, {
            localVue,
            router,
            propsData: { shipment, currentStateShipmentCount, applicationId, deliveryAddress, orderId, user, validActions, isDrawerView },
            computed: {
                accessDetail: () => ACCESS_MOCK_DATA,
                viewPrescription: () => []
            }
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
});
