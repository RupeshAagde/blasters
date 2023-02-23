'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import provider from '../../../../../../pages/communication/provider/set-default.vue'
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CommsRoutes from '../../../../../../router/administrator/index';
import ProvidersMock from '../fixtures/providers.json'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('set default testcases', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            CommsRoutes
        })
        router.push('/administrator/communication/provider/default');
        wrapper = mount(provider, {
            computed:{
                userData: ()=>{
                    return ProvidersMock['data']
                },
            },
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_APP_PROVIDER()).reply(200,ProvidersMock.defaults.app-provider)
        mock.onGet(ADMIN_URLS.COMMUNICATION_GLOBAL_PROVIDER()).reply(200,ProvidersMock.defaults.global-provider)
        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER()).reply(200,ProvidersMock.defaults.email-provider)
        mock.onGet(ADMIN_URLS.SMS_PROVIDER()).reply(200,ProvidersMock.defaults.sms-provider)
        mock.onPut(ADMIN_URLS.COMMUNICATION_GLOBAL_PROVIDER({})).reply(200)
        await new Promise(resolve => setTimeout(resolve, 10)); 
    });
    // it('one', async () => {
    // });
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
    it('saves default provider',async() => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.validateAndSave()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
    })
    it('tests email provider',async() => {
        wrapper.vm.testProvider('email')
        expect(wrapper.vm.emailTestModal.showSendTestEmailModal).toBeTruthy
    })
    it('tests sms provider',async() => {
        wrapper.vm.testProvider('sms')
        expect(wrapper.vm.emailTestModal.showSendTestSmsModal).toBeTruthy
    })
})