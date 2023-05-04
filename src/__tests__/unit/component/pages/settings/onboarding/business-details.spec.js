'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import BusinessDetails from "./../../../../../../pages/settings/onboarding/business-details.vue"
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/business-details.json';
import URLS from "../../../../../../services/domain.service"

import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted BusinessDetails Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/settings/business-details',
                    component: BusinessDetails
                }
            ]
        });
        router.push('/administrator/settings/business-details');
    });

    it('Get BusinessDetails Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-details')).reply(
            200,
            MOCK_DATA.business_details
        );
        mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: "company_type" } }).reply(
            200,
            MOCK_DATA.company_type
        );
        mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: "business_type" } }).reply(
            200,
            MOCK_DATA.business_type
        );
        wrapper = mount(BusinessDetails, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(6);
        mock.reset();
    });
    it('Get BusinessDetails Error', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-details')).reply(500, { message: "Error" });
        wrapper = mount(BusinessDetails, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
    });


    it('Submit BusinessDetails Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-details')).reply(
            200,
            MOCK_DATA.business_details
        );
        mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: "company_type" } }).reply(
            200,
            MOCK_DATA.company_type
        );
        mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: "business_type" } }).reply(
            200,
            MOCK_DATA.business_type
        );

        mock.onPatch(URLS.ADMIN_PANEL_CONFIG('business-details'), MOCK_DATA).reply(200);

        wrapper = mount(BusinessDetails, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(6);


        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        mock.reset();
    });
});
