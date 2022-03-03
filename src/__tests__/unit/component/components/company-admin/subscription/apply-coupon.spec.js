import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import ApplyCoupon from "../../../../../../components/company-admin/subscription/apply-coupon.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../../services/domain.service"
//import MOCK_DATA from "./fixtures/reports.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('apply-coupon', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        // mock.onGet(URLS.COMMUNICATION_CAMPAIGNS({"name":"test"})).reply(200, MOCK_DATA.campaign.data);
        // mock.onGet(URLS.COMMUNICATION_LOG()).reply(200, MOCK_DATA.LOGS );
        // mock.onGet(URLS.GET_APPLICATIONS()).reply(200, MOCK_DATA.Applications);


        router = new VueRouter({
            routes: [{
                path: '/administrator/company-details/:companyId',
                component: ApplyCoupon
            }]
        })
        router.push('/administrator/company-details/1?tab=Subscription');
        wrapper = mount( ApplyCoupon , {
            localVue,
            router,
        })
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
        wrapper.setProps({
            selectedPlan : { '_id' : "610d03f02decb20043dac5ab"}
        });
        wrapper.vm.couponCode = 'FYND50'
        mock.onGet(URLS.SUBSCRIPTION_VALIDITY_COUPON()).reply(
            200,
            {"is_valid":true,"discount_amount":1499.5}
        );
        wrapper.vm.checkCoupon()
        wrapper.vm.clearCoupon()

    })
   
   

    

})