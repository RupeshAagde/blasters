'use strict';

import { mount, shallowMount ,config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import provider from '../../../../../../pages/communication/provider/provider-main-body.vue'
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CommsRoutes from '../../../../../../router/administrator/index';
import ProvidersMock from '../fixtures/providers.json'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('provider main body testcases', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            CommsRoutes
        })
        router.push('/administrator/communication/provider/email/edit/62a70f8671fbbca9de311362?type=falconide');
        wrapper = mount(provider, {
            localVue,
            router,
        })
        wrapper.vm.emailTestModal = ProvidersMock.testModalData.emailTestModal
        wrapper.vm.smsTestModal = ProvidersMock.testModalData.smsTestModal
        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER()).reply(200, ProvidersMock.emailProvidersListing);
        mock.onGet(ADMIN_URLS.SMS_PROVIDER()).reply(200, ProvidersMock.smsProvidersListing);
        await new Promise(resolve => setTimeout(resolve, 10)); 
    });
    it('listing', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
    it('works with email',async()=>{
        wrapper = mount(provider, {
            propsData:{providerType:'email'},
            computed:{
                userData: ()=>{
                    return ProvidersMock['data']
                },
            },
        })
        wrapper.vm.openTestProviderModal()
        expect(wrapper.vm.emailTestModal.showSendTestEmailModal).toBeTruthy()
        wrapper.vm.closeSendTestProviderModal()
        expect(wrapper.vm.emailTestModal.showSendTestEmailModal).toBeFalsy()
    })
    it('works with sms',async()=>{
        wrapper = mount(provider, {
            propsData:{providerType:'sms'},
            computed:{
                userData: ()=>{
                    return ProvidersMock['data']
                },
            },
        })
        wrapper.vm.openTestProviderModal()
        expect(wrapper.vm.smsTestModal.showSendTestSmsModal).toBeTruthy()
        wrapper.vm.closeSendTestProviderModal()
        expect(wrapper.vm.smsTestModal.showSendTestSmsModal).toBeFalsy()
    })
})