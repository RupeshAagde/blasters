import { mount, createLocalVue } from "@vue/test-utils";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import ListVerification from "../../../../../../pages/product/verification/productList.vue";
import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Mounted List Product Verification', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });
    afterEach(async () => {
        await flushPromises();
    });
    it('list - exists wrapper and div', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/verification/:companyId/products', component: ListVerification }
            ]
        })
        mocks.productList
        router.push('/administrator/product/verification/1/products')
        mock.onGet(URLS.FETCH_VERIFICATION_PRODUCT_LIST(1)).reply(200,  mocks.productList);
        mock.onGet(URLS.GET_COMPANY_BRANDS({company_id:1})).reply(200, mocks.companyBrand);
        mock.onGet(URLS.SEARCH_DRI()).reply(200, mocks.userList);

        const wrapper = mount(ListVerification, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();

    });

    it('list - functions verify', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/verification/:companyId/products', component: ListVerification }
            ]
        })
        mocks.productList
        router.push('/administrator/product/verification/1/products')
        mock.onGet(URLS.FETCH_VERIFICATION_PRODUCT_LIST(1)).reply(200,  mocks.productList);
        mock.onGet(URLS.GET_COMPANY_BRANDS({company_id:1})).reply(200, mocks.companyBrand);
        mock.onGet(URLS.SEARCH_DRI()).reply(200, mocks.userList);
        

        const wrapper = mount(ListVerification, {
            localVue,
            router,
        })

        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.$set(wrapper.vm, 'productList', mocks.productList.items);
        expect(wrapper.vm.productList.length).toBe(2);

    });
})
