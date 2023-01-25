'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SmsTemplatesListing from '../../../../../../pages/communication/sms/sms-template-listing.vue'
import CommsRoutes from '../../../../../../router/index';
import SmsTemplatesMock from './sms-templates.json';
import cloneDeep from 'lodash/cloneDeep';
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Sms Template listing', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/sms/templates');
        wrapper = shallowMount(SmsTemplatesListing, {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES()).reply(200, SmsTemplatesMock.listing);
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
    it('Load sms templates', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.$nextTick();
        expect(wrapper.vm.smsTemplates.length).toBe(SmsTemplatesMock.listing.items.length)
    });
    it('Load email templates failure case', async () => {
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/sms/templates');
        wrapper = shallowMount(SmsTemplatesListing, {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES()).reply(500, {error:true});
        await flushPromises();
        wrapper.vm.$nextTick();
        expect(wrapper.vm.pageError).toBe(true);
    });
    it('loads subscribed sms templates',async ()=> {
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/sms/templates?limit=10&current=1&selectedFilter=subscribed');
        wrapper = shallowMount(SmsTemplatesListing, {
            localVue,
            router,
        })
        wrapper.vm.selectedFilter = 'subscribed'
        wrapper.vm.getTemplatesBasedOnFilter()
        mock.onGet(ADMIN_URLS.SUBSCRIBED_SMS_TEMPLATES()).reply(200, SmsTemplatesMock.subscribedListing);
        await flushPromises();
        wrapper.vm.$nextTick();
        expect(wrapper.vm.smsTemplates.length).toBe(SmsTemplatesMock.subscribedListing.docs.length)
    })
})