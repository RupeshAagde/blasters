import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import CouponListing from "./../../../../../pages/company-admin/coupons-listing.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/coupon-subscription.json"
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted Custom tags', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.SUBSCRIPTION_COUPON()).reply(200, MOCK_DATA.list);

        router = new VueRouter({
            routes: [{
                path: '/administrator/subscription/coupons',
                component: CouponListing
            }]
        })
        router.push('/administrator/subscription/coupons');
        wrapper = mount( CouponListing , {
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
    it('pagination and search', async () => {
        
        await flushPromises();
        wrapper.vm.searchText = 'omansh';

        wrapper.vm.debounceInput("omi");  
        wrapper.vm.setPagination();
        wrapper.vm.setRouteQuery({code:'omansh'})

    })
})