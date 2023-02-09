'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import createTicketApi from '@/pages/tickets/configuration/kapture-integration/create-ticket-api.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('Create Ticket Api Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders create ticket api page', () => {
        const wrapper = shallowMount(createTicketApi)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('check reconfigure', () => {
        const wrapper = shallowMount(createTicketApi)
        // expect(wrapper.find('.reconfigure').exists()).toBe(false)
        wrapper.vm.reconfigure();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".warningPopUp").exists()).toBe(false);
    })

    it('check confirmPopup', () => {
        const wrapper = shallowMount(createTicketApi)
        // expect(wrapper.find('.reconfigure').exists()).toBe(false)
        wrapper.vm.confirmPopUp();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".warningPopUp").exists()).toBe(false);
        // expect(wrapper.find(".isReconfigure").exists()).toBe(false);
        expect(wrapper.find(".isTested").exists()).toBe(false);
        expect(wrapper.find(".isIntegrated").exists()).toBe(false);
    })

    it('Test API key', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: createTicketApi }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(createTicketApi, {
            localVue,
            router
        })
        wrapper.vm.test();
        wrapper.vm.$nextTick();
        const mockData = {
            "apiKey" : "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC"
        }
        mock.onPost(ADMIN_URLS.TEST_API_KEY()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.find(".isTested").exists()).toBe(false);
        expect(wrapper.find(".isIntegrationDisable").exists()).toBe(false);
    })

    it('update kapture api', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: createTicketApi }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(createTicketApi, {
            localVue,
            router
        })

        wrapper.vm.integrate();
        wrapper.vm.$nextTick();

        const mockData = {
            "create_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
                "base_url": "https://kapture-default.com/"
        }
        const kapture = "1123qwe"
        if(kapture){
            mock.onPut(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
            await new Promise(resolve => setTimeout(resolve, 10)); 
        }
        mock.onPost(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.find(".create_ticket_apikey").exists()).toBe(false);
        expect(wrapper.find(".base_url").exists()).toBe(false);
    })
})