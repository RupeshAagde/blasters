'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SmsTemplatesVariables from '../../../../../../pages/communication/sms/sms-template-variables.vue'
import CommsRoutes from '../../../../../../router/index';
import SmsTemplatesMock from './sms-templates.json';
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

const WebhookModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}

describe('Sms Template Variables', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/sms/templates/create');
        wrapper = shallowMount(SmsTemplatesVariables, {
            computed:{
                smsTemplateStore: ()=>{
                    return SmsTemplatesMock['sms-template-store']
                },
                smsTemplateToClone: ()=>{
                    return undefined
                },
                userData: ()=>{
                    return SmsTemplatesMock['user-data']
                },
            },
            localVue,
            router,
            stubs: {
                'nitrozen-dialog': WebhookModal
            }
        })
        mock.onGet(ADMIN_URLS.SMS_PROVIDER()).reply(200, SmsTemplatesMock['sms_providers']);
        mock.onGet(ADMIN_URLS.SMS_DEFAULT()).reply(200, SmsTemplatesMock['default_providers']);
        await flushPromises();
        
    });

    it('Component Render', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('is a vue edit', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
})