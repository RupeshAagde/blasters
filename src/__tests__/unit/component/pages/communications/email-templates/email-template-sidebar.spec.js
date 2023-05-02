'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import EmailTemplatesSidebar from '../../../../../../pages/communication/email/email-template-sidebar.vue'
import CommsRoutes from '../../../../../../router/index';
import EmailTemplatesMock from './email-templates.json'
import cloneDeep from 'lodash/cloneDeep';
import { wrap } from 'lodash';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Email Template Variables', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/email/templates/create?clone=5e5653c1d503e0038407fc17');
        wrapper = shallowMount(EmailTemplatesSidebar, {
            computed:{
                emailTemplateStore: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                emailTemplateToClone: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                userData: ()=>{
                    return EmailTemplatesMock['userData']
                },
                appSubscriptions: ()=>{
                    return EmailTemplatesMock['appSubscriptions']
                },
            },
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT_SUBSCRIPTION()).reply(200, EmailTemplatesMock['event_subscription']);
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('602d623aafc3c021fb99b7ed')).reply(200, EmailTemplatesMock['email_template_to_clone']);
        mock.onPut(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('602d623aafc3c021fb99b7ed')).reply(200, EmailTemplatesMock['email_template_to_clone']);
        mock.onPost(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES()).reply(200, EmailTemplatesMock['create_email_response']);
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



    it('is a clone mode', async() => {
        wrapper = shallowMount(EmailTemplatesSidebar, {
            propsData:{
                isCloneMode:true
            },
            computed:{
                emailTemplateStore: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                emailTemplateToClone: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
                userData: ()=>{
                    return EmailTemplatesMock['userData']
                },
                appSubscriptions: ()=>{
                    return EmailTemplatesMock['appSubscriptions']
                },
            },
            localVue,
            router,
        })

        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('is validate and save', async() => {
        let emitFun = jest.spyOn(wrapper.vm, '$emit');
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.emailTemplateStore = EmailTemplatesMock['email_template_to_clone']
        wrapper.vm.emailTemplateToClone = EmailTemplatesMock['email_template_to_clone']
        await flushPromises();
        await wrapper.vm.$nextTick();
        wrapper.vm.validateAndSave();
        expect(emitFun).toHaveBeenCalled();
    })

    it('delete header', async() => {
        wrapper.vm.deleteHeader(0);
        wrapper.vm.deleteHeader(2);
        expect(wrapper.vm.data.headers[0].value).toBe(null)
    })
})