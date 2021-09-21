'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import CbsAppDetail from '../../../../../pages/company-admin/cbs-application-details.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import { shallowMount } from '@vue/test-utils'

let response = {"status":true,"data":[[{"payment_gateway":"payumoney","is_active":true,"comments":"","id":45,"app_id":"000000000000000000000001","reviewer":"omanshlavania@gofynd.com","collect_by":"fynd","refund_by":"fynd","api_key":"EPbQ3UMB","is_reviewed":false,"merchant_profile_id":null},{"payment_gateway":"payubiz","is_active":true,"comments":"","id":51,"app_id":"000000000000000000000001","reviewer":"omanshlavania@gofynd.com","collect_by":"fynd","refund_by":"fynd","api_key":"lu7Y7O","is_reviewed":false,"merchant_profile_id":null}],{}]}


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
    });



    // it('Check back arrow button', async () => {
    //     mock.onGet(URLS.FETCH_REVIEW_LIST(JSON.stringify({ companyId: '1', app_id: '000000000000000000000001' }), "true")).reply(
    //         200,
    //         response
    //       );
          
    //     wrapper = mount(CbsAppDetail, {
    //         localVue,
    //         mocks: {
	// 			$route: {
	// 				params: {
    //         companyId: "1",
    //         appId: "000000000000000000000001",
            
    //       }
	// 			}
	// 		}
    //     });
    //     await flushPromises();
    //     const backBtn = wrapper.find('.page-nav-back-text');
    //     expect(backBtn.exists()).toBe(true);
    //     backBtn.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     await flushPromises();
    //     expect(router.currentRoute.fullPath).toBe(
    //         $router.go(-1)
    //     );
    //     mock.reset();
    // });
});
