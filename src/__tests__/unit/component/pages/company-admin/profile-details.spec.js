'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import ProfileDetails from '../../../../../pages/company-admin/profile-details.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import { async, Promise, Vue } from 'window-or-global';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Profile Details', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        })
        router.push('/administrator/company-details/1');
    });
    it('Fetch Profile Details successfully',  async () => {
        mock.onGet(URLS.COMPANY_PROFILE({uid:1})).reply(200, MOCK_DATA.profileDetails.profile);
        mock.onGet(URLS.GET_CHOICE_TYPES()).reply(200, MOCK_DATA.profileDetails.businessType);

        wrapper = mount(ProfileDetails, {
            localVue,
            router
        })

        await flushPromises();
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        await flushPromises();
        if(wrapper.vm.profileDetails.warnings){
            expect(wrapper.find('.unverified-warning').isVisible()).toBe(true)
        }
    });

    it('Fetch Profile Details Error', async () => {
        mock.onGet(URLS.COMPANY_PROFILE({uid:1})).reply(500, {message: "Error"});
        mock.onGet(URLS.GET_CHOICE_TYPES()).reply(200, MOCK_DATA.profileDetails.businessType);

        wrapper = mount(ProfileDetails, {
            localVue,
            router
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
    })
})