'use strict';

import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import ListWebhooks from '@/pages/webhook/list_webhooks.vue';
import VueRouter from 'vue-router';
import pageHeader from '@/components/common/layout/page-header.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/admin-url.service';
import URLS from '@/services/mixmaster-url.service'
import DOMAIN_URLS from '@/services/domain.service.js'
import WEBHOOK_SUBSCRIBERS_LIST from './fixtures/webhook_subscribers_list.json';
import WEBHOOK_EVENT_LIST from './fixtures/webhook_event_list.json';
import WEBHOOK_TEST_SUCCESS from './fixtures/webhook_test_success.json';
import WEBHOOK_UPDATE from './fixtures/webhook_update.json';
import flushPromises from "flush-promises";
import lodash from 'lodash'
global._ = lodash
let localVue, router;
const mock = new MockAdapter(axios);
const WebhookModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
let wrapper = null
describe('List webhook', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/',
                component: ListWebhooks
            }]
        })
        router.push('/administrator/webhook');
        mock.onGet(URLS.WEBHOOK_EVENT_LIST()).reply(200, WEBHOOK_EVENT_LIST);
        mock.onPost(URLS.TEST_WEBHOOK()).reply(200, WEBHOOK_TEST_SUCCESS);

        wrapper = shallowMount(ListWebhooks, {
            localVue,
            router,
            mocks: {
                $basePath: '/'
            },
            data() {
                return {
                    meta: {}
                }
            },
            stubs: {
                'nitrozen-dialog': WebhookModal
            }
        })
        wrapper.vm.getSubscriberList()
       
       
        await flushPromises();
    });
    afterEach(()=>{
        mock.reset();
    });
    it('Intial render', async() => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        // await flushPromises();
        // expect(Object.keys(wrapper.vm.subscriberList).length).toBeTruthy();
    });

    it('Subscriber listing', async () => {
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.$router.currentRoute.fullPath).toBe('/administrator/webhook');
    });
    it('Subscriber listing', async () => {
        var items =   {"event_configs": [{
            "id": 1,
            "event_name": "product-size",
            "event_type": "create",
            "version": "1.0",
            "display_name": "product-size",
            "description": null,
            "created_on": "2021-04-20T07:47:32.231Z"
          }]
        }
        await wrapper.vm.selectedEvent(items);
        await flushPromises();
        expect(wrapper.vm.selectedWebhookEvent>0).toBeTruthy;
    });
    it('On pagination change', async () => {
        await wrapper.vm.paginationChange({current:1, limit:10});
        await flushPromises();
        expect(wrapper.vm.pageObject.current).toBe(1);
    });
})