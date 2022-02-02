import {
    mount,
    createLocalVue,
    shallowMount
} from "@vue/test-utils";
import CouponListingMain from "./../../../../../pages/company-admin/coupon-listing-main.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/coupon-subscription.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mount coupon list', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/subscription/coupons',
                component: CouponListingMain
            }]
        })
        router.push('/administrator/subscription/coupons');
        wrapper = shallowMount( CouponListingMain , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('modal', async () => {
        await flushPromises();
        const create = wrapper.find('#create');
        expect(create.exists()).toBe(true)
        create.trigger('click')

        const proceed = wrapper.find('#approve');
        expect(proceed.exists()).toBe(true)
        proceed.trigger('click')
        
    })
   
    

    

})