'use strict';

import { mount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import provider from '../../../../../../pages/communication/provider/listing.vue'
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CommsRoutes from '../../../../../../router/administrator/index';
import ProvidersMock from '../fixtures/providers.json'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Email Providers listing', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            CommsRoutes
        })
        router.push('/administrator/communication/provider');
        wrapper = mount(provider, {
            localVue,
            router,
        })
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
    it('Load email providers', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.$nextTick();
        expect(wrapper.vm.emailProvidersStore.items.length).toBe(2)
    });
})