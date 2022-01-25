import { mount, createLocalVue } from "@vue/test-utils";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';

import ListVerification from "../../../../../../pages/product/verification/list.vue";
import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Mounted List Product Verification List', () => {
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
        router.push('/administrator/product/verification/1/products')
        mock.onGet(URLS.FETCH_VERIFICATION_COMPANY_LIST(1)).reply(200,  mocks.companyList);

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
        router.push('/administrator/product/verification/1/products')
        mock.onGet(URLS.FETCH_VERIFICATION_COMPANY_LIST(1)).reply(200,  mocks.companyList);

        const wrapper = mount(ListVerification, {
            localVue,
            router,
        })

        await new Promise(resolve => setTimeout(resolve, 10));
        // wrapper.vm.$set(wrapper.vm, 'companyList', mocks.companyList.items);
        expect(wrapper.vm.companyList.length).toBe(10);

    });
})
