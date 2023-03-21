'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import EmailTemplates from 'from ../../../../../../pages/communication/email/email-templates.vue'
import CommsRoutes from '../../../../../../router/index';
import EmailTemplatesMock from './email-templates.json';
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
        router.push('/communication/email/templates/listing?limit=10&current=1');
        wrapper = shallowMount(EmailTemplates, {
            computed:{
                appSubscriptions: ()=>{
                    return EmailTemplatesMock['appSubscriptions']
                },
                systemEvents: ()=>{
                    return EmailTemplatesMock['systemEvents']
                },
                helpData: ()=>{
                    return EmailTemplatesMock['helpData']
                },
                emailTemplatesStore: ()=>{
                    return EmailTemplatesMock['emailTemplatesStore']
                },
            },
            localVue,
            router,
        })

        mock.onGet(ADMIN_URLS.COMMUNICATION_EVENT()).reply(200, EmailTemplatesMock['comms_events_order']);
        mock.onGet(ADMIN_URLS.COMMUNICATION_SYSTEM_EVENTS()).reply(200, EmailTemplatesMock['system_events_response']);
        await flushPromises();
    });
    
    it('listing', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a vue edit', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('is modal search', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const input = wrapper.find('.modal-search');
        wrapper.vm.onSearchInputChange({target:{value:'Create New'}})
        expect(wrapper.vm.systemEventsFiltered.length).toBe(1)
    })

    // it('data render', async() => {
    //     expect(wrapper.vm.ORDER).not.toBe(null)
    // })

    // it('urlify function', async() => {
    //     wrapper.vm.onCreateModalSelect(1,EmailTemplatesMock['selected-template']);
    //     expect(wrapper.vm.messagePreview).not.toBe('')
    //     wrapper.vm.onCreateModalProceedClick(1,EmailTemplatesMock['selected-template']);
    //     console.log(wrapper.vm.$route.path)
    //     wrapper.vm.onSearchInputChange({target:{value:"Create New"}});
    //     expect(wrapper.vm.systemEventsFiltered.length).toBe(1)
    // })
})