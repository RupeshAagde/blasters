'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import Brands from "./../../../../../../pages/settings/onboarding/brands.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/brand.json';
import URLS from "../../../../../../services/domain.service"
import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Brands Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/settings/brand',
                    component: Brands
                }
            ]
        });
        router.push('/administrator/settings/brand');
    });

    it('Get Brand Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('brand')).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(5);
        mock.reset();
    });

    it('Get Brand Error', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('brand')).reply(500, { message: "Error" });
        wrapper = mount(Brands, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
    });

    it('Submit Brand Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('brand')).reply(
            200,
            MOCK_DATA
        );
        mock.onPatch(URLS.ADMIN_PANEL_CONFIG('brand'), MOCK_DATA).reply(200);

        wrapper = mount(Brands, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(5);

        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        mock.reset();
    });
    it('should check dirty form', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('brand')).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
        await flushPromises();
        expect(wrapper.vm.isFormDirty()).toBeFalsy();
        wrapper.vm.$set(wrapper.vm, 'lineItems', []);
        expect(wrapper.vm.isFormDirty()).toBeTruthy();
    })
});
