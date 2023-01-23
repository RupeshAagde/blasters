'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SmsTemplatesEdit from '../../../../../../pages/communication/sms/sms-template-edit.vue'
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
        router.push('/communication/sms/templates/edit/5ffc0c65686b12451bfde5ba');
        wrapper = shallowMount(SmsTemplatesEdit, {
            propsData: { 
                // isEditMode:true,
                isCloneMode:true,
                // templateId:'5ffc0c65686b12451bfde5ba'
             },
            computed:{
                smsTemplateStore: ()=>{
                    return SmsTemplatesMock['sms-template-store']
                },
                smsTemplateToClone: ()=>{
                    return SmsTemplatesMock['sms-template-to-clone']
                },
                appSubscriptions: ()=>{
                    return SmsTemplatesMock['app-subscription']
                },
            },
            localVue,
            router,
        })
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(200, {"success":true});
        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT_SUBSCRIPTION()).reply(200, SmsTemplatesMock['app-subscription']);
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

    it('remove link', async() => {
        wrapper.vm.saveForm();
        expect(wrapper.vm.data.template_id.showerror).toBe(false)
    })
})