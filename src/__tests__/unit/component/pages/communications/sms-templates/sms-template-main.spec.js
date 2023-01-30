'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import SmsTemplatesMain from '../../../../../../pages/communication/sms/sms-template-form.vue'
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
        router.push('/communication/sms/templates/create?clone=5e565a11343582051d211d22');
        wrapper = shallowMount(SmsTemplatesMain, {
            computed:{
                smsTemplateStore: ()=>{
                    return SmsTemplatesMock['ADMIN_COMMS_GET_SMS_TEMPLATE']
                },
                smsTemplateToClone: ()=>{
                    return SmsTemplatesMock['ADMIN_COMMS_GET_SMS_TEMPLATE_TO_CLONE']
                },
            },
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES('5e565a11343582051d211d22')).reply(200, SmsTemplatesMock['templates-clone']);
        mock.onPut(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES('5e565a11343582051d211d22')).reply(200, SmsTemplatesMock['templates-clone']);
        mock.onPost(ADMIN_URLS.COMMUNICATION_SMS_TEMPLATES()).reply(200, SmsTemplatesMock['create-sms-template-response']);
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

    it('is a vue instance', async() => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        wrapper.vm.saveForm();
        wrapper.vm.onOpenHelp();
        wrapper.vm.deleteTemplate()
        // wrapper.vm.saveAndPublish();
        await flushPromises();

        expect(snackbar).toHaveBeenCalled();

    })
})