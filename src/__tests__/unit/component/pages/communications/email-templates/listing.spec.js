'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EmailTemplatesListing from '../../../../../../pages/communication/email/email-template-listing.vue'
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CommsRoutes from '../../../../../../router/index';
import EmailTemplatesMock from './email-templates.json'
import cloneDeep from 'lodash/cloneDeep';
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Email Template listing', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/email/templates');
        wrapper = shallowMount(EmailTemplatesListing, {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(200, EmailTemplatesMock.listing);
        await flushPromises();
    });

    it('listing', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
    it('Load email templates', async () => {
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/email/templates');
        wrapper = shallowMount(EmailTemplatesListing, {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(200, EmailTemplatesMock.listing);
        await flushPromises();
        wrapper.vm.$nextTick();
        expect(wrapper.vm.emailTemplates.length).toBe(EmailTemplatesMock.listing.items.length)
    });
    it('Load email templates failure case', async () => {
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/email/templates');
        wrapper = shallowMount(EmailTemplatesListing, {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(500, {error:true});
        await flushPromises();
        wrapper.vm.$nextTick();
        expect(wrapper.vm.pageError).toBe(true);
    });
    it('loads subscribed email templates',async ()=> {
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/email/templates?limit=10&current=1&selectedFilter=subscribed');
        wrapper = shallowMount(EmailTemplatesListing, {
            localVue,
            router,
        })
        wrapper.vm.selectedFilter = 'subscribed'
        wrapper.vm.getTemplatesBasedOnFilter()
        mock.onGet(ADMIN_URLS.SUBSCRIBED_EMAIL_TEMPLATES()).reply(200, EmailTemplatesMock.subscribedListing);
        await flushPromises();
        wrapper.vm.$nextTick();
        expect(wrapper.vm.emailTemplates.length).toBe(EmailTemplatesMock.subscribedListing.docs.length)
    })
})