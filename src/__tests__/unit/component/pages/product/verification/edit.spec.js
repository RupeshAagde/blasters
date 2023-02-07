import { mount, shallowMount, config, createLocalVue } from "@vue/test-utils";
import EditVerification from "../../../../../../pages/product/verification/edit.vue";
import URLS from "../../../../../../services/domain.service.js"

import mocks from "./mocks";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import flushPromises from "flush-promises";
import { console } from "window-or-global";


const mock = new MockAdapter(axios);

let localVue = createLocalVue()
localVue.use(VueRouter)

describe('Mounted Create/Edit Category Page', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });
    afterEach(async () => {
        await flushPromises();
    });
    it('should render to a snapshot', async () => {
        const companyId = 1;
        const productId = '7685514'
        const domain = 'https://api.xyz.com'
        const templateSlug = 'mobile-phones-and-tablet';
        const router = new VueRouter({
            routes: [
                { path: '/administrator/product/verification/:id/products/edit/:productId', component: EditVerification }
            ]
        })
        router.push( `/administrator/product/verification/1/products/edit/7685514?template=mobile-phones-and-tablet`);
        mock.onGet('https://api.xyz.com/service/___/administrator/catalog/v1.0/company/1/products/7685514').reply(200,  mocks.productData);
        mock.onGet('https://api.xyz.com/service/___/administrator/catalog/v1.0/company/1/verification/products/7685514').reply(200,  mocks.productVerificationData);
        mock.onGet(URLS.PRODUCT_TEMPLATE_VALIDATION({companyId, slug: templateSlug})).reply(200,  mocks.globalSchema);
        mock.onGet(URLS.SIZE_GUIDE_URL(companyId)).reply(200, {})
        
        const wrapper = mount(EditVerification, {
            localVue,
            router
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.element).toMatchSnapshot();
    });
    // it('should render to a snapshot', async () => {
    //     const companyId = 1;
    //     const productId = '7685514'
    //     const domain = 'https://api.xyz.com'
    //     const templateSlug = 'mobile-phones-and-tablet';
    //     const router = new VueRouter({
    //         routes: [
    //             { path: '/administrator/product/verification/:id/products/edit/:productId', component: EditVerification }
    //         ]
    //     })
    //     router.push(`/administrator/product/verification/1/products/edit/7685514?template=mobile-phones-and-tablet`);
    //     console.log("0000000000000000000000000000000000000000", productId);
    //     mock.onGet('https://api.xyz.com/service/___/administrator/catalog/v1.0/company/1/products/7685514').reply(200,  mocks.productData);
    //     mock.onGet('https://api.xyz.com/service/___/administrator/catalog/v1.0/company/1/verification/products/7685514').reply(200,  mocks.productVerificationData);
    //     mock.onGet(URLS.PRODUCT_TEMPLATE_VALIDATION({companyId, slug: templateSlug})).reply(200,  mocks.globalSchema);
    //     mock.onGet(URLS.SIZE_GUIDE_URL(companyId)).reply(200, {})

        
    //     const wrapper = mount(EditVerification, {
    //         localVue,
    //         router
    //     })
        
    //     await new Promise(resolve => setTimeout(resolve, 10));

    //     const {product: {item_code} = {}, verificationDetails } = wrapper.vm;
    //     expect(item_code).toBe('SOLR-V2');
    //     expect(verificationDetails.item_code).toBe('SOLR-V2');
    // });

})
