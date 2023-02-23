'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import Product from "./../../../../../../pages/settings/onboarding/product.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/product.json';
import URLS from "../../../../../../services/domain.service"
import { Promise } from 'window-or-global';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Product Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: '/administrator/settings/product',
                    component: Product
                }
            ]
        });
        router.push('/administrator/settings/product');
    });

    it('Get Product Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('product')).reply(
            200,
            MOCK_DATA
        );
        // mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: 'product_template_types' } }).reply(200, {data: {items: []}});
        wrapper = mount(Product, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(4);
        mock.reset();
    });

    it('Get Product Error', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('product')).reply(500, { message: "Error" });
        wrapper = mount(Product, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
    });


    it('Update Product Success', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('product')).reply(
            200,
            MOCK_DATA
        );
        mock.onPatch(URLS.ADMIN_PANEL_CONFIG('product'), MOCK_DATA).reply(200);
        // mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: 'product_template_types' } }).reply(200, {data: {items: []}});
        wrapper = mount(Product, {
            localVue,
            router
        });
        console.log("=route==>", wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
        await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(4);

        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        mock.reset();
    });
});
