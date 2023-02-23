'use strict';

import { mount, shallowMount ,config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import provider from '../../../../../../pages/communication/provider/provider-main.vue'
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CommsRoutes from '../../../../../../router/administrator/index';
import ProvidersMock from '../fixtures/providers.json'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('provider main testcases', () => {
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
        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER()).reply(200, ProvidersMock.emailProvidersListing);
        mock.onGet(ADMIN_URLS.SMS_PROVIDER()).reply(200, ProvidersMock.smsProvidersListing);
        mock.onPost(ADMIN_URLS.EMAIL_PROVIDER()).reply(200);
        mock.onPost(ADMIN_URLS.SMS_PROVIDER()).reply(200);
        mock.onPut(ADMIN_URLS.EMAIL_PROVIDER()).reply(200);
        mock.onPut(ADMIN_URLS.SMS_PROVIDER()).reply(200);
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
    it('save email provider',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.providerType = 'email'
        wrapper.vm.saveForm()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
    })
    it('save sms provider',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.providerType = 'sms'
        wrapper.vm.saveForm()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
    })
    it('updates email provider',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.updateEmailProvider()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
    })
    it('updates sms provider',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.updateSmsProvider()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
    })
})