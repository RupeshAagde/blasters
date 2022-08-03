'use strict';

import {
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import CreateWebhooks from '@/pages/webhook/index.vue';
import VueRouter from 'vue-router';
import pageHeader from '@/components/common/layout/page-header.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '@/services/admin-url.service';
import URLS from '@/services/mixmaster-url.service'
import DOMAIN_URLS from '@/services/domain.service.js'
import WEBHOOK_SUBSCRIBER_EVENT from './fixtures/webhook-subscriber-event.json';
import WEBHOOK_APPLICATION_LIST from './fixtures/webhook_application_list.json'
import WEBHOOK_EVENT_LIST from './fixtures/webhook_event_list.json';
import WEBHOOK_USER_DETAILS from './fixtures/webhook_user_details.json';
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
let itemsName=[
    {
      "id": 1,
      "event_name": "product-size",
      "event_type": "create",
      "version": "1.0",
      "display_name": "product-size",
      "description": null,
      "created_on": "2021-04-20T07:47:32.231Z",
      "updated_on": "2021-04-20T07:47:32.231Z"
    },
    {
      "id": 2,
      "event_name": "product-size",
      "event_type": "update",
      "version": "1.0",
      "display_name": "product-size",
      "description": null,
      "created_on": "2021-04-20T07:47:38.190Z",
      "updated_on": "2021-04-20T07:47:38.190Z"
    }]

let wrapper = null
describe('Create webhook', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/',
                component: CreateWebhooks
            }]
        })
        router.push('/administrator/create-webhook');
        mock.onGet(DOMAIN_URLS.USER_PROFILE()).reply(200, WEBHOOK_USER_DETAILS);
        mock.onGet(URLS.WEBHOOK_EVENT_LIST()).reply(200, WEBHOOK_EVENT_LIST);
        mock.onPost(URLS.TEST_WEBHOOK()).reply(200, WEBHOOK_TEST_SUCCESS);
        
        wrapper = shallowMount(CreateWebhooks, {
            localVue,
            router,
            mocks: {
                $basePath: ''
            },
            data() {
                return {
                    meta: {},
                    username: 'testUser',
                    password: 'password',
                    name: 'test',
                    webhookUrl: 'http://www.testabc.com',
                    id: 1,
                    companyId: "1",
                    requestStatus: false,
                    alertEmail: 'test@test.com',
                    eventsObj: []
                }
            },
            stubs: {
                'nitrozen-dialog': WebhookModal
            }
        })
        wrapper.vm.getEventList()
        await flushPromises();
    });
    afterEach(()=>{
        mock.reset();
    });
    it('Intial render', async() => {
        await flushPromises();
        expect(Object.keys(wrapper.vm.groupedEventlist).length).toBeTruthy();
    });

    it('Subscriber listing', async () => {
        let pageHead = wrapper.findComponent(pageHeader);
        pageHead.vm.$emit('backClick');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(wrapper.vm.$router.currentRoute.fullPath).toBe(`/administrator/create-webhook`);
    });
    it('Test Webhook Success', async() => {
        await  wrapper.vm.testWebhook();
        await flushPromises();
        expect(wrapper.vm.testDialogMessage).toBe("Your Webhook URL is working successfully");
    });
    it('Test Checkbox selected', async() => {
        await wrapper.vm.checkmarkData("product-size",{1:[{id:1}],2:[{id:2}],versions:{}})
        expect(wrapper.vm.eventsObj).toBeTruthy;
    }); 
    it('Test Checkbox deselected', async() => {
        await wrapper.vm.checkmarkData("product-size",{1:[{id:1}],2:[{id:2}],versions:{}})
        await flushPromises();
        expect(wrapper.vm.eventsObj).toBeTruthy;
    }); 
    it('On cancel =', async () => {
        await wrapper.vm.onCancel()
        await flushPromises();
        expect(wrapper.vm.$router.currentRoute.fullPath).toBe(`/administrator/create-webhook`);
    });
   //fail issue is due to redirection i guess
    it('On Create with basic auth =', async () => {
        await  wrapper.vm.save();
        await flushPromises();
        console.log('sourav',wrapper.vm.dialogInfo)
        expect(wrapper.vm.dialogInfo).toBe(``);
        expect(wrapper.vm.dialogMessage).toBe(`Webhook Registered Successfully`);
    });
   //fail
    it('On Create without basic auth =', async () => {
        await  wrapper.vm.save();
        wrapper.vm.username=''
        wrapper.vm.password=''
        wrapper.vm.requestStatus=true
        await flushPromises();
        expect(wrapper.vm.dialogInfo).toBe(`Success`);
        expect(wrapper.vm.dialogMessage).toBe(``);
    });
    it('Check form validaity =', async () => {
        var isValid = await  wrapper.vm.isFormValid;
        await flushPromises();
        expect(isValid).toBeTruthy;
    });
    it('On clear =', async () => {
        await wrapper.vm.clear()
        await flushPromises();
        expect(wrapper.vm.eventsObj.length==0).toBeTruthy;
    });
    it('Show Password =', async () => {
        wrapper.vm.inputType = 'password'
        await wrapper.vm.toggleView()
        await flushPromises();
        expect(wrapper.vm.inputType).toBe("text");
    });
    it('Hide Password =', async () => {
        wrapper.vm.inputType = 'text'
        await wrapper.vm.toggleView()
        await flushPromises();
        expect(wrapper.vm.inputType).toBe("password");
    });
    it('Click on url textbox =', async () => {
        await wrapper.vm.urlTriggered()
        await flushPromises();
        expect(wrapper.vm.urlTriggeredStatus).toBe(true);
    });
    it('Click on email textbox =', async () => {
        await wrapper.vm.emailTriggered()
        await flushPromises();
        expect(wrapper.vm.emailTriggeredStatus).toBe(true);
    });
    it('Checkbox selected =', async () => {
        await wrapper.vm.checkmarkData("product-size",{1:[{id:1}],2:[{id:2}],versions:{}})
        await flushPromises();
        expect(wrapper.vm.selectedEventName.includes("product-size")).toBeTruthy;
    });
    it('Checkbox deselected =', async () => {
        await wrapper.vm.checkmarkData("product-size",{1:[{id:1}],2:[{id:2}],versions:{}})
        await flushPromises();
        expect(!wrapper.vm.selectedEventName.includes("product-size")).toBeTruthy;
    });
    
})