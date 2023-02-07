'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import index from '@/pages/tickets/configuration/fynd-platform-integration/index.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('index Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders Integration page', () => {
        const wrapper = shallowMount(index)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    // it('Get freshdesk Details', async () => {
    //     const router = new VueRouter({
    //         routes: [
    //             { path: '/administrator/support/configuration/fynd-platform-integration/index', component: index }
    //         ]
    //     })
    //     router.push('/administrator/support/configuration/fynd-platform-integration/index');
    //     const wrapper = mount(index, {
    //         localVue,
    //         router
    //     })
    //     const mockData = {
    //         "items": {
    //             "_id": "6332e00cb020479cd0283edc",
    //             "integration_type": "fynd-platform",
    //             // "base_url": "https://freshdesk-default.com/",
    //             // "create_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
    //             // "webhook_url": "https://freshdesk.com/",
    //             // "webhook_apikey": "ac883892-15a2-463c-92db-210fc2cb36cc",
    //             "config_completed": true,
    //             "__v": 0,
    //             "category_data": {
    //                 "list": [
    //                     {
    //                         "display": "Category 1",
    //                         "key": "Category 1",
    //                         "sub_categories": [
    //                             {
    //                                 "display": "Category 1-1",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [
    //                                     {
    //                                         "display": "Category 2 -1",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     },
    //                                     {
    //                                         "display": "Category 2 - 2",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     }
    //                                 ],
    //                                 "group_id": "1"
    //                             },
    //                             {
    //                                 "display": "Category 1-2",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [
    //                                     {
    //                                         "display": "Category 2 -1",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     }
    //                                 ],
    //                                 "group_id": "1"
    //                             },
    //                             {
    //                                 "display": "Category 1-3",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [],
    //                                 "group_id": "1"
    //                             }
    //                         ],
    //                         "group_id": "1"
    //                     }
    //                 ]
    //             },
    //             // "category_sync_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
    //             // "update_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC"
    //         }
    //     };
    //     mock.onGet(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
    //     await new Promise(resolve => setTimeout(resolve, 10));
    //     wrapper.vm.save();
    // })

    // it('Save btn', async () => {
    //     const push = jest.fn();
    //     const router = new VueRouter({
    //         routes: [
    //             { path: '/administrator/support/configuration/fynd-platform-integration/index', component: index }
    //         ]
    //     })
    //     router.push('/administrator/support/configuration');
    //     const wrapper = mount(index, {
    //         localVue,
    //         router
    //     })

    //     wrapper.vm.save();
    //     wrapper.vm.$nextTick();
    //     const mockData = {
    //         "items": {
    //             "_id": "6332e00cb020479cd0283edc",
    //             "integration_type": "kapture",
    //             "config_completed": true,
    //             "__v": 0,
    //             "category_data": {
    //                 "list": [
    //                     {
    //                         "display": "Category 1",
    //                         "key": "Category 1",
    //                         "sub_categories": [
    //                             {
    //                                 "display": "Category 1-1",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [
    //                                     {
    //                                         "display": "Category 2 -1",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     },
    //                                     {
    //                                         "display": "Category 2 - 2",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     }
    //                                 ],
    //                                 "group_id": "1"
    //                             },
    //                             {
    //                                 "display": "Category 1-2",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [
    //                                     {
    //                                         "display": "Category 2 -1",
    //                                         "key": "Category 1",
    //                                         "sub_categories": [],
    //                                         "group_id": "1"
    //                                     }
    //                                 ],
    //                                 "group_id": "1"
    //                             },
    //                             {
    //                                 "display": "Category 1-3",
    //                                 "key": "Category 1",
    //                                 "sub_categories": [],
    //                                 "group_id": "1"
    //                             }
    //                         ],
    //                         "group_id": "1"
    //                     }
    //                 ]
    //             },
    //             "allow_ticket_creation": true,
    //             "show_listing": false
    //         }
    //     };
    //     mock.onPut(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
    //     await new Promise(resolve => setTimeout(resolve, 10));
    //     await wrapper.vm.save();
    // })

    it('setAddTicketValue', () => {
        const wrapper = shallowMount(index)
        wrapper.vm.setAddTicketValue();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".allowToAddTickets").exists()).toBe(false);
    })

    it('setTicketListingValue', () => {
        const wrapper = shallowMount(index)
        wrapper.vm.setTicketListingValue();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".allowToShowListings").exists()).toBe(false);
    })

    it('switchComp', () => {
        const wrapper = shallowMount(index)
        wrapper.vm.switchComp();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".step").exists()).toBe(false);
    })

    it('setIntegration', () => {
        const wrapper = shallowMount(index)
        wrapper.vm.setIntegration();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".step").exists()).toBe(false);
    })

    it('completedStep', () => {
        const wrapper = shallowMount(index)
        wrapper.vm.completedStep();
        wrapper.vm.$nextTick();
    })
})