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
        router.push('/communication/sms/templates/edit/5ffc0c65686b12451bfde5ba');
        wrapper = shallowMount(SmsTemplatesVariables, {
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
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(200, {"success":true});
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

    it('is a send sms', async() => {
        let obj = {
            name:"test",
            last:""
        }
        wrapper.vm.selectedProvider.value=SmsTemplatesMock['sms_providers'].items[0]._id;
        wrapper.vm.testSms.phone_number.value=SmsTemplatesMock['user-data'].user.phone_numbers[0].phone
        wrapper.vm.removeEmptyFields(obj);
        wrapper.vm.openSendTestSmsModal()
        wrapper.vm.sendSms();
        await flushPromises()
        expect(wrapper.vm.smsSuccessfullySent).toBeTruthy();
    })

    it('is a send sms fail', async() => {
        wrapper.vm.testSms.phone_number=false;
        wrapper.vm.selectedProvider.value=SmsTemplatesMock['sms_providers'].items[0]._id;
        wrapper.vm.$nextTick();
        wrapper.vm.sendSms();
        expect(wrapper.vm.testSms.phone_number.showerror).toBeTruthy();
    })

    // it('Load sms templates', async () => {
    //     await new Promise(resolve => setTimeout(resolve, 10));
    //     wrapper.vm.$nextTick();
    //     expect(wrapper.vm.smsTemplates.length).toBe(SmsTemplatesMock.listing.docs.length)
    // });
})