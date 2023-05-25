'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import BusinessRegistration from "./../../../../../../pages/settings/onboarding/business-registration.vue"
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/business-registration.json';
import URLS from "../../../../../../services/domain.service"
import EXTENSION_URLS from "../../../../../../services/mixmaster-url.service"
import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted BusinessRegistration Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/settings/business-registration',
                    component: BusinessRegistration
                }
            ]
        });
        router.push('/administrator/settings/business-registration');
    });

    it('Get BusinessRegistration Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-registration')).reply(
            200,
            MOCK_DATA.business_registration
        );
        mock.onGet(URLS.GET_CHOICE_TYPES()).reply(
            200,
            MOCK_DATA.marketplaces
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration'), { params: { page_size: 10, page_no: 1 } }).reply(
            200,
            MOCK_DATA.extensions
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration')).reply(
            200,
            MOCK_DATA.selected_extensions
        );
        mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('')).reply(
            200,
            MOCK_DATA.applications
        );
        wrapper = mount(BusinessRegistration, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(9);
        mock.reset();
    });
    it('Get BusinessRegistration Error', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-registration')).reply(500, { message: "Error" });
        wrapper = mount(BusinessRegistration, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
    });


    it('Submit BusinessRegistration Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-registration')).reply(
            200,
            MOCK_DATA.business_registration
        );
        mock.onGet(URLS.GET_CHOICE_TYPES()).reply(
            200,
            MOCK_DATA.marketplaces
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration'), { params: { page_size: 10, page_no: 1 } }).reply(
            200,
            MOCK_DATA.extensions
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration')).reply(
            200,
            MOCK_DATA.selected_extensions
        );
        mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('')).reply(
            200,
            MOCK_DATA.applications
        );

        mock.onPatch(URLS.ADMIN_PANEL_CONFIG('business-registration'), MOCK_DATA.business_registration).reply(200);


        wrapper = mount(BusinessRegistration, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(9);

        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        mock.reset();
    });
    it('should check dirty form', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('business-registration')).reply(
            200,
            MOCK_DATA.business_registration
        );
        mock.onGet(URLS.GET_CHOICE_TYPES()).reply(
            200,
            MOCK_DATA.marketplaces
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration'), { params: { page_size: 10, page_no: 1 } }).reply(
            200,
            MOCK_DATA.extensions
        );
        mock.onGet(EXTENSION_URLS.GET_EXTENSIONS('business-registration')).reply(
            200,
            MOCK_DATA.selected_extensions
        );
        mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('')).reply(
            200,
            MOCK_DATA.applications
        );
        wrapper = mount(BusinessRegistration, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.isFormDirty()).toBeFalsy();
        wrapper.vm.$set(wrapper.vm, 'lineItems', []);
        expect(wrapper.vm.isFormDirty()).toBeTruthy();
    })
});

