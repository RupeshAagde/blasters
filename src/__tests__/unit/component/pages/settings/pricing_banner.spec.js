import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import PricingBanner from "./../../../../../pages/settings/pricing_banner.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import MOCK_DATA from "./fixtures/pricing-banner.json";
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted Custom Page', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.PLATFORM_PRICING_BANNER()).reply(200, MOCK_DATA.pricing_banner);
        router = new VueRouter({
            routes: [{
                path: '/administrator/settings/pricing-banner',
                component: PricingBanner
            }]
        })
        router.push('/administrator/settings/pricing-banner');
        wrapper = mount( PricingBanner , {
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
    it('save data', async () => {
        mock.onPut(URLS.PLATFORM_PRICING_BANNER(MOCK_DATA.put_data)).reply(200, MOCK_DATA.pricing_banner);

        wrapper.vm.published = false;
        const saveBtn = wrapper.findComponent({ ref: 'save-btn' });
        saveBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.inProgress).toBe(false)
    })
    it('other', async () => {
        wrapper.vm.copyBanner()
    })
   

    

})