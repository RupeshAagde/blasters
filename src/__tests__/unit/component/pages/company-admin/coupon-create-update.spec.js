import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import CouponCreateUpdate from "./../../../../../pages/company-admin/coupon-create-update.vue";
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



describe('Mount create Coupons', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        
        mock.onGet(URLS.FETCH_PLANS_LIST()).reply(200,MOCK_DATA.plans);
        mock.onGet(URLS.SUBSCRIBER_LIST()).reply(200, MOCK_DATA.subscriber);
        mock.onGet(URLS.SUBSCRIPTION_COUPON_UNIQUE('omansh22')).reply(200,{is_unique: true});

        router = new VueRouter({
            routes: [{
                path: '/administrator/subscription/coupons/create/:couponType',
                component: CouponCreateUpdate
            }]
        })
        router.push('administrator/subscription/coupons/create/percentage_off');
        wrapper = mount( CouponCreateUpdate , {
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
    it('create', async () => {
        wrapper.vm.code.value = 'asdfg'
        wrapper.vm.percentage.value = MOCK_DATA.created.data.rule_definition.value;
        wrapper.vm.durationDrop.value = 'repeating';
        wrapper.vm.duration.value = '12';
        wrapper.vm.titleCoupon = 'testasd';
        
        mock.onPost(URLS.SUBSCRIPTION_COUPON()).reply(200,MOCK_DATA.created);
        await flushPromises();

        const create = wrapper.find('#actions');
        expect(create.exists()).toBe(true)
        create.trigger('click')

        
    })
    it('change plan', async ()=>{
         await flushPromises();
        wrapper.vm.pushPlan()
        wrapper.vm.pushSubs()
    })

it('unique', async ()=>{
    await flushPromises();
    // const uniqueBtn = wrapper.find('#unique');
    // expect(uniqueBtn.exists()).toBe(true)
    // uniqueBtn.vm.$emit('input')
    wrapper.vm.checkUnique()
})



    

})

describe('Mount update Coupons', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.FETCH_PLANS_LIST()).reply(200,MOCK_DATA.plans);
        mock.onGet(URLS.SUBSCRIBER_LIST()).reply(200, MOCK_DATA.subscriber );

        mock.onGet(URLS.SUBSCRIPTION_COUPON('61adb356ce8e08a8c27f9b06')).reply(200,MOCK_DATA.created.data);

        router = new VueRouter({
            routes: [{
                path: '/administrator/subscription/coupons/edit/:couponType/:couponId',
                component: CouponCreateUpdate
            }]
        })
        router.push('/administrator/subscription/coupons/edit/percentage_off/61adb356ce8e08a8c27f9b06');
        wrapper = mount( CouponCreateUpdate , {
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
    
    it('update', async () => {
        mock.onPut(URLS.SUBSCRIPTION_COUPON('61adb356ce8e08a8c27f9b06')).reply(200,MOCK_DATA.created);
        await flushPromises();
        const create = wrapper.find('#actions');
        expect(create.exists()).toBe(true)
        create.trigger('click')   
    })
    it('update FAILED', async () => {
        mock.onPut(URLS.SUBSCRIPTION_COUPON('61adb356ce8e08a8c27f9b')).reply(404,MOCK_DATA.created);
        await flushPromises();
        const create = wrapper.find('#actions');
        expect(create.exists()).toBe(true)
        create.trigger('click')   
    })
   

    

})