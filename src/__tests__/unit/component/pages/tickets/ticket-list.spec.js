'use strict';
import { mount, createLocalVue } from '@vue/test-utils';
import TicketListingPage from '@/pages/tickets/ticket-list.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/domain.service';
import { Promise } from 'window-or-global';
import mockData from './mock/ticket-list-mock.json';

var localVue;

const mock = new MockAdapter(axios);

describe('Application ticket List', () => {

    beforeEach(() => {
        // MOCK LOCAL VUE STORE
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    });

    it('Render the Support ticket list', async () => {
        const router = new VueRouter({routes: [
            { 
                path: '/administrator/support', 
                component: TicketListingPage
            }
        ]})
        router.push(`/administrator/support`);
        mock.onGet(ADMIN_URLS.FETCH_TICKETS()).reply(200, mockData);
        const wrapper = mount(TicketListingPage, {
            localVue,
            router,
        })
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.initial_data.length).toBe(10);
    });  
})