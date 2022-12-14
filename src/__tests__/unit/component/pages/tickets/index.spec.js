'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import index from '@/pages/tickets/index.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('index Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })
    it('renders index page', () => {
        const wrapper = shallowMount(index)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
    it('test config rendering after call', async () => {
        const router = new VueRouter({
            routes: [
                { path: 'support/ticket-listing', component: index }
            ]
        })
        router.push('support/ticket-listing');
        const wrapper = mount(index, {
            localVue,
            router
        })
        const mockData = { "support_email": { "value": "sat@xyz.com", "description": "Short description", "enabled": true }, "support_phone": { "value": "9999999999", "description": "Short description", "enabled": false }, "support_faq": { "value": "https://xyz.com", "description": "Short description", "enabled": true }, "show_communication_info": false, "show_support_dris": false, "integration": { "enabled": true }, "available_integration": [] };
        mock.onGet(ADMIN_URLS.GET_GENERAL_CONGIF()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        // expect(wrapper.find(".support-communication").exists()).toBe(true);
    })
})