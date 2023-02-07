'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import categoryMapping from '@/pages/tickets/configuration/kapture-integration/category-mapping.vue';
import ADMIN_URLS from '@/services/domain.service';

let localVue;
const mock = new MockAdapter(axios);
describe('categoryMapping Page', () => {

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
    })

    it('renders categoryMapping api page', () => {
        const wrapper = shallowMount(categoryMapping)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('reconfigure', () => {
        const wrapper = shallowMount(categoryMapping)
        wrapper.vm.reconfigure();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".warningPopUp").exists()).toBe(false);
    })

    it('confirmPopup', () => {
        const wrapper = shallowMount(categoryMapping)
        wrapper.vm.confirmPopUp();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".warningPopUp").exists()).toBe(false);
        expect(wrapper.find(".isReconfigure").exists()).toBe(false);
        expect(wrapper.find(".isTested").exists()).toBe(false);
        expect(wrapper.find(".isIntegrated").exists()).toBe(false);
    })

    it('categories', () => {
        const wrapper = shallowMount(categoryMapping)
        wrapper.vm.categories();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".isCategoryMappingSync").exists()).toBe(false);
    })

    it('closeSyncCategory', () => {
        const wrapper = shallowMount(categoryMapping)
        wrapper.vm.closeSyncCategory();
        wrapper.vm.$nextTick();
        expect(wrapper.find(".isCategoryMappingSync").exists()).toBe(false);
        expect(wrapper.find(".isIntegrationDisable").exists()).toBe(false);
    })
    it('category mapping api', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: categoryMapping }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(categoryMapping, {
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

    it('category mapping api', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: categoryMapping }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(categoryMapping, {
            localVue,
            router
        })

        // wrapper.vm.getKaptureDetails();
        // wrapper.vm.$nextTick();
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
                "update_ticket_apikey": "eyJpdiI6IlQzXC92djZDYmxRRGN6MGNselVlNTBBPT0iLC",
                "allow_ticket_creation": true,
                "show_listing":true
            }
        }
        mock.onGet(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        // expect(wrapper.find(".update_ticket_apikey").exists()).toBe(false);
    })

    it('catgory sync api', async () => {
        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/kapture-integration/index', component: categoryMapping }
            ]
        })
        router.push('/administrator/support/configuration/kapture-integration/index');
        const wrapper = mount(categoryMapping, {
            localVue,
            router
        })

        wrapper.vm.sync();
        wrapper.vm.$nextTick();
        const mockData  = {
            "items": [
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
                },
                {
                    "display": "Category 2",
                    "key": "Category 2",
                    "sub_categories": [
                        {
                            "display": "Category 2-1",
                            "key": "Category 2",
                            "sub_categories": [
                                {
                                    "display": "Category 2-2",
                                    "key": "Category 2",
                                    "sub_categories": [],
                                    "group_id": "1"
                                }
                            ],
                            "group_id": "1"
                        }
                    ],
                    "group_id": "1"
                },
                {
                    "display": "Category 3",
                    "key": "Category 3",
                    "sub_categories": [
                        {
                            "display": "Category 3-1",
                            "key": "Category 3",
                            "sub_categories": [
                                {
                                    "display": "Category 3-2",
                                    "key": "Category 3",
                                    "sub_categories": [],
                                    "group_id": "1"
                                }
                            ],
                            "group_id": "1"
                        }
                    ],
                    "group_id": "1"
                },
                {
                    "display": "Category 4",
                    "key": "Category 4",
                    "sub_categories": [
                        {
                            "display": "Category 4-1",
                            "key": "Category 4",
                            "sub_categories": [],
                            "group_id": "1"
                        }
                    ],
                    "group_id": "1"
                }
            ]
        }
        mock.onGet(ADMIN_URLS.INTEGRATION_DETAILS()).reply(200, mockData);
        await new Promise(resolve => setTimeout(resolve, 10));
        // expect(wrapper.find(".update_ticket_apikey").exists()).toBe(false);
        expect(wrapper.find(".showStatus").exists()).toBe(false);
        expect(wrapper.find(".isIntegrationDisable").exists()).toBe(false);
    })
})