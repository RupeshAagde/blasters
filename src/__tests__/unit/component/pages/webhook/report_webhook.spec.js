'use strict';

import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import ReportWebhooks from '@/pages/webhook/webhook_report.vue';
import VueRouter from 'vue-router';
import pageHeader from '@/components/common/layout/page-header.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/admin-url.service';
import URLS from '@/services/mixmaster-url.service'
import DOMAIN_URLS from '@/services/domain.service.js'
import WEBHOOK_FILTER_LIST from './fixtures/webhook_filter_list.json';
import WEBHOOK_REPORT from './fixtures/webhook_report.json';
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
describe('Webhook Report', () => {
    beforeAll(async () => {
        console.log('testtt')
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        console.log('testtt')
        router = new VueRouter({
            routes: [{
                path: '/',
                component: ReportWebhooks
            }]
        })
        router.push('/administrator/webhook-report');
        mock.onGet(URLS.GET_FILTER_LIST()).reply(200, WEBHOOK_FILTER_LIST);
        mock.onGet(URLS.GET_WEBHOOK_REPORT()).reply(200, WEBHOOK_REPORT);
        console.log('chlla',WEBHOOK_REPORT);
        wrapper = shallowMount(ReportWebhooks, {
            localVue,
            router,
            mocks: {
                $basePath: '/'
            },
            data() {
                return {
                    meta: {},
                    pageObject: {current:1,limit:10},
                    query_param:{}                    
                }
            },
            stubs: {
                'nitrozen-dialog': WebhookModal
            }
        })       
       
        await flushPromises();
    });
    afterEach(()=>{
        mock.reset();
    });
    it('Show payload in dialog', async () => {
        await wrapper.vm.showPayload({key:"value",event:{id:"test_id"}},"test_url.com","test_event");
        await flushPromises();
        expect(wrapper.vm.dialogInfo).toBe(`Payload`);
    });
    it('On search filter', async () => {
        await wrapper.vm.webhookInput({search:"megatron.4acad1ed-e927-4127-b101-ccfb1f601e0f"});
        await flushPromises();
        console.log('bhai dekh',wrapper.vm.webhookReport)
        expect(wrapper.vm.webhookReport.length).toBe(2);
    });
    it('On event dropdown filter', async () => {
        wrapper.vm.filtersToshow["Events"]=["company.update"]
        await wrapper.vm.filterInputChange("Events");
        await flushPromises();
        expect(wrapper.vm.webhookReport.length).toBe(2);
    });
    it('On Date change', async () => {
        await wrapper.vm.dateRangeChange();
        await flushPromises();
        expect(wrapper.vm.webhookReport.length).toBe(2);
    });
    it('Get report data', async () => {
        var query_param={
            page_no: 1,
            page_size: 10,
            start_date: "2022-07-01T16:20:18",
            end_date: "2022-07-08T16:20:18"
        }
        await wrapper.vm.search(query_param);
        await flushPromises();
        expect(wrapper.vm.webhookReport.length).toBe(2);
    });
    it('Sort Record Test', async () => {
        var query_param={
            page_no: 1,
            page_size: 10,
            start_date: "2022-07-01T16:20:18",
            end_date: "2022-07-08T16:20:18"
        }
        await wrapper.vm.search(query_param);
        await wrapper.vm.sortTable('processed_time_in_millis');
        await flushPromises();
        expect(wrapper.vm.webhookReport[0].processed_time_in_millis).toBe(71);
    });
    
    
})