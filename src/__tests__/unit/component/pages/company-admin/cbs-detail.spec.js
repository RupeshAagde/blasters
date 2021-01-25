'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import CbsDetail from '../../../../../pages/company-admin/cbs-detail.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import { global, Promise, URL } from 'window-or-global';

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
        mock.onGet(URLS.COMPANY_PROFILE()).reply(
            200,
            MOCK_DATA.profileDetails.profile
        );
        wrapper = mount(CbsDetail, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        mock.reset();
    });

    it('Get CBS detail page info. error', async () => {
        mock.onGet(URLS.COMPANY_PROFILE()).reply(500, { error: true });
        wrapper = mount(CbsDetail, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false);
        mock.reset();
    });

    it('Check back arrow button', async () => {
        mock.onGet(URLS.COMPANY_PROFILE()).reply(
            200,
            MOCK_DATA.profileDetails.profile
        );
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
        mock.reset();
    });
});
