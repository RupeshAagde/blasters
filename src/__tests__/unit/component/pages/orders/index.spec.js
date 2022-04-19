'use strict';

import { shallowMount, createLocalVue } from '@vue/test-utils';
import OrderList from '@/pages/orders/index.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/admin-url.service';
import URLS from '@/services/domain.service';
import mockData from './fixtures/marketplaces-mock.json';
import ORDER_LIST_DATA from './fixtures/orders-list.json';
import ORDER_LANES_COUNT_DATA from './fixtures/order-lanes-count.json';

import flushPromises from "flush-promises";
let localVue;
const mock = new MockAdapter(axios);
let wrapper, router
const companyId = '1';

const $route = {
    params: {
        companyId: 1,
        applicationId: 1001
    },
    query: {
        search: null,
        from_date: "04-12-2022",
        to_date: "04-19-2022",
        stage: "all",
        is_priority_sort: true,
        filter_type: "auto",
        page: 1
    }
}


describe('Order List Page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(ADMIN_URLS.STORE_DETAILS()).reply(200, mockData.opt_in_stores);
        mock.onGet(URLS.ORDERS_LIST(companyId)).reply(200, ORDER_LIST_DATA)
        mock.onGet(URLS.ORDER_LANES_COUNT(companyId)).reply(200, ORDER_LANES_COUNT_DATA)

        router = new VueRouter({
            routes: [
                { path: '/orders/list/', component: OrderList }
            ]
        })
        router.push(`/orders/list/`);
        wrapper = shallowMount(OrderList, {
            localVue,
            router
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

    it('list data', async() => {
        expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    });

    it('pagination data', async() => {
        wrapper.vm.paginationChange({ limit: 2, current: 1, total: 0 })
        await flushPromises();
        expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    });

    it('listing fails data', async() => {
        mock.onGet(URLS.ORDERS_LIST(companyId)).reply(500, {});
        await flushPromises();
        expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(0);
    });

    it('dateRangeChange', async() => {
        wrapper.vm.dateRangeChange();
        await flushPromises();
        expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    });

    it('filterChange', async() => {
        wrapper.vm.filterChange();
        await flushPromises();
        expect(wrapper.vm.orders.length).toBeGreaterThanOrEqual(1);
    });

    it('searchStore', async() => {
        wrapper.vm.searchStore('test');
        await wrapper.vm.$nextTick();

        wrapper.vm.searchStore('');
        await wrapper.vm.$nextTick();
    });

    it('searchOrders', async() => {
        wrapper.vm.searchOrders();
        await wrapper.vm.$nextTick();
    });

    it('selectStageTab', async() => {
        wrapper.vm.selectStageTab({ index: 1 });
        await wrapper.vm.$nextTick();
    });
});