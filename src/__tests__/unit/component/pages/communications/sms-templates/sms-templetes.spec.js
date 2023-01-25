'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SmsTemplates from '../../../../../../pages/communication/sms/sms-templates.vue'
import CommsRoutes from '../../../../../../router/index';
import SmsTemplatesMock from './sms-templates.json';
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Sms Template Variables', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/sms/templates/listing?limit=10&current=1');
        wrapper = shallowMount(SmsTemplates, {
            computed:{
                appSubscriptions: ()=>{
                    return SmsTemplatesMock['app-subscription']
                },
                systemEvents: ()=>{
                    return SmsTemplatesMock['system-events']
                },
                helpData: ()=>{
                    return SmsTemplatesMock['help-data']
                },
                smsTemplatesStore: ()=>{
                    return SmsTemplatesMock['sms-templates-store']
                },
            },
            localVue,
            router,
        })

        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT()).reply(200, SmsTemplatesMock['comms-events-order']);
        mock.onGet(ADMIN_URLS.COMMUNICATION_SYSTEM_EVENTS()).reply(200, SmsTemplatesMock['system-events-response']);
        await flushPromises();
    });

    it('snapshot', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    
    it('is a vue edit', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('data render', async() => {
        expect(wrapper.vm.ORDER).not.toBe(null)
    })

    it('urlify function', async() => {
        wrapper.vm.onCreateModalSelect(1,SmsTemplatesMock['selected-template']);
        expect(wrapper.vm.messagePreview).not.toBe('')
        wrapper.vm.onCreateModalProceedClick(1,SmsTemplatesMock['selected-template']);
        console.log(wrapper.vm.$route.path)
        wrapper.vm.onSearchInputChange({target:{value:"Create New"}});
        expect(wrapper.vm.systemEventsFiltered.length).toBe(1)
    })
})