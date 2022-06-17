// 'use strict';

import {
    mount,
    createLocalVue
} from "@vue/test-utils";
import EventSubscription from '../../../../../pages/communication/event_subscription.vue'
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import ADMIN_URLS from '../../../../../services/domain.service';
import EventSubscriptionMock from './fixtures/event_subscription.json'
import flushPromises from "flush-promises";

const mock = new MockAdapter(axios);
let localVue = createLocalVue()
localVue.use(VueRouter)
let wrapper, router



describe('Mounted events', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/events',
                component: EventSubscription
            }]
        })
        router.push('/administrator/communication/events?activeTab=0');
        wrapper = mount( EventSubscription , {
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT_SUBSCRIPTION()).reply(200, EventSubscriptionMock.event_subscription);
        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT()).reply(200, EventSubscriptionMock.events_order );
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(200, EventSubscriptionMock.email_templates);
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_S_TEMPLATES()).reply(200, EventSubscriptionMock.system_email_templates);
        mock.onGet(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES()).reply(200, EventSubscriptionMock.sms_templates);
        mock.onGet(ADMIN_URLS.COMMUNICATION_SMS_S_TEMPLATES()).reply(200, EventSubscriptionMock.system_sms_templates);
        await flushPromises();

       
        
    });
    it('exists wrapper and div', async () => {
        
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
        // wrapper.vm.dropdownSearchInputChange();
        
    })
   
   

    

})