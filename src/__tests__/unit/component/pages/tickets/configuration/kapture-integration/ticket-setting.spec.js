'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import ticketSetting from '@/pages/tickets/configuration/kapture-integration/ticket-setting.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('ticketSetting Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders ticketSetting page', () => {
        const wrapper = shallowMount(ticketSetting)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('setAddTicket', () => {
        const wrapper = shallowMount(ticketSetting)
        wrapper.vm.setAddTicket();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".webhookUrl").exists()).toBe(false);
    })

    it('setTicketListing', () => {
        const wrapper = shallowMount(ticketSetting)
        wrapper.vm.setTicketListing();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".webhookApikey").exists()).toBe(false);
    })
})