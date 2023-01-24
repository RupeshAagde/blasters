'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import EmailTemplatesMain from '../../../../../../pages/communication/email/email-template-form.vue'
import CommsRoutes from '../../../../../../router/index';
import EmailTemplatesMock from './email-templates.json'
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

const emailtemplatesidebar = {
    render: () => {},
    methods: {
        validate: () => {
            return true
        },
        saveForm: () => {
            return EmailTemplatesMock['email_template_to_clone']
        },
        validateAndSave: () => {
            return EmailTemplatesMock['email_template_to_clone']
        }
    },
}

const emailtemplatemainbody = {
    render: () => {},
    methods: {
        validate: () => {
            return true
        },
        saveForm: () => {
            return EmailTemplatesMock['email_template_to_clone']
        },
        openSendTestEmailModal : () => {

        },
        validateAndSave: () => {
            return EmailTemplatesMock['email_template_to_clone']
        }
    },
}

describe('Email Template Variables', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/communication/email/templates/create?clone=5e5653c1d503e0038407fc17');
        wrapper = shallowMount(EmailTemplatesMain, {
            stubs:{
                emailtemplatesidebar,
                emailtemplatemainbody
            },
            computed:{
                emailTemplateStore: ()=>{
                    return {}
                },
                emailTemplateToClone: ()=>{
                    return EmailTemplatesMock['email_template_to_clone']
                },
            },
            localVue,
            router,
        })
        mock.onGet(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('5e5653c1d503e0038407fc17')).reply(200, EmailTemplatesMock['email_template_to_clone']);
        mock.onPut(ADMIN_URLS.COMMUNICATION_EMAIL_TEMPLATES('5e5653c1d503e0038407fc17')).reply(200, EmailTemplatesMock['email_template_to_clone']);
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

    it('save form', async() => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        wrapper.vm.saveForm();
        await flushPromises();
        expect(snackbar).toHaveBeenCalled();

    })

    it('Edit', async() => {
        wrapper.vm.templateId='5e5653c1d503e0038407fc17';
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        wrapper.vm.saveForm();
        await flushPromises();
        expect(snackbar).toHaveBeenCalled();
    })

    // it('delete template', async() => {
    //     let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //     wrapper.vm.deleteTemplate()
    //     await flushPromises();
    //     expect(snackbar).toHaveBeenCalled();
    // })

    it('send test and savepublish', async() => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        wrapper.vm.sendTestEmail();
        wrapper.vm.saveAndPublish();
        wrapper.vm.cloneTemplate();
        await flushPromises();
        expect(snackbar).toHaveBeenCalled();

    })
})