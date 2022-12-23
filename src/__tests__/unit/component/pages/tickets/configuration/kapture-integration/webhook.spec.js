'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import webhook from '@/pages/tickets/configuration/kapture-integration/webhook.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('webhook Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders webhook page', () => {
        const wrapper = shallowMount(webhook)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('copiedWebhookUrl', () => {
        const wrapper = shallowMount(webhook)
        wrapper.vm.copiedWebhookUrl();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".webhookUrl").exists()).toBe(false);
    })

    it('copiedWebhookApiKey', () => {
        const wrapper = shallowMount(webhook)
        wrapper.vm.copiedWebhookApiKey();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".webhookApikey").exists()).toBe(false);
    })

    it('learnWebhook', () => {
        const wrapper = shallowMount(webhook)
        wrapper.vm.copiedWebhookApiKey();
        wrapper.vm.$nextTick();
        // expect(wrapper.find(".webhookApikey").exists()).toBe(false);
    })

    it('webhook api', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: webhook }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(webhook, {
            localVue,
            router
        })

        wrapper.vm.integrate();
        wrapper.vm.$nextTick();
        const mockData = {
            "items": {
                "_id": "6332e00cb020479cd0283edc",
                "integration_type": "kapture",
                "base_url": "https://kapture-default.com/",
                "create_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
                "webhook_url": "https://kapture.com/",
                "webhook_apikey": "ac883892-15a2-463c-92db-210fc2cb36cc",
                "config_completed": true,
                "__v": 0,
                "category_data": {
                    "list": [
                        {
                            "display": "Category 1",
                            "key": "Category 1",
                            "sub_categories": [
                                {
                                    "display": "Category 1-1",
                                    "key": "Category 1",
                                    "sub_categories": [
                                        {
                                            "display": "Category 2 -1",
                                            "key": "Category 1",
                                            "sub_categories": [],
                                            "group_id": "1"
                                        },
                                        {
                                            "display": "Category 2 - 2",
                                            "key": "Category 1",
                                            "sub_categories": [],
                                            "group_id": "1"
                                        }
                                    ],
                                    "group_id": "1"
                                },
                                {
                                    "display": "Category 1-2",
                                    "key": "Category 1",
                                    "sub_categories": [
                                        {
                                            "display": "Category 2 -1",
                                            "key": "Category 1",
                                            "sub_categories": [],
                                            "group_id": "1"
                                        }
                                    ],
                                    "group_id": "1"
                                },
                                {
                                    "display": "Category 1-3",
                                    "key": "Category 1",
                                    "sub_categories": [],
                                    "group_id": "1"
                                }
                            ],
                            "group_id": "1"
                        }
                    ]
                },
                "category_sync_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
                "update_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC"
            }
        }
        mock.onPut(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        // expect(wrapper.find(".update_ticket_apikey").exists()).toBe(false);
    })
})