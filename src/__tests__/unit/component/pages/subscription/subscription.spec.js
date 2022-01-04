import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import Subscription from '@/pages/company-admin/subscription.vue';
import URLS from '@/services/domain.service.js';

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mocks from './mocks';
import { Promise } from 'window-or-global';
import CBS_MOCK_DATA from '../company-admin/fixtures/cbs-mock.json';
import flushPromises from 'flush-promises';

import AdminRoutes from '@/router/administrator/index.js';
describe('Load subscription', () => {
    let wrapper;
    let localVue;
    let router;
    const mock = new MockAdapter(axios);
    
    beforeEach(() => {
        mock.reset()
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [{
                name: 'company-details',
                path: '/company-details/:companyId',
                component: Subscription
            }]
        });
        router.push({
            name: 'company-details',
            params:{
                companyId:1
            }
        });
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    test('Load subscription', async () => {
        mock.onGet(URLS.GET_CREDIT_TRANSACTIONS("1")).reply(
            200,
            mocks.creditTransactions
        );
        mock.onGet(URLS.GET_CUSTOMER_DETAILS("1")).reply(
            200,
            mocks.customerDetails
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            mocks.detailedList
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN("1")).reply(
            200,
            mocks.currentSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT("1")).reply(
            200,
            CBS_MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            mocks.subscription
        );
        
        wrapper = shallowMount(Subscription, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        const creditTransactionPagination = wrapper.find('#credit-transaction-pagination');
        expect(creditTransactionPagination.exists()).toBe(true);
        creditTransactionPagination.vm.$emit('change',{current:2,limit:10});
        await wrapper.vm.$nextTick();
        

    });
    test('Trial plan string', async () => {
        mock.onGet(URLS.GET_CREDIT_TRANSACTIONS("1")).reply(
            200,
            mocks.creditTransactions
        );
        mock.onGet(URLS.GET_CUSTOMER_DETAILS("1")).reply(
            200,
            mocks.customerDetails
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            mocks.detailedList
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN("1")).reply(
            200,
            mocks.currentTrialSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT("1")).reply(
            200,
            CBS_MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            mocks.subscription
        );
        
        wrapper = shallowMount(Subscription, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    test('Change subscription', async () => {
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            mocks.detailedList
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN("1")).reply(
            200,
            mocks.currentSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT("1")).reply(
            200,
            CBS_MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            mocks.subscription
        );

        mock.onPost(URLS.SUBSCRIPTION_ACTIVATE("1")).reply(
            200,
            mocks.changeSubscription
        );
        
        wrapper = shallowMount(Subscription, {
            localVue,
            router
        });
        await flushPromises();
        let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        const resp = wrapper.vm.activatePlan("610d03f02decb20043dac5ab")
        await flushPromises();
        expect(showSuccessMethod).toHaveBeenCalled();
    });
});
