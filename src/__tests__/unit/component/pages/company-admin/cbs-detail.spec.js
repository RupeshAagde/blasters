'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import CbsDetail from '../../../../../pages/company-admin/cbs-detail.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import MOCK_DATA_DEPL_MAP from "./fixtures/custom-deployment-mapping.json";
import MOCK_DATA_DEPLMNTS from "./fixtures/custom-deployment-list.json";
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Company Detail Page', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-details/1');
    });

    it('Get Cbs detail page info. successfully', async () => {
        mock.onGet(URLS.COMPANY_PROFILE({uid:1})).reply(
            200,
            MOCK_DATA.profileDetails.profile
        );
        mock.onGet(URLS.FETCH_INVOICE_LISTING()).reply(
            200,
            MOCK_DATA.invoiceListing
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            MOCK_DATA.availablePlansDetailed
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN()).reply(
            200,
            MOCK_DATA.currentSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT()).reply(
            200,
            MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            MOCK_DATA.planDetails
        );
        mock.onGet(URLS.GET_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA_DEPL_MAP);
        mock.onGet(URLS.GET_DEPLOYMENT_LIST()).reply(200, MOCK_DATA_DEPLMNTS);

        MOCK_DATA_DEPLMNTS
        wrapper = mount(CbsDetail, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('Get CBS detail page info. error', async () => {
        mock.onGet(URLS.COMPANY_PROFILE({uid:1})).reply(500, { message: "Error" });
        wrapper = mount(CbsDetail, {
            localVue,
            router
        });
        mock.onGet(URLS.FETCH_INVOICE_LISTING()).reply(
            200,
            MOCK_DATA.invoiceListing
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            MOCK_DATA.availablePlansDetailed
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN()).reply(
            200,
            MOCK_DATA.currentSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT()).reply(
            200,
            MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            MOCK_DATA.planDetails
        );
        mock.onGet(URLS.GET_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA_DEPL_MAP);
        mock.onGet(URLS.GET_DEPLOYMENT_LIST()).reply(200, MOCK_DATA_DEPLMNTS);
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false);
    });

    it('Check back arrow button', async () => {
        mock.onGet(URLS.COMPANY_PROFILE({uid:1})).reply(
            200,
            MOCK_DATA.profileDetails.profile
        );
        mock.onGet(URLS.FETCH_INVOICE_LISTING()).reply(
            200,
            MOCK_DATA.invoiceListing
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_AVAILABLE_PLANS_DETAILED()).reply(
            200,
            MOCK_DATA.availablePlansDetailed
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_ACTIVE_PLAN()).reply(
            200,
            MOCK_DATA.currentSubscription
        );
        mock.onGet(URLS.SUBSCRIPTION_MAX_APPLICATION_LIMIT()).reply(
            200,
            MOCK_DATA.currentLimit
        );
        mock.onGet(URLS.SUBSCRIPTION_GET_PLAN_DETAILS_BY_ID("5f3a8786c90d780037723a13")).reply(
            200,
            MOCK_DATA.planDetails
        );
        mock.onGet(URLS.GET_DEPLOYMENT_MAPPING()).reply(200, MOCK_DATA_DEPL_MAP);
        mock.onGet(URLS.GET_DEPLOYMENT_LIST()).reply(200, MOCK_DATA_DEPLMNTS);
        wrapper = mount(CbsDetail, {
            localVue,
            router
        });
        await flushPromises();
        const backBtn = wrapper.find('.page-nav-back-text');
        expect(backBtn.exists()).toBe(true);
        backBtn.trigger('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(router.currentRoute.fullPath).toBe(
            `/administrator/company-list`
        );
    });
});
