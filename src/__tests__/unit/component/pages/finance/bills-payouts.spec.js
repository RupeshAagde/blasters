'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import BillPayouts from '../../../../../pages/finance/bills-payouts.vue';
// import APPLICATION_LIST_MOCK_DATA from './../../../../fixtures/application-list.json';
import mocks from './fixtures/reports.json'
//import Vuex from 'vuex';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';
const pageSize = 10;


describe('BillPayouts', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/bills-and-payouts',
                name: 'report-generator',
                component: BillPayouts
            }]
        });
        router.push('/administrator/finance/bills-and-payouts');
        wrapper = shallowMount(BillPayouts, {
            localVue,
            router,
        });
    
        await flushPromises();
    });

    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Tab changed to accounts', async () => {
        const clickEvent = jest.spyOn(wrapper.vm, 'changeGroupIndex');
        await flushPromises();
        wrapper.setData({
            activeGroupIndex:1,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('#group-tab');

        copyClick.vm.$emit('tab-change', 
            {
                "index": 1,
                "item": {
                    "name": "Account ledger"
                }
            }
        );

        await wrapper.vm.$nextTick();
        expect(clickEvent).toHaveBeenCalledTimes(1);

    });


})
