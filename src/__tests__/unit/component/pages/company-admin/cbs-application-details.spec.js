'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import CbsAppDetail from '../../../../../pages/company-admin/cbs-application-details.vue';
import applicationinfo from '../../../../../pages/company-admin/application-info.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/application-data.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import { shallowMount } from '@vue/test-utils'


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Company Application Detail Page', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-details/1/application/000000000000000000000001?tab=PG%20Cred%20Review');
    });

    it('Get Cbs detail page info. successfully', async () => {
        
        wrapper = shallowMount(CbsAppDetail, {
            localVue,
            router
        });
        await flushPromises();
         expect(wrapper.element).toMatchSnapshot();
         expect(wrapper.exists()).toBeTruthy();
         const redirectDiv = wrapper.find('.custom-tab')
         expect(redirectDiv.exists()).toBe(true);
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        mock.reset();
    })
});


describe('Mounted Company Application Detail Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
           mock.onGet(URLS.FETCH_ALL_APPLICATIONS('6110bfb0d4beb6b2c08f8a79')).reply(200, MOCK_DATA['application-data'].data )

        router = new VueRouter({
            routes: [{
                path: '/administrator/company-details/1/application/:appId',
                component: applicationinfo
            }]
        })
        router.push('/administrator/company-details/1/application/6110bfb0d4beb6b2c08f8a79');
        wrapper = mount( applicationinfo , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {


        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
})
